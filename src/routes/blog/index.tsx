import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ArrowRight, Clock, Calendar } from 'lucide-react'
import { SiteLayout } from '@/components/SiteLayout'
import { usePublishedPosts } from '@/hooks/use-blog'
import { useSettings } from '@/hooks/use-settings'
import { applySeo } from '@/lib/seo'

export const Route = createFileRoute('/blog/')({ component: BlogIndex })

function BlogIndex() {
  const { data: posts = [], isLoading } = usePublishedPosts()
  const { data: settings } = useSettings()

  useEffect(() => {
    const companyName = settings?.companyName || 'Neeli Home Designs'
    applySeo({
      title: `Interior Design Blog — ${companyName}`,
      description: `Read expert articles on interior design trends, tips, and ideas from ${companyName}. Everything you need to plan your dream home.`,
      ogTitle: `Blog — ${companyName}`,
      ogDescription: 'Interior design inspiration, cost guides, and expert tips.',
    })
  }, [settings])

  return (
    <SiteLayout>
      <section className="container-luxe pt-36 pb-12 md:pt-44 md:pb-20">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Blog</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
          Design <span className="italic text-gold-gradient">insights</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          Expert articles on interior design trends, cost guides, material choices and inspiration for your home.
        </p>
      </section>

      <section className="container-luxe pb-24">
        {isLoading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="h-48 rounded-sm bg-muted" />
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p className="font-display text-xl">Coming soon.</p>
            <p className="mt-2 text-sm">We're working on our first articles. Check back soon!</p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <a key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col rounded-sm border border-border bg-card overflow-hidden transition-shadow hover:shadow-lg hover:border-gold/30">
                {post.coverImageUrl && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                    <span className="text-gold">{post.category}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readingTimeMinutes} min</span>
                  </div>
                  <h2 className="font-display text-xl leading-snug group-hover:text-gold transition-colors">{post.title}</h2>
                  {post.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2 grow">{post.excerpt}</p>}
                  <div className="mt-4 flex items-center gap-1 text-xs text-gold font-medium uppercase tracking-wider opacity-0 transition-opacity group-hover:opacity-100">
                    Read More <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  )
}
