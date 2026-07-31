import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

import type { CompanySettings } from '@/types/admin'
import { useSettings, useUpdateSettings } from '@/hooks/use-settings'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { ImageUploader } from '@/components/admin/ui/ImageUploader'
import { LoadingSkeleton } from '@/components/admin/ui/LoadingSkeleton'

const settingsSchema = z.object({
  companyName: z.string().min(1, 'Company Name is required'),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  businessHours: z.string().optional(),
  // Social — flat for form
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  // SEO — flat for form
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterCard: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  // Branding
  logo: z.string().optional(),
  favicon: z.string().optional(),
  // Analytics
  ga4MeasurementId: z.string().optional(),
  // Location
  mapsEmbedUrl: z.string().optional(),
  // Notifications
  notificationEmail: z.string().email().optional().or(z.literal('')),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

/** Flatten CompanySettings nested objects → flat form values */
function settingsToForm(s: CompanySettings): SettingsFormValues {
  return {
    companyName: s.companyName || '',
    tagline: s.tagline || '',
    phone: s.phone || '',
    whatsapp: s.whatsapp || '',
    email: s.email || '',
    address: s.address || '',
    businessHours: s.businessHours || '',
    instagram: s.social?.instagram || '',
    facebook: s.social?.facebook || '',
    linkedin: s.social?.linkedin || '',
    youtube: s.social?.youtube || '',
    metaTitle: s.seo?.metaTitle || '',
    metaDescription: s.seo?.metaDescription || '',
    ogTitle: s.seo?.ogTitle || '',
    ogDescription: s.seo?.ogDescription || '',
    ogImage: s.seo?.ogImage || '',
    twitterCard: s.seo?.twitterCard || 'summary_large_image',
    twitterTitle: s.seo?.twitterTitle || '',
    twitterDescription: s.seo?.twitterDescription || '',
    logo: s.logo || '',
    favicon: s.favicon || '',
    ga4MeasurementId: s.ga4MeasurementId || '',
    mapsEmbedUrl: s.mapsEmbedUrl || '',
    notificationEmail: s.notificationEmail || '',
  }
}

/** Re-nest flat form values → CompanySettings shape for API */
function formToSettings(data: SettingsFormValues): Partial<CompanySettings> {
  return {
    companyName: data.companyName,
    tagline: data.tagline || '',
    phone: data.phone || '',
    whatsapp: data.whatsapp || '',
    email: data.email || '',
    address: data.address || '',
    businessHours: data.businessHours || '',
    social: {
      instagram: data.instagram || '',
      facebook: data.facebook || '',
      linkedin: data.linkedin || '',
      youtube: data.youtube || '',
    },
    seo: {
      metaTitle: data.metaTitle || '',
      metaDescription: data.metaDescription || '',
      ogTitle: data.ogTitle || '',
      ogDescription: data.ogDescription || '',
      ogImage: data.ogImage || '',
      twitterCard: data.twitterCard || 'summary_large_image',
      twitterTitle: data.twitterTitle || '',
      twitterDescription: data.twitterDescription || '',
    },
    logo: data.logo || '',
    favicon: data.favicon || '',
    ga4MeasurementId: data.ga4MeasurementId || '',
    mapsEmbedUrl: data.mapsEmbedUrl || '',
    notificationEmail: data.notificationEmail || '',
  }
}

export const Route = createFileRoute('/admin/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { data: settings, isLoading } = useSettings()
  const updateSettings = useUpdateSettings()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: '',
      tagline: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      businessHours: '',
      instagram: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      metaTitle: '',
      metaDescription: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: 'summary_large_image',
      twitterTitle: '',
      twitterDescription: '',
      logo: '',
      favicon: '',
      ga4MeasurementId: '',
      mapsEmbedUrl: '',
      notificationEmail: '',
    }
  })

  useEffect(() => {
    if (settings) {
      form.reset(settingsToForm(settings))
    }
  }, [settings, form])

  const onSubmit = async (data: SettingsFormValues) => {
    await updateSettings.mutateAsync(formToSettings(data))
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <PageHeader title="Settings" description="Manage company information" />
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8 max-w-5xl mx-auto">
      <PageHeader 
        title="Settings" 
        description="Manage company information, social links, and branding"
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        
        {/* Company Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-serif text-ink mb-6 border-b pb-2">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Company Name *</label>
              <input {...form.register('companyName')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              {form.formState.errors.companyName && <span className="text-red-500 text-xs">{form.formState.errors.companyName.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Tagline</label>
              <input {...form.register('tagline')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Email</label>
              <input {...form.register('email')} type="email" className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              {form.formState.errors.email && <span className="text-red-500 text-xs">{form.formState.errors.email.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Phone Number</label>
              <input {...form.register('phone')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">WhatsApp Number</label>
              <input {...form.register('whatsapp')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Business Hours</label>
              <input {...form.register('businessHours')} placeholder="e.g. Mon-Sat: 10:00 AM - 7:00 PM" className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-ink">Address</label>
              <textarea {...form.register('address')} rows={3} className="w-full flex rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-ink">Google Maps Embed URL</label>
              <input
                {...form.register('mapsEmbedUrl')}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <p className="text-xs text-gray-500">
                Google Maps → search your studio → Share → Embed a map → copy the <code className="bg-gray-100 px-1 rounded">src</code> URL from the iframe code.
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-ink">Notification Email</label>
              <input
                {...form.register('notificationEmail')}
                type="email"
                placeholder="alerts@yourbusiness.com"
                className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {form.formState.errors.notificationEmail && <span className="text-red-500 text-xs">{form.formState.errors.notificationEmail.message}</span>}
              <p className="text-xs text-gray-500">
                Email address where new lead notifications are sent. Leave blank to disable email notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-serif text-ink mb-6 border-b pb-2">Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-medium text-ink">Logo</label>
              <ImageUploader value={form.watch('logo')} onChange={(val) => form.setValue('logo', val)} folder="branding" />
              <p className="text-xs text-gray-500">Recommended size: 250x100px (PNG or SVG)</p>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-ink">Favicon</label>
              <ImageUploader value={form.watch('favicon')} onChange={(val) => form.setValue('favicon', val)} folder="branding" />
              <p className="text-xs text-gray-500">Recommended size: 32x32px or 64x64px</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-serif text-ink mb-6 border-b pb-2">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Instagram URL</label>
              <input {...form.register('instagram')} type="url" placeholder="https://instagram.com/..." className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Facebook URL</label>
              <input {...form.register('facebook')} type="url" placeholder="https://facebook.com/..." className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">LinkedIn URL</label>
              <input {...form.register('linkedin')} type="url" placeholder="https://linkedin.com/..." className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">YouTube URL</label>
              <input {...form.register('youtube')} type="url" placeholder="https://youtube.com/..." className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-serif text-ink mb-6 border-b pb-2">SEO Configuration</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Meta Title</label>
                <input {...form.register('metaTitle')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">OG Title</label>
                <input {...form.register('ogTitle')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Meta Description</label>
              <textarea {...form.register('metaDescription')} rows={2} className="w-full flex rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">OG Description</label>
              <textarea {...form.register('ogDescription')} rows={2} className="w-full flex rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">OG Image URL</label>
              <input {...form.register('ogImage')} type="url" placeholder="https://..." className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-serif text-ink mb-1 border-b pb-2">Analytics</h2>
          <p className="text-xs text-gray-500 mb-6">Connect Google Analytics 4 to track visitors, page views, and lead conversions.</p>
          <div className="max-w-md space-y-2">
            <label className="text-sm font-medium text-ink">GA4 Measurement ID</label>
            <input
              {...form.register('ga4MeasurementId')}
              placeholder="G-XXXXXXXXXX"
              className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
            />
            <p className="text-xs text-gray-500">
              Find this in{' '}
              <a
                href="https://analytics.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline hover:text-gold/80"
              >
                Google Analytics
              </a>
              {' '}→ Admin → Data Streams → your stream → Measurement ID.
              Leave blank to disable tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              if (settings) form.reset(settingsToForm(settings))
            }}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            className="bg-gold hover:bg-gold/90 text-white"
            disabled={updateSettings.isPending}
          >
            {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
