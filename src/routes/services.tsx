import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ArrowRight, Armchair, ChefHat, Sofa, BedDouble, Briefcase, Building2, Layers, BookOpen, Wrench, Hammer, PencilRuler } from "lucide-react";
import { useEffect } from "react";
import { useServices } from "@/hooks/use-services";
import { useSettings } from "@/hooks/use-settings";
import { applySeo } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  component: Services,
});

// Static fallbacks — only shown when DB returns nothing
const staticServices = [
  { icon: Armchair, title: "Home Interiors", desc: "Turnkey residential design — from layout to last switch plate.", from: "₹3.5L" },
  { icon: ChefHat, title: "Modular Kitchens", desc: "Ergonomic, durable kitchens with premium hardware and finishes.", from: "₹1.8L" },
  { icon: Sofa, title: "Living Rooms", desc: "Statement living spaces designed around how you actually entertain.", from: "₹1.2L" },
  { icon: BedDouble, title: "Bedrooms", desc: "Restful master and guest suites with bespoke joinery.", from: "₹1.5L" },
  { icon: Briefcase, title: "Office Interiors", desc: "Workspaces that perform as well as they look.", from: "₹4.5L" },
  { icon: Building2, title: "Commercial Spaces", desc: "Retail, hospitality and showroom interiors with brand presence.", from: "On request" },
  { icon: Layers, title: "False Ceilings", desc: "Gypsum and POP ceilings with integrated lighting design.", from: "₹85/sqft" },
  { icon: BookOpen, title: "Wardrobes", desc: "Sliding, hinged and walk-in wardrobes — built to your inch.", from: "₹1,250/sqft" },
  { icon: Wrench, title: "Renovations", desc: "End-to-end home and apartment refurbishments.", from: "On request" },
  { icon: Hammer, title: "Custom Furniture", desc: "Bespoke pieces designed and joined in our workshop.", from: "On request" },
];

function getCategoryIcon(category: string) {
  const iconMap: Record<string, any> = {
    'Interior Design': PencilRuler,
    'Home Interiors': Armchair,
    'Modular Kitchens': ChefHat,
    'Modular Kitchen': ChefHat,
    'Kitchen': ChefHat,
    'Living Room': Sofa,
    'Bedroom': BedDouble,
    'Office': Briefcase,
    'Office Interiors': Briefcase,
    'Commercial': Building2,
    'Commercial Spaces': Building2,
    'False Ceiling': Layers,
    'Ceiling': Layers,
    'Wardrobe': BookOpen,
    'Modular Furniture': Armchair,
    'Renovation': Wrench,
    'Doors & Woodwork': Hammer,
  };
  return iconMap[category] || PencilRuler;
}

// Static package data — will eventually be driven by admin pricing config
const packages = [
  {
    name: 'Essential',
    tagline: 'Smart design within a budget — no compromises on quality.',
    price: '₹3.5L',
    popular: false,
    features: [
      { label: 'Dedicated interior designer', included: true },
      { label: 'Project manager assigned', included: true },
      { label: 'Standard material finishes', included: true },
      { label: 'Modular kitchen (laminate)', included: true },
      { label: 'Wardrobes (laminate finish)', included: true },
      { label: 'Basic false ceiling (living + bedrooms)', included: true },
      { label: '2D layout plans', included: true },
      { label: '3D photo-realistic renders', included: false },
      { label: 'Premium hardware (Hettich/Hafele)', included: false },
      { label: 'Custom furniture design', included: false },
      { label: 'Post-installation support', included: false },
    ],
  },
  {
    name: 'Premium',
    tagline: 'The most-chosen package — premium materials, stunning results.',
    price: '₹6.5L',
    popular: true,
    features: [
      { label: 'Dedicated interior designer', included: true },
      { label: 'Project manager assigned', included: true },
      { label: 'Premium material finishes', included: true },
      { label: 'Modular kitchen (acrylic/PU)', included: true },
      { label: 'Wardrobes (lacquer/veneer finish)', included: true },
      { label: 'Designer false ceilings (all rooms)', included: true },
      { label: '2D layout plans', included: true },
      { label: '3D photo-realistic renders', included: true },
      { label: 'Premium hardware (Hettich/Hafele)', included: true },
      { label: 'Custom furniture design', included: false },
      { label: 'Post-installation support', included: false },
    ],
  },
  {
    name: 'Luxury',
    tagline: 'Bespoke everything — for clients who want the absolute best.',
    price: '₹12L',
    popular: false,
    features: [
      { label: 'Senior designer + design team', included: true },
      { label: 'Dedicated project manager', included: true },
      { label: 'Imported premium finishes', included: true },
      { label: 'Modular kitchen (Italian finish)', included: true },
      { label: 'Wardrobes (custom veneer/glass)', included: true },
      { label: 'Signature false ceilings + cove lighting', included: true },
      { label: '2D + 3D + walkthrough renders', included: true },
      { label: '3D photo-realistic renders', included: true },
      { label: 'Imported hardware (Blum/Grass)', included: true },
      { label: 'Custom furniture design', included: true },
      { label: '1-year post-installation support', included: true },
    ],
  },
];

