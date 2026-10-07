// הודעה לספק (טלרן: עידן, ומ-7.10.2026 גם אלי) מהמספר של רותם, אחרי שרותם ביקש בצ'אט. רותם 2.10.2026: "תנסח לו שאלה... תחזיר לו בווצאפ".
// פרטי GreenAPI קיימים רק ב-Vercel, אז הכלים המקומיים (site-control-tools/send-to-idan.js, stock-check.js, deals.js) שולחים דרך כאן.
// רותם 7.10.2026 פתח קבוצת הזמנות עם עידן ואלי: "כל מה שקשור לשאלות מלאי, מחירים וכו'", וההחלטה: הכול לקבוצה.
// לכן ברירת המחדל (גם קריאה בלי to, כמו הכלים הקיימים) היא קבוצת ההזמנות. to: "idan" = הצ'אט הפרטי של עידן.
// היעד נבחר רק מרשימה סגורה (SUPPLIER_GROUP / IDAN_WA), שום מספר או קבוצה מהבקשה.
// מוגן במפתח נפרד שנגזר מ-RESEND_API_KEY. לא שולח בשבת.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { IDAN_WA, SUPPLIER_GROUP, sendWhatsAppId } from "../../../lib/store-notify";

export const runtime = "nodejs";
export const maxDuration = 30;

const TARGETS = { group: SUPPLIER_GROUP, idan: IDAN_WA } as const;
type Target = keyof typeof TARGETS;

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-to-idan") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`to-idan:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

function isShabbat(now = new Date()): boolean {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", weekday: "short", hour: "numeric", hour12: false })
    .formatToParts(now).map((x) => [x.type, x.value]));
  return p.weekday === "Sat" || (p.weekday === "Fri" && Number(p.hour) % 24 >= 16);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (isShabbat()) return NextResponse.json({ error: "shabbat" }, { status: 409 });
  let body: { texts?: string[]; to?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  // בלי to (או ריק) = הקבוצה. ערך לא מוכר = שגיאה, לא נופלים בשקט ליעד אחר
  const to = body.to == null || body.to === "" ? "group" : String(body.to);
  if (to !== "group" && to !== "idan") return NextResponse.json({ error: "bad target" }, { status: 400 });
  const target: Target = to;
  const texts = (body.texts || []).map((t) => String(t).trim()).filter(Boolean).slice(0, 3);
  if (!texts.length) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const ids: (string | null)[] = [];
  for (const t of texts) ids.push(await sendWhatsAppId(TARGETS[target], t.slice(0, 4000)));
  return NextResponse.json({ ok: ids.every(Boolean), ids, target });
}
