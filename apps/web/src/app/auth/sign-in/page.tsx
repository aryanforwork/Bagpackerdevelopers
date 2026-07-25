"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { KeyRound, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data?.user) {
      // Query role to redirect properly
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const role = profile?.role;
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "developer") {
        router.push("/dashboard/developer");
      } else {
        router.push("/dashboard/client");
      }
      router.refresh();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] text-zinc-950 py-24 px-6">
      <div className="max-w-md w-full p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex">
        <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-8 shadow-inner space-y-6">
          <div className="text-center space-y-2">
            <span className="font-extrabold text-lg text-zinc-900 tracking-tight">
              Bagpacker<span className="text-[#10B891] font-medium">developers</span>
            </span>
            <h1 className="text-xl font-bold text-zinc-800 tracking-tight">Sign In to Platform</h1>
            <p className="text-xs text-zinc-400">Access your telemetry dashboard and workspace.</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] focus:ring-1 focus:ring-[#10B891]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] focus:ring-1 focus:ring-[#10B891]/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#09090B] text-white hover:bg-zinc-800 disabled:bg-zinc-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-zinc-400">
              Need a profile? Join as{" "}
              <Link href="/join-as-client" className="text-[#10B891] hover:underline font-semibold">
                Client
              </Link>{" "}
              or{" "}
              <Link href="/join-as-developer" className="text-[#E8823A] hover:underline font-semibold">
                Developer
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
