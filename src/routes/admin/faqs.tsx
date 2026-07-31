import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Plus, Trash2, Pencil, HelpCircle, Eye, EyeOff } from 'lucide-react'
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from '@/hooks/use-faqs'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { LoadingSkeleton } from '@/components/admin/ui/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { FAQ } from '@/types/admin'

export const Route = createFileRoute('/admin/faqs')({ component: FaqsPage })

function FaqsPage() {
  const { data: faqs = [], isLoading } = useFaqs()
  const createFaq = useCreateFaq()
  const updateFaq = useUpdateFaq()
  const deleteFaq = useDeleteFaq()
  const [editing, setEditing] = useState<FAQ | null>(null)

  const handleCreate = async () => {
    const faq = await createFaq.mutateAsync({ question: 'New Question', answer: 'Answer here...', displayOrder: faqs.length + 1 })
    setEditing(faq)
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editing) return
    const fd = new FormData(e.currentTarget)
    updateFaq.mutate({
      id: editing.id,
      data: {
        question: fd.get('question') as string,
        answer: fd.get('answer') as string,
        category: fd.get('category') as string,
        displayOrder: Number(fd.get('displayOrder') || 0),
      },
    })
    setEditing(null)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8">
      <PageHeader title="FAQs" description="Manage frequently asked questions displayed on the website">
        <Button onClick={handleCreate} className="gap-2 bg-gold text-ink hover:bg-gold/90">
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </PageHeader>

      {isLoading && <LoadingSkeleton />}

      {!isLoading && faqs.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <HelpCircle className="mx-auto h-10 w-10 opacity-30 mb-4" />
          <p>No FAQs yet. Click "Add FAQ" to create one.</p>
        </div>
      )}

      {!isLoading && faqs.length > 0 && (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-gold/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{faq.category}</span>
                    <span className="text-[10px] text-gray-300">#{faq.displayOrder}</span>
                  </div>
                  <h3 className="font-medium text-ink">{faq.question}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateFaq.mutate({ id: faq.id, data: { published: !faq.published } })}
                    className={`p-1.5 rounded hover:bg-gray-100 ${faq.published ? 'text-green-500' : 'text-gray-300'}`}
                    title={faq.published ? 'Published' : 'Hidden'}
                  >
                    {faq.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => setEditing(faq)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gold">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteFaq.mutate(faq.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Sheet */}
      <Sheet open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null) }}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader><SheetTitle>Edit FAQ</SheetTitle></SheetHeader>
          {editing && (
            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Question</label>
                <input name="question" defaultValue={editing.question} required className="w-full border rounded px-3 py-2 text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Answer</label>
                <textarea name="answer" defaultValue={editing.answer} required rows={5} className="w-full border rounded px-3 py-2 text-sm mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Category</label>
                  <input name="category" defaultValue={editing.category} className="w-full border rounded px-3 py-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Display Order</label>
                  <input name="displayOrder" type="number" defaultValue={editing.displayOrder} className="w-full border rounded px-3 py-2 text-sm mt-1" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gold text-ink hover:bg-gold/90">Save Changes</Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  )
}
