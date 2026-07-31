import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/types/admin';

interface BlogRow {
  id: string; slug: string; title: string; excerpt: string;
  content: string; cover_image_url: string; category: string;
  tags: string[]; reading_time_minutes: number;
  meta_title: string; meta_description: string; og_image_url: string;
  is_featured: boolean; status: string; published_at: string | null;
  created_at: string; updated_at: string;
}

function fromRow(row: BlogRow): BlogPost {
  return {
    id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt,
    content: row.content, coverImageUrl: row.cover_image_url,
    category: row.category, tags: row.tags || [],
    readingTimeMinutes: row.reading_time_minutes,
    metaTitle: row.meta_title, metaDescription: row.meta_description,
    ogImageUrl: row.og_image_url, isFeatured: row.is_featured,
    status: row.status as BlogPost['status'],
    publishedAt: row.published_at || undefined,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

function toRow(data: Partial<BlogPost>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.slug !== undefined) row.slug = data.slug;
  if (data.title !== undefined) row.title = data.title;
  if (data.excerpt !== undefined) row.excerpt = data.excerpt;
  if (data.content !== undefined) row.content = data.content;
  if (data.coverImageUrl !== undefined) row.cover_image_url = data.coverImageUrl;
  if (data.category !== undefined) row.category = data.category;
  if (data.tags !== undefined) row.tags = data.tags;
  if (data.readingTimeMinutes !== undefined) row.reading_time_minutes = data.readingTimeMinutes;
  if (data.metaTitle !== undefined) row.meta_title = data.metaTitle;
  if (data.metaDescription !== undefined) row.meta_description = data.metaDescription;
  if (data.ogImageUrl !== undefined) row.og_image_url = data.ogImageUrl;
  if (data.isFeatured !== undefined) row.is_featured = data.isFeatured;
  if (data.status !== undefined) {
    row.status = data.status;
    if (data.status === 'published') row.published_at = new Date().toISOString();
  }
  row.updated_at = new Date().toISOString();
  return row;
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as BlogRow[]).map(fromRow);
};

export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase.from('blog_posts').select('*').eq('status', 'published').order('published_at', { ascending: false });
  if (error) throw error;
  return (data as BlogRow[]).map(fromRow);
};

export const getBlogPost = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
  if (error) { if (error.code === 'PGRST116') return null; throw error; }
  return data ? fromRow(data as BlogRow) : null;
};

export const createBlogPost = async (post: Partial<BlogPost>): Promise<BlogPost> => {
  const row = toRow(post);
  row.slug = post.slug || post.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
  row.reading_time_minutes = Math.max(1, Math.ceil(((post.content || '').split(/\s+/).length) / 200));
  const { data, error } = await supabase.from('blog_posts').insert([row]).select().single();
  if (error) throw error;
  return fromRow(data as BlogRow);
};

export const updateBlogPost = async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
  const row = toRow(post);
  if (post.content) row.reading_time_minutes = Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200));
  const { data, error } = await supabase.from('blog_posts').update(row).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(data as BlogRow);
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw error;
};
