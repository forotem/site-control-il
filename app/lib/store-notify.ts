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

/** הודעת ווצאפ מהמספר העסקי (GreenAPI). מחזיר true אם נשלחה */
export async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  const id = process.env.GREEN_ID_INSTANCE;
  const token = process.env.GREEN_API_TOKEN;
  if (!id || !token) return false;
  try {
    const base = process.env.GREEN_API_URL || `https://${id.slice(0, 4)}.api.greenapi.com`;
    const res = await fetch(`${base}/waInstance${id}/sendMessage/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: `${to.replace(/\D/g, "")}@c.us`, message }),
    });
    return res.ok;
  } catch (e) {
    console.error("store-notify whatsapp failed", e);
    return false;
  }
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
