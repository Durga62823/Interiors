import { supabase } from '@/lib/supabase';
import type { FAQ } from '@/types/admin';

interface FAQRow {
  id: string; question: string; answer: string;
  category: string; display_order: number; published: boolean;
  created_at: string; updated_at: string;
}

function fromRow(row: FAQRow): FAQ {
  return {
    id: row.id, question: row.question, answer: row.answer,
    category: row.category, displayOrder: row.display_order,
    published: row.published, createdAt: row.created_at,
  };
}

export const getFaqs = async (): Promise<FAQ[]> => {
  const { data, error } = await supabase.from('faqs').select('*').order('display_order');
  if (error) throw error;
  return (data as FAQRow[]).map(fromRow);
};

export const getPublishedFaqs = async (): Promise<FAQ[]> => {
  const { data, error } = await supabase.from('faqs').select('*').eq('published', true).order('display_order');
  if (error) throw error;
  return (data as FAQRow[]).map(fromRow);
};

export const createFaq = async (faq: Partial<FAQ>): Promise<FAQ> => {
  const { data, error } = await supabase.from('faqs').insert([{
    question: faq.question || '', answer: faq.answer || '',
    category: faq.category || 'General', display_order: faq.displayOrder || 0,
    published: faq.published ?? true,
  }]).select().single();
  if (error) throw error;
  return fromRow(data as FAQRow);
};

export const updateFaq = async (id: string, faq: Partial<FAQ>): Promise<FAQ> => {
  const row: Record<string, unknown> = {};
  if (faq.question !== undefined) row.question = faq.question;
  if (faq.answer !== undefined) row.answer = faq.answer;
  if (faq.category !== undefined) row.category = faq.category;
  if (faq.displayOrder !== undefined) row.display_order = faq.displayOrder;
  if (faq.published !== undefined) row.published = faq.published;
  row.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('faqs').update(row).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data as FAQRow);
};

export const deleteFaq = async (id: string): Promise<void> => {
  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) throw error;
};
