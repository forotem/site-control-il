// התראות לצוות מהחנות (שאלה שהעוזר לא ידע לענות, ליד, הזמנה מהעגלה).
// ערוץ ראשי: ווצאפ דרך GreenAPI (אם מוגדרים GREEN_ID_INSTANCE + GREEN_API_TOKEN ב-Vercel).
// בנוסף תמיד: מייל דרך Resend (RESEND_API_KEY) כארכיון וכגיבוי. אם אין אף אחד, נכתב ללוג בלבד.

const ALERT_WA = process.env.STORE_ALERT_WHATSAPP || "972502256866"; // המספר העסקי של רותם
const ALERT_EMAIL = process.env.STORE_ALERT_EMAIL || "info@site-control-il.com";

/** מספר נייד ישראלי בפורמט בינלאומי (9725XXXXXXXX), או null אם זה לא נייד */
export function israeliMobile(phone: string): string | null {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "972" + d.slice(1);
  return /^9725\d{8}$/.test(d) ? d : null;
}

/** עידן (טלרן, היבואן של Reolink): הזמנות מאומתות נשלחות אליו לבדיקת מלאי ו"תפירת" העסקה (רותם 1.10.2026) */
export const IDAN_WA = process.env.SUPPLIER_WHATSAPP || "972544932440";

/** קריאה ל-GreenAPI עם הפרטים שב-Vercel. null אם לא מוגדר או נכשל. query: פרמטרים ל-GET (למשל minutes) */
export async function greenApi<T = Record<string, unknown>>(method: string, body?: unknown, query?: Record<string, string | number>): Promise<T | null> {
  const id = process.env.GREEN_ID_INSTANCE;
  const token = process.env.GREEN_API_TOKEN;
  if (!id || !token) return null;
  try {
    const base = (process.env.GREEN_API_URL || `https://${id.slice(0, 4)}.api.greenapi.com`).replace(/\/$/, "");
    const qs = query ? `?${new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)]))}` : "";
    // cache: "no-store": בלי זה Next.js שומר תשובות GET (כמו lastIncomingMessages) ומחזיר אותן ישנות.
    // כך נוצר באג ב-2.10: ליד חדש מהאתר לא נקלט לטבלה במשך שעתיים.
    const res = await fetch(`${base}/waInstance${id}/${method}/${token}${qs}`, body === undefined ? { cache: "no-store" } : {
      cache: "no-store",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch (e) {
    console.error(`greenapi ${method} failed`, e);
    return null;
  }
}

/** הודעת ווצאפ מהמספר העסקי. מחזיר את מזהה ההודעה, או null אם לא נשלחה */
export async function sendWhatsAppId(to: string, message: string): Promise<string | null> {
  const r = await greenApi<{ idMessage?: string }>("sendMessage", { chatId: `${to.replace(/\D/g, "")}@c.us`, message });
  return r?.idMessage || null;
}

/** הודעת ווצאפ מהמספר העסקי (GreenAPI). מחזיר true אם נשלחה */
export async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  return Boolean(await sendWhatsAppId(to, message));
}

/** סטטוס הודעה יוצאת: sent / delivered / read, או null */
export async function messageStatus(to: string, idMessage: string): Promise<string | null> {
  const r = await greenApi<{ statusMessage?: string }>("getMessage", { chatId: `${to.replace(/\D/g, "")}@c.us`, idMessage });
  return r?.statusMessage || null;
}

export async function notifyTeam(subject: string, text: string, opts?: { replyTo?: string }): Promise<{ whatsapp: boolean; email: boolean }> {
  const out = { whatsapp: false, email: false };
  out.whatsapp = await sendWhatsApp(ALERT_WA, `${subject}\n\n${text}`);
  // מייל תמיד (לא רק כגיבוי): ארכיון של כל ליד ב-info@, גם כשהווצאפ עבד
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      for (const from of ["Site-Control <noreply@site-control-il.com>", "onboarding@resend.dev"]) {
        const r = await resend.emails.send({ from, to: ALERT_EMAIL, subject, text, ...(opts?.replyTo ? { replyTo: opts.replyTo } : {}) });
        if (!r.error) { out.email = true; break; }
      }
    } catch (e) {
      console.error("store-notify email failed", e);
    }
  }
  if (!out.whatsapp && !out.email) console.warn("store-notify: no channel configured", subject, text.slice(0, 200));
  return out;
}
