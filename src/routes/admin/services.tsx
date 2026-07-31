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
import { cn } from '@/lib/utils'

import type { Service } from '@/types/admin'
import { useServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks/use-services'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { DataTable } from '@/components/admin/ui/DataTable'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { ModalForm } from '@/components/admin/ui/ModalForm'
import { ImageUploader } from '@/components/admin/ui/ImageUploader'
import { ActionDropdown } from '@/components/admin/ui/ActionDropdown'
import { LoadingSkeleton } from '@/components/admin/ui/LoadingSkeleton'

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().optional(),
  featured: z.boolean(),
  displayOrder: z.number(),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

export const Route = createFileRoute('/admin/services')({
  component: ServicesPage,
})

function ServicesPage() {
  const { data: services = [], isLoading, isError, error } = useServices()
  const createService = useCreateService()
  const updateService = useUpdateService()
  const deleteService = useDeleteService()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category: 'Interior Design',
      image: '',
      featured: false,
      displayOrder: 0,
    }
  })

  const handleOpenModal = (service?: Service, duplicate = false) => {
    if (service) {
      form.reset({
        title: duplicate ? `${service.title} (Copy)` : service.title,
        description: service.description,
        price: service.price,
        category: service.category as any,
        image: service.image || '',
        featured: service.featured,
        displayOrder: service.displayOrder,
      })
      setEditingId(duplicate ? null : service.id)
    } else {
      form.reset({
        title: '',
        description: '',
        price: '',
        category: 'Interior Design',
        image: '',
        featured: false,
        displayOrder: 0,
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const onSubmit = async (data: ServiceFormValues) => {
    const serviceData = {
      ...data,
      image: data.image || '',
      featured: data.featured ?? false,
      displayOrder: data.displayOrder ?? 0,
    }
    if (editingId) {
      await updateService.mutateAsync({ id: editingId, data: serviceData })
    } else {
      await createService.mutateAsync(serviceData)
    }
    setIsModalOpen(false)
    form.reset()
  }

  const columns: ColumnDef<Service>[] = [
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
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'price',
      header: 'Price',
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => {
        return row.original.featured ? <Badge variant="default" className="bg-gold text-white">Featured</Badge> : <Badge variant="secondary">No</Badge>
      }
    },
    {
      accessorKey: 'displayOrder',
      header: 'Display Order',
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
          onDuplicate={() => handleOpenModal(row.original, true)}
          onDelete={() => setDeletingId(row.original.id)}
        />
      )
    }
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8">
      <PageHeader 
        title="Services" 
        description="Manage your service offerings"
        action={
          <Button onClick={() => handleOpenModal()} className="bg-gold hover:bg-gold/90 text-white">
            <Plus className="w-4 h-4 mr-2"/>
            Add Service
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-medium mb-1">Failed to load services</p>
          <p className="text-red-500 text-sm">{(error as any)?.message || 'Could not connect to database. Make sure your Supabase tables are created and your connection is valid.'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <DataTable columns={columns} data={services} />
        </div>
      )}

      <ModalForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Service' : 'Add Service'}
        onSubmit={form.handleSubmit(onSubmit)}
        isLoading={createService.isPending || updateService.isPending}
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Title</label>
            <input {...form.register('title')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            {form.formState.errors.title && <span className="text-red-500 text-xs">{form.formState.errors.title.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Description</label>
            <textarea {...form.register('description')} rows={3} className="w-full flex rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            {form.formState.errors.description && <span className="text-red-500 text-xs">{form.formState.errors.description.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Price</label>
            <input {...form.register('price')} placeholder="e.g. ₹3.5L" className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            {form.formState.errors.price && <span className="text-red-500 text-xs">{form.formState.errors.price.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Category</label>
            <select {...form.register('category')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              {['Interior Design', 'Kitchen', 'Bedroom', 'Living Room', 'Office', 'Commercial', 'Ceiling', 'Wardrobe', 'Renovation', 'Furniture'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {form.formState.errors.category && <span className="text-red-500 text-xs">{form.formState.errors.category.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Image</label>
            <ImageUploader value={form.watch('image')} onChange={(val) => form.setValue('image', val)} folder="services" />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" {...form.register('featured')} id="featured" className="rounded border-gray-300 text-gold focus:ring-gold" />
            <label htmlFor="featured" className="text-sm font-medium text-ink cursor-pointer">Featured Service</label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Display Order</label>
            <input type="number" {...form.register('displayOrder', { valueAsNumber: true })} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>
        </div>
      </ModalForm>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={async () => {
          if (deletingId) {
            await deleteService.mutateAsync(deletingId)
            setDeletingId(null)
          }
        }}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
      />
    </motion.div>
  )
}
