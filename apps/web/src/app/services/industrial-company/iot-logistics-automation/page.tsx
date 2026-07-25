"use client";

import React from "react";
import Link from "next/link";
import { Cpu, Wifi, Database, Layers, ArrowLeft, ShieldCheck, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function IotLogisticsAutomationPage() {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://bagpackers.dev/services/industrial-company/iot-logistics-automation#software",
        "name": "High-Throughput IoT & Logistics Telemetry System",
        "applicationCategory": "HardwareAutomationApplication",
        "operatingSystem": "Linux Edge Node / Kubernetes",
        "description": "Enterprise-grade IoT event pipeline processing millions of sensor messages per second with TimescaleDB storage and Kafka-driven ingestion."
      },
      {
        "@type": "Service",
        "@id": "https://bagpackers.dev/services/industrial-company/iot-logistics-automation#service",
        "name": "IoT Infrastructure & Warehouse Automation Engineering",
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
      title: "Edge Sensor Ingestion",
      desc: "Deploying high-frequency MQTT, CoAP, and HTTP/2 packet listeners. Custom edge gateways ingest serial data streams, RFID telemetry, and coordinate feeds.",
      icon: <Wifi size={18} />,
      color: "#3B82F6",
      glow: "rgba(124, 92, 252, 0.15)"
    },
    {
      num: "02",
      title: "Event Normalization & Sanitization",
      desc: "Validating data schema structures, matching hardware protocols, and filtering out high-noise interference spikes on the stream in memory via Redis.",
      icon: <Layers size={18} />,
      color: "#60A5FA",
      glow: "rgba(34, 211, 238, 0.15)"
    },
    {
      num: "03",
      title: "TimescaleDB Cluster Partitioning",
      desc: "Persisting cleaned metrics into high-performance timeseries tables, hyper-indexed to process hundreds of thousands of concurrent writes without locking.",
      icon: <Database size={18} />,
      color: "#10B891",
      glow: "rgba(16, 184, 145, 0.15)"
    },
    {
      num: "04",
      title: "Live Portal & Map Orchestration",
      desc: "Streaming dashboard visual data over WebSockets or Next.js SSE channels. Features geographic mapping, alerts triggers, and predictive delay graphs.",
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
          <Link href="/services/industrial-company" className="hover:text-[#10B891] transition-colors">Industrial Solutions</Link>
          <span>/</span>
          <span className="text-zinc-900">IoT & Logistics Automation</span>
        </nav>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-900"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-ping"></span>
            Real-time Telemetry Pipeline
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6 leading-tight"
          >
            Connect physical logistics to <span className="text-gradient">Real-Time Ingestion Tunnels</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed"
          >
            Eliminate operational blackout. Establish high-throughput pipelines aggregating telemetry from active trackers, automated cargo scanners, and inventory sensors directly to modern web frontends.
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
              Request Telemetry Audit
            </Link>
            <Link 
              href="/services" 
              className="px-6 py-3 text-xs font-bold bg-white hover:bg-[#27272A] border border-zinc-200 rounded transition-all text-zinc-900 active:scale-[0.98]"
            >
              Explore Other Services
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
              The Logistics Telemetry Architecture
            </h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-xs leading-relaxed font-bold">
              An explicit technical breakdown of our streaming ingestion, sanitization, and timeseries indexer.
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
              Contrasting standard cloud queue protocols with our bespoke, hyper-threaded event tunnels.
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
                  <th className="p-4 text-xs font-bold text-zinc-500 tracking-wider uppercase">Standard HTTP Queue</th>
                  <th className="p-4 text-xs font-bold text-[#10B891] tracking-wider uppercase">Hyper-Ingestion Tunnel</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#27272A] text-zinc-600">
                <tr>
                  <td className="p-4 font-bold text-zinc-900">Edge-to-Server Latency</td>
                  <td className="p-4">150ms – 500ms (High overhead on standard pooling)</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">Sub-5ms via Native TCP & Kafka Streams</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-900">Telemetry Packet Loss</td>
                  <td className="p-4">1.2% – 2.0% under network saturation</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">Sub-0.0001% (Broker-level acknowledgments)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-900">Scale Cap (Active nodes)</td>
                  <td className="p-4">Up to 5,000 concurrent listeners before rate bottlenecks</td>
                  <td className="p-4 text-[#10B891] font-bold font-mono">150,000+ Active Edge Sensors</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </section>

        {/* Back Link */}
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Link href="/services/industrial-company" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-700 hover:text-[#10B891] transition-colors">
            <ArrowLeft size={14} />
            Back to Industrial Category
          </Link>
        </div>
      </main>
    </>
  );
}
