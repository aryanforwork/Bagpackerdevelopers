"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertTriangle, MessageSquare, Briefcase, Sparkles } from "lucide-react";
import { escapeHtml } from "@/utils/security";
import { submitEnquiryAction } from "@/app/actions";

// Custom Fetch Hook
function useEnquirySubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  const submitEnquiry = async (data: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setIsSimulated(false);

    const result = await submitEnquiryAction(data);
    if (!result.success) {
      setError(result.error || "Submission failed");
      setSuccess(false);
      setLoading(false);
      return false;
    }

    if (result.isSimulated) {
      setIsSimulated(true);
    }
    setSuccess(true);
    setLoading(false);
    return true;
  };

  return { submitEnquiry, loading, error, success, isSimulated, setSuccess, setError };
}

export default function ContactPage() {
  const { submitEnquiry, loading, error, success, isSimulated, setSuccess, setError } = useEnquirySubmit();

  const [formType, setFormType] = useState<"general" | "project">("project");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("AI Ingestion");
  const [budget, setBudget] = useState("$15,000 - $35,000");
  const [timeline, setTimeline] = useState("1-3 Months");
  const [brief, setBrief] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !brief.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    const payload = {
      name: escapeHtml(name.trim()),
      email: escapeHtml(email.trim()),
      company: company.trim() ? escapeHtml(company.trim()) : null,
      category: formType === "project" ? category : "General Query",
      budget: formType === "project" ? budget : "N/A",
      timeline: formType === "project" ? timeline : "N/A",
      brief: formType === "project" 
        ? `[Project Category: ${category} | Estimated Budget: ${budget} | Desired Timeline: ${timeline}]\n\n${escapeHtml(brief.trim())}`
        : escapeHtml(brief.trim()),
    };

    await submitEnquiry(payload);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setCompany("");
    setBrief("");
    setSuccess(false);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Bagpackers Developers",
    "description": "Submit general queries or book enterprise AI automation and software engineering projects.",
    "url": "https://bagpackers.dev/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Bagpackers Developers",
      "url": "https://bagpackers.dev"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <div className="min-h-screen bg-[#FAFAFA] text-zinc-700 pb-24 overflow-x-hidden font-sans flex flex-col gap-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full text-center md:text-left">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/5 via-transparent to-transparent -z-10 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-sm text-xs font-semibold text-[#10B891]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B891] animate-pulse" />
              Direct Communication Channel
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              Connect With <span className="text-gradient">Our Engineers</span>
            </h1>
            <p className="text-zinc-600 text-lg md:text-xl leading-relaxed">
              Book a scoped project consultation or submit general engineering queries directly to our technical desk.
            </p>
          </motion.div>
        </section>

        {/* Contact Form & Side Panel Section */}
        <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 border-t border-zinc-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Side: Form Container in Double Bezel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-8 p-1.5 bg-zinc-100/50 border border-zinc-200/80 rounded-[2.5rem] shadow-xl flex"
            >
              <div className="w-full bg-[#FAFAFA] border border-zinc-100 rounded-[calc(2.5rem-0.5rem)] p-6 md:p-10 flex flex-col justify-between shadow-inner">
                <div>
                  {/* Tabs */}
                  <div className="flex border-b border-zinc-200 mb-8">
                    <button
                      onClick={() => { setFormType("project"); setError(null); }}
                      className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 transition-all relative cursor-pointer ${
                        formType === "project" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-950"
                      }`}
                    >
                      <Briefcase size={16} className={formType === "project" ? "text-[#10B891]" : "text-zinc-500"} />
                      Project Booking
                      {formType === "project" && (
                        <motion.span
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B891]"
                        />
                      )}
                    </button>
                    <button
                      onClick={() => { setFormType("general"); setError(null); }}
                      className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 transition-all relative ml-8 cursor-pointer ${
                        formType === "general" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-950"
                      }`}
                    >
                      <MessageSquare size={16} className={formType === "general" ? "text-[#10B891]" : "text-zinc-500"} />
                      General Query
                      {formType === "general" && (
                        <motion.span
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B891]"
                        />
                      )}
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {!success ? (
                      <motion.form
                        key="contact-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                      >
                        {/* Name & Email Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Alex Mercer"
                              className="w-full h-12 bg-[#FAFAFA] border border-zinc-200 focus:border-[#10B891] placeholder-zinc-400 rounded-xl px-4 text-sm text-zinc-900 focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
                              Work Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="alex@acme.com"
                              className="w-full h-12 bg-[#FAFAFA] border border-zinc-200 focus:border-[#10B891] placeholder-zinc-400 rounded-xl px-4 text-sm text-zinc-900 focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                        {/* Company Input */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
                            Company Name <span className="text-zinc-600 text-[10px]">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="e.g. Acme Corporation"
                            className="w-full h-12 bg-[#FAFAFA] border border-zinc-200 focus:border-[#10B891] placeholder-zinc-400 rounded-xl px-4 text-sm text-zinc-900 focus:outline-none transition-colors"
                          />
                        </div>

                        {/* Scoped Fields - Only shown when Project Booking is active */}
                        {formType === "project" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Project Category */}
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
                                  Project Category
                                </label>
                                <select
                                  value={category}
                                  onChange={(e) => setCategory(e.target.value)}
                                  className="w-full h-12 bg-[#FAFAFA] border border-zinc-200 focus:border-[#10B891] rounded-xl px-3 text-sm text-zinc-900 focus:outline-none transition-colors"
                                >
                                  <option value="AI Ingestion">AI Ingestion</option>
                                  <option value="Next.js Portal">Next.js Portal</option>
                                  <option value="Spring Boot Backend">Spring Boot Backend</option>
                                  <option value="Other">Other Integration</option>
                                </select>
                              </div>

                              {/* Estimated Budget */}
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
                                  Estimated Budget
                                </label>
                                <select
                                  value={budget}
                                  onChange={(e) => setBudget(e.target.value)}
                                  className="w-full h-12 bg-[#FAFAFA] border border-zinc-200 focus:border-[#10B891] rounded-xl px-3 text-sm text-zinc-900 focus:outline-none transition-colors"
                                >
                                  <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                                  <option value="$15,000 - $35,000">$15,000 - $35,000</option>
                                  <option value="$35,000 - $75,000">$35,000 - $75,000</option>
                                  <option value="Enterprise ($75,000+)">Enterprise ($75,000+)</option>
                                </select>
                              </div>

                              {/* Desired Timeline */}
                              <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
                                  Desired Timeline
                                </label>
                                <select
                                  value={timeline}
                                  onChange={(e) => setTimeline(e.target.value)}
                                  className="w-full h-12 bg-[#FAFAFA] border border-zinc-200 focus:border-[#10B891] rounded-xl px-3 text-sm text-zinc-900 focus:outline-none transition-colors"
                                >
                                  <option value="< 1 Month">&lt; 1 Month</option>
                                  <option value="1-3 Months">1-3 Months</option>
                                  <option value="3-6 Months">3-6 Months</option>
                                  <option value="Long-term Support">Long-term Support</option>
                                </select>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Brief Input */}
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2">
                            Project Brief / Message <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            required
                            rows={5}
                            value={brief}
                            onChange={(e) => setBrief(e.target.value)}
                            placeholder={
                              formType === "project"
                                ? "Describe the system parameters, core requirements, integrations, and expected outcomes..."
                                : "Write your question or request..."
                            }
                            className="w-full bg-[#FAFAFA] border border-zinc-200 focus:border-[#10B891] placeholder-zinc-400 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none transition-colors resize-none"
                          />
                        </div>

                        {/* Error Banner */}
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 flex items-start gap-3 text-red-400"
                          >
                            <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                            <div>
                              <h4 className="text-sm font-bold">Verification Error</h4>
                              <p className="text-xs mt-0.5">{error}</p>
                            </div>
                          </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          disabled={loading}
                          className="w-full h-12 rounded-full bg-[#10B891] hover:bg-[#059669] text-zinc-900 font-bold text-sm shadow-lg shadow-[#10B891]/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <Send size={16} />
                          {loading ? "Transmitting payload..." : "Send Secure Message"}
                        </motion.button>

                      </motion.form>
                    ) : (
                      /* Success Alert */
                      <motion.div
                        key="success-container"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6 py-8 text-center max-w-lg mx-auto"
                      >
                        <div className="w-16 h-16 rounded-full bg-[#10B891]/10 border border-[#10B891]/30 flex items-center justify-center mx-auto text-[#10B891]">
                          <CheckCircle2 size={32} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-zinc-900">Transmission Successful</h3>
                          <p className="text-zinc-600 text-sm leading-relaxed">
                            Your enquiry payload has been logged in our secure telemetry system. A representative will contact you within one business day.
                          </p>
                        </div>

                        {isSimulated && (
                          <div className="p-3 bg-amber-950/20 border border-[#F59E0B]/30 rounded-lg text-[#F59E0B] text-xs flex items-center gap-2 justify-center">
                            <AlertTriangle size={14} className="shrink-0" />
                            <span>Offline Mode active: Telemetry stored in-memory fallback.</span>
                          </div>
                        )}

                        <div className="pt-4">
                          <button
                            onClick={handleReset}
                            className="px-6 h-11 rounded-full border border-zinc-200 hover:border-white/20 hover:bg-zinc-100 text-xs text-zinc-600 transition-all font-semibold cursor-pointer"
                          >
                            Send Another Query
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Information Matrix in Double Bezel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-4 p-1.5 bg-zinc-100/50 border border-zinc-200/80 rounded-[2.5rem] shadow-xl flex"
            >
              <div className="w-full bg-[#FAFAFA] border border-zinc-100 rounded-[calc(2.5rem-0.5rem)] p-6 md:p-8 flex flex-col justify-between shadow-inner">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
                      <Sparkles size={18} className="text-[#10B891]" />
                      Architect Blueprint
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      By submitting a scoped request, our system instantly compiles a telemetry state calculation. We enforce zero-trust policies: no keys, databases, or client endpoints are exposed during communications.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-[#FAFAFA] rounded-xl border border-zinc-200 space-y-2">
                      <span className="block text-[8px] font-semibold text-zinc-500 uppercase tracking-widest">Secure Payload</span>
                      <p className="text-xs font-semibold text-zinc-900 font-mono">TLS 1.3 / AES-256 Enabled</p>
                    </div>
                    <div className="p-4 bg-[#FAFAFA] rounded-xl border border-zinc-200 space-y-2">
                      <span className="block text-[8px] font-semibold text-zinc-500 uppercase tracking-widest">Average Response Time</span>
                      <p className="text-xs font-semibold text-zinc-900 font-mono">&lt; 12 Hours SLA</p>
                    </div>
                    <div className="p-4 bg-[#FAFAFA] rounded-xl border border-zinc-200 space-y-2">
                      <span className="block text-[8px] font-semibold text-zinc-500 uppercase tracking-widest">Rate Limit Active</span>
                      <p className="text-xs font-semibold text-[#10B891] font-mono">5 requests / hour / IP</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-200 mt-6 text-[10px] text-zinc-500 leading-relaxed">
                  Platform Class: Confidential Enterprise Ingestion. Submissions trigger automated container warmups to keep API gateways active.
                </div>
              </div>
            </motion.div>

          </div>
        </section>
      </div>
    </>
  );
}
