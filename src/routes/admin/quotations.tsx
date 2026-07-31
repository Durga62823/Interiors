import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Plus, Trash2, FileText, IndianRupee } from 'lucide-react'
import { useQuotations, useCreateQuotation, useUpdateQuotation, useDeleteQuotation, useQuotation, useAddLineItem, useDeleteLineItem } from '@/hooks/use-quotations'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { LoadingSkeleton } from '@/components/admin/ui/LoadingSkeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import type { QuotationStatus, QuotationLineItem } from '@/types/admin'

export const Route = createFileRoute('/admin/quotations')({ component: QuotationsPage })

const statusOptions: QuotationStatus[] = ['draft', 'sent', 'approved', 'rejected', 'expired']

function QuotationsPage() {
  const { data: quotations = [], isLoading } = useQuotations()
  const createQ = useCreateQuotation()
  const updateQ = useUpdateQuotation()
  const deleteQ = useDeleteQuotation()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data: selected } = useQuotation(selectedId || '')
  const addItem = useAddLineItem()
  const removeItem = useDeleteLineItem()

  const handleCreate = async () => {
    const q = await createQ.mutateAsync({ clientName: 'New Client', status: 'draft' })
    setSelectedId(q.id)
  }

  const handleAddItem = () => {
    if (!selectedId) return
    addItem.mutate({ quotationId: selectedId, item: { description: 'New item', quantity: 1, unitPrice: 0, category: '' } })
  }

  const recalculate = (items: QuotationLineItem[] | undefined) => {
    if (!selectedId || !items) return
    const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
    const disc = selected?.discountPercent || 0
    const tax = selected?.taxPercent ?? 18
    const afterDiscount = subtotal * (1 - disc / 100)
    const total = afterDiscount * (1 + tax / 100)
    updateQ.mutate({ id: selectedId, data: { subtotal, total } })
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8">
      <PageHeader title="Quotations" description="Create and manage client quotations">
        <Button onClick={handleCreate} className="gap-2 bg-gold text-ink hover:bg-gold/90">
          <Plus className="h-4 w-4" /> New Quotation
        </Button>
      </PageHeader>

      {isLoading && <LoadingSkeleton />}

      {!isLoading && quotations.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <FileText className="mx-auto h-10 w-10 opacity-30 mb-4" />
          <p className="font-medium">No quotations yet.</p>
          <p className="text-sm mt-1">Click "New Quotation" to create your first one.</p>
        </div>
      )}

      {!isLoading && quotations.length > 0 && (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Number</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Client</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Project</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Total</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="px-4 py-3" />
            </tr></thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedId(q.id)}>
                  <td className="px-4 py-3 font-mono text-xs text-gold">{q.quotationNumber}</td>
                  <td className="px-4 py-3 font-medium">{q.clientName}</td>
                  <td className="px-4 py-3 text-gray-500">{q.projectType || '—'}</td>
                  <td className="px-4 py-3 text-right font-medium">{fmt(q.total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(q.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <button onClick={(e) => { e.stopPropagation(); deleteQ.mutate(q.id) }} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Sheet */}
      <Sheet open={!!selectedId} onOpenChange={(open) => { if (!open) setSelectedId(null) }}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader><SheetTitle>Quotation {selected?.quotationNumber}</SheetTitle></SheetHeader>
          {selected && (
            <div className="mt-6 space-y-6">
              {/* Client info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Client Name</label>
                  <input defaultValue={selected.clientName} className="w-full border rounded px-3 py-2 text-sm mt-1" onBlur={(e) => updateQ.mutate({ id: selected.id, data: { clientName: e.target.value } })} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Phone</label>
                  <input defaultValue={selected.clientPhone} className="w-full border rounded px-3 py-2 text-sm mt-1" onBlur={(e) => updateQ.mutate({ id: selected.id, data: { clientPhone: e.target.value } })} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Email</label>
                  <input defaultValue={selected.clientEmail} className="w-full border rounded px-3 py-2 text-sm mt-1" onBlur={(e) => updateQ.mutate({ id: selected.id, data: { clientEmail: e.target.value } })} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Project Type</label>
                  <input defaultValue={selected.projectType} placeholder="e.g. 2BHK Full Home" className="w-full border rounded px-3 py-2 text-sm mt-1" onBlur={(e) => updateQ.mutate({ id: selected.id, data: { projectType: e.target.value } })} />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Status</label>
                <select value={selected.status} onChange={(e) => updateQ.mutate({ id: selected.id, data: { status: e.target.value as QuotationStatus } })} className="border rounded px-3 py-1.5 text-sm">
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Line items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Line Items</h4>
                  <Button size="sm" variant="outline" onClick={handleAddItem} className="gap-1 text-xs"><Plus className="h-3 w-3" /> Add Item</Button>
                </div>
                <div className="space-y-2">
                  {(selected.lineItems || []).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 rounded border p-3 bg-gray-50">
                      <input defaultValue={item.description} placeholder="Description" className="flex-1 bg-transparent text-sm outline-none" onBlur={() => recalculate(selected.lineItems)} />
                      <input defaultValue={item.quantity} type="number" className="w-14 text-center border rounded px-1 py-1 text-sm" />
                      <span className="text-gray-400 text-xs">×</span>
                      <input defaultValue={item.unitPrice} type="number" className="w-20 text-right border rounded px-2 py-1 text-sm" />
                      <span className="text-sm font-medium w-20 text-right">{fmt(item.quantity * item.unitPrice)}</span>
                      <button onClick={() => removeItem.mutate({ id: item.id, quotationId: selected.id })} className="text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="rounded-lg bg-ink text-cream p-5 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-cream/60">Subtotal</span><span>{fmt(selected.subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-cream/60">Discount ({selected.discountPercent}%)</span><span>-{fmt(selected.subtotal * selected.discountPercent / 100)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-cream/60">GST ({selected.taxPercent}%)</span><span>+{fmt(selected.subtotal * (1 - selected.discountPercent / 100) * selected.taxPercent / 100)}</span></div>
                <div className="flex justify-between text-lg font-display pt-2 border-t border-cream/20"><span className="text-gold">Total</span><span className="text-gold">{fmt(selected.total)}</span></div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Notes</label>
                <textarea defaultValue={selected.notes} rows={3} className="w-full border rounded px-3 py-2 text-sm mt-1" onBlur={(e) => updateQ.mutate({ id: selected.id, data: { notes: e.target.value } })} />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  )
}
