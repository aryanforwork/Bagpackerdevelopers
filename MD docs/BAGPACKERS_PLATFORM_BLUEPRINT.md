# Bagpackers Developers — Global Ecosystem Blueprint
### From Agency Website → Global Freelance Software Engineering Platform
**Version:** 1.0 · **Prepared for:** Bagpackers Developers · **Doc type:** Technical SRS + Phase-wise Execution Plan for AI Coding Agents

---

## 0. Audit of Current Site (as-is analysis)

Current live site: `https://backpackerdevelopers.netlify.app/`

**What exists today:**
- Marketing homepage positioned as an **AI automation / software engineering studio** ("BAGPACKERS AI"), not yet expressing the "digital nomad developer collective" brand story you want.
- Service tiles: Next.js App Router builds, Intelligent OCR/IDP pipelines, Spring Boot security, Supabase/PostgreSQL — good technical depth, but framed as *products*, not as a *marketplace of services* with pricing tiers.
- `/work` — portfolio page (currently static, not fed by real project data).
- `/about` — team bios (Alex Mercer, Sarah Chen, Marcus Vance) + trust metrics (Zero-Trust vaulting, Core Web Vitals, uptime).
- `/sandbox` — an interactive AI utility/tools page.
- An **ROI calculator** widget on the homepage (nice differentiator — keep and extend).
- A testimonial block, FAQ accordion, stat counters (100% RLS coverage, 40k+ nodes tested).
- No client intake system, no developer registration, no project marketplace, no admin dashboard, no auth, no database-backed content — **the entire site is static marketing**, with zero workflow/backend logic.

**Gaps vs. your SRS (Section A–C):**
| Requirement | Status |
|---|---|
| Digital Marketing nav link | ❌ Missing |
| Service imagery refresh | ❌ Generic/no imagery shown in current build |
| Layout/typography pass | ⚠️ Needs audit against real content density |
| Micro-interactions/scroll animation | ⚠️ Partial (needs formal motion system) |
| "Nomadic dev community" brand story | ❌ Not present — site reads as generic SaaS-agency, not "backpack" themed |
| Travel-themed footer | ❌ Current footer is a single copyright line |
| Client project intake form | ❌ Not present |
| Public project feed (redacted) | ❌ Not present |
| Admin assignment engine | ❌ Not present |
| Auto portfolio pipeline | ❌ Not present |
| Developer registration | ❌ Not present |
| Developer directory | ❌ Not present |
| Bidding / interest counters | ❌ Not present |

**Conclusion:** the current build is a strong **Tier-1 marketing shell**. Everything in your SRS Section B & C requires a **real application layer** — auth, database, role-based dashboards, workflow state machines. This is not a "few components" job — it is a second product (a marketplace platform) sitting behind the marketing site. The plan below treats it that way.

---

## 1. Product Vision

> **Bagpackers Developers** is a global, remote-first software engineering collective — vetted developers working from anywhere, delivering enterprise-grade software to clients anywhere. The platform is simultaneously:
> 1. A **marketing site** (brand, trust, services, calculator, portfolio).
> 2. A **client intake + project marketplace** (clients submit projects → developers see redacted feed → apply → admin assigns → work happens → portfolio auto-publishes).
> 3. A **developer community platform** (profiles, directory, skills, bidding, reputation).

Design principle for every phase below: **scalable, fast, secure, boringly reliable.** No feature ships without an index on its query path, an RLS policy on its table, and a loading/empty/error state on its UI.

---

## 2. Target Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Edge / CDN (Vercel Edge Network + ISR)                         │
│  Next.js 14 App Router (Marketing + Client + Developer Portals)  │
└───────────────┬───────────────────────────────┬─────────────────┘
                │ REST/RPC (typed, zod-validated) │
   ┌────────────▼───────────┐        ┌───────────▼─────────────┐
   │ Supabase (Auth + RLS)  │        │ Spring Boot Core Services │
   │ - Postgres (primary DB)│        │ - Assignment engine       │
   │ - Storage (avatars,    │        │ - Notification service    │
   │   attachments, media)  │        │ - Portfolio publish job    │
   │ - Realtime (interest   │        │ - Admin workflow engine    │
   │   counters, status)    │        │ - Rate limiting (Bucket4j) │
   └────────────┬───────────┘        └───────────┬─────────────┘
                │                                  │
   ┌────────────▼──────────────────────────────────▼─────────────┐
   │              PostgreSQL (single source of truth)             │
   │   Row-Level Security scoped by role: client / developer /    │
   │   admin / public(anon)                                       │
   └────────────────────────────────────────────────────────────┘
