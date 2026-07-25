"use client";
import { getApiBaseUrl } from "@/utils/api";

import { useEffect, useState } from "react";
import { 
  Globe, Save, Trash2, PlusCircle, AlertCircle, 
  CheckCircle2, Search, Link as LinkIcon, RefreshCw, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { escapeHtml } from "@/utils/security";

interface MetadataRecord {
  id?: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
}

export default function MetadataManager() {
  const [records, setRecords] = useState<MetadataRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MetadataRecord | null>(null);
  
  // Form state
  const [path, setPath] = useState("/");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchRecords = async () => {
    const token = localStorage.getItem("admin_token") || "";
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/metadata/all`, {
        headers: {
          "X-Admin-Token": token,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
        if (data.length > 0) {
          handleSelect(data[0]);
        } else {
          handleNew();
        }
      }
    } catch (err) {
      console.warn("Backend offline during metadata list. Loading local seeds.");
      const mockSeeds: MetadataRecord[] = [
        { id: "1", path: "/", title: "BAGPACKERS AI - Global-Grade AI Automation & Software Engineering Platform", description: "Next-generation intelligent document processing (IDP), database schema generation, and high-performance serverless software engineering.", keywords: "AI Automation, Intelligent Document Processing, Next.js, Spring Boot, Software Agency, ROI Calculator", ogImage: "https://bagpackers.dev/og-home.png", ogTitle: "BAGPACKERS AI - Enterprise Automation", ogDescription: "Scale your business operations with low-latency dynamic AI agents." },
        { id: "2", path: "/services", title: "Our AI Automation & Full-Stack Services - BAGPACKERS AI", description: "Explore our core capability catalog including multimodal OCR, RAG compliance engines, and multitenant SaaS portals.", keywords: "OCR Services, RAG Systems, Enterprise SaaS, Headless CMS, WebGL Portals", ogImage: "https://bagpackers.dev/og-services.png", ogTitle: "Advanced Services & Solutions Catalog", ogDescription: "Custom autonomous agents and cloud-native digital ecosystems." },
        { id: "3", path: "/about", title: "About Our Agency - BAGPACKERS AI", description: "Discover our expert engineering backgrounds, development philosophies, and live client trust strategies.", keywords: "Software Agency Team, Enterprise Engineering, Client Trust", ogImage: "https://bagpackers.dev/og-about.png", ogTitle: "Expert Software Engineers & AI Architects", ogDescription: "Top-tier engineering team delivering production-grade services globally." }
      ];
      setRecords(mockSeeds);
      handleSelect(mockSeeds[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSelect = (record: MetadataRecord) => {
    setSelectedRecord(record);
    setPath(record.path);
    setTitle(record.title);
    setDescription(record.description);
    setKeywords(record.keywords);
    setOgImage(record.ogImage || "");
    setOgTitle(record.ogTitle || "");
    setOgDescription(record.ogDescription || "");
    setMessage(null);
  };

  const handleNew = () => {
    setSelectedRecord(null);
    setPath("");
    setTitle("");
    setDescription("");
    setKeywords("");
    setOgImage("");
    setOgTitle("");
    setOgDescription("");
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!path.trim() || !title.trim() || !description.trim() || !keywords.trim()) {
      setMessage({ type: "error", text: "Please populate all mandatory SEO meta fields." });
      return;
    }

    setSaving(true);
    setMessage(null);

    const token = localStorage.getItem("admin_token") || "";
    const sanitizedRecord = {
      id: selectedRecord?.id || undefined,
      path: path.trim(),
      title: escapeHtml(title.trim()),
      description: escapeHtml(description.trim()),
      keywords: escapeHtml(keywords.trim()),
      ogImage: ogImage.trim(),
      ogTitle: escapeHtml(ogTitle.trim()),
      ogDescription: escapeHtml(ogDescription.trim()),
    };

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/metadata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": token,
        },
        body: JSON.stringify(sanitizedRecord),
      });

      if (res.ok) {
        const saved = await res.json();
        setMessage({ type: "success", text: `Metadata for route ${path} committed successfully.` });
        
        // Refresh local cache sitemaps
        await fetchRecords();
        
        // Auto select saved record
        const matchingRecord = records.find(r => r.path === saved.path) || saved;
        setSelectedRecord(matchingRecord);
      } else {
        setMessage({ type: "error", text: "Commit rejected. Validate input formats and privileges." });
      }
    } catch (err) {
      console.warn("Backend offline. Simulating local SEO config save.");
      const updatedList = [...records];
      if (selectedRecord?.id) {
        const idx = updatedList.findIndex(r => r.id === selectedRecord.id);
        if (idx !== -1) updatedList[idx] = { ...sanitizedRecord, id: selectedRecord.id };
      } else {
        updatedList.push({ ...sanitizedRecord, id: String(Date.now()) });
      }
      setRecords(updatedList);
      setMessage({ type: "success", text: `(SIMULATED) Metadata for route ${path} updated locally.` });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord?.id) return;
    
    setDeleting(true);
    setMessage(null);

    const token = localStorage.getItem("admin_token") || "";

    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/metadata/${selectedRecord.id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Token": token,
        },
      });

      if (res.ok) {
        setMessage({ type: "success", text: "SEO profile deleted successfully." });
        handleNew();
        await fetchRecords();
      } else {
        setMessage({ type: "error", text: "Delete request rejected." });
      }
    } catch (err) {
      console.warn("Backend offline. Simulating local delete.");
      setRecords(records.filter(r => r.id !== selectedRecord.id));
      setMessage({ type: "success", text: "(SIMULATED) SEO profile deleted locally." });
      handleNew();
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-[#3B82F6] animate-spin" />
          <span className="text-xs text-zinc-500 font-mono">Loading dynamic sitemap metadata...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight leading-none">SEO & OG Metadata Manager</h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Update title, description, keywords, and Open Graph previews dynamically for all site pages.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNew}
          className="flex items-center gap-1.5 px-4 h-11 text-xs font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-full shadow-md transition-all cursor-pointer"
        >
          <PlusCircle size={14} />
          <span>New Page Path</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Directory of paths */}
        <div className="lg:col-span-4 p-1.5 bg-[#27272A]/30 border border-[#27272A]/50 rounded-[2rem] shadow-xl flex">
          <div className="w-full bg-[#18181B] border border-white/5 rounded-[calc(2.5rem-0.5rem)] p-5 space-y-4 shadow-inner">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Routes Directory</h3>
            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {records.map((rec) => {
                const isSelected = selectedRecord?.path === rec.path;
                return (
                  <button
                    key={rec.path}
                    onClick={() => handleSelect(rec)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#3B82F6]/10 border-[#3B82F6]/30 text-white font-bold"
                        : "bg-[#09090B] border-[#27272A] text-zinc-400 hover:text-white hover:bg-[#18181B]"
                    }`}
                  >
                    <span className="font-mono">{rec.path}</span>
                    <Globe size={12} className={isSelected ? "text-[#3B82F6]" : "text-zinc-600"} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Editors and previews */}
        <div className="lg:col-span-8 space-y-8">
          {/* Metadata edit Form */}
          <div className="p-1.5 bg-[#27272A]/30 border border-[#27272A]/50 rounded-[2.5rem] shadow-xl flex">
            <form onSubmit={handleSave} className="w-full bg-[#18181B] border border-white/5 rounded-[calc(2.5rem-0.5rem)] p-6 md:p-8 space-y-6 shadow-inner">
              <h3 className="text-sm font-bold text-white border-b border-[#27272A] pb-4">
                {selectedRecord ? `Configure Tags: ${selectedRecord.path}` : "Configure New Route Tags"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                {/* Path Input */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Page Route Path (Mandatory)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. /about or /services/custom-solution"
                      value={path}
                      disabled={!!selectedRecord}
                      onChange={(e) => setPath(e.target.value)}
                      className="w-full h-11 bg-[#09090B] border border-[#27272A] focus:border-[#3B82F6] disabled:opacity-50 placeholder-zinc-600 rounded-xl pl-10 pr-4 text-xs text-white focus:outline-none transition-all font-mono"
                    />
                    <LinkIcon size={14} className="absolute left-3.5 top-3.5 text-zinc-500" />
                  </div>
                </div>

                {/* Meta Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    SEO Meta Title (Mandatory)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-11 bg-[#09090B] border border-[#27272A] focus:border-[#3B82F6] placeholder-zinc-600 rounded-xl px-4 text-xs text-white focus:outline-none transition-all"
                  />
                </div>

                {/* Meta Keywords */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    SEO Keywords (Comma Separated)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IDP, OCR, Artificial Intelligence"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full h-11 bg-[#09090B] border border-[#27272A] focus:border-[#3B82F6] placeholder-zinc-600 rounded-xl px-4 text-xs text-white focus:outline-none transition-all"
                  />
                </div>

                {/* Meta Description */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    SEO Meta Description (Mandatory)
                  </label>
                  <textarea
                    required
                    placeholder="Enter meta description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-24 bg-[#09090B] border border-[#27272A] focus:border-[#3B82F6] placeholder-zinc-600 rounded-xl p-4 text-xs text-white focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="md:col-span-2 border-t border-[#27272A] pt-6 mt-2">
                  <h4 className="text-xs font-bold text-[#60A5FA] mb-4 uppercase tracking-wider">
                    Open Graph & Social Media Previews
                  </h4>
                </div>

                {/* OG Title */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    OG Title (Open Graph - Social Share)
                  </label>
                  <input
                    type="text"
                    placeholder="Defaults to SEO Title if empty..."
                    value={ogTitle}
                    onChange={(e) => setOgTitle(e.target.value)}
                    className="w-full h-11 bg-[#09090B] border border-[#27272A] focus:border-[#3B82F6] placeholder-zinc-600 rounded-xl px-4 text-xs text-white focus:outline-none transition-all"
                  />
                </div>

                {/* OG Image URL */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    OG Image URL (Public Link to PNG/JPG)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://bagpackers.dev/og-image.png"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    className="w-full h-11 bg-[#09090B] border border-[#27272A] focus:border-[#3B82F6] placeholder-zinc-600 rounded-xl px-4 text-xs text-white focus:outline-none transition-all font-mono"
                  />
                </div>

                {/* OG Description */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    OG Description (Social Share Card Text)
                  </label>
                  <textarea
                    placeholder="Defaults to SEO Description if empty..."
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    className="w-full h-20 bg-[#09090B] border border-[#27272A] focus:border-[#3B82F6] placeholder-zinc-600 rounded-xl p-4 text-xs text-white focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-4 rounded-xl flex items-start gap-2.5 text-xs ${
                      message.type === "success"
                        ? "bg-emerald-950/20 border border-emerald-500/30 text-emerald-400"
                        : "bg-red-950/20 border border-red-500/30 text-red-400"
                    }`}
                  >
                    {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{message.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 border-t border-[#27272A] pt-6 mt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-12 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? "Syncing Schema..." : "Commit Page Meta Configurations"}
                </motion.button>

                {selectedRecord && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="h-12 w-12 flex items-center justify-center rounded-full bg-red-950/20 hover:bg-red-600 border border-red-500/25 hover:border-red-500 text-red-400 hover:text-white transition-all cursor-pointer"
                  >
                    {deleting ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </motion.button>
                )}
              </div>
            </form>
          </div>

          {/* Dynamic Google and Social Preview Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Google Search Snippet Preview */}
            <div className="p-1.5 bg-[#27272A]/30 border border-[#27272A]/50 rounded-[2.5rem] shadow-xl flex">
              <div className="w-full bg-[#18181B] border border-white/5 rounded-[calc(2.5rem-0.5rem)] p-6 space-y-4 shadow-inner">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Search size={14} className="text-[#3B82F6]" />
                  Google SERP Snippet Preview
                </h3>
                <div className="p-4 bg-white rounded-xl text-black border border-zinc-200 font-sans leading-normal">
                  <div className="text-[11px] text-zinc-500 font-mono truncate">
                    https://bagpackers.dev{path || "/"}
                  </div>
                  <div className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-tight mt-1 line-clamp-1">
                    {title || "Dynamic SEO Meta Title"}
                  </div>
                  <div className="text-xs text-[#4d5156] mt-1 line-clamp-2">
                    {description || "Dynamic page meta description will reside here in search results. Complete the inputs to preview."}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Share OG Preview */}
            <div className="p-1.5 bg-[#27272A]/30 border border-[#27272A]/50 rounded-[2.5rem] shadow-xl flex">
              <div className="w-full bg-[#18181B] border border-white/5 rounded-[calc(2.5rem-0.5rem)] p-6 space-y-4 shadow-inner">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Eye size={14} className="text-[#60A5FA]" />
                  OG Social Card Preview
                </h3>
                <div className="bg-[#09090B] border border-[#27272A] rounded-2xl overflow-hidden leading-normal font-sans text-xs">
                  {/* Simulated OG Image */}
                  <div className="h-28 bg-[#18181B] border-b border-[#27272A] flex items-center justify-center relative overflow-hidden">
                    {ogImage ? (
                      <img 
                        src={ogImage} 
                        alt="OG Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-zinc-600 text-[10px] uppercase font-bold tracking-wider">No OG Image Set</div>
                    )}
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[9px] uppercase font-semibold text-zinc-500 font-mono tracking-wider">BAGPACKERS.DEV</span>
                    <h4 className="font-bold text-white line-clamp-1">{ogTitle || title || "Dynamic OG Title"}</h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {ogDescription || description || "Dynamic OG description snippet."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
