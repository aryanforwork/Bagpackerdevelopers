import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom CRM & ERP Integrations | Enterprise Middleware",
  description: "Architect high-performance enterprise middleware solutions, connecting custom Next.js frontends to legacy CRM and ERP platforms (Salesforce, SAP, Oracle) with absolute transactional integrity.",
  alternates: {
    canonical: "https://bagpackers.dev/services/custom-crm-erp-integrations",
  },
};

export default function IntegrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
