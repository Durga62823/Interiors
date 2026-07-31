import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlogPosts, getPublishedPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost } from '@/mock-api/blog';
import type { BlogPost } from '@/types/admin';
import { toast } from 'sonner';

export function useBlogPosts() {
  return useQuery({ queryKey: ['blog'], queryFn: getBlogPosts });
}

export function usePublishedPosts() {
  return useQuery({ queryKey: ['blog', 'published'], queryFn: getPublishedPosts });
}

export function useBlogPost(slug: string) {
  return useQuery({ queryKey: ['blog', slug], queryFn: () => getBlogPost(slug), enabled: !!slug });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<BlogPost>) => createBlogPost(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog'] }); toast.success('Post created'); },
  });
}

export function useUpdateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogPost> }) => updateBlogPost(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog'] }); toast.success('Post updated'); },
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['blog'] }); toast.success('Post deleted'); },
  });
}
