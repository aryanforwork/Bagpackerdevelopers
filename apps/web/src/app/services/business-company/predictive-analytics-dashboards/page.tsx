"use client";

import React from "react";
import Link from "next/link";
import { Cpu, TrendingUp, Layers, Database, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PredictiveAnalyticsDashboardsPage() {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://bagpackers.dev/services/business-company/predictive-analytics-dashboards#software",
        "name": "Predictive Analytics Decision Portal",
        "applicationCategory": "BusinessIntelligenceApplication",
        "operatingSystem": "Cloud-Native",
        "description": "Enterprise dashboard system aggregating historical operational indicators to execute regression forecasting."
      },
      {
        "@type": "Service",
        "@id": "https://bagpackers.dev/services/business-company/predictive-analytics-dashboards#service",
        "name": "Metrics Architecture & Data Pipeline Engineering",
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
      title: "Data Warehouse Ingestion",
      desc: "Aggregating telemetry from isolated SQL tables, cloud warehouses (Snowflake, BigQuery), and customer platforms via secure middleware tunnels.",
      icon: <Database size={18} />,
      color: "#3B82F6",
      glow: "rgba(124, 92, 252, 0.15)"
    },
    {
      num: "02",
      title: "Regression & Forecasting Pipeline",
      desc: "Passing sanitized timeseries metrics to specialized mathematical workers (Prophet / Python Pandas clusters) to compute seasonal trend indicators.",
      icon: <TrendingUp size={18} />,
      color: "#60A5FA",
      glow: "rgba(34, 211, 238, 0.15)"
    },
    {
      num: "03",
      title: "Indexed API Aggregation",
      desc: "Compiling telemetry into highly responsive API response schemas, protected behind Redis caching policies to reduce database query strain.",
      icon: <Layers size={18} />,
      color: "#10B891",
      glow: "rgba(16, 184, 145, 0.15)"
    },
    {
      num: "04",
      title: "Interactive Client UI render",
      desc: "Rendering charts, metric grids, and dynamic forecast tables with high rendering efficiency using Client-side state controls and canvas-based graphics.",
      icon: <Cpu size={18} />,
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
          <Link href="/services/business-company" className="hover:text-[#10B891] transition-colors">Business Solutions</Link>
          <span>/</span>
          <span className="text-zinc-900">Predictive Analytics Dashboards</span>
        </nav>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-900"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping"></span>
            Executive Decision Portal
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6 leading-tight"
          >
            Predictive Business Analytics and <span className="text-gradient">Metric Dashboards</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed"
          >
            Accelerate your strategic planning. Model business operations, compute forecast intervals, and map database tables into responsive visual dashboards with sub-second execution speeds.
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
              Request Metrics Audit
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
              The Analytical Pipeline Architecture
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-xs leading-relaxed font-bold">
              An explicit technical breakdown of our warehouse ingestion, forecasting workers, and client interface layers.
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
              Comparing standard corporate business intelligence systems with our hyper-cached responsive portals.
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
                  <th className="p-4 text-xs font-bold text-zinc-500 tracking-wider uppercase">Standard BI Software</th>
                  <th className="p-4 text-xs font-bold text-[#10B891] tracking-wider uppercase">Bespoke Metrics Portal</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#27272A] text-zinc-600">
                <tr>
                  <td className="p-4 font-bold text-zinc-900">Query Execution Speed</td>
                  <td className="p-4">1.2s – 3.5s (Heavy warehouse aggregation lag)</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">Sub-85ms via Aggregated Partition Caches</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-900">Client Filter Limit</td>
                  <td className="p-4">Max 10 active parameters concurrently before locking</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">Unlimited (Multi-indexed spatial filters)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-900">Cache Hit Ratio</td>
                  <td className="p-4">40% – 45% (Unstructured storage strategies)</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">94% – 97% via Edge Redis Middleware</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* Back Link */}
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Link href="/services/business-company" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 hover:text-[#10B891] transition-colors">
            <ArrowLeft size={14} />
            Back to Business Category
          </Link>
        </div>
      </main>
    </>
  );
}
