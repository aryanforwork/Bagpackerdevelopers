"use client";
import { getApiBaseUrl } from "@/utils/api";

import { useEffect, useState } from "react";
import { 
  MessageSquare, User, Building, Mail, Clock, 
  ToggleLeft, ToggleRight, Trash2, 
  Inbox, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  brief: string;
  company?: string;
  createdAt: string;
}

interface Lead {
  id: string;
  company: string;
  estimatedManualHours: number;
  projectedRoi: number;
  contactStatus: boolean;
  createdAt: string;
}

export default function CrmInbox() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<"enquiries" | "leads">("enquiries");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("admin_token") || "";
    setError("");
    try {
      // Fetch enquiries
      const enqRes = await fetch(`${getApiBaseUrl()}/api/v1/enquiries`, {
        headers: { "X-Admin-Token": token }
      });
      // Fetch leads
      const leadRes = await fetch(`${getApiBaseUrl()}/api/v1/leads`, {
        headers: { "X-Admin-Token": token }
      });

      if (enqRes.ok && leadRes.ok) {
        const enqData = await enqRes.json();
        const leadData = await leadRes.json();
        // Sort both descending by date
        setEnquiries(enqData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setLeads(leadData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } else {
        setError("Unauthorized. Secure API gateway blocked access.");
      }
    } catch (err) {
      console.warn("Backend offline during CRM fetch. Loading simulated logs.");
      // Simulated seeds
      setEnquiries([
        { id: "e1", name: "Helena Rostova", email: "helena@apexfintech.com", brief: "We are migrating our legacy client portal to Next.js. We need sub-second page performance, SEO schema compliance, and full Supabase database integrations with custom Row-Level Security rules. Requesting formal RFP review and call.", company: "Apex Fintech", createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: "e2", name: "Devon Miller", email: "dmiller@gridlogistics.com", brief: "Need a custom OCR ingestion scheduler utilizing Tesseract engines inside Spring Boot. We handle 10k custom documents monthly. Must be secure and hidden from public domains.", company: "Grid Logistics", createdAt: new Date(Date.now() - 86400000).toISOString() }
      ]);
      setLeads([
        { id: "l1", company: "Logistics Global Inc", estimatedManualHours: 1200, projectedRoi: 95000.0, contactStatus: true, createdAt: new Date(Date.now() - 7200000).toISOString() },
        { id: "l2", company: "FinTech Frontiers", estimatedManualHours: 350, projectedRoi: 24000.0, contactStatus: false, createdAt: new Date(Date.now() - 172800000).toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleLeadStatus = async (leadId: string, currentStatus: boolean) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, contactStatus: !currentStatus } : l));
    
    const token = localStorage.getItem("admin_token") || "";
    try {
      await fetch(`${getApiBaseUrl()}/api/v1/leads/${leadId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": token
        },
        body: JSON.stringify({ contactStatus: !currentStatus })
      });
    } catch (err) {
      console.warn("Backend offline. Action updated locally.");
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    setEnquiries(enquiries.filter(e => e.id !== id));
    const token = localStorage.getItem("admin_token") || "";
    try {
      await fetch(`${getApiBaseUrl()}/api/v1/enquiries/${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Token": token }
      });
    } catch (err) {
      console.warn("Backend offline. Action updated locally.");
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#3B82F6] animate-spin" />
          <span className="text-xs text-zinc-500 font-mono">Loading CRM pipeline tables...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight leading-none">CRM Workspace</h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Manage inquiries, analyze proposals, and track lead conversion statuses.
          </p>
        </div>
        <div className="flex bg-[#09090B] p-1.5 border border-[#27272A] rounded-2xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`flex-1 md:flex-initial px-4 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "enquiries" ? "bg-[#3B82F6] text-white" : "text-zinc-500 hover:text-white"
            }`}
          >
            Client Inquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex-1 md:flex-initial px-4 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ml-1 ${
              activeTab === "leads" ? "bg-[#3B82F6] text-white" : "text-zinc-500 hover:text-white"
            }`}
          >
            ROI Calculator Leads ({leads.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-xs text-red-400">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Content Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "enquiries" ? (
          <motion.div
            key="enquiries"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {enquiries.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-[#27272A] bg-black/10 rounded-2xl">
                <Inbox size={32} className="mx-auto mb-2 text-zinc-700" />
                <p className="text-xs text-zinc-500 font-sans">No client inquiries found in DB.</p>
              </div>
            ) : (
              enquiries.map((enq) => (
                <div key={enq.id} className="p-1.5 bg-[#27272A]/30 border border-[#27272A]/50 rounded-[2.5rem] shadow-xl flex">
                  <div className="w-full bg-[#18181B] border border-white/5 rounded-[calc(2.5rem-0.5rem)] p-6 relative flex flex-col md:flex-row justify-between gap-6 hover:border-[#3B82F6]/30 transition-all duration-300 shadow-inner">
                    <div className="space-y-4 flex-1">
                      {/* Header: User Meta */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
                        <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                          <User size={14} className="text-[#3B82F6]" />
                          <span>{enq.name}</span>
                        </div>
                        {enq.company && (
                          <div className="flex items-center gap-1.5 font-semibold text-[#60A5FA]">
                            <Building size={12} />
                            <span>{enq.company}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 font-mono text-zinc-500">
                          <Mail size={12} />
                          <span>{enq.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-zinc-500 ml-auto md:ml-0">
                          <Clock size={12} />
                          <span>{new Date(enq.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Brief description */}
                      <p className="text-xs text-zinc-300 leading-relaxed bg-[#09090B] p-4 rounded-xl border border-[#27272A]">
                        {enq.brief}
                      </p>
                    </div>

                    <div className="flex md:flex-col justify-end items-center md:items-end gap-3 shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteEnquiry(enq.id)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-950/20 hover:bg-red-600 border border-red-500/25 hover:border-red-500 text-red-400 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="leads"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {leads.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-[#27272A] bg-black/10 rounded-2xl">
                <Inbox size={32} className="mx-auto mb-2 text-zinc-700" />
                <p className="text-xs text-zinc-500 font-sans">No calculator leads captured yet.</p>
              </div>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="p-1.5 bg-[#27272A]/30 border border-[#27272A]/50 rounded-[2.5rem] shadow-xl flex">
                  <div className="w-full bg-[#18181B] border border-white/5 rounded-[calc(2.5rem-0.5rem)] p-6 flex items-center justify-between gap-6 hover:border-[#60A5FA]/30 transition-all duration-300 shadow-inner">
                    <div className="space-y-3">
                      <h3 className="font-bold text-white text-base flex items-center gap-2">
                        <Building size={16} className="text-[#60A5FA]" />
                        {lead.company}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-xs text-zinc-500 font-mono">
                        <span>Saved Labor: <b className="text-white">{lead.estimatedManualHours} hrs/mo</b></span>
                        <span>•</span>
                        <span>Target Efficiency: <b className="text-white">75%</b></span>
                        <span>•</span>
                        <span>Captured: {new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-widest">EST. ANNUAL ROI</span>
                        <span className="text-lg font-extrabold text-[#10B891] font-mono">
                          ${Math.round(lead.projectedRoi).toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleLeadStatus(lead.id, lead.contactStatus)}
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {lead.contactStatus ? (
                          <div className="flex items-center gap-1.5 text-[#10B891] font-bold">
                            <ToggleRight size={24} />
                            <span className="hidden sm:inline">Contacted</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-zinc-500 font-medium">
                            <ToggleLeft size={24} />
                            <span className="hidden sm:inline">Uncontacted</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
