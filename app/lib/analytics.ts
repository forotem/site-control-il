// Lightweight GA4 event helper. Safe to call anywhere on the client:
// no-ops when gtag isn't loaded (dev, or no NEXT_PUBLIC_GA_MEASUREMENT_ID).
type EventParams = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

type Item = { item_id: string; item_name?: string; item_brand?: string; item_category?: string; price?: number; quantity: number };

// Conversion events used across the site.
// WhatsApp / phone clicks are tracked globally by components/SiteTracking.tsx (click delegation),
// so individual links don't need their own onClick.
export const track = {
  whatsapp: (location: string) => trackEvent('contact_whatsapp', { location }),
  phone: (location: string) => trackEvent('contact_phone', { location }),
  /** טופס ליד נשלח. אותו אירוע (generate_lead, כבר מיובא כהמרה) לכל הטפסים; lead_type מבדיל: install / category_quote / contact */
  formSubmit: (leadType: string, category?: string, leadId?: string) =>
    trackEvent('generate_lead', { method: 'contact_form', lead_type: leadType, category: category || '', lead_id: leadId || '' }),
  /** הזמנה מהעגלה נשלחה בהצלחה (אין תשלום באתר, זו בקשת הזמנה) */
  orderRequest: (ref: string, value: number, items: Item[]) =>
    trackEvent('purchase_request', { transaction_id: ref, value, currency: 'ILS', items }),
  addToCart: (items: Item[], value?: number) =>
    trackEvent('add_to_cart', { currency: 'ILS', value: value ?? items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0), items }),
  /** הלקוח השאיר טלפון בצ'אט של העוזר בחנות */
  chatLead: (intent?: string) => trackEvent('chat_lead', { method: 'store_chat', intent: intent || '' }),
};
