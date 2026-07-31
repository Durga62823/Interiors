import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createLead } from "@/mock-api/leads";
import { toast } from "sonner";
import { useSettings } from "@/hooks/use-settings";
import { applySeo } from "@/lib/seo";
import { getStoredUTM } from "@/lib/utm";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const { data: settings } = useSettings();

  // Page-specific SEO — overrides the global fallback set in __root.tsx
  useEffect(() => {
    const companyName = settings?.companyName || 'NSS Home Designs';
    applySeo({
      title: `Book a Free Consultation — ${companyName}`,
      description: `Contact ${companyName} to book your complimentary interior design consultation. We respond within one business day.`,
      ogTitle: `Book a Free Consultation — ${companyName}`,
      ogDescription: 'Share your project details and our team will reach out within one business day.',
    });
  }, [settings]);

  // Pull live values from settings — fall back gracefully if not yet loaded
  const phone = settings?.phone || '+91 98000 00000';
  const whatsapp = settings?.whatsapp || '919800000000';
  const email = settings?.email || 'hello@nsshomedesigns.in';
  const address = settings?.address || 'Bengaluru, Karnataka';
  const businessHours = settings?.businessHours || 'Mon — Sat · 10:00 – 19:00';

  // Build WhatsApp URL — strip non-digits and prepend 91 if needed
  const waNumber = whatsapp.replace(/\D/g, '');
  const waUrl = `https://wa.me/${waNumber}?text=Hi%20NSS%20Home%20Designs%2C%20I%27d%20like%20to%20discuss%20a%20project.`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await createLead({
        name: formData.get('name') as string || '',
        phone: formData.get('phone') as string || '',
        email: formData.get('email') as string || '',
        service: formData.get('service') as string || '',
        budget: formData.get('budget') as string || '',
        location: formData.get('location') as string || '',
        message: formData.get('message') as string || '',
        preferredDate: formData.get('preferredDate') as string || undefined,
        preferredTime: formData.get('preferredTime') as string || undefined,
        status: 'new',
        // Spread UTM data captured on landing — all fields are optional
        ...getStoredUTM(),
      });
      setSent(true);
      toast.success('Your request has been submitted!');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    }
  };

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
            onSubmit={onSubmit}
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

                {/* Scheduling — optional preferred date & time */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                      Preferred Date <span className="normal-case text-muted-foreground/60">(optional)</span>
                    </label>
                    <input
                      name="preferredDate"
                      type="date"
                      min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                      className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-gold"
                    />
                  </div>
                  <Select
                    label="Preferred Time (optional)"
                    name="preferredTime"
                    options={[
                      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
                      '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
                      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
                      '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
                      '06:00 PM', '06:30 PM', '07:00 PM',
                    ]}
                  />
                </div>

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
            <ContactCard icon={Phone} title="Call" detail={phone} href={`tel:${phone.replace(/\s/g, '')}`} />
            <ContactCard icon={MessageCircle} title="WhatsApp" detail="Chat with our team" href={waUrl} />
            <ContactCard icon={Mail} title="Email" detail={email} href={`mailto:${email}`} />
            <ContactCard icon={MapPin} title="Studio" detail={address} />
            <div className="rounded-sm bg-ink p-6 text-cream">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Hours</p>
              <p className="mt-3 text-sm text-cream/80">{businessHours}</p>
            </div>

            {/* Google Maps embed — only shown when URL is set in admin settings */}
            {settings?.mapsEmbedUrl && (
              <div className="overflow-hidden rounded-sm border border-border">
                <iframe
                  src={settings.mapsEmbedUrl}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="NSS Home Designs location"
                  className="block"
                />
              </div>
            )}
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