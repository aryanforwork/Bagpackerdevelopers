import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Predictive Analytics Dashboards | Enterprise Decision Portals",
  description: "Accelerate your corporate metrics pipelines. Custom business dashboards with forecasting algorithms, and sub-85ms query times.",
  alternates: {
    canonical: "https://bagpackers.dev/services/business-company/predictive-analytics-dashboards",
  },
};

export default function PredictiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
