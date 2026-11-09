-- Blog: optional "Help" box under a tip, inviting readers to ask for help with it. Turned on per tip
-- in the admin. help_text is an optional short phrase that finishes "Need help with …?", e.g.
-- "getting AI agents to find your website". Left blank, the box uses the tip's title instead.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- Security: RLS is already enabled on `tips`, and the new columns are covered by the existing
-- policies (public can only read published tips of published guides) — no policy changes needed.
-- The admin form re-checks the phrase on the server (lib/tip-help.ts); the check constraint is a
-- second guard on its length.

alter table tips add column if not exists help_enabled boolean not null default false;
alter table tips add column if not exists help_text text;

alter table tips drop constraint if exists tips_help_text_length;
alter table tips add constraint tips_help_text_length check (help_text is null or char_length(help_text) <= 120);
