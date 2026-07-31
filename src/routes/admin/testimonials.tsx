import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

import type { Testimonial } from '@/types/admin'
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '@/hooks/use-testimonials'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { DataTable } from '@/components/admin/ui/DataTable'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { ModalForm } from '@/components/admin/ui/ModalForm'
import { ImageUploader } from '@/components/admin/ui/ImageUploader'
import { ActionDropdown } from '@/components/admin/ui/ActionDropdown'
import { StarRating } from '@/components/admin/ui/StarRating'
import { LoadingSkeleton } from '@/components/admin/ui/LoadingSkeleton'

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  designation: z.string().optional(),
  company: z.string().optional(),
  review: z.string().min(1, 'Review is required'),
  rating: z.number().min(1).max(5),
  photo: z.string().optional(),
  featured: z.boolean(),
})

type TestimonialFormValues = z.infer<typeof testimonialSchema>

export const Route = createFileRoute('/admin/testimonials')({
  component: TestimonialsPage,
})

function TestimonialsPage() {
  const { data: testimonials = [], isLoading } = useTestimonials()
  const createTestimonial = useCreateTestimonial()
  const updateTestimonial = useUpdateTestimonial()
  const deleteTestimonial = useDeleteTestimonial()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: '',
      designation: '',
      company: '',
      review: '',
      rating: 5,
      photo: '',
      featured: false,
    }
  })

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      form.reset({
        name: testimonial.name,
        designation: testimonial.designation || '',
        company: testimonial.company || '',
        review: testimonial.review,
        rating: testimonial.rating,
        photo: testimonial.photo || '',
        featured: testimonial.featured,
      })
      setEditingId(testimonial.id)
    } else {
      form.reset({
        name: '',
        designation: '',
        company: '',
        review: '',
        rating: 5,
        photo: '',
        featured: false,
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const onSubmit = async (data: TestimonialFormValues) => {
    const testimonialData = {
      ...data,
      designation: data.designation || '',
      company: data.company || '',
      photo: data.photo || '',
      rating: data.rating ?? 5,
      featured: data.featured ?? false,
    }
    if (editingId) {
      await updateTestimonial.mutateAsync({ id: editingId, data: testimonialData })
    } else {
      await createTestimonial.mutateAsync(testimonialData)
    }
    setIsModalOpen(false)
    form.reset()
  }

  const columns: ColumnDef<Testimonial>[] = [
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
      accessorKey: 'photo',
      header: 'Photo',
      cell: ({ row }) => {
        const photo = row.original.photo
        return photo ? (
          <img src={photo} alt={row.original.name} className="w-10 h-10 rounded-full object-cover border" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-cream border border-gray-200 flex items-center justify-center text-sm font-medium text-ink">
            {row.original.name.charAt(0).toUpperCase()}
          </div>
        )
      }
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span className="font-medium text-ink">{row.original.name}</span>
    },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }) => <span className="text-gray-500">{row.original.company || '-'}</span>
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => <StarRating rating={row.original.rating} readonly size="sm" />
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => row.original.featured ? <Badge className="bg-gold text-white">Yes</Badge> : null
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <ActionDropdown
          onEdit={() => handleOpenModal(row.original)}
          onDelete={() => setDeletingId(row.original.id)}
        />
      )
    }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8">
      <PageHeader 
        title="Testimonials" 
        description="Manage client reviews and ratings"
        action={
          <Button onClick={() => handleOpenModal()} className="bg-gold hover:bg-gold/90 text-white">
            <Plus className="w-4 h-4 mr-2"/>
            Add Testimonial
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <DataTable columns={columns} data={testimonials} />
        </div>
      )}

      <ModalForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Testimonial' : 'Add Testimonial'}
        onSubmit={form.handleSubmit(onSubmit)}
        isLoading={createTestimonial.isPending || updateTestimonial.isPending}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Client Name</label>
              <input {...form.register('name')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              {form.formState.errors.name && <span className="text-red-500 text-xs">{form.formState.errors.name.message}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Designation</label>
              <input {...form.register('designation')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Company</label>
              <input {...form.register('company')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Rating</label>
              <div className="pt-2">
                <StarRating rating={form.watch('rating')} onChange={(val) => form.setValue('rating', val)} />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Review</label>
            <textarea {...form.register('review')} rows={4} className="w-full flex rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            {form.formState.errors.review && <span className="text-red-500 text-xs">{form.formState.errors.review.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Client Photo</label>
            <ImageUploader value={form.watch('photo')} onChange={(val) => form.setValue('photo', val)} folder="testimonials" />
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" {...form.register('featured')} id="featured_test" className="rounded border-gray-300 text-gold focus:ring-gold" />
            <label htmlFor="featured_test" className="text-sm font-medium text-ink cursor-pointer">Featured Testimonial</label>
          </div>
        </div>
      </ModalForm>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={async () => {
          if (deletingId) {
            await deleteTestimonial.mutateAsync(deletingId)
            setDeletingId(null)
          }
        }}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </motion.div>
  )
}
