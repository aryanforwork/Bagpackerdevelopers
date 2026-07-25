import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Intelligence & Compliance Solutions | Bagpackers Developers",
  description: "Leverage advanced predictive analytics dashboards and grounded regulatory compliance RAG engines built to enterprise specifications.",
  alternates: {
    canonical: "https://bagpackers.dev/services/business-company",
  },
};

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
