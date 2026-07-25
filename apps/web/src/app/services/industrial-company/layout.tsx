import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial Automation & IoT Solutions | Bagpackers Developers",
  description: "Accelerate your factory or logistics pipeline with high-throughput IoT integration and edge AI computer vision systems.",
  alternates: {
    canonical: "https://bagpackers.dev/services/industrial-company",
  },
};

export default function IndustrialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