function Services() {
  const { data: dbServices } = useServices();
  const { data: settings } = useSettings();

  useEffect(() => {
    const companyName = settings?.companyName || 'NSS Home Designs';
    applySeo({
      title: `Interior Design Services — ${companyName}`,
      description: `Explore our full range of interior design services including modular kitchens, wardrobes, false ceilings and complete home interiors in Bengaluru.`,
      ogTitle: `Our Services — ${companyName}`,
      ogDescription: 'Premium interior design services for homes and offices in Bengaluru.',
    });
  }, [settings]);

  // Use all DB services when available, otherwise static fallback
  const displayServices = dbServices && dbServices.length > 0
    ? dbServices.map((s: any) => ({
        icon: getCategoryIcon(s.category || ''),
        title: s.title,
        desc: s.description,
        from: s.price || 'On request',
      }))
    : staticServices;

  return (
    <SiteLayout>
      <section className="container-luxe pt-36 pb-12 md:pt-44 md:pb-20">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Services</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
          End-to-end interior <span className="italic text-gold-gradient">craft</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          A full-service studio for residential and commercial interiors across Bengaluru — from a single wardrobe to a turnkey home.
        </p>
      </section>

      <section className="container-luxe pb-20">
        <div className="grid gap-px overflow-hidden rounded-sm bg-border sm:grid-cols-2 lg:grid-cols-3">
          {displayServices.map((s) => (
            <div key={s.title} className="group flex flex-col bg-card p-8 transition-colors hover:bg-ink hover:text-cream">
              <s.icon className="h-7 w-7 text-gold" strokeWidth={1.25} />
              <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
              <p className="mt-2 grow text-sm text-muted-foreground group-hover:text-cream/70">{s.desc}</p>
              <div className="mt-6 flex items-end justify-between border-t border-border pt-4 group-hover:border-cream/15">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-cream/60">Starting</div>
                  <div className="font-display text-xl text-foreground group-hover:text-gold">{s.from}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gold opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Package Comparison ───────────────────────────────────────────── */}
      <section className="container-luxe pb-20">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Packages</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Choose your <span className="italic text-gold-gradient">level</span>.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
            Three tiers designed for different budgets and aspirations. Every package includes a dedicated designer and project manager.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex flex-col rounded-sm border p-8 transition-shadow hover:shadow-lg ${
                pkg.popular
                  ? 'border-gold bg-ink text-cream shadow-md'
                  : 'border-border bg-card'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm bg-gold px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-ink">
                  Most Popular
                </span>
              )}

              <h3 className="font-display text-2xl">{pkg.name}</h3>
              <p className={`mt-2 text-sm ${pkg.popular ? 'text-cream/60' : 'text-muted-foreground'}`}>
                {pkg.tagline}
              </p>

              <div className="mt-6 mb-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground block">Starting at</span>
                <span className={`font-display text-4xl ${pkg.popular ? 'text-gold' : 'text-foreground'}`}>
                  {pkg.price}
                </span>
              </div>

              <ul className="space-y-3 grow">
                {pkg.features.map((feat) => (
                  <li key={feat.label} className="flex items-start gap-3 text-sm">
                    <span className={`mt-0.5 shrink-0 text-sm font-bold ${
                      feat.included
                        ? 'text-gold'
                        : pkg.popular ? 'text-cream/25' : 'text-muted-foreground/40'
                    }`}>
                      {feat.included ? '✓' : '—'}
                    </span>
                    <span className={
                      feat.included
                        ? ''
                        : pkg.popular ? 'text-cream/40 line-through' : 'text-muted-foreground/50 line-through'
                    }>
                      {feat.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-sm px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] transition-colors ${
                  pkg.popular
                    ? 'bg-gold text-ink hover:bg-cream'
                    : 'border border-border bg-transparent hover:border-gold hover:text-gold'
                }`}
              >
                Get a Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxe pb-24">
        <div className="rounded-sm bg-ink p-10 text-cream md:p-16">
          <div className="grid items-center gap-8 md:grid-cols-[2fr_1fr]">
            <h2 className="font-display text-3xl leading-tight md:text-5xl">
              Not sure where to start? We'll guide you.
            </h2>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-4 text-xs uppercase tracking-[0.25em] text-ink hover:bg-cream">
              Get a Free Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}