-- ============================================================
-- SHOP CATEGORIES — hierarchical product categories for the
--   online shop (eCommerce phase). Self-referencing via
--   parent_id for sub-categories (e.g., "אביזרים" → "מגנים").
-- Editable via /dashboard/shop/categories.
-- ============================================================

CREATE TABLE shop_categories (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  parent_id       UUID REFERENCES shop_categories(id) ON DELETE SET NULL,
  description     TEXT,
  image_url       TEXT,
  sort_order      INT  NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  seo_title       TEXT,
  seo_description TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX shop_categories_parent_order_idx ON shop_categories (parent_id, sort_order);
CREATE INDEX shop_categories_active_idx       ON shop_categories (is_active);

ALTER TABLE shop_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON shop_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "admin_all" ON shop_categories
  FOR ALL USING (auth.role() = 'authenticated');
