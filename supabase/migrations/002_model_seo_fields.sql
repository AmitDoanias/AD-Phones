-- Add SEO and image metadata fields to models table
ALTER TABLE models
  ADD COLUMN IF NOT EXISTS alt_text TEXT,
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT;

COMMENT ON COLUMN models.alt_text IS 'Alt text for the model image — used for accessibility and SEO';
COMMENT ON COLUMN models.seo_title IS 'Override page title for SEO (falls back to model name + brand if empty)';
COMMENT ON COLUMN models.seo_description IS 'Meta description for the model repair page — 150-160 chars recommended';
