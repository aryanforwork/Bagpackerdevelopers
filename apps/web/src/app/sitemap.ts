import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bagpackers.dev";

  // Static site routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/work",
    "/developers",
    "/services/digital-marketing",
    "/services/brand-website",
    "/services/business-company",
    "/services/industrial-company",
    "/services/intelligent-document-processing",
    "/services/retrieval-augmented-generation",
    "/services/multitenant-saas-portals",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch dynamic portfolio items
  let portfolioRoutes: any[] = [];
  try {
    const supabase = createClient();
    const { data: items } = await supabase
      .from("portfolio_items")
      .select("id, published_at");

    if (items) {
      portfolioRoutes = items.map((item) => ({
        url: `${baseUrl}/work`, // All items rendered on /work, or direct slugs if added
        lastModified: item.published_at ? new Date(item.published_at) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch portfolio items for dynamic sitemap.", err);
  }

  // Fetch public verified developers
  let developerRoutes: any[] = [];
  try {
    const supabase = createClient();
    const { data: devs } = await supabase
      .from("profiles")
      .select("id, updated_at, developer_profiles!inner(is_public)")
      .eq("developer_profiles.is_public", true);

    if (devs) {
      developerRoutes = devs.map((d) => ({
        url: `${baseUrl}/developers`, // Developers directory list
        lastModified: d.updated_at ? new Date(d.updated_at) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.warn("Failed to fetch developers for dynamic sitemap.", err);
  }

  return [...staticRoutes, ...portfolioRoutes, ...developerRoutes];
}
