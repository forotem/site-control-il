// Lightweight GA4 event helper. Safe to call anywhere on the client:
// no-ops when gtag isn't loaded (dev, or no NEXT_PUBLIC_GA_MEASUREMENT_ID).
type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

// Conversion events used across the site
export const track = {
  whatsapp: (location: string) => trackEvent('contact_whatsapp', { location }),
  phone: (location: string) => trackEvent('contact_phone', { location }),
  formSubmit: (category?: string) => trackEvent('generate_lead', { method: 'contact_form', category: category || '' }),
};
