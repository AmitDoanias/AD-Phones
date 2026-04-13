-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE booking_status AS ENUM ('received', 'in_progress', 'done', 'cancelled');
CREATE TYPE service_type   AS ENUM ('lab', 'technician');
CREATE TYPE lead_status    AS ENUM ('new', 'contacted', 'converted', 'closed');

-- ============================================================
-- BRANDS
-- ============================================================
CREATE TABLE brands (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  icon_url    TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- MODELS
-- ============================================================
CREATE TABLE models (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id    UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  image_url   TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(brand_id, slug)
);

-- ============================================================
-- REPAIR TYPES
-- ============================================================
CREATE TABLE repair_types (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- MODEL-REPAIR PRICES (junction)
-- ============================================================
CREATE TABLE model_repairs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id        UUID REFERENCES models(id) ON DELETE CASCADE NOT NULL,
  repair_type_id  UUID REFERENCES repair_types(id) ON DELETE CASCADE NOT NULL,
  price           NUMERIC(10,2) NOT NULL,
  duration_min    INT DEFAULT 30,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(model_id, repair_type_id)
);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE bookings (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name   TEXT NOT NULL,
  customer_phone  TEXT NOT NULL,
  device_info     TEXT,
  service_type    service_type NOT NULL DEFAULT 'lab',
  technician_fee  NUMERIC(10,2) DEFAULT 0,
  scheduled_at    TIMESTAMPTZ,
  status          booking_status DEFAULT 'received',
  notes           TEXT,
  total_price     NUMERIC(10,2) NOT NULL,
  gcal_event_id   TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- BOOKING ITEMS
-- ============================================================
CREATE TABLE booking_items (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id       UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  model_repair_id  UUID REFERENCES model_repairs(id) NOT NULL,
  price_at_booking NUMERIC(10,2) NOT NULL,
  model_name       TEXT NOT NULL,
  repair_name      TEXT NOT NULL
);

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE blog_posts (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  content         JSONB NOT NULL DEFAULT '{}',
  excerpt         TEXT,
  cover_image_url TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  seo_keywords    TEXT,
  is_published    BOOLEAN DEFAULT false,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- REPAIR PHOTOS
-- ============================================================
CREATE TABLE repair_photos (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_repair_id UUID REFERENCES model_repairs(id) ON DELETE CASCADE,
  image_url       TEXT NOT NULL,
  photo_type      TEXT CHECK (photo_type IN ('before', 'after')) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE leads (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source          TEXT DEFAULT 'facebook',
  fb_lead_id      TEXT,
  customer_name   TEXT,
  customer_phone  TEXT,
  customer_email  TEXT,
  form_data       JSONB,
  status          lead_status DEFAULT 'new',
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- REVIEWS CACHE
-- ============================================================
CREATE TABLE reviews_cache (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source        TEXT DEFAULT 'google',
  author_name   TEXT,
  rating        INT,
  text          TEXT,
  time          TIMESTAMPTZ,
  profile_photo TEXT,
  fetched_at    TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- CALENDAR BLOCKS
-- ============================================================
CREATE TABLE calendar_blocks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  start_time  TIMESTAMPTZ NOT NULL,
  end_time    TIMESTAMPTZ NOT NULL,
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SETTINGS
-- ============================================================
CREATE TABLE settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO settings (key, value) VALUES
  ('technician_fee', '50'),
  ('whatsapp_number', '"972547723281"'),
  ('business_hours', '{"sun":{"open":"09:00","close":"19:00"},"mon":{"open":"09:00","close":"19:00"},"tue":{"open":"09:00","close":"19:00"},"wed":{"open":"09:00","close":"19:00"},"thu":{"open":"09:00","close":"19:00"},"fri":{"open":"09:00","close":"14:00"},"sat":null}');

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_models_brand        ON models(brand_id);
CREATE INDEX idx_model_repairs_model ON model_repairs(model_id);
CREATE INDEX idx_model_repairs_type  ON model_repairs(repair_type_id);
CREATE INDEX idx_bookings_status     ON bookings(status);
CREATE INDEX idx_bookings_created    ON bookings(created_at DESC);
CREATE INDEX idx_blog_published      ON blog_posts(is_published, published_at DESC);
CREATE INDEX idx_leads_status        ON leads(status);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE brands         ENABLE ROW LEVEL SECURITY;
ALTER TABLE models         ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_types   ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_repairs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_photos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews_cache  ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings       ENABLE ROW LEVEL SECURITY;

-- Public read: catalog + published blog + reviews
CREATE POLICY "public_read" ON brands         FOR SELECT USING (true);
CREATE POLICY "public_read" ON models         FOR SELECT USING (is_active = true);
CREATE POLICY "public_read" ON repair_types   FOR SELECT USING (true);
CREATE POLICY "public_read" ON model_repairs  FOR SELECT USING (is_active = true);
CREATE POLICY "public_read" ON repair_photos  FOR SELECT USING (true);
CREATE POLICY "public_read" ON reviews_cache  FOR SELECT USING (true);
CREATE POLICY "public_read" ON blog_posts     FOR SELECT USING (is_published = true);

-- Bookings: public insert + public select by id (UUID = unguessable)
CREATE POLICY "public_insert" ON bookings     FOR INSERT WITH CHECK (true);
CREATE POLICY "public_select" ON bookings     FOR SELECT USING (true);
CREATE POLICY "public_insert" ON booking_items FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated)
CREATE POLICY "admin_all" ON brands         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON models         FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON repair_types   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON model_repairs  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON bookings       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON booking_items  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON blog_posts     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON repair_photos  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON leads          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON reviews_cache  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON calendar_blocks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all" ON settings       FOR ALL USING (auth.role() = 'authenticated');
