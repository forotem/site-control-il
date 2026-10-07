// קוד פנייה בכפתורי הווצאפ (רותם 7.10.2026, אחרי העסקה הראשונה SC-018: "מאיפה רון הגיע? ידוע רק שהיה בדף המוצר").
// קישורי wa.me לא נושאים gclid/fbclid/UTM, אז בכל לחיצה על קישור ווצאפ באתר: (1) נוצר קוד SCW-XXXXXX ונוסף לסוף ההודעה
// הממולאת כשורה "מס' פנייה: SCW-XXXXXX", (2) הקוד נשלח ל-/api/wa-ref עם הדף, הכפתור, ה-UTM, gclid/fbclid, המפנה ומקור
// ההגעה השמור (first touch). כשההודעה מגיעה לווצאפ, הכלי המקומי מחבר את הקוד למקור, וכך העסקה הבאה מדידה.
// נקרא מ-components/SiteTracking.tsx (האזנה גלובלית לקליקים בשלב ה-capture), כך שגם קישורים סטטיים (הכפתור הצף,
// קומפוננטות שרת) מקבלים קוד בלי onClick בכל קישור: ה-href מעודכן לפני שהדפדפן מנווט אליו.
import { getAttribution } from './attribution';
import { WA_REF_ALPHABET, WA_REF_LABEL, WA_REF_RE } from './site-wa-prefills';

const WA_HOSTS = /^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i;
/** פתיחה לקישור ווצאפ בלי טקסט ממולא, כדי שההודעה לא תהיה רק שורת הקוד (מזוהה ב-site-wa-prefills) */
const DEFAULT_TEXT = 'היי, הגעתי מהאתר';

export const isWhatsAppHref = (href: string) => WA_HOSTS.test(href);

/** קוד פנייה חדש: SCW- + 6 תווים מהאלפבית בלי O/0/I/1 (256 מתחלק ב-32, אז ההגרלה אחידה) */
export function makeWaRef(): string {
  const bytes = new Uint8Array(6);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  let s = '';
  for (const b of bytes) s += WA_REF_ALPHABET[b % WA_REF_ALPHABET.length];
  return `SCW-${s}`;
}

/** הקישור עם שורת הקוד בסוף הטקסט (קוד קודם, אם היה, מוחלף), או null אם זה לא קישור ווצאפ.
 *  הטקסט מקודד ב-encodeURIComponent (רווח = %20) ולא ב-URLSearchParams (רווח = +), כי ווצאפ מציג "+" כפלוס. */
export function hrefWithWaRef(href: string, code: string): string | null {
  if (!isWhatsAppHref(href)) return null;
  let url: URL;
  try { url = new URL(href); } catch { return null; }
  const current = (url.searchParams.get('text') || '').replace(new RegExp(`\\s*${WA_REF_LABEL}\\s*${WA_REF_RE.source}\\s*$`), '').trim();
  const text = `${current || DEFAULT_TEXT}\n${WA_REF_LABEL} ${code}`;
  url.searchParams.delete('text');
  const rest = url.searchParams.toString();
  url.search = '';
  url.hash = '';
  return `${url.toString()}?${rest ? `${rest}&` : ''}text=${encodeURIComponent(text)}`;
}

/** שולח את הקוד והמקור לשרת, בלי לחכות (sendBeacon שורד גם כשהדף נסגר) */
export function reportWaRef(code: string, originalHref: string, button: string) {
  if (typeof window === 'undefined') return;
  try {
    const q = new URL(window.location.href).searchParams;
    const pick = (k: string) => q.get(k)?.slice(0, 200) || undefined;
    let text = '';
    try { text = (new URL(originalHref).searchParams.get('text') || '').slice(0, 300); } catch {}
    const payload = {
      code,
      page: window.location.pathname.slice(0, 200),
      button: button.slice(0, 80),
      text,
      utm_source: pick('utm_source'),
      utm_medium: pick('utm_medium'),
      utm_campaign: pick('utm_campaign'),
      utm_content: pick('utm_content'),
      gclid: pick('gclid') || pick('gbraid') || pick('wbraid'),
      fbclid: pick('fbclid'),
      ref: (document.referrer || '').slice(0, 300),
      attribution: getAttribution(),
    };
    const body = JSON.stringify(payload);
    if (typeof navigator.sendBeacon === 'function' && navigator.sendBeacon('/api/wa-ref', new Blob([body], { type: 'application/json' }))) return;
    fetch('/api/wa-ref', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => undefined);
  } catch {}
}
