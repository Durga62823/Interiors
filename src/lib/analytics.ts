/**
 * analytics.ts — GA4 event helper
 *
 * Provides a typed wrapper around window.gtag() so we never call it
 * directly from components. All events go through trackEvent().
 *
 * GA4 is loaded dynamically by __root.tsx once settings are fetched.
 * If the GA4 ID is not configured, gtag will be undefined and all
 * calls here silently no-op.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Fire a GA4 event.
 * Safe to call even when GA4 is not loaded — silently skips if gtag is missing.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

/**
 * Fire the standard GA4 page_view event.
 * Called from __root.tsx on every route change.
 */
export function trackPageView(path: string, title?: string): void {
  trackEvent('page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Fire generate_lead — called after a successful lead form submission.
 * GA4 uses this to measure form conversion rate.
 */
export function trackGenerateLead(params?: {
  service?: string;
  budget?: string;
  source?: string;
}): void {
  trackEvent('generate_lead', {
    ...(params?.service && { service_interest: params.service }),
    ...(params?.budget && { budget_range: params.budget }),
    ...(params?.source && { lead_source: params.source }),
  });
}

/**
 * Dynamically inject the GA4 gtag.js script into <head>.
 * Called once from __root.tsx when the measurement ID becomes available.
 * Safe to call multiple times — idempotent (won't add duplicate scripts).
 */
export function loadGA4(measurementId: string): void {
  if (!measurementId || typeof window === 'undefined') return;

  // Don't inject twice
  if (document.getElementById('ga4-script')) return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    // Disable automatic page_view — we fire it manually on route change
    // so it works correctly with client-side routing (TanStack Router)
    send_page_view: false,
  });

  // Inject the external GA4 script
  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}
