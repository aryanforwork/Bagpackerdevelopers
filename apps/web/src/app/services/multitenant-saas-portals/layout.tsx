import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi-Tenant SaaS Portals | Secure Client Infrastructure",
  description: "Deploy secure, multi-tenant Next.js client portals integrated with Spring Boot authorization and Supabase PostgreSQL Row Level Security (RLS) data isolation layers.",
  alternates: {
    canonical: "https://bagpackers.dev/services/multitenant-saas-portals",
  },
};

export default function SaaSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
