-- ============================================================
-- Neeli Home Designs — Migration 009: Quotation Builder
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  quotation_number TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT DEFAULT '',
  client_email TEXT DEFAULT '',
  project_type TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',  -- draft, sent, approved, rejected, expired
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount_percent NUMERIC DEFAULT 0,
  tax_percent NUMERIC DEFAULT 18,
  total NUMERIC NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotation_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category TEXT DEFAULT '',  -- Kitchen, Bedroom, Living Room, etc.
  unit TEXT DEFAULT 'lot',   -- lot, sqft, unit
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quotations_lead ON quotations(lead_id);
CREATE INDEX IF NOT EXISTS idx_quotation_items_qid ON quotation_line_items(quotation_id);

-- RLS
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_line_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users manage quotations" ON quotations FOR ALL USING (true);
CREATE POLICY "Auth users manage line items" ON quotation_line_items FOR ALL USING (true);
