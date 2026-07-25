import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IoT & Logistics Automation | Enterprise Telemetry Pipelines",
  description: "Connect physical tracking networks with high-throughput MQTT and Kafka streaming databases. Architect sub-5ms latency IoT telemetry pipelines.",
  alternates: {
    canonical: "https://bagpackers.dev/services/industrial-company/iot-logistics-automation",
  },
};

export default function IotLogisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
