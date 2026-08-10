import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Upload, CheckCircle2, X, Sofa, BedDouble, ChefHat, Bath, Briefcase, Home, Tv, BookOpen } from "lucide-react";
import { createLead } from "@/mock-api/leads";
import { getStoredUTM } from "@/lib/utm";
import { applySeo } from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/redesign")({ component: RedesignPage });

// ── Data ────────────────────────────────────────────────────────────────────

const roomTypes = [
  { id: "living", label: "Living Room", icon: Sofa },
  { id: "bedroom", label: "Bedroom", icon: BedDouble },
  { id: "kitchen", label: "Kitchen", icon: ChefHat },
  { id: "bathroom", label: "Bathroom", icon: Bath },
  { id: "office", label: "Home Office", icon: Briefcase },
  { id: "entire", label: "Entire Home", icon: Home },
  { id: "dining", label: "Dining Room", icon: Tv },
  { id: "study", label: "Study / Library", icon: BookOpen },
];

const currentStyleOptions = [
  "Old / Outdated",
  "Too Dark / Gloomy",
  "Poor Space Utilisation",
  "No Particular Style",
  "Builder's Grade Finishes",
  "Cluttered / No Storage",
  "Wrong Colour Palette",
  "Damaged / Worn Out",
];

const designStyles = [
  {
    id: "modern",
    label: "Modern",
    desc: "Clean lines, neutral palette, functional",
    gradient: "from-slate-900 to-slate-600",
  },
  {
    id: "contemporary",
    label: "Contemporary",
    desc: "Current trends, bold accents, mixed textures",
    gradient: "from-zinc-800 to-zinc-500",
  },
  {
    id: "minimalist",
    label: "Minimalist",
    desc: "Less is more — only what matters",
    gradient: "from-stone-900 to-stone-500",
  },
  {
    id: "luxury",
    label: "Luxury",
    desc: "Premium materials, statement pieces, grandeur",
    gradient: "from-amber-900 to-yellow-700",
  },
  {
    id: "scandinavian",
    label: "Scandinavian",
    desc: "Warm whites, natural wood, cosy hygge",
    gradient: "from-sky-900 to-sky-600",
  },
  {
    id: "industrial",
    label: "Industrial",
    desc: "Raw concrete, exposed metal, urban edge",
    gradient: "from-neutral-900 to-neutral-600",
  },
  {
    id: "bohemian",
    label: "Bohemian",
    desc: "Layered textures, rich colours, eclectic mix",
    gradient: "from-rose-900 to-orange-700",
  },
  {
    id: "classic",
    label: "Classic Indian",
    desc: "Rich wood tones, traditional patterns, warmth",
    gradient: "from-emerald-900 to-emerald-600",
  },
];

const budgets = [
  { id: "1-3L", label: "₹1 – 3 Lakhs", desc: "Refresh" },
  { id: "3-6L", label: "₹3 – 6 Lakhs", desc: "Renovation" },
  { id: "6-10L", label: "₹6 – 10 Lakhs", desc: "Transformation" },
  { id: "10L+", label: "₹10 Lakhs+", desc: "Full Redesign" },
];

const timelines = [
  { id: "1mo", label: "Within 1 Month" },
  { id: "3mo", label: "1–3 Months" },
  { id: "6mo", label: "3–6 Months" },
  { id: "flexible", label: "Flexible / No Rush" },
];

// ── Component ────────────────────────────────────────────────────────────────

