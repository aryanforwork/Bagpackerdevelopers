import { Metadata } from "next";
import { getApiBaseUrl } from "./api";

export interface PageMetadata {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

/**
 * Fetches dynamic SEO metadata from the Spring Boot API with a 1-hour revalidation cache.
 * Falls back to platform-standard default parameters if the API is offline or returns an error.
 */
export async function fetchMetadataForPath(path: string): Promise<Metadata> {
  const defaultTitle = "BAGPACKERS AI - Global-Grade AI Automation & Software Engineering Platform";
  const defaultDesc = "Next-generation intelligent document processing (IDP), database schema generation, and high-performance serverless software engineering.";
  const defaultKeywords = ["AI Automation", "Intelligent Document Processing", "Next.js", "Spring Boot", "Software Agency", "ROI Calculator"];

  try {
    const res = await fetch(`${getApiBaseUrl()}/api/v1/metadata?path=${encodeURIComponent(path)}`, {
      next: { revalidate: 3600 }
    });
    
    if (res.ok) {
      const data: PageMetadata = await res.json();
      return {
        title: data.title || defaultTitle,
        description: data.description || defaultDesc,
        keywords: data.keywords ? data.keywords.split(",").map(k => k.trim()) : defaultKeywords,
        openGraph: {
          title: data.ogTitle || data.title || defaultTitle,
          description: data.ogDescription || data.description || defaultDesc,
          images: data.ogImage ? [{ url: data.ogImage }] : [],
          type: "website",
          url: `https://bagpackers.dev${path}`,
        }
      };
    }
  } catch (err) {
    console.warn(`Failed to fetch dynamic metadata for path ${path}:`, err);
  }

  // Fallback defaults
  return {
    title: defaultTitle,
    description: defaultDesc,
    keywords: defaultKeywords,
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      type: "website",
      url: `https://bagpackers.dev${path}`,
    }
  };
}
