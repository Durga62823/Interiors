-- ============================================================
-- NSS Home Designs — Supabase Schema Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- =========================
-- 1. SERVICES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- 2. PORTFOLIO PROJECTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  location TEXT DEFAULT '',
  completion_date TEXT DEFAULT '',
  description TEXT DEFAULT '',
  client TEXT DEFAULT '',
  area TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  gallery_urls TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- 3. TESTIMONIALS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  designation TEXT DEFAULT '',
  company TEXT DEFAULT '',
  review TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  photo_url TEXT DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- 4. LEADS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'meeting_scheduled', 'converted', 'rejected')),
  message TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================
-- 5. COMPANY SETTINGS TABLE (single-row)
-- =========================
CREATE TABLE IF NOT EXISTS company_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name TEXT NOT NULL DEFAULT 'NSS Home Designs',
  tagline TEXT NOT NULL DEFAULT 'Designing Dreams, Building Better Homes',
  phone TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  business_hours TEXT NOT NULL DEFAULT '',
  social JSONB NOT NULL DEFAULT '{"instagram":"","facebook":"","linkedin":"","youtube":""}',
  seo JSONB NOT NULL DEFAULT '{"metaTitle":"","metaDescription":"","ogTitle":"","ogDescription":"","ogImage":"","twitterCard":"","twitterTitle":"","twitterDescription":""}',
  logo_url TEXT NOT NULL DEFAULT '',
  favicon_url TEXT NOT NULL DEFAULT ''
);

-- Insert the default settings row (idempotent)
INSERT INTO company_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- ----- SERVICES -----
-- Public can read all services
CREATE POLICY "Public can read services"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can do everything
CREATE POLICY "Authenticated users full access to services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ----- PORTFOLIO PROJECTS -----
-- Public can only read published projects
CREATE POLICY "Public can read published portfolio projects"
  ON portfolio_projects FOR SELECT
  TO anon
  USING (status = 'published');

-- Authenticated users can read ALL projects (including draft/archived)
CREATE POLICY "Authenticated users can read all portfolio projects"
  ON portfolio_projects FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert portfolio projects"
  ON portfolio_projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update portfolio projects"
  ON portfolio_projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete portfolio projects"
  ON portfolio_projects FOR DELETE
  TO authenticated
  USING (true);

-- ----- TESTIMONIALS -----
-- Public can read all testimonials (frontend filters featured in query)
CREATE POLICY "Public can read testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can do everything
CREATE POLICY "Authenticated users full access to testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ----- LEADS -----
-- Public can INSERT leads (contact form, no auth needed)
CREATE POLICY "Public can create leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users can do everything
CREATE POLICY "Authenticated users full access to leads"
  ON leads FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ----- COMPANY SETTINGS -----
-- Public can read settings (footer, WhatsApp, etc.)
CREATE POLICY "Public can read company settings"
  ON company_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can update settings
CREATE POLICY "Authenticated users can update company settings"
  ON company_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services (display_order);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio_projects (status);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_projects (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);


-- ============================================================
-- SUPABASE STORAGE — Create 'images' bucket
-- ============================================================
-- NOTE: Run this separately in Supabase Dashboard → Storage → New Bucket
-- Bucket name: images
-- Public bucket: YES (toggle on)
--
-- Or via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: anyone can read, authenticated can upload/delete
CREATE POLICY "Public can read images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');
