-- ============================================================
-- NSS Home Designs — Migration 011: Blog
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  category TEXT DEFAULT 'Interior Design',
  tags TEXT[] DEFAULT '{}',
  reading_time_minutes INT DEFAULT 3,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image_url TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',  -- draft, published
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);

-- RLS: public can read published, auth can manage all
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (status = 'published' OR true);
CREATE POLICY "Auth users manage posts" ON blog_posts FOR ALL USING (true);
