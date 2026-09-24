// התראות לצוות מהחנות (שאלה שהעוזר לא ידע לענות, ליד, הזמנה מהעגלה).
// ערוץ ראשי: ווצאפ דרך GreenAPI (אם מוגדרים GREEN_ID_INSTANCE + GREEN_API_TOKEN ב-Vercel).
// בנוסף תמיד: מייל דרך Resend (RESEND_API_KEY) כארכיון וכגיבוי. אם אין אף אחד, נכתב ללוג בלבד.

const ALERT_WA = process.env.STORE_ALERT_WHATSAPP || "972502256866"; // המספר העסקי של רותם
const ALERT_EMAIL = process.env.STORE_ALERT_EMAIL || "info@site-control-il.com";

export async function notifyTeam(subject: string, text: string, opts?: { replyTo?: string }): Promise<{ whatsapp: boolean; email: boolean }> {
  const out = { whatsapp: false, email: false };
  const id = process.env.GREEN_ID_INSTANCE;
  const token = process.env.GREEN_API_TOKEN;
  if (id && token) {
    try {
      const base = process.env.GREEN_API_URL || `https://${id.slice(0, 4)}.api.greenapi.com`;
      const res = await fetch(`${base}/waInstance${id}/sendMessage/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: `${ALERT_WA.replace(/\D/g, "")}@c.us`, message: `${subject}\n\n${text}` }),
      });
      out.whatsapp = res.ok;
    } catch (e) {
      console.error("store-notify whatsapp failed", e);
    }
  }
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
