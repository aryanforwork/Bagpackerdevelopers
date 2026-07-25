import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Headless CMS & Static Sites | High-Performance Web Architectures",
  description: "Leverage Incremental Static Regeneration (ISR) and headless content layers to deliver sub-15ms Time to First Byte (TTFB) and perfect Lighthouse scores.",
  alternates: {
    canonical: "https://bagpackers.dev/services/brand-website/headless-cms-static-sites",
  },
};

export default function HeadlessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
