import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import CurrentYear from "@/components/CurrentYear";
import FooterCity from "@/components/FooterCity";
import Script from "next/script";

// Local typography system fallback variables bypassing compile-time Google Fonts downloads
const geistSans = { variable: "" };
const geistMono = { variable: "" };

import { fetchMetadataForPath } from "@/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return await fetchMetadataForPath("/");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} font-sans scroll-smooth`} suppressHydrationWarning>
      <body className="bg-[#FAFAFA] text-[#18181B] min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        {/* Schema.org Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "BAGPACKERS AI Platform",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Bagpackers Developers",
                "url": "https://bagpackers.dev"
              }
            })
          }}
        />
        
        {/* Google Analytics 4 Script (Hydration and Telemetry Safe) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TELEMETRY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-TELEMETRY', {
              send_page_view: true
            });
          `}
        </Script>

        <Navbar />
        <main className="flex-1">{children}</main>
        
        {/* Multi-column Rebuilt Footer */}
        <footer className="border-t border-zinc-800 bg-[#09090B] py-16 px-6 md:px-12 text-zinc-400">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10">
            {/* Column 1: Brand & Logo */}
            <div className="md:col-span-4 space-y-4">
              <span className="font-extrabold text-lg text-white tracking-tight">
                Bagpacker<span className="text-[#10B891] font-medium">developers</span>
              </span>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
                A global, remote-first software engineering collective building high-performance AI automation pipelines, Next.js client systems, and secure Spring Boot backends.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors border border-zinc-700/50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors border border-zinc-700/50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors border border-zinc-700/50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Services */}
            <div className="md:col-span-2.5 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#10B891] border-b border-zinc-800 pb-1.5">Services</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/services/brand-website" className="hover:text-white transition-colors">Creative Frontend & 3D</Link></li>
                <li><Link href="/services/intelligent-document-processing" className="hover:text-white transition-colors">Intelligent OCR (IDP)</Link></li>
                <li><Link href="/services/custom-crm-erp-integrations" className="hover:text-white transition-colors">Spring Security & Middleware</Link></li>
                <li><Link href="/services/retrieval-augmented-generation" className="hover:text-white transition-colors">RAG & Postgres RLS</Link></li>
                <li><Link href="/services/digital-marketing" className="hover:text-white transition-colors">Digital Marketing Solutions</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="md:col-span-2.5 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#E8823A] border-b border-zinc-800 pb-1.5">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/work" className="hover:text-white transition-colors">Our Work</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Developers Profile</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/join-as-developer" className="hover:text-white transition-colors">Join as Developer</Link></li>
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-800 pb-1.5">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/sandbox" className="hover:text-white transition-colors">Utility Sandbox</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><span className="text-zinc-600 cursor-not-allowed">Blog (Coming Soon)</span></li>
              </ul>
            </div>
          </div>

          <div className="max-w-6xl mx-auto border-t border-zinc-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
            <p>© <CurrentYear /> Bagpackers Developers. All rights reserved. Platform Class: Confidential Enterprise Codebase.</p>
            <FooterCity />
          </div>
        </footer>
      </body>
    </html>
  );
}

