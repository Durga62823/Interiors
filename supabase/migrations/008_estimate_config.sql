-- ============================================================
-- NSS Home Designs — Migration 008: Cost Estimator Config
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Room-level pricing per quality tier
CREATE TABLE IF NOT EXISTS room_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type TEXT NOT NULL,
  quality_tier TEXT NOT NULL,
  price_min NUMERIC NOT NULL,
  price_max NUMERIC NOT NULL,
  display_order INT DEFAULT 0,
  UNIQUE(room_type, quality_tier)
);

-- Seed with realistic Bengaluru interior design pricing
INSERT INTO room_pricing (room_type, quality_tier, price_min, price_max, display_order) VALUES
  ('Kitchen',        'essential', 180000, 250000, 1),
  ('Kitchen',        'premium',   280000, 400000, 1),
  ('Kitchen',        'luxury',    450000, 700000, 1),
  ('Living Room',    'essential', 100000, 180000, 2),
  ('Living Room',    'premium',   200000, 320000, 2),
  ('Living Room',    'luxury',    350000, 550000, 2),
  ('Master Bedroom', 'essential', 120000, 200000, 3),
  ('Master Bedroom', 'premium',   220000, 350000, 3),
  ('Master Bedroom', 'luxury',    380000, 600000, 3),
  ('Bedroom',        'essential', 80000,  150000, 4),
  ('Bedroom',        'premium',   160000, 280000, 4),
  ('Bedroom',        'luxury',    300000, 480000, 4),
  ('Bathroom',       'essential', 50000,   90000, 5),
  ('Bathroom',       'premium',   100000, 160000, 5),
  ('Bathroom',       'luxury',    180000, 300000, 5),
  ('Dining Area',    'essential', 60000,  100000, 6),
  ('Dining Area',    'premium',   110000, 180000, 6),
  ('Dining Area',    'luxury',    200000, 350000, 6),
  ('Pooja Room',     'essential', 30000,   60000, 7),
  ('Pooja Room',     'premium',    65000, 120000, 7),
  ('Pooja Room',     'luxury',    130000, 220000, 7),
  ('Balcony',        'essential', 25000,   50000, 8),
  ('Balcony',        'premium',    55000, 100000, 8),
  ('Balcony',        'luxury',    110000, 180000, 8)
ON CONFLICT (room_type, quality_tier) DO NOTHING;

-- RLS: anyone can read pricing (public-facing estimator)
ALTER TABLE room_pricing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read room_pricing" ON room_pricing FOR SELECT USING (true);
