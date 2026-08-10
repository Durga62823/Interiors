import { useEffect, useState, useRef } from "react";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { createLead } from "@/mock-api/leads";
import { getStoredUTM } from "@/lib/utm";
import { toast } from "sonner";

const POPUP_DELAY_MS = 10 * 1000; // 2 minutes

const SERVICES = [
  "Interior Design",
  "Modular Kitchens",
  "Wardrobes & Storage",
  "Residential & Commercial",
  "Turnkey Solutions",
  "Other",
];

export function ConsultationPopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, POPUP_DELAY_MS);
  };

  useEffect(() => {
    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    // Re-schedule if the user hasn't submitted
    if (!submitted) {
      scheduleNext();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createLead({
        name: (fd.get("name") as string) || "",
        phone: (fd.get("phone") as string) || "",
        email: "",
        service: (fd.get("service") as string) || "",
        budget: "",
        location: "",
        message: "Submitted via consultation popup.",
        status: "new",
        ...getStoredUTM(),
      });
      setSubmitted(true);
      toast.success("We'll be in touch soon!");
      // Hide after 3s on success and never re-show
      setTimeout(() => setVisible(false), 3000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Free Consultation"
        className="fixed inset-x-4 bottom-4 z-[101] mx-auto max-w-md overflow-hidden rounded-sm border border-gold/30 bg-ink shadow-2xl animate-in slide-in-from-bottom-4 duration-400 md:inset-x-auto md:right-6 md:bottom-6 md:left-auto md:w-full"
      >
        {/* Gold accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-gold/20 via-gold to-gold/20" />

        <div className="p-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-gold">
                  Free Consultation
                </p>
              </div>
              <h2 className="mt-2 font-display text-2xl text-cream leading-snug">
                Let's Design Your<br />
                <span className="italic text-gold">Dream Space</span>
              </h2>
              <p className="mt-1.5 text-xs text-cream/60 leading-relaxed">
                Share your details — our team will call you back within a few hours.
              </p>
            </div>
            <button
              onClick={dismiss}
              aria-label="Close popup"
              className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-cream/15 text-cream/50 transition hover:border-gold/40 hover:text-gold"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {submitted ? (
            <div className="mt-6 flex items-center gap-4 rounded-sm border border-gold/30 bg-gold/10 px-5 py-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/20 text-gold text-base">
                ✓
              </span>
              <div>
                <p className="font-display text-base text-cream">
                  We'll be in touch soon!
                </p>
                <p className="mt-0.5 text-xs text-cream/60">
                  Our team typically responds within a few hours.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              {/* Name */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-cream/50 mb-1.5">
                  Your Name
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-sm border border-cream/20 bg-ink/80 px-3 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition focus:border-gold"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-cream/50 mb-1.5">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="+91 96526 34477"
                  className="w-full rounded-sm border border-cream/20 bg-ink/80 px-3 py-2.5 text-sm text-cream placeholder:text-cream/30 outline-none transition focus:border-gold"
                />
              </div>

              {/* Service */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-cream/50 mb-1.5">
                  Interested In
                </label>
                <select
                  name="service"
                  className="w-full rounded-sm border border-cream/20 bg-ink/80 px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold"
                >
                  <option value="">Select a service…</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-ink transition hover:bg-cream disabled:opacity-60"
              >
                {loading ? "Sending…" : "Get a Free Callback"}
                {!loading && (
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                )}
              </button>

              <p className="text-center text-[10px] text-cream/35">
                No spam. We'll only contact you about your project.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
