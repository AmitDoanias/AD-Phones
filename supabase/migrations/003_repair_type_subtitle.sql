-- Adds an editable "hero subtitle" to repair_types (shown under the H1 on
-- /repairs/[brand]/[model]/[repair] pages). Falls back to a default string
-- in the UI when NULL.
ALTER TABLE repair_types
  ADD COLUMN IF NOT EXISTS subtitle TEXT;
