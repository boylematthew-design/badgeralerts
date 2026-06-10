-- Blog: guides + tips
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- A "guide" is a topic, e.g. "Google Maps Marketing Guide"
create table guides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  topic_name text not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A "tip" belongs to a guide. Many tips make up one guide.
create table tips (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references guides(id) on delete cascade,
  title text not null,
  content text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index tips_guide_id_idx on tips(guide_id);
create index tips_guide_sort_idx on tips(guide_id, sort_order);
create index guides_slug_idx on guides(slug);

-- Row Level Security (REQUIRED on every table)
alter table guides enable row level security;
alter table tips enable row level security;

-- Anyone (including logged-out visitors) can read PUBLISHED guides
create policy "Public can read published guides"
  on guides for select
  using (published = true);

-- Anyone can read PUBLISHED tips, but only if their parent guide is also published
create policy "Public can read published tips"
  on tips for select
  using (
    published = true
    and exists (
      select 1 from guides
      where guides.id = tips.guide_id
      and guides.published = true
    )
  );

-- No insert/update/delete policies are defined for guides or tips.
-- This means only the service role key (used in /admin server actions,
-- never exposed to the browser) can create, edit, or delete content.
-- Regular users and the public cannot write to these tables at all.
