-- Blog: optional "Tools" box under a tip. Each tool has a name, link, pricing note, a free/paid flag,
-- a short explanation of how it helps with the tip, and an optional self-hosted icon, e.g.
--   [{"name": "Google Search Console", "url": "https://search.google.com/search-console",
--     "pricing": "Free", "paid": false, "description": "Shows ...", "icon": "/tool-icons/search.google.com.png"}]
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- Security: RLS is already enabled on `tips`, and the new column is covered by the existing
-- policies (public can only read published tips of published guides) — no policy changes needed.
-- The admin form validates every tool on the server (length limits, http(s) links only, icons only
-- from /tool-icons/) before saving; the check constraint makes sure the column always holds a list.

alter table tips add column if not exists tools jsonb not null default '[]'::jsonb;

alter table tips drop constraint if exists tips_tools_is_array;
alter table tips add constraint tips_tools_is_array check (jsonb_typeof(tools) = 'array');
