import { fetchMetadataForPath } from "@/utils/metadata";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await fetchMetadataForPath("/sandbox");
}

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
