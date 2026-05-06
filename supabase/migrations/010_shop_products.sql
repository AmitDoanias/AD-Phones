-- ============================================================
-- SHOP PRODUCTS — sellable items in the online shop
--   (accessories, parts, refurbished devices, etc.).
-- Linked to a category and optionally to a list of compatible
--   models (e.g., a screen protector that fits iPhone 14 / 14 Pro).
-- Pricing is INCL VAT. cost_price is internal-only and is used
--   for profit calculation in the admin dashboard.
-- Editable via /dashboard/shop/products.
-- ============================================================

CREATE TABLE shop_products (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug                TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  short_description   TEXT,                                            -- 1–2 lines, shown on product card
  description         TEXT,                                            -- long markdown, shown on product page
  category_id         UUID REFERENCES shop_categories(id) ON DELETE SET NULL,
  price               NUMERIC(10,2) NOT NULL CHECK (price >= 0),       -- selling price, INCL VAT
  sale_price          NUMERIC(10,2)             CHECK (sale_price IS NULL OR sale_price >= 0), -- discounted price (if active), INCL VAT
  cost_price          NUMERIC(10,2),                                   -- supplier cost, INCL VAT (internal only — profit calc)
  sku                 TEXT UNIQUE,
  stock_qty           INT  NOT NULL DEFAULT 0  CHECK (stock_qty >= 0),
  low_stock_threshold INT  NOT NULL DEFAULT 5,
  image_url           TEXT,                                            -- primary image (Cloudinary)
  gallery_urls        JSONB NOT NULL DEFAULT '[]'::jsonb,              -- additional image URLs: ["url1","url2",...]
  compatible_with     JSONB NOT NULL DEFAULT '[]'::jsonb,              -- compatible model names: ["iPhone 14","iPhone 14 Pro"]
  attributes          JSONB NOT NULL DEFAULT '{}'::jsonb,              -- key/value attrs: {"color":"שחור","weight":"120g"}
  is_active           BOOLEAN NOT NULL DEFAULT true,
  is_featured         BOOLEAN NOT NULL DEFAULT false,
  sort_order          INT  NOT NULL DEFAULT 0,
  seo_title           TEXT,                                            -- HTML <title>, separate from product name (Google SERP)
  seo_description     TEXT,                                            -- HTML <meta description>, 140–160 chars (Google SERP)
  seo_keywords        TEXT,                                            -- comma-separated
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX shop_products_category_order_idx   ON shop_products (category_id, sort_order);
CREATE INDEX shop_products_active_featured_idx  ON shop_products (is_active, is_featured);
CREATE INDEX shop_products_compatible_with_idx  ON shop_products USING GIN (compatible_with);

ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON shop_products
  FOR SELECT USING (is_active = true);

CREATE POLICY "admin_all" ON shop_products
  FOR ALL USING (auth.role() = 'authenticated');
