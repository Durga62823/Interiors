import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ArrowLeft, ChefHat, Sofa, BedDouble, Bath,
  UtensilsCrossed, Flower2, Sun, Home, Building2, Castle, Check
} from 'lucide-react'
import { SiteLayout } from '@/components/SiteLayout'
import { useRoomPricing } from '@/hooks/use-estimate'
import { useSettings } from '@/hooks/use-settings'
import { applySeo } from '@/lib/seo'
import { createLead } from '@/mock-api/leads'
import { getStoredUTM } from '@/lib/utm'
import { toast } from 'sonner'
import type { RoomPricing } from '@/types/admin'

export const Route = createFileRoute('/estimate')({
  component: EstimatePage,
})

// ── Property type presets ────────────────────────────────────────────────────
const propertyTypes = [
  { id: '1bhk', label: '1 BHK', icon: Home, rooms: ['Kitchen', 'Living Room', 'Bedroom', 'Bathroom'] },
  { id: '2bhk', label: '2 BHK', icon: Home, rooms: ['Kitchen', 'Living Room', 'Master Bedroom', 'Bedroom', 'Bathroom'] },
  { id: '3bhk', label: '3 BHK', icon: Building2, rooms: ['Kitchen', 'Living Room', 'Master Bedroom', 'Bedroom', 'Bedroom', 'Bathroom', 'Dining Area'] },
  { id: '4bhk', label: '4 BHK+', icon: Building2, rooms: ['Kitchen', 'Living Room', 'Master Bedroom', 'Bedroom', 'Bedroom', 'Bedroom', 'Bathroom', 'Bathroom', 'Dining Area', 'Pooja Room'] },
  { id: 'villa', label: 'Villa', icon: Castle, rooms: ['Kitchen', 'Living Room', 'Master Bedroom', 'Bedroom', 'Bedroom', 'Bedroom', 'Bathroom', 'Bathroom', 'Dining Area', 'Pooja Room', 'Balcony'] },
]

// Room icons and unique room types for the room selector
const roomIcons: Record<string, typeof Home> = {
  'Kitchen': ChefHat,
  'Living Room': Sofa,
  'Master Bedroom': BedDouble,
  'Bedroom': BedDouble,
  'Bathroom': Bath,
  'Dining Area': UtensilsCrossed,
  'Pooja Room': Flower2,
  'Balcony': Sun,
}

const allRoomTypes = ['Kitchen', 'Living Room', 'Master Bedroom', 'Bedroom', 'Bathroom', 'Dining Area', 'Pooja Room', 'Balcony']

