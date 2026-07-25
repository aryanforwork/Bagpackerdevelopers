"use client";

import React from "react";
import Link from "next/link";
import { Cpu, ArrowLeft, ArrowRight, Eye, Wifi, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function IndustrialCompanyPage() {
  const subroutes = [
    {
      name: "IoT & Logistics Automation",
      href: "/services/industrial-company/iot-logistics-automation",
      desc: "Connect physical tracking networks and warehouse systems with high-throughput MQTT, Apache Kafka, and active database ingestion tunnels.",
      icon: <Wifi className="text-[#10B891]" size={20} />,
      badge: "Edge & Telemetry"
    },
    {
      name: "Computer Vision Quality Control",
      href: "/services/industrial-company/computer-vision-quality-control",
      desc: "Deploy neural networks directly onto high-speed assembly line cameras to isolate fabrication defects, damage, or anomalies in sub-10ms intervals.",
      icon: <Eye className="text-[#10B891]" size={20} />,
      badge: "Real-time AI Model"
    }
  ];

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://bagpackers.dev/services/industrial-company#collection",
    "name": "Industrial IoT & AI Automation Services",
    "description": "High-throughput telemetry integrations, edge computer vision systems, and logistics automation solutions for modern manufacturing enterprises.",
    "publisher": {
      "@type": "Organization",
      "name": "Bagpackers Developers",
      "url": "https://bagpackers.dev"
    },
    "hasPart": subroutes.map(route => ({
      "@type": "WebPage",
      "name": route.name,
      "url": `https://bagpackers.dev${route.href}`,
      "description": route.desc
    }))
  };

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
          <span className="text-zinc-900">Industrial Solutions</span>
        </nav>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-900"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B891] animate-ping"></span>
            Hardware & Edge Software Vertical
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6 leading-tight"
          >
            Industrial Automation & <span className="text-gradient">Edge Telemetry</span>.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed"
          >
            We bridge physical operations and software systems. By implementing high-frequency telemetry parsers, IoT message brokers, and custom visual inspection neural nets, we maximize production velocity.
          </motion.p>
        </section>

        <hr className="border-zinc-200 max-w-6xl mx-auto" />

        {/* Sub-routes Display Section */}
        <section className="max-w-5xl mx-auto px-6 py-20 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subroutes.map((route, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ 
                  y: -5,
                  borderColor: idx === 0 ? "#60A5FA" : "#10B891",
                  boxShadow: `0 10px 25px -5px ${idx === 0 ? "rgba(34, 211, 238, 0.15)" : "rgba(16, 184, 145, 0.15)"}`
                }}
                className="glass-panel p-6 rounded-2xl border border-zinc-200 bg-white cursor-pointer flex flex-col justify-between h-full group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded bg-[#FAFAFA] border border-zinc-200/50 flex items-center justify-center">
                      {route.icon}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-zinc-200/50 bg-zinc-100/50 text-zinc-600 font-mono tracking-wider">
                      {route.badge}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 group-hover:text-[#10B891] transition-colors flex items-center gap-1.5 uppercase tracking-wide">
                    {route.name}
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#10B891]" />
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    {route.desc}
                  </p>
                </div>
                
                <div className="pt-6 flex justify-end">
                  <Link 
                    href={route.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#10B891] hover:text-zinc-900 transition-colors"
                  >
                    View Engineering Specs
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Back Link */}
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Link href="/services" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 hover:text-[#10B891] transition-colors">
            <ArrowLeft size={14} />
            Back to Category Catalog
          </Link>
        </div>
      </main>
    </>
  );
}
