import Link from "next/link";
import { getApiBaseUrl } from "@/utils/api";
import { ArrowLeft, Calendar, HardDrive } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  techStack: string[];
  roiMetrics: Record<string, any>;
  content: string;
  createdAt: string;
}

// Revalidate static page generation at most once per hour
export const revalidate = 3600;

async function getCase(slug: string): Promise<CaseStudy | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/cases/${slug}`, {
      next: { revalidate: 3600 }
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Backend offline during server details fetch. Using local fallback.");
  }

  // Simulated local fallback details
  const mockData: Record<string, CaseStudy> = {
    "enterprise-ai-document-ingestion-pipeline": {
      id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      title: "Enterprise AI Document Ingestion & IDP Pipeline",
      slug: "enterprise-ai-document-ingestion-pipeline",
      techStack: ["Java", "Spring Boot", "Python", "Tesseract OCR", "PostgreSQL", "AWS S3"],
      roiMetrics: {
        manual_hours_saved_monthly: 1200,
        efficiency_increase_percent: 85,
        estimated_annual_savings_usd: 144000
      },
      content: `## Executive Overview
A global freight forwarding partner managed 10k custom bills manually. Process latency, accuracy, and operational bottlenecks severely restricted scaling capacity.

## The Solution We Engineered
We deployed an Intelligent Document Processing (IDP) cluster running OCR engines inside Python containers linked to a Spring Boot scheduling microservice:
1. **Intelligent Ingestion**: Scan PDFs are cleaned and oriented.
2. **Text Normalization**: Regex and NLP filters isolate client ids and total sums.
3. **Database Sink**: Data updates are batch written to Supabase databases.

## Measured Performance
* Ingestion latency decreased by **65%**.
* Over **1,200 manual hours** saved every month.
* Client satisfaction rose **18%** following dashboard portal launches.`,
      createdAt: new Date().toISOString()
    },
    "nextjs-client-portal-cms-migration": {
      id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
      title: "High-Performance Next.js Client Portal & CMS Migration",
      slug: "nextjs-client-portal-cms-migration",
      techStack: ["Next.js", "React 18", "Tailwind CSS", "Supabase", "Framer Motion"],
      roiMetrics: {
        conversion_rate_increase_percent: 24,
        lighthouse_performance_score: 98,
        load_time_reduction_percent: 65
      },
      content: `## Context
A dynamic fintech platform sought a full portal overhaul to handle high traffic surges and enable real-time tracking for customers.

## Solution Architecture
* **Frontend**: Next.js App Router, using Server Actions to bypass client-side data leaks.
* **Database**: Supabase PostgreSQL with Row Level Security (RLS) policies protecting tenant fields.
* **Layout**: Sleek glassmorphic theme incorporating premium custom styling.

## Return on Investment
* Average page-load reduced from **5.2s** to **1.8s**.
* Google core web vitals achieved a **98+** rating.
* Form submissions grew **24%** month over month.`,
      createdAt: new Date().toISOString()
    }
  };

  return mockData[slug] || null;
}

// Generate static params for SSG pre-rendering at build time
export async function generateStaticParams() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/cases`);
    if (response.ok) {
      const cases: CaseStudy[] = await response.json();
      return cases.map((cs) => ({ slug: cs.slug }));
    }
  } catch (err) {
    // Backend offline during build time, return fallback static parameters
  }
  return [
    { slug: "enterprise-ai-document-ingestion-pipeline" },
    { slug: "nextjs-client-portal-cms-migration" }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCase(slug);
  if (!cs) {
    return {
      title: "Case Study Not Found | BAGPACKERS AI",
    };
  }
  const description = cs.content.split("\n\n")[0]?.replace(/## |[*]/g, "") || cs.title;
  const descSanitized = description.length > 155 ? `${description.slice(0, 152)}...` : description;
  return {
    title: `${cs.title} | BAGPACKERS AI Case Study`,
    description: descSanitized,
    openGraph: {
      title: cs.title,
      description: descSanitized,
      type: "article",
      url: `https://bagpackers.dev/case-studies/${cs.slug}`,
    }
  };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await getCase(slug);

  if (!cs) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": cs.title,
    "description": cs.content.split("\n\n")[0]?.replace(/## |[*]/g, "") || cs.title,
    "url": `https://bagpackers.dev/case-studies/${cs.slug}`,
    "datePublished": cs.createdAt,
    "dependencies": cs.techStack.join(", "),
    "publisher": {
      "@type": "Organization",
      "name": "Bagpackers Developers",
      "url": "https://bagpackers.dev"
    },
    "author": {
      "@type": "Organization",
      "name": "Bagpackers Developers",
      "url": "https://bagpackers.dev"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="max-w-4xl mx-auto w-full px-6 py-12 md:py-20 space-y-8">
        {/* Back Link */}
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Case Studies
        </Link>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
            {cs.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              <span>{new Date(cs.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive size={12} />
              <span className="font-mono">{cs.id.slice(0, 8)}</span>
            </div>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5 pt-4">
            {cs.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-semibold font-mono bg-zinc-100 border border-zinc-200 text-zinc-600 px-2.5 py-0.5 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* ROI Display Panel */}
        <section className="p-6 bg-white/3 border border-zinc-200/50 rounded-2xl">
          <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-4">
            Key Performance Indicators (KPIs)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(cs.roiMetrics).map(([key, val]) => (
              <div key={key} className="p-3 bg-black/40 rounded-lg border border-zinc-200/50">
                <span className="block text-[9px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-lg font-bold text-accent-emerald font-mono">
                  {typeof val === "number" && val > 1000 ? `$${val.toLocaleString()}` : val}
                  {key.includes("percent") ? "%" : ""}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Body Content */}
        <section className="prose prose-invert max-w-none pt-4 text-zinc-600 text-sm leading-relaxed space-y-6">
          {/* Simple markdown parsing for lists and headings */}
          {cs.content.split("\n\n").map((para, i) => {
            if (para.startsWith("## ")) {
              return (
                <h2 key={i} className="text-xl font-bold text-zinc-900 pt-6 border-b border-zinc-200/50 pb-2">
                  {para.substring(3)}
                </h2>
              );
            }
            if (para.startsWith("* ")) {
              return (
                <ul key={i} className="list-disc pl-5 space-y-1">
                  {para.split("\n").map((li, j) => (
                    <li key={j}>{li.substring(2)}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{para}</p>;
          })}
        </section>
      </article>
    </>
  );
}
