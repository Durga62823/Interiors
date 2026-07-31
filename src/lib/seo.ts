/**
 * SEO utility — pure DOM manipulation functions.
 * Works in a Vite SPA (client-side rendering).
 * Called via useEffect — no server-side rendering required.
 */

/** Update the document <title> tag */
export function setTitle(title: string): void {
  if (typeof document !== 'undefined') {
    document.title = title;
  }
}

/** Update or create a <meta name="..."> tag */
export function setMeta(name: string, content: string): void {
  if (typeof document === 'undefined' || !content) return;
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Update or create a <meta property="og:..."> tag */
export function setOGMeta(property: string, content: string): void {
  if (typeof document === 'undefined' || !content) return;
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Update or create a <link rel="canonical"> tag */
export function setCanonical(url: string): void {
  if (typeof document === 'undefined' || !url) return;
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

export interface SeoConfig {
  /** Browser tab title. Shown in Google results. 50–60 chars ideal. */
  title?: string;
  /** Short description. Shown in Google results. 150–160 chars ideal. */
  description?: string;
  /** OG title (shared on social). Falls back to title. */
  ogTitle?: string;
  /** OG description. Falls back to description. */
  ogDescription?: string;
  /** OG image URL — shown when shared on WhatsApp/Facebook. Min 1200×630px. */
  ogImage?: string;
  /** Twitter card type. Defaults to 'summary_large_image'. */
  twitterCard?: string;
  /** Canonical URL for this page */
  canonical?: string;
}

/**
 * Apply all SEO meta tags at once.
 * Call this inside a useEffect on each page.
 */
export function applySeo(config: SeoConfig): void {
  if (config.title) setTitle(config.title);
  if (config.description) setMeta('description', config.description);

  // Open Graph
  setOGMeta('og:title', config.ogTitle || config.title || '');
  setOGMeta('og:description', config.ogDescription || config.description || '');
  if (config.ogImage) setOGMeta('og:image', config.ogImage);
  setOGMeta('og:type', 'website');

  // Twitter
  setMeta('twitter:card', config.twitterCard || 'summary_large_image');
  setMeta('twitter:title', config.ogTitle || config.title || '');
  setMeta('twitter:description', config.ogDescription || config.description || '');
  if (config.ogImage) setMeta('twitter:image', config.ogImage);

  // Canonical
  if (config.canonical) setCanonical(config.canonical);
}
