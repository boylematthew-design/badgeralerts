-- Blog: tip image alt text + caption
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

alter table tips add column image_alt text;
alter table tips add column image_caption text;
