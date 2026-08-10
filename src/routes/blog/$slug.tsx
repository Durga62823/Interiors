import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'
import { SiteLayout } from '@/components/SiteLayout'
import { useBlogPost } from '@/hooks/use-blog'
import { useSettings } from '@/hooks/use-settings'
import { applySeo } from '@/lib/seo'

export const Route = createFileRoute('/blog/$slug')({ component: BlogPostPage })

function BlogPostPage() {
  const { slug } = Route.useParams()
  const { data: post, isLoading } = useBlogPost(slug)
  const { data: settings } = useSettings()

  useEffect(() => {
    if (!post) return
    const companyName = settings?.companyName || 'Neeli Home Designs'
    applySeo({
      title: post.metaTitle || `${post.title} — ${companyName}`,
      description: post.metaDescription || post.excerpt,
      ogTitle: post.metaTitle || post.title,
      ogDescription: post.metaDescription || post.excerpt,
      ogImage: post.ogImageUrl || post.coverImageUrl,
    })
  }, [post, settings])

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container-luxe pt-36 pb-24 space-y-6 animate-pulse">
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-[50vh] rounded-sm bg-muted" />
          <div className="h-10 w-3/4 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted mt-10" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-4/6 rounded bg-muted" />
        </div>
      </SiteLayout>
    )
  }

  if (!post || post.status !== 'published') {
    return (
      <SiteLayout>
        <div className="container-luxe pt-44 pb-32 text-center">
          <h1 className="font-display text-4xl">Post not found</h1>
          <p className="mt-4 text-muted-foreground">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="mt-8 inline-flex items-center gap-2 text-sm text-gold hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <article className="container-luxe pt-36 pb-24 md:pt-44">
        {/* Header */}
        <header className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
            <span className="text-gold">{post.category}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {post.readingTimeMinutes} min read</span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.1] text-foreground">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-6 text-lg text-muted-foreground/80 leading-relaxed max-w-3xl mx-auto">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="aspect-video w-full max-w-5xl mx-auto rounded-sm overflow-hidden mb-16">
            <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div
          className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert prose-headings:font-display prose-headings:font-normal prose-a:text-gold hover:prose-a:text-gold/80 prose-img:rounded-sm"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags & Footer */}
        {post.tags && post.tags.length > 0 && (
          <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-border flex items-center gap-3">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs tracking-wider uppercase text-muted-foreground bg-muted px-2 py-1 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto mt-16 text-center">
          <Link to="/blog" className="inline-flex items-center justify-center gap-2 rounded-sm border border-border px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] hover:border-gold hover:text-gold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to all articles
          </Link>
        </div>
      </article>
    </SiteLayout>
  )
}
