import { supabase } from '@/lib/supabase';
import { PortfolioProject } from '@/types/admin';

interface PortfolioProjectRow {
  id: string;
  name: string;
  category: string;
  location: string;
  completion_date: string;
  description: string;
  client: string;
  area: string;
  budget: string;
  thumbnail_url: string;
  gallery_urls: string[];
  featured: boolean;
  status: string;
  tags: string[];
  created_at: string;
}

function fromRow(row: PortfolioProjectRow): PortfolioProject {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    location: row.location,
    completionDate: row.completion_date,
    description: row.description,
    client: row.client,
    area: row.area,
    budget: row.budget,
    thumbnail: row.thumbnail_url || '',
    gallery: row.gallery_urls || [],
    featured: row.featured,
    status: row.status as any,
    tags: row.tags || [],
    createdAt: row.created_at,
  };
}

function toRow(data: Partial<PortfolioProject>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.name !== undefined) row.name = data.name;
  if (data.category !== undefined) row.category = data.category;
  if (data.location !== undefined) row.location = data.location;
  if (data.completionDate !== undefined) row.completion_date = data.completionDate;
  if (data.description !== undefined) row.description = data.description;
  if (data.client !== undefined) row.client = data.client;
  if (data.area !== undefined) row.area = data.area;
  if (data.budget !== undefined) row.budget = data.budget;
  if (data.thumbnail !== undefined) row.thumbnail_url = data.thumbnail;
  if (data.gallery !== undefined) row.gallery_urls = data.gallery;
  if (data.featured !== undefined) row.featured = data.featured;
  if (data.status !== undefined) row.status = data.status;
  if (data.tags !== undefined) row.tags = data.tags;
  return row;
}

export const getPortfolioProjects = async (): Promise<PortfolioProject[]> => {
  const { data, error } = await supabase.from('portfolio_projects').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as PortfolioProjectRow[]).map(fromRow);
};

export const getPortfolioProject = async (id: string): Promise<PortfolioProject | null> => {
  const { data, error } = await supabase.from('portfolio_projects').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data ? fromRow(data as PortfolioProjectRow) : null;
};

export const createPortfolioProject = async (data: Omit<PortfolioProject, 'id' | 'createdAt'>): Promise<PortfolioProject> => {
  const { data: created, error } = await supabase.from('portfolio_projects').insert([toRow(data)]).select().single();
  if (error) throw error;
  return fromRow(created as PortfolioProjectRow);
};

export const updatePortfolioProject = async (id: string, data: Partial<PortfolioProject>): Promise<PortfolioProject> => {
  const { data: updated, error } = await supabase.from('portfolio_projects').update(toRow(data)).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(updated as PortfolioProjectRow);
};

export const deletePortfolioProject = async (id: string): Promise<void> => {
  const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
  if (error) throw error;
};

export const portfolioApi = {
  getProjects: getPortfolioProjects,
  getProject: getPortfolioProject,
  createProject: createPortfolioProject,
  updateProject: updatePortfolioProject,
  deleteProject: deletePortfolioProject,
};
