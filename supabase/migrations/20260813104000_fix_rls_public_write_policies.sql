-- Fix: the original INSERT/UPDATE policies on github_journeys and repo_analyses
-- were named "Service role can..." but had no `TO service_role` clause, so
-- Postgres applied them to PUBLIC (i.e. the anon and authenticated roles too).
-- The anon key ships in the client bundle, so anyone could PATCH/POST these
-- tables directly via PostgREST and rewrite any user's public persona page,
-- bypassing the edge functions entirely.
--
-- service_role already bypasses RLS by default, so these policies were never
-- needed for the edge functions to work — dropping them removes the public
-- write hole with no loss of legitimate functionality.

DROP POLICY IF EXISTS "Service role can insert journeys" ON public.github_journeys;
DROP POLICY IF EXISTS "Service role can update journeys" ON public.github_journeys;
DROP POLICY IF EXISTS "Service role can insert repo analyses" ON public.repo_analyses;
DROP POLICY IF EXISTS "Service role can update repo analyses" ON public.repo_analyses;

-- Public SELECT policies are intentionally left in place — persona pages are
-- meant to be publicly readable/shareable.
