-- Blog: optional "news" label shown above a tip, e.g.
--   "9 June 2026: Reddit announces verified profiles for businesses" ↗ (links to the source)
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- Security: RLS is already enabled on `tips`, and new columns are covered by the existing
-- policies (public can only read published tips of published guides) — no policy changes needed.
-- The check constraint is a second line of defence behind the server-side validation: only
-- http(s) links can be stored, so a `javascript:` link can never reach the public page.

alter table tips add column if not exists news_date date;
alter table tips add column if not exists news_headline text;
alter table tips add column if not exists news_url text;

alter table tips drop constraint if exists tips_news_url_http;
alter table tips add constraint tips_news_url_http
  check (news_url is null or news_url ~* '^https?://');
