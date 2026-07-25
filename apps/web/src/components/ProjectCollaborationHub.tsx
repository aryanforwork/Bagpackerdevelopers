"use client";

import React, { useEffect, useState } from "react";
import { fetchProjectMessagesAction, sendProjectMessageAction, submitProjectReviewAction } from "@/app/actions";
import { Send, Star, MessageSquare, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface ProjectCollaborationHubProps {
  projectId: string;
  userRole: "client" | "developer" | "admin";
  projectStatus: string;
}

export default function ProjectCollaborationHub({ projectId, userRole, projectStatus }: ProjectCollaborationHubProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [messagesLoading, setMessagesLoading] = useState(true);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadMessages = async () => {
    const res = await fetchProjectMessagesAction(projectId);
    if (res.success && res.data) {
      setMessages(res.data);
    }
    setMessagesLoading(false);
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 8000); // Refresh chat logs every 8s
    return () => clearInterval(interval);
  }, [projectId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgText = newMessage;
    setNewMessage("");

    const res = await sendProjectMessageAction(projectId, msgText);
    if (res.success && res.data) {
      setMessages((prev) => [...prev, res.data]);
    } else {
      setError(res.error || "Failed to deliver message.");
    }
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError("Please include feedback comments.");
      return;
    }

    setReviewLoading(true);
    setError(null);

    const res = await submitProjectReviewAction(projectId, rating, reviewText);
    if (res.success) {
      setReviewSubmitted(true);
    } else {
      setError(res.error || "Failed to submit review.");
    }
    setReviewLoading(false);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Collaboration Chat Logs */}
      <div className="bg-white border border-zinc-200/60 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 pb-3 border-b border-zinc-100">
          <span className="p-1 bg-[#10B891]/10 rounded-lg text-[#10B891]">
            <MessageSquare size={14} />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">Project Chat Room</span>
        </div>

        {/* Message Log */}
        <div className="h-64 overflow-y-auto space-y-3 pr-1 text-xs">
          {messagesLoading ? (
            <div className="h-full flex items-center justify-center text-zinc-400">
              <Loader2 size={16} className="animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center p-8 text-zinc-400 space-y-1">
              <span className="font-bold text-zinc-700">No Messages Yet</span>
              <p className="text-[10px]">Start the conversation below with your assigned project partner.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="p-3 bg-zinc-50 border border-zinc-150 rounded-2xl space-y-1">
                <div className="flex justify-between items-center text-[10px] text-zinc-400">
                  <span className="font-bold text-zinc-700">{m.sender?.full_name || "Platform Participant"}</span>
                  <span>{new Date(m.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">{m.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your project message here..."
            className="flex-1 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:border-[#10B891] transition-all"
          />
          <button
            type="submit"
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-colors shrink-0"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

      {/* Ratings review submission (Client view only, on completed/archived projects) */}
      {userRole === "client" && (projectStatus === "completed" || projectStatus === "archived") && (
        <div className="bg-gradient-to-br from-teal-50/40 to-emerald-50/20 border border-[#10B891]/20 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-1.5 pb-2 border-b border-teal-100/50">
            <Sparkles size={14} className="text-[#10B891]" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-900">Developer Performance Review</span>
          </div>

          {reviewSubmitted ? (
            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-center space-y-2 text-xs">
              <span className="font-bold text-emerald-800 block">Thank You For Your Feedback!</span>
              <p className="text-[10px] text-zinc-500">Your star ratings feedback has been logged and published to the developer's verified profile catalog.</p>
            </div>
          ) : (
            <form onSubmit={handleRatingSubmit} className="space-y-4 text-xs">
              {/* Star selector */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">Overall Quality Rating</span>
                <div className="flex gap-1.5 text-zinc-300">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`transition-colors ${star <= rating ? "text-amber-500" : "text-zinc-200"}`}
                    >
                      <Star size={20} fill={star <= rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase text-zinc-400 block">Detailed Review</label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details on engineering quality, timelines compliance, and overall integration wins..."
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#10B891] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
              >
                {reviewLoading ? <Loader2 className="animate-spin" size={12} /> : "Submit Developer Review"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
