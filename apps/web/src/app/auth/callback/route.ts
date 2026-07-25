import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const role = searchParams.get("role") || "client";
  const next = searchParams.get("next") ?? `/dashboard/${role}`;

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      // Fetch profile to verify
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (!profile) {
        const fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.user_name || "Anonymous User";
        const avatarUrl = data.user.user_metadata?.avatar_url || "";
        
        // Force write profile (failsafe for db triggers)
        await supabase.from("profiles").insert({
          id: data.user.id,
          role: role as any,
          full_name: fullName,
          avatar_url: avatarUrl
        });

        if (role === "client") {
          await supabase.from("client_profiles").insert({
            profile_id: data.user.id
          });
        } else if (role === "developer") {
          await supabase.from("developer_profiles").insert({
            profile_id: data.user.id,
            github_url: data.user.user_metadata?.github_url || "",
            linkedin_url: data.user.user_metadata?.linkedin_url || ""
          });
        }
      } else if (searchParams.has("role")) {
        await supabase
          .from("profiles")
          .update({ role: role as any })
          .eq("id", data.user.id);
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/403`);
}
