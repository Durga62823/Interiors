import { useState, useMemo, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Download, Eye, Trash2, StickyNote, Loader2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'

import type { Lead, LeadStatus } from '@/types/admin'
import { useLeads, useUpdateLeadStatus, useDeleteLead } from '@/hooks/use-leads'
import { useLeadNotes, useAddLeadNote, useDeleteLeadNote } from '@/hooks/use-lead-notes'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { DataTable } from '@/components/admin/ui/DataTable'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { LoadingSkeleton } from '@/components/admin/ui/LoadingSkeleton'
import { exportLeadsCSV } from '@/mock-api'

export const Route = createFileRoute('/admin/leads')({
  component: LeadsPage,
})

const statusOptions: LeadStatus[] = ['new', 'contacted', 'meeting_scheduled', 'converted', 'rejected']

// ---------------------------------------------------------------------------
// LeadNotesPanel — rendered inside the Lead Details Sheet
// ---------------------------------------------------------------------------
function LeadNotesPanel({ leadId }: { leadId: string }) {
  const { data: notes = [], isLoading } = useLeadNotes(leadId);
  const addNote = useAddLeadNote(leadId);
  const deleteNote = useDeleteLeadNote(leadId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAdd = async () => {
    const text = textareaRef.current?.value.trim();
    if (!text) return;
    await addNote.mutateAsync({ note: text });
    if (textareaRef.current) textareaRef.current.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter submits
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
        <StickyNote className="h-3.5 w-3.5" />
        Notes
      </h4>

      {/* Composer */}
      <div className="space-y-2">
        <textarea
          ref={textareaRef}
          rows={3}
          onKeyDown={handleKeyDown}
          placeholder="Add a note… (Ctrl+Enter to save)"
          className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <Button
          size="sm"
          disabled={addNote.isPending}
          onClick={handleAdd}
          className="bg-ink text-white hover:bg-ink/80"
        >
          {addNote.isPending ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> Saving…</>
          ) : 'Add Note'}
        </Button>
      </div>

      {/* Timeline */}
      {isLoading && (
        <p className="text-xs text-gray-400">Loading notes…</p>
      )}
      {!isLoading && notes.length === 0 && (
        <p className="text-xs text-gray-400 italic">No notes yet. Add one above.</p>
      )}
      {notes.length > 0 && (
        <ol className="space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="relative border-l-2 border-gold/30 pl-4">
              <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-gold" />
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{n.note}</p>
                <button
                  onClick={() => deleteNote.mutate(n.id)}
                  className="shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                  aria-label="Delete note"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1 text-[10px] text-gray-400">
                {n.author} · {new Date(n.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function LeadsPage() {
  const { data: leads = [], isLoading } = useLeads()
  const updateStatus = useUpdateLeadStatus()
  const deleteLead = useDeleteLead()

  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredLeads = useMemo(() => {
    if (statusFilter === 'all') return leads
    return leads.filter((l: Lead) => l.status === statusFilter)
  }, [leads, statusFilter])

  const handleExportCSV = async () => {
    try {
      const csvData = await exportLeadsCSV()
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed', err)
    }
  }

  const columns: ColumnDef<Lead>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
          className="rounded border-gray-300"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium text-ink">{row.original.name}</span>
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'service',
      header: 'Service',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => {
        const source = row.original.source || 'direct';
        const colours: Record<string, string> = {
          google:    'bg-blue-50 text-blue-700 border-blue-200',
          instagram: 'bg-pink-50 text-pink-700 border-pink-200',
          facebook:  'bg-indigo-50 text-indigo-700 border-indigo-200',
          whatsapp:  'bg-green-50 text-green-700 border-green-200',
          bing:      'bg-teal-50 text-teal-700 border-teal-200',
          youtube:   'bg-red-50 text-red-700 border-red-200',
          direct:    'bg-gray-50 text-gray-600 border-gray-200',
          other:     'bg-amber-50 text-amber-700 border-amber-200',
        };
        return (
          <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium border capitalize ${colours[source] || colours.other}`}>
            {source}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={row.original.status} />
          <select 
            className="text-xs border-gray-200 rounded p-1 bg-transparent hover:bg-gray-50 focus:ring-gold"
            value={row.original.status}
            onChange={(e) => updateStatus.mutate({ id: row.original.id, status: e.target.value as LeadStatus })}
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      )
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedLead(row.original)} className="h-8 w-8 p-0">
            <Eye className="h-4 w-4 text-gray-500 hover:text-ink" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeletingId(row.original.id)} className="h-8 w-8 p-0">
            <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8">
      <PageHeader 
        title="Leads" 
        description="Manage consultation requests and inquiries"
        action={
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2"/>
            Export CSV
          </Button>
        }
      />

      <div className="flex overflow-x-auto pb-2 space-x-2">
        <Button 
          variant={statusFilter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setStatusFilter('all')}
          className={statusFilter === 'all' ? "bg-ink text-white" : ""}
        >
          All
        </Button>
        {statusOptions.map(status => (
          <Button 
            key={status}
            variant={statusFilter === status ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="capitalize"
          >
            {status.replace('_', ' ')}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <DataTable columns={columns} data={filteredLeads} />
        </div>
      )}

      {/* Lead Details Sheet */}
      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-serif text-2xl text-ink">Lead Details</SheetTitle>
            <SheetDescription>
              Received on {selectedLead && new Date(selectedLead.createdAt).toLocaleString()}
            </SheetDescription>
          </SheetHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-cream/50 rounded-lg border border-gray-100">
                <span className="font-medium">Current Status</span>
                <select 
                  className="text-sm border-gray-200 rounded p-1.5 bg-white shadow-sm focus:ring-gold"
                  value={selectedLead.status}
                  onChange={(e) => updateStatus.mutate({ id: selectedLead.id, status: e.target.value as LeadStatus })}
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Name</h4>
                  <p className="font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Email</h4>
                  <a href={`mailto:${selectedLead.email}`} className="text-gold hover:underline">{selectedLead.email}</a>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone</h4>
                  <a href={`tel:${selectedLead.phone}`} className="text-gold hover:underline">{selectedLead.phone}</a>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Location</h4>
                  <p>{selectedLead.location || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Service Interest</h4>
                  <p>{selectedLead.service || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Budget</h4>
                  <p>{selectedLead.budget || 'Not specified'}</p>
                </div>
              </div>

              {selectedLead.message && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Message</h4>
                  <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100 whitespace-pre-wrap">
                    {selectedLead.message}
                  </div>
                </div>
              )}

              {/* Traffic Source — only shown when UTM data exists */}
              {(selectedLead.utm_source || selectedLead.utm_campaign) && (
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Traffic Source</h4>
                  <dl className="space-y-2">
                    {[
                      { label: 'Channel',  value: selectedLead.source },
                      { label: 'Source',   value: selectedLead.utm_source },
                      { label: 'Medium',   value: selectedLead.utm_medium },
                      { label: 'Campaign', value: selectedLead.utm_campaign },
                      { label: 'Term',     value: selectedLead.utm_term },
                      { label: 'Content',  value: selectedLead.utm_content },
                    ]
                      .filter(({ value }) => value)
                      .map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-sm">
                          <dt className="text-gray-500">{label}</dt>
                          <dd className="font-medium text-ink truncate max-w-[55%] text-right">{value}</dd>
                        </div>
                      ))
                    }
                  </dl>
                </div>
              )}

              {/* Lead Notes — always shown */}
              <div className="rounded-lg border border-gray-100 bg-white p-4">
                <LeadNotesPanel leadId={selectedLead.id} />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={async () => {
          if (deletingId) {
            await deleteLead.mutateAsync(deletingId)
            setDeletingId(null)
          }
        }}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone."
      />
    </motion.div>
  )
}
