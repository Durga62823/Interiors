import { Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Menu, X, ChevronDown, Calculator, RefreshCcw, BookOpen, PencilRuler, ImageIcon, HelpCircle } from "lucide-react";
import logo from "@/assets/logo.jpg";

// ── Nav structure ────────────────────────────────────────────────────────────
const mainLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
] as const;

// Dropdown items under "Services"
const serviceLinks = [
  {
    to: "/services",
    label: "All Services",
    desc: "Our full range of offerings",
    icon: PencilRuler,
  },
  {
    to: "/redesign",
    label: "Design Reconstruction",
    desc: "Upload your space, we rebuild it",
    icon: RefreshCcw,
  },
  {
    to: "/estimate",
    label: "Cost Estimator",
    desc: "Get an instant price estimate",
    icon: Calculator,
  },
  {
    to: "/portfolio",
    label: "Portfolio",
    desc: "Browse completed projects",
    icon: ImageIcon,
  },
  {
    to: "/blog",
    label: "Design Blog",
    desc: "Tips, trends & inspiration",
    icon: BookOpen,
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openDropdown = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };
  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-luxe grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 md:py-5">
        {/* Logo */}
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="Neeli's Design Studio" className="h-11 w-11 shrink-0 rounded-sm object-cover" />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-none tracking-wide">Neeli's Design Studio</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Designing Spaces, Inspiring Lives</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {mainLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-gold [&.active]:text-gold"
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}

          {/* Services dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-1 text-sm tracking-wide text-foreground/80 transition-colors hover:text-gold"
            >
              Services
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown panel */}
            <div
              className={`absolute right-0 top-full mt-2 w-72 origin-top-right rounded-sm border border-border bg-background/95 backdrop-blur-md shadow-xl transition-all duration-200 ${
                dropdownOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="p-2">
                {serviceLinks.map(({ to, label, desc, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setDropdownOpen(false)}
                    className="group flex items-start gap-3 rounded-sm px-3 py-3 transition-colors hover:bg-gold/5 [&.active]:bg-gold/5"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-muted text-muted-foreground transition-colors group-hover:bg-gold/10 group-hover:text-gold">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="border-t border-border px-3 py-2.5">
                <Link
                  to="/contact"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-sm bg-ink px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold hover:text-ink"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Free Consultation
                </Link>
              </div>
            </div>
          </div>

          <Link
            to="/blog"
            className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-gold [&.active]:text-gold"
          >
            Blog
          </Link>

          <Link
            to="/contact"
            className="rounded-sm bg-ink px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold hover:text-ink"
          >
            Get a Quote
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(v => !v)}
          className="md:hidden grid h-10 w-10 place-items-center rounded-sm border border-border bg-background/60"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile full-screen menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-500 ${
          open ? "max-h-[100vh]" : "max-h-0"
        }`}
      >
        <nav className="container-luxe flex flex-col gap-1 pb-8 pt-2">
          {/* Primary links */}
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/portfolio", label: "Portfolio" },
            { to: "/contact", label: "Contact" },
          ].map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="border-b border-border/60 py-4 font-display text-2xl text-foreground transition-colors hover:text-gold [&.active]:text-gold"
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}

          {/* Services section header */}
          <p className="mt-5 mb-2 text-[10px] uppercase tracking-[0.4em] text-gold">Our Services</p>

          {serviceLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 border-b border-border/40 py-3.5 text-lg text-foreground transition-colors hover:text-gold [&.active]:text-gold"
            >
              <Icon className="h-5 w-5 text-gold/60" strokeWidth={1.5} />
              {label}
            </Link>
          ))}

          {/* Blog */}
          <Link
            to="/blog"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 border-b border-border/40 py-3.5 text-lg text-foreground transition-colors hover:text-gold [&.active]:text-gold"
          >
            <BookOpen className="h-5 w-5 text-gold/60" strokeWidth={1.5} />
            Blog
          </Link>

          {/* CTA */}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-5 rounded-sm bg-ink px-5 py-4 text-center text-xs font-medium uppercase tracking-[0.25em] text-cream hover:bg-gold hover:text-ink transition-colors"
          >
            Book a Free Consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}