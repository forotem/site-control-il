// קוד פנייה מכפתור ווצאפ (app/lib/wa-ref.ts, רותם 7.10.2026): הדפדפן שולח לכאן בלחיצה את הקוד SCW-XXXXXX עם המקור
// (דף, כפתור, UTM, gclid/fbclid, מפנה, first touch), כדי שאפשר יהיה לחבר הודעה שהגיעה לווצאפ עם הקוד למקור ההגעה.
// לאתר אין DB (אין Vercel KV / Blob / Edge Config, נבדק 7.10.2026), אז הרשומה נשלחת במייל ל-info@site-control-il.com:
//   נושא: "wa-ref SCW-XXXXXX"
//   גוף: JSON בשורה אחת, {code, at, page, button, text, source, utm_source, utm_medium, utm_campaign, utm_content,
//        gclid, fbclid, ref, attribution: {source, medium, campaign, term, content, utmId, clickId, clickIdType, landing, at}, attributionLabel}
// הכלי המקומי (site-control-tools/lead-agent/capture-wa-leads.js) מחפש ב-Gmail: subject:"wa-ref SCW-XXXXXX" ומפענח את הגוף.
// הנקודה ציבורית (נקראת מהדפדפן בלי מפתח), ולכן: אימות קפדני של הקוד, חיתוך כל שדה, בלי HTML, בלי כתובת IP, והגבלת קצב.
import { NextRequest, NextResponse } from "next/server";
import { sendTeamEmail } from "../../lib/store-notify";
import { attributionLabel } from "../../lib/attribution-label";
import { siteSourceOf } from "../../lib/site-wa-prefills";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CODE_RE = /^SCW-[A-HJ-NP-Z2-9]{6}$/;
// הגבלת קצב בזיכרון הפונקציה (ב-Vercel לא מושלם, אבל עוצר לולאה או סקריפט מאותו מופע): עד 30 קודים לדקה לכתובת
const RATE_MAX = 30;
const rate = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rate.get(ip) || []).filter((t) => now - t < 60_000);
  hits.push(now);
  rate.set(ip, hits);
  if (rate.size > 2000) rate.clear();
  return hits.length > RATE_MAX;
}

const str = (v: unknown, n: number) => (typeof v === "string" ? v.replace(/[\r\n\t<>]/g, " ").trim().slice(0, n) : "");
const opt = (v: unknown, n: number) => str(v, n) || undefined;

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "?";
  if (rateLimited(ip)) return NextResponse.json({ ok: false }, { status: 429 });
  // sendBeacon שולח Blob; קוראים כטקסט ומפענחים בעצמנו כדי לא להיות תלויים ב-Content-Type
  let body: Record<string, unknown>;
  try { body = JSON.parse((await req.text()).slice(0, 8000)); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false }, { status: 400 });
  const code = str(body.code, 12).toUpperCase();
  if (!CODE_RE.test(code)) return NextResponse.json({ ok: false }, { status: 400 });

  const a = body.attribution && typeof body.attribution === "object" ? (body.attribution as Record<string, unknown>) : null;
  const text = str(body.text, 300);
  const rec = {
    code,
    at: new Date().toISOString(),
    page: str(body.page, 200),
    button: opt(body.button, 80),
    text: text || undefined,
    source: text ? siteSourceOf(text) : null,
    utm_source: opt(body.utm_source, 200),
    utm_medium: opt(body.utm_medium, 200),
    utm_campaign: opt(body.utm_campaign, 200),
    utm_content: opt(body.utm_content, 200),
    gclid: opt(body.gclid, 200),
    fbclid: opt(body.fbclid, 500),
    ref: opt(body.ref, 300),
    attribution: a ? {
      source: opt(a.source, 80), medium: opt(a.medium, 80), campaign: opt(a.campaign, 80), term: opt(a.term, 80), content: opt(a.content, 80),
      utmId: opt(a.utmId, 80), clickId: opt(a.clickId, 500), clickIdType: opt(a.clickIdType, 10), landing: opt(a.landing, 200),
      at: typeof a.at === "number" ? a.at : undefined,
    } : undefined,
    attributionLabel: attributionLabel(a).replace(/\n/g, " | "),
    ua: opt(req.headers.get("user-agent"), 160),
  };
  const ok = await sendTeamEmail(`wa-ref ${code}`, JSON.stringify(rec));
  if (!ok) console.warn("wa-ref not stored", JSON.stringify(rec));
  return NextResponse.json({ ok }, { headers: { "Cache-Control": "no-store" } });
}
