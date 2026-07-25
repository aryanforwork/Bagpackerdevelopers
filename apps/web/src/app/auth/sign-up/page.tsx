"use client";

import Link from "next/link";
import { User, Briefcase, ChevronRight } from "lucide-react";

export default function SignUpPortalPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] text-zinc-950 py-24 px-6">
      <div className="max-w-md w-full p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex">
        <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-8 shadow-inner space-y-6">
          <div className="text-center space-y-2">
            <span className="font-extrabold text-lg text-zinc-900 tracking-tight">
              Bagpacker<span className="text-[#10B891] font-medium">developers</span>
            </span>
            <h1 className="text-xl font-bold text-zinc-800 tracking-tight">Select Account Type</h1>
            <p className="text-xs text-zinc-400">Choose how you want to participate in our software ecosystem.</p>
          </div>

          <div className="space-y-4">
            {/* Join as Client Option */}
            <Link
              href="/join-as-client"
              className="flex items-center justify-between p-5 bg-zinc-50 border border-zinc-200 hover:border-[#10B891]/30 rounded-2xl group transition-all"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#10B891] shadow-inner shrink-0">
                  <Briefcase size={18} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-zinc-900">Enterprise Client</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed max-w-[200px]">
                    Deploy teams, track development metrics, and order custom software integrations.
                  </p>
                </div>
              </div>
              <ChevronRight className="text-zinc-300 group-hover:text-[#10B891] group-hover:translate-x-0.5 transition-all" size={16} />
            </Link>

            {/* Join as Developer Option */}
            <Link
              href="/join-as-developer"
              className="flex items-center justify-between p-5 bg-zinc-50 border border-zinc-200 hover:border-[#E8823A]/30 rounded-2xl group transition-all"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#E8823A] shadow-inner shrink-0">
                  <User size={18} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-zinc-900">Remote Developer</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed max-w-[200px]">
                    Verify profile, apply to projects, and contribute to enterprise pipelines.
                  </p>
                </div>
              </div>
              <ChevronRight className="text-zinc-300 group-hover:text-[#E8823A] group-hover:translate-x-0.5 transition-all" size={16} />
            </Link>
          </div>

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
