// הודעה לעידן (טלרן) מהמספר של רותם, אחרי שרותם ביקש בצ'אט. רותם 2.10.2026: "תנסח לו שאלה... תחזיר לו בווצאפ".
// פרטי GreenAPI קיימים רק ב-Vercel, אז הכלי המקומי (site-control-tools/send-to-idan.js) שולח דרך כאן.
// היעד קבוע (IDAN_WA) ולא ניתן לשינוי מהבקשה. מוגן במפתח נפרד שנגזר מ-RESEND_API_KEY. לא שולח בשבת.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { IDAN_WA, sendWhatsAppId } from "../../../lib/store-notify";

export const runtime = "nodejs";
export const maxDuration = 30;

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
  let body: { texts?: string[] };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const texts = (body.texts || []).map((t) => String(t).trim()).filter(Boolean).slice(0, 3);
  if (!texts.length) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const ids: (string | null)[] = [];
  for (const t of texts) ids.push(await sendWhatsAppId(IDAN_WA, t.slice(0, 4000)));
  return NextResponse.json({ ok: ids.every(Boolean), ids });
}
