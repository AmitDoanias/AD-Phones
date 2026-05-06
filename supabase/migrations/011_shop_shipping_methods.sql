-- ============================================================
-- SHOP SHIPPING METHODS — available delivery options at checkout.
--   Supports thresholds for free shipping (free_above_amount)
--   and per-method min/max order limits (e.g., express limited
--   to small orders).
-- Editable via /dashboard/shop/shipping.
-- ============================================================

CREATE TABLE shop_shipping_methods (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name                TEXT NOT NULL,                              -- e.g., "משלוח רגיל"
  description         TEXT,                                       -- e.g., "הגעה תוך 3-5 ימי עסקים"
  price               NUMERIC(10,2) NOT NULL CHECK (price >= 0),  -- base price, INCL VAT
  free_above_amount   NUMERIC(10,2),                              -- free shipping if subtotal >= this (NULL = never free)
  min_order_amount    NUMERIC(10,2),                              -- method only available if order >= this
  max_order_amount    NUMERIC(10,2),                              -- method only available if order <= this
  estimated_days_min  INT,
  estimated_days_max  INT,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  sort_order          INT  NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX shop_shipping_methods_active_order_idx ON shop_shipping_methods (is_active, sort_order);

ALTER TABLE shop_shipping_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON shop_shipping_methods
  FOR SELECT USING (is_active = true);

CREATE POLICY "admin_all" ON shop_shipping_methods
  FOR ALL USING (auth.role() = 'authenticated');

-- ─── Seed: starter shipping methods (Hebrew). Edit via /dashboard/shop/shipping. ───

INSERT INTO shop_shipping_methods
  (name, description, price, free_above_amount, estimated_days_min, estimated_days_max, sort_order) VALUES
('משלוח רגיל',         'הגעה תוך 3-5 ימי עסקים',       35,  200,  3, 5, 10),
('משלוח אקספרס',       'הגעה תוך 1-2 ימי עסקים',       75,  NULL, 1, 2, 20),
('איסוף עצמי בחנות',  'איסוף ללא עלות מהמעבדה בראשון לציון', 0, NULL, 0, 0, 30);