```

**Stack decisions (build on what already exists — don't rip and replace):**
- **Frontend:** Next.js 14 App Router (already in use), Tailwind CSS, Framer Motion for micro-interactions, shadcn/ui for form primitives, Zustand or React Query for client state/data fetching.
- **Auth:** Supabase Auth (email/password + OAuth GitHub/Google — GitHub OAuth doubles as developer identity verification).
- **Database:** Supabase Postgres, Row Level Security everywhere (matches your existing "100% RLS Coverage" brand claim — make it literally true).
- **Heavy backend logic (assignment engine, notifications, scheduled portfolio publishing, rate limiting):** Spring Boot microservice, already part of your stack story — keep it as the "brains" layer, called via signed internal API from Next.js server actions.
- **File storage:** Supabase Storage (resumes, portfolio images, avatars) — signed URLs only, never public buckets for sensitive docs.
- **Search/Directory filtering:** Postgres full-text search (pg_trgm + GIN indexes) — no need for Elasticsearch at this scale; revisit at 50k+ developer profiles.
- **Realtime interest counters / status badges:** Supabase Realtime channels.
- **Observability:** Vercel Analytics + Sentry (frontend), Spring Boot Actuator + Prometheus/Grafana (backend), matches your existing "System Telemetry" homepage widget — wire it to real data instead of hardcoded values once backend exists.
- **CI/CD:** GitHub Actions → preview deploys on Vercel (frontend) + Docker image build → Railway/Fly.io/Render for Spring Boot service.

---

## 3. Core Data Model (Entity Overview)

```sql
-- Roles are enforced via Supabase auth.users + a profiles table with a role enum
CREATE TYPE user_role AS ENUM ('client', 'developer', 'admin');
CREATE TYPE project_status AS ENUM ('submitted', 'in_review', 'open_for_bids', 'assigned', 'in_progress', 'completed', 'archived');
CREATE TYPE interest_status AS ENUM ('pending', 'shortlisted', 'rejected', 'accepted');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'client',
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE client_profiles (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  organization_name TEXT,
  profession TEXT,
  field_of_work TEXT
);

CREATE TABLE developer_profiles (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  bio TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  highest_qualification TEXT,
  institution_name TEXT,
  certifications TEXT[],
  years_experience NUMERIC(4,1),
  primary_skills TEXT[],
  tech_stack TEXT[],
  service_capabilities TEXT[],   -- references services.slug
  verification_status TEXT DEFAULT 'pending', -- pending/verified/rejected
  is_public BOOLEAN DEFAULT true
);

CREATE TABLE services (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,  -- e.g. 'engineering', 'digital_marketing', 'design'
  description TEXT,
  icon_url TEXT,
  display_order INT DEFAULT 0
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id),
  project_name TEXT NOT NULL,
  description TEXT NOT NULL,
  field_of_work TEXT,
  estimated_duration TEXT,
  estimated_budget NUMERIC(12,2),
  budget_currency TEXT DEFAULT 'USD',
  status project_status NOT NULL DEFAULT 'submitted',
  assigned_developer_id UUID REFERENCES profiles(id),
  is_portfolio_ready BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE project_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  developer_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT,
  status interest_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, developer_id)
);

CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  summary TEXT,
  cover_image_url TEXT,
  gallery_urls TEXT[],
  tech_used TEXT[],
  published_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes (non-negotiable for scale)
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_interests_project ON project_interests(project_id);
CREATE INDEX idx_dev_skills_gin ON developer_profiles USING GIN (primary_skills);
CREATE INDEX idx_dev_public ON developer_profiles(is_public) WHERE is_public = true;
```

RLS policy pattern (applied per table in Phase 1):
- `public`/anon: SELECT only on `services`, redacted columns of `projects` (via a view), `portfolio_items`, `developer_profiles` where `is_public = true`.
- `client`: full CRUD on their own rows in `projects`; SELECT on their own `client_profiles`.
- `developer`: SELECT on open `projects`; INSERT on `project_interests` for themselves only; full CRUD on their own `developer_profiles`.
- `admin`: full access via a `service_role` bypass used only in the Spring Boot backend, never exposed to the browser.

---

## 4. Phase-Wise Roadmap (Overview)

| Phase | Name | Outcome |
|---|---|---|
| 0 | Foundation & Repo Hygiene | Monorepo structure, design tokens, CI/CD, environments |
| 1 | Brand, UI/UX & Marketing Site Rebuild | SRS Section A fully implemented |
| 2 | Auth & Role Infrastructure | Supabase auth, roles, protected routes |
| 3 | Client Intake & Project Workflow | SRS Section B.1–B.3 |
| 4 | Developer Registration & Directory | SRS Section C.1–C.2 |
| 5 | Bidding, Interest Feed & Realtime Counters | SRS Section B.2 (feed) + C.3 |
| 6 | Admin Command Center | Assignment engine, moderation, analytics |
| 7 | Portfolio Automation Pipeline | SRS Section B.4 |
| 8 | Scale, Performance & Global Readiness | i18n, CDN, load testing, SEO, observability |
| 9 | Growth Layer (post-MVP) | Ratings, payments/escrow, contracts, notifications, marketing automation |

Each phase below contains: **Objectives → Deliverables → Data/API additions → Step-by-step tasks → a ready-to-paste AI agent prompt.**

Use the prompts sequentially in a single repo with your AI coding agent (Claude Code, Cursor, etc.). Each prompt assumes the agent has read access to the repo and previous phase's output.

---

## Phase 0 — Foundation & Repo Hygiene

**Objectives:** Establish a scalable project skeleton before any feature work, so phases 1–9 don't require re-architecture.

**Deliverables:**
- Monorepo layout: `/apps/web` (Next.js), `/apps/core-service` (Spring Boot), `/packages/ui`, `/packages/config` (eslint, tsconfig, tailwind tokens), `/packages/db` (SQL migrations + generated types).
- Environment strategy: `.env.local`, `.env.staging`, `.env.production`; secrets never committed.
- Design tokens file (colors, spacing, radii, motion durations) extracted from current site + a "travel/nomad" accent palette (terracotta, canvas beige, deep teal, sunset orange) layered onto the existing dark "telemetry" theme.
- GitHub Actions: lint → typecheck → test → preview deploy.
- Supabase project provisioned (dev + prod), migration tool chosen (Supabase CLI migrations, versioned in `/packages/db/migrations`).

### AI Agent Prompt — Phase 0
```
You are a senior platform engineer setting up the foundation for "Bagpackers Developers," 
a global freelance software engineering marketplace. The existing production site is a 
Next.js 14 App Router marketing site (already deployed). Do NOT discard existing pages 
or components — restructure around them.

