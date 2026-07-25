-- 1. Setup Enums
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('client', 'developer', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('submitted', 'in_review', 'open_for_bids', 'assigned', 'in_progress', 'completed', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interest_status') THEN
        CREATE TYPE interest_status AS ENUM ('pending', 'shortlisted', 'rejected', 'accepted');
    END IF;
END $$;

-- 2. Create Profiles Tables
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role NOT NULL DEFAULT 'client',
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.client_profiles (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_name TEXT,
    profession TEXT,
    field_of_work TEXT
);

CREATE TABLE IF NOT EXISTS public.developer_profiles (
    profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    highest_qualification TEXT,
    institution_name TEXT,
    certifications TEXT[],
    years_experience NUMERIC(4,1) DEFAULT 0.0,
    primary_skills TEXT[],
    tech_stack TEXT[],
    service_capabilities TEXT[],
    verification_status TEXT DEFAULT 'pending',
    is_public BOOLEAN DEFAULT false
);

-- 3. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_dev_skills_gin ON public.developer_profiles USING GIN (primary_skills);
CREATE INDEX IF NOT EXISTS idx_dev_public ON public.developer_profiles(is_public) WHERE is_public = true;

-- 5. Trigger for new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role public.user_role;
  v_full_name TEXT;
  v_avatar_url TEXT;
BEGIN
  -- Extract values or set defaults
  v_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'client'::public.user_role);
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'user_name', 'Anonymous User');
  v_avatar_url := COALESCE(NEW.raw_user_meta_data->>'avatar_url', '');

  -- Insert profile
  INSERT INTO public.profiles (id, role, full_name, avatar_url, created_at)
  VALUES (NEW.id, v_role, v_full_name, v_avatar_url, NOW())
  ON CONFLICT (id) DO NOTHING;

  -- Create subprofiles
  IF v_role = 'client' THEN
    INSERT INTO public.client_profiles (profile_id, organization_name, profession, field_of_work)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'organization_name',
      NEW.raw_user_meta_data->>'profession',
      NEW.raw_user_meta_data->>'field_of_work'
    )
    ON CONFLICT (profile_id) DO NOTHING;
  ELSIF v_role = 'developer' THEN
    INSERT INTO public.developer_profiles (
      profile_id, 
      bio, 
      github_url, 
      linkedin_url, 
      portfolio_url, 
      highest_qualification, 
      institution_name, 
      certifications, 
      years_experience, 
      primary_skills, 
      tech_stack, 
      service_capabilities, 
      verification_status, 
      is_public
    )
    VALUES (
      NEW.id,
      '',
      COALESCE(NEW.raw_user_meta_data->>'github_url', ''),
      COALESCE(NEW.raw_user_meta_data->>'linkedin_url', ''),
      '',
      '',
      '',
      '{}'::TEXT[],
      0.0,
      '{}'::TEXT[],
      '{}'::TEXT[],
      '{}'::TEXT[],
      'pending',
      FALSE
    )
    ON CONFLICT (profile_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Row Level Security Policies
-- Profiles:
CREATE POLICY select_own_profile ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY update_own_profile ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Client Profiles:
CREATE POLICY select_own_client_profile ON public.client_profiles
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY update_own_client_profile ON public.client_profiles
    FOR UPDATE USING (auth.uid() = profile_id);

-- Developer Profiles:
CREATE POLICY select_own_developer_profile ON public.developer_profiles
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY update_own_developer_profile ON public.developer_profiles
    FOR UPDATE USING (auth.uid() = profile_id);
