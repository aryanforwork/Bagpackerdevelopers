"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Briefcase, Mail, KeyRound, User, Loader2, AlertCircle } from "lucide-react";

export default function JoinAsClientPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [profession, setProfession] = useState("");
  const [fieldOfWork, setFieldOfWork] = useState("");

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
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          role: "client",
          full_name: fullName,
          organization_name: orgName,
          profession,
          field_of_work: fieldOfWork,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data?.session) {
      // Auto logged in (email verification off)
      router.push("/dashboard/client");
    } else {
      // Email verification on
      setSuccess(true);
    }
    setLoading(false);
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
                We've sent a verification link to <span className="font-bold text-zinc-700">{email}</span>. Please confirm your email to activate your client account.
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
            <h1 className="text-xl font-bold text-zinc-800 tracking-tight">Register as Enterprise Client</h1>
            <p className="text-xs text-zinc-400">Establish your organizational credentials and begin scoping projects.</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] focus:ring-1 focus:ring-[#10B891]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="email">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="john@company.com"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="orgName">
                  Organization
                </label>
                <input
                  id="orgName"
                  type="text"
                  placeholder="Acme Corp"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] focus:ring-1 focus:ring-[#10B891]/20 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="profession">
                  Profession
                </label>
                <input
                  id="profession"
                  type="text"
                  placeholder="Director of Tech"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] focus:ring-1 focus:ring-[#10B891]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="fieldOfWork">
                Field of Work
              </label>
              <input
                id="fieldOfWork"
                type="text"
                placeholder="Logistics / AI Ingestion"
                value={fieldOfWork}
                onChange={(e) => setFieldOfWork(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] focus:ring-1 focus:ring-[#10B891]/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#09090B] text-white hover:bg-zinc-800 disabled:bg-zinc-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Registering...
                </>
              ) : (
                "Join as Client"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-zinc-400">
              Already have a profile?{" "}
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
