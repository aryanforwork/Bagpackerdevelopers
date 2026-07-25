"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { LogOut, LayoutDashboard, Plus, Briefcase, ChevronRight, Activity, Database } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

export default function ClientDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/auth/sign-in");
        return;
      }
      setUser(currentUser);

      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("*, client_profiles(*)")
        .eq("id", currentUser.id)
        .single();
      setProfile(currentProfile);

      // Fetch recent 3 projects
      const { data: projs } = await supabase
        .from("projects")
        .select("*, assigned_developer:assigned_developer_id(full_name)")
        .eq("client_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(3);
      if (projs) {
        setRecentProjects(projs);
      }

      setLoading(false);
    }
    getSession();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA] min-h-screen text-xs text-zinc-400">
        Loading client telemetry console...
      </div>
    );
  }

  const activeProjectsCount = recentProjects.filter(p => p.status === "in_progress" || p.status === "assigned").length;
  const submittedProposalsCount = recentProjects.length;

  return (
    <div className="flex-1 bg-[#FAFAFA] text-zinc-950 p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-zinc-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#10B891]/10 rounded-lg text-[#10B891]">
                <LayoutDashboard size={16} />
              </span>
              <h1 className="text-xl font-bold tracking-tight">Client Console</h1>
            </div>
            <p className="text-xs text-zinc-400">Manage development squads and scoped integrations.</p>
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

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-2 p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex">
            <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-6 flex flex-col justify-between shadow-inner">
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-[#10B891] font-bold uppercase tracking-wider">Active Workspace</span>
                <h2 className="text-lg font-bold text-zinc-900">Welcome, {profile?.full_name}</h2>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
                  Track dynamic metrics, submit structural requests, and access technical specifications for your software pipelines.
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-100 mt-6 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-zinc-400 text-[10px] font-bold uppercase">Organization</span>
                  <p className="text-xs font-semibold text-zinc-800">{profile?.client_profiles?.organization_name || "Self"}</p>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] font-bold uppercase">Role</span>
                  <p className="text-xs font-semibold text-zinc-800">{profile?.client_profiles?.profession || "Client"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex flex-col justify-between gap-4">
            <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-6 flex-1 flex flex-col justify-between shadow-inner space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Total Scopes</span>
                <Database size={16} className="text-zinc-300" />
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-black text-zinc-950">{submittedProposalsCount}</span>
                <p className="text-[10px] text-zinc-400">Scoped project requests</p>
              </div>
            </div>
            <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-6 flex-1 flex flex-col justify-between shadow-inner space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Active Builds</span>
                <Activity size={16} className="text-[#10B891] animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-black text-zinc-950">{activeProjectsCount}</span>
                <p className="text-[10px] text-zinc-400">Assigned developer builds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel & Recent Projects */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Quick Actions */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Console Actions</h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/client/new-project"
                className="w-full py-3 bg-[#09090B] hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                Scope New Project
              </Link>
              <Link
                href="/dashboard/client/projects"
                className="w-full py-3 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Briefcase size={14} />
                View Scoped Projects
              </Link>
            </div>
          </div>

          {/* Recent projects list */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Recent Projects</h3>
              <Link href="/dashboard/client/projects" className="text-xs font-bold text-[#10B891] hover:underline flex items-center gap-0.5">
                View All <ChevronRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentProjects.length === 0 ? (
                <div className="p-8 text-center bg-white border border-zinc-200/60 rounded-2xl text-xs text-zinc-400">
                  No projects submitted yet. Click "Scope New Project" above to start.
                </div>
              ) : (
                recentProjects.map((proj) => (
                  <div key={proj.id} className="p-5 bg-white border border-zinc-200/60 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-zinc-900">{proj.project_name}</h4>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {Number(proj.estimated_budget).toLocaleString()} {proj.budget_currency} • {proj.field_of_work}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase ${
                      proj.status === "submitted" ? "bg-blue-50 border-blue-200 text-blue-600" :
                      proj.status === "in_review" ? "bg-amber-50 border-amber-200 text-amber-600" :
                      proj.status === "in_progress" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                      "bg-zinc-100 border-zinc-200 text-zinc-500"
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
