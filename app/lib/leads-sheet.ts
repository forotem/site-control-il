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
/** הטבלה מחוברת (LEADS_SHEET_URL + LEADS_SHEET_SECRET ב-Vercel) */
export const sheetReady = () => Boolean(cfg());

async function call<T>(payload: Record<string, unknown>, timeoutMs: number): Promise<T | null> {
  // ניסיון שני אחד כשגוגל מחזיר דף שגיאה במקום JSON (קורה ב-Web App מדי פעם, גם אחרי שהפעולה רצה). בטוח: upsert לפי
  // טלפון, handler קריאה בלבד, reserve/release עם rid
  const deadline = Date.now() + timeoutMs;
  const first = await callOnce<T>(payload, timeoutMs);
  if (first !== null) return first;
  const left = deadline - Date.now();
  return left > 1500 ? callOnce<T>(payload, left) : null;
}

async function callOnce<T>(payload: Record<string, unknown>, timeoutMs: number): Promise<T | null> {
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
    const j = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
    if (!j || j.error) { console.warn("leads-sheet", payload.action, j?.error || "not json"); return null; }
    return j;
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

/** תפיסת מקום בתקרת הודעות הפתיחה, נעולה ב-Apps Script (LockService) ומשותפת לכל המופעים של Vercel.
 *  ok=false + reason ("day" / "ip") = אין מקום. null = הטבלה לא ענתה */
export type OpeningReservation = { ok: boolean; reason?: string; day?: string; hour?: string; ip?: string; rid?: string };
export async function sheetReserveOpening(o: { ip: string; perDay: number; perIpHour: number }, timeoutMs = 6000): Promise<OpeningReservation | null> {
  // rid: ניסיון חוזר (call) לא סופר פעמיים
  const rid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const r = await call<OpeningReservation>({ action: "reserve", rid, ...o }, timeoutMs);
  return r && typeof r.ok === "boolean" ? { ...r, rid } : null;
}
/** החזרת המקום כשהפתיחה לא נשלחה בסוף (פעם אחת לפי rid) */
export async function sheetReleaseOpening(r: OpeningReservation, timeoutMs = 3000): Promise<void> {
  await call({ action: "release", rid: r.rid, day: r.day, hour: r.hour, ip: r.ip }, timeoutMs);
}

/** מי מטפל בליד לפי העמודה "מי מטפל" שרלי שולטת בה: "רלי" = טל לא עונה; "טל" = טל עונה גם אחרי שרלי כתבה, עד שהיא
 *  כותבת שוב בשיחה (at = מתי העמודה שונתה, מילישניות); "" = לפי ברירת המחדל. null = לא הצלחנו לבדוק (הטבלה מחוברת אבל
 *  לא ענתה בזמן): הבוט נזהר. כשהטבלה לא מחוברת בכלל: { handler: "", at: 0 }. */
export async function sheetHandler(phone: string): Promise<{ handler: Handler; at: number } | null> {
  if (!cfg()) return { handler: "", at: 0 };
  const r = await call<{ handler?: string; at?: number }>({ action: "handler", phone }, 6000);
  if (!r || typeof r.handler !== "string") return null;
  const h = r.handler.trim();
  return { handler: h === "טל" || h === "רלי" ? h : "", at: Number(r.at) || 0 };
}
