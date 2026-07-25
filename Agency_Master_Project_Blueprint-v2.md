# ENTERPRISE ARCHITECTURE & MASTER PROJECT BLUEPRINT
**Global-Grade AI Automation & Software Engineering Agency Platform**  
*Version: 2.0 | Document Class: Highly Confidential / Technical Specification*

---

## Executive Summary
This master specification dictates the foundational architecture, security protocols, deployment topology, and execution roadmap for a world-class digital agency flagship platform. It integrates a high-performance Next.js frontend, a robust Java Spring Boot API backend, and a secure PostgreSQL data tier, augmented with proprietary AI automation pipelines (Intelligent Document Processing).

---

## 1. Global Infrastructure Topology
The infrastructure is distributed across specialized cloud providers to maximize performance, security, and developer velocity.

| Tier | Tech Stack | Hosting / Network | Operational Mandate |
| :--- | :--- | :--- | :--- |
| **Frontend / Edge Layer** | Next.js (App Router), React 18, Tailwind CSS, Framer Motion | Vercel Edge Network | Sub-millisecond static delivery via Edge CDN, Server-Side Rendering (SSR) for dynamic portals, strict Core Web Vitals maintenance. |
| **Backend API & Services** | Java 17+, Spring Boot 3.x, Spring Security, Hibernate | Render Web Services | Microservice orchestration, secure RESTful API routing, AI inference pipeline integration, and transactional logic. |
| **Data Persistence** | PostgreSQL 15+, PgBouncer (Connection Pooling) | Supabase Managed SQL | ACID-compliant relational data storage, Row Level Security (RLS), automated daily backups, global read replicas. |
| **Health & Orchestration** | UptimeRobot, GitHub Actions | External Node | Automated CI/CD pipelines, container warmup pings (5-minute intervals to `/api/v1/health`) to bypass free-tier idle suspension. |

---

## 2. Security & Compliance Matrix
Enterprise clients demand strict data security. The following protocols must be implemented before production deployment:

### 2.1 Network & Transport Security
* **TLS 1.3 Encryption**: Enforced globally across all Vercel edge nodes and Render APIs.
* **Database VPC Isolation**: Supabase instances must restrict inbound traffic exclusively to Render's NAT gateway IP addresses.
* **Cross-Origin Resource Sharing (CORS)**: Spring Boot `WebSecurityConfigurer` must whitelist ONLY the official Vercel production domain. All other origin requests must return a `403 Forbidden`.

### 2.2 Authentication & Authorization
* **Stateless JWT (JSON Web Tokens)**: Issued by Spring Security for client portal access, with 15-minute expiration and 7-day `HttpOnly` refresh tokens.
* **Secret Management**: Absolute zero-trust policy. No API keys or DB URIs committed to source control. Native environment variable vaults in Vercel and Render must be used exclusively.

---

## 3. Enterprise Database Blueprint
The relational schema optimized for multi-tenant client portals and AI tool telemetry.

| Entity / Table Name | Schema Definition (Columns) | Primary Purpose |
| :--- | :--- | :--- |
| `enterprise_clients` | `id` (UUID), `company_name` (VARCHAR), `admin_email` (VARCHAR), `tier` (ENUM), `created_at` (TIMESTAMP) | Manages authenticated access to proprietary client dashboards and staging links. |
| `case_studies` | `id` (UUID), `title` (VARCHAR), `slug` (VARCHAR), `tech_stack` (JSONB), `roi_metrics` (JSONB), `content` (TEXT) | Powers the high-performance Next.js portfolio with dynamic, SEO-optimized routing. |
| `ai_idp_sandbox_logs` | `id` (UUID), `session_token` (VARCHAR), `initial_image_hash` (VARCHAR), `generated_sql` (TEXT), `execution_time_ms` (INT) | Telemetry data for the Intelligent Document Processing (Directory to SQL) showcase tool. |
| `lead_conversions` | `id` (UUID), `company` (VARCHAR), `estimated_manual_hours` (INT), `projected_roi` (DECIMAL), `contact_status` (BOOLEAN) | Captures lead data generated directly from the frontend Interactive ROI Calculator. |

---

## 4. Master Execution Roadmap
A strict, phased approach to ensure continuous integration without architectural bottlenecks.

### PHASE 1: Infrastructure Provisioning & Schema Definition
1. Initialize GitHub Monorepo (or dual repos for Front/Back).
2. Provision Supabase PostgreSQL instance; generate secure connection pools.
3. Execute DDL scripts for tables defined in Section 3.
4. Establish environment variable vaults in Render and Vercel.

### PHASE 2: Backend Core & Security Implementation
1. Scaffold Java Spring Boot 3 application.
2. Implement Spring Security (CORS, JWT authentication).
3. Build REST endpoints for Case Studies and Client Lead ingestion.
4. Create the UptimeRobot health-check endpoint (`/api/v1/health`).
5. Deploy container to Render.

### PHASE 3: AI Sandbox API Wrapper
1. Encapsulate the proprietary Directory-to-SQL Python/OCR logic into a callable microservice or Spring Boot executor.
2. Apply rate-limiting (e.g., Bucket4j) to prevent abuse of the free public sandbox.
3. Verify data sanitization on generated SQL before returning payload to frontend.

### PHASE 4: High-Performance Frontend Assembly
1. Initialize Next.js App Router with Tailwind CSS.
2. Build the Global Navigation, Hero Section, and Case Study grids.
3. Develop the interactive ROI Calculator (client-side state).
4. Build the AI IDP Sandbox UI (file upload, loading state, SQL code-block display).
5. Integrate Vercel Server Actions to communicate with Render API.

### PHASE 5: SEO, Telemetry, and Production Launch
1. Inject JSON-LD Schema.org metadata into all Next.js pages.
2. Configure Google Analytics 4 (GA4) custom event triggers for calculator usage and form submits.
3. Final UptimeRobot integration to keep Render instance warm.
4. Perform Lighthouse audit (Target: >95 Performance, 100 Accessibility).

---

## 5. AI Agent Manager Delegation Protocol
**INSTRUCTIONS FOR AI MANAGER AGENT**: You are acting as the Technical Project Manager. Parse this blueprint and delegate tasks to your sub-agents exactly as follows:

| Specialist Agent | Assigned Tasks & Directives |
| :--- | :--- |
| **Database Architect Agent** | Execute PHASE 1. Write the exact PostgreSQL DDL statements for Supabase. Include proper indexing for UUIDs and foreign keys. Enforce Row Level Security (RLS) templates. |
| **Backend Engineering Agent** | Execute PHASE 2 & 3. Generate the Spring Boot controllers, Spring Security configuration class (with CORS whitelist), and the HikariCP `application.properties` file. Write the rate-limiting logic. |
| **Frontend Engineering Agent** | Execute PHASE 4. Generate the Next.js App Router file structure. Write strictly typed React Server Components. Use Tailwind CSS for highly polished, enterprise-grade dark/light themes. NO generic designs. |
| **DevOps & SEO Agent** | Execute PHASE 5. Provide the exact JSON-LD markup for an "Organization" and "SoftwareApplication". Configure the UptimeRobot ping script. |
