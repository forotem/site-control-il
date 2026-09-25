// מקור הגעה של הגולש (first touch): נשמר פעם אחת כשמגיעים לאתר עם gclid / UTM / מפנה חיצוני,
// ונשלח עם טופס, הזמנה וצ'אט כדי שבהתראה לצוות יהיה כתוב אם הליד הגיע מ-Google Ads או ממודעה במטא.
// מזהה הקליק (gclid / gbraid / wbraid, או fbclid של מטא) נשמר כמחרוזת, כדי שאפשר יהיה לדווח על ליד שהפך לעסקה (המרות אופליין).
const KEY = 'sc-attribution';
const TTL_DAYS = 90;

export type ClickIdType = 'gclid' | 'gbraid' | 'wbraid' | 'fbclid';

export type Attribution = {
  source: string; // "google_ads" | "google" | "facebook" | utm_source | referrer host | "direct"
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string; // utm_content (בקמפיינים: מזהה קבוצת המודעות)
  utmId?: string; // utm_id (בקמפיינים: מזהה הקמפיין)
  gclid?: boolean; // נשאר לתאימות עם רשומות ישנות: true = הגיע ממודעה
  paid?: boolean; // מודעה ממומנת שאינה של גוגל, לפי utm_medium (במטא: utm_medium=paid_social)
  clickId?: string;
  clickIdType?: ClickIdType;
  landing: string;
  at: number;
};

function detect(): Attribution | null {
  const url = new URL(window.location.href);
  const q = url.searchParams;
  const landing = url.pathname;
  const at = Date.now();
  const utm = (k: string) => q.get(`utm_${k}`)?.slice(0, 80) || undefined;
  const utms = { campaign: utm('campaign'), term: utm('term'), content: utm('content'), utmId: utm('id') };
  const types: ClickIdType[] = ['gclid', 'gbraid', 'wbraid'];
  const clickIdType = types.find((t) => q.get(t));
  if (clickIdType) {
    const clickId = (q.get(clickIdType) || '').replace(/[^\w-]/g, '').slice(0, 200);
    return { source: 'google_ads', medium: 'cpc', ...utms, gclid: true, clickId, clickIdType, landing, at };
  }
  const fbclid = (q.get('fbclid') || '').replace(/[^\w-]/g, '').slice(0, 500); // fbclid ארוך יותר מ-gclid
  const fb = fbclid ? { clickId: fbclid, clickIdType: 'fbclid' as const } : {};
  if (utm('source')) {
    const medium = utm('medium');
    const paid = /^(cpc|ppc|paid|paid_social)$/i.test(medium || '') || undefined;
    return { source: utm('source')!, medium, ...utms, paid, ...fb, landing, at };
  }
  if (fbclid) return { source: 'facebook', medium: 'paid_or_social', ...fb, landing, at };
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

/** נקרא פעם אחת בכל טעינת דף. שומר מקור חדש רק אם אין כבר מקור בתוקף, חוץ ממודעה ממומנת (Google Ads או מטא) שתמיד גוברת. */
export function captureAttribution() {
  if (typeof window === 'undefined') return;
  try {
    const found = detect();
    const current = getAttribution();
    if (found && (!current || found.gclid || found.paid)) localStorage.setItem(KEY, JSON.stringify(found));
    else if (!current) localStorage.setItem(KEY, JSON.stringify({ source: 'direct', landing: window.location.pathname, at: Date.now() }));
  } catch {}
}

export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const a = JSON.parse(localStorage.getItem(KEY) || 'null') as Attribution | null;
    if (!a) return null;
    if (Date.now() - a.at > TTL_DAYS * 864e5) { localStorage.removeItem(KEY); return null; }
    return a;
  } catch { return null; }
}
