import { useQuery } from '@tanstack/react-query';
import { getRoomPricing } from '@/mock-api/estimate';

export function useRoomPricing() {
  return useQuery({
    queryKey: ['room-pricing'],
    queryFn: getRoomPricing,
    staleTime: 1000 * 60 * 30, // pricing rarely changes — cache for 30 min
  });
}
