// Lightweight GA4 + Meta Pixel event helper. Safe to call anywhere on the client:
// no-ops when gtag / fbq aren't loaded (dev, or no NEXT_PUBLIC_GA_MEASUREMENT_ID / META_PIXEL_ID).
type EventParams = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

/** אירוע סטנדרטי של מטא. eventId (מזהה ליד / הזמנה) מונע ספירה כפולה אם בעתיד נשלח את אותו אירוע גם מהשרת. */
function metaEvent(name: string, params: EventParams = {}, eventId?: string) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  if (eventId) window.fbq('track', name, params, { eventID: eventId });
  else window.fbq('track', name, params);
}

type Item = { item_id: string; item_name?: string; item_brand?: string; item_category?: string; price?: number; quantity: number };

const metaContents = (items: Item[]) => ({
  content_type: 'product',
  content_ids: items.map((i) => i.item_id),
  contents: items.map((i) => ({ id: i.item_id, quantity: i.quantity, item_price: i.price })),
});

// Conversion events used across the site.
// WhatsApp / phone clicks are tracked globally by components/SiteTracking.tsx (click delegation),
// so individual links don't need their own onClick.
export const track = {
  whatsapp: (location: string) => {
    trackEvent('contact_whatsapp', { location });
    metaEvent('Contact', { content_name: 'whatsapp', content_category: location });
  },
  phone: (location: string) => {
    trackEvent('contact_phone', { location });
    metaEvent('Contact', { content_name: 'phone', content_category: location });
  },
  /** טופס ליד נשלח. אותו אירוע (generate_lead, כבר מיובא כהמרה) לכל הטפסים; lead_type מבדיל: install / category_quote / contact */
  formSubmit: (leadType: string, category?: string, leadId?: string) => {
    trackEvent('generate_lead', { method: 'contact_form', lead_type: leadType, category: category || '', lead_id: leadId || '' });
    metaEvent('Lead', { content_name: leadType, content_category: category || '' }, leadId);
  },
  /** הזמנה מהעגלה נשלחה בהצלחה (אין תשלום באתר, זו בקשת הזמנה). במטא נשלח כ-Purchase כדי שקמפייני מכירות יוכלו לבצע אופטימיזציה עליה */
  orderRequest: (ref: string, value: number, items: Item[]) => {
    trackEvent('purchase_request', { transaction_id: ref, value, currency: 'ILS', items });
    metaEvent('Purchase', { value, currency: 'ILS', num_items: items.reduce((s, i) => s + i.quantity, 0), ...metaContents(items) }, ref);
  },
  addToCart: (items: Item[], value?: number) => {
    const total = value ?? items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
    trackEvent('add_to_cart', { currency: 'ILS', value: total, items });
    metaEvent('AddToCart', { currency: 'ILS', value: total, ...metaContents(items) });
  },
  /** הלקוח השאיר טלפון בצ'אט של העוזר בחנות */
  chatLead: (intent?: string) => {
    trackEvent('chat_lead', { method: 'store_chat', intent: intent || '' });
    metaEvent('Lead', { content_name: 'store_chat', content_category: intent || '' });
  },
};
