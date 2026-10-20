// ליד מטופס קצר (דף ההתקנה, דפי קטגוריה, דף המבצעים, יצירת קשר): שם, טלפון ומה צריך. מייל לא חובה.
// לכל ליד מזהה L-xxxx שמופיע בהתראה לצוות ונשלח ל-GA4, כדי לחבר אחר כך ליד לעסקה בגיליון.
// 20.10.2026: כל ליד נרשם בטבלה של רלי, וטל שולח לו הודעת פתיחה מהקו של רלי (app/lib/opening.ts).
import { NextRequest, NextResponse } from "next/server";
import { notifyTeam } from "../../lib/store-notify";
import { attributionLabel } from "../../lib/attribution-label";
import { sendOpening, ipAllowsOpening, noteIpOpening } from "../../lib/opening";
import { sheetUpsert } from "../../lib/leads-sheet";

export const runtime = "nodejs";
// התראה + פתיחה בווצאפ (3 קריאות GreenAPI) + שורה בטבלה: יותר מ-10 שניות במקרה הגרוע
export const maxDuration = 30;

const clean = (v: unknown, n: number) => String(v ?? "").replace(/[<>]/g, "").trim().slice(0, n);
// שדה של שורה אחת: בלי ירידות שורה, כדי שאי אפשר יהיה לזייף שורות בהתראה או בנושא המייל
const line = (v: unknown, n: number) => clean(v, n).replace(/[\r\n\t]+/g, " ");
const FORMS: Record<string, string> = { install: "ליד התקנה", category: "ליד מדף קטגוריה", contact: "פנייה מיצירת קשר", deal: "ליד מבצע", callback: "📞 בקשת שיחה חוזרת" };

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const name = line(body.name, 80);
  const phone = line(body.phone, 20).replace(/[^\d+]/g, "");
  const email = line(body.email, 120);
  // מלכודת ספאם: שדה נסתר שרק בוטים ממלאים. מחזירים הצלחה בלי לשלוח כלום.
  if (line(body.website, 200)) return NextResponse.json({ ok: true, leadId: "L-0" });
  if (name.length < 2 || phone.replace(/\D/g, "").length < 9) return NextResponse.json({ error: "צריך שם וטלפון תקין כדי שנחזור אליך" }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "כתובת המייל לא תקינה (אפשר גם להשאיר ריק)" }, { status: 400 });
  const form = FORMS[line(body.form, 20)] ? line(body.form, 20) : "install";
  const leadId = `L-${Date.now().toString(36).toUpperCase()}`;
  const text = [
    `מזהה: ${leadId}`,
    `שם: ${name}`,
    `טלפון: ${phone}`,
    email ? `מייל: ${email}` : null,
    body.kind ? `סוג: ${line(body.kind, 40)}` : null,
    `מה צריך: ${line(body.need, 60) || "-"}`,
    body.city ? `יישוב: ${line(body.city, 60)}` : null,
    body.category ? `קטגוריה: ${line(body.category, 30)}` : null,
    body.note ? `פרטים: ${clean(body.note, 2000)}` : null,
    `דף: ${line(body.page, 80) || "-"}`,
    `מקור: ${attributionLabel(body.attribution)}`,
  ].filter(Boolean).join("\n");
  const t0 = Date.now();
  const sent = await notifyTeam(`${FORMS[form]} ${leadId}: ${name}`, text, email ? { replyTo: email } : undefined);
  // הודעת פתיחה מטל ושורה בטבלה של רלי. כישלון כאן לא מפיל את הטופס: ההתראה לצוות כבר יצאה.
  // לפתיחה עוברים רק ערכים גולמיים מהטופס; opening.ts מציג רק ערכים מרשימה סגורה
  const needs = [line(body.need, 60), line(body.kind, 40), line(body.category, 30)].filter(Boolean);
  const need = needs.join(", ");
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  // מגבלת קצב (בדיקה 20.10.2026): בלי מגבלה אפשר לגרום לקו של רלי לכתוב למספרים זרים ולגמור את התקרה היומית
  const opening = !ipAllowsOpening(ip, t0)
    ? { sent: false, status: "לא נשלחה: יותר מדי פניות מאותה כתובת בשעה האחרונה (לבדוק ולסמן ידנית)" }
    : await sendOpening({ phone, name, source: form === "callback" ? "טופס שיחה חוזרת באתר" : "טופס באתר", needs, ref: leadId, callback: form === "callback" })
      .catch((e) => ({ sent: false, status: `לא נשלחה: ${e instanceof Error ? e.message : "שגיאה"}` }));
  if (opening.sent) noteIpOpening(ip, t0);
  await sheetUpsert({
    phone, name, email: email || undefined, ref: leadId,
    source: `${FORMS[form]}${body.attribution ? ` (${attributionLabel(body.attribution)})` : ""}`,
    need: [need, body.note ? clean(body.note, 500) : ""].filter(Boolean).join(" | "),
    city: line(body.city, 60) || undefined, page: line(body.page, 80) || undefined,
    opening: opening.status, status: opening.sent ? "טל בשיחה" : "חדש: לחזור ללקוח",
  }, Math.max(1000, Math.min(8000, maxDuration * 1000 - (Date.now() - t0) - 3000)));
  if (!sent.whatsapp && !sent.email) return NextResponse.json({ error: "לא הצלחנו לשלוח כרגע. אפשר לכתוב לנו בווצאפ ונחזור מיד." }, { status: 502 });
  return NextResponse.json({ ok: true, leadId });
}
