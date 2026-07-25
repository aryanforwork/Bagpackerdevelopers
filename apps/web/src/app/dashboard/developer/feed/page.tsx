"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { fetchProjectFeedAction, expressProjectInterestAction } from "@/app/actions";
import { ArrowLeft, Database, ChevronLeft, ChevronRight, Check, Loader2, Sparkles, X, MessageSquare, AlertCircle } from "lucide-react";

export default function DeveloperProjectFeedPage() {
  const router = useRouter();
  const supabase = createClient();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const LIMIT = 20;

  // Interest submission states
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [interestMessage, setInterestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeed() {
      setLoading(true);
      const result = await fetchProjectFeedAction(filter, page, LIMIT);
      if (result.success && result.data) {
        setProjects(result.data);
        setHasMore(result.data.length === LIMIT);
      }
      setLoading(false);
    }
    loadFeed();
  }, [filter, page]);

  // Realtime subscription setup to sync interest counters dynamically
  useEffect(() => {
    const channel = supabase
      .channel("project-interest-sync")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "project_interests",
        },
        (payload) => {
          setProjects((prev) =>
            prev.map((proj) => {
              if (proj.id === payload.new.project_id) {
                return {
                  ...proj,
                  interest_count: (proj.interest_count || 0) + 1,
                };
              }
              return proj;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleSubmitInterest = async () => {
    if (!selectedProject) return;
    setSubmitting(true);
    setActionError(null);

    const result = await expressProjectInterestAction(selectedProject.id, interestMessage);

    if (!result.success) {
      setActionError(result.error || "Failed to submit interest record.");
      setSubmitting(false);
      return;
    }

    // Update local state to show interest submitted
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === selectedProject.id) {
          return {
            ...proj,
            hasExpressedInterest: true,
            interest_count: (proj.interest_count || 0) + 1,
          };
        }
        return proj;
      })
    );

    setSelectedProject(null);
    setInterestMessage("");
    setSubmitting(false);
  };

  return (
    <div className="flex-1 bg-[#FAFAFA] text-zinc-950 p-8 md:p-12 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center">
          <Link
            href="/dashboard/developer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Console
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">Open Project Marketplace</h1>
          <p className="text-xs text-zinc-400">Review redacted active specifications, check node bid volumes, and apply to build.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 border-b border-zinc-200 pb-px">
          {["all", "AI Integration & Automation", "Enterprise Software & Middleware", "Industrial & IoT Systems", "Creative Web Development", "Digital Marketing Solutions"].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(0); }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                filter === f ? "border-[#10B891] text-[#10B891]" : "border-transparent text-zinc-400 hover:text-zinc-700"
              }`}
            >
              {f === "all" ? "All Fields" : f.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Feed List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-zinc-100 animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-16 text-center bg-white border border-zinc-200/60 rounded-3xl space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
              <Database size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-zinc-900 text-sm">No Projects Listed</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                There are no open-for-bid specifications under this category at this time.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2.5rem] shadow-sm flex"
              >
                <div className="w-full bg-white border border-white/40 rounded-[calc(2.5rem-0.25rem)] p-6 shadow-inner flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono text-[#E8823A] font-bold uppercase tracking-wider">
                        {proj.field_of_work}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 text-[9px] font-bold text-zinc-500 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                        {proj.interest_count} Nodes Interested
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950">{proj.project_name}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-prose">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex justify-between items-center text-xs">
                    <div className="text-[10px] text-zinc-400 font-semibold uppercase">
                      Timeline: {proj.estimated_duration}
                    </div>
                    
                    {proj.hasExpressedInterest ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-50 border border-zinc-250 text-zinc-400 rounded-xl text-xs font-bold">
                        <Check size={12} />
                        Interest Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedProject(proj)}
                        className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                      >
                        <Sparkles size={12} />
                        I'm Interested
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {(page > 0 || hasMore) && (
          <div className="flex justify-between items-center text-xs">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-1 font-semibold text-zinc-600 transition-colors"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="text-zinc-400">Page {page + 1}</span>
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

      {/* Interest Express Dialog Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-6 top-6 p-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-400 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-[#10B891] font-bold uppercase tracking-wider">Application Form</span>
              <h3 className="text-base font-bold text-zinc-900">Bid on {selectedProject.project_name}</h3>
            </div>

            {actionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="message">
                  Statement of Interest / Custom Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  placeholder="Outline why your stack experience is appropriate for this specific proposal..."
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
                />
              </div>

              <button
                disabled={submitting}
                onClick={handleSubmitInterest}
                className="w-full py-3 bg-[#09090B] hover:bg-zinc-800 disabled:bg-zinc-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Submitting Interest...
                  </>
                ) : (
                  <>
                    <MessageSquare size={14} />
                    Confirm Interest
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
