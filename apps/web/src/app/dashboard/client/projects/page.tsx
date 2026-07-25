"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, LayoutDashboard, Database, User, X, Calendar, DollarSign, Activity } from "lucide-react";
import ProjectCollaborationHub from "@/components/ProjectCollaborationHub";

export default function ClientProjectsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const LIMIT = 20;

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/sign-in");
        return;
      }

      // Query projects with developer details
      const { data, error } = await supabase
        .from("projects")
        .select("*, assigned_developer:assigned_developer_id(full_name, avatar_url)")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false })
        .range((page - 1) * LIMIT, page * LIMIT - 1);

      if (error) {
        console.error("Error retrieving client projects:", error);
      } else if (data) {
        setProjects(data);
        setHasMore(data.length === LIMIT);
      }
      setLoading(false);
    }

    fetchProjects();
  }, [page, router, supabase]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-50 border-blue-200 text-blue-600";
      case "in_review": return "bg-amber-50 border-amber-200 text-amber-600";
      case "open_for_bids": return "bg-purple-50 border-purple-200 text-purple-600";
      case "assigned": return "bg-teal-50 border-teal-200 text-teal-600";
      case "in_progress": return "bg-emerald-50 border-emerald-200 text-emerald-600";
      case "completed": return "bg-zinc-100 border-zinc-300 text-zinc-800";
      default: return "bg-zinc-50 border-zinc-200 text-zinc-400";
    }
  };

  return (
    <div className="flex-1 bg-[#FAFAFA] text-zinc-950 p-8 md:p-12 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center">
          <Link
            href="/dashboard/client"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Console
          </Link>

          <Link
            href="/dashboard/client/new-project"
            className="px-3.5 py-1.5 bg-[#10B891] hover:bg-[#059669] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={12} />
            Scope New Project
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">My Scoped Projects</h1>
          <p className="text-xs text-zinc-400">Review status logs, active milestones, and assigned developers.</p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Projects Table List */}
          <div className={`${selectedProject ? "lg:col-span-7" : "lg:col-span-12"} p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex transition-all`}>
            <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] overflow-hidden shadow-inner">
              {loading ? (
                /* Loading Skeletons */
                <div className="p-8 space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-16 w-full bg-zinc-100 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                /* Empty State */
                <div className="p-16 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
                    <Database size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-zinc-900 text-sm">No Scoped Projects</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
                      Submit your first software requirement specification (SRS) to start development workflows.
                    </p>
                  </div>
                </div>
              ) : (
                /* Data Table */
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100 bg-zinc-50/50 text-zinc-400 font-bold uppercase tracking-wider">
                        <th className="p-4 pl-6">Project Name</th>
                        {!selectedProject && <th className="p-4">Field of Work</th>}
                        <th className="p-4">Status</th>
                        {!selectedProject && <th className="p-4">Budget</th>}
                        <th className="p-4">Developer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {projects.map((proj) => (
                        <tr
                          key={proj.id}
                          onClick={() => setSelectedProject(proj)}
                          className={`cursor-pointer transition-colors ${
                            selectedProject?.id === proj.id ? "bg-teal-50/20" : "hover:bg-zinc-50/30"
                          }`}
                        >
                          <td className="p-4 pl-6 font-bold text-zinc-900 max-w-[150px] truncate">{proj.project_name}</td>
                          {!selectedProject && <td className="p-4 text-zinc-500">{proj.field_of_work}</td>}
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${getStatusColor(proj.status)}`}>
                              {proj.status.replace("_", " ")}
                            </span>
                          </td>
                          {!selectedProject && (
                            <td className="p-4 font-mono font-semibold text-zinc-700">
                              {Number(proj.estimated_budget).toLocaleString()} {proj.budget_currency}
                            </td>
                          )}
                          <td className="p-4">
                            {proj.assigned_developer ? (
                              <div className="flex items-center gap-2">
                                {proj.assigned_developer.avatar_url ? (
                                  <img
                                    src={proj.assigned_developer.avatar_url}
                                    alt={proj.assigned_developer.full_name}
                                    className="w-5 h-5 rounded-full object-cover border border-zinc-200"
                                  />
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-[8px] uppercase">
                                    {proj.assigned_developer.full_name[0]}
                                  </div>
                                )}
                                <span className="font-medium text-zinc-800">{proj.assigned_developer.full_name}</span>
                              </div>
                            ) : (
                              <span className="text-zinc-400 italic">Not Assigned</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {(page > 1 || hasMore) && (
                <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-between items-center text-xs">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-1 font-semibold text-zinc-600 transition-colors"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <span className="text-zinc-400">Page {page}</span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasMore}
                    className="px-3 py-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-1 font-semibold text-zinc-600 transition-colors"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Project Details Workspace Panel */}
          {selectedProject && (
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-zinc-200/60 rounded-[2rem] p-6 shadow-sm space-y-5 relative">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-800 rounded-xl transition-all"
                >
                  <X size={14} />
                </button>

                <div className="space-y-2">
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase inline-block ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status.replace("_", " ")}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 leading-tight">{selectedProject.project_name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Calendar size={14} />
                    <span>{selectedProject.estimated_duration || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <DollarSign size={14} />
                    <span>
                      {Number(selectedProject.estimated_budget).toLocaleString()} {selectedProject.budget_currency}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Project Description</span>
                  <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-50/50 p-3.5 rounded-2xl border border-zinc-150">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Collaboration Hub Integration */}
                <ProjectCollaborationHub
                  projectId={selectedProject.id}
                  userRole="client"
                  projectStatus={selectedProject.status}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
