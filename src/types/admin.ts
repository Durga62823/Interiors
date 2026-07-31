export type LeadStatus = 'new' | 'contacted' | 'meeting_scheduled' | 'converted' | 'rejected';
export type PortfolioStatus = 'draft' | 'published' | 'archived';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface PortfolioProject {
  id: string;
  name: string;
  category: string;
  location?: string;
  completionDate?: string;
  description?: string;
  client?: string;
  area?: string;
  budget?: string;
  gallery?: string[];  // Supabase Storage URLs
  thumbnail?: string;  // Supabase Storage URL
  featured: boolean;
  status: PortfolioStatus;
  tags?: string[];
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation?: string;
  company?: string;
  review: string;
  rating: number;  // 1-5
  photo?: string;  // Supabase Storage URL
  featured: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  budget: string;
  location: string;
  status: LeadStatus;
  message: string;
  createdAt: string;
  // UTM / lead-source tracking (optional — absent on older leads)
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  // Consultation scheduling (optional — absent when not booked)
  preferredDate?: string;
  preferredTime?: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  note: string;
  author: string;
  createdAt: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  businessHours: string;
  social: {
    instagram: string;
    facebook: string;
    linkedin: string;
    youtube: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterCard: string;
    twitterTitle: string;
    twitterDescription: string;
  };
  logo: string;
  favicon: string;
  // Analytics
  ga4MeasurementId?: string;
  // Location
  mapsEmbedUrl?: string;
  // Notifications
  notificationEmail?: string;
}

export interface AdminUser {
  email: string;
  name: string;
  avatar: string;
}

export type User = AdminUser;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RoomPricing {
  id: string;
  roomType: string;
  qualityTier: 'essential' | 'premium' | 'luxury';
  priceMin: number;
  priceMax: number;
  displayOrder: number;
}

export type QuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export interface QuotationLineItem {
  id: string;
  quotationId: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  displayOrder: number;
}

export interface Quotation {
  id: string;
  leadId?: string;
  quotationNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectType: string;
  status: QuotationStatus;
  subtotal: number;
  discountPercent: number;
  taxPercent: number;
  total: number;
  notes: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
  lineItems?: QuotationLineItem[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  published: boolean;
  createdAt: string;
}

export type BlogStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  isFeatured: boolean;
  status: BlogStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

