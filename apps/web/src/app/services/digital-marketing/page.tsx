"use client";

import React from "react";
import Link from "next/link";
import { Search, Megaphone, FileText, Share2, Settings, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function DigitalMarketingPage() {
  const subroutes = [
    {
      name: "Search Engine Optimization (SEO)",
      href: "/services/digital-marketing/seo",
      desc: "Drive sustainable organic traffic. We conduct deep technical SEO audits, implement structured schema.org markup, optimize site architecture, and engineer passaged-level indexability for AI Overviews.",
      icon: <Search className="text-[#C1622C]" size={20} />,
      badge: "Organic Growth"
    },
    {
      name: "Paid Advertising Campaigns",
      href: "/services/digital-marketing/paid-ads",
      desc: "Maximize return on ad spend (ROAS). We design, launch, and continuously optimize search, display, and social media campaigns powered by unified conversion tracking.",
      icon: <Megaphone className="text-[#E8823A]" size={20} />,
      badge: "High Conversion"
    },
    {
      name: "Content Marketing Funnels",
      href: "/services/digital-marketing/content-marketing",
      desc: "Build authority and trust. Our team creates strategic hub-and-spoke content clusters mapping to client search intent and user personas to feed lead intake channels.",
      icon: <FileText className="text-[#12403D]" size={20} />,
      badge: "E-E-A-T Native"
    },
    {
      name: "Social Media Management",
      href: "/services/digital-marketing/social-media",
      desc: "Engage communities natively. We formulate content calendars, design custom social visuals, and manage developer community outreach on key networks (GitHub, X, LinkedIn).",
      icon: <Share2 className="text-[#10B891]" size={20} />,
      badge: "Vibrant Presence"
    },
    {
      name: "Marketing Automation",
      href: "/services/digital-marketing/marketing-automation",
      desc: "Automate leads to conversions. We implement automated lead capture, CRM pipeline tagging, email nurture sequences, and marketing reporting analytics dashboards.",
      icon: <Settings className="text-[#3B82F6]" size={20} />,
      badge: "Closed Loop"
    }
  ];

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://bagpackers.dev/services/digital-marketing#collection",
    "name": "Digital Marketing & Growth Solutions",
    "description": "High-impact digital marketing pipelines spanning technical SEO, paid ad spend optimization, structured content clusters, and automated CRM lead flows.",
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
          <span className="text-zinc-900">Digital Marketing Solutions</span>
        </nav>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs text-zinc-900"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8823A] animate-ping"></span>
              Growth & Audience Expansion Vertical
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 leading-tight"
            >
              Convert Traffic to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C1622C] to-[#E8823A]">Qualified Customers</span>.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base text-zinc-500 leading-relaxed max-w-xl"
            >
              Scale your brand story. We pair technical search algorithms and automated lead nurturing to capture client attention, turning page views into closed deals.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 p-2 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-xl overflow-hidden"
          >
            <div className="relative aspect-[3/2] w-full rounded-[calc(2rem-0.5rem)] overflow-hidden bg-zinc-950">
              <Image
                src="/images/marketing_analytics_visual.jpg"
                alt="Digital Marketing Solutions visual representation"
                fill
                priority
                className="object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                sizes="(max-w-768px) 100vw, 50vw"
              />
            </div>
          </motion.div>
        </section>

        <hr className="border-zinc-200 max-w-6xl mx-auto" />

        {/* Sub-routes Display Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subroutes.map((route, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ 
                  y: -5,
                  borderColor: "#E8823A",
                  boxShadow: "0 10px 25px -5px rgba(232, 130, 58, 0.15)"
                }}
                className="glass-panel p-6 rounded-2xl border border-zinc-200 bg-white cursor-pointer flex flex-col justify-between h-full group transition-all duration-300"
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
                  <h2 className="text-base font-bold text-zinc-900 group-hover:text-[#E8823A] transition-colors flex items-center gap-1.5 uppercase tracking-wide">
                    {route.name}
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#E8823A]" />
                  </h2>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-prose">
                    {route.desc}
                  </p>
                </div>
                
                <div className="pt-6 flex justify-end mt-4 border-t border-zinc-50">
                  <Link 
                    href={route.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#E8823A] hover:text-zinc-900 transition-colors"
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
