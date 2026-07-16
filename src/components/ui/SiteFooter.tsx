import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpg";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="NSS Home Designs" className="h-11 w-11 rounded-sm object-cover" />
            <span className="font-display text-xl">NSS Home Designs</span>
          </div>
          <p className="mt-4 text-sm italic text-gold/90">Designing Dreams, Building Better Homes</p>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Interiors & woodwork crafted with care — modular furniture, kitchens, doors and complete home solutions.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-sm border border-cream/15 hover:border-gold hover:text-gold transition"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-sm border border-cream/15 hover:border-gold hover:text-gold transition"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-gold">Explore</h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-gold">Portfolio</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-gold">Services</h4>
          <ul className="mt-5 space-y-3 text-sm text-cream/80">
            <li>Interior Design</li>
            <li>Modular Furniture</li>
            <li>Modular Kitchens</li>
            <li>Doors & Woodwork</li>
            <li>Complete Home Solutions</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-gold">Studio</h4>
          <ul className="mt-5 space-y-3 text-sm text-cream/80">
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> Bengaluru, Karnataka</li>
            <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> +91 98000 00000</li>
            <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> hello@nsshomedesigns.in</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-luxe flex flex-col items-start justify-between gap-3 py-6 text-xs text-cream/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} NSS Home Designs. All rights reserved.</p>
          <p className="tracking-wide">Designed with intention in Bengaluru.</p>
        </div>
      </div>
    </footer>
  );
}