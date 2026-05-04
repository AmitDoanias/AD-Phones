-- Adds the editable "trust badges" shown in the dark hero of the services
-- listing and per-(model × repair) pages. Stored as a JSONB array of strings;
-- NULL means "use the UI defaults".
ALTER TABLE repair_types
  ADD COLUMN IF NOT EXISTS trust_badges JSONB;