Tasks:
1. Convert the repo into a monorepo using pnpm workspaces (or Turborepo) with:
   - apps/web  → existing Next.js app, moved in as-is, verified still builds
   - apps/core-service → new Spring Boot 3 (Java 21) service, Gradle, with actuator, 
     Bucket4j rate limiting starter, and a placeholder /api/v1/health endpoint
   - packages/ui → shared React components (buttons, cards, badges) extracted from 
     the current homepage/about page markup
   - packages/config → shared eslint, tsconfig, tailwind.config base
   - packages/db → SQL migrations folder + Supabase CLI config
2. Set up environment variable scaffolding for local/staging/prod, and a .env.example 
   with placeholders only (never real secrets).
3. Extract a design tokens file (tailwind theme extension) capturing the CURRENT dark, 
   telemetry-style palette, then ADD a secondary "nomad" accent palette (terracotta 
   #C1622C, canvas beige #EDE3D2, deep teal #12403D, sunset orange #E8823A) to be used 
   for brand storytelling sections, without breaking the current visual identity.
4. Add GitHub Actions workflow: on PR → install, lint, typecheck, build apps/web; 
   on push to main → same + deploy trigger placeholder.
5. Initialize a Supabase project config locally (supabase init) and create the 
   migrations folder structure, but do NOT apply migrations yet — that happens in Phase 2.
6. Produce a README.md documenting the new repo structure, how to run each app locally, 
   and the environment variables required.

Constraints: do not change any visible UI or copy in this phase. This is purely 
structural. Confirm the existing site still builds and deploys identically after 
the restructure.
```

---

## Phase 1 — Brand, UI/UX & Marketing Site Rebuild (SRS Section A)

**Objectives:** Implement every item in SRS Section A without touching backend/workflow logic yet.

**Deliverables:**
1. Navbar: add **"Digital Marketing Solutions"** entry (dropdown if you offer multiple marketing sub-services: SEO, Paid Ads, Content, Social) linking to a new `/services/digital-marketing` page built with the same "service detail" template as existing service pages.
2. Visual assets: replace generic icon-only service tiles with real screenshots/mockups or custom illustrations per service (OCR pipeline, Spring Boot security, Next.js, Digital Marketing, etc.) — use consistent aspect ratio, lazy-loaded, `next/image` with blur placeholders.
3. Typography/layout pass: introduce a type scale (e.g., 12/14/16/18/24/32/48px with 1.5–1.6 line-height for body, 1.2 for headings), consistent section padding scale (`py-16 md:py-24`), and convert any dense paragraph blocks into scannable bullet/card layouts.
4. Motion system: Framer Motion variants for fade-up-on-scroll (IntersectionObserver-based, respecting `prefers-reduced-motion`), hover micro-interactions on cards/buttons (scale 1.02, 150ms ease), all animations GPU-accelerated (`transform`/`opacity` only) to protect Lighthouse scores.
5. Brand storytelling section ("Why Bagpackers") — a new homepage section (between Services and Testimonials) telling the "global nomadic developer collective" story with a world-map visual or route-line illustration, and 3–4 pillars (Remote-first, Time-zone coverage, Vetted talent, Always-on delivery).
6. Rebuilt footer: multi-column (Company / Services / Developers / Resources / Legal), a "currently building from 🌍 [rotating city name]" nomad-themed micro-detail, social links, and a subtle route-line/passport-stamp graphic motif — while keeping load weight minimal (SVG, not heavy images).

### AI Agent Prompt — Phase 1
```
You are a senior frontend engineer and brand designer working on the Bagpackers 
Developers Next.js 14 site (apps/web in the monorepo). Implement the following, 
preserving existing routes, SEO metadata, and the current dark "telemetry" visual 
identity as the base theme:

1. NAVBAR: Add a new top-level nav item "Digital Marketing Solutions" linking to 
   /services/digital-marketing. Build this page using the exact same layout/component 
   pattern as the existing /services/[slug] pages (reuse the service detail template — 
   do not fork a new one). Content: SEO, Paid Advertising, Content Marketing, Social 
   Media Management, Marketing Automation — as sub-cards within the page.

2. IMAGERY: Replace all icon-only service cards on the homepage and service detail 
   pages with a cover image (next/image, width/height set, placeholder="blur"). 
   Source or generate placeholder-quality images per service category (OCR/document 
   scanning visual, backend security/lock visual, cloud database visual, marketing 
   analytics dashboard visual). Keep total added image payload under 150KB per image 
   (WebP/AVIF).

3. TYPOGRAPHY & LAYOUT: Define a type scale and spacing scale in the Tailwind config 
   (packages/config). Refactor all long-form text blocks (About page bios, FAQ answers, 
   service descriptions) to use this scale, with max line length ~65-75 characters 
   (max-w-prose), 1.6 line-height for body text, and convert any wall-of-text into 
   bullet or 2-column card layouts.

4. MOTION SYSTEM: Add a shared `packages/ui/motion.ts` exporting Framer Motion variants: 
   fadeUp, staggerContainer, hoverScale. Apply fadeUp+staggerContainer to each homepage 
   section on scroll-into-view using `whileInView`, respecting `prefers-reduced-motion` 
   (skip animation entirely if set). Apply hoverScale to all card and button components. 
   Verify with Lighthouse that animations do not drop the performance score below 90.

5. BRAND STORY SECTION: Add a new homepage section between "Services" and "Testimonials" 
   titled "A Global Collective, Not an Office." Include a world-map or route-line SVG 
   illustration (built inline as SVG, not an image asset) and 4 pillar cards: 
   Remote-First Engineering, 24-Hour Time-Zone Coverage, Vetted Global Talent, 
   Always-On Delivery. Tone: confident, professional, not gimmicky.

6. FOOTER REBUILD: Replace the current single-line footer with a multi-column footer:
   - Column 1: Logo + one-line brand statement + social icons (GitHub, LinkedIn, X)
   - Column 2: Services (link list)
   - Column 3: Company (About, Our Work, Careers/Join as Developer, Contact)
   - Column 4: Resources (Sandbox/Utility Tools, FAQ, Blog placeholder)
   - Bottom bar: copyright + "Platform Class: Confidential Enterprise Codebase" 
     (existing line) + a small rotating/static "Currently building from [city]" detail 
     with a subtle passport-stamp or route-line SVG accent — no heavy imagery.
   Keep footer fully responsive (stacked columns on mobile).

Constraints: no backend, no forms with real submission logic yet — those come in later 
phases. All new components must have loading and empty states styled consistently even 
if data is currently static. Run and paste Lighthouse performance/accessibility scores 
before/after.
```

---

## Phase 2 — Auth & Role Infrastructure

**Objectives:** Stand up the identity layer every later phase depends on.

**Deliverables:**
- Supabase Auth wired into Next.js (email/password + GitHub OAuth for developers).
- `profiles` table + trigger to auto-create a profile row on signup, defaulting role based on signup entry point (`/join-as-client` vs `/join-as-developer`).
- Middleware-based route protection: `/dashboard/client/*`, `/dashboard/developer/*`, `/dashboard/admin/*`.
- Session-aware navbar (Sign In / Dashboard / Sign Out states).

### AI Agent Prompt — Phase 2
```
You are a senior full-stack engineer implementing authentication and role-based access 
for the Bagpackers Developers platform (apps/web, Supabase backend).

Tasks:
1. Apply the `profiles`, `client_profiles`, `developer_profiles` migrations (from 
   packages/db) to the Supabase project. Add a Postgres trigger `handle_new_user()` 
   that inserts a row into `profiles` on every new `auth.users` insert, defaulting 
   `role` based on a `role` value passed in `raw_user_meta_data` at signup.
2. Implement Supabase Auth in apps/web:
   - Email/password signup and login pages at /auth/sign-up and /auth/sign-in
   - Two signup entry points: /join-as-client and /join-as-developer, each passing 
     the correct role in user metadata
   - GitHub OAuth as an additional option specifically on /join-as-developer (it 
     doubles as light identity verification for developers)
3. Add Next.js middleware that protects /dashboard/client, /dashboard/developer, and 
   /dashboard/admin route groups, redirecting unauthenticated users to /auth/sign-in 
   and mismatched-role users to a 403 page.
4. Update the navbar: show "Sign In" + "Join as Developer" when logged out; show an 
   avatar dropdown (Dashboard / Sign Out) when logged in, with the dashboard link 
   routed by role.
5. Write RLS policies for profiles, client_profiles, developer_profiles exactly as 
   specified in the SRS data model: users can only read/write their own profile rows; 
   public SELECT is disabled on these tables (directory visibility comes later via a 
   dedicated public view, not direct table access).
6. Add basic Jest/Playwright tests: signup as client, signup as developer, confirm 
   correct redirect and correct role stored.

Constraints: never expose the Supabase service_role key to the client. All auth 
forms must have proper loading/error/disabled states and accessible labels.
```

---

## Phase 3 — Client Intake & Project Workflow (SRS Section B.1–B.3)

**Objectives:** Let clients submit projects; let admins triage and assign; enforce status lifecycle.

**Deliverables:**
- `/dashboard/client/new-project` form capturing all 7 fields from SRS B.1.
- `/dashboard/client/projects` — client's own project list with live status badges.
- `projects` table + RLS (client CRUD own rows only).
- Admin view `/dashboard/admin/projects` with filters: All / In Review / Assigned To, and an assign-to-developer action.
- Status state machine enforced server-side (a project cannot jump from `submitted` directly to `completed`, etc.).

### AI Agent Prompt — Phase 3
```
You are a senior full-stack engineer building the client project intake and admin 
assignment workflow for Bagpackers Developers (Next.js + Supabase + Spring Boot).

Tasks:
1. Apply the `projects` table migration (fields: client_id, project_name, description, 
   field_of_work, estimated_duration, estimated_budget, budget_currency, status, 
   assigned_developer_id, is_portfolio_ready, timestamps) with RLS: 
   - clients can INSERT/SELECT/UPDATE only their own rows (client_id = auth.uid())
   - developers/anon have NO direct access to this table (they use a redacted view 
     built in Phase 5)
   - admin access only via the Spring Boot service using the service_role key, never 
     from the browser
2. Build /dashboard/client/new-project: a multi-step or single-page form (zod-validated, 
   React Hook Form) capturing: Client/Organization Name, Profession, Field of Work 
   (select from a fixed taxonomy list stored in a `fields_of_work` reference table), 
   Projected Completion Duration, Estimated Budget, Project Name, Complete Project 
   Description. On submit, insert into `projects` with status='submitted'.
3. Build /dashboard/client/projects: list the logged-in client's own projects with a 
   status badge (submitted/in_review/open_for_bids/assigned/in_progress/completed/
   archived), showing assigned developer's name+avatar once assigned.
4. In apps/core-service (Spring Boot), implement a `ProjectWorkflowService` exposing 
   an internal-only endpoint POST /internal/projects/{id}/transition that:
   - Validates status transitions against an explicit state machine: 
     submitted → in_review → open_for_bids → assigned → in_progress → completed → archived 
     (no skipping states except in_review → archived for rejected projects)
   - Updates the `projects` row via the Supabase service_role connection
   - Emits a domain event (log for now; queue-ready interface for later notification work)
5. Build /dashboard/admin/projects: a table with tab filters "All Projects / In Review / 
   Assigned To [developer]", a detail drawer per project, and an "Assign Developer" 
   action (searchable developer select, calls the transition endpoint to move status 
   to 'assigned' and set assigned_developer_id).
6. Add server-side pagination (cursor-based, 20 rows/page) to both client and admin 
   project lists — do not fetch unbounded rows.

Constraints: every mutation must go through validated server actions or the Spring 
Boot internal API — never raw client-side inserts bypassing validation. Every list 
view needs loading skeletons and an empty state.
```

---

## Phase 4 — Developer Registration & Directory (SRS Section C.1–C.2)

**Objectives:** Build the developer-side profile pipeline and the public showcase directory.

**Deliverables:**
- `/dashboard/developer/onboarding` — multi-step registration form covering all C.1 fields.
- `developer_profiles` table + RLS (developer owns their row; public SELECT only via a redacted view).
- `/developers` public directory page with filter/search (skill, specialization, experience range).
- Profile card component: name, profession/specialization, years experience, highest qualification, photo — matching SRS C.2 exactly (no contact info, no links exposed publicly unless developer opts in).

### AI Agent Prompt — Phase 4
```
You are a senior full-stack engineer building the developer onboarding pipeline and 
public developer directory for Bagpackers Developers.

Tasks:
1. Apply the `developer_profiles` migration and reference tables: `certifications` 
   (free text array is fine at this scale), `skills_taxonomy` (curated list feeding a 
   multi-select), `services` (id/slug/title/category — reuse for "service capabilities" 
   selection).
2. Build a multi-step onboarding wizard at /dashboard/developer/onboarding:
   Step 1 — Personal info (full name, bio, avatar upload to Supabase Storage)
   Step 2 — Social/professional links (GitHub required, LinkedIn required, portfolio 
     URL optional)
   Step 3 — Education (highest qualification select, institution name, certifications 
     as tag input)
   Step 4 — Experience & skills (years experience numeric, primary skills multi-select 
     from skills_taxonomy, tech stack tag input)
   Step 5 — Service capabilities (multi-select from the `services` table — which 
     agency services this developer can execute)
   On final submit, upsert into developer_profiles with verification_status='pending' 
   and is_public=false until an admin verifies (verification action comes in Phase 6).
3. Create a public Postgres VIEW `public_developer_directory` exposing ONLY: full_name, 
   avatar_url, profession/specialization (derive from primary_skills[0] or a dedicated 
   field), years_experience, highest_qualification — for rows where is_public=true AND 
   verification_status='verified'. Grant SELECT on this view to the anon role; do NOT 
   grant SELECT on the base developer_profiles table to anon.
4. Build /developers: a public directory page reading from public_developer_directory, 
   with client-side filters (search by name/skill, filter by experience range, filter 
   by specialization), paginated (20/page), each card linking to a (future) full public 
   profile page.
5. Build /dashboard/developer/profile: the developer's own editable view of their full 
   profile (all fields, including private ones), with a "Public visibility" toggle 
   (writes to is_public, but does not override admin verification gating).

Constraints: never expose developer contact info or unverified profiles through the 
public view. Onboarding form must persist progress between steps (local state is fine; 
no need for draft persistence to DB at this stage). Image uploads must be validated 
(type/size) client- and server-side.
```

---

## Phase 5 — Project Feed, Bidding & Realtime Interest (SRS Section B.2 + C.3)

**Objectives:** Give verified developers a redacted public/developer-facing project feed, let them express interest, and show live interest counts.

**Deliverables:**
- Public Postgres VIEW `public_project_feed` exposing only: project_name, estimated_duration, description, and a computed `interest_count`.
- `/projects` (or `/dashboard/developer/feed`) page listing open projects (`status = 'open_for_bids'`) from this view.
- `project_interests` table + RLS (developer can insert/select only their own interest rows; counts are public via aggregate).
- "I'm Interested" action with optional short message, disabled if already submitted.
- Realtime-updating interest counter badge per project card (Supabase Realtime subscription).

### AI Agent Prompt — Phase 5
```
You are a senior full-stack engineer implementing the project marketplace feed and 
bidding/interest system for Bagpackers Developers.

Tasks:
1. Apply the `project_interests` migration (project_id, developer_id, message, status, 
   created_at, unique constraint on project_id+developer_id). RLS: developers can 
   INSERT their own row and SELECT their own rows; no UPDATE/DELETE from the client 
   (status changes to shortlisted/accepted/rejected happen via the admin/Spring Boot 
   path only).
2. Create a public Postgres VIEW `public_project_feed` joining `projects` (only rows 
   where status='open_for_bids') with a `LEFT JOIN LATERAL` aggregate count from 
   project_interests, exposing ONLY: id, project_name, estimated_duration, description, 
   field_of_work, interest_count. Explicitly exclude client_id, organization identity, 
   and budget. Grant SELECT to the `authenticated` role only (feed requires login as a 
   developer, per SRS "restricted public/developer-facing view").
3. Build /dashboard/developer/feed: list from public_project_feed, each card showing 
   project name, duration, description (truncated with "read more"), and a live 
   interest_count badge. Add an "I'm Interested" button that opens a small modal for 
   an optional message, then inserts into project_interests. Button becomes a disabled 
   "Interest Submitted ✓" state if the developer already has a row for that project.
4. Wire Supabase Realtime: subscribe to INSERT events on project_interests filtered by 
   project_id for all currently-rendered cards, and increment the visible counter 
   optimistically + reconcile on the realtime event, so counts update live across all 
   connected developers without a page refresh.
5. Add a lightweight rate limit (client-side debounce + a Spring Boot Bucket4j-backed 
   endpoint check) preventing spam "interest" submissions from a single account 
   (e.g., max 20 new interests per hour per developer).
6. Add server-side pagination/infinite scroll to the feed (cursor-based on created_at), 
   defaulting to newest-first, with a filter for field_of_work.

Constraints: interest_count must be computed, never client-trusted. All realtime 
subscriptions must be cleaned up on component unmount to avoid leaking connections at 
scale.
```

---

## Phase 6 — Admin Command Center

**Objectives:** Give admins full operational control: verification, assignment, moderation, analytics.

**Deliverables:**
- `/dashboard/admin` overview: pending developer verifications, pending projects, recent activity.
- Developer verification queue (approve/reject → flips `verification_status`/`is_public`).
- Project assignment console (from Phase 3, extended with interest list per project so admin can pick from developers who expressed interest, not just any developer).
- Basic analytics: projects by status, top skills in demand, developer growth over time.

### AI Agent Prompt — Phase 6
```
You are a senior full-stack engineer building the admin command center for Bagpackers 
Developers.

Tasks:
1. Harden admin access: create an `is_admin()` Postgres function checking 
   profiles.role='admin', and use it in RLS policies for any admin-only reads/writes 
   that must happen through Supabase directly (rare — prefer routing admin writes 
   through the Spring Boot internal API which uses service_role, per Phase 3).
2. Build /dashboard/admin (overview): cards showing counts — pending developer 
   verifications, projects in review, open-for-bid projects, projects in progress — 
   each linking to its respective management screen.
3. Build /dashboard/admin/developers: a table of developer_profiles with 
   verification_status filter tabs (Pending/Verified/Rejected), profile detail drawer, 
   and Approve/Reject actions calling a Spring Boot endpoint 
   POST /internal/developers/{id}/verify that sets verification_status and is_public 
   accordingly, and (future-ready) triggers a notification.
4. Extend /dashboard/admin/projects (from Phase 3): when a project is 'open_for_bids', 
   show the list of developers who submitted interest (joined from project_interests), 
   sortable by years_experience/skills match, with an "Assign" button per candidate 
   that calls the existing transition endpoint (status → assigned, 
   assigned_developer_id set, and all other interest rows for that project marked 
   'rejected', the chosen one 'accepted').
5. Build a simple analytics view /dashboard/admin/analytics using SQL aggregate 
   queries (no external BI tool needed yet): projects grouped by status over time 
   (line chart), top 10 most-selected primary_skills across developer_profiles (bar 
   chart), developer signups per week (bar chart). Use a lightweight charting lib 
   (Recharts) already available in the stack.
6. Add an audit log table `admin_actions` (admin_id, action_type, target_table, 
   target_id, created_at) written to on every verify/assign/reject action, and a 
   simple read-only log view in the admin dashboard.

Constraints: every admin mutation must be logged to admin_actions. No admin screen may 
call Supabase directly with elevated privileges from the browser — always route through 
the Spring Boot internal API guarded by a service-to-service auth header.
```

---

## Phase 7 — Portfolio Automation Pipeline (SRS Section B.4)

**Objectives:** Automatically move completed, approved projects into the public "Our Works" showcase.

**Deliverables:**
- Admin action "Mark Completed & Publish" on a project → creates a `portfolio_items` row.
- `/work` page rewired from static content to query `portfolio_items` dynamically.
- Optional: a lightweight "completion checklist" (client sign-off, final deliverable link) gating the publish action.

### AI Agent Prompt — Phase 7
```
You are a senior full-stack engineer building the automated portfolio publishing 
pipeline for Bagpackers Developers.

Tasks:
1. Add a `portfolio_items` table (already defined in packages/db) if not yet applied: 
   project_id, title, summary, cover_image_url, gallery_urls, tech_used, published_at. 
   Public SELECT allowed (this powers the public /work page).
2. In the Spring Boot ProjectWorkflowService, add an endpoint 
   POST /internal/projects/{id}/complete-and-publish that:
   - Validates the project is in status='completed' (only reachable from 'in_progress' 
     per the existing state machine)
   - Requires a small payload: title (defaults to project_name), summary, 
     cover_image_url, gallery_urls[], tech_used[]
   - Inserts a portfolio_items row, sets projects.is_portfolio_ready=true, transitions 
     status to 'archived'
3. Build an admin UI step: on a project detail view where status='in_progress', add a 
   "Mark Completed" action opening a small form (summary, cover image upload to 
   Supabase Storage, gallery images, tech tags) that calls the endpoint above.
4. Rewire the existing /work page: replace static portfolio content with a query 
   against `portfolio_items` (server component, ISR revalidate every 60s is enough — 
   this data changes rarely), rendering cover image, title, summary, and tech tags, 
   linking to a /work/[id] detail page with the full gallery.
5. Ensure client organization identity is NOT exposed on the public portfolio unless 
   the client explicitly consented (add a `client_consent_public` boolean on `projects`, 
   default false, surfaced as a checkbox during intake in Phase 3 — retrofit that field 
   and form checkbox now). If false, omit any client-identifying text from the 
   portfolio item.

Constraints: publishing must be a single atomic admin action, not a multi-step manual 
process prone to half-published states — wrap the insert+status-update in a DB 
transaction.
```

---

## Phase 8 — Scale, Performance & Global Readiness

**Objectives:** Make the platform actually behave like a "global level" product: fast everywhere, resilient under load, discoverable, observable.

**Deliverables:**
- Internationalization scaffold (even if only English at launch, structure for future locales) using `next-intl` or App Router's built-in i18n routing.
- CDN/edge caching review: static marketing pages fully static/ISR; dashboards fully dynamic; images on `next/image` with remote patterns configured for Supabase Storage.
- Load testing pass (k6 or Artillery) on: project feed endpoint, directory endpoint, submission form — targeting realistic concurrency (e.g., 200 concurrent users) before declaring "global scale."
- SEO pass: sitemap.xml, robots.txt, structured data (JSON-LD Organization + Service schema), per-service and per-developer OpenGraph images.
- Full observability: Sentry error tracking wired on both apps, Spring Boot Actuator + Prometheus metrics, and the homepage's existing "System Telemetry" widget switched from hardcoded values to real live health/rate-limit data.
- Security pass: dependency audit, CSP headers, rate limiting on all public mutation endpoints (form submissions, interest submissions), Supabase RLS policy test suite (automated tests that attempt cross-tenant access and assert failure).

### AI Agent Prompt — Phase 8
```
You are a senior platform/SRE engineer hardening Bagpackers Developers for global-scale 
production readiness.

Tasks:
1. Set up i18n scaffolding using next-intl (or App Router i18n routing) with English 
   as the only shipped locale for now, but all user-facing static copy extracted into 
   locale message files (not hardcoded JSX strings), so adding a second language later 
   is a translation-file exercise, not a refactor.
2. Audit caching strategy: confirm homepage, /about, /work, /services/* use static 
   generation or ISR (revalidate: 300 for /work since portfolio changes occasionally); 
   confirm /dashboard/* routes are fully dynamic (force-dynamic) and never cached; 
   configure next.config.js images.remotePatterns for the Supabase Storage domain.
3. Write k6 (or Artillery) load test scripts for: GET /developers (directory), 
   GET /dashboard/developer/feed (project feed), POST project submission, POST 
   express-interest. Run at 50, 100, 200 concurrent virtual users and record p95 
   latency; fix any endpoint exceeding 500ms p95 by adding missing indexes or 
   converting to a cached/ISR read where safe.
4. SEO: generate sitemap.xml and robots.txt dynamically from the services/portfolio/ 
   developer-directory tables, add JSON-LD structured data (Organization schema on 
   homepage, Service schema per /services/[slug] page), and per-page OpenGraph images 
   (use @vercel/og for dynamic OG image generation on developer/portfolio pages).
5. Observability: install Sentry in apps/web (client+server) and apps/core-service; 
   expose Spring Boot Actuator metrics to Prometheus; replace the homepage's static 
   "System Telemetry" numbers (API health, rate limit, RLS status) with a live fetch 
   from the actual /api/v1/health and a real rate-limit status endpoint.
6. Security hardening: add CSP and standard security headers via next.config.js 
   headers(), run `npm audit`/`pnpm audit` and patch high/critical issues, enforce 
   Bucket4j rate limits on all public mutation endpoints (project submission: 5/hour/IP; 
   interest submission: 20/hour/user — already scoped in Phase 5), and write an 
   automated RLS test suite (e.g., using the Supabase JS client with different mock 
   JWTs) asserting: a client cannot read another client's projects; a developer cannot 
   read another developer's private profile fields; anon cannot read raw `projects` 
   or `developer_profiles` tables directly.

Constraints: every fix must be measured before/after (attach load test numbers and 
Lighthouse scores in the PR description). No feature regressions to existing pages.
```

---

## Phase 9 — Growth Layer (Post-MVP, prioritize after Phases 0–8 are stable in production)

Pick and sequence based on business priority — not required for initial "global scale" launch, but plan for them structurally now:

- **Reputation system:** client star-ratings + written reviews on completed projects, surfaced on developer public profiles.
- **Escrow/payments:** Stripe Connect for milestone-based payments between client and platform/developer.
- **Contracts:** auto-generated project agreement (PDF) at assignment time, e-signature (e.g., Documenso self-hosted or a signing API).
- **Notifications:** transactional email (Resend/Postmark) + in-app notification bell for status changes, new interest, new assignment.
- **Messaging:** in-platform client↔developer↔admin thread per project (avoids leaking personal contact info before assignment).
- **Marketing automation:** the "Digital Marketing Solutions" service itself could dogfood a CRM pipeline (lead capture from the ROI calculator → nurture sequence).

---

## 5. Non-Functional Requirements (apply across all phases)

| Category | Requirement |
|---|---|
| **Performance** | Lighthouse ≥ 90 on all public pages; p95 API latency < 500ms |
| **Security** | RLS on every table with user data; no service_role key in browser bundles; input validation both client (zod) and server side |
| **Scalability** | Cursor-based pagination everywhere; indexed query paths; stateless Spring Boot service (horizontally scalable) |
| **Accessibility** | WCAG 2.1 AA on forms and directory (labels, focus states, contrast) |
| **Reliability** | Health checks on both apps; state machine prevents invalid project status transitions; DB transactions on multi-write operations (e.g., portfolio publish) |
| **Observability** | Every write path logged; error tracking on both frontend and backend |

---

## 6. Success Metrics (KPIs to track post-launch)

- Time from project submission → admin triage (target < 24h)
- Time from "open for bids" → assignment (target < 72h)
- Developer directory search-to-profile-view conversion
- % of completed projects auto-published to portfolio within 24h of completion
- p95 latency on feed/directory endpoints under real traffic
- Core Web Vitals (LCP/INP/CLS) on marketing pages in the field (CrUX data), not just lab Lighthouse

---

## 7. How to Use This Document

1. Feed each phase's **AI Agent Prompt** to your coding agent **in order** — each assumes prior phases are merged into `main`.
2. After each phase, run the constraints/checks listed (Lighthouse, load test, RLS test) before moving to the next phase — this is what keeps "scalable and fast" true throughout, not just at the end.
3. Treat Section 3 (Core Data Model) as the contract — if a later phase needs a schema change, update the migration files in `packages/db` first, then regenerate types, then build UI against the new types.
4. Revisit Phase 9 priorities once Phases 0–8 are live and you have real usage data.
