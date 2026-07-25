-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Client Tier Enum
CREATE TYPE client_tier AS ENUM ('FREE', 'GROWTH', 'ENTERPRISE');

-- 1. enterprise_clients table
CREATE TABLE IF NOT EXISTS enterprise_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    admin_email VARCHAR(255) UNIQUE NOT NULL,
    tier client_tier NOT NULL DEFAULT 'FREE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. case_studies table
CREATE TABLE IF NOT EXISTS case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
    roi_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ai_idp_sandbox_logs table
CREATE TABLE IF NOT EXISTS ai_idp_sandbox_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token VARCHAR(255) NOT NULL,
    initial_image_hash VARCHAR(64) NOT NULL,
    generated_sql TEXT NOT NULL,
    execution_time_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. lead_conversions table
CREATE TABLE IF NOT EXISTS lead_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company VARCHAR(255) NOT NULL,
    estimated_manual_hours INTEGER NOT NULL,
    projected_roi DECIMAL(12, 2) NOT NULL,
    contact_status BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    brief TEXT NOT NULL,
    company VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
-- NOTE: case_studies(slug) has an implicit unique index due to the UNIQUE constraint, manual index not required.
CREATE INDEX IF NOT EXISTS idx_case_studies_created_at ON case_studies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sandbox_session ON ai_idp_sandbox_logs(session_token);
CREATE INDEX IF NOT EXISTS idx_sandbox_created_at ON ai_idp_sandbox_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_roi ON lead_conversions(projected_roi DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON lead_conversions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON enterprise_clients(created_at DESC);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE enterprise_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_idp_sandbox_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog;

-- Trigger for enquiries table
CREATE OR REPLACE TRIGGER update_enquiries_updated_at
    BEFORE UPDATE ON enquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Security Policies

-- case_studies Policies:
-- 1. Anyone can read case studies
CREATE POLICY select_public_case_studies ON case_studies
    FOR SELECT USING (true);

-- lead_conversions Policies:
-- 1. Anyone can submit (INSERT) their lead information
CREATE POLICY insert_lead_conversions ON lead_conversions
    FOR INSERT WITH CHECK (true);

-- 2. Only authenticated users (admins) can view leads
CREATE POLICY select_admin_leads ON lead_conversions
    FOR SELECT USING (auth.role() = 'authenticated');

-- enterprise_clients Policies:
-- 1. Only authenticated users (admins/clients) can view client details
CREATE POLICY select_admin_clients ON enterprise_clients
    FOR SELECT USING (auth.role() = 'authenticated');

-- ai_idp_sandbox_logs Policies:
-- 1. Anyone can insert logs
CREATE POLICY insert_sandbox_logs ON ai_idp_sandbox_logs
    FOR INSERT WITH CHECK (true);

-- 2. Anyone can read sandbox logs from their own session
CREATE POLICY select_session_sandbox_logs ON ai_idp_sandbox_logs
    FOR SELECT USING (
        session_token = coalesce(nullif(current_setting('request.headers', true), '')::json->>'x-session-token', '')
        OR
        auth.role() = 'authenticated'
    );

-- enquiries Policies:
-- 1. Anyone can submit (INSERT) their enquiry
CREATE POLICY insert_enquiries ON enquiries
    FOR INSERT WITH CHECK (true);

-- 2. Only authenticated users (admins) can view enquiries
CREATE POLICY select_admin_enquiries ON enquiries
    FOR SELECT USING (auth.role() = 'authenticated');

-- 6. page_metadata table
CREATE TABLE IF NOT EXISTS page_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    keywords VARCHAR(255) NOT NULL,
    og_image VARCHAR(512) DEFAULT '',
    og_title VARCHAR(255) DEFAULT '',
    og_description TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_metadata_path ON page_metadata(path);
CREATE INDEX IF NOT EXISTS idx_metadata_updated_at ON page_metadata(updated_at DESC);

ALTER TABLE page_metadata ENABLE ROW LEVEL SECURITY;

-- page_metadata Policies:
-- 1. Anyone can read metadata
CREATE POLICY select_public_page_metadata ON page_metadata
    FOR SELECT USING (true);

-- 2. Only authenticated users (admins) can modify metadata
CREATE POLICY all_admin_page_metadata ON page_metadata
    FOR ALL USING (auth.role() = 'authenticated');

-- Trigger for page_metadata table
CREATE OR REPLACE TRIGGER update_page_metadata_updated_at
    BEFORE UPDATE ON page_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

