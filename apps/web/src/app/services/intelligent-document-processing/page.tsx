import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Cpu, FileText, Database, ShieldAlert, ArrowLeft, Terminal } from "lucide-react";

// 1. Technical SEO & GEO Metadata Configuration
export const metadata: Metadata = {
  title: "Intelligent Document Processing (IDP) | Enterprise Data Automation",
  description: "Convert unstructured printed directories, industrial logs, and legacy ledgers into production-grade relational SQL databases with zero latency via our AI-powered multimodal OCR pipeline.",
  alternates: {
    canonical: "https://bagpackers.dev/services/intelligent-document-processing",
  },
};

export default function IDPServicePage() {
  // 2. Advanced JSON-LD Semantic Schema Integration
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://bagpackers.dev/services/intelligent-document-processing#software",
        "name": "Intelligent Document Processing Pipeline",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Cloud-Native",
        "description": "An AI-powered Multimodal Optical Character Recognition (OCR) and document pipeline converting unstructured printed directories into structured relational database formats."
      },
      {
        "@type": "Service",
        "@id": "https://bagpackers.dev/services/intelligent-document-processing#service",
        "name": "AI Workflow Automation & Agent Architecture",
        "provider": {
          "@type": "Organization",
          "name": "Bagpackers Developers",
          "url": "https://bagpackers.dev",
          "areaServed": {
            "@type": "Country",
            "name": "Global"
          }
        }
      }
    ]
  };

  return (
    <>
      {/* Injecting Semantic Schema Directly into Head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <main className="min-h-screen bg-[#FAFAFA] text-zinc-600 antialiased selection:bg-[#10B891]/30 selection:text-zinc-900 pb-20">
        
        {/* Navigation Breadcrumb Tracker */}
        <nav className="max-w-6xl mx-auto px-6 pt-8 text-xs font-semibold text-zinc-500 flex items-center gap-1.5 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#10B891] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#10B891]">Services</span>
          <span>/</span>
          <span className="text-zinc-900 font-bold">Intelligent Document Processing</span>
        </nav>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B891] animate-ping"></span>
            Production-Ready AI Pipeline
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-6 leading-tight">
            We engineer high-performance web applications and <span className="text-gradient">autonomous AI pipelines</span>.
          </h1>
          <p className="text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Stop losing vital corporate velocity to physical data bottlenecks. Transform unstructured printed media, text directories, and noisy layouts into sanitized, indexed SQL structures directly inside your cloud cluster.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              href="/sandbox" 
              className="px-6 py-3 text-xs font-semibold bg-[#10B891] hover:bg-[#059669] text-zinc-900 rounded transition-all shadow-lg active:scale-[0.98]"
            >
              Test Live Sandbox
            </Link>
            <Link 
              href="/#calculator" 
              className="px-6 py-3 text-xs font-semibold bg-white hover:bg-[#27272A] border border-zinc-200 rounded transition-all text-zinc-600 active:scale-[0.98]"
            >
              Request Infrastructure Audit
            </Link>
          </div>
        </section>

        <hr className="border-zinc-200 max-w-6xl mx-auto" />

        {/* The Core Technical Pipeline Breakdown */}
        <section className="max-w-6xl mx-auto px-6 py-20 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
              The Multimodal OCR & Normalization Architecture
            </h2>
            <p className="text-zinc-600 max-w-xl mx-auto text-xs leading-relaxed">
              An explicit technical breakdown detailing exactly how unstructured visual payloads transition reliably to production databases.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="glass-panel p-6 border border-zinc-200 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="w-8 h-8 rounded bg-[#10B891]/10 border border-[#10B891]/20 text-[#10B891] flex items-center justify-center font-bold text-xs font-mono">
                  01
                </div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Data Ingestion</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Asynchronous payload ingestion processing high-noise physical media prints. Accommodates spatial distortion, lighting variants, and complex layouts.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6 border border-zinc-200 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="w-8 h-8 rounded bg-[#10B891]/10 border border-[#60A5FA]/20 text-[#10B891] flex items-center justify-center font-bold text-xs font-mono">
                  02
                </div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Processing Node</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Computer vision parsing algorithms isolating nested table blocks, multi-level headers, and text sequences. Discards chromatic anomalies and geometric skewing.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6 border border-zinc-200 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="w-8 h-8 rounded bg-[#10B891]/10 border border-[#10B891]/20 text-[#10B891] flex items-center justify-center font-bold text-xs font-mono">
                  03
                </div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">LLM Sanitization</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  An LLM sanitization layer mapping typographical edge cases, correcting historical syntax flaws, and structuring values into type-defined objects.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-panel p-6 border border-zinc-200 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="w-8 h-8 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs font-mono">
                  04
                </div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">SQL Compiler</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Compiles the telemetry directly into transactional, context-aware SQL injection-safe syntax schema strings, running atomic `UPSERT` queries.
                </p>
              </div>
            </div>

          </div>
        </section>

        <hr className="border-zinc-200 max-w-6xl mx-auto" />

        {/* Concrete Operational Value Matrix */}
        <section className="max-w-4xl mx-auto px-6 py-20 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
              Performance Verification Matrix
            </h2>
            <p className="text-xs text-zinc-600">
              Comparing structural human workflows with deep programmatic automation metrics.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-lg">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="border-b border-zinc-200 bg-[#FAFAFA]">
                  <th className="p-4 text-xs font-bold text-zinc-900 tracking-wider uppercase">Operational Variable</th>
                  <th className="p-4 text-xs font-bold text-zinc-500 tracking-wider uppercase">Legacy Data Entry</th>
                  <th className="p-4 text-xs font-bold text-[#10B891] tracking-wider uppercase">Custom IDP Architecture</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#27272A] text-zinc-600">
                <tr>
                  <td className="p-4 font-bold text-zinc-900">Execution Velocity</td>
                  <td className="p-4">10 to 15 Minutes Per Raw Catalog Page</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">Sub-3 Seconds Per Page Payload</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-900">System Data Error Variance</td>
                  <td className="p-4">8% – 12% Manual Entry Attenuation</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">Near 0% via Verification Engine Loop</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-900">Resource Scaling Boundary</td>
                  <td className="p-4">Linear Cost Requirements (Staff Dependent)</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">Infinite Scale via Concurrent Pods</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
