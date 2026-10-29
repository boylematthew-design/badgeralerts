-- Guides: parent/child categories + automatic redirects for old URLs
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- A guide can sit under one parent guide, e.g. "Google Maps marketing" under "Local SEO".
-- Children live at /blog/{parent-slug}/{child-slug}. Only one level deep: a parent can't
-- itself have a parent (checked in the admin forms). Deleting a parent doesn't delete its
-- children — they just become top-level guides again.
alter table guides add column if not exists parent_id uuid references guides(id) on delete set null;

alter table guides drop constraint if exists guides_not_own_parent;
alter table guides add constraint guides_not_own_parent check (parent_id is null or parent_id <> id);

create index if not exists guides_parent_id_idx on guides(parent_id);

-- Every slug a guide used to have. Visiting an old address (e.g. /blog/google-maps-marketing-guide)
-- permanently redirects to the guide's current address, so old links and Google rankings carry over.
alter table guides add column if not exists previous_slugs text[] not null default '{}';

-- RLS is unchanged: the existing "published = true" read policy covers the new columns too,
-- and only the service role (admin) can write.
