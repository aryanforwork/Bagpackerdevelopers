"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProjectAction } from "@/app/actions";
import { ArrowLeft, Loader2, Plus, ShieldCheck, AlertCircle } from "lucide-react";

const projectFormSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  fieldOfWork: z.string().min(1, "Please select a field of work."),
  estimatedDuration: z.string().min(1, "Please select an estimated duration."),
  estimatedBudget: z.string().min(1, "Budget must be greater than zero."),
  budgetCurrency: z.string().min(1, "Please select a budget currency."),
  clientConsentPublic: z.boolean().default(false),
});

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: "",
      description: "",
      fieldOfWork: "AI Integration & Automation",
      estimatedDuration: "1 Month",
      estimatedBudget: "",
      budgetCurrency: "USD",
      clientConsentPublic: false,
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    const payload = {
      ...data,
      estimatedBudget: Number(data.estimatedBudget) || 0
    };

    const result = await createProjectAction(payload);

    if (!result.success) {
      setError(result.error || "Failed to submit project scoping form.");
      setLoading(false);
      return;
    }

    router.push("/dashboard/client");
    router.refresh();
  };

  return (
    <div className="flex-1 bg-[#FAFAFA] text-zinc-950 p-8 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/dashboard/client"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">Scope New Project</h1>
          <p className="text-xs text-zinc-400">Establish the operational requirements, budget brackets, and target timelines.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2.5rem] shadow-sm flex">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full bg-white border border-white/40 rounded-[calc(2.5rem-0.25rem)] p-8 shadow-inner space-y-6"
          >
            {/* Project Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="projectName">
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                {...register("projectName")}
                placeholder="Enterprise Document Ingestion Pipeline"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] focus:ring-1 focus:ring-[#10B891]/20 transition-all"
              />
              {errors.projectName && (
                <p className="text-[10px] text-red-500 font-medium">{errors.projectName.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="description">
                Complete Project Description
              </label>
              <textarea
                id="description"
                rows={5}
                {...register("description")}
                placeholder="Outline the detailed architecture parameters, goals, user flows, and integration interfaces needed..."
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] focus:ring-1 focus:ring-[#10B891]/20 transition-all"
              />
              {errors.description && (
                <p className="text-[10px] text-red-500 font-medium">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Field of Work */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="fieldOfWork">
                  Field of Work
                </label>
                <select
                  id="fieldOfWork"
                  {...register("fieldOfWork")}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] transition-all"
                >
                  <option value="AI Integration & Automation">AI Integration & Automation</option>
                  <option value="Enterprise Software & Middleware">Enterprise Software & Middleware</option>
                  <option value="Industrial & IoT Systems">Industrial & IoT Systems</option>
                  <option value="Creative Web Development">Creative Web Development</option>
                  <option value="Digital Marketing Solutions">Digital Marketing Solutions</option>
                </select>
                {errors.fieldOfWork && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.fieldOfWork.message}</p>
                )}
              </div>

              {/* Estimated Duration */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="estimatedDuration">
                  Projected Completion Duration
                </label>
                <select
                  id="estimatedDuration"
                  {...register("estimatedDuration")}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] transition-all"
                >
                  <option value="1 Month">1 Month</option>
                  <option value="2-3 Months">2-3 Months</option>
                  <option value="3-6 Months">3-6 Months</option>
                  <option value="6 Months+">6 Months+</option>
                </select>
                {errors.estimatedDuration && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.estimatedDuration.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Estimated Budget */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="estimatedBudget">
                  Estimated Budget
                </label>
                <input
                  id="estimatedBudget"
                  type="number"
                  {...register("estimatedBudget")}
                  placeholder="5000"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] focus:ring-1 focus:ring-[#10B891]/20 transition-all"
                />
                {errors.estimatedBudget && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.estimatedBudget.message}</p>
                )}
              </div>

              {/* Budget Currency */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="budgetCurrency">
                  Currency
                </label>
                <select
                  id="budgetCurrency"
                  {...register("budgetCurrency")}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#10B891] transition-all"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                {errors.budgetCurrency && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.budgetCurrency.message}</p>
                )}
              </div>
            </div>

            {/* Portfolio Consent */}
            <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200/50 rounded-2xl">
              <input
                id="clientConsentPublic"
                type="checkbox"
                {...register("clientConsentPublic")}
                className="mt-0.5 rounded border-zinc-300 text-[#10B891] focus:ring-[#10B891]"
              />
              <div className="space-y-0.5">
                <label htmlFor="clientConsentPublic" className="text-xs font-bold text-zinc-950">
                  Allow Public Showcase
                </label>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Checking this gives Bagpackers Developers authorization to showcase anonymized metrics and architecture diagrams in our public work portal once completed.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#09090B] text-white hover:bg-zinc-800 disabled:bg-zinc-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  Submitting Proposal...
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Submit Project Scope
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
