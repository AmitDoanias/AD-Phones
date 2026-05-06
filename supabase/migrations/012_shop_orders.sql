-- ============================================================
-- SHOP ORDERS — customer orders placed through the online shop.
--   Each order has a snapshot of shipping method/cost and one
--   or more line items (shop_order_items) which snapshot the
--   product name, SKU, image, and unit price at order time
--   for historical accuracy.
-- Public (guest) checkout: customers create orders without an
--   account. Access to a specific order is via UUID link
--   (/track/order/[uuid]) — security through unguessable URL.
-- Order numbers are human-readable: AD-1001, AD-1002, ...
-- ============================================================

CREATE SEQUENCE shop_order_number_seq START 1001;

CREATE TABLE shop_orders (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number          TEXT UNIQUE NOT NULL,                       -- e.g., "AD-1001" (auto-set by trigger)
  customer_name         TEXT NOT NULL,
  customer_phone        TEXT NOT NULL,
  customer_email        TEXT NOT NULL,
  shipping_address      JSONB NOT NULL,                             -- {street, city, zip, country, notes}
  shipping_method_id    UUID REFERENCES shop_shipping_methods(id) ON DELETE SET NULL,
  shipping_method_name  TEXT NOT NULL,                              -- snapshot at order time
  shipping_cost         NUMERIC(10,2) NOT NULL DEFAULT 0,
  subtotal              NUMERIC(10,2) NOT NULL,                     -- sum of items
  total                 NUMERIC(10,2) NOT NULL,                     -- subtotal + shipping_cost
  payment_method        TEXT NOT NULL CHECK (payment_method IN ('card','apple_pay','google_pay')),
  payment_status        TEXT NOT NULL DEFAULT 'pending'
                          CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_provider      TEXT NOT NULL DEFAULT 'payplus',
  transaction_id        TEXT,                                       -- from payment provider
  status                TEXT NOT NULL DEFAULT 'received'
                          CHECK (status IN ('received','paid','preparing','shipped','delivered','cancelled')),
  tracking_number       TEXT,
  tracking_url          TEXT,
  notes                 TEXT,                                       -- internal admin notes
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX shop_orders_status_created_idx ON shop_orders (status, created_at DESC);
CREATE INDEX shop_orders_email_idx          ON shop_orders (customer_email);

-- Auto-assign human-readable order number on insert if not provided.
CREATE OR REPLACE FUNCTION shop_orders_set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'AD-' || nextval('shop_order_number_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shop_orders_set_order_number_trg
  BEFORE INSERT ON shop_orders
  FOR EACH ROW EXECUTE FUNCTION shop_orders_set_order_number();

ALTER TABLE shop_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all" ON shop_orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "public_create" ON shop_orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_read" ON shop_orders
  FOR SELECT USING (true);

-- ─── Order line items (one per product purchased). ───

CREATE TABLE shop_order_items (
  id                     UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id               UUID NOT NULL REFERENCES shop_orders(id)   ON DELETE CASCADE,
  product_id             UUID NOT NULL REFERENCES shop_products(id) ON DELETE RESTRICT,
  qty                    INT  NOT NULL CHECK (qty > 0),
  unit_price             NUMERIC(10,2) NOT NULL,                    -- price at time of order (snapshot)
  total_price            NUMERIC(10,2) NOT NULL,                    -- qty * unit_price
  product_name_snapshot  TEXT NOT NULL,
  sku_snapshot           TEXT,
  image_url_snapshot     TEXT
);

CREATE INDEX shop_order_items_order_idx ON shop_order_items (order_id);

ALTER TABLE shop_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all" ON shop_order_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "public_create" ON shop_order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_read" ON shop_order_items
  FOR SELECT USING (true);
