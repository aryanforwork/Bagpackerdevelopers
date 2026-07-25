"use client";

import { motion } from "framer-motion";
import { Shield, Zap, CheckCircle2, Award, Star } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Alex Mercer",
      role: "Lead Systems Architect",
      bio: "Former staff engineer with 10+ years optimizing low-latency distributed APIs and JVM configurations.",
      skills: ["Java", "Spring Boot", "Rust", "Kubernetes"],
      avatar: "AM"
    },
    {
      name: "Sarah Chen",
      role: "Principal AI Integrator",
      bio: "Specialist in document ingestion pipelines, advanced OCR heuristics, and LLM orchestration networks.",
      skills: ["Python", "PyTorch", "OCR Engine Tuning", "TypeScript"],
      avatar: "SC"
    },
    {
      name: "Marcus Vance",
      role: "Senior UI/UX & Web Performance Engineer",
      bio: "Focuses exclusively on Core Web Vitals optimization, Edge rendering, and pixel-perfect design systems.",
      skills: ["Next.js", "React", "Framer Motion", "Tailwind CSS"],
      avatar: "MV"
    }
  ];

  const coreValues = [
    {
      icon: <Shield className="text-[#10B891]" size={24} />,
      title: "Operational Integrity",
      desc: "Our systems run predictably, strictly matching technical specifications with 100% typesafe APIs and complete integration test coverage."
    },
    {
      icon: <Zap className="text-[#10B891]" size={24} />,
      title: "Performance First",
      desc: "We design for sub-millisecond network responses, using edge delivery networks, caching strategies, and asset optimization."
    },
    {
      icon: <CheckCircle2 className="text-[#10B891]" size={24} />,
      title: "Absolute Transparency",
      desc: "We share real-time telemetry, clear ROI estimates, and open database configurations. What we estimate is what we deliver."
    }
  ];

  const trustVectors = [
    {
      title: "Zero-Trust Secret Vaulting",
      value: "100%",
      detail: "No hardcoded credentials. All API keys and secrets stored securely in hardware security modules and native cloud vaults."
    },
    {
      title: "Core Web Vitals Compliance",
      value: "95+",
      detail: "Our Next.js applications achieve straight-green performance, accessibility, and SEO audits on Lighthouse out-of-the-box."
    },
    {
      title: "Automated Warmup Systems",
      value: "99.9%",
      detail: "Dynamic container warmup tasks running at 5-minute intervals prevent idle sleep states and ensure sub-second startup response."
    },
    {
      title: "Transactional Resiliency",
      value: "ACID",
      detail: "Using PostgreSQL connection pools, transaction boundaries, and row-level security policy sets to safeguard enterprise data."
    }
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Bagpackers Developers",
    "description": "Detailing team expertise, trust vectors, and core values of our Next.js and Spring Boot software engineering platform.",
    "url": "https://bagpackers.dev/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "Bagpackers Developers",
      "url": "https://bagpackers.dev",
      "logo": "https://bagpackers.dev/logo.png",
      "knowsAbout": [
        "Artificial Intelligence",
        "Software Engineering",
        "Next.js App Router",
        "Spring Boot Web Security",
        "Intelligent Document Processing"
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <div className="min-h-screen bg-[#FAFAFA] text-zinc-700 pb-24 overflow-x-hidden font-sans flex flex-col gap-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full text-center md:text-left">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/5 via-transparent to-transparent -z-10 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-sm text-xs font-semibold text-[#10B891]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B891] animate-pulse" />
              Trusted Engineering Matrix
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 leading-tight">
              About <span className="text-gradient">Bagpackers Developers</span>
            </h1>
            <p className="text-zinc-600 text-lg md:text-xl leading-relaxed">
              We design and construct high-performance digital platforms. By combining Next.js edge networks with secure Spring Boot backend instances, we deliver enterprise-grade performance and predictability.
            </p>
          </motion.div>
        </section>

        {/* Core Values Section */}
        <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 border-t border-zinc-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 mb-20"
          >
            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Our Core Foundation</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto text-sm leading-relaxed">
              Every system we author conforms to three strict guidelines: predictability, performance, and transparency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-1.5 bg-zinc-100/50 border border-zinc-200/80 rounded-[2rem] transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_10px_30px_-10px_rgba(16,184,145,0.15)] flex"
              >
                <div className="w-full bg-[#FAFAFA] border border-zinc-100 rounded-[calc(2rem-0.375rem)] p-8 flex flex-col items-start gap-5 shadow-inner">
                  <div className="p-3.5 bg-[#FAFAFA] rounded-2xl border border-zinc-200">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900">{value.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Expertise Section */}
        <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 border-t border-zinc-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 space-y-6"
            >
              <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                Selected <span className="text-gradient">Team Expertise</span>
              </h2>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Our core engineers bring deep engineering specialization, drawing from years of experience at global scale platforms to create custom, security-audited integrations.
              </p>
              <div className="p-5 bg-zinc-100/50 rounded-2xl border border-zinc-200 space-y-4">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-900">
                  <Award size={16} className="text-[#10B891]" />
                  <span>Senior Engineering Density: 100%</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-zinc-900">
                  <Star size={16} className="text-[#10B891]" />
                  <span>Decade-Long Average Tenures</span>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {team.map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-1.5 bg-zinc-100/50 border border-zinc-200/80 rounded-[2rem] flex hover:border-blue-500/20 transition-all duration-300"
                >
                  <div className="w-full bg-[#FAFAFA] border border-zinc-100 rounded-[calc(2rem-0.375rem)] p-6 flex flex-col justify-between shadow-inner">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10B891] to-[#059669] flex items-center justify-center text-zinc-900 font-extrabold text-base">
                          {member.avatar}
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 text-base leading-snug">{member.name}</h3>
                          <p className="text-xs text-[#10B891] font-medium mt-0.5">{member.role}</p>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed">{member.bio}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-6 border-t border-zinc-200 mt-6">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-semibold font-mono bg-[#FAFAFA] border border-zinc-200 text-zinc-600 px-2.5 py-1 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Vectors Section */}
        <section className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 border-t border-zinc-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 mb-20"
          >
            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Our Trust Vectors</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto text-sm leading-relaxed">
              We design and construct digital products with concrete engineering parameters and clear audit trails.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustVectors.map((vector, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-1.5 bg-zinc-100/50 border border-zinc-200/80 rounded-[2rem] hover:border-[#10B891]/20 transition-all duration-300 flex"
              >
                <div className="w-full bg-[#FAFAFA] border border-zinc-100 rounded-[calc(2rem-0.375rem)] p-6 flex flex-col justify-between shadow-inner">
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-snug">{vector.title}</h3>
                    <p className="text-3xl font-extrabold text-[#10B891] font-mono leading-none">{vector.value}</p>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed pt-5 border-t border-zinc-200 mt-6">{vector.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
