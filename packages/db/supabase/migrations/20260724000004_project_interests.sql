-- Create project_interests table
CREATE TABLE IF NOT EXISTS public.project_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    developer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT,
    status TEXT DEFAULT 'pending', -- pending, shortlisted, rejected, accepted
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(project_id, developer_id)
);

CREATE INDEX IF NOT EXISTS idx_interests_project ON public.project_interests(project_id);

-- Enable RLS
ALTER TABLE public.project_interests ENABLE ROW LEVEL SECURITY;

-- Policies for project_interests
CREATE POLICY select_own_interests ON public.project_interests
    FOR SELECT TO authenticated
    USING (auth.uid() = developer_id);

CREATE POLICY insert_own_interests ON public.project_interests
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = developer_id);

-- 2. Create the redacted project feed VIEW
CREATE OR REPLACE VIEW public.public_project_feed AS
SELECT 
    p.id, 
    p.project_name, 
    p.estimated_duration, 
    p.description, 
    p.field_of_work,
    p.created_at,
    COALESCE(i.interest_count, 0)::int as interest_count
FROM public.projects p
LEFT JOIN (
    SELECT project_id, COUNT(*) as interest_count
    FROM public.project_interests
    GROUP BY project_id
) i ON p.id = i.project_id
WHERE p.status = 'open_for_bids';

-- Grant SELECT permissions to authenticated users on the View
GRANT SELECT ON public.public_project_feed TO authenticated;
