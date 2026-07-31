import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/mock-api/settings';
import { CompanySettings } from '@/types/admin';
import { toast } from 'sonner';

export function useSettings() {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => settingsApi.getSettings(),
    // Settings don't change often but we want them reasonably fresh
    staleTime: 30_000, // 30 seconds
    throwOnError: false,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CompanySettings>) => settingsApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings saved');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to save settings');
    },
  });
}
