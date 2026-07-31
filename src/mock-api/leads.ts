import { supabase } from '@/lib/supabase';
import { Lead, LeadStatus } from '@/types/admin';
import { trackGenerateLead } from '@/lib/analytics';

interface LeadRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  budget: string;
  location: string;
  status: string;
  message: string;
  created_at: string;
  // UTM columns (added in migration 002)
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  // Consultation scheduling (added in migration 006)
  preferred_date: string | null;
  preferred_time: string | null;
}

function fromRow(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    service: row.service,
    budget: row.budget,
    location: row.location,
    status: row.status as LeadStatus,
    message: row.message,
    createdAt: row.created_at,
    source: row.source || 'direct',
    utm_source: row.utm_source || '',
    utm_medium: row.utm_medium || '',
    utm_campaign: row.utm_campaign || '',
    utm_term: row.utm_term || '',
    utm_content: row.utm_content || '',
    preferredDate: row.preferred_date || undefined,
    preferredTime: row.preferred_time || undefined,
  };
}

function toRow(data: Partial<Lead>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.name !== undefined) row.name = data.name;
  if (data.phone !== undefined) row.phone = data.phone;
  if (data.email !== undefined) row.email = data.email;
  if (data.service !== undefined) row.service = data.service;
  if (data.budget !== undefined) row.budget = data.budget;
  if (data.location !== undefined) row.location = data.location;
  if (data.status !== undefined) row.status = data.status;
  if (data.message !== undefined) row.message = data.message;
  // UTM fields — only included when present (won't overwrite on plain status updates)
  if (data.source !== undefined) row.source = data.source;
  if (data.utm_source !== undefined) row.utm_source = data.utm_source;
  if (data.utm_medium !== undefined) row.utm_medium = data.utm_medium;
  if (data.utm_campaign !== undefined) row.utm_campaign = data.utm_campaign;
  if (data.utm_term !== undefined) row.utm_term = data.utm_term;
  if (data.utm_content !== undefined) row.utm_content = data.utm_content;
  // Scheduling fields
  if (data.preferredDate !== undefined) row.preferred_date = data.preferredDate || null;
  if (data.preferredTime !== undefined) row.preferred_time = data.preferredTime || null;
  return row;
}

export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as LeadRow[]).map(fromRow);
};

export const getLead = async (id: string): Promise<Lead | null> => {
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data ? fromRow(data as LeadRow) : null;
};

export const createLead = async (data: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> => {
  const { data: created, error } = await supabase.from('leads').insert([toRow(data)]).select().single();
  if (error) throw error;
  const lead = fromRow(created as LeadRow);

  // Fire GA4 conversion event — no-op when GA4 is not configured
  trackGenerateLead({ service: lead.service, source: lead.source });

  // Trigger email notification edge function directly
  // This replaces the Database Webhook requirement
  const { data: fnData, error: fnError } = await supabase.functions.invoke(
    'lead-notification',
    {
      body: lead,
    }
  );

  console.log("Function Data:", fnData);
  console.log("Function Error:", fnError);

  if (fnError) {
    console.error("Edge Function Error:", fnError);
  }

  return lead;
};

export const updateLead = async (id: string, data: Partial<Lead>): Promise<Lead> => {
  const { data: updated, error } = await supabase.from('leads').update(toRow(data)).eq('id', id).select().single();
  if (error) throw error;
  return fromRow(updated as LeadRow);
};

export const deleteLead = async (id: string): Promise<void> => {
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw error;
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<Lead> => {
  return updateLead(id, { status });
};

export const exportLeadsCSV = async (): Promise<string> => {
  const leads = await getLeads();
  if (leads.length === 0) return '';

  const headers = Object.keys(leads[0]).join(',');
  const rows = leads.map(lead => {
    return Object.values(lead)
      .map(value => `"${String(value).replace(/"/g, '""')}"`)
      .join(',');
  });

  return [headers, ...rows].join('\n');
};

export const leadsApi = {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
  exportLeadsCSV,
};
