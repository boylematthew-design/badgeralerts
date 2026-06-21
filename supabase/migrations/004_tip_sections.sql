-- Tip sections: group tips within a guide
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- A "section" groups related tips, e.g. "Photos & Media", "Reviews"
create table tip_sections (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references guides(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index tip_sections_guide_idx on tip_sections(guide_id);
create index tip_sections_guide_sort_idx on tip_sections(guide_id, sort_order);

-- Link tips to sections (nullable = backward compatible, unsectioned tips still work)
alter table tips add column section_id uuid references tip_sections(id) on delete set null;
create index tips_section_id_idx on tips(section_id);

-- Row Level Security (REQUIRED on every table)
alter table tip_sections enable row level security;

-- Public can read sections if their parent guide is published
create policy "Public can read sections of published guides"
  on tip_sections for select
  using (
    exists (
      select 1 from guides
      where guides.id = tip_sections.guide_id
      and guides.published = true
    )
  );

-- No insert/update/delete policies: only service role can write.
-- The admin uses the service role key (server-side only) to manage sections.
