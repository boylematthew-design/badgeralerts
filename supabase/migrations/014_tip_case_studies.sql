-- Blog: optional "Case study" box under a tip, linking to a client case study on a services page
-- (e.g. /services/local-seo#case-study-gallows-pole). Stores the case study ids in display order,
-- e.g. {"gallows-pole"}. The case studies themselves live in code (lib/case-studies.ts), so the
-- admin dropdown only offers ones that exist there.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- Security: RLS is already enabled on `tips`, and the new column is covered by the existing
-- policies (public can only read published tips of published guides) — no policy changes needed.
-- The admin form re-checks every id on the server against lib/case-studies.ts; the check
-- constraint is a second guard on the list size.

alter table tips add column if not exists case_studies text[] not null default '{}';

alter table tips drop constraint if exists tips_case_studies_size;
alter table tips add constraint tips_case_studies_size check (cardinality(case_studies) <= 10);
