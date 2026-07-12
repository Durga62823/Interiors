export function reportLovableError(error: unknown, ctx?: Record<string, unknown>) {
  // Lightweight stub used until a real error-reporting service is wired.
  // Intentionally minimal to avoid adding third-party SDKs here.
  try {
    // eslint-disable-next-line no-console
    console.error("Reported error", { error, ctx });
  } catch (e) {
    // swallow
  }
}
