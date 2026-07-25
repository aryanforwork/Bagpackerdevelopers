import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retrieval-Augmented Generation (RAG) Systems | Enterprise AI Search",
  description: "Supercharge your organizational knowledge base with production-grade RAG systems. Implement semantic search, pgvector indexing, and hallucination-free LLM generation.",
  alternates: {
    canonical: "https://bagpackers.dev/services/retrieval-augmented-generation",
  },
};

export default function RAGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
