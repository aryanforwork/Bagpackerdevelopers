import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Computer Vision Quality Control | Edge AI Assembly Systems",
  description: "Deploy real-time frame classifiers and anomaly detection neural networks directly on Edge hardware. Achieve sub-8ms quality audits.",
  alternates: {
    canonical: "https://bagpackers.dev/services/industrial-company/computer-vision-quality-control",
  },
};

export default function ComputerVisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
