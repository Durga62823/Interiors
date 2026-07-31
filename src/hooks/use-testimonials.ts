import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonialsApi } from '@/mock-api/testimonials';
import { Testimonial } from '@/types/admin';
import { toast } from 'sonner';

export function useTestimonials() {
  return useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => testimonialsApi.getTestimonials(),
    throwOnError: false,
  });
}

export function useTestimonial(id: string) {
  return useQuery({
    queryKey: ['admin-testimonials', id],
    queryFn: () => testimonialsApi.getTestimonial(id),
    enabled: !!id,
    throwOnError: false,
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => testimonialsApi.createTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial created');
    },
    onError: () => {
      toast.error('Failed to create testimonial');
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Testimonial> }) => testimonialsApi.updateTestimonial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial updated');
    },
    onError: () => {
      toast.error('Failed to update testimonial');
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testimonialsApi.deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('Testimonial deleted');
    },
    onError: () => {
      toast.error('Failed to delete testimonial');
    },
  });
}
