import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { PortfolioProject } from '@/types/admin'
import { usePortfolio, useCreatePortfolio, useUpdatePortfolio, useDeletePortfolio } from '@/hooks/use-portfolio'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { DataTable } from '@/components/admin/ui/DataTable'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { ModalForm } from '@/components/admin/ui/ModalForm'
import { ImageUploader } from '@/components/admin/ui/ImageUploader'
import { ActionDropdown } from '@/components/admin/ui/ActionDropdown'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { LoadingSkeleton } from '@/components/admin/ui/LoadingSkeleton'
import { EmptyState } from '@/components/admin/ui/EmptyState'

const portfolioSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().optional(),
  completionDate: z.string().optional(),
  description: z.string().optional(),
  client: z.string().optional(),
  area: z.string().optional(),
  budget: z.string().optional(),
  thumbnail: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
  tags: z.string().optional(),
})

type PortfolioFormValues = z.infer<typeof portfolioSchema>

export const Route = createFileRoute('/admin/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  const { data: projects = [], isLoading } = usePortfolio()
  const createPortfolio = useCreatePortfolio()
  const updatePortfolio = useUpdatePortfolio()
  const deletePortfolio = useDeletePortfolio()

  const [view, setView] = useState<'table' | 'card'>('table')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      name: '',
      category: 'Living Room',
      location: '',
      completionDate: '',
      description: '',
      client: '',
      area: '',
      budget: '',
      thumbnail: '',
      status: 'draft',
      featured: false,
      tags: '',
    }
  })

  const handleOpenModal = (project?: PortfolioProject) => {
    if (project) {
      form.reset({
        name: project.name,
        category: project.category as any,
        location: project.location || '',
        completionDate: project.completionDate || '',
        description: project.description || '',
        client: project.client || '',
        area: project.area || '',
        budget: project.budget || '',
        thumbnail: project.thumbnail || '',
        status: project.status,
        featured: project.featured,
        tags: project.tags?.join(', ') || '',
      })
      setEditingId(project.id)
    } else {
      form.reset({
        name: '',
        category: 'Living Room',
        location: '',
        completionDate: '',
        description: '',
        client: '',
        area: '',
        budget: '',
        thumbnail: '',
        status: 'draft',
        featured: false,
        tags: '',
      })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  const onSubmit = async (data: PortfolioFormValues) => {
    const payload = {
      ...data,
      featured: data.featured ?? false,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    }
    
    if (editingId) {
      await updatePortfolio.mutateAsync({ id: editingId, data: payload })
    } else {
      await createPortfolio.mutateAsync(payload)
    }
    setIsModalOpen(false)
    form.reset()
  }

  const columns: ColumnDef<PortfolioProject>[] = [
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
      accessorKey: 'thumbnail',
      header: 'Thumbnail',
      cell: ({ row }) => {
        const thumb = row.original.thumbnail
        return thumb ? (
          <img src={thumb} alt={row.original.name} className="w-10 h-10 rounded-md object-cover border" />
        ) : (
          <div className="w-10 h-10 rounded-md bg-gray-100 border flex items-center justify-center text-xs text-gray-400">No Img</div>
        )
      }
    },
    {
      accessorKey: 'name',
      header: 'Project Name',
      cell: ({ row }) => <span className="font-medium text-ink">{row.original.name}</span>
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => row.original.featured ? <Badge className="bg-gold text-white">Yes</Badge> : null
    },
    {
      accessorKey: 'completionDate',
      header: 'Completion Date',
      cell: ({ row }) => row.original.completionDate ? new Date(row.original.completionDate).toLocaleDateString() : '-'
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="Portfolio" 
          description="Manage your past projects and showcase"
        />
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('table')} 
              className={cn("p-2 rounded-md transition-colors", view === 'table' ? "bg-white shadow-sm" : "text-gray-500 hover:text-ink")}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('card')} 
              className={cn("p-2 rounded-md transition-colors", view === 'card' ? "bg-white shadow-sm" : "text-gray-500 hover:text-ink")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={() => handleOpenModal()} className="bg-gold hover:bg-gold/90 text-white">
            <Plus className="w-4 h-4 mr-2"/>
            Add Project
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : projects.length === 0 ? (
        <EmptyState title="No projects found" description="Add your first portfolio project to showcase your work." action={<Button onClick={() => handleOpenModal()} className="bg-gold hover:bg-gold/90 text-white mt-4">Add Project</Button>} />
      ) : (
        view === 'table' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <DataTable columns={columns} data={projects} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: PortfolioProject) => (
              <motion.div key={project.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <StatusBadge status={project.status} />
                    {project.featured && <Badge className="bg-gold text-white shadow-sm">Featured</Badge>}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-ink font-serif">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.category}</p>
                    </div>
                    <ActionDropdown
                      onEdit={() => handleOpenModal(project)}
                      onDelete={() => setDeletingId(project.id)}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      )}

      <ModalForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Project' : 'Add Project'}
        onSubmit={form.handleSubmit(onSubmit)}
        isLoading={createPortfolio.isPending || updatePortfolio.isPending}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-ink">Project Name</label>
            <input {...form.register('name')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            {form.formState.errors.name && <span className="text-red-500 text-xs">{form.formState.errors.name.message}</span>}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Category</label>
            <select {...form.register('category')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              {['Living Room', 'Kitchen', 'Bedroom', 'Office', 'Wardrobe', 'Ceiling', 'Commercial', 'Bathroom'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {form.formState.errors.category && <span className="text-red-500 text-xs">{form.formState.errors.category.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Status</label>
            <select {...form.register('status')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Location</label>
            <input {...form.register('location')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Completion Date</label>
            <input type="date" {...form.register('completionDate')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Client Name</label>
            <input {...form.register('client')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Area (e.g. 1200 sqft)</label>
            <input {...form.register('area')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Budget</label>
            <input {...form.register('budget')} className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-ink">Tags (comma-separated)</label>
            <input {...form.register('tags')} placeholder="modern, luxury, minimalist" className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-ink">Description</label>
            <textarea {...form.register('description')} rows={3} className="w-full flex rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-ink">Thumbnail Image</label>
            <ImageUploader value={form.watch('thumbnail')} onChange={(val) => form.setValue('thumbnail', val)} folder="portfolio" />
          </div>

          <div className="flex items-center space-x-2 md:col-span-2">
            <input type="checkbox" {...form.register('featured')} id="featured_port" className="rounded border-gray-300 text-gold focus:ring-gold" />
            <label htmlFor="featured_port" className="text-sm font-medium text-ink cursor-pointer">Featured Project</label>
          </div>
        </div>
      </ModalForm>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={async () => {
          if (deletingId) {
            await deletePortfolio.mutateAsync(deletingId)
            setDeletingId(null)
          }
        }}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
      />
    </motion.div>
  )
}
