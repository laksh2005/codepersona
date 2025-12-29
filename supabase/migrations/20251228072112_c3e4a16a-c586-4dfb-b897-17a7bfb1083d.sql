-- Create table for caching GitHub user journey data
CREATE TABLE public.github_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  github_username TEXT NOT NULL UNIQUE,
  github_data JSONB NOT NULL DEFAULT '{}',
  ai_persona JSONB,
  ai_story JSONB,
  ai_tech_evolution JSONB,
  ai_skills JSONB,
  ai_achievements JSONB,
  ai_career_projection JSONB,
  last_github_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for repo analysis (on-demand)
CREATE TABLE public.repo_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  github_username TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  ai_summary TEXT,
  maturity_score INTEGER,
  complexity_score INTEGER,
  improvement_suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(github_username, repo_name)
);

-- Enable Row Level Security
ALTER TABLE public.github_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repo_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (shareable pages)
CREATE POLICY "Anyone can view journeys" 
ON public.github_journeys 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view repo analyses" 
ON public.repo_analyses 
FOR SELECT 
USING (true);

-- Allow edge functions to insert/update (using service role)
CREATE POLICY "Service role can insert journeys" 
ON public.github_journeys 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update journeys" 
ON public.github_journeys 
FOR UPDATE 
USING (true);

CREATE POLICY "Service role can insert repo analyses" 
ON public.repo_analyses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update repo analyses" 
ON public.repo_analyses 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_github_journeys_updated_at
BEFORE UPDATE ON public.github_journeys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_repo_analyses_updated_at
BEFORE UPDATE ON public.repo_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_github_journeys_username ON public.github_journeys(github_username);
CREATE INDEX idx_repo_analyses_username ON public.repo_analyses(github_username);