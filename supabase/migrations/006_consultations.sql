-- ============================================================
-- Neeli Home Designs — Migration 006: Consultation Scheduling
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Add preferred_date and preferred_time to existing leads table.
-- Both are nullable — existing leads are unaffected.
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS preferred_date DATE,
  ADD COLUMN IF NOT EXISTS preferred_time TEXT;

-- Index for the admin consultations view (filters + orders by date)
CREATE INDEX IF NOT EXISTS idx_leads_preferred_date ON leads(preferred_date)
  WHERE preferred_date IS NOT NULL;
