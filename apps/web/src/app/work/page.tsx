"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { fetchPortfolioItemsAction } from "@/app/actions";

export default function WorkPage() {
  const [dynamicPortfolios, setDynamicPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolio() {
      const res = await fetchPortfolioItemsAction();
      if (res.success && res.data) {
        setDynamicPortfolios(res.data);
      }
      setLoading(false);
    }
    loadPortfolio();
  }, []);

  const portfolios = [
    {
      title: "Enterprise Headless CMS & Marketing Hub",
      category: "Brand Website",
      status: "Production Live",
      badgeColor: "text-[#10B891] bg-[#10B891]/10 border-[#10B891]/30",
      description: "Re-engineered a legacy marketing portal into a fully headless architecture, yielding sub-millisecond static page delivery via Edge CDN networks and straight-green performance scores.",
      outboundUrl: "https://nextjs.org",
      linkLabel: "View Vercel Edge Demo",
      tech: ["Next.js App Router", "React 19", "Tailwind CSS", "Framer Motion"],
      metrics: {
        "Load Time": "-65%",
        "Conversion": "+24%",
        "Lighthouse": "99/100"
      }
    },
    {
      title: "Secure Document Ingestion (IDP) Pipeline",
      category: "Intelligent Systems",
      status: "Active Deployment",
      badgeColor: "text-[#10B891] bg-[#10B891]/10 border-[#10B891]/30",
      description: "Designed a multi-tenant file parser extracting database schemas from raw documents. Enforced Row-Level Security, Spring Security filters, and rate-limiting metrics.",
      outboundUrl: "https://supabase.com",
      linkLabel: "Inspect Storage Policies",
      tech: ["Spring Boot 3.x", "Java 17", "Supabase", "PostgreSQL"],
      metrics: {
        "Accuracy Rate": "99.2%",
        "Ingestion Speed": "1.2s",
        "Hours Saved": "1.2k/mo"
      }
    },
    {
      title: "Real-time Supply Chain Telemetry Center",
      category: "Industrial IoT",
      status: "Client Portal",
      badgeColor: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30",
      description: "Engineered a low-latency administrative cockpit tracking asset locations, processing telemetry updates via high-performance connection pools and WebSockets.",
      outboundUrl: "https://spring.io",
      linkLabel: "Review Backend Specs",
      tech: ["Java 17", "Spring Security", "WebSockets", "Hibernate"],
      metrics: {
        "Latency": "<50ms",
        "Concurrent Nodes": "10k+",
        "Uptime Audit": "99.99%"
      }
    }
  ];

  const testimonials = [
    {
      quote: "Bagpackers Developers built our Next.js portal, resulting in a 24% uptick in conversions. Their execution was flawless and completed ahead of schedule.",
      author: "Helena Rostova",
      title: "Chief Product Officer, Apex Fintech",
      rating: 5
    },
    {
      quote: "Their Spring Boot security configuration is top-tier. Whitelists, JWT parsing, and PostgreSQL RLS were configured seamlessly and verified in audits.",
      author: "Devon Miller",
      title: "VP of Security, Logistics Grid",
      rating: 5
    }
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Bagpackers Developers - Work Portfolio",
    "description": "Selected client case studies, testimonials, and live active production deployments.",
    "url": "https://bagpackers.dev/work",
    "hasPart": [
      ...portfolios.map(p => ({
        "@type": "CreativeWork",
        "name": p.title,
        "url": p.outboundUrl,
        "description": p.description
      })),
      ...dynamicPortfolios.map(d => ({
        "@type": "CreativeWork",
        "name": d.title,
        "url": "/work",
        "description": d.summary
      }))
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <div className="min-h-screen bg-[#FAFAFA] text-zinc-600 pb-24 overflow-x-hidden font-sans">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto w-full text-center md:text-left">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#10B891]/5 via-transparent to-transparent -z-10 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-[#10B891]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-ping" />
              Proven Production Architectures
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 leading-tight">
              Selected <span className="text-gradient">Production Work</span>
            </h1>
            <p className="text-zinc-600 text-lg md:text-xl leading-relaxed">
              Explore our portfolio of live client environments, enterprise platforms, and integrated backend infrastructures.
            </p>
          </motion.div>
        </section>

        {/* Portfolio Showcase Grid */}
        <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Dynamic DB Portfolios */}
            {dynamicPortfolios.map((item, idx) => (
              <motion.div
                key={`dyn-${item.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, borderColor: "#10B891", boxShadow: "0 15px 30px -10px rgba(16, 184, 145, 0.15)" }}
                className="bg-white border border-zinc-200 shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 relative border-[#10B891]/30"
              >
                {item.cover_image_url && (
                  <div className="h-44 w-full relative overflow-hidden border-b border-zinc-200">
                    <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Dynamic Case</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider text-emerald-600 bg-emerald-50 border-emerald-250">
                        Vetted & Published
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-900 hover:text-[#10B891] transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-4">
                      {item.summary}
                    </p>

                    {/* Tech Stack Tags */}
                    {item.tech_used && item.tech_used.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.tech_used.map((t: string) => (
                          <span key={t} className="text-[9px] font-semibold font-mono bg-zinc-50 border border-zinc-200 text-zinc-500 px-2 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#10B891] uppercase tracking-wider">Completed Build</span>
                    <span className="text-[9px] font-mono text-zinc-400">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Static baseline portfolios */}
            {portfolios.map((project, idx) => (
              <motion.div
                key={`static-${idx}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, borderColor: "#10B891", boxShadow: "0 15px 30px -10px rgba(124, 92, 252, 0.15)" }}
                className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{project.category}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${project.badgeColor}`}>
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 hover:text-[#10B891] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200/50">
                    {Object.entries(project.metrics).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider mb-1">{key}</span>
                        <span className="text-xs font-bold text-[#10B891] font-mono">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tech.map((t) => (
                      <span key={t} className="text-[9px] font-semibold font-mono bg-zinc-100 border border-zinc-200 text-zinc-500 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-200/50 mt-8 flex items-center justify-between">
                  <a
                    href={project.outboundUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#10B891] hover:bg-[#059669] rounded-lg shadow-md transition-all group"
                  >
                    <span>{project.linkLabel}</span>
                    <ExternalLink size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-zinc-900" />
                  </a>
                  <span className="text-[9px] font-mono text-zinc-500 truncate max-w-[120px]">{new URL(project.outboundUrl).hostname}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 border-t border-zinc-200/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Client Testimonials</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-sm leading-relaxed">
              Read how our engineering metrics translate directly to client satisfaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-8 relative space-y-6"
              >
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm italic text-zinc-700 leading-relaxed relative">
                  "{t.quote}"
                </p>
                <div className="border-t border-zinc-200/50 pt-4">
                  <h4 className="font-bold text-zinc-900 text-sm">{t.author}</h4>
                  <p className="text-xs text-zinc-500">{t.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
