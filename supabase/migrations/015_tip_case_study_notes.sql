-- Blog: custom context for each case study shown under a tip, e.g. on "Keep a steady stream of fresh
-- reviews": "How we set up a simple routine for Gallows Pole to ask every customer for a review...".
-- Stored as an object keyed by case study id, e.g. {"gallows-pole": "How we ..."}. When a tip has no
-- note for a case study, the guide page falls back to the case study's own one-line summary.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- Security: RLS is already enabled on `tips`, and the new column is covered by the existing
-- policies (public can only read published tips of published guides) — no policy changes needed.
-- The admin form re-checks every note on the server (lib/case-studies.ts): only for case studies
-- chosen on the tip, max 300 characters each. The check constraint makes sure it's always an object.

alter table tips add column if not exists case_study_notes jsonb not null default '{}'::jsonb;

alter table tips drop constraint if exists tips_case_study_notes_is_object;
alter table tips add constraint tips_case_study_notes_is_object check (jsonb_typeof(case_study_notes) = 'object');
