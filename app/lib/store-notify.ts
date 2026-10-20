// התראות לצוות מהחנות (שאלה שהעוזר לא ידע לענות, ליד, הזמנה מהעגלה).
// ערוץ ראשי: ווצאפ דרך GreenAPI (אם מוגדרים GREEN_ID_INSTANCE + GREEN_API_TOKEN ב-Vercel).
// בנוסף תמיד: מייל דרך Resend (RESEND_API_KEY) כארכיון וכגיבוי. אם אין אף אחד, נכתב ללוג בלבד.

// רותם 5.10.2026: "פתחתי קבוצה בווצאפ. כל מה שקשור ל-Site-Control רק לשם". ההתראות לקבוצה "site-control-il"
// (רותם + המספר העסקי), ולא לצ'אט של רותם עם עצמו. מ-20.10.2026 גם רלי בקבוצה (ההתראות של טל מגיעות אליה).
export const SC_GROUP = process.env.STORE_ALERT_GROUP || "120363430960512323@g.us";
const ALERT_EMAIL = process.env.STORE_ALERT_EMAIL || "info@site-control-il.com";

/** מספר נייד ישראלי בפורמט בינלאומי (9725XXXXXXXX), או null אם זה לא נייד */
export function israeliMobile(phone: string): string | null {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "972" + d.slice(1);
  return /^9725\d{8}$/.test(d) ? d : null;
}

/** עידן (טלרן, היבואן של Reolink): הזמנות מאומתות נשלחות אליו לבדיקת מלאי ו"תפירת" העסקה (רותם 1.10.2026) */
export const IDAN_WA = process.env.SUPPLIER_WHATSAPP || "972544932440";
/** אלי ("אלי בית המתקין", מכירות בסניף פ"ת של טלרן). רותם 7.10.2026: "לפעמים עידן לא עונה אז אלי עונה לי" */
export const ELI_WA = "972522507900";
/** קבוצת ההזמנות מול הספק ("רותם גולן הזמנות - site -control": רותם, עידן ואלי). רותם 7.10.2026: "זה קבוצה שיהיה
 *  מסודר לעבודה, כאן אני ישאל על דברים באתר שלי. כל מה שקשור לשאלות מלאי, מחירים וכו'". מעכשיו שאלות מלאי/מחיר
 *  והזמנות לספק יוצאות לכאן ולא לצ'אט הפרטי של עידן. זו לא SC_GROUP (הקבוצה הפנימית של רותם עם המספר העסקי). */
export const SUPPLIER_GROUP = process.env.SUPPLIER_GROUP || "120363414108578558@g.us";

/** מספר בפורמט בינלאומי או קבוצה (@g.us) -> chatId של GreenAPI */
const chatIdOf = (to: string) => (/@g\.us$/.test(to) ? to : `${to.replace(/\D/g, "")}@c.us`);

/** שני קווי ווצאפ (רותם 20.10.2026: "קניתי טלפון עם סים ומספר טלפון שיהיה הפרדה. יש לי עובדת חדשה בשם רלי"):
 *  - "customer": הקו של רלי (050-8277907), כל מה שהלקוח רואה: טל, כפתורי הווצאפ באתר, הודעות פתיחה, קודי אימות והודעות הזמנה.
 *    GREEN_CUSTOMER_ID_INSTANCE + GREEN_CUSTOMER_API_TOKEN (+ GREEN_CUSTOMER_API_URL / GREEN_CUSTOMER_MEDIA_URL).
 *  - "ops": המספר העסקי של רותם (050-2256866), העבודה הפנימית: קבוצת ההתראות, קבוצת ההזמנות מול עידן, דוח המחירים,
 *    ומערכת הלידים של TimelapseIT. GREEN_ID_INSTANCE + GREEN_API_TOKEN, כמו קודם.
 *  כל עוד הקו של רלי לא מוגדר ב-Vercel, "customer" נופל ל-"ops" (בדיוק ההתנהגות שהייתה עד עכשיו). */
export type Line = "customer" | "ops";
export const CUSTOMER_WA = process.env.CUSTOMER_LINE_WHATSAPP || "972508277907"; // הקו של רלי
export const OPS_WA = process.env.STORE_ALERT_WHATSAPP || "972502256866"; // המספר העסקי של רותם

