-- ============================================================
-- Neeli Home Designs — Migration 003: GA4 Measurement ID
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE company_settings
  ADD COLUMN IF NOT EXISTS ga4_measurement_id TEXT NOT NULL DEFAULT '';
