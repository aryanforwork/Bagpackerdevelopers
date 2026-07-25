"use client";

import Link from "next/link";
import Image from "next/image";
import RoiCalculator from "@/components/RoiCalculator";
import { Cpu, Eye, Code, Database, ChevronRight, Check, ArrowRight, ArrowUpRight, ChevronDown, Activity, Shield, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { fadeUp, staggerContainer, hoverScale } from "@bagpackers/ui";

import en from "../../messages/en.json";
import es from "../../messages/es.json";

export default function Home() {
  const cards = [
    {
      icon: <Cpu size={20} className="text-[#10B891]" strokeWidth={1.25} />,
      image: "/images/nextjs_app_router_visual.jpg",
      title: "Next.js 14 App Router",
      desc: "Sub-millisecond static page delivery via Vercel Edge networks and fast server-side rendered API endpoints.",
      href: "/services/brand-website"
    },
    {
      icon: <Eye size={20} className="text-[#10B891]" strokeWidth={1.25} />,
      image: "/images/ocr_pipeline_visual.jpg",
      title: "Intelligent OCR Pipeline",
      desc: "Automatically extract text, values, invoice amounts, and metadata from arbitrary PDFs or image uploads.",
      href: "/services/intelligent-document-processing"
    },
    {
      icon: <Code size={20} className="text-[#10B891]" strokeWidth={1.25} />,
      image: "/images/backend_security_visual.jpg",
      title: "Spring Boot Web Security",
      desc: "Strict JWT validation, CORS origin domain whitelisting, and automated request filters configured natively.",
      href: "/services/custom-crm-erp-integrations"
    },
    {
      icon: <Database size={20} className="text-[#10B891]" strokeWidth={1.25} />,
      image: "/images/cloud_database_visual.jpg",
      title: "Supabase PostgreSQL",
      desc: "ACID-compliant storage, connection pooling, and Row Level Security templates restricting queries to valid clients.",
      href: "/services/retrieval-augmented-generation"
    }
  ];

  const testimonials = [
    {
      quote: "Bagpackers Developers built our Next.js portal, resulting in a 24% uptick in conversions. Their execution was flawless and completed ahead of schedule.",
      author: "Helena Rostova",
      role: "Chief Product Officer",
      company: "Apex Fintech",
      url: "https://nextjs.org"
    },
    {
      quote: "Their Spring Boot security configuration is top-tier. Whitelists, JWT parsing, and PostgreSQL RLS were configured seamlessly and verified in audits.",
      author: "Devon Miller",
      role: "VP of Security",
      company: "Logistics Grid",
      url: "https://spring.io"
    }
  ];

  const faqs = [
    {
      q: "Can you make our platform scalable and consistent?",
      a: "We deliver structured API schemas, shared Tailwind theme variables, and reusable React component libraries to guarantee frontend consistency across platforms and future features."
    },
    {
      q: "Our portal feels outdated and slow, can you refactor it?",
      a: "Yes, we transition legacy codebases to Next.js App Router and Edge delivery networks, reducing load times by up to 65% while improving usability and SEO."
    },
    {
      q: "Can you secure our database without database downtime?",
      a: "Absolutely. We apply Supabase Row-Level Security (RLS) policies, HikariCP pooling adjustments, and zero-trust credentials vaulting seamlessly."
    },
    {
      q: "We're launching a SaaS and need full compliance, can you handle it?",
      a: "Yes. We configure Spring Security filters, CORS whitelisting, rate-limiting, and encrypted telemetry pipelines out-of-the-box to ensure compliance."
    }
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [lang, setLang] = useState<"en" | "es">("en");
  const t = lang === "es" ? es : en;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="flex flex-col pb-24 overflow-x-hidden bg-[#FAFAFA] text-zinc-900">
      
      {/* 1. Hero Section (Light Mode) */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full text-center md:text-left grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Subtle mesh background highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/5 via-transparent to-transparent -z-10 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs font-semibold text-[#10B891] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B891] animate-pulse" />
              {t.Hero.badge}
            </div>
            
            <div className="inline-flex rounded-full border border-zinc-200 p-0.5 bg-white text-[10px] font-bold shadow-sm">
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-0.5 rounded-full transition-all ${lang === "en" ? "bg-zinc-950 text-white" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("es")}
                className={`px-2.5 py-0.5 rounded-full transition-all ${lang === "es" ? "bg-zinc-950 text-white" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                ES
              </button>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 leading-tight">
            {t.Hero.title}
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl leading-relaxed">
            {t.Hero.subtitle}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/sandbox"
                className="inline-flex items-center gap-4 pl-6 pr-2 py-2 rounded-full bg-zinc-950 text-white font-extrabold text-sm hover:bg-black transition-all group shadow-lg"
              >
                <span>{t.Hero.cta}</span>
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#10B891] group-hover:translate-x-0.5 group-hover:-translate-y-[1px] transition-all duration-300">
                  <ChevronRight size={14} className="text-white" />
                </span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="#calculator"
                className="inline-flex items-center justify-center px-6 h-12 rounded-full bg-white hover:bg-zinc-100 text-zinc-800 font-semibold text-sm border border-zinc-200 transition-all shadow-sm"
              >
                Calculate ROI
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Hero Right: Telemetry Cockpit (Dark Bezel Device) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="p-2 bg-zinc-200/50 border border-zinc-200/80 rounded-[2.5rem] shadow-xl">
            <div className="bg-[#18181B] rounded-[calc(2.5rem-0.5rem)] p-6 border border-white/5 relative overflow-hidden shadow-inner text-zinc-300">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                </div>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                  System Telemetry
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="p-3.5 bg-[#09090B]/50 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-mono">/api/v1/health</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[#10B891] uppercase font-bold tracking-wider">
                    200 OK
                  </span>
                </div>
                <div className="p-3.5 bg-[#09090B]/50 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-mono">Bucket4j Rate Limit</span>
                  <span className="text-xs text-[#10B891] font-mono font-bold">10 req/min</span>
                </div>
                <div className="p-3.5 bg-[#09090B]/50 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-mono">Data Isolation Layer</span>
                  <span className="text-xs text-[#10B891] font-mono font-bold">Row Level Security</span>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#10B891]/5 blur-xl rounded-full" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Integrated Telemetry Matrix (Logo Wall) (Light Mode) */}
      <section className="border-y border-zinc-200 py-10 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400">
            INTEGRATED TELEMETRY MATRIX
          </span>
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6 opacity-40 grayscale contrast-200">
            <img src="https://cdn.simpleicons.org/nextdotjs/09090b" alt="Next.js" className="h-5 object-contain" />
            <img src="https://cdn.simpleicons.org/springboot/09090b" alt="Spring Boot" className="h-5 object-contain" />
            <img src="https://cdn.simpleicons.org/supabase/09090b" alt="Supabase" className="h-5 object-contain" />
            <img src="https://cdn.simpleicons.org/postgresql/09090b" alt="PostgreSQL" className="h-5 object-contain" />
            <img src="https://cdn.simpleicons.org/docker/09090b" alt="Docker" className="h-5 object-contain" />
          </div>
        </div>
      </section>

      {/* 3. Services Grid ("Create. Code. Scale.") (Light Mode) */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-20"
        >
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight sm:text-4xl">
            Create. Code. Scale.
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Explore our in-depth services, built to deliver enterprise-grade performance and security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2rem] shadow-sm hover:border-[#10B891]/30 hover:shadow-lg transition-all duration-300 flex"
            >
              <div className="w-full bg-white border border-white/40 rounded-[calc(2rem-0.25rem)] overflow-hidden flex flex-col justify-between shadow-inner">
                {/* Cover Image */}
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-zinc-950">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-w-768px) 100vw, 25vw"
                  />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur border border-zinc-200/50 flex items-center justify-center shadow-md">
                    {card.icon}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-base mb-2">{card.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-zinc-100 mt-6 flex justify-between items-center">
                    <Link
                      href={card.href}
                      className="text-xs font-bold text-[#10B891] hover:text-[#059669] flex items-center gap-1 group/link"
                    >
                      View Detail
                      <ArrowRight size={12} strokeWidth={1.5} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3.5 Brand Story Section ("A Global Collective, Not an Office") */}
      <section className="border-t border-zinc-200 py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left storytelling details */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-semibold text-[#E8823A] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8823A]" />
              Our Collective Story
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              A Global Collective, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#12403D] to-[#C1622C]">Not an Office.</span>
            </h2>
            <p className="text-zinc-500 text-base leading-relaxed max-w-prose">
              We are a remote-first software engineering collective. Vetted developers working from anywhere, delivering enterprise-grade software to clients globally. By moving code instead of people, we maintain an always-on, high-throughput delivery model that handles complex software pipelines.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <span className="text-2xl font-black text-[#12403D]">100%</span>
                <h4 className="font-bold text-zinc-900 text-sm">Remote-First</h4>
                <p className="text-xs text-zinc-400">Zero offices. Maximum talent focus.</p>
              </div>
              <div className="space-y-2">
                <span className="text-2xl font-black text-[#C1622C]">24h</span>
                <h4 className="font-bold text-zinc-900 text-sm">Follow-the-Sun</h4>
                <p className="text-xs text-zinc-400">Continuous delivery cycles across regions.</p>
              </div>
            </div>
          </div>

          {/* Right SVG Map illustration */}
          <div className="lg:col-span-6 p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2.5rem] shadow-sm overflow-hidden flex">
            <div className="w-full bg-[#09090B] border border-white/5 rounded-[calc(2.5rem-0.25rem)] p-8 relative overflow-hidden flex flex-col justify-between shadow-inner aspect-[4/3] text-white">
              {/* Inline SVG World Map with route lines */}
              <svg viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-65">
                {/* World map layout grids */}
                <circle cx="200" cy="180" r="4" fill="#E8823A" className="animate-ping" />
                <circle cx="200" cy="180" r="3" fill="#E8823A" />
                <text x="210" y="185" fill="#EDE3D2" className="text-[10px] font-mono font-bold">SF / Nomad Node</text>

                <circle cx="500" cy="120" r="4" fill="#10B891" className="animate-ping" />
                <circle cx="500" cy="120" r="3" fill="#10B891" />
                <text x="510" y="125" fill="#EDE3D2" className="text-[10px] font-mono font-bold">London / Core</text>

                <circle cx="650" cy="280" r="4" fill="#C1622C" className="animate-ping" />
                <circle cx="650" cy="280" r="3" fill="#C1622C" />
                <text x="660" y="285" fill="#EDE3D2" className="text-[10px] font-mono font-bold">Bali / Creator Node</text>

                {/* Routing curved paths */}
                <path d="M200,180 Q350,110 500,120" stroke="url(#gradientTeal)" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M500,120 Q575,200 650,280" stroke="url(#gradientTerracotta)" strokeWidth="2" />
                <path d="M650,280 Q425,300 200,180" stroke="url(#gradientSunset)" strokeWidth="1.5" strokeDasharray="3,3" />

                <defs>
                  <linearGradient id="gradientTeal" x1="200" y1="180" x2="500" y2="120">
                    <stop stopColor="#E8823A" />
                    <stop offset="1" stopColor="#10B891" />
                  </linearGradient>
                  <linearGradient id="gradientTerracotta" x1="500" y1="120" x2="650" y2="280">
                    <stop stopColor="#10B891" />
                    <stop offset="1" stopColor="#C1622C" />
                  </linearGradient>
                  <linearGradient id="gradientSunset" x1="650" y1="280" x2="200" y2="180">
                    <stop stopColor="#C1622C" />
                    <stop offset="1" stopColor="#E8823A" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-6 left-6 font-mono text-[9px] text-zinc-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE ROUTE: BALI → LONDON → SAN FRANCISCO
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex flex-col justify-between">
            <h4 className="font-extrabold text-zinc-950 text-sm tracking-wide uppercase mb-2">Remote-First Engineering</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">No static physical desks. We deploy cloud resources and direct collaboration pipelines globally.</p>
          </div>
          <div className="p-6 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex flex-col justify-between">
            <h4 className="font-extrabold text-zinc-950 text-sm tracking-wide uppercase mb-2">24h Time-Zone Coverage</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Asynchrony is our superpower. Direct transition of work across timezones means we build while you sleep.</p>
          </div>
          <div className="p-6 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex flex-col justify-between">
            <h4 className="font-extrabold text-zinc-950 text-sm tracking-wide uppercase mb-2">Vetted Global Talent</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">We hire purely on capacity and execution. Experienced engineers with history in top digital agencies.</p>
          </div>
          <div className="p-6 bg-zinc-50 border border-zinc-200/60 rounded-2xl flex flex-col justify-between">
            <h4 className="font-extrabold text-zinc-950 text-sm tracking-wide uppercase mb-2">Always-On Delivery</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Continuous delivery metrics monitored constantly. Automated health checks protect systems.</p>
          </div>
        </div>
      </section>

      {/* 4. Testimonials Slider ("Collaborative to the core") (Light Mode) */}
      <section className="bg-zinc-50 border-y border-zinc-200 py-24">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight sm:text-4xl">
              Collaborative to the core
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              If you have complex scaling needs but limited backend capacity, you need more than a development shop: you need an elite engineering partner.
            </p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto min-h-[260px] flex items-center">
            <AnimatePresence mode="wait">
              {testimonials.map((item, idx) => (
                idx === activeSlide && (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="w-full p-1 bg-zinc-200/50 border border-zinc-200/80 rounded-[2.5rem] shadow-sm flex"
                  >
                    <div className="w-full bg-white border border-white/40 rounded-[calc(2.5rem-0.375rem)] p-8 md:p-10 text-center flex flex-col justify-between shadow-inner">
                      <p className="text-zinc-700 text-lg md:text-xl font-medium italic leading-relaxed mb-6">
                        {item.quote}
                      </p>
                      <div>
                        <span className="text-zinc-900 font-bold text-sm block">
                          {item.author}
                        </span>
                        <span className="text-zinc-400 text-xs mt-1 block">
                          {item.role} at{" "}
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#10B891] hover:underline">
                            {item.company}
                          </a>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === activeSlide ? "bg-[#10B891] w-6" : "bg-zinc-300 hover:bg-zinc-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Stats & Telemetry Section (Dark Mode Enclosure) */}
      <section className="bg-[#09090B] text-zinc-300 py-24 border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              When we say we’re data-driven, we mean it
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              We go beyond standard code shipping. We deliver strict type safety, zero-trust secrets vaulting, connection pooling stability, and comprehensive integration testing telemetry.
            </p>
            <div className="pt-4">
              <Link
                href="/about"
                className="group relative inline-flex items-center gap-3 pl-5 pr-1.5 py-1.5 text-xs font-bold rounded-full bg-zinc-900 hover:bg-black text-white border border-zinc-800 transition-all"
              >
                <span>Get to know us</span>
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#10B891] transition-colors">
                  <ArrowRight size={12} strokeWidth={1.5} className="text-white group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>
          </motion.div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-1 bg-zinc-800/30 border border-zinc-800/50 rounded-[2rem] text-center flex"
            >
              <div className="w-full bg-[#18181B] rounded-[calc(2rem-0.25rem)] p-8 border border-white/5 flex flex-col justify-center items-center shadow-inner">
                <h3 className="text-4xl sm:text-5xl font-black text-[#10B891] tracking-tight">
                  100%
                </h3>
                <p className="text-xs text-zinc-500 mt-2 font-semibold uppercase tracking-wider">
                  RLS Coverage
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-1 bg-zinc-800/30 border border-zinc-800/50 rounded-[2rem] text-center flex"
            >
              <div className="w-full bg-[#18181B] rounded-[calc(2rem-0.25rem)] p-8 border border-white/5 flex flex-col justify-center items-center shadow-inner">
                <h3 className="text-4xl sm:text-5xl font-black text-[#10B891] tracking-tight">
                  40k+
                </h3>
                <p className="text-xs text-zinc-500 mt-2 font-semibold uppercase tracking-wider">
                  Nodes Tested
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section (Dark Mode Enclosure) */}
      <section className="bg-[#09090B] text-zinc-300 py-24 border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#10B891]">
              FAQ
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Find answers to common questions about our backend integrations, security layers, and deployment workflows.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-2">
            {faqs.map((faq, idx) => (
              <FaqAccordion key={idx} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. ROI Calculator Section (Light Mode) */}
      <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-20"
        >
          <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight sm:text-4xl">
            Ready to Streamline Your Operations?
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Use our interactive estimator to compute savings, and submit your leads immediately.
          </p>
        </motion.div>

        <RoiCalculator />
      </section>

      {/* 8. Trust Checklist & Blueprint Promise (Light Mode) */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto w-full px-6 text-center space-y-8 mt-12"
      >
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">
          The Bagpackers Blueprint Promise
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center justify-center gap-2 text-zinc-600 font-semibold p-4 bg-white border border-zinc-200/60 rounded-2xl shadow-sm">
            <Check size={16} className="text-[#10B891] shrink-0" strokeWidth={2.5} />
            <span>Zero-Trust API Secrets</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-zinc-600 font-semibold p-4 bg-white border border-zinc-200/60 rounded-2xl shadow-sm">
            <Check size={16} className="text-[#10B891] shrink-0" strokeWidth={2.5} />
            <span>100% Core Web Vitals Audited</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-zinc-600 font-semibold p-4 bg-white border border-zinc-200/60 rounded-2xl shadow-sm">
            <Check size={16} className="text-[#10B891] shrink-0" strokeWidth={2.5} />
            <span>Automated Uptime Warmups</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function FaqAccordion({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800/80 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-3 text-left text-zinc-200 hover:text-[#10B891] transition-colors focus:outline-none"
      >
        <span className="font-semibold text-sm sm:text-base">{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-zinc-500 shrink-0 ml-4"
        >
          <ChevronDown size={16} strokeWidth={1.5} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-zinc-400 text-xs sm:text-sm pt-2 pb-4 leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
