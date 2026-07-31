import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/mock-api/leads';
import { Lead } from '@/types/admin';
import { toast } from 'sonner';

export function useLeads() {
  return useQuery({
    queryKey: ['admin-leads'],
    queryFn: () => leadsApi.getLeads(),
    throwOnError: false,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['admin-leads', id],
    queryFn: () => leadsApi.getLead(id),
    enabled: !!id,
    throwOnError: false,
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Lead['status'] }) => leadsApi.updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Lead status updated');
    },
    onError: () => {
      toast.error('Failed to update lead status');
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Lead deleted');
    },
    onError: () => {
      toast.error('Failed to delete lead');
    },
  });
}

export const exportLeadsCSV = () => leadsApi.exportLeadsCSV();
