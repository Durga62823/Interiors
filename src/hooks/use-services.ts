import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '@/mock-api/services';
import { Service } from '@/types/admin';
import { toast } from 'sonner';

export function useServices() {
  return useQuery({
    queryKey: ['admin-services'],
    queryFn: () => servicesApi.getServices(),
    throwOnError: false,
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['admin-services', id],
    queryFn: () => servicesApi.getService(id),
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => servicesApi.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service created');
    },
    onError: () => {
      toast.error('Failed to create service');
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) => servicesApi.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service updated');
    },
    onError: () => {
      toast.error('Failed to update service');
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesApi.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      toast.success('Service deleted');
    },
    onError: () => {
      toast.error('Failed to delete service');
    },
  });
}
