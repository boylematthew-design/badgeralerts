-- Blog: record when each guide was first published (shown as "Published" on the guide and used as
-- the schema's datePublished). created_at is when the draft was made, which can be days earlier.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- Security: a new column on `guides`, covered by the existing RLS policies (the public can only
-- read published guides), so no policy changes. The admin form checks any date typed in on the
-- server: it must be a real date and not in the future.

alter table guides add column if not exists published_at timestamptz;

-- Existing guides: the publish moment was never recorded, so use the best estimate: the later of
-- when the guide was created and when its first tip was added (a guide wouldn't go live empty).
-- Correct any you know exactly with the "Published date" field in /admin.
update guides g
set published_at = greatest(g.created_at, coalesce((select min(t.created_at) from tips t where t.guide_id = g.id), g.created_at))
where g.published and g.published_at is null;

-- From now on it's exact: set the first time a guide is published. Unpublishing and republishing
-- keeps the original date.
create or replace function guides_set_published_at() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.published and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end $$;

drop trigger if exists guides_set_published_at on guides;
create trigger guides_set_published_at before insert or update on guides
  for each row execute function guides_set_published_at();

-- Correcting the published date is not a content change, so it shouldn't move "Last updated"
-- (replaces the function from migration 016, now ignoring published_at as well).
create or replace function guides_set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin
  if (to_jsonb(new) - 'updated_at' - 'published_at') is distinct from (to_jsonb(old) - 'updated_at' - 'published_at') then
    new.updated_at := now();
  end if;
  return new;
end $$;
