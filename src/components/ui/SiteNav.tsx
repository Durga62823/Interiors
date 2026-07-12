import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container-luxe grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4 md:py-5">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="NSS Home Designs" className="h-11 w-11 shrink-0 rounded-sm object-cover" />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-none tracking-wide">NSS Home Designs</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Interiors & Woodwork</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-gold [&.active]:text-gold"
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="rounded-sm bg-ink px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold hover:text-ink"
          >
            Get a Quote
          </Link>
        </nav>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(v => !v)}
          className="md:hidden grid h-10 w-10 place-items-center rounded-sm border border-border bg-background/60"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-500 ${
          open ? "max-h-[80vh]" : "max-h-0"
        }`}
      >
        <nav className="container-luxe flex flex-col gap-1 pb-6 pt-2">
          {links.map(l => (
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
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 rounded-sm bg-ink px-5 py-4 text-center text-xs font-medium uppercase tracking-[0.25em] text-cream"
          >
            Book a Free Consultation
          </Link>
        </nav>
      </div>
    </header>
  );
}