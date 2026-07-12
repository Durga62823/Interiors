import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Hammer, PencilRuler, Sparkles, Quote, Check } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import kitchenImg from "@/assets/portfolio-kitchen.jpg";
import bedroomImg from "@/assets/portfolio-bedroom.jpg";
import officeImg from "@/assets/portfolio-office.jpg";
import wardrobeImg from "@/assets/portfolio-wardrobe.jpg";
import ceilingImg from "@/assets/portfolio-ceiling.jpg";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NSS Home Designs — Interiors & Woodwork" },
      { name: "description", content: "NSS Home Designs — interior design, modular furniture, modular kitchens, doors & woodwork, and complete home solutions." },
      { property: "og:title", content: "NSS Home Designs — Interiors & Woodwork" },
      { property: "og:description", content: "Designing Dreams, Building Better Homes." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Home,
});

const services = [
  { icon: PencilRuler, title: "Interior Design", desc: "Considered residential interiors tailored to how you live." },
  { icon: Hammer, title: "Modular Kitchens", desc: "Ergonomic, durable kitchens with premium hardware and finishes." },
  { icon: Sparkles, title: "Modular Furniture", desc: "Wardrobes, storage and bespoke furniture built to your inch." },
  { icon: Award, title: "Doors & Woodwork", desc: "Custom doors, panelling and joinery, master-crafted in our workshop." },
];

const projects = [
  { img: kitchenImg, title: "Onyx Kitchen", tag: "Modular Kitchen" },
  { img: bedroomImg, title: "Serene Suite", tag: "Master Bedroom" },
  { img: officeImg, title: "Walnut Workspace", tag: "Workspace Interior" },
  { img: wardrobeImg, title: "Atelier Wardrobe", tag: "Modular Wardrobe" },
  { img: ceilingImg, title: "Luminous Ceiling", tag: "Ceiling & Lighting" },
  { img: heroImg, title: "Noir Living", tag: "Living Room" },
];

const process = [
  { n: "01", t: "Consultation", d: "We listen to your vision, lifestyle and budget." },
  { n: "02", t: "Design", d: "3D concepts and material palettes tailored to you." },
  { n: "03", t: "Build", d: "Premium materials, expert craftsmanship, on schedule." },
  { n: "04", t: "Handover", d: "Walkthrough, styling and a beautifully finished space." },
];

const testimonials = [
  { quote: "NSS Home Designs transformed our apartment into something we never imagined possible. Detail-obsessed in the best way.", name: "Ananya R.", where: "Homeowner" },
  { quote: "From the modular kitchen to the wardrobes — flawless craftsmanship and on-time delivery. Highly recommended.", name: "Rohit & Meera", where: "Homeowners" },
  { quote: "Our space finally reflects who we are. The team listened, designed and delivered beyond expectations.", name: "Vikram S.", where: "Client" },
];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-cream">
        <img
          src={heroImg}
          alt="Interior crafted by NSS Home Designs"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.08_0.01_60/0.55)_0%,oklch(0.08_0.01_60/0.4)_40%,oklch(0.08_0.01_60/0.9)_100%)]" />
        <div className="relative z-10 container-luxe flex min-h-[100svh] flex-col justify-end pb-16 pt-32 md:pb-24 md:pt-40">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">NSS Home Designs · Interiors & Woodwork</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl">
            Designing dreams, <span className="italic text-gold-gradient">building better homes</span>.
          </h1>
          <p className="mt-6 max-w-xl text-base text-cream/80 md:text-lg">
            Complete home solutions — interior design, modular furniture, modular kitchens, and bespoke doors & woodwork.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-3 rounded-sm bg-gold px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] text-ink transition-all hover:bg-cream"
            >
              Book a Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center gap-3 rounded-sm border border-cream/30 px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] text-cream backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST METRICS */}
      <section className="border-y border-border bg-background">
        <div className="container-luxe grid grid-cols-2 gap-y-10 py-12 md:grid-cols-4 md:py-16">
          {[
            { v: "150+", l: "Spaces Designed" },
            { v: "10+", l: "Years Combined Craft" },
            { v: "98%", l: "On-Time Handover" },
            { v: "5★", l: "Avg. Client Rating" },
          ].map((m) => (
            <div key={m.l} className="px-2 text-center md:border-l md:border-border md:first:border-l-0">
              <div className="font-display text-4xl text-foreground md:text-5xl">{m.v}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{m.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-luxe py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">What we do</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              A full-service interior studio.
            </h2>
            <p className="mt-5 text-muted-foreground">
              From single rooms to turnkey homes and offices — every project is crafted end-to-end by our in-house team.
            </p>
            <Link to="/services" className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-foreground hover:text-gold">
              Explore all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-px overflow-hidden rounded-sm bg-border sm:grid-cols-2">
            {services.map((s) => (
              <div key={s.title} className="group bg-card p-8 transition-colors hover:bg-ink hover:text-cream">
                <s.icon className="h-7 w-7 text-gold" strokeWidth={1.25} />
                <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground group-hover:text-cream/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="bg-secondary/50 py-20 md:py-28">
        <div className="container-luxe">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Selected work</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">Recent projects</h2>
            </div>
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] hover:text-gold">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((p) => (
              <figure key={p.title} className="group overflow-hidden rounded-sm bg-card shadow-[var(--shadow-soft)]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                </div>
                <figcaption className="flex items-start justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xl">{p.title}</h3>
                    <p className="mt-1 truncate text-xs uppercase tracking-[0.2em] text-muted-foreground">{p.tag}</p>
                  </div>
                  <span className="mt-1 shrink-0 text-gold"><ArrowRight className="h-4 w-4" /></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container-luxe py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <img src={bedroomImg} alt="Crafted bedroom interior" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute -bottom-6 -right-6 hidden h-40 w-40 border border-gold md:block" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Why NSS Home Designs</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              Considered design. Quiet luxury. Real craft.
            </h2>
            <ul className="mt-8 space-y-5">
              {[
                "In-house design and execution teams — single point of accountability.",
                "Premium, ethically sourced materials with transparent pricing.",
                "Fixed-cost contracts and on-time handover guarantees.",
                "10-year warranty on modular furniture and joinery.",
              ].map((t) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold text-gold">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-foreground/85">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-ink py-20 text-cream md:py-28">
        <div className="container-luxe">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Our process</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Four steps, beautifully orchestrated.
            </h2>
          </div>
          <div className="mt-14 grid gap-px bg-cream/10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.n} className="bg-ink p-8">
                <div className="font-display text-5xl text-gold/80">{p.n}</div>
                <h3 className="mt-6 font-display text-2xl">{p.t}</h3>
                <p className="mt-2 text-sm text-cream/70">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-luxe py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Kind words</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">From the people who live in them.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="flex h-full flex-col rounded-sm border border-border bg-card p-8">
              <Quote className="h-7 w-7 text-gold" />
              <p className="mt-6 grow text-foreground/85 leading-relaxed">"{t.quote}"</p>
              <footer className="mt-6 border-t border-border pt-4">
                <p className="font-display text-lg">{t.name}</p>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{t.where}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-luxe pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-sm bg-ink p-10 text-cream md:p-16">
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(60%_60%_at_80%_20%,oklch(0.78_0.13_80/0.5),transparent_60%)]" />
          <div className="relative grid items-center gap-8 md:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="font-display text-4xl leading-tight md:text-5xl">
                Let's design a space that's unmistakably yours.
              </h2>
              <p className="mt-4 max-w-xl text-cream/75">
                Book a complimentary 30-minute consultation with our design team. We'll review your space, share ideas and recommend next steps.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] text-ink hover:bg-cream">
                Book Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="https://wa.me/919800000000" className="inline-flex items-center justify-center gap-2 rounded-sm border border-cream/30 px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] hover:border-gold hover:text-gold">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}