-- 1. Create Fields of Work Table
CREATE TABLE IF NOT EXISTS public.fields_of_work (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed fields_of_work reference data
INSERT INTO public.fields_of_work (name, description) VALUES
('AI Integration & Automation', 'Document processing, custom agents, retrieval augmented generation'),
('Enterprise Software & Middleware', 'Custom CRM/ERP links, multitenant gateways, security'),
('Industrial & IoT Systems', 'Telemetry dashboards, computer vision quality controls, IoT grids'),
('Creative Web Development', 'Headless CMS static portals, immersive WebGL platforms'),
('Digital Marketing Solutions', 'SEO auditing, paid campaign workflows, marketing CRM hooks')
ON CONFLICT (name) DO NOTHING;

-- 2. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    description TEXT NOT NULL,
    field_of_work TEXT NOT NULL REFERENCES public.fields_of_work(name) ON UPDATE CASCADE,
    estimated_duration TEXT NOT NULL,
    estimated_budget NUMERIC(12, 2) NOT NULL,
    budget_currency TEXT NOT NULL DEFAULT 'USD',
    status public.project_status NOT NULL DEFAULT 'submitted',
    assigned_developer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_portfolio_ready BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS on Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Clients can INSERT, SELECT, and UPDATE only their own projects
CREATE POLICY client_all_own_projects ON public.projects
    USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id);

-- 5. Updated At Trigger
CREATE OR REPLACE FUNCTION public.handle_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_project_updated ON public.projects;
CREATE TRIGGER on_project_updated
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_update_timestamp();
