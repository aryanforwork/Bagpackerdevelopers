"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { verifyDeveloperAction } from "@/app/actions";
import { ArrowLeft, UserCheck, ShieldAlert, Award, GraduationCap, Globe, AlertCircle, Loader2 } from "lucide-react";

export default function AdminDevelopersVerificationPage() {
  const supabase = createClient();

  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDevelopers() {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("profiles")
        .select("*, developer_profiles!inner(*)")
        .eq("role", "developer")
        .eq("developer_profiles.verification_status", tab);

      if (fetchErr) {
        setError(fetchErr.message);
      } else if (data) {
        setDevelopers(data);
      }
      setLoading(false);
    }
    loadDevelopers();
  }, [tab, supabase]);

  const handleVerify = async (devId: string, status: string) => {
    setActionLoadingId(devId);
    setError(null);

    const result = await verifyDeveloperAction(devId, status);

    if (!result.success) {
      setError(result.error || "Failed to update verification status.");
      setActionLoadingId(null);
      return;
    }

    // Remove approved/rejected dev from the current tab list view
    setDevelopers((prev) => prev.filter((d) => d.id !== devId));
    setActionLoadingId(null);
  };

  return (
    <div className="flex-1 bg-[#FAFAFA] text-zinc-950 p-8 md:p-12 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div>
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Console
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">Developer Verification Queue</h1>
          <p className="text-xs text-zinc-400">Audit submitted candidate credentials, verify qualifications, and enable public visibility directory listings.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex gap-2 border-b border-zinc-200 pb-px">
          {["pending", "verified", "rejected"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                tab === t ? "border-[#10B891] text-[#10B891]" : "border-transparent text-zinc-400 hover:text-zinc-700"
              }`}
            >
              {t} Nodes
            </button>
          ))}
        </div>

        {/* Developers Table */}
        <div className="p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex">
          <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] overflow-hidden shadow-inner">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 w-full bg-zinc-100 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : developers.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
                  <UserCheck size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-zinc-900 text-sm">No Developers Listed</h3>
                  <p className="text-xs text-zinc-400">No collective developer profiles found under the "{tab}" verification tier.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/50 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="p-4 pl-6">Developer Node</th>
                      <th className="p-4">Qualification</th>
                      <th className="p-4">Stack Experience</th>
                      <th className="p-4">Links</th>
                      <th className="p-4 pr-6 text-right">Verification Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {developers.map((dev) => {
                      const devProfile = dev.developer_profiles;
                      return (
                        <tr key={dev.id} className="hover:bg-zinc-50/30 transition-colors">
                          {/* Avatar & Name */}
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              {dev.avatar_url ? (
                                <img src={dev.avatar_url} alt={dev.full_name} className="w-8 h-8 rounded-full object-cover border border-zinc-200" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400">
                                  {dev.full_name[0]}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-zinc-900 block">{dev.full_name}</span>
                                <span className="text-[10px] text-zinc-400 truncate max-w-[200px] block">{dev.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Qualification */}
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-zinc-500">
                              <GraduationCap size={14} className="text-zinc-400" />
                              <span>{devProfile.highest_qualification} • {devProfile.institution_name}</span>
                            </div>
                          </td>

                          {/* Experience */}
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-zinc-500 font-medium">
                              <Award size={14} className="text-zinc-400" />
                              <span>{devProfile.years_experience} Years Vetted</span>
                            </div>
                          </td>

                          {/* Social links */}
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              {devProfile.github_url && (
                                <a href={devProfile.github_url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-950">
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                </a>
                              )}
                              {devProfile.linkedin_url && (
                                <a href={devProfile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-950">
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                              )}
                              {devProfile.portfolio_url && (
                                <a href={devProfile.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-950">
                                  <Globe size={14} />
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Verification actions */}
                          <td className="p-4 pr-6 text-right">
                            {actionLoadingId === dev.id ? (
                              <div className="flex justify-end pr-8">
                                <Loader2 className="animate-spin text-zinc-400" size={16} />
                              </div>
                            ) : tab === "pending" ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleVerify(dev.id, "verified")}
                                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleVerify(dev.id, "rejected")}
                                  className="px-2.5 py-1 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg font-bold transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : tab === "verified" ? (
                              <button
                                onClick={() => handleVerify(dev.id, "rejected")}
                                className="px-2.5 py-1 border border-zinc-200 hover:bg-red-50 text-red-500 hover:border-red-200 rounded-lg font-semibold transition-all"
                              >
                                Revoke Approval
                              </button>
                            ) : (
                              <button
                                onClick={() => handleVerify(dev.id, "verified")}
                                className="px-2.5 py-1 border border-zinc-200 hover:bg-emerald-50 text-emerald-600 hover:border-emerald-250 rounded-lg font-semibold transition-all"
                              >
                                Approve Profile
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
