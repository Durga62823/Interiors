-- ============================================================
-- NSS Home Designs — Migration 002: Lead UTM Tracking
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS source       TEXT NOT NULL DEFAULT 'direct',
  ADD COLUMN IF NOT EXISTS utm_source   TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS utm_medium   TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS utm_term     TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS utm_content  TEXT NOT NULL DEFAULT '';

-- Index: quickly filter leads by marketing channel in admin
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads (source);

-- Index: quickly filter/group by campaign in reports
CREATE INDEX IF NOT EXISTS idx_leads_utm_campaign ON leads (utm_campaign)
  WHERE utm_campaign <> '';
