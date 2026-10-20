// טבלת הלידים של רלי (Google Sheets). רותם 20.10.2026: "הלידים מגיעים לרלי. והכל מתעדכן בטבלה", והגיליון של רלי
// מחליף את טבלת הלידים הקיימת. הכתיבה עוברת דרך Apps Script שמחובר לגיליון (automation/leads-sheet/Code.gs),
// שפורסם כ-Web App: LEADS_SHEET_URL + LEADS_SHEET_SECRET ב-Vercel, אותו סוד ב-Script Properties של הסקריפט.
// שורה אחת לכל טלפון: ליד חדש נוסף, ליד קיים מתעדכן (העמודות של רלי, כמו סטטוס והערות, לא נדרסות).
// בלי ההגדרות (או כשגוגל לא עונה) לא קורה כלום: הטבלה היא תיעוד, היא אף פעם לא עוצרת ליד.

export type LeadRow = {
  phone: string;
  name?: string;
  /** מאיפה הגיע: טופס התקנה, הצ'אט בחנות, כפתור ווצאפ באתר, פייסבוק... */
  source?: string;
  /** מה הלקוח ביקש במילים שלו (מהטופס / הצ'אט) */
  need?: string;
  /** מה טל הבין עד עכשיו (lead_summary) */
  tal?: string;
  /** אפיון: איש מקצוע / לקוח קצה, והתקנה */
  leadType?: string;
  /** מצב אוטומטי: פתיחה נשלחה, טל בשיחה, טל צריך את רלי, מוכן לקנות, הזמנה... */
  status?: string;
  /** הודעת הפתיחה: נשלחה / לא נשלחה ולמה */
  opening?: string;
  /** מס' פנייה (SCW-... / L-... / הזמנה) */
  ref?: string;
  email?: string;
  city?: string;
  page?: string;
  /** ההודעה האחרונה של הלקוח */
  lastMessage?: string;
};

export type Handler = "טל" | "רלי" | "";

const cfg = () => {
  const url = process.env.LEADS_SHEET_URL;
  const secret = process.env.LEADS_SHEET_SECRET;
  return url && secret ? { url, secret } : null;
};

async function call<T>(payload: Record<string, unknown>, timeoutMs: number): Promise<T | null> {
  const c = cfg();
  if (!c) return null;
  try {
    // Apps Script עונה ב-302 לכתובת googleusercontent, ו-fetch ממשיך אליה לבד
    const res = await fetch(c.url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, secret: c.secret }),
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) { console.warn("leads-sheet HTTP", res.status); return null; }
    return (await res.json()) as T;
  } catch (e) {
    console.warn("leads-sheet failed", e instanceof Error ? e.message : e);
    return null;
  }
}

const tidy = (row: LeadRow): LeadRow =>
  Object.fromEntries(Object.entries(row).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => [k, String(v).replace(/[\r\t]+/g, " ").slice(0, 1500)])) as LeadRow;

/** הוספה או עדכון של שורת ליד לפי טלפון. true אם נכתב */
export async function sheetUpsert(row: LeadRow, timeoutMs = 6000): Promise<boolean> {
  const r = await call<{ ok?: boolean }>({ action: "upsert", row: tidy(row) }, timeoutMs);
  return Boolean(r?.ok);
}

/** מי מטפל בליד לפי העמודה "מי מטפל" שרלי שולטת בה: "רלי" = טל לא עונה, "טל" = טל עונה גם אחרי שרלי כתבה, "" = לפי ברירת המחדל */
export async function sheetHandler(phone: string): Promise<Handler> {
  const r = await call<{ handler?: string }>({ action: "handler", phone }, 3500);
  const h = String(r?.handler || "").trim();
  return h === "טל" || h === "רלי" ? h : "";
}
