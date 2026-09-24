// מקור הגעה של הגולש (first touch): נשמר פעם אחת כשמגיעים לאתר עם gclid / UTM / מפנה חיצוני,
// ונשלח עם טופס, הזמנה וצ'אט כדי שבהתראה לצוות יהיה כתוב אם הליד הגיע מ-Google Ads.
const KEY = 'sc-attribution';
const TTL_DAYS = 90;

export type Attribution = {
  source: string; // "google_ads" | "google" | "facebook" | utm_source | referrer host | "direct"
  medium?: string;
  campaign?: string;
  term?: string;
  gclid?: boolean;
  landing: string;
  at: number;
};

function detect(): Attribution | null {
  const url = new URL(window.location.href);
  const q = url.searchParams;
  const landing = url.pathname;
  const at = Date.now();
  const gclid = q.get('gclid') || q.get('gbraid') || q.get('wbraid');
  const utm = (k: string) => q.get(`utm_${k}`)?.slice(0, 80) || undefined;
  if (gclid) return { source: 'google_ads', medium: 'cpc', campaign: utm('campaign'), term: utm('term'), gclid: true, landing, at };
  if (utm('source')) return { source: utm('source')!, medium: utm('medium'), campaign: utm('campaign'), term: utm('term'), landing, at };
  if (q.get('fbclid')) return { source: 'facebook', medium: 'paid_or_social', landing, at };
  try {
    const ref = document.referrer ? new URL(document.referrer).hostname : '';
    if (ref && ref !== url.hostname) {
      const host = ref.replace(/^www\./, '');
      const source = /(^|\.)google\./.test(host) ? 'google' : /facebook|instagram/.test(host) ? 'facebook' : host;
      return { source, medium: 'referral', landing, at };
    }
  } catch {}
  return null;
}

/** נקרא פעם אחת בכל טעינת דף. שומר מקור חדש רק אם אין כבר מקור בתוקף, חוץ מ-Google Ads שתמיד גובר. */
export function captureAttribution() {
  if (typeof window === 'undefined') return;
  try {
    const found = detect();
    const current = getAttribution();
    if (found && (!current || found.gclid)) localStorage.setItem(KEY, JSON.stringify(found));
    else if (!current) localStorage.setItem(KEY, JSON.stringify({ source: 'direct', landing: window.location.pathname, at: Date.now() }));
  } catch {}
}

export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const a = JSON.parse(localStorage.getItem(KEY) || 'null') as Attribution | null;
    if (!a || Date.now() - a.at > TTL_DAYS * 864e5) return null;
    return a;
  } catch { return null; }
}
