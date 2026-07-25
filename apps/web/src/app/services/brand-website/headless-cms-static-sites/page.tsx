"use client";

import React from "react";
import Link from "next/link";
import { Cpu, LayoutGrid, Globe, Zap, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function HeadlessCmsStaticSitesPage() {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://bagpackers.dev/services/brand-website/headless-cms-static-sites#software",
        "name": "Headless CMS & Incremental Static Generation Architecture",
        "applicationCategory": "ContentManagementApplication",
        "operatingSystem": "Cloud-Native",
        "description": "Enterprise headless static site architecture integrating modern CMS databases with incremental regeneration."
      },
      {
        "@type": "Service",
        "@id": "https://bagpackers.dev/services/brand-website/headless-cms-static-sites#service",
        "name": "Headless Web Engineering & Content Pipelines",
        "provider": {
          "@type": "Organization",
          "name": "Bagpackers Developers",
          "url": "https://bagpackers.dev"
        }
      }
    ]
  };

  const steps = [
    {
      num: "01",
      title: "Content Modeling & API Schemas",
      desc: "Architecting flexible, component-driven schemas in headless systems (Sanity, Strapi). Organizes copy, metadata, and assets into queryable endpoints.",
      icon: <LayoutGrid size={18} />,
      color: "#EC4899",
      glow: "rgba(236, 72, 153, 0.15)"
    },
    {
      num: "02",
      title: "Incremental Static Generation",
      desc: "Next.js queries APIs and compiles web pages into static HTML/JSON during build time, reducing active backend load to zero during customer visits.",
      icon: <Cpu size={18} />,
      color: "#60A5FA",
      glow: "rgba(34, 211, 238, 0.15)"
    },
    {
      num: "03",
      title: "Edge CDN Delivery & Cache Routing",
      desc: "Routing static pages through global edge servers. Visitors request documents from localized CDNs, achieving near-zero latency.",
      icon: <Globe size={18} />,
      color: "#10B891",
      glow: "rgba(16, 184, 145, 0.15)"
    },
    {
      num: "04",
      title: "Preview Tunnels & Webhook Revalidation",
      desc: "Updating pages dynamically. Content edits in the CMS trigger background revalidation webhooks to refresh edge cache nodes without full redeploys.",
      icon: <Zap size={18} />,
      color: "#F59E0B",
      glow: "rgba(245, 158, 11, 0.15)"
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <main className="min-h-screen bg-[#FAFAFA] text-zinc-600 antialiased selection:bg-[#10B891]/30 selection:text-zinc-900 pb-20 overflow-x-hidden">
        
        {/* Navigation Breadcrumb Tracker */}
        <nav className="max-w-6xl mx-auto px-6 pt-8 text-xs font-bold text-zinc-500 flex items-center gap-1.5 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#10B891] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#10B891] transition-colors">Services</Link>
          <span>/</span>
          <Link href="/services/brand-website" className="hover:text-[#10B891] transition-colors">Brand Website Solutions</Link>
          <span>/</span>
          <span className="text-zinc-900">Headless CMS & Static Sites</span>
        </nav>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-900"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] animate-ping"></span>
            Performance Architecture
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6 leading-tight"
          >
            Incremental Static Generation and <span className="text-gradient">Headless Content Systems</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed"
          >
            Accelerate your content. We link modern CMS architectures with Next.js page generation pipelines to deliver pages instantly, de-risking high traffic surges.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Link 
              href="/#calculator" 
              className="px-6 py-3 text-xs font-bold bg-[#10B891] hover:bg-[#059669] text-zinc-900 rounded transition-all shadow-lg shadow-[#3B82F6]/20 active:scale-[0.98]"
            >
              Request Performance Audit
            </Link>
            <Link 
              href="/services" 
              className="px-6 py-3 text-xs font-bold bg-white hover:bg-[#27272A] border border-zinc-200 rounded transition-all text-zinc-900 active:scale-[0.98]"
            >
              Explore Services
            </Link>
          </motion.div>
        </section>

        <hr className="border-zinc-200 max-w-6xl mx-auto" />

        {/* The Core Technical Pipeline Breakdown */}
        <section className="max-w-6xl mx-auto px-6 py-20 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
              The Headless Site Architecture
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-xs leading-relaxed font-bold">
              An explicit technical breakdown of content mapping, static compilation, CDN routing, and webhook updates.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ 
                  y: -5, 
                  borderColor: step.color,
                  boxShadow: `0 10px 25px -5px ${step.glow}`
                }}
                className="glass-panel p-6 border border-zinc-200 bg-white flex flex-col justify-between h-full cursor-pointer transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-500">Step {step.num}</span>
                    <div className="w-8 h-8 rounded bg-[#FAFAFA] border border-zinc-200/50 flex items-center justify-center text-zinc-900">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">{step.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <hr className="border-zinc-200 max-w-6xl mx-auto" />

        {/* Concrete Operational Value Matrix */}
        <section className="max-w-4xl mx-auto px-6 py-20 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-2"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
              Performance Verification Matrix
            </h2>
            <p className="text-xs text-zinc-500 font-bold">
              Comparing legacy database-driven page renders with edge-delivered static architectures.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-xl border border-zinc-200 shadow-lg"
          >
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="border-b border-zinc-200 bg-[#FAFAFA]">
                  <th className="p-4 text-xs font-bold text-zinc-900 tracking-wider uppercase">Operational Variable</th>
                  <th className="p-4 text-xs font-bold text-zinc-500 tracking-wider uppercase">Monolithic CMS (e.g. WordPress)</th>
                  <th className="p-4 text-xs font-bold text-[#10B891] tracking-wider uppercase">Headless Static Site</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#27272A] text-zinc-600">
                <tr>
                  <td className="p-4 font-bold text-zinc-900">Lighthouse Performance</td>
                  <td className="p-4">45% – 65% (Heavy database queries & plugin clutter)</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">98% – 100% Score (Fully optimized assets)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-900">Time to First Byte (TTFB)</td>
                  <td className="p-4">200ms – 600ms (Database lookup bottlenecks)</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">Sub-15ms (Edge CDN Cache Delivery)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-900">Load Time Under Traffic</td>
                  <td className="p-4">3.2s – 8.0s (Prone to server crashes under load)</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">Sub-1.2s constant load speed</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* Back Link */}
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Link href="/services/brand-website" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 hover:text-[#10B891] transition-colors">
            <ArrowLeft size={14} />
            Back to Brand Website Category
          </Link>
        </div>
      </main>
    </>
  );
}
