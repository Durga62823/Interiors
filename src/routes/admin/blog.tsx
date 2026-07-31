import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Plus, Trash2, Pencil, BookOpen, ExternalLink } from 'lucide-react'
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from '@/hooks/use-blog'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { LoadingSkeleton } from '@/components/admin/ui/LoadingSkeleton'
import { ImageUploader } from '@/components/admin/ui/ImageUploader'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { BlogPost } from '@/types/admin'

export const Route = createFileRoute('/admin/blog')({ component: BlogPage })

function BlogPage() {
  const { data: posts = [], isLoading } = useBlogPosts()
  const createPost = useCreateBlogPost()
  const updatePost = useUpdateBlogPost()
  const deletePost = useDeleteBlogPost()
  const [editing, setEditing] = useState<BlogPost | null>(null)

  const handleCreate = async () => {
    const post = await createPost.mutateAsync({ title: 'Untitled Post', content: '', status: 'draft' })
    setEditing(post)
  }

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editing) return
    const fd = new FormData(e.currentTarget)
    updatePost.mutate({
      id: editing.id,
      data: {
        title: fd.get('title') as string,
        slug: fd.get('slug') as string,
        excerpt: fd.get('excerpt') as string,
        content: fd.get('content') as string,
        category: fd.get('category') as string,
        metaTitle: fd.get('metaTitle') as string,
        metaDescription: fd.get('metaDescription') as string,
        status: fd.get('status') as BlogPost['status'],
        coverImageUrl: editing.coverImageUrl,
      },
    })
    setEditing(null)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 space-y-8">
      <PageHeader title="Blog" description="Manage blog articles for SEO and content marketing">
        <Button onClick={handleCreate} className="gap-2 bg-gold text-ink hover:bg-gold/90">
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </PageHeader>

      {isLoading && <LoadingSkeleton />}

      {!isLoading && posts.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <BookOpen className="mx-auto h-10 w-10 opacity-30 mb-4" />
          <p className="font-medium">No blog posts yet.</p>
          <p className="text-sm mt-1">Click "New Post" to start writing.</p>
        </div>
      )}

      {!isLoading && posts.length > 0 && (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              <th className="px-4 py-3" />
            </tr></thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setEditing(post)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {post.coverImageUrl && <img src={post.coverImageUrl} className="h-10 w-14 rounded object-cover shrink-0" alt="" />}
                      <div>
                        <p className="font-medium">{post.title}</p>
                        <p className="text-xs text-gray-400">/{post.slug} · {post.readingTimeMinutes} min read</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{post.category}</td>
                  <td className="px-4 py-3"><StatusBadge status={post.status} /></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(post.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {post.status === 'published' && (
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gold">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); deletePost.mutate(post.id) }} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Sheet */}
      <Sheet open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null) }}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.title || 'Edit Post'}</SheetTitle></SheetHeader>
          {editing && (
            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Title</label>
                <input name="title" defaultValue={editing.title} required className="w-full border rounded px-3 py-2 text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Slug</label>
                <input name="slug" defaultValue={editing.slug} required className="w-full border rounded px-3 py-2 text-sm mt-1 font-mono text-xs" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Excerpt</label>
                <textarea name="excerpt" defaultValue={editing.excerpt} rows={2} className="w-full border rounded px-3 py-2 text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Cover Image</label>
                <div className="mt-1">
                  <ImageUploader value={editing.coverImageUrl} onChange={(url) => setEditing({ ...editing, coverImageUrl: url })} folder="blog" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Content (HTML supported)</label>
                <textarea name="content" defaultValue={editing.content} rows={12} className="w-full border rounded px-3 py-2 text-sm mt-1 font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Category</label>
                  <input name="category" defaultValue={editing.category} className="w-full border rounded px-3 py-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Status</label>
                  <select name="status" defaultValue={editing.status} className="w-full border rounded px-3 py-2 text-sm mt-1">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Meta Title (SEO)</label>
                  <input name="metaTitle" defaultValue={editing.metaTitle} className="w-full border rounded px-3 py-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Meta Description (SEO)</label>
                  <input name="metaDescription" defaultValue={editing.metaDescription} className="w-full border rounded px-3 py-2 text-sm mt-1" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gold text-ink hover:bg-gold/90">Save Post</Button>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  )
}
