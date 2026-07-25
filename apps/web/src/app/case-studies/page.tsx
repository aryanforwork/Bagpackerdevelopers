import Link from "next/link";
import { getApiBaseUrl } from "@/utils/api";
import { FolderGit2, Calendar, ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { fetchMetadataForPath } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return await fetchMetadataForPath("/work");
}

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  techStack: string[];
  roiMetrics: Record<string, any>;
  content: string;
  createdAt: string;
}

// Revalidate this page's static generation at most once per hour
export const revalidate = 3600;

async function getCases(): Promise<CaseStudy[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/cases`, {
      next: { revalidate: 3600 }
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error("Failed to fetch cases");
  } catch (err) {
    console.warn("Backend offline during server pre-rendering. Loading local fallback case studies.");
    return [
      {
        id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        title: "Enterprise AI Document Ingestion & IDP Pipeline",
        slug: "enterprise-ai-document-ingestion-pipeline",
        techStack: ["Java", "Spring Boot", "Python", "Tesseract OCR", "PostgreSQL", "AWS S3"],
        roiMetrics: {
          manual_hours_saved_monthly: 1200,
          efficiency_increase_percent: 85,
          estimated_annual_savings_usd: 144000
        },
        content: "",
        createdAt: new Date().toISOString()
      },
      {
        id: "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
        title: "High-Performance Next.js Client Portal & CMS Migration",
        slug: "nextjs-client-portal-cms-migration",
        techStack: ["Next.js", "React 18", "Tailwind CSS", "Supabase", "Framer Motion"],
        roiMetrics: {
          conversion_rate_increase_percent: 24,
          lighthouse_performance_score: 98,
          load_time_reduction_percent: 65
        },
        content: "",
        createdAt: new Date().toISOString()
      }
    ];
  }
}

export default async function CaseStudiesPage() {
  const cases = await getCases();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "BAGPACKERS AI Selected Case Studies",
    "description": "Deep dives into intelligent workflows, high-speed interfaces, and secure backend solutions engineered by our teams.",
    "url": "https://bagpackers.dev/case-studies",
    "publisher": {
      "@type": "Organization",
      "name": "Bagpackers Developers",
      "url": "https://bagpackers.dev"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 space-y-12">
        {/* Title */}
        <div className="text-center md:text-left space-y-4 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
            Selected <span className="text-gradient">Case Studies</span>
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Deep dives into intelligent workflows, high-speed interfaces, and secure backend solutions engineered by our teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((cs) => (
            <div key={cs.id} className="glass-panel glass-panel-hover rounded-2xl p-6 md:p-8 border border-zinc-200/50 flex flex-col justify-between">
              <div>
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cs.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-semibold font-mono bg-zinc-100 border border-zinc-200 text-zinc-500 px-2.5 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-zinc-900 mb-3 hover:text-[#10B891] transition-colors">
                  {cs.title}
                </h3>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2.5 my-6">
                  {Object.entries(cs.roiMetrics).map(([key, val]) => (
                    <div key={key} className="p-3 bg-black/40 rounded-lg border border-zinc-200/50">
                      <span className="block text-[8px] font-semibold text-zinc-500 uppercase tracking-wider mb-1 truncate">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm font-bold text-accent-teal font-mono">
                        {typeof val === "number" && val > 1000 ? `$${val.toLocaleString()}` : val}
                        {key.includes("percent") ? "%" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-200/50 pt-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Calendar size={12} />
                  <span>{new Date(cs.createdAt).toLocaleDateString()}</span>
                </div>
                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#10B891] hover:text-zinc-900 transition-colors group"
                >
                  Read Study
                  <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
