import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NSS Home Designs Bengaluru" },
      { name: "description", content: "Book a free consultation with NSS Home Designs — premium interior designers in Bengaluru." },
      { property: "og:title", content: "Contact — NSS Home Designs" },
      { property: "og:description", content: "Book a free consultation with our Bengaluru design studio." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <section className="container-luxe pt-36 pb-12 md:pt-44 md:pb-16">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Contact</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
          Let's design <span className="italic text-gold-gradient">together</span>.
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Share a few details about your project. Our team will reach out within one business day to schedule your complimentary consultation.
        </p>
      </section>

      <section className="container-luxe pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="rounded-sm border border-border bg-card p-6 md:p-10"
          >
            {sent ? (
              <div className="py-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/20 text-gold font-display text-2xl">✓</div>
                <h2 className="mt-6 font-display text-3xl">Thank you</h2>
                <p className="mt-2 text-muted-foreground">We've received your request and will be in touch shortly.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" name="name" required />
                  <Field label="Phone" name="phone" type="tel" required />
                </div>
                <Field label="Email" name="email" type="email" required />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select label="Service" name="service" options={["Home Interiors", "Modular Kitchen", "Wardrobes", "Office Interior", "Renovation", "Other"]} />
                  <Select label="Budget" name="budget" options={["Under ₹3L", "₹3L – ₹6L", "₹6L – ₹12L", "₹12L+", "Not sure"]} />
                </div>
                <Field label="Location / Area" name="location" placeholder="e.g. Whitefield, HSR Layout" />
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Tell us about your project</label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-sm bg-ink px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] text-cream transition-colors hover:bg-gold hover:text-ink sm:w-auto"
                >
                  Request Consultation
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </form>

          <aside className="space-y-6">
            <ContactCard icon={Phone} title="Call" detail="+91 98000 00000" href="tel:+919800000000" />
            <ContactCard icon={MessageCircle} title="WhatsApp" detail="Chat with our team" href="https://wa.me/919800000000" />
            <ContactCard icon={Mail} title="Email" detail="hello@nsshomedesigns.in" href="mailto:hello@nsshomedesigns.in" />
            <ContactCard icon={MapPin} title="Studio" detail="Bengaluru, Karnataka" />
            <div className="rounded-sm bg-ink p-6 text-cream">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Hours</p>
              <p className="mt-3 text-sm text-cream/80">Mon — Sat · 10:00 – 19:00</p>
              <p className="text-sm text-cream/80">Sunday · By appointment</p>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-gold"
      />
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{label}</label>
      <select name={name} className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-gold">
        <option value="">Select…</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ContactCard({ icon: Icon, title, detail, href }: { icon: typeof Mail; title: string; detail: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-4 rounded-sm border border-border bg-card p-5 transition-colors hover:border-gold">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-ink text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{title}</p>
        <p className="mt-1 truncate font-display text-lg">{detail}</p>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}