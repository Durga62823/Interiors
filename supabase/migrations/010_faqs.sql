-- ============================================================
-- Neeli Home Designs — Migration 010: FAQ Section
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  display_order INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed with common interior design FAQs
INSERT INTO faqs (question, answer, category, display_order) VALUES
  ('How long does a typical interior design project take?',
   'A standard 2BHK project takes 45–60 days from design finalization to handover. Larger projects (3BHK/villas) typically take 75–90 days. We provide a detailed timeline after the initial consultation.',
   'Timeline', 1),
  ('What is the minimum budget for interior design?',
   'Our Essential package starts at ₹3.5 Lakhs for a 1BHK apartment. For a 2BHK, budgets typically start at ₹5–6 Lakhs depending on the scope and material choices.',
   'Pricing', 2),
  ('Do you provide 3D renders before starting work?',
   'Yes! Our Premium and Luxury packages include photo-realistic 3D renders of every room. You''ll see exactly how your space will look before we begin any work.',
   'Process', 3),
  ('What materials and brands do you use?',
   'We use ISI-certified plywood, branded laminates (Merino, Greenlam), and premium hardware (Hettich, Hafele, Blum). All materials come with manufacturer warranties.',
   'Materials', 4),
  ('Do you handle civil work and electrical modifications?',
   'Yes, we provide end-to-end solutions including civil work, electrical, plumbing, painting, and false ceilings. Our project manager coordinates everything so you have a single point of contact.',
   'Scope', 5),
  ('What warranty do you provide?',
   'We provide a 5-year warranty on all modular furniture and a 1-year warranty on installation work. Hardware comes with the manufacturer''s warranty (typically 10+ years for Hettich/Hafele).',
   'Warranty', 6),
  ('Can I see your completed projects?',
   'Absolutely! Browse our portfolio on the website, or visit our studio to see material samples and completed project photos. We can also arrange visits to recently completed homes with client permission.',
   'General', 7),
  ('Do you work on weekends?',
   'Our studio is open Monday to Saturday, 10 AM to 7 PM. Site work continues 6 days a week. We''re happy to schedule consultations on Sundays by prior appointment.',
   'General', 8)
ON CONFLICT DO NOTHING;

-- RLS: public read, auth write
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Auth users manage faqs" ON faqs FOR ALL USING (true);
