-- Blog: keep guides.updated_at accurate automatically.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- guides.updated_at is the "Updated" date shown on each guide and the lastmod Google sees in the
-- sitemap. These triggers move it forward whenever something a reader can see actually changes:
-- the guide itself, any published tip, any section, or a published tip's links. Saving a form
-- without changing anything leaves the date alone, and so do edits to unpublished (draft) tips,
-- so the date only ever means "the page really changed".
--
-- Security: no new tables, so RLS is unchanged. The functions are plain (not security definer):
-- they run with the rights of whoever made the edit, which is only the admin pages using the
-- service role key. Trigger functions can't be called through the Supabase API.

-- 1. The guide itself: only a real change to its content counts.
create or replace function guides_set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin
  if (to_jsonb(new) - 'updated_at') is distinct from (to_jsonb(old) - 'updated_at') then
    new.updated_at := now();
  end if;
  -- Otherwise keep the updated_at given: the triggers below set it on purpose when a tip,
  -- section or link changes, and an unchanged save simply leaves it as it was.
  return new;
end $$;

drop trigger if exists guides_set_updated_at on guides;
create trigger guides_set_updated_at before update on guides
  for each row execute function guides_set_updated_at();

-- 2. Tips: adding, editing, reordering, moving or deleting a published tip.
create or replace function tips_touch_guide() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' then
    if new is not distinct from old then return null; end if;      -- saved with no change
    if not old.published and not new.published then return null; end if; -- draft stayed a draft
  elsif tg_op = 'INSERT' and not new.published then
    return null;
  elsif tg_op = 'DELETE' and not old.published then
    return null;
  end if;

  if tg_op in ('UPDATE', 'DELETE') then
    update guides set updated_at = now() where id = old.guide_id;
  end if;
  if tg_op = 'INSERT' or (tg_op = 'UPDATE' and new.guide_id is distinct from old.guide_id) then
    update guides set updated_at = now() where id = new.guide_id;
  end if;
  return null;
end $$;

drop trigger if exists tips_touch_guide on tips;
create trigger tips_touch_guide after insert or update or delete on tips
  for each row execute function tips_touch_guide();

-- 3. Sections: adding, renaming, reordering or deleting a section.
create or replace function tip_sections_touch_guide() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' and new is not distinct from old then return null; end if;
  update guides set updated_at = now() where id = coalesce(new.guide_id, old.guide_id);
  if tg_op = 'UPDATE' and new.guide_id is distinct from old.guide_id then
    update guides set updated_at = now() where id = old.guide_id;
  end if;
  return null;
end $$;

drop trigger if exists tip_sections_touch_guide on tip_sections;
create trigger tip_sections_touch_guide after insert or update or delete on tip_sections
  for each row execute function tip_sections_touch_guide();

-- 4. Links under a published tip.
create or replace function tip_links_touch_guide() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' and new is not distinct from old then return null; end if;
  update guides set updated_at = now()
  where id = (select guide_id from tips where id = coalesce(new.tip_id, old.tip_id) and published);
  return null;
end $$;

drop trigger if exists tip_links_touch_guide on tip_links;
create trigger tip_links_touch_guide after insert or update or delete on tip_links
  for each row execute function tip_links_touch_guide();
