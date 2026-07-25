# Technical Requirements Document (TRD)
**Document Class: Technical Blueprint**

---

## 1. System Overview
AI-powered productivity web application with client-facing interface, secure Spring Boot API gateway, Supabase relational storage, and rate-limited Intelligent Document Processing (IDP) OCR sandbox features.

---

## 2. Technical Stack & Tools

### Frontend Stack
* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript (Strict Typings)
* **Styling**: Tailwind CSS v4, Custom CSS (Glassmorphism overlays)
* **Icons**: Lucide React

### Backend Stack
* **Framework**: Spring Boot 3.3 (Java 17)
* **Security**: Spring Security (CORS filter, CSRF disable, stateless routes)
* **Rate Limiter**: Bucket4j (10 requests/minute per client IP)
* **Database Driver**: PostgreSQL JDBC (PgBouncer compatible)

### Database Persistence
* **DBMS**: Supabase PostgreSQL 15+
* **Capabilities**: Row-Level Security (RLS) policies, indexes on slug/session fields, optimized DDL.

---

## 3. Engineering & Security Rules
1. **Scalable**: Built to support high traffic and rapid database inserts without query locks.
2. **Modular**: Loose coupling with clean boundaries (controllers, repositories, services).
3. **Observable**: Health endpoints (`/api/v1/health`) and structured exception handling logs.
4. **Secure by Default**: Environment variables for keys, whitelisted CORS, JWT verification.
