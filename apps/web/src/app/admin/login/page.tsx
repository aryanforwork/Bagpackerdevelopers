"use client";

import { loginAction } from "@/app/actions";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldAlert, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError("");

    const result = await loginAction(token.trim());
    if (result.success && result.accessToken) {
      localStorage.setItem("admin_token", result.accessToken);
      router.push("/admin");
    } else {
      setError(result.error || "Authentication failed. The security gateway rejected the credentials.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#60A5FA]/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-1.5 bg-[#27272A]/30 border border-[#27272A]/50 rounded-[2.5rem] shadow-2xl relative"
      >
        <div className="bg-[#18181B] rounded-[calc(2.5rem-0.5rem)] p-8 border border-white/5 flex flex-col justify-between shadow-inner">
          <div className="flex flex-col items-center gap-4 text-center mb-8">
            <div className="p-3 bg-[#3B82F6]/10 border border-[#3B82F6]/25 rounded-2xl text-[#3B82F6] flex items-center justify-center">
              <Terminal size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Access Control Gate</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your secure administrative credentials to unlock control panels.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Administrative Security Token
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter admin token..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full h-12 bg-[#09090B] border border-[#27272A] hover:border-zinc-700 focus:border-[#3B82F6] placeholder-zinc-600 rounded-xl pl-10 pr-4 text-sm text-white focus:outline-none transition-all"
                />
                <KeyRound size={16} className="absolute left-3.5 top-4 text-zinc-500" />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-400"
              >
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {loading ? "Authenticating Session..." : "Authorize Access"}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#27272A] text-center text-[10px] text-zinc-500 font-mono">
            PLATFORM CLASS: CONFIGURATION MANAGEMENT MATRIX
          </div>
        </div>
      </motion.div>
    </div>
  );
}