const tiers = [
  { id: 'essential' as const, label: 'Essential', tagline: 'Smart design, quality materials', color: 'border-border' },
  { id: 'premium' as const, label: 'Premium', tagline: 'Premium finishes, 3D renders included', color: 'border-gold' },
  { id: 'luxury' as const, label: 'Luxury', tagline: 'Imported materials, bespoke everything', color: 'border-border' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

// ── Main component ──────────────────────────────────────────────────────────
function EstimatePage() {
  const { data: pricing = [], isLoading } = useRoomPricing()
  const { data: settings } = useSettings()
  const [step, setStep] = useState(0)
  const [propertyType, setPropertyType] = useState('')
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [tier, setTier] = useState<RoomPricing['qualityTier']>('premium')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const companyName = settings?.companyName || 'Neeli Home Designs'
    applySeo({
      title: `Free Interior Design Cost Estimate — ${companyName}`,
      description: `Get an instant cost estimate for your home interior design project in Bengaluru. Select rooms, choose your quality tier, and see pricing in 60 seconds.`,
      ogTitle: `Interior Design Cost Calculator — ${companyName}`,
      ogDescription: 'Free instant estimate for your home interiors. No login required.',
    })
  }, [settings])

  // When property type is selected, pre-select rooms
  const handlePropertySelect = (id: string) => {
    setPropertyType(id)
    const preset = propertyTypes.find((p) => p.id === id)
    if (preset) setSelectedRooms([...preset.rooms])
    setStep(1)
  }

  const toggleRoom = (room: string) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    )
  }

  // Calculate estimate from pricing data
  const estimate = useMemo(() => {
    if (!pricing.length || !selectedRooms.length) return { min: 0, max: 0, breakdown: [] }

    const breakdown: { room: string; min: number; max: number }[] = []

    // Count duplicates (e.g. 2 bedrooms)
    const roomCounts = new Map<string, number>()
    for (const room of selectedRooms) {
      roomCounts.set(room, (roomCounts.get(room) || 0) + 1)
    }

    let totalMin = 0
    let totalMax = 0

    for (const [room, count] of roomCounts) {
      const priceRow = pricing.find(
        (p) => p.roomType === room && p.qualityTier === tier
      )
      if (priceRow) {
        const min = priceRow.priceMin * count
        const max = priceRow.priceMax * count
        breakdown.push({ room: count > 1 ? `${room} ×${count}` : room, min, max })
        totalMin += min
        totalMax += max
      }
    }

    return { min: totalMin, max: totalMax, breakdown }
  }, [pricing, selectedRooms, tier])

  // Submit lead
  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const roomList = selectedRooms.join(', ')
    try {
      await createLead({
        name: fd.get('name') as string || '',
        phone: fd.get('phone') as string || '',
        email: fd.get('email') as string || '',
        service: 'Cost Estimate',
        budget: `${formatCurrency(estimate.min)} – ${formatCurrency(estimate.max)}`,
        location: '',
        message: `Estimator: ${propertyTypes.find(p => p.id === propertyType)?.label || propertyType} · ${tier} tier · Rooms: ${roomList}`,
        status: 'new',
        ...getStoredUTM(),
      })
      setSubmitted(true)
      toast.success('Estimate saved! We\'ll reach out shortly.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const canProceed = [
    propertyType !== '', // step 0
    selectedRooms.length > 0, // step 1
    true, // step 2 (tier always has default)
    true, // step 3
  ]

  const steps = ['Property', 'Rooms', 'Quality', 'Estimate']

  return (
    <SiteLayout>
      {/* Header */}
      <section className="container-luxe pt-36 pb-8 md:pt-44 md:pb-12">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Cost Estimator</p>
        <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[1.1] md:text-6xl">
          Your interiors, <span className="italic text-gold-gradient">priced</span>.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Get an instant ballpark estimate in under 60 seconds. No signup, no spam.
        </p>
      </section>

      {/* Progress bar */}
      <section className="container-luxe pb-10">
        <div className="flex items-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => { if (i < step) setStep(i) }}
                className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider transition-colors ${i <= step ? 'text-gold' : 'text-muted-foreground/40'
                  } ${i < step ? 'cursor-pointer hover:text-gold/80' : 'cursor-default'}`}
              >
                <span className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold transition-colors ${i < step ? 'bg-gold text-ink' : i === step ? 'border-2 border-gold text-gold' : 'border border-muted-foreground/30 text-muted-foreground/40'
                  }`}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`h-px flex-1 transition-colors ${i < step ? 'bg-gold' : 'bg-muted-foreground/20'}`} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="container-luxe pb-24">
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground animate-pulse">Loading pricing data…</div>
        ) : (
          <AnimatePresence mode="wait">
            {/* STEP 0: Property Type */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
                <h2 className="font-display text-2xl mb-6">What type of property?</h2>
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {propertyTypes.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => handlePropertySelect(pt.id)}
                      className={`group flex flex-col items-center gap-3 rounded-sm border p-6 transition-all hover:border-gold hover:shadow-md ${propertyType === pt.id ? 'border-gold bg-gold/5 shadow-md' : 'border-border bg-card'
                        }`}
                    >
                      <pt.icon className={`h-8 w-8 ${propertyType === pt.id ? 'text-gold' : 'text-muted-foreground group-hover:text-gold'}`} strokeWidth={1.25} />
                      <span className="font-display text-lg">{pt.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 1: Rooms */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
                <h2 className="font-display text-2xl mb-2">Which rooms to design?</h2>
                <p className="text-sm text-muted-foreground mb-6">We've pre-selected based on your property type. Adjust as needed.</p>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                  {allRoomTypes.map((room) => {
                    const Icon = roomIcons[room] || Home
                    const selected = selectedRooms.includes(room)
                    return (
                      <button
                        key={room}
                        onClick={() => toggleRoom(room)}
                        className={`flex items-center gap-3 rounded-sm border p-4 text-left transition-all ${selected
                            ? 'border-gold bg-gold/5 shadow-sm'
                            : 'border-border bg-card hover:border-gold/50'
                          }`}
                      >
                        <Icon className={`h-5 w-5 shrink-0 ${selected ? 'text-gold' : 'text-muted-foreground'}`} strokeWidth={1.5} />
                        <span className="text-sm font-medium">{room}</span>
                        {selected && <Check className="h-4 w-4 ml-auto text-gold" />}
                      </button>
                    )
                  })}
                </div>

                {/* Duplicate room buttons */}
                {selectedRooms.filter((r) => ['Bedroom', 'Bathroom'].includes(r)).length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {['Bedroom', 'Bathroom'].map((room) => {
                      const count = selectedRooms.filter((r) => r === room).length
                      if (count === 0) return null
                      return (
                        <div key={room} className="flex items-center gap-2 rounded-sm border border-border bg-card px-4 py-2">
                          <span className="text-sm">{room}</span>
                          <button
                            onClick={() => setSelectedRooms((prev) => { const idx = prev.lastIndexOf(room); return idx >= 0 ? prev.filter((_, i) => i !== idx) : prev })}
                            className="grid h-6 w-6 place-items-center rounded bg-muted text-xs font-bold hover:bg-destructive/20"
                          >−</button>
                          <span className="text-sm font-bold text-gold">{count}</span>
                          <button
                            onClick={() => setSelectedRooms((prev) => [...prev, room])}
                            className="grid h-6 w-6 place-items-center rounded bg-muted text-xs font-bold hover:bg-gold/20"
                          >+</button>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="mt-8 flex gap-4">
                  <button onClick={() => setStep(0)} className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-xs uppercase tracking-wider hover:border-gold">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!canProceed[1]}
                    className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 text-xs uppercase tracking-wider text-cream transition-colors hover:bg-gold hover:text-ink disabled:opacity-40"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Quality Tier */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
                <h2 className="font-display text-2xl mb-2">Choose your quality tier</h2>
                <p className="text-sm text-muted-foreground mb-6">This determines material and finish quality across all rooms.</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {tiers.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTier(t.id)}
                      className={`relative flex flex-col rounded-sm border-2 p-6 text-left transition-all ${tier === t.id
                          ? 'border-gold bg-gold/5 shadow-md'
                          : `${t.color} bg-card hover:border-gold/50`
                        }`}
                    >
                      {t.id === 'premium' && (
                        <span className="absolute -top-2.5 right-4 rounded-sm bg-gold px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest text-ink">
                          Popular
                        </span>
                      )}
                      <span className="font-display text-xl">{t.label}</span>
                      <span className="mt-1 text-sm text-muted-foreground">{t.tagline}</span>
                      {tier === t.id && <Check className="absolute top-4 right-4 h-5 w-5 text-gold" />}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex gap-4">
                  <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-xs uppercase tracking-wider hover:border-gold">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 text-xs uppercase tracking-wider text-cream transition-colors hover:bg-gold hover:text-ink"
                  >
                    See Estimate <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Result */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
                <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
                  {/* Estimate result */}
                  <div>
                    <h2 className="font-display text-2xl mb-2">Your estimated cost</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                      {propertyTypes.find((p) => p.id === propertyType)?.label} · {tier.charAt(0).toUpperCase() + tier.slice(1)} tier · {selectedRooms.length} room{selectedRooms.length > 1 ? 's' : ''}
                    </p>

                    {/* Big price range */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.4, type: 'spring' }}
                      className="rounded-sm bg-ink p-8 text-cream mb-6"
                    >
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">Estimated Range</p>
                      <p className="font-display text-4xl md:text-5xl text-gold">
                        {formatCurrency(estimate.min)} – {formatCurrency(estimate.max)}
                      </p>
                      <p className="mt-3 text-xs text-cream/50">
                        *Indicative pricing based on standard Bengaluru market rates. Final pricing depends on site visit and material selection.
                      </p>
                    </motion.div>

                    {/* Room breakdown */}
                    <div className="rounded-sm border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Room</th>
                            <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Min</th>
                            <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">Max</th>
                          </tr>
                        </thead>
                        <tbody>
                          {estimate.breakdown.map((row, i) => (
                            <tr key={i} className="border-t border-border">
                              <td className="px-4 py-3 font-medium">{row.room}</td>
                              <td className="px-4 py-3 text-right text-muted-foreground">{formatCurrency(row.min)}</td>
                              <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.max)}</td>
                            </tr>
                          ))}
                          <tr className="border-t-2 border-gold bg-gold/5">
                            <td className="px-4 py-3 font-display text-base">Total</td>
                            <td className="px-4 py-3 text-right font-display text-base">{formatCurrency(estimate.min)}</td>
                            <td className="px-4 py-3 text-right font-display text-base text-gold">{formatCurrency(estimate.max)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <button onClick={() => setStep(2)} className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
                      <ArrowLeft className="h-4 w-4" /> Change selections
                    </button>
                  </div>

                  {/* Lead capture form */}
                  <div className="rounded-sm border border-border bg-card p-6 md:p-8 self-start">
                    {submitted ? (
                      <div className="py-8 text-center">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/20 text-gold font-display text-2xl">✓</div>
                        <h3 className="mt-6 font-display text-2xl">Thank you!</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Our designer will call you within one business day with a detailed quote.
                        </p>
                        <Link to="/portfolio" className="mt-6 inline-flex items-center gap-2 text-sm text-gold hover:underline">
                          Browse our portfolio <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-display text-xl mb-1">Get an exact quote</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Share your details and a designer will call with a tailored proposal.
                        </p>
                        <form onSubmit={handleLeadSubmit} className="space-y-4">
                          <div>
                            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Full Name *</label>
                            <input name="name" required className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-gold" />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Phone *</label>
                            <input name="phone" type="tel" required className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-gold" />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Email</label>
                            <input name="email" type="email" className="w-full rounded-sm border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-gold" />
                          </div>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="group w-full inline-flex items-center justify-center gap-3 rounded-sm bg-ink px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] text-cream transition-colors hover:bg-gold hover:text-ink disabled:opacity-60"
                          >
                            {submitting ? 'Submitting…' : 'Get Detailed Quote'}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>
    </SiteLayout>
  )
}
