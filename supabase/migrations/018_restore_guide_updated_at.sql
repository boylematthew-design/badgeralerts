-- Blog: undo a false "Last updated" bump.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- When migration 017 first ran, its backfill of published_at happened before guides_set_updated_at
-- was taught to ignore published_at, so every published guide's updated_at jumped to the time it
-- ran (28 Nov 2026, 09:00). This puts back the dates each guide really had just before, as read
-- from the database earlier that day. Only the day was recorded, so the time is set to midday.
-- Safe: it only changes updated_at, and the trigger keeps a given updated_at when nothing else changed.
--
-- Security: data-only fix on an existing table; no schema or RLS changes.

update guides g
set updated_at = v.updated_at
from (values
  ('reddit-marketing',                                '2026-11-13T12:00:00Z'::timestamptz),
  ('technical-seo',                                   '2026-11-14T12:00:00Z'),
  ('aio',                                             '2026-11-23T12:00:00Z'),
  ('airbnb-listing-optimisation-guide',               '2026-11-13T12:00:00Z'),
  ('youtube-search-optimisation',                     '2026-11-13T12:00:00Z'),
  ('google-maps-marketing',                           '2026-11-23T12:00:00Z'),
  ('tiktok-search-optimisation',                      '2026-11-13T12:00:00Z'),
  ('local-seo',                                       '2026-11-23T12:00:00Z'),
  ('ecommerce-seo',                                   '2026-11-23T12:00:00Z'),
  ('digital-marketing-for-plumbers',                  '2026-11-20T12:00:00Z'),
  ('digital-marketing-services-seo-for-electricians', '2026-11-20T12:00:00Z'),
  ('restaurant-digital-marketing-services-seo',       '2026-11-23T12:00:00Z'),
  ('jewellery-digital-marketing-services-seo',        '2026-11-19T12:00:00Z')
) as v(slug, updated_at)
where g.slug = v.slug
  and g.site = 'badgeralerts'
  and g.updated_at >= '2026-11-28T08:59:00Z' and g.updated_at < '2026-11-28T09:01:00Z';
