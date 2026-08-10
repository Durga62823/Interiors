-- ============================================================
-- Neeli Home Designs — Migration 005: Lead Notes
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS lead_notes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  note        TEXT NOT NULL,
  author      TEXT NOT NULL DEFAULT 'Admin',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast per-lead lookups (used in every Sheet open)
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);

-- RLS: only authenticated users (admins) can read/write notes
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lead notes"
  ON lead_notes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
