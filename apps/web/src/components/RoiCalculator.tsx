"use client";

import { useState } from "react";
import { Save, CheckCircle2, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { escapeHtml } from "@/utils/security";
import { trackEvent } from "@/utils/telemetry";
import { submitLeadAction } from "@/app/actions";

export default function RoiCalculator() {
  const [company, setCompany] = useState("");
  const [manualHours, setManualHours] = useState(80);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calculations
  const automatedHours = manualHours * 0.15;
  const savedHours = Math.round(manualHours - automatedHours);
  const monthlySavings = Math.round(savedHours * hourlyRate);
  const annualSavings = monthlySavings * 12;
  const implementationCost = 24500;
  const netRoi = annualSavings - implementationCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedCompany = escapeHtml(company.trim());
    if (!sanitizedCompany) return;

    setSubmitting(true);
    const result = await submitLeadAction({
      company: sanitizedCompany,
      estimatedManualHours: manualHours,
      projectedRoi: netRoi > 0 ? netRoi : 0,
    });

    if (result.success) {
      setSuccess(true);
      trackEvent("lead_conversion_submit", {
        company_name: sanitizedCompany,
        estimated_annual_savings: annualSavings,
        net_roi: netRoi
      });
    }
    setSubmitting(false);
  };

  const handleSliderChange = (hours: number, rate: number) => {
    const saved = Math.round(hours * 0.75);
    const annual = saved * rate * 12;
    trackEvent("roi_calculator_change", {
      manual_hours: hours,
      hourly_rate: rate,
      projected_annual_savings: annual
    });
  };

  return (
    <motion.div 
      id="calculator" 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onViewportEnter={() => {
        trackEvent("roi_calculator_view", {
          event_category: "engagement",
          engagement_time_msec: Date.now()
        });
      }}
      className="w-full max-w-5xl mx-auto bg-[#18181B] rounded-2xl p-6 md:p-10 border border-[#27272A] shadow-xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Side: Inputs */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              Interactive ROI Calculator
              <HelpCircle size={16} className="text-[#CBD5E1] hover:text-[#10B891] cursor-pointer" />
            </h3>
            <p className="text-[#CBD5E1] text-sm mb-6 leading-relaxed">
              Estimate your operational efficiency gains and financial returns when automating document pipelines with our IDP agents.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] hover:border-[#475569] focus:border-[#10B891] rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Manual Hours Input Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] mb-2">
                  <span>Monthly Manual Labor</span>
                  <span className="text-[#10B891] font-mono font-bold text-sm">
                    {manualHours} hrs/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="2000"
                  step="10"
                  value={manualHours}
                  onChange={(e) => setManualHours(Number(e.target.value))}
                  onMouseUp={() => handleSliderChange(manualHours, hourlyRate)}
                  onTouchEnd={() => handleSliderChange(manualHours, hourlyRate)}
                  className="w-full h-1.5 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#10B891] hover:bg-[#475569] transition-colors"
                />
              </div>

              {/* Hourly Rate Input Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-[#CBD5E1] mb-2">
                  <span>Average Cost per Hour</span>
                  <span className="text-[#10B891] font-mono font-bold text-sm">
                    ${hourlyRate}/hr
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="150"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  onMouseUp={() => handleSliderChange(manualHours, hourlyRate)}
                  onTouchEnd={() => handleSliderChange(manualHours, hourlyRate)}
                  className="w-full h-1.5 bg-[#27272A] rounded-lg appearance-none cursor-pointer accent-[#10B891] hover:bg-[#475569] transition-colors"
                />
              </div>

              {/* Submit Lead Button */}
              {!success ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#10B891] hover:bg-[#059669] text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-md shadow-black/20"
                >
                  <Save size={16} />
                  {submitting ? "Submitting..." : "Lock in ROI Analysis"}
                </motion.button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-4 rounded-lg bg-emerald-950/20 border border-[#10B891]/30 flex items-start gap-3"
                >
                  <CheckCircle2 className="text-[#10B891] shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-[#10B891] text-sm font-bold">Proposal Consultation Requested!</h4>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Our automation team has locked your telemetry state. We will reach out within 24 hours.
                    </p>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>

        {/* Right Side: Outputs */}
        <div className="lg:col-span-6 bg-[#09090B] rounded-xl border border-[#27272A] p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Projected Savings Summary
              </span>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#18181B] rounded-lg border border-[#27272A]">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">
                    Monthly Saved Labor
                  </span>
                  <motion.span 
                    key={savedHours}
                    initial={{ scale: 0.92, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl font-bold text-white font-mono block"
                  >
                    {savedHours} hrs
                  </motion.span>
                </div>
                <div className="p-3 bg-[#18181B] rounded-lg border border-[#27272A]">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">
                    Monthly Savings
                  </span>
                  <motion.span 
                    key={monthlySavings}
                    initial={{ scale: 0.92, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl font-bold text-[#10B891] font-mono block"
                  >
                    ${monthlySavings.toLocaleString()}
                  </motion.span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#27272A] pt-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Annual Financial Impact
              </span>
              <div className="mt-3 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Projected Gross Savings</span>
                  <span className="font-semibold text-white font-mono">${annualSavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Implementation CapEx</span>
                  <span className="font-semibold text-red-400 font-mono">-${implementationCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#27272A] pt-6 mt-6">
            <span className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
              Projected Net First Year ROI
            </span>
            <motion.span 
              key={netRoi}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-4xl md:text-5xl font-black font-mono text-gradient block"
            >
              ${netRoi > 0 ? netRoi.toLocaleString() : "0"}
            </motion.span>
            <div className="mt-4 text-[10px] text-slate-400 leading-relaxed">
              *Calculated with a conservative automation confidence benchmark of 75%. Actual returns may scale dynamically based on ingestion format densities.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
