import { supabase } from '@/lib/supabase';
import { CompanySettings } from '@/types/admin';

interface CompanySettingsRow {
  id: number;
  company_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  business_hours: string;
  social: any;
  seo: any;
  logo_url: string;
  favicon_url: string;
  ga4_measurement_id: string;
  maps_embed_url: string;
  notification_email: string;
}

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: 'NSS Home Designs',
  tagline: 'Designing Dreams, Building Better Homes',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  businessHours: '',
  social: {
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: '',
    twitterTitle: '',
    twitterDescription: '',
  },
  logo: '',
  favicon: '',
  ga4MeasurementId: '',
  mapsEmbedUrl: '',
  notificationEmail: '',
};

function fromRow(row: CompanySettingsRow): CompanySettings {
  return {
    companyName: row.company_name,
    tagline: row.tagline,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    businessHours: row.business_hours,
    social: row.social || DEFAULT_SETTINGS.social,
    seo: row.seo || DEFAULT_SETTINGS.seo,
    logo: row.logo_url || '',
    favicon: row.favicon_url || '',
    ga4MeasurementId: row.ga4_measurement_id || '',
    mapsEmbedUrl: row.maps_embed_url || '',
    notificationEmail: row.notification_email || '',
  };
}

function toRow(data: Partial<CompanySettings>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.companyName !== undefined) row.company_name = data.companyName;
  if (data.tagline !== undefined) row.tagline = data.tagline;
  if (data.phone !== undefined) row.phone = data.phone;
  if (data.whatsapp !== undefined) row.whatsapp = data.whatsapp;
  if (data.email !== undefined) row.email = data.email;
  if (data.address !== undefined) row.address = data.address;
  if (data.businessHours !== undefined) row.business_hours = data.businessHours;
  if (data.social !== undefined) row.social = data.social;
  if (data.seo !== undefined) row.seo = data.seo;
  if (data.logo !== undefined) row.logo_url = data.logo;
  if (data.favicon !== undefined) row.favicon_url = data.favicon;
  if (data.ga4MeasurementId !== undefined) row.ga4_measurement_id = data.ga4MeasurementId;
  if (data.mapsEmbedUrl !== undefined) row.maps_embed_url = data.mapsEmbedUrl;
  if (data.notificationEmail !== undefined) row.notification_email = data.notificationEmail;
  return row;
}

export const getSettings = async (): Promise<CompanySettings> => {
  const { data, error } = await supabase.from('company_settings').select('*').eq('id', 1).single();
  if (error) {
    if (error.code === 'PGRST116') return DEFAULT_SETTINGS;
    throw error;
  }
  return data ? fromRow(data as CompanySettingsRow) : DEFAULT_SETTINGS;
};

export const updateSettings = async (data: Partial<CompanySettings>): Promise<CompanySettings> => {
  const currentSettings = await getSettings();
  const newSettings = { ...currentSettings, ...data };
  
  if (data.social) {
    newSettings.social = { ...currentSettings.social, ...data.social };
  }
  if (data.seo) {
    newSettings.seo = { ...currentSettings.seo, ...data.seo };
  }

  const row = toRow(newSettings);
  row.id = 1;

  const { data: updated, error } = await supabase
    .from('company_settings')
    .upsert(row)
    .select()
    .single();

  if (error) throw error;
  return fromRow(updated as CompanySettingsRow);
};

export const settingsApi = {
  getSettings,
  updateSettings,
};
