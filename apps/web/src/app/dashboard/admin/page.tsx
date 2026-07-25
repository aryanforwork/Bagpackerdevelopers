"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { fetchProjectsAdminStatsAction } from "@/app/actions";
import { LogOut, LayoutDashboard, Database, Settings, ShieldAlert, ArrowRight, ShieldCheck, Activity, Users } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    pendingDevelopers: 0,
    projectsInReview: 0,
    openProjects: 0,
    activeBuilds: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/auth/sign-in");
        return;
      }
      setUser(currentUser);

      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();
      setProfile(currentProfile);

      // Fetch dynamic stats from Spring Boot Proxy action
      const statsRes = await fetchProjectsAdminStatsAction();
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }

      setLoading(false);
    }
    loadDashboard();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA] min-h-screen text-xs text-zinc-400">
        Loading admin telemetry console...
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#FAFAFA] text-zinc-950 p-8 md:p-12 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-zinc-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-red-500/10 rounded-lg text-red-500">
                <LayoutDashboard size={16} />
              </span>
              <h1 className="text-xl font-bold tracking-tight">Admin Console</h1>
            </div>
            <p className="text-xs text-zinc-400">System metrics, user profile overrides, and compliance verification.</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-50 flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={12} />
              Sign Out
            </button>
          </div>
        </div>

        {/* System telemetry notifications */}
        {stats.pendingDevelopers > 0 && (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Pending Verifications</h4>
              <p className="text-xs text-amber-600 max-w-lg leading-relaxed">
                There are {stats.pendingDevelopers} pending developer credentials registrations awaiting verification audit.
              </p>
            </div>
            <Link
              href="/dashboard/admin/developers"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1"
            >
              Verify Queue
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-2 p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex">
            <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-6 flex flex-col justify-between shadow-inner">
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-red-500 font-bold uppercase tracking-wider">System Node Admin</span>
                <h2 className="text-base font-bold text-zinc-900">Welcome, {profile?.full_name}</h2>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
                  Access platform-wide project tracking feeds, verify candidate skills, and log transactions.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-100 mt-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase">System root active</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-zinc-200/60 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
              <span className="text-[9px] font-bold uppercase text-zinc-400 block">Pending Triage</span>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-zinc-950">{stats.projectsInReview}</div>
                <span className="text-[9px] text-zinc-400">Scopes in review</span>
              </div>
            </div>
            <div className="p-5 bg-white border border-zinc-200/60 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
              <span className="text-[9px] font-bold uppercase text-zinc-400 block">Open Bids</span>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-zinc-950">{stats.openProjects}</div>
                <span className="text-[9px] text-zinc-400">Proposals bidding active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Administration Actions Panel */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Administrative Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/dashboard/admin/projects"
              className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:border-[#10B891]/30 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-center text-[#10B891]">
                  <Database size={16} />
                </div>
                <h4 className="text-sm font-bold text-zinc-900">Scoping Registry</h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Triage submitted client project proposals, assign developers, and audit builds.
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#10B891] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 pt-4">
                Open Manager <ArrowRight size={10} />
              </span>
            </Link>

            <Link
              href="/dashboard/admin/developers"
              className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm hover:border-[#E8823A]/30 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-center text-[#E8823A]">
                  <Users size={16} />
                </div>
                <h4 className="text-sm font-bold text-zinc-900">Verification Queue</h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Verify developer qualifications, inspect professional credentials, and approve profiles.
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#E8823A] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 pt-4">
                Open Queue <ArrowRight size={10} />
              </span>
            </Link>

            <div
              className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm opacity-55 flex flex-col justify-between cursor-not-allowed"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-center text-red-500">
                  <ShieldAlert size={16} />
                </div>
                <h4 className="text-sm font-bold text-zinc-900">Compliance Audit Logs</h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Platform compliance log tracking. View audit logs for every system mutation. (Coming soon)
                </p>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 pt-4">Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
