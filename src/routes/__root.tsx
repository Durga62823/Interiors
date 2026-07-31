import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";


import { Toaster } from '@/components/ui/sonner';
import { useSettings } from '@/hooks/use-settings';
import { applySeo } from '@/lib/seo';
import { captureUTM } from '@/lib/utm';
import { loadGA4, trackPageView } from '@/lib/analytics';

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">404</p>
        <h1 className="mt-4 font-display text-5xl text-foreground">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has moved or no longer exists.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-foreground"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="max-w-2xl text-left bg-card p-8 rounded-lg border border-border shadow-lg">
        <h1 className="font-display text-3xl text-destructive font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An error occurred while rendering this page:
        </p>
        <div className="mt-4 p-4 bg-muted rounded-md overflow-auto max-h-96">
          <p className="font-mono text-sm font-semibold text-foreground">{error.message || String(error)}</p>
          {error.stack && (
            <pre className="mt-2 font-mono text-xs text-muted-foreground whitespace-pre-wrap">{error.stack}</pre>
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-sm bg-primary px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground hover:bg-foreground transition-colors"
          >
            Try again
          </button>
          <a href="/" className="rounded-sm border border-border px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-secondary transition-colors text-foreground">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function GlobalSeoInjector() {
  const { data: settings } = useSettings();
  const router = useRouter();

  // Capture UTM params from the URL on every page load.
  // Stores to sessionStorage so they survive navigation within the session.
  useEffect(() => {
    captureUTM();
  }, []);

  // Load GA4 once when the measurement ID is available from settings.
  // loadGA4() is idempotent — safe to call multiple times.
  useEffect(() => {
    const id = settings?.ga4MeasurementId;
    if (id) loadGA4(id);
  }, [settings?.ga4MeasurementId]);

  // Fire page_view on every client-side route change.
  // We use router.subscribe() so it works correctly with TanStack Router's
  // navigation model (history push, replace, back, forward).
  useEffect(() => {
    const unsubscribe = router.subscribe('onLoad', ({ toLocation }) => {
      trackPageView(toLocation.pathname);
    });
    return unsubscribe;
  }, [router]);

  // Apply global/fallback SEO from company_settings.
  // Individual pages can override this with their own useEffect.
  useEffect(() => {
    if (!settings) return;
    const seo = settings.seo || {};
    const companyName = settings.companyName || 'NSS Home Designs';
    applySeo({
      title: seo.metaTitle || companyName,
      description: seo.metaDescription || '',
      ogTitle: seo.ogTitle || seo.metaTitle || companyName,
      ogDescription: seo.ogDescription || seo.metaDescription || '',
      ogImage: seo.ogImage || '',
      twitterCard: seo.twitterCard || 'summary_large_image',
    });
  }, [settings]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalSeoInjector />
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}