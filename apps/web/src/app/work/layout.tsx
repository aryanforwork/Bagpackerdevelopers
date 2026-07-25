import { fetchMetadataForPath } from "@/utils/metadata";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await fetchMetadataForPath("/work");
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
