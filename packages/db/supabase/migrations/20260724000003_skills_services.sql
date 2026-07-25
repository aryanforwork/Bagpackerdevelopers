-- 1. Create Skills Taxonomy Reference Table
CREATE TABLE IF NOT EXISTS public.skills_taxonomy (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed skills_taxonomy reference data
INSERT INTO public.skills_taxonomy (name, category) VALUES
('Next.js', 'Frontend'),
('React', 'Frontend'),
('TypeScript', 'Languages'),
('WebGL / Three.js', 'Frontend'),
('Tailwind CSS', 'Frontend'),
('Java', 'Languages'),
('Spring Boot', 'Backend'),
('PostgreSQL', 'Databases'),
('Supabase', 'Backend'),
('Python', 'Languages'),
('Docker', 'DevOps'),
('AWS', 'Cloud'),
('Search Engine Optimization', 'Marketing'),
('Paid Advertising & Funnels', 'Marketing'),
('Marketing Automation', 'Marketing')
ON CONFLICT (name) DO NOTHING;

-- 2. Create Services Reference Table
CREATE TABLE IF NOT EXISTS public.services (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed services reference data
INSERT INTO public.services (slug, title, category, description) VALUES
('intelligent-document-processing', 'Intelligent Document Processing (IDP)', 'AI & Automation', 'OCR pipelines converting unstructured PDFs to structured databases.'),
('retrieval-augmented-generation', 'Semantic RAG Systems', 'AI & Automation', 'Vector databases linking internal wikis and documents with LLMs.'),
('custom-crm-erp-integrations', 'Custom CRM & ERP Integrations', 'Enterprise', 'Secure data tunnels connecting Next.js to legacy enterprise platforms.'),
('multitenant-saas-portals', 'Multitenant SaaS Portals', 'Enterprise', 'High-performance multi-tenant web application shells.'),
('iot-logistics-automation', 'IoT & Logistics Automation', 'Industrial', 'MQTT telemetry sensor grids and automation dashboards.'),
('computer-vision-quality-control', 'Computer Vision Quality Control', 'Industrial', 'Automated product check using computer vision algorithms.'),
('predictive-analytics-dashboards', 'Predictive Analytics Dashboards', 'Business', 'Operational intelligence dashboards modeling historical metrics.'),
('regulatory-compliance-rag', 'Regulatory Compliance RAG', 'Business', 'Verify documents against operational rules and regulations.'),
('headless-cms-static-sites', 'Headless CMS & Static Sites', 'Brand', 'High-speed headless portfolios scaling to millions of visitors.'),
('immersive-webgl-portals', 'Immersive WebGL Portals', 'Brand', 'Immersive browser experiences utilizing WebGL frameworks.'),
('digital-marketing', 'Digital Marketing Solutions', 'Marketing', 'Scale campaigns, technical search optimizations, and lead conversions.')
ON CONFLICT (slug) DO NOTHING;

-- 3. Storage bucket setup for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- Enable RLS policies for avatars storage bucket
CREATE POLICY "Allow public select on avatars" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Allow authenticated insert/update on own avatar" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
