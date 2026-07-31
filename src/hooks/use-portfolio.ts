import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '@/mock-api/portfolio';
import { PortfolioProject } from '@/types/admin';
import { toast } from 'sonner';

export function usePortfolio() {
  return useQuery({
    queryKey: ['admin-portfolio'],
    queryFn: () => portfolioApi.getProjects(),
    throwOnError: false,
  });
}

export function usePortfolioProject(id: string) {
  return useQuery({
    queryKey: ['admin-portfolio', id],
    queryFn: () => portfolioApi.getProject(id),
    enabled: !!id,
    throwOnError: false,
  });
}

export function useCreatePortfolioProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>) => portfolioApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      toast.success('Project created');
    },
    onError: () => {
      toast.error('Failed to create project');
    },
  });
}

export function useUpdatePortfolioProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PortfolioProject> }) => portfolioApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      toast.success('Project updated');
    },
    onError: () => {
      toast.error('Failed to update project');
    },
  });
}

export function useDeletePortfolioProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => portfolioApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] });
      toast.success('Project deleted');
    },
    onError: () => {
      toast.error('Failed to delete project');
    },
  });
}

export const useCreatePortfolio = useCreatePortfolioProject;
export const useUpdatePortfolio = useUpdatePortfolioProject;
export const useDeletePortfolio = useDeletePortfolioProject;
