import { supabase } from '@/lib/supabase';
import { Testimonial } from '@/types/admin';

interface TestimonialRow {
  id: string;
  name: string;
  designation: string;
  company: string;
  review: string;
  rating: number;
  photo_url: string;
  featured: boolean;
  created_at: string;
}

function fromRow(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    designation: row.designation,
    company: row.company,
    review: row.review,
    rating: row.rating,
    photo: row.photo_url || '',
    featured: row.featured,
    createdAt: row.created_at,
  };
}

function toRow(data: Partial<Testimonial>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.name !== undefined) row.name = data.name;
  if (data.designation !== undefined) row.designation = data.designation;
  if (data.company !== undefined) row.company = data.company;
  if (data.review !== undefined) row.review = data.review;
  if (data.rating !== undefined) row.rating = data.rating;
  if (data.photo !== undefined) row.photo_url = data.photo;
  if (data.featured !== undefined) row.featured = data.featured;
  return row;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as TestimonialRow[]).map(fromRow);
};

export const getTestimonial = async (id: string): Promise<Testimonial | null> => {
  const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data ? fromRow(data as TestimonialRow) : null;
};

export const createTestimonial = async (data: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial> => {
  const { data: created, error } = await supabase.from('testimonials').insert([toRow(data)]).select().single();
  if (error) throw error;
  return fromRow(created as TestimonialRow);
};

export const updateTestimonial = async (id: string, data: Partial<Testimonial>): Promise<Testimonial> => {
  const { data: updated, error } = await supabase.from('testimonials').update(toRow(data)).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(updated as TestimonialRow);
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
};

export const testimonialsApi = {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