function RedesignPage() {
  const [step, setStep] = useState(0); // 0,1,2 = wizard; 3 = done
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [rooms, setRooms] = useState<string[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [desiredStyle, setDesiredStyle] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    applySeo({
      title: "Design Reconstruction — Transform Your Space | Neeli's Design Studio",
      description:
        "Upload photos of your existing space and tell us what you want changed. Our designers will reconstruct and reimagine your rooms from scratch.",
      ogTitle: "Redesign & Reconstruct Your Space",
      ogDescription: "Upload your current room photos and get a personalised transformation plan.",
    });
  }, []);

  const toggleRoom = (id: string) =>
    setRooms((p) => (p.includes(id) ? p.filter((r) => r !== id) : [...p, id]));

  const toggleProblem = (p: string) =>
    setProblems((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadPhoto = async (): Promise<string> => {
    if (!photoFile) return "";
    setUploading(true);
    try {
      const ext = photoFile.name.split(".").pop();
      const path = `redesign/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("redesign-photos").upload(path, photoFile, { upsert: true });
      if (error) { console.warn("Photo upload failed:", error.message); return ""; }
      const { data } = supabase.storage.from("redesign-photos").getPublicUrl(path);
      return data.publicUrl;
    } catch { return ""; }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error("Name and phone are required"); return; }
    setSubmitting(true);
    try {
      const photoUrl = await uploadPhoto();
      const utm = getStoredUTM();
      const roomLabels = rooms.map((r) => roomTypes.find((x) => x.id === r)?.label).filter(Boolean).join(", ");
      const styleLabel = designStyles.find((s) => s.id === desiredStyle)?.label || desiredStyle;

      await createLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        service: "Design Reconstruction",
        budget: budget,
        message: [
          `Rooms: ${roomLabels || "Not specified"}`,
          `Current issues: ${problems.join(", ") || "Not specified"}`,
          `Desired style: ${styleLabel || "Not specified"}`,
          `Timeline: ${timeline || "Flexible"}`,
          form.notes ? `Notes: ${form.notes}` : "",
          photoUrl ? `Photo: ${photoUrl}` : "",
        ].filter(Boolean).join(" | "),
        ...utm,
      } as any);

      setStep(3);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedStep0 = rooms.length > 0;
  const canProceedStep1 = !!desiredStyle && !!budget;

  const stepTitles = [
    "Tell us about your space",
    "Your vision",
    "Your details",
  ];

  return (
    <SiteLayout>
      <section className="container-luxe pt-36 pb-12 md:pt-44 md:pb-12">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Design Reconstruction</p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1.05] md:text-6xl">
          Your space,{" "}
          <span className="italic text-gold-gradient">reimagined</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          Unhappy with your current space? Share photos and describe what you want changed — our designers will reconstruct it from scratch into something extraordinary.
        </p>
      </section>

      {step < 3 ? (
        <section className="container-luxe pb-24 max-w-4xl">
          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <button
                    onClick={() => step > i && setStep(i)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      i < step
                        ? "bg-gold text-ink cursor-pointer"
                        : i === step
                        ? "bg-ink text-cream"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </button>
                  {i < 2 && (
                    <div className={`h-px w-16 transition-colors ${i < step ? "bg-gold" : "bg-border"}`} />
                  )}
                </div>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">{stepTitles[step]}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Step 0: Space Details ── */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-10"
              >
                {/* Room type */}
                <div>
                  <h2 className="font-display text-2xl mb-2">Which rooms need redesigning?</h2>
                  <p className="text-sm text-muted-foreground mb-5">Select all that apply.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {roomTypes.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => toggleRoom(id)}
                        className={`flex flex-col items-center gap-3 rounded-sm border p-5 text-sm transition-all ${
                          rooms.includes(id)
                            ? "border-gold bg-gold/5 text-gold"
                            : "border-border hover:border-gold/40"
                        }`}
                      >
                        <Icon className="h-6 w-6" strokeWidth={1.25} />
                        <span className="text-center text-xs leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current problems */}
                <div>
                  <h2 className="font-display text-2xl mb-2">What's wrong with it now?</h2>
                  <p className="text-sm text-muted-foreground mb-5">What bothers you most? Pick all that fit.</p>
                  <div className="flex flex-wrap gap-2">
                    {currentStyleOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleProblem(opt)}
                        className={`rounded-sm border px-4 py-2 text-sm transition-all ${
                          problems.includes(opt)
                            ? "border-gold bg-gold/5 text-gold"
                            : "border-border hover:border-gold/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo upload */}
                <div>
                  <h2 className="font-display text-2xl mb-2">Upload a photo of your current space</h2>
                  <p className="text-sm text-muted-foreground mb-5">Helps our designers understand the starting point. Optional but recommended.</p>

                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img src={photoPreview} alt="Your space" className="h-64 w-full max-w-lg rounded-sm object-cover border border-border" />
                      <button
                        onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}
                        className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-cream shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex h-48 w-full max-w-lg flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed border-border text-muted-foreground hover:border-gold/60 hover:text-gold transition-colors"
                    >
                      <Upload className="h-8 w-8" strokeWidth={1.25} />
                      <span className="text-sm">Click to upload (JPG, PNG, max 10MB)</span>
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={!canProceedStep0}
                  className="inline-flex items-center gap-2 rounded-sm bg-ink px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-cream hover:bg-gold hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next — Your Vision <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {/* ── Step 1: Vision ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-10"
              >
                {/* Design style */}
                <div>
                  <h2 className="font-display text-2xl mb-2">What style inspires you?</h2>
                  <p className="text-sm text-muted-foreground mb-5">Choose the aesthetic you'd like your redesigned space to have.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {designStyles.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setDesiredStyle(s.id)}
                        className={`group relative overflow-hidden rounded-sm border p-5 text-left transition-all ${
                          desiredStyle === s.id ? "border-gold ring-1 ring-gold" : "border-border hover:border-gold/40"
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-${desiredStyle === s.id ? '30' : '10'} group-hover:opacity-25 transition-opacity`} />
                        <div className="relative">
                          <p className="font-display text-sm font-medium">{s.label}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground leading-snug">{s.desc}</p>
                        </div>
                        {desiredStyle === s.id && (
                          <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-gold" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <h2 className="font-display text-2xl mb-2">What's your budget?</h2>
                  <p className="text-sm text-muted-foreground mb-5">We'll tailor the reconstruction plan to what's realistic.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {budgets.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setBudget(b.id)}
                        className={`rounded-sm border p-5 text-left transition-all ${
                          budget === b.id ? "border-gold bg-gold/5" : "border-border hover:border-gold/40"
                        }`}
                      >
                        <p className={`font-display text-lg ${budget === b.id ? "text-gold" : ""}`}>{b.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h2 className="font-display text-2xl mb-2">When do you want to start?</h2>
                  <div className="flex flex-wrap gap-3">
                    {timelines.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTimeline(t.id)}
                        className={`rounded-sm border px-5 py-3 text-sm transition-all ${
                          timeline === t.id ? "border-gold bg-gold/5 text-gold" : "border-border hover:border-gold/40"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(0)}
                    className="inline-flex items-center gap-2 rounded-sm border border-border px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] hover:border-gold hover:text-gold transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="inline-flex items-center gap-2 rounded-sm bg-ink px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-cream hover:bg-gold hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next — Your Details <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Contact ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="font-display text-2xl mb-2">Let's get in touch</h2>
                    <p className="text-sm text-muted-foreground mb-5">
                      One of our designers will review your submission and call you within 24 hours with a personalised reconstruction plan.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-wider text-muted-foreground">Full Name *</label>
                        <input
                          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required placeholder="Priya Sharma"
                          className="mt-1 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-muted-foreground">Phone *</label>
                        <input
                          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          required placeholder="+91 98765 43210" type="tel"
                          className="mt-1 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
                      <input
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="priya@example.com" type="email"
                        className="mt-1 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground">Anything else you'd like us to know?</label>
                      <textarea
                        value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={4} placeholder="e.g. I want to keep the existing sofa but change everything else..."
                        className="mt-1 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
                      />
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        type="button" onClick={() => setStep(1)}
                        className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] hover:border-gold hover:text-gold transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-ink hover:bg-ink hover:text-cream disabled:opacity-50 transition-colors"
                      >
                        {submitting || uploading ? "Submitting..." : "Submit Redesign Request"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </form>

                  {/* Summary sidebar */}
                  <div className="rounded-sm bg-ink text-cream p-7 h-fit space-y-5">
                    <h3 className="font-display text-xl">Your brief</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-cream/40 mb-1">Rooms</p>
                        <p className="text-cream/80">{rooms.map((r) => roomTypes.find((x) => x.id === r)?.label).join(", ") || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-cream/40 mb-1">Current issues</p>
                        <p className="text-cream/80">{problems.join(", ") || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-cream/40 mb-1">Desired style</p>
                        <p className="text-cream/80 text-gold">{designStyles.find((s) => s.id === desiredStyle)?.label || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-cream/40 mb-1">Budget</p>
                        <p className="text-cream/80">{budgets.find((b) => b.id === budget)?.label || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-cream/40 mb-1">Timeline</p>
                        <p className="text-cream/80">{timelines.find((t) => t.id === timeline)?.label || "Flexible"}</p>
                      </div>
                      {photoPreview && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-cream/40 mb-2">Your space</p>
                          <img src={photoPreview} alt="" className="w-full rounded-sm object-cover aspect-video" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      ) : (
        // ── Success state ──
        <section className="container-luxe pb-24 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-sm bg-ink text-cream p-12 text-center space-y-6"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
              <CheckCircle2 className="h-10 w-10 text-gold" />
            </div>
            <h2 className="font-display text-4xl">We've got your brief!</h2>
            <p className="text-cream/70 max-w-md mx-auto">
              Our design team will review your space photos and requirements and reach out within <strong className="text-cream">24 hours</strong> with a personalised reconstruction plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <a href="/" className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] text-ink hover:bg-cream transition-colors">
                Back to Home
              </a>
              <a href="/portfolio" className="inline-flex items-center justify-center gap-2 rounded-sm border border-cream/20 px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] hover:border-gold hover:text-gold transition-colors">
                View Our Work
              </a>
            </div>
          </motion.div>
        </section>
      )}

      {/* How it works section */}
      {step === 0 && (
        <section className="container-luxe pb-24">
          <div className="border-t border-border pt-16">
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold mb-4">How it works</p>
            <div className="grid gap-8 sm:grid-cols-4">
              {[
                { n: "01", title: "Upload your space", body: "Share photos of your current room so we understand the starting point — dimensions, layout, and existing elements." },
                { n: "02", title: "Tell us your vision", body: "Pick your preferred style, set your budget, and describe what you want changed, removed, or kept." },
                { n: "03", title: "Designer consultation", body: "A dedicated designer calls you within 24 hours to discuss the scope, materials, and a reconstruction timeline." },
                { n: "04", title: "See the transformation", body: "We present 3D renders of your reconstructed space before a single nail is hammered. You approve, we execute." },
              ].map((s) => (
                <div key={s.n} className="space-y-3">
                  <span className="font-display text-5xl text-gold/20">{s.n}</span>
                  <h3 className="font-display text-xl">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
