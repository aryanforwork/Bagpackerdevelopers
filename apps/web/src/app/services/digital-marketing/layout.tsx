import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Marketing & Growth Solutions | Bagpackers Developers",
  description: "Scale your organic traffic with technical SEO auditing, optimized ad campaigns, structured content marketing, and automated leads capture architectures.",
  alternates: {
    canonical: "https://bagpackers.dev/services/digital-marketing",
  },
};

export default function DigitalMarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
