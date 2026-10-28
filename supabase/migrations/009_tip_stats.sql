-- Blog: optional "Stats" box under a tip. Each stat has its text and one or more sources,
-- shown as numbered [1] links, e.g.
--   [{"text": "90% of UK adults use WhatsApp.", "sources": [{"label": "Ofcom Online Nation 2025", "url": "https://..."}]}]
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- Security: RLS is already enabled on `tips`, and the new column is covered by the existing
-- policies (public can only read published tips of published guides) — no policy changes needed.
-- The admin form validates every stat on the server (length limits, http(s) links only) before saving;
-- the check constraint makes sure the column always holds a list.

alter table tips add column if not exists stats jsonb not null default '[]'::jsonb;

alter table tips drop constraint if exists tips_stats_is_array;
alter table tips add constraint tips_stats_is_array check (jsonb_typeof(stats) = 'array');
