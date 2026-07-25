import { fetchMetadataForPath } from "@/utils/metadata";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await fetchMetadataForPath("/about");
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
