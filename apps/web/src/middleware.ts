import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// In-memory rate limit store for local development sessions
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute window
  const maxRequests = 15; // 15 requests per minute limit for Next.js endpoints

  const record = rateLimitCache.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitCache.set(ip, { count: 1, resetAt: now + limitWindow });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const path = request.nextUrl.pathname;

  // Rate limit /api/ routes
  if (path.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "Too Many Requests", message: "Rate limit exceeded. Maximum 15 requests per minute." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Check if Supabase env variables exist to prevent crashes during initial builds
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect dashboard routes
  if (path.startsWith("/dashboard")) {
    if (!user) {
      const redirectUrl = new URL("/auth/sign-in", request.url);
      redirectUrl.searchParams.set("redirectedFrom", path);
      return NextResponse.redirect(redirectUrl);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    if (path.startsWith("/dashboard/client") && role !== "client") {
      return NextResponse.redirect(new URL("/403", request.url));
    }
    if (path.startsWith("/dashboard/developer") && role !== "developer") {
      return NextResponse.redirect(new URL("/403", request.url));
    }
    if (path.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
