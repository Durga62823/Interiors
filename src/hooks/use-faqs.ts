import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFaqs, getPublishedFaqs, createFaq, updateFaq, deleteFaq } from '@/mock-api/faqs';
import type { FAQ } from '@/types/admin';
import { toast } from 'sonner';

export function useFaqs() {
  return useQuery({ queryKey: ['faqs'], queryFn: getFaqs });
}

export function usePublishedFaqs() {
  return useQuery({ queryKey: ['faqs', 'published'], queryFn: getPublishedFaqs });
}

export function useCreateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<FAQ>) => createFaq(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faqs'] }); toast.success('FAQ created'); },
  });
}

export function useUpdateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FAQ> }) => updateFaq(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faqs'] }); toast.success('FAQ updated'); },
  });
}

export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faqs'] }); toast.success('FAQ deleted'); },
  });
}
