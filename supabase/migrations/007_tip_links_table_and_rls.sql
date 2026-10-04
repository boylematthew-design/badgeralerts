-- tip_links: commit the missing migration + lock down RLS
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- This table already exists live (created by hand in the dashboard at some
-- point, never committed as a migration). Confirmed via a direct anon-key
-- read on 2026-10-04 that it currently has NO Row Level Security — every
-- row is readable by anyone with the public anon key, and possibly
-- writable too, regardless of whether its tip/guide is published. This
-- migration is safe to run against the live DB: `create table if not
-- exists` is a no-op since the table's already there, and the RLS/policy
-- statements are what actually fix the gap.

create table if not exists tip_links (
  id uuid primary key default gen_random_uuid(),
  tip_id uuid not null references tips(id) on delete cascade,
  url text not null,
  context text,
  preview_title text,
  preview_description text,
  preview_image text,
  preview_favicon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists tip_links_tip_id_idx on tip_links(tip_id);

-- Row Level Security (REQUIRED on every table, no exceptions)
alter table tip_links enable row level security;

-- drop + recreate so this migration is safe to run more than once
drop policy if exists "Public can read links of published tips" on tip_links;
create policy "Public can read links of published tips"
  on tip_links for select
  using (
    exists (
      select 1 from tips
      join guides on guides.id = tips.guide_id
      where tips.id = tip_links.tip_id
      and tips.published = true
      and guides.published = true
    )
  );

-- No insert/update/delete policies: only the service role key (server-side
-- only, used in app/api/tip-links) can write. Regular users and the public
-- cannot write to this table at all — same pattern as guides/tips/tip_sections.
