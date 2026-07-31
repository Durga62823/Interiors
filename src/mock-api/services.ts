import { supabase } from '@/lib/supabase';
import { Service } from '@/types/admin';

interface ServiceRow {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
  featured: boolean;
  display_order: number;
  created_at: string;
}

function fromRow(row: ServiceRow): Service {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    category: row.category,
    image: row.image_url || '',
    featured: row.featured,
    displayOrder: row.display_order,
    createdAt: row.created_at,
  };
}

function toRow(data: Partial<Service>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.title !== undefined) row.title = data.title;
  if (data.description !== undefined) row.description = data.description;
  if (data.price !== undefined) row.price = data.price;
  if (data.category !== undefined) row.category = data.category;
  if (data.image !== undefined) row.image_url = data.image;
  if (data.featured !== undefined) row.featured = data.featured;
  if (data.displayOrder !== undefined) row.display_order = data.displayOrder;
  return row;
}

export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase.from('services').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return (data as ServiceRow[]).map(fromRow);
};

export const getService = async (id: string): Promise<Service | null> => {
  const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data ? fromRow(data as ServiceRow) : null;
};

export const createService = async (data: Omit<Service, 'id' | 'createdAt'>): Promise<Service> => {
  const { data: created, error } = await supabase.from('services').insert([toRow(data)]).select().single();
  if (error) throw error;
  return fromRow(created as ServiceRow);
};

export const updateService = async (id: string, data: Partial<Service>): Promise<Service> => {
  const { data: updated, error } = await supabase.from('services').update(toRow(data)).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(updated as ServiceRow);
};

export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
};

export const servicesApi = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
};
