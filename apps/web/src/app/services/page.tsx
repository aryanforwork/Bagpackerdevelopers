"use client";

import React from "react";
import Link from "next/link";
import { Cpu, ArrowRight, Brain, Settings, Database, Monitor, ChevronRight, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesPage() {
  const categories = [
    {
      title: "Core AI & Automation",
      desc: "Deploy intelligent agents, contextual document processors, and grounded knowledge bases.",
      icon: <Brain className="text-[#10B891]" size={22} />,
      links: [
        { name: "Intelligent Document Processing", href: "/services/intelligent-document-processing", desc: "OCR pipelines converting noisy docs to structured SQL databases." },
        { name: "Retrieval-Augmented Generation (RAG)", href: "/services/retrieval-augmented-generation", desc: "Semantic vector databases connecting enterprise wikis to LLMs." }
      ]
    },
    {
      title: "Enterprise Middleware & SaaS",
      desc: "Establish secure data tunnels, SaaS portal systems, and custom multi-tenant architectures.",
      icon: <Database className="text-[#10B891]" size={22} />,
      links: [
        { name: "Custom CRM & ERP Integrations", href: "/services/custom-crm-erp-integrations", desc: "Connecting Next.js frontends to legacy enterprise systems safely." },
        { name: "Multitenant SaaS Portals", href: "/services/multitenant-saas-portals", desc: "High-performance SaaS application structures with active isolation layers." }
      ]
    },
    {
      title: "Industrial Solutions",
      desc: "Connect physical operational telemetry to visual dashboards and computer vision node systems.",
      icon: <Cpu className="text-[#10B891]" size={22} />,
      viewAllHref: "/services/industrial-company",
      links: [
        { name: "IoT & Logistics Automation", href: "/services/industrial-company/iot-logistics-automation", desc: "Real-time MQTT sensors linked with automation pipelines." },
        { name: "Computer Vision Quality Control", href: "/services/industrial-company/computer-vision-quality-control", desc: "Automated defect checking using high-frequency visual models." }
      ]
    },
    {
      title: "Business Solutions",
      desc: "Synthesize operational metrics and maintain structural compliance utilizing grounded analytics.",
      icon: <Settings className="text-[#F59E0B]" size={22} />,
      viewAllHref: "/services/business-company",
      links: [
        { name: "Predictive Analytics Dashboards", href: "/services/business-company/predictive-analytics-dashboards", desc: "Interactive intelligence hubs modeling historical trends." },
        { name: "Regulatory Compliance RAG", href: "/services/business-company/regulatory-compliance-rag", desc: "Hallucination-free compliance verification and rule check." }
      ]
    },
    {
      title: "Brand Website Solutions",
      desc: "Deliver premium web portals combining static performance with interactive three-dimensional visuals.",
      icon: <Monitor className="text-[#EC4899]" size={22} />,
      viewAllHref: "/services/brand-website",
      links: [
        { name: "Headless CMS & Static Sites", href: "/services/brand-website/headless-cms-static-sites", desc: "Incremental static generation scaling to millions of visitors." },
        { name: "Immersive WebGL Portals", href: "/services/brand-website/immersive-webgl-portals", desc: "Complex 3D graphics rendered natively at 60 FPS in browsers." }
      ]
    },
    {
      title: "Digital Marketing Solutions",
      desc: "Maximize search visibility, orchestrate paid campaign funnels, and build automated lead generation.",
      icon: <Megaphone className="text-[#E8823A]" size={22} />,
      viewAllHref: "/services/digital-marketing",
      links: [
        { name: "Search Engine Optimization", href: "/services/digital-marketing/seo", desc: "Drive high-intent organic traffic via deep technical optimization." },
        { name: "Paid Advertising & Funnels", href: "/services/digital-marketing/paid-ads", desc: "Optimize ad spend across networks with closed-loop tracking." },
        { name: "Marketing Automation & CRMs", href: "/services/digital-marketing/marketing-automation", desc: "Integrate CRM routing and nurture flows to convert incoming leads." }
      ]
    }
  ];

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://bagpackers.dev/services#collection",
    "name": "Enterprise Software Engineering & AI Services",
    "description": "Explore Bagpackers Developers' services, ranging from custom AI pipelines and enterprise software integrations to industrial IoT, business dashboards, and premium headless websites.",
    "publisher": {
      "@type": "Organization",
      "name": "Bagpackers Developers",
      "url": "https://bagpackers.dev"
    },
    "hasPart": categories.flatMap(cat => cat.links.map(link => ({
      "@type": "WebPage",
      "name": link.name,
      "url": `https://bagpackers.dev${link.href}`,
      "description": link.desc
    })))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <main className="min-h-screen bg-[#FAFAFA] text-zinc-700 antialiased pb-20 overflow-x-hidden">
        {/* Navigation Breadcrumb Tracker */}
        <nav className="max-w-[1440px] mx-auto px-6 pt-8 text-[10px] font-bold text-zinc-500 flex items-center gap-1.5 uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-[#10B891] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-900">Services</span>
        </nav>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-900"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B891] animate-pulse"></span>
            Enterprise Architecture Suite
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-tight"
          >
            Our Service Categories & <span className="text-gradient">Core Capabilities</span>.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed"
          >
            We design, develop, and deploy production-grade software solutions. Select a category below to explore specific technological architectures and implementation pipelines.
          </motion.p>
        </section>

        <hr className="border-zinc-200 max-w-[1440px] mx-auto" />

        {/* Categories Grid */}
        <section className="max-w-[1440px] mx-auto px-6 py-20 space-y-16">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="p-1.5 bg-zinc-100/50 border border-zinc-200/80 rounded-[2.5rem] shadow-xl relative overflow-hidden"
            >
              <div className="bg-[#FAFAFA] border border-zinc-100 rounded-[calc(2.5rem-0.5rem)] p-6 md:p-8 shadow-inner">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                  <div className="space-y-3 max-w-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-zinc-200 flex items-center justify-center">
                        {cat.icon}
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight uppercase">
                        {cat.title}
                      </h2>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed font-semibold">
                      {cat.desc}
                    </p>
                  </div>
                  
                  {cat.viewAllHref && (
                    <Link 
                      href={cat.viewAllHref}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B891] hover:text-[#10B891] transition-colors"
                    >
                      View Category Page
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>

                {/* Nested Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cat.links.map((link, linkIdx) => (
                    <motion.div
                      key={linkIdx}
                      className="p-1.5 bg-zinc-50 border border-zinc-200/50 rounded-2xl flex hover:border-blue-500/20 transition-all duration-300 group"
                    >
                      <div className="w-full bg-[#FAFAFA] border border-zinc-200/50 rounded-[calc(1rem)] p-5 flex flex-col justify-between shadow-inner">
                        <div className="space-y-2">
                          <h3 className="text-sm font-extrabold text-zinc-900 group-hover:text-[#10B891] transition-colors flex items-center gap-1">
                            {link.name}
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#10B891]" />
                          </h3>
                          <p className="text-xs text-zinc-600 leading-relaxed">
                            {link.desc}
                          </p>
                        </div>
                        <div className="pt-4 flex justify-end">
                          <Link 
                            href={link.href}
                            className="text-xs font-bold text-zinc-500 hover:text-[#10B891] transition-colors flex items-center gap-1"
                          >
                            Deep Dive
                            <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* CTA Footnote */}
        <section className="max-w-4xl mx-auto px-6 text-center space-y-6 pb-12">
          <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-widest">
            Ready to deploy digital excellence?
          </h3>
          <div className="flex justify-center gap-4">
            <Link 
              href="/#calculator"
              className="px-6 h-12 inline-flex items-center justify-center text-xs font-bold bg-[#10B891] hover:bg-[#059669] text-zinc-900 rounded-full transition-all shadow-lg active:scale-[0.98]"
            >
              Request Custom Feasibility Audit
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
