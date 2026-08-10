import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Linkedin, Youtube, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useSettings } from "@/hooks/use-settings";

export function SiteFooter() {
  const { data: settings } = useSettings();

  const phone = settings?.phone || '+91 96526 34477';
  const email = settings?.email || 'neelisdesignstudio@gmail.com';
  const address = settings?.address || 'Hyderabad / Bengaluru';
  const companyName = settings?.companyName || "Neeli's Design Studio";
  const tagline = settings?.tagline || 'Designing Spaces, Inspiring Lives';
  const instagramUrl = settings?.social?.instagram || '#';
  const facebookUrl = settings?.social?.facebook || '#';
  const linkedinUrl = settings?.social?.linkedin || '#';
  const youtubeUrl = settings?.social?.youtube || '#';

  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            {settings?.logo ? (
              <img src={settings.logo} alt={companyName} className="h-11 w-11 rounded-sm object-cover" />
            ) : (
              <img src={logo} alt={companyName} className="h-11 w-11 rounded-sm object-cover" />
            )}
            <span className="font-display text-xl">{companyName}</span>
          </div>
          <p className="mt-4 text-sm italic text-gold/90">{tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Transforming your dreams into beautiful, functional and timeless spaces — from concept to completion.
          </p>
          <div className="mt-5 flex gap-3">
            {instagramUrl && instagramUrl !== '#' && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-sm border border-cream/15 hover:border-gold hover:text-gold transition">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {facebookUrl && facebookUrl !== '#' && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-sm border border-cream/15 hover:border-gold hover:text-gold transition">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {linkedinUrl && linkedinUrl !== '#' && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-sm border border-cream/15 hover:border-gold hover:text-gold transition">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {youtubeUrl && youtubeUrl !== '#' && (
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="grid h-9 w-9 place-items-center rounded-sm border border-cream/15 hover:border-gold hover:text-gold transition">
                <Youtube className="h-4 w-4" />
              </a>
            )}
            {/* Fallback icons when no social links set */}
            {(!instagramUrl || instagramUrl === '#') && (!facebookUrl || facebookUrl === '#') && (
              <>
                <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-sm border border-cream/15 hover:border-gold hover:text-gold transition"><Instagram className="h-4 w-4" /></a>
                <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-sm border border-cream/15 hover:border-gold hover:text-gold transition"><Facebook className="h-4 w-4" /></a>
              </>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-gold">Explore</h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/" className="text-cream/80 hover:text-gold transition-colors">Home</Link></li>
            <li><Link to="/about" className="text-cream/80 hover:text-gold transition-colors">About Us</Link></li>
            <li><Link to="/services" className="text-cream/80 hover:text-gold transition-colors">Services</Link></li>
            <li><Link to="/portfolio" className="text-cream/80 hover:text-gold transition-colors">Portfolio</Link></li>
            <li><Link to="/blog" className="text-cream/80 hover:text-gold transition-colors">Blog</Link></li>
            <li><Link to="/contact" className="text-cream/80 hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-gold">Our Services</h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/services" className="text-cream/80 hover:text-gold transition-colors">Interior Design</Link></li>
            <li><Link to="/services" className="text-cream/80 hover:text-gold transition-colors">Modular Kitchens</Link></li>
            <li><Link to="/services" className="text-cream/80 hover:text-gold transition-colors">Wardrobes &amp; Storage</Link></li>
            <li><Link to="/redesign" className="text-cream/80 hover:text-gold transition-colors">Design Reconstruction</Link></li>
            <li><Link to="/estimate" className="text-cream/80 hover:text-gold transition-colors">Cost Estimator</Link></li>
            <li><Link to="/services" className="text-cream/80 hover:text-gold transition-colors">Turnkey Solutions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.3em] text-gold">Studio</h4>
          <ul className="mt-5 space-y-3 text-sm text-cream/80">
            {address && (
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {address}</li>
            )}
            {phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`tel:${phone}`} className="hover:text-gold transition">{phone}</a>
              </li>
            )}
            {email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={`mailto:${email}`} className="hover:text-gold transition">{email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-luxe flex flex-col items-start justify-between gap-3 py-6 text-xs text-cream/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <p className="tracking-wide">Designing Spaces, Inspiring Lives.</p>
        </div>
      </div>
    </footer>
  );
}