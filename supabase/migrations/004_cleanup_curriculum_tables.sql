-- Cleanup Migration: Drop static content tables (topics & problems).
-- All curriculum data is now bundled locally with the web application.
-- Supabase now strictly manages user-level data (auth, progress_entries, streak_logs).

-- 1. Remove the foreign key constraint from progress_entries to problems table
alter table if exists public.progress_entries
  drop constraint if exists progress_entries_problem_id_fkey;

-- 2. Drop the problems table and its associated policies/indexes
drop table if exists public.problems cascade;

-- 3. Drop the topics table and its associated policies/indexes
drop table if exists public.topics cascade;

-- 4. Drop the difficulty enum (no longer needed in DB)
drop type if exists public.difficulty cascade;
