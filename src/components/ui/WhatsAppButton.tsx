import { MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

export function WhatsAppButton() {
  const { data: settings } = useSettings();

  // Use settings whatsapp number if set, otherwise use fallback
  const whatsapp = settings?.whatsapp || '919800000000';
  // Strip non-digits for the wa.me link
  const waNumber = whatsapp.replace(/\D/g, '');
  const waUrl = `https://wa.me/${waNumber}?text=Hi%20Neeli%20Home%20Designs%2C%20I%27d%20like%20to%20discuss%20a%20project.`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 hidden h-14 w-14 place-items-center rounded-full bg-gold text-ink shadow-[0_15px_40px_-10px_oklch(0.78_0.13_80/0.7)] transition-transform hover:scale-105 md:bottom-8 md:right-8 md:grid"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}