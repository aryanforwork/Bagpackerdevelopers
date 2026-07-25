# Bagpackers Developers Platform

Welcome to the flagship enterprise platform for **Bagpackers Developers**—a global-grade AI automation and custom software engineering suite. This workspace is organized as a monorepo using npm workspaces.

---

## 🗂️ Monorepo Structure

```text
├── apps/
│   ├── web/                     # Next.js 16 (App Router) client app
│   │   ├── src/                 # React Server Components & Framer Motion layout views
│   │   └── package.json         # Next.js dependencies
│   └── core-service/            # Spring Boot 3.3 (Java 21) API Gateway (Gradle)
│       ├── src/                 # Core MVC source files and JUnit tests
│       └── build.gradle         # Gradle build definition
├── packages/
│   ├── config/                  # Shared configurations (theme.css, tsconfig.base.json)
│   ├── db/                      # SQL migrations and Supabase CLI configuration
│   └── ui/                      # Shared UI components (React)
├── .github/workflows/ci.yml     # Github Actions continuous integration
├── .env.example                 # Environment variables template
├── package.json                 # Monorepo workspaces definition
└── README.md                    # Root documentation
```

---

## 🚀 Key Feature List

1. **Light/Dark Hybrid Theme**: High-contrast editorial style canvas (`#FAFAFA` background, `#09090B` charcoal typography) for marketing and portfolio panels, combined with rich zinc dark containers for administrative dashboards and FAQ blocks.
2. **Floating capsule Navbar**: Centered glassmorphic capsule menu featuring a 3-column Services mega-dropdown with double-bezel cards, fully responsive with nested mobile accordions.
3. **Interactive ROI Calculator**: A real-time client ROI estimator with adjustable sliders that dynamically projects engineering savings and compiles them into lead capture payloads.
4. **Intelligent Document Processing (IDP) Sandbox**: An interactive OCR-to-SQL compiler simulator demonstrating how physical logs and unstructured lists compile to structured database schemas safely.
5. **Secure Admin Dashboard**: Restricted client-side routes powered by **Stateless JWT Authentication** (15-minute short-lived access tokens and 7-day secure `HttpOnly` refresh cookies) enabling administrative staff to manage inquiries, check conversion telemetry, and configure dynamic metadata with Google Search and Social Open Graph sharing previews.
6. **Vercel Server Actions**: Securely bridges all client-to-backend operations (contact forms, lead submissions, sandbox execution, and administrative panel requests) via Next.js Server Actions, shielding backend API URLs and credentials from client inspection.
7. **Robust Rate-Limiting**: Enforces token-bucket rate limits (`Bucket4j`) on all public endpoints to protect processing servers from flood requests.

---

## 🛠️ Local Setup & Configuration

### 1. Root Dependencies Install
Ensure you have **NodeJS 18+** installed. Run the following command from the root of the project:
```bash
npm install
```

### 2. Database Provisioning (Supabase)
Database files are located in `packages/db`.
* Init or link your Supabase CLI.
* SQL migration is located at `packages/db/supabase/migrations/20260724000000_initial_schema.sql`.
* SQL seed file is located at `packages/db/supabase/seed.sql`.

### 3. Run Backend API (Spring Boot)
Ensure you have **Java 21+** installed:
```bash
cd apps/core-service
./gradlew compileJava        # Compile the application
./gradlew test               # Run the JUnit tests
./gradlew bootRun            # Run local server at http://localhost:8080
```

### 4. Run Frontend Client (Next.js)
You can run frontend development scripts directly from the root directory:
```bash
npm run web:dev              # Runs dev server at http://localhost:3000
npm run web:build            # Compiles Next.js for production
npm run web:start            # Starts the built server
```

---

## 🌐 Production Environment Variables

### A. Next.js Frontend (Vercel)
Configure the following vars in your project dashboard:
* `NEXT_PUBLIC_API_BASE_URL`: The URL of your deployed Spring Boot API (e.g., `https://api.bagpackers.dev`).
* `API_BASE_URL`: Same as above (used during build-time dynamic static page generation).

### B. Spring Boot Backend (Render / AWS)
Configure the following environment variables:
* `SPRING_DATASOURCE_URL`: PostgreSQL JDBC connection string (e.g. `jdbc:postgresql://<db-host>:5432/postgres?sslmode=require`).
* `SPRING_DATASOURCE_USERNAME`: Supabase username (usually `postgres`).
* `SPRING_DATASOURCE_PASSWORD`: Supabase password.
* `ALLOWED_ORIGINS`: Comma-separated list of allowed origins (e.g., `https://bagpackers.dev,https://www.bagpackers.dev`).
* `SPRING_SECURITY_ADMIN_TOKEN`: A secure token used to access admin dashboard stats.
