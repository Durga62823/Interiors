import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Calendar, Phone, Clock, ChevronRight } from 'lucide-react'
import { useLeads, useUpdateLeadStatus } from '@/hooks/use-leads'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { LoadingSkeleton } from '@/components/admin/ui/LoadingSkeleton'
import type { Lead, LeadStatus } from '@/types/admin'

export const Route = createFileRoute('/admin/consultations')({
  component: ConsultationsPage,
})

const statusOptions: LeadStatus[] = ['new', 'contacted', 'meeting_scheduled', 'converted', 'rejected']

/**
 * Format a DATE string (YYYY-MM-DD) into a human-readable label.
 * Groups: "Today", "Tomorrow", then full date.
 */
function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function ConsultationsPage() {
  const { data: leads = [], isLoading } = useLeads()
  const updateStatus = useUpdateLeadStatus()
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming')

  // Only leads that have a preferred_date set
  const scheduledLeads = useMemo(() => {
    return leads.filter((l: Lead) => !!l.preferredDate)
  }, [leads])

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const filteredLeads = useMemo(() => {
    return scheduledLeads.filter((l: Lead) => {
      const d = new Date(l.preferredDate! + 'T00:00:00');
      if (filter === 'upcoming') return d >= today;
      if (filter === 'past') return d < today;
      return true;
    }).sort((a: Lead, b: Lead) => {
      const da = new Date(a.preferredDate! + 'T00:00:00');
      const db = new Date(b.preferredDate! + 'T00:00:00');
      return filter === 'past'
        ? db.getTime() - da.getTime()   // past: newest first
        : da.getTime() - db.getTime();  // upcoming: soonest first
    });
  }, [scheduledLeads, filter, today])

  // Group by date for the calendar-list layout
  const grouped = useMemo(() => {
    const map = new Map<string, Lead[]>();
    for (const lead of filteredLeads) {
      const key = lead.preferredDate!;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(lead);
    }
    return Array.from(map.entries()); // [dateStr, Lead[]][]
  }, [filteredLeads])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8">
      <PageHeader
        title="Consultations"
        description="Leads that requested a specific date and time"
      />

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['upcoming', 'past', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-3 px-1 text-sm font-medium capitalize border-b-2 transition-colors ${
              filter === f
                ? 'border-gold text-gold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto pb-3 text-xs text-gray-400 self-end">
          {filteredLeads.length} consultation{filteredLeads.length !== 1 ? 's' : ''}
        </span>
      </div>

      {isLoading && <LoadingSkeleton />}

      {!isLoading && scheduledLeads.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <Calendar className="mx-auto h-10 w-10 opacity-30 mb-4" />
          <p className="font-medium">No scheduled consultations yet.</p>
          <p className="text-sm mt-1">When clients pick a preferred date in the contact form, they'll appear here.</p>
        </div>
      )}

      {!isLoading && scheduledLeads.length > 0 && filteredLeads.length === 0 && (
        <div className="py-12 text-center text-gray-400">
          <p>No {filter} consultations.</p>
        </div>
      )}

      {/* Calendar-grouped list */}
      <div className="space-y-8">
        {grouped.map(([dateStr, dayLeads]) => (
          <div key={dateStr}>
            {/* Date header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 rounded-sm bg-ink px-4 py-2 text-cream">
                <Calendar className="h-4 w-4 text-gold shrink-0" />
                <span className="text-sm font-medium">{formatDateLabel(dateStr)}</span>
              </div>
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">{dayLeads.length} appt{dayLeads.length > 1 ? 's' : ''}</span>
            </div>

            {/* Appointment cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dayLeads.map((lead) => (
                <div key={lead.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-gold/50 transition-colors">
                  {/* Time + Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-ink">
                      <Clock className="h-3.5 w-3.5 text-gold shrink-0" />
                      {lead.preferredTime || 'Time TBD'}
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>

                  {/* Name + Service */}
                  <p className="font-semibold text-ink leading-tight">{lead.name}</p>
                  {lead.service && (
                    <p className="mt-0.5 text-xs text-gray-500 uppercase tracking-wide">{lead.service}</p>
                  )}

                  {/* Phone */}
                  <a
                    href={`tel:${lead.phone}`}
                    className="mt-3 flex items-center gap-1.5 text-sm text-gold hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {lead.phone}
                  </a>

                  {/* Quick status change */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <select
                      className="text-xs border-gray-200 rounded p-1 bg-transparent hover:bg-gray-50 focus:ring-gold w-full"
                      value={lead.status}
                      onChange={(e) =>
                        updateStatus.mutate({ id: lead.id, status: e.target.value as LeadStatus })
                      }
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="h-4 w-4 text-gray-300 ml-2 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
