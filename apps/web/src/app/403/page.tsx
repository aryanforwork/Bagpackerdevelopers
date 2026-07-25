"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#FAFAFA] text-zinc-950 py-24 px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="text-red-500" size={28} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight">403: Forbidden</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your account role does not have authorization to access this dashboard. If you believe this is an error, please contact platform security.
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#10B891] hover:text-[#059669] transition-colors"
          >
            <ArrowLeft size={14} />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
