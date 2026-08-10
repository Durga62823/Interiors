import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useEffect, useState, useMemo } from "react";
import heroImg from "@/assets/hero.jpg";
import kitchenImg from "@/assets/portfolio-kitchen.jpg";
import bedroomImg from "@/assets/portfolio-bedroom.jpg";
import officeImg from "@/assets/portfolio-office.jpg";
import wardrobeImg from "@/assets/portfolio-wardrobe.jpg";
import ceilingImg from "@/assets/portfolio-ceiling.jpg";
import { usePortfolio } from "@/hooks/use-portfolio";
import { useSettings } from "@/hooks/use-settings";
import { applySeo } from "@/lib/seo";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
});

// Static fallbacks — only shown when DB is completely empty
// 'category' is the clean filter key; 'tag' is the display string
const staticProjects = [
  { id: "static-1", img: heroImg, title: "Noir Living", tag: "Living Room · Jayanagar", category: "Living Room", span: "lg:col-span-2 aspect-[16/10]" },
  { id: "static-2", img: kitchenImg, title: "Onyx Kitchen", tag: "Modular Kitchen · Whitefield", category: "Modular Kitchen", span: "aspect-[4/5]" },
  { id: "static-3", img: bedroomImg, title: "Serene Suite", tag: "Master Bedroom · HSR Layout", category: "Bedroom", span: "aspect-[4/5]" },
  { id: "static-4", img: officeImg, title: "Walnut Workspace", tag: "Office · Koramangala", category: "Office", span: "aspect-[4/5]" },
  { id: "static-5", img: wardrobeImg, title: "Atelier Wardrobe", tag: "Walk-in Closet · Indiranagar", category: "Wardrobe", span: "aspect-[4/5]" },
  { id: "static-6", img: ceilingImg, title: "Luminous Ceiling", tag: "False Ceiling · Electronic City", category: "False Ceiling", span: "lg:col-span-2 aspect-[16/10]" },
];

function Portfolio() {
  const { data: dbProjects } = usePortfolio();
  const { data: settings } = useSettings();
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const companyName = settings?.companyName || 'Neeli Home Designs';
    applySeo({
      title: `Interior Design Portfolio — ${companyName}`,
      description: `Browse our completed interior design projects in Bengaluru — modular kitchens, bedrooms, living rooms, wardrobes and full home transformations.`,
      ogTitle: `Our Portfolio — ${companyName}`,
      ogDescription: 'Real homes, real transformations. View our completed interior design projects.',
    });
  }, [settings]);

  // Build displayProjects with a clean 'category' field for filtering
  const allProjects = useMemo(() => {
    if (!dbProjects || dbProjects.length === 0) return staticProjects;
    const published = dbProjects.filter((p: any) => p.status === 'published');
    const source = published.length > 0 ? published : dbProjects;
    return source.map((p: any, index: number, arr: any[]) => ({
      id: p.id,
      img: p.thumbnail || heroImg,
      title: p.name,
      tag: p.category + (p.location ? ` · ${p.location}` : ''),
      category: p.category as string,
      span: index === 0 || index === arr.length - 1 ? 'lg:col-span-2 aspect-[16/10]' : 'aspect-[4/5]',
    }));
  }, [dbProjects]);

  // Derive unique categories — always starts with "All"
  const categories = useMemo(() => {
    const unique = Array.from(new Set(allProjects.map((p) => p.category))).filter(Boolean);
    return ["All", ...unique];
  }, [allProjects]);

  // Reset filter to "All" when category no longer exists (e.g. DB reload)
  useEffect(() => {
    if (activeFilter !== "All" && !categories.includes(activeFilter)) {
      setActiveFilter("All");
    }
  }, [categories, activeFilter]);

  // Apply category filter
  const displayProjects = useMemo(() => {
    if (activeFilter === "All") return allProjects;
    return allProjects.filter((p) => p.category === activeFilter);
  }, [allProjects, activeFilter]);

  // Only show filter bar when there is more than one distinct category
  const showFilters = categories.length > 2;

  return (
    <SiteLayout>
      <section className="container-luxe pt-36 pb-12 md:pt-44 md:pb-20">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Portfolio</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
          Selected <span className="italic text-gold-gradient">work</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          A curated selection of homes, kitchens and workspaces we've designed across Bengaluru.
        </p>
      </section>

      {/* Category filter pills — only rendered when 2+ distinct categories exist */}
      {showFilters && (
        <section className="container-luxe pb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-sm px-5 py-2 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-200 ${activeFilter === cat
                    ? "bg-ink text-cream"
                    : "border border-border bg-transparent text-foreground hover:border-gold hover:text-gold"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="container-luxe pb-24">
        {/* Empty state — when a filter has no matching projects */}
        {displayProjects.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">No projects in this category yet.</p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-4 text-xs uppercase tracking-[0.25em] text-gold hover:underline"
            >
              View all projects
            </button>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((p) => {
            const isStatic = p.id.startsWith('static-');
            const Card = (
              <figure key={p.id} className={`group overflow-hidden rounded-sm bg-card ${p.span}`}>
                <div className="relative h-full w-full overflow-hidden">
                  <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-1200 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/10 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 text-cream">
                    <h3 className="font-display text-2xl">{p.title}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-cream/70">{p.tag}</p>
                    {!isStatic && (
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        View project →
                      </span>
                    )}
                  </figcaption>
                </div>
              </figure>
            );
            if (isStatic) return Card;
            return (
              <Link key={p.id} to="/portfolio/$id" params={{ id: p.id }} className="block">
                {Card}
              </Link>
            );
          })}
        </div>
      </section>
    </SiteLayout>
  );
}