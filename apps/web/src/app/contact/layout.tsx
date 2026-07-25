import { fetchMetadataForPath } from "@/utils/metadata";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return await fetchMetadataForPath("/contact");
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