type Creds = { id: string; token: string; api: string; media: string; line: Line };
const credsOf = (id: string | undefined, token: string | undefined, url: string | undefined, media: string | undefined, line: Line): Creds | null => {
  if (!id || !token) return null;
  const api = (url || `https://${id.slice(0, 4)}.api.greenapi.com`).replace(/\/$/, "");
  return { id, token, api, media: (media || api.replace(".api.", ".media.")).replace(/\/$/, ""), line };
};
const opsCreds = () => credsOf(process.env.GREEN_ID_INSTANCE, process.env.GREEN_API_TOKEN, process.env.GREEN_API_URL, process.env.GREEN_MEDIA_URL, "ops");
const customerOwnCreds = () => credsOf(process.env.GREEN_CUSTOMER_ID_INSTANCE, process.env.GREEN_CUSTOMER_API_TOKEN, process.env.GREEN_CUSTOMER_API_URL, process.env.GREEN_CUSTOMER_MEDIA_URL, "customer");
/** הקו של רלי מוגדר בנפרד (ולא נופל למספר של רותם) */
export const customerLineReady = () => Boolean(customerOwnCreds());
/** פרטי החיבור של קו. "customer" בלי הגדרה נפרדת = המספר של רותם */
export const greenCreds = (line: Line = "ops"): Creds | null => (line === "customer" ? customerOwnCreds() || opsCreds() : opsCreds());
/** מספר הטלפון של הקו בפועל (אחרי הנפילה ל-ops) */
export const lineNumber = (line: Line) => (greenCreds(line)?.line === "customer" ? CUSTOMER_WA : OPS_WA);

/** קריאה ל-GreenAPI עם הפרטים שב-Vercel. null אם לא מוגדר או נכשל. query: פרמטרים ל-GET (למשל minutes). line: איזה קו */
export async function greenApi<T = Record<string, unknown>>(method: string, body?: unknown, query?: Record<string, string | number>, line: Line = "ops"): Promise<T | null> {
  const c = greenCreds(line);
  if (!c) return null;
  try {
    const qs = query ? `?${new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)]))}` : "";
    // cache: "no-store": בלי זה Next.js שומר תשובות GET (כמו lastIncomingMessages) ומחזיר אותן ישנות.
    // כך נוצר באג ב-2.10: ליד חדש מהאתר לא נקלט לטבלה במשך שעתיים.
    const res = await fetch(`${c.api}/waInstance${c.id}/${method}/${c.token}${qs}`, body === undefined ? { cache: "no-store" } : {
      cache: "no-store",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return (await res.json()) as T;
    // 7.10.2026: getChatHistory של קבוצת ההזמנות נכשל בלי שום סימן למה. ללוג: הסטטוס ותחילת התשובה (בלי ה-URL, יש בו טוקן)
    console.warn(`greenapi ${c.line} ${method} HTTP ${res.status}`, (await res.text().catch(() => "")).slice(0, 300));
    return null;
  } catch (e) {
    console.error(`greenapi ${c.line} ${method} failed`, e);
    return null;
  }
}

/** הודעת ווצאפ. ברירת מחדל מהמספר העסקי של רותם (ops); ללקוחות: line="customer". מחזיר את מזהה ההודעה, או null */
export async function sendWhatsAppId(to: string, message: string, line: Line = "ops"): Promise<string | null> {
  const r = await greenApi<{ idMessage?: string }>("sendMessage", { chatId: chatIdOf(to), message }, undefined, line);
  return r?.idMessage || null;
}

/** הודעת ווצאפ (GreenAPI). מחזיר true אם נשלחה */
export async function sendWhatsApp(to: string, message: string, line: Line = "ops"): Promise<boolean> {
  return Boolean(await sendWhatsAppId(to, message, line));
}

/** סטטוס הודעה יוצאת: sent / delivered / read, או null. to: מספר או קבוצה (@g.us, הזמנות לקבוצת הספק מ-7.10.2026) */
export async function messageStatus(to: string, idMessage: string, line: Line = "ops"): Promise<string | null> {
  const r = await greenApi<{ statusMessage?: string }>("getMessage", { chatId: chatIdOf(to), idMessage }, undefined, line);
  return r?.statusMessage || null;
}

/** מייל לצוות בלבד (Resend ל-info@), בלי ווצאפ: רשומות שהכלים המקומיים קוראים אחר כך מ-Gmail (למשל wa-ref,
 *  7.10.2026), ולא דברים שרותם צריך לראות בקבוצה. true אם נשלח */
export async function sendTeamEmail(subject: string, text: string, opts?: { replyTo?: string }): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    for (const from of ["Site-Control <noreply@site-control-il.com>", "onboarding@resend.dev"]) {
      const r = await resend.emails.send({ from, to: ALERT_EMAIL, subject, text, ...(opts?.replyTo ? { replyTo: opts.replyTo } : {}) });
      if (!r.error) return true;
    }
  } catch (e) {
    console.error("store-notify email failed", e);
  }
  return false;
}

export async function notifyTeam(subject: string, text: string, opts?: { replyTo?: string }): Promise<{ whatsapp: boolean; email: boolean }> {
  const out = { whatsapp: false, email: false };
  out.whatsapp = Boolean(await sendWhatsAppId(SC_GROUP, `${subject}\n\n${text}`));
  // מייל תמיד (לא רק כגיבוי): ארכיון של כל ליד ב-info@, גם כשהווצאפ עבד
  out.email = await sendTeamEmail(subject, text, opts);
  if (!out.whatsapp && !out.email) console.warn("store-notify: no channel configured", subject, text.slice(0, 200));
  return out;
}
