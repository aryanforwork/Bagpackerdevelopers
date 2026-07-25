import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulatory Compliance RAG | Secure AI Audit Engines",
  description: "Secure your operational compliance workflows with deterministic RAG architectures. Achieve sub-0.1% hallucination rates and rapid automated legal audits.",
  alternates: {
    canonical: "https://bagpackers.dev/services/business-company/regulatory-compliance-rag",
  },
};

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
