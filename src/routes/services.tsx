import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ArrowRight, Armchair, ChefHat, Sofa, BedDouble, Briefcase, Building2, Layers, BookOpen, Wrench, Hammer } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — NSS Home Designs Bengaluru" },
      { name: "description", content: "Home interiors, modular kitchens, wardrobes, false ceilings, office and commercial interiors in Bengaluru." },
      { property: "og:title", content: "Services — NSS Home Designs" },
      { property: "og:description", content: "Full-service interior design and execution in Bengaluru." },
    ],
  }),
  component: Services,
});

const services = [
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

function Services() {
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
          {services.map((s) => (
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