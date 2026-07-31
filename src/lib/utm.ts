/**
 * utm.ts — UTM parameter capture and retrieval utility
 *
 * HOW IT WORKS:
 *   1. captureUTM() is called once from __root.tsx on every page load.
 *   2. If UTM params are present in the URL they are stored in sessionStorage.
 *   3. sessionStorage survives page navigation but is cleared when the tab is closed.
 *      This means the original traffic source is preserved across multi-page flows
 *      (e.g. user lands on /portfolio with ?utm_source=instagram, clicks through to
 *      /contact — getStoredUTM() will still return {source:'instagram', ...}).
 *   4. getStoredUTM() is called just before createLead() and spreads UTM fields
 *      directly into the lead INSERT payload.
 */

const SESSION_KEY = 'nss_utm';

export interface UtmData {
  source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}

/**
 * Maps a raw utm_source value to a clean source label
 * used in the admin panel for channel attribution.
 */
function deriveSource(utmSource: string): string {
  const s = utmSource.toLowerCase();
  if (s.includes('google'))    return 'google';
  if (s.includes('instagram')) return 'instagram';
  if (s.includes('facebook') || s.includes('fb')) return 'facebook';
  if (s.includes('whatsapp'))  return 'whatsapp';
  if (s.includes('bing'))      return 'bing';
  if (s.includes('youtube'))   return 'youtube';
  if (s === '')                 return 'direct';
  return 'other';
}

/**
 * Call this once on every page load (in __root.tsx).
 * Only writes to sessionStorage when UTM params are actually present in the URL.
 * This preserves the *first* source seen in the session.
 */
export function captureUTM(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source') || '';

  // Only capture if there are UTM params in this URL
  if (!utmSource && !params.get('utm_medium') && !params.get('utm_campaign')) return;

  const data: UtmData = {
    source:       deriveSource(utmSource),
    utm_source:   utmSource,
    utm_medium:   params.get('utm_medium')   || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term:     params.get('utm_term')     || '',
    utm_content:  params.get('utm_content')  || '',
  };

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage unavailable (private browsing edge cases) — silently skip
  }
}

/**
 * Returns the stored UTM data ready to spread into a createLead() call.
 * If nothing was ever stored (direct / organic visit), returns default values.
 */
export function getStoredUTM(): UtmData {
  const defaults: UtmData = {
    source: 'direct',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
  };

  if (typeof window === 'undefined') return defaults;

  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}
