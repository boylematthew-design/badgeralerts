-- Blog: tip images
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

alter table tips add column image_url text;

-- After running this, also create a Storage bucket called "blog-images":
-- Dashboard → Storage → New bucket → name it "blog-images" → toggle "Public bucket" ON → Create
-- This lets the site display uploaded tip images. Only the admin (service role key)
-- can upload to it; everyone can view the images, same as the existing "post-images" bucket.
