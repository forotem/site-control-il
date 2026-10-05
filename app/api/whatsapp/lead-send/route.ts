// שליחת הודעת פולואפ ללקוח מהמספר של רותם, אחרי שרותם אישר את הנוסח בצ'אט.
// רותם 2.10.2026, על טיוטות הפולואפ ללידים מהאתר: "כן תשלח להם מהטלפון שלי".
// פרטי GreenAPI קיימים רק ב-Vercel, אז הכלי המקומי (site-control-tools/lead-agent/lead-send.js) שולח דרך כאן.
// מוגן במפתח נפרד שנגזר מ-RESEND_API_KEY, ושולח רק למי שפנה לרותם מכפתור באתר (יש בשיחה הודעה נכנסת
// עם טקסט של האתר), או ללקוח שקיבל מאיתנו הודעת הזמנה עם orderRef. כך זה לא כלי לשליחה לכל מספר. לא שולח בשבת.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { greenApi, IDAN_WA, israeliMobile, sendWhatsAppId } from "../../../lib/store-notify";
import { siteSourceOf } from "../../../lib/site-wa-prefills";

export const runtime = "nodejs";
export const maxDuration = 30;

type Msg = { type?: string; textMessage?: string; extendedTextMessage?: { text?: string } };

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-lead-send") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`lead-send:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

function isShabbat(now = new Date()): boolean {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", weekday: "short", hour: "numeric", hour12: false })
    .formatToParts(now).map((x) => [x.type, x.value]));
  const hour = Number(p.hour) % 24;
  return p.weekday === "Sat" || (p.weekday === "Fri" && hour >= 16);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (isShabbat()) return NextResponse.json({ error: "shabbat" }, { status: 409 });
  let body: { phone?: string; texts?: string[]; orderRef?: string; rotemApproved?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const phone = israeliMobile(body.phone || "");
  const texts = (body.texts || []).map((t) => String(t).trim()).filter(Boolean).slice(0, 3);
  if (!phone || phone === IDAN_WA || !texts.length) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const history = await greenApi<Msg[]>("getChatHistory", { chatId: `${phone}@c.us`, count: 300 });
  if (!history) return NextResponse.json({ error: "greenapi unavailable" }, { status: 502 });
  // מותר: מי שפנה מכפתור באתר, או לקוח שקיבל מאיתנו את הודעת ההזמנה עם מספר ההזמנה הזה (למשל בקשה לביקורת אחרי אספקה)
  const ref = /^[A-Za-z0-9-]{3,40}$/.test(body.orderRef || "") ? String(body.orderRef) : "";
  const fromSite = history.some((m) => m.type === "incoming" && siteSourceOf(m.textMessage || m.extendedTextMessage?.text || ""));
  const ourCustomer = Boolean(ref) && history.some((m) => m.type === "outgoing" && (m.textMessage || m.extendedTextMessage?.text || "").includes(ref));
  // rotemApproved: רותם ביקש בצ'אט לשלוח ללקוח שפנה אליו ישירות (לא מכפתור באתר). מותר רק אם רותם עצמו כבר כתב
  // בשיחה הזאת מהטלפון (sendByApi=false), כלומר זו שיחה אמיתית שלו ולא מספר זר.
  const rotemChat = Boolean(body.rotemApproved) && history.some((m) => m.type === "outgoing" && (m as { sendByApi?: boolean }).sendByApi === false);
  if (!fromSite && !ourCustomer && !rotemChat) return NextResponse.json({ error: "not a site lead or customer" }, { status: 403 });
  const ids: (string | null)[] = [];
  for (const t of texts) ids.push(await sendWhatsAppId(phone, t.slice(0, 4000)));
  return NextResponse.json({ ok: ids.every(Boolean), phone, ids });
}
