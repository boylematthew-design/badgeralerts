-- Tip sections: add optional description/subheading
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

alter table tip_sections add column description text;
