import { supabase } from '@/lib/supabase';
import { RoomPricing } from '@/types/admin';

interface RoomPricingRow {
  id: string;
  room_type: string;
  quality_tier: string;
  price_min: number;
  price_max: number;
  display_order: number;
}

function fromRow(row: RoomPricingRow): RoomPricing {
  return {
    id: row.id,
    roomType: row.room_type,
    qualityTier: row.quality_tier as RoomPricing['qualityTier'],
    priceMin: Number(row.price_min),
    priceMax: Number(row.price_max),
    displayOrder: row.display_order,
  };
}

export const getRoomPricing = async (): Promise<RoomPricing[]> => {
  const { data, error } = await supabase
    .from('room_pricing')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data as RoomPricingRow[]).map(fromRow);
};

export const estimateApi = {
  getRoomPricing,
};
