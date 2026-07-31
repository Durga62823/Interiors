import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Calendar, Ruler, Banknote, Tag, Expand } from "lucide-react";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { SiteLayout } from "@/components/SiteLayout";
import { usePortfolioProject } from "@/hooks/use-portfolio";
import { useSettings } from "@/hooks/use-settings";
import { applySeo } from "@/lib/seo";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/portfolio/$id")({
  component: PortfolioDetail,
});

function PortfolioDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { data: project, isLoading, isError } = usePortfolioProject(id);
  const { data: settings } = useSettings();
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // Page-specific SEO
  useEffect(() => {
    if (!project) return;
    const companyName = settings?.companyName || "NSS Home Designs";
    applySeo({
      title: `${project.name} — ${project.category} · ${companyName}`,
      description:
        project.description ||
        `View the ${project.category} project by ${companyName}${project.location ? ` in ${project.location}` : ""}.`,
      ogTitle: project.name,
      ogDescription: project.description || `${project.category} interior design project.`,
      ogImage: project.thumbnail || "",
    });
  }, [project, settings]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container-luxe pt-36 pb-24 space-y-6 animate-pulse">
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-[60vh] rounded-sm bg-muted" />
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-4 w-full max-w-xl rounded bg-muted" />
        </div>
      </SiteLayout>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (isError || !project) {
    return (
      <SiteLayout>
        <div className="container-luxe pt-44 pb-24 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Not Found</p>
          <h1 className="mt-4 font-display text-5xl">Project not found</h1>
          <p className="mt-4 text-muted-foreground">
            This project may have been removed or is not yet published.
          </p>
          <Link
            to="/portfolio"
            className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-gold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </Link>
        </div>
      </SiteLayout>
    );
  }

  // ── Spec items — only rendered when the field is non-empty ─────────────────
  const specs = [
    { icon: MapPin,    label: "Location",    value: project.location },
    { icon: Ruler,     label: "Area",        value: project.area },
    { icon: Banknote,  label: "Budget",      value: project.budget },
    { icon: Calendar,  label: "Completed",   value: project.completionDate },
  ].filter((s) => s.value);

  const galleryImages = project.gallery && project.gallery.length > 0
    ? project.gallery
    : project.thumbnail
      ? [project.thumbnail]
      : [];

  return (
    <SiteLayout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate min-h-[70vh] overflow-hidden bg-ink text-cream">
        <img
          src={project.thumbnail || heroImg}
          alt={project.name}
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.08_0.01_60/0.4)_0%,oklch(0.08_0.01_60/0.85)_100%)]" />

        <div className="relative z-10 container-luxe flex min-h-[70vh] flex-col justify-end pb-14 pt-36">
          {/* Back link */}
          <button
            onClick={() => router.history.back()}
            className="mb-6 inline-flex w-fit items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-cream/60 transition hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Portfolio
          </button>

          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{project.category}</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
            {project.name}
          </h1>
          {project.location && (
            <p className="mt-3 flex items-center gap-2 text-sm text-cream/70">
              <MapPin className="h-3.5 w-3.5 text-gold" /> {project.location}
            </p>
          )}
        </div>
      </section>

      {/* ── Specs bar ────────────────────────────────────────────────────── */}
      {specs.length > 0 && (
        <section className="border-b border-border bg-card">
          <div className="container-luxe grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4 md:py-10">
            {specs.map((spec) => (
              <div key={spec.label} className="px-2 md:border-l md:border-border md:first:border-l-0">
                <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  <spec.icon className="h-3.5 w-3.5 text-gold" />
                  {spec.label}
                </p>
                <p className="mt-1.5 font-display text-lg">{spec.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Description ──────────────────────────────────────────────────── */}
      {project.description && (
        <section className="container-luxe py-14 md:py-20">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-gold">About this project</p>
              <p className="mt-6 text-lg leading-relaxed text-foreground/80 whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Tags + Client sidebar */}
            <aside className="space-y-6">
              {project.client && (
                <div className="rounded-sm border border-border bg-card p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Client</p>
                  <p className="mt-2 font-display text-xl">{project.client}</p>
                </div>
              )}
              {project.tags && project.tags.length > 0 && (
                <div className="rounded-sm border border-border bg-card p-5">
                  <p className="mb-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" /> Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-sm border border-border px-3 py-1 text-xs tracking-wide text-foreground/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      )}

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      {galleryImages.length > 0 && (
        <section className="container-luxe pb-20 md:pb-28">
          {project.description && (
            <div className="mb-10 flex items-end justify-between">
              <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Gallery</p>
              <p className="text-xs text-muted-foreground">
                {galleryImages.length} image{galleryImages.length !== 1 ? 's' : ''} · click to enlarge
              </p>
            </div>
          )}
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {galleryImages.map((url, i) => (
              <div
                key={i}
                className="group/img mb-4 break-inside-avoid overflow-hidden rounded-sm cursor-pointer relative"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={url}
                  alt={`${project.name} — image ${i + 1}`}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 group-hover/img:scale-[1.02]"
                />
                {/* Expand overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover/img:bg-ink/30">
                  <Expand className="h-6 w-6 text-cream opacity-0 transition-opacity duration-300 group-hover/img:opacity-100" />
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox — full-screen image viewer */}
          <Lightbox
            open={lightboxIndex >= 0}
            index={lightboxIndex}
            close={() => setLightboxIndex(-1)}
            slides={galleryImages.map((url, i) => ({
              src: url,
              alt: `${project.name} — image ${i + 1}`,
            }))}
          />
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="container-luxe pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-sm bg-ink p-10 text-cream md:p-14">
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(60%_60%_at_80%_20%,oklch(0.78_0.13_80/0.5),transparent_60%)]" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Love what you see?</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                Let's design your space next.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] text-ink hover:bg-cream transition-colors"
              >
                Book a Consultation
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-cream/30 px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] hover:border-gold hover:text-gold transition-colors"
              >
                View More Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
