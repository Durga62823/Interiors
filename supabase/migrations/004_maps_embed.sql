-- ============================================================
-- NSS Home Designs — Migration 004: Google Maps Embed URL
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE company_settings
  ADD COLUMN IF NOT EXISTS maps_embed_url TEXT NOT NULL DEFAULT '';
