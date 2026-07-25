-- Alter projects table to add client consent field
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS client_consent_public BOOLEAN DEFAULT false;

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    gallery_urls TEXT[],
    tech_used TEXT[],
    published_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public SELECT on portfolio_items
CREATE POLICY select_public_portfolio ON public.portfolio_items
    FOR SELECT TO public
    USING (true);

-- Policy: Allow admins to manage portfolio_items
CREATE POLICY admin_manage_portfolio ON public.portfolio_items
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
