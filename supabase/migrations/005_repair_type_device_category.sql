-- Adds a device-category tag to repair_types ('iphone' | 'ipad' | 'samsung').
-- Used only by the admin dashboard to organise the list and filter which
-- models a repair type may be linked to. Public pages and SEO are unchanged.
-- Existing rows get NULL and must be manually categorised in the dashboard.
ALTER TABLE repair_types
  ADD COLUMN IF NOT EXISTS device_category TEXT;
