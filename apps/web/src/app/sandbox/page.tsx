import { Metadata } from "next";
import IdpSandbox from "@/components/IdpSandbox";
import { Terminal, Shield, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Intelligent Document Processing Sandbox | Interactive OCR Engine",
  description: "Test our real-time OCR-to-SQL compiler engine. Upload log dumps, directory listings, or transaction details to witness instant database mapping and validation.",
  alternates: {
    canonical: "https://bagpackers.dev/sandbox",
  },
};

export default function SandboxPage() {
  const sandboxSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "BAGPACKERS AI IDP Sandbox",
    "url": "https://bagpackers.dev/sandbox",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sandboxSchema) }}
      />
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-16 space-y-12">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#10B891]/10 border border-[#10B891]/20 text-[#10B891] mb-2">
            <Terminal size={24} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">
            Intelligent Document Processing <span className="text-gradient">Sandbox</span>
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xl mx-auto">
            Upload log dumps, directory listings, or transaction details to test our OCR-to-SQL compiler engine. Limits: Max 10 executions/min per IP.
          </p>
        </div>

        {/* Sandbox Interface */}
        <IdpSandbox />

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-10 border-t border-zinc-200/50">
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-accent-emerald flex items-center justify-center shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-sm mb-1">Sanitized Sandbox Telemetry</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Every query compiled is fully scanned for SQL injection vectors before return statements compile. No private inputs are cached to disk.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Cpu size={18} />
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 text-sm mb-1">Bucket4j Rate Limiting</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Strict token bucket rules prevent execution flood blocks, assuring sub-millisecond compile integrity for active operators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
