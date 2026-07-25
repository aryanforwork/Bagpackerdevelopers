"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Mail, KeyRound, User, Loader2, AlertCircle } from "lucide-react";

export default function JoinAsDeveloperPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?role=developer`,
        data: {
          role: "developer",
          full_name: fullName,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data?.session) {
      router.push("/dashboard/developer");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleGithubOAuth = async () => {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=developer`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] text-zinc-950 py-24 px-6">
        <div className="max-w-md w-full p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex">
          <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-8 shadow-inner space-y-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
              <Mail size={22} />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-zinc-900">Check Your Email</h1>
              <p className="text-xs text-zinc-500 leading-relaxed">
                We've sent a verification link to <span className="font-bold text-zinc-700">{email}</span>. Please confirm your email to activate your developer profile.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center justify-center w-full py-2.5 bg-[#09090B] text-white hover:bg-zinc-800 rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] text-zinc-950 py-24 px-6">
      <div className="max-w-md w-full p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex">
        <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-8 shadow-inner space-y-6">
          <div className="text-center space-y-2">
            <span className="font-extrabold text-lg text-zinc-900 tracking-tight">
              Bagpacker<span className="text-[#10B891] font-medium">developers</span>
            </span>
            <h1 className="text-xl font-bold text-zinc-800 tracking-tight">Join as Remote Developer</h1>
            <p className="text-xs text-zinc-400">Complete authentication to establish code telemetry integrations.</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* GitHub OAuth Button */}
          <button
            onClick={handleGithubOAuth}
            type="button"
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-zinc-800 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            Continue with GitHub
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute w-full border-t border-zinc-200" />
            <span className="relative px-3 bg-white text-[9px] font-bold uppercase tracking-wider text-zinc-400">
              Or Use Email
            </span>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E8823A] focus:ring-1 focus:ring-[#E8823A]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="email">
                Developer Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="jane.smith@nomad.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E8823A] focus:ring-1 focus:ring-[#E8823A]/20 transition-all"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E8823A] focus:ring-1 focus:ring-[#E8823A]/20 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="githubUrl">
                  GitHub Profile
                </label>
                <input
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E8823A] focus:ring-1 focus:ring-[#E8823A]/20 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="linkedinUrl">
                  LinkedIn Profile
                </label>
                <input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#E8823A] focus:ring-1 focus:ring-[#E8823A]/20 transition-all"
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
                  Joining Collective...
                </>
              ) : (
                "Join as Developer"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-zinc-400">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-[#10B891] hover:underline font-semibold">
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
