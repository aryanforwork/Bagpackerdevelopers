"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Terminal, Settings, ArrowRight, ShieldCheck, Database, FileText, X } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import ProjectCollaborationHub from "@/components/ProjectCollaborationHub";

export default function DeveloperDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [assignedProjects, setAssignedProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
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
        .select("*, developer_profiles(*)")
        .eq("id", currentUser.id)
        .single();
      setProfile(currentProfile);

      // Fetch assigned projects
      const { data: projs } = await supabase
        .from("projects")
        .select("*")
        .eq("assigned_developer_id", currentUser.id)
        .order("updated_at", { ascending: false });
      if (projs) {
        setAssignedProjects(projs);
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
        Loading developer telemetry console...
      </div>
    );
  }

  const hasCompletedOnboarding = profile?.developer_profiles?.github_url && profile?.developer_profiles?.bio;

  return (
    <div className="flex-1 bg-[#FAFAFA] text-zinc-950 p-8 md:p-12 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-zinc-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-[#E8823A]/10 rounded-lg text-[#E8823A]">
                <LayoutDashboard size={16} />
              </span>
              <h1 className="text-xl font-bold tracking-tight">Developer Collective Console</h1>
            </div>
            <p className="text-xs text-zinc-400">Track repository syncs and contribution allocations.</p>
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

        {/* Verification Alert */}
        {!hasCompletedOnboarding && (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Profile Incomplete</h4>
              <p className="text-xs text-amber-600 max-w-lg leading-relaxed">
                You must complete your developer credentials registration (Step 1–3) to join the public directory and bid on project scopes.
              </p>
            </div>
            <Link
              href="/dashboard/developer/onboarding"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1"
            >
              Onboard Now
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Console Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-2 p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex">
            <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-8 shadow-inner space-y-4">
              <div className="flex items-center gap-4">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-zinc-200" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400">
                    {profile?.full_name?.[0] || "?"}
                  </div>
                )}
                <div>
                  <h2 className="text-base font-bold text-zinc-900">Welcome, {profile?.full_name}</h2>
                  <p className="text-[10px] text-zinc-400 font-mono">Status: {profile?.developer_profiles?.verification_status || "Pending Setup"}</p>
                </div>
              </div>

              {hasCompletedOnboarding && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
                  <div className="text-xs text-zinc-600 space-y-1">
                    <div><span className="font-semibold text-zinc-800">GitHub:</span> {profile?.developer_profiles?.github_url}</div>
                    <div><span className="font-semibold text-zinc-800">LinkedIn:</span> {profile?.developer_profiles?.linkedin_url}</div>
                  </div>
                  <div className="text-xs text-zinc-600 space-y-1">
                    <div><span className="font-semibold text-zinc-800">Qualification:</span> {profile?.developer_profiles?.highest_qualification}</div>
                    <div><span className="font-semibold text-zinc-800">Experience:</span> {profile?.developer_profiles?.years_experience} Years</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Settings Card */}
          <div className="p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex">
            <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] p-6 shadow-inner flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Configuration</span>
                <Terminal size={16} className="text-zinc-300" />
              </div>
              <div className="space-y-3">
                <Link
                  href="/dashboard/developer/feed"
                  className="w-full py-2 bg-[#10B891] hover:bg-[#059669] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Database size={12} />
                  Project Marketplace
                </Link>
                <Link
                  href="/dashboard/developer/onboarding"
                  className="w-full py-2 border border-zinc-250 hover:bg-zinc-50 text-zinc-700 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Settings size={12} />
                  Edit Credentials
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Projects */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">My Assigned Projects</h3>
          {assignedProjects.length === 0 ? (
            <div className="p-8 text-center bg-white border border-zinc-200/60 rounded-2xl text-xs text-zinc-400">
              No builds currently assigned to your node. Check back once projects are triaged by the system root.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {assignedProjects.map((proj) => (
                <div key={proj.id} className="p-6 bg-white border border-zinc-200/60 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#E8823A]">{proj.field_of_work}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase ${
                        proj.status === "assigned" ? "bg-blue-50 border-blue-200 text-blue-600" :
                        proj.status === "in_progress" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                        "bg-zinc-100 border-zinc-200 text-zinc-500"
                      }`}>
                        {proj.status.replace("_", " ")}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900">{proj.project_name}</h4>
                    <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">{proj.description}</p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                      <div>Budget: {Number(proj.estimated_budget).toLocaleString()} {proj.budget_currency}</div>
                      <div>Duration: {proj.estimated_duration}</div>
                    </div>
                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider text-center transition-colors"
                    >
                      Open Collaboration Hub
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Project Collaboration Hub Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white border border-zinc-250 rounded-[2.5rem] p-8 shadow-2xl max-w-lg w-full relative space-y-6">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-800 rounded-xl transition-all"
              >
                <X size={14} />
              </button>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase text-[#E8823A]">{selectedProject.field_of_work}</span>
                <h3 className="text-base font-bold text-zinc-900">{selectedProject.project_name}</h3>
              </div>

              <ProjectCollaborationHub
                projectId={selectedProject.id}
                userRole="developer"
                projectStatus={selectedProject.status}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
