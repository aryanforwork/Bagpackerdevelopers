import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immersive WebGL Portals | Interactive 3D Web Engineering",
  description: "Architect high-fidelity 3D browser graphics and hardware-accelerated WebGL environments. Smooth 60 FPS performance, and optimized Draco asset loaders.",
  alternates: {
    canonical: "https://bagpackers.dev/services/brand-website/immersive-webgl-portals",
  },
};

export default function WebGlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
