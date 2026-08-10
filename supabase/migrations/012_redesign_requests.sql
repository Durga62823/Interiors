-- ============================================================
-- NSS / Neeli's Design Studio — Migration 012: Redesign Requests
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Create storage bucket for room photos submitted via redesign form
-- (Run this separately in Supabase Dashboard → Storage if CLI not available)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('redesign-photos', 'redesign-photos', true)
-- ON CONFLICT DO NOTHING;

-- Add redesign_photo_url column to leads for photo uploads from redesign wizard
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS redesign_photo_url TEXT DEFAULT '';

-- Add current_style column to leads (for redesign context)
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS current_style TEXT DEFAULT '';

-- Add desired_style column to leads
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS desired_style TEXT DEFAULT '';
