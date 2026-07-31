import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuotations, getQuotation, createQuotation, updateQuotation, deleteQuotation, addLineItem, deleteLineItem } from '@/mock-api/quotations';
import type { Quotation, QuotationLineItem } from '@/types/admin';
import { toast } from 'sonner';

export function useQuotations() {
  return useQuery({ queryKey: ['quotations'], queryFn: getQuotations });
}

export function useQuotation(id: string) {
  return useQuery({ queryKey: ['quotations', id], queryFn: () => getQuotation(id), enabled: !!id });
}

export function useCreateQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Quotation>) => createQuotation(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quotations'] }); toast.success('Quotation created'); },
  });
}

export function useUpdateQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Quotation> }) => updateQuotation(id, data),
    onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: ['quotations'] }); qc.invalidateQueries({ queryKey: ['quotations', v.id] }); toast.success('Quotation updated'); },
  });
}

export function useDeleteQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteQuotation,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['quotations'] }); toast.success('Quotation deleted'); },
  });
}

export function useAddLineItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ quotationId, item }: { quotationId: string; item: Partial<QuotationLineItem> }) => addLineItem(quotationId, item),
    onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: ['quotations', v.quotationId] }); },
  });
}

export function useDeleteLineItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quotationId }: { id: string; quotationId: string }) => deleteLineItem(id),
    onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: ['quotations', v.quotationId] }); },
  });
}
