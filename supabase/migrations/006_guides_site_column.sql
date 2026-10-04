-- Guides: add a `site` column for multi-site support
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- This Supabase project is now a shared "master" database for multiple
-- sites (badgeralerts.live, localmapsmarketing.online, and more to come).
-- Every guide needs to say which site it belongs to.
--
-- Existing guides default to 'badgeralerts', so badgeralerts.live's
-- behaviour is unchanged by this migration on its own — nothing filters
-- by `site` yet (that's a later step, done carefully so it's verified
-- before badgeralerts.live's queries start relying on it).
alter table guides add column site text not null default 'badgeralerts';

-- Slugs used to be unique across the whole table. Now that different sites
-- can have their own guide with the same slug (e.g. both badgeralerts and
-- localmapsmarketing having a "google-maps-marketing-guide"), uniqueness
-- only needs to hold *within* a site.
alter table guides drop constraint guides_slug_key;
alter table guides add constraint guides_site_slug_key unique (site, slug);

create index guides_site_slug_idx on guides(site, slug);

-- Note: RLS is NOT changed here. The existing "published = true" read
-- policy already applies regardless of site — site-based filtering happens
-- in each site's own queries (added in a later step), not at the RLS
-- level. That means RLS alone doesn't stop one site's frontend code from
-- accidentally reading another site's guides if it forgets to filter by
-- site — it would show the wrong (but still public) content, not leak any
-- private data. Worth knowing, not a blocker.
