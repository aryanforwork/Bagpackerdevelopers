-- Seed Data for Case Studies
INSERT INTO case_studies (id, title, slug, tech_stack, roi_metrics, content, created_at)
VALUES 
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Enterprise AI Document Ingestion & IDP Pipeline',
    'enterprise-ai-document-ingestion-pipeline',
    '["Java", "Spring Boot", "Python", "Tesseract OCR", "PostgreSQL", "AWS S3"]'::jsonb,
    '{"manual_hours_saved_monthly": 1200, "efficiency_increase_percent": 85, "estimated_annual_savings_usd": 144000}'::jsonb,
    '# Case Study: Enterprise Intelligent Document Processing (IDP)

## Context
A major logistics and shipping enterprise was manually parsing over 10,000 multi-page customs documents, shipping bills, and invoices every month. This manual processing caused delayed clearance times, high human-error rates, and scalability limitations.

## Challenge
The enterprise required a highly scalable, secure, and automated solution that could ingest arbitrary scanned documents, classify them by type, perform high-accuracy Optical Character Recognition (OCR), validate critical fields (e.g. tracking numbers, total amounts, dates), and write structured transaction logs directly into their enterprise database.

## Solution
Bagpackers Developers engineered an Intelligent Document Processing (IDP) pipeline featuring:
* **Microservices Backend**: A Java Spring Boot service orchestrating files and managing database tracking, and a Python worker performing OpenCV preprocessing, image stabilization, and multi-threaded OCR parsing.
* **Intelligent Verification Sandbox**: A sandbox interface for operators to preview extracted tables side-by-side with raw PDFs.
* **Auto-generated SQL Schema Ingestion**: The system automatically generates optimized schema representations based on the parsed documents.

## Outcome & ROI Metrics
* **1,200 hours** of manual labor saved monthly.
* **85% efficiency increase** in customs declaration ingestion speed.
* **$144,000** in projected annual savings.
',
    CURRENT_TIMESTAMP
),
(
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'High-Performance Next.js Client Portal & CMS Migration',
    'nextjs-client-portal-cms-migration',
    '["Next.js", "React 18", "Tailwind CSS", "Supabase", "Framer Motion"]'::jsonb,
    '{"conversion_rate_increase_percent": 24, "lighthouse_performance_score": 98, "load_time_reduction_percent": 65}'::jsonb,
    '# Case Study: Dynamic Next.js Client Portal Migration

## Context
A fast-growing fintech company had an outdated client dashboard built on a legacy SPA framework. Slow initial load times (averaging 5.2 seconds) and lack of server-side rendering resulted in search visibility drop-offs and low user retention rates.

## Challenge
Redesign and rebuild the dashboard into a modern, lightning-fast application, maintaining top-tier security standards, server-side caching, and responsive design metrics.

## Solution
We implemented a complete rewrite using Next.js App Router, Tailwind CSS, and Supabase:
* **Server Components**: Rendered page shell and static case grids on the edge via Vercel Edge Cache.
* **Secure Client Dashboard**: HttpOnly cookies for JWT refresh loops.
* **Glassmorphic Theme**: Designed with smooth Framer Motion micro-animations.

## Outcome & ROI Metrics
* **65% reduction** in initial page-load times (from 5.2s down to 1.8s).
* **98+ Lighthouse** Performance score.
* **24% increase** in conversion rate within 90 days.
',
    CURRENT_TIMESTAMP
);

-- Seed Data for Mock Enterprise Clients
INSERT INTO enterprise_clients (id, company_name, admin_email, tier, created_at)
VALUES 
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Logistics Global Inc', 'admin@logisticsglobal.com', 'ENTERPRISE', CURRENT_TIMESTAMP),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'FinTech Frontiers', 'devops@fintechfrontiers.com', 'GROWTH', CURRENT_TIMESTAMP);

-- Seed Data for Page Metadata (SEO & OG Tags)
INSERT INTO page_metadata (path, title, description, keywords, og_image, og_title, og_description)
VALUES
('/', 'BAGPACKERS AI - Global-Grade AI Automation & Software Engineering Platform', 'Next-generation intelligent document processing (IDP), database schema generation, and high-performance serverless software engineering.', 'AI Automation, Intelligent Document Processing, Next.js, Spring Boot, Software Agency, ROI Calculator', 'https://bagpackers.dev/og-home.png', 'BAGPACKERS AI - Enterprise Automation', 'Scale your business operations with low-latency dynamic AI agents.'),
('/services', 'Our AI Automation & Full-Stack Services - BAGPACKERS AI', 'Explore our core capability catalog including multimodal OCR, RAG compliance engines, and multitenant SaaS portals.', 'OCR Services, RAG Systems, Enterprise SaaS, Headless CMS, WebGL Portals', 'https://bagpackers.dev/og-services.png', 'Advanced Services & Solutions Catalog', 'Custom autonomous agents and cloud-native digital ecosystems.'),
('/about', 'About Our Agency - BAGPACKERS AI', 'Discover our expert engineering backgrounds, development philosophies, and live client trust strategies.', 'Software Agency Team, Enterprise Engineering, Client Trust', 'https://bagpackers.dev/og-about.png', 'Expert Software Engineers & AI Architects', 'Top-tier engineering team delivering production-grade services globally.'),
('/contact', 'Get In Touch - BAGPACKERS AI', 'Inquire about custom AI automation developments or submit detailed requirement profiles.', 'Contact Agency, Hire Software Engineers, Project Inquiry', 'https://bagpackers.dev/og-contact.png', 'Partner With BAGPACKERS AI', 'Submit your product requirements or request custom proposals.'),
('/sandbox', 'Intelligent Document Processing Sandbox - BAGPACKERS AI', 'Test our real-time OCR extraction systems and schema normalization pipelines dynamically.', 'OCR Sandbox, IDP Test, SQL Schema Generator', 'https://bagpackers.dev/og-sandbox.png', 'Interactive IDP Sandbox Demo', 'Process raw text or invoices into structured relational tables instantly.'),
('/work', 'Our Portfolio & Case Studies - BAGPACKERS AI', 'Read case studies detailing measured return on investments (ROI) across dynamic client platforms.', 'Software Case Studies, ROI Success, Engineering Portfolio', 'https://bagpackers.dev/og-work.png', 'Proven Return on Investment Portfolio', 'View real performance metrics from our enterprise product launches.');

