import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Website & WebGL Solutions | Bagpackers Developers",
  description: "Architect high-performance headless static websites and immersive 3D WebGL portals with exceptional responsiveness and design aesthetics.",
  alternates: {
    canonical: "https://bagpackers.dev/services/brand-website",
  },
};

export default function BrandWebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
