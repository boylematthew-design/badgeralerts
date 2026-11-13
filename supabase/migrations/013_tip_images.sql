-- Blog: several images per tip, shown as a swipeable carousel on the guide page. Each image has its
-- own alt text and optional caption, in display order, e.g.
--   [{"url": "https://<project>.supabase.co/storage/v1/object/public/blog-images/123-abc.png",
--     "alt": "Screenshot of ...", "caption": "Optional caption"}]
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- Security: RLS is already enabled on `tips`, and the new column is covered by the existing
-- policies (public can only read published tips of published guides) — no policy changes needed.
-- The admin form re-checks every image on the server (lib/tip-image.ts): only images from our own
-- "blog-images" bucket, length limits on alt/caption, max 10 per tip. The check constraint makes
-- sure the column always holds a list.

alter table tips add column if not exists images jsonb not null default '[]'::jsonb;

alter table tips drop constraint if exists tips_images_is_array;
alter table tips add constraint tips_images_is_array check (jsonb_typeof(images) = 'array');

-- Copy each existing single image into the new list, so nothing disappears from live guides.
update tips
set images = jsonb_build_array(
  jsonb_build_object('url', image_url, 'alt', coalesce(image_alt, ''), 'caption', coalesce(image_caption, ''))
)
where image_url is not null and images = '[]'::jsonb;

-- The old image_url / image_alt / image_caption columns are left in place (no longer written to) so
-- this is safe to roll back. They can be dropped later once the carousel has been live a while.
