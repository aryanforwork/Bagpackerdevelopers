"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { 
  fetchAdminProjectsAction, 
  fetchDevelopersAction, 
  transitionProjectAction, 
  fetchProjectInterestsAction,
  completeAndPublishProjectAction 
} from "@/app/actions";
import { ArrowLeft, Database, ChevronLeft, ChevronRight, X, Loader2, AlertCircle, Sparkles, Upload } from "lucide-react";

export default function AdminProjectsPage() {
  const supabaseClient = createClient();

  const [projects, setProjects] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>("");
  const [projectApplicants, setProjectApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Publish Form States
  const [publishTitle, setPublishTitle] = useState("");
  const [publishSummary, setPublishSummary] = useState("");
  const [publishCoverUrl, setPublishCoverUrl] = useState("");
  const [publishTechUsed, setPublishTechUsed] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const projResult = await fetchAdminProjectsAction(tab, page, 20);
      const devResult = await fetchDevelopersAction();

      if (projResult.success && projResult.data) {
        setProjects(projResult.data.content || []);
        setTotalPages(projResult.data.totalPages || 0);
      }
      if (devResult.success && devResult.data) {
        setDevelopers(devResult.data || []);
      }
      setLoading(false);
    }
    loadData();
  }, [tab, page]);

  const handleSelectProject = async (proj: any) => {
    setSelectedProject(proj);
    setSelectedDeveloperId(proj.assigned_developer_id || "");
    setProjectApplicants([]);
    setLoadingApplicants(true);
    setActionError(null);

    // Setup defaults for publishing
    setPublishTitle(proj.project_name || "");
    setPublishSummary("");
    setPublishCoverUrl("");
    setPublishTechUsed("");

    const res = await fetchProjectInterestsAction(proj.id);
    if (res.success && res.data) {
      setProjectApplicants(res.data);
    }
    setLoadingApplicants(false);
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setActionError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `portfolio/${Date.now()}.${fileExt}`;
      const { error: uploadErr } = await supabaseClient.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadErr) {
        setActionError(uploadErr.message);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabaseClient.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setPublishCoverUrl(publicUrl);
    } catch (err: any) {
      setActionError(err.message || "Upload failed.");
    }
    setUploading(false);
  };

  const handleTransition = async (status: string, devId?: string) => {
    if (!selectedProject) return;
    setActionLoading(true);
    setActionError(null);

    const result = await transitionProjectAction(selectedProject.id, status, devId);

    if (!result.success) {
      setActionError(result.error || "Failed to execute workflow transition.");
      setActionLoading(false);
      return;
    }

    const updatedProjects = projects.map((p) => {
      if (p.id === selectedProject.id) {
        const devName = developers.find((d) => d.id === devId)?.full_name || p.assigned_developer?.full_name;
        return {
          ...p,
          status,
          assigned_developer_id: devId || p.assigned_developer_id,
          assigned_developer: devId ? { full_name: devName } : p.assigned_developer,
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    setSelectedProject(null);
    setActionLoading(false);
  };

  const handlePublish = async () => {
    if (!selectedProject) return;
    if (!publishTitle.trim() || !publishSummary.trim() || !publishCoverUrl.trim()) {
      setActionError("Title, summary, and cover image are mandatory parameters.");
      return;
    }

    setActionLoading(true);
    setActionError(null);

    const techTags = publishTechUsed
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: publishTitle,
      summary: publishSummary,
      coverImageUrl: publishCoverUrl,
      galleryUrls: [publishCoverUrl], // Default gallery to contain the cover
      techUsed: techTags
    };

    const result = await completeAndPublishProjectAction(selectedProject.id, payload);

    if (!result.success) {
      setActionError(result.error || "Failed to complete and publish project.");
      setActionLoading(false);
      return;
    }

    // Refresh local list state
    const updatedProjects = projects.map((p) => {
      if (p.id === selectedProject.id) {
        return {
          ...p,
          status: "archived",
          is_portfolio_ready: true
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    setSelectedProject(null);
    setActionLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-blue-50 border-blue-200 text-blue-600";
      case "in_review": return "bg-amber-50 border-amber-200 text-amber-600";
      case "open_for_bids": return "bg-purple-50 border-purple-200 text-purple-600";
      case "assigned": return "bg-teal-50 border-teal-200 text-teal-600";
      case "in_progress": return "bg-emerald-50 border-emerald-200 text-emerald-600";
      case "completed": return "bg-zinc-100 border-zinc-300 text-zinc-800";
      case "archived": return "bg-zinc-100 border-zinc-200 text-zinc-400";
      default: return "bg-zinc-50 border-zinc-200 text-zinc-400";
    }
  };

  return (
    <div className="flex-1 bg-[#FAFAFA] text-zinc-950 p-8 md:p-12 relative min-h-screen">
      <div className="max-w-[1440px] mx-auto space-y-8">
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
          <h1 className="text-xl font-bold tracking-tight">System Projects Registry</h1>
          <p className="text-xs text-zinc-400">Triage scoping requests, assign remote developer nodes, and verify lifecycle transitions.</p>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 border-b border-zinc-200 pb-px">
          {["all", "submitted", "in_review", "open_for_bids", "assigned", "in_progress", "completed", "archived"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(0); }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                tab === t ? "border-[#10B891] text-[#10B891]" : "border-transparent text-zinc-400 hover:text-zinc-700"
              }`}
            >
              {t.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Projects Registry Container */}
        <div className="p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm flex">
          <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] overflow-hidden shadow-inner">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 w-full bg-zinc-100 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
                  <Database size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-zinc-900 text-sm">No Scopes Found</h3>
                  <p className="text-xs text-zinc-400">No project proposals match the selected state category.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/50 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="p-4 pl-6">Project Name</th>
                      <th className="p-4">Field of Work</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Budget</th>
                      <th className="p-4">Developer</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-zinc-50/30 transition-colors">
                        <td className="p-4 pl-6 font-bold text-zinc-900 max-w-[200px] truncate">{proj.project_name}</td>
                        <td className="p-4 text-zinc-500">{proj.field_of_work}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getStatusColor(proj.status)}`}>
                            {proj.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-semibold text-zinc-700">
                          {Number(proj.estimated_budget).toLocaleString()} {proj.budget_currency}
                        </td>
                        <td className="p-4">
                          {proj.assigned_developer ? (
                            <span className="font-medium text-zinc-800">{proj.assigned_developer.full_name || proj.assigned_developer}</span>
                          ) : (
                            <span className="text-zinc-400 italic">Not Assigned</span>
                          )}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => handleSelectProject(proj)}
                            className="px-3 py-1 border border-zinc-200 rounded-lg hover:bg-zinc-50 font-bold text-zinc-700 transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-between items-center text-xs">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-1 font-semibold text-zinc-600 transition-colors"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <span className="text-zinc-400">Page {page + 1} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-1 font-semibold text-zinc-600 transition-colors"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-out Drawer */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          {/* Backdrop closer */}
          <div className="flex-1" onClick={() => setSelectedProject(null)} />
          
          <div className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col justify-between border-l border-zinc-200 p-8 space-y-6">
            <div className="space-y-6 overflow-y-auto pr-2 flex-1">
              {/* Drawer Header */}
              <div className="flex justify-between items-start pb-4 border-b border-zinc-100">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#10B891] font-bold uppercase tracking-wider">Project Telemetry Drawer</span>
                  <h3 className="text-base font-bold text-zinc-900">{selectedProject.project_name}</h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {actionError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Specs */}
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 border border-zinc-200/50 rounded-xl space-y-2">
                  <div className="text-[10px] font-bold uppercase text-zinc-400">Scoping Details</div>
                  <div className="text-xs text-zinc-700 space-y-1">
                    <div><span className="font-semibold text-zinc-900">Work Field:</span> {selectedProject.field_of_work}</div>
                    <div><span className="font-semibold text-zinc-900">Duration:</span> {selectedProject.estimated_duration}</div>
                    <div><span className="font-semibold text-zinc-900">Budget:</span> {Number(selectedProject.estimated_budget).toLocaleString()} {selectedProject.budget_currency}</div>
                    <div><span className="font-semibold text-zinc-900">Current Status:</span> <span className="font-bold text-[#10B891] uppercase">{selectedProject.status.replace("_", " ")}</span></div>
                    <div>
                      <span className="font-semibold text-zinc-900">Client Consent:</span>{" "}
                      <span className={`font-bold ${selectedProject.client_consent_public ? "text-emerald-500" : "text-zinc-400"}`}>
                        {selectedProject.client_consent_public ? "YES (PUBLIC ACCESS ALLOWED)" : "NO (ANONYMIZED)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-zinc-400">Complete Description</span>
                  <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-50 p-4 border border-zinc-150 rounded-xl max-h-40 overflow-y-auto">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              {/* Portfolio Publishing Form (only for in_progress/completed builds) */}
              {(selectedProject.status === "in_progress" || selectedProject.status === "completed") && (
                <div className="space-y-4 p-5 bg-gradient-to-br from-teal-50/40 to-emerald-50/20 border border-[#10B891]/20 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider">
                    <Sparkles size={14} className="text-[#10B891]" />
                    Complete & Publish Portfolio
                  </div>
                  
                  <div className="space-y-3 text-xs">
                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-zinc-400 block">Display Case Title</label>
                      <input
                        type="text"
                        value={publishTitle}
                        onChange={(e) => setPublishTitle(e.target.value)}
                        placeholder="Anonymized Project Name"
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#10B891] transition-all"
                      />
                    </div>

                    {/* Summary */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-zinc-400 block">Case Summary</label>
                      <textarea
                        rows={3}
                        value={publishSummary}
                        onChange={(e) => setPublishSummary(e.target.value)}
                        placeholder="Brief overview highlighting architecture, engineering wins, and core stacks implemented..."
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#10B891] transition-all"
                      />
                    </div>

                    {/* Cover image uploader */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-zinc-400 block">Cover Image Banner</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={publishCoverUrl}
                          onChange={(e) => setPublishCoverUrl(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#10B891] transition-all"
                        />
                        <label className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl cursor-pointer flex items-center justify-center shrink-0 transition-colors">
                          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                          <input type="file" onChange={handleUploadCover} accept="image/*" className="hidden" />
                        </label>
                      </div>
                    </div>

                    {/* Tech tag input */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-zinc-400 block">Tech Used (Comma-separated)</label>
                      <input
                        type="text"
                        value={publishTechUsed}
                        onChange={(e) => setPublishTechUsed(e.target.value)}
                        placeholder="Next.js, Spring Boot, Supabase"
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#10B891] transition-all"
                      />
                    </div>

                    <button
                      disabled={actionLoading || uploading}
                      onClick={handlePublish}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={12} /> : "Publish Case & Archive Project"}
                    </button>
                  </div>
                </div>
              )}

              {/* Applicants / Candidates List */}
              {selectedProject.status === "open_for_bids" && (
                <div className="space-y-3 pt-4 border-t border-zinc-100">
                  <span className="text-[10px] font-bold uppercase text-zinc-400 block">Bidding Applicants</span>
                  {loadingApplicants ? (
                    <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <Loader2 className="animate-spin" size={12} />
                      Loading bidding registry...
                    </div>
                  ) : projectApplicants.length === 0 ? (
                    <div className="text-xs text-zinc-400 italic">No candidates applied for this scope yet.</div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {projectApplicants.map((app) => (
                        <div key={app.id} className="p-3 bg-zinc-50 border border-zinc-200/50 rounded-xl flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-zinc-900 block">
                              {app.developer?.full_name || "Vetted Node"}
                            </span>
                            <span className="text-[9px] text-zinc-400 block max-w-[200px] truncate">
                              "{app.message || "No statement included."}"
                            </span>
                          </div>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleTransition("assigned", app.developer_id)}
                            className="px-2.5 py-1 bg-[#10B891] hover:bg-[#059669] text-white rounded-lg text-[10px] font-bold uppercase transition-colors shrink-0"
                          >
                            Assign
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* General Manual Assignment Selector */}
              {selectedProject.status !== "open_for_bids" && selectedProject.status !== "completed" && selectedProject.status !== "archived" && (
                <div className="space-y-3 pt-4 border-t border-zinc-100">
                  <span className="text-[10px] font-bold uppercase text-zinc-400">Assign remote developer node</span>
                  <div className="space-y-2">
                    <select
                      value={selectedDeveloperId}
                      onChange={(e) => setSelectedDeveloperId(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                    >
                      <option value="">-- Select Developer --</option>
                      {developers.map((dev) => (
                        <option key={dev.id} value={dev.id}>{dev.full_name}</option>
                      ))}
                    </select>
                    <button
                      disabled={actionLoading || !selectedDeveloperId}
                      onClick={() => handleTransition("assigned", selectedDeveloperId)}
                      className="w-full py-2 bg-[#10B891] hover:bg-[#059669] disabled:bg-zinc-300 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={12} /> : "Assign Developer"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Workflow state buttons */}
            <div className="pt-4 border-t border-zinc-100 space-y-2">
              <div className="text-[10px] font-bold uppercase text-zinc-400">Force State Transition</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={actionLoading || selectedProject.status !== "submitted"}
                  onClick={() => handleTransition("in_review")}
                  className="py-1.5 border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 rounded-lg text-[10px] font-bold uppercase text-zinc-700 transition-colors"
                >
                  Triage (In Review)
                </button>
                <button
                  disabled={actionLoading || selectedProject.status !== "in_review"}
                  onClick={() => handleTransition("open_for_bids")}
                  className="py-1.5 border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 rounded-lg text-[10px] font-bold uppercase text-zinc-700 transition-colors"
                >
                  Open for Bids
                </button>
                <button
                  disabled={actionLoading || selectedProject.status !== "assigned"}
                  onClick={() => handleTransition("in_progress")}
                  className="py-1.5 border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 rounded-lg text-[10px] font-bold uppercase text-zinc-700 transition-colors"
                >
                  Start Build
                </button>
                <button
                  disabled={actionLoading || selectedProject.status !== "in_progress"}
                  onClick={() => handleTransition("completed")}
                  className="py-1.5 border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 rounded-lg text-[10px] font-bold uppercase text-zinc-700 transition-colors"
                >
                  Complete Build
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
