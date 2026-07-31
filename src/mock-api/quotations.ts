import { supabase } from '@/lib/supabase';
import type { Quotation, QuotationLineItem, QuotationStatus } from '@/types/admin';

// ── Row types ───────────────────────────────────────────────────────────────
interface QuotationRow {
  id: string; lead_id: string | null; quotation_number: string;
  client_name: string; client_phone: string; client_email: string;
  project_type: string; status: string; subtotal: number;
  discount_percent: number; tax_percent: number; total: number;
  notes: string; valid_until: string | null;
  created_at: string; updated_at: string;
}

interface LineItemRow {
  id: string; quotation_id: string; description: string;
  category: string; unit: string; quantity: number;
  unit_price: number; total: number; display_order: number;
}

function fromRow(row: QuotationRow): Quotation {
  return {
    id: row.id, leadId: row.lead_id || undefined,
    quotationNumber: row.quotation_number, clientName: row.client_name,
    clientPhone: row.client_phone, clientEmail: row.client_email,
    projectType: row.project_type, status: row.status as QuotationStatus,
    subtotal: Number(row.subtotal), discountPercent: Number(row.discount_percent),
    taxPercent: Number(row.tax_percent), total: Number(row.total),
    notes: row.notes, validUntil: row.valid_until || undefined,
    createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

function itemFromRow(row: LineItemRow): QuotationLineItem {
  return {
    id: row.id, quotationId: row.quotation_id, description: row.description,
    category: row.category, unit: row.unit, quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price), total: Number(row.total),
    displayOrder: row.display_order,
  };
}

// ── CRUD ─────────────────────────────────────────────────────────────────────
export const getQuotations = async (): Promise<Quotation[]> => {
  const { data, error } = await supabase.from('quotations').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as QuotationRow[]).map(fromRow);
};

export const getQuotation = async (id: string): Promise<Quotation | null> => {
  const { data, error } = await supabase.from('quotations').select('*').eq('id', id).single();
  if (error) { if (error.code === 'PGRST116') return null; throw error; }
  const q = fromRow(data as QuotationRow);
  // Fetch line items
  const { data: items } = await supabase.from('quotation_line_items').select('*').eq('quotation_id', id).order('display_order');
  q.lineItems = (items as LineItemRow[] || []).map(itemFromRow);
  return q;
};

export const createQuotation = async (data: Partial<Quotation>): Promise<Quotation> => {
  const row: Record<string, unknown> = {
    quotation_number: data.quotationNumber || `Q-${Date.now().toString(36).toUpperCase()}`,
    client_name: data.clientName || '', client_phone: data.clientPhone || '',
    client_email: data.clientEmail || '', project_type: data.projectType || '',
    status: data.status || 'draft', subtotal: data.subtotal || 0,
    discount_percent: data.discountPercent || 0, tax_percent: data.taxPercent ?? 18,
    total: data.total || 0, notes: data.notes || '',
    valid_until: data.validUntil || null, lead_id: data.leadId || null,
  };
  const { data: created, error } = await supabase.from('quotations').insert([row]).select().single();
  if (error) throw error;
  return fromRow(created as QuotationRow);
};

export const updateQuotation = async (id: string, data: Partial<Quotation>): Promise<Quotation> => {
  const row: Record<string, unknown> = {};
  if (data.clientName !== undefined) row.client_name = data.clientName;
  if (data.clientPhone !== undefined) row.client_phone = data.clientPhone;
  if (data.clientEmail !== undefined) row.client_email = data.clientEmail;
  if (data.projectType !== undefined) row.project_type = data.projectType;
  if (data.status !== undefined) row.status = data.status;
  if (data.subtotal !== undefined) row.subtotal = data.subtotal;
  if (data.discountPercent !== undefined) row.discount_percent = data.discountPercent;
  if (data.taxPercent !== undefined) row.tax_percent = data.taxPercent;
  if (data.total !== undefined) row.total = data.total;
  if (data.notes !== undefined) row.notes = data.notes;
  if (data.validUntil !== undefined) row.valid_until = data.validUntil;
  row.updated_at = new Date().toISOString();
  const { data: updated, error } = await supabase.from('quotations').update(row).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(updated as QuotationRow);
};

export const deleteQuotation = async (id: string): Promise<void> => {
  const { error } = await supabase.from('quotations').delete().eq('id', id);
  if (error) throw error;
};

// ── Line Items ──────────────────────────────────────────────────────────────
export const addLineItem = async (quotationId: string, item: Partial<QuotationLineItem>): Promise<QuotationLineItem> => {
  const row = {
    quotation_id: quotationId, description: item.description || '',
    category: item.category || '', unit: item.unit || 'lot',
    quantity: item.quantity || 1, unit_price: item.unitPrice || 0,
    total: (item.quantity || 1) * (item.unitPrice || 0),
    display_order: item.displayOrder || 0,
  };
  const { data, error } = await supabase.from('quotation_line_items').insert([row]).select().single();
  if (error) throw error;
  return itemFromRow(data as LineItemRow);
};

export const updateLineItem = async (id: string, item: Partial<QuotationLineItem>): Promise<QuotationLineItem> => {
  const row: Record<string, unknown> = {};
  if (item.description !== undefined) row.description = item.description;
  if (item.category !== undefined) row.category = item.category;
  if (item.unit !== undefined) row.unit = item.unit;
  if (item.quantity !== undefined) row.quantity = item.quantity;
  if (item.unitPrice !== undefined) row.unit_price = item.unitPrice;
  if (item.quantity !== undefined || item.unitPrice !== undefined) {
    row.total = (item.quantity || 1) * (item.unitPrice || 0);
  }
  const { data, error } = await supabase.from('quotation_line_items').update(row).eq('id', id).select().single();
  if (error) throw error;
  return itemFromRow(data as LineItemRow);
};

export const deleteLineItem = async (id: string): Promise<void> => {
  const { error } = await supabase.from('quotation_line_items').delete().eq('id', id);
  if (error) throw error;
};
