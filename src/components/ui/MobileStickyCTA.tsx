import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Phone, MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * MobileStickyCTA
 *
 * A fixed bottom bar shown only on mobile (< 768px) with two actions:
 *   • Call Now  — direct tel: link to the studio's phone number
 *   • WhatsApp  — wa.me link to start a WhatsApp conversation
 *
 * Both values come from company_settings (editable in /admin/settings).
 * Hidden on the /contact page to avoid redundancy.
 * Slides up after a 1.5-second delay so it doesn't intrude on first load.
 * Hides the floating WhatsApp button on mobile (WhatsAppButton uses md:grid).
 */
export function MobileStickyCTA() {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);
  const { data: settings } = useSettings();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Slide in after a short delay — feels less intrusive than immediate pop-up
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Don't render on desktop, on /contact, or on /admin pages
  if (!isMobile) return null;
  if (pathname === "/contact") return null;
  if (pathname.startsWith("/admin")) return null;

  const phone = settings?.phone || "";
  const whatsapp = settings?.whatsapp || "";
  const waNumber = whatsapp.replace(/\D/g, "");
  const waUrl = `https://wa.me/${waNumber}?text=Hi%20Neeli%20Home%20Designs%2C%20I%27d%20like%20to%20discuss%20a%20project.`;
  const telUrl = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out ${visible ? "translate-y-0" : "translate-y-full"
        }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-2 border-t border-gold/30 bg-ink">
        {/* Call Now */}
        <a
          href={telUrl}
          className="flex items-center justify-center gap-2.5 py-4 text-xs font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold/10 active:bg-gold/20 border-r border-gold/20"
          aria-label="Call Neeli Home Designs"
        >
          <Phone className="h-4 w-4 text-gold shrink-0" />
          <span>Call Now</span>
        </a>

        {/* WhatsApp */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 py-4 text-xs font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold/10 active:bg-gold/20"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-4 w-4 text-gold shrink-0" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
