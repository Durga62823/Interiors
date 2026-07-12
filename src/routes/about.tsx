import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ArrowRight } from "lucide-react";
import bedroomImg from "@/assets/portfolio-bedroom.jpg";
import officeImg from "@/assets/portfolio-office.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — NSS Home Designs" },
      { name: "description", content: "Meet NSS Home Designs — a Bengaluru-based design studio crafting modern luxury homes and workspaces." },
      { property: "og:title", content: "About — NSS Home Designs" },
      { property: "og:description", content: "A Bengaluru design studio crafting modern luxury interiors." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="container-luxe pt-36 pb-16 md:pt-44 md:pb-24">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">About the studio</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
          A young studio with a <span className="italic text-gold-gradient">timeless</span> point of view.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
          NSS Home Designs is a Bengaluru-based residential and commercial design practice. We believe great interiors are quiet, considered and built to last — pairing modern luxury with the warmth of home.
        </p>
      </section>

      <section className="container-luxe pb-20">
        <div className="grid gap-2 sm:grid-cols-2">
          <img src={officeImg} alt="Walnut workspace" loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover" />
          <img src={bedroomImg} alt="Serene suite" loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover sm:mt-16" />
        </div>
      </section>

      <section className="container-luxe py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Our philosophy</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Design that ages well.</h2>
          </div>
          <div className="space-y-5 text-foreground/85">
            <p>We design with restraint. Every material, every joinery detail, every lighting decision is chosen to feel right today and ten years from now.</p>
            <p>Our process is collaborative — your home should reflect how you actually live, not a generic template. We listen first, design second.</p>
            <p>From concept to handover, the same in-house team designs and builds your space. One studio. One standard. One accountable team.</p>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-cream md:py-28">
        <div className="container-luxe grid gap-12 md:grid-cols-3">
          {[
            { t: "Considered", d: "Every decision earns its place." },
            { t: "Crafted", d: "Premium materials, expert hands." },
            { t: "Committed", d: "On time. On budget. On standard." },
          ].map((v) => (
            <div key={v.t}>
              <h3 className="font-display text-3xl text-gold">{v.t}</h3>
              <p className="mt-3 text-cream/75">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <div className="rounded-sm border border-border p-10 md:p-16">
          <h2 className="font-display text-3xl md:text-4xl">Ready to start your project?</h2>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-sm bg-ink px-7 py-4 text-xs uppercase tracking-[0.25em] text-cream hover:bg-gold hover:text-ink">
            Book a Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}