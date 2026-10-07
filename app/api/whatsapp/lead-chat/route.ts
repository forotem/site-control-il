// השיחה בווצאפ עם ליד של Site-Control, לתיעוד ומעקב בטבלת הלידים.
// רותם 2.10.2026: "תבדוק בווצאפ שלי אם דיברתי עם הלקוחות האלו ומה אמרתי להם, הכול מתועד בשיחה".
// פרטי GreenAPI קיימים רק ב-Vercel, אז הכלי המקומי (site-control-tools/lead-agent/lead-chats.js) קורא דרך כאן.
// מוגן במפתח שנגזר מ-RESEND_API_KEY, ומחזיר שיחה רק אם היא פרטית ויש בה הודעה נכנסת מכפתור באתר:
// כך זה לא כלי לקריאת כל שיחה בטלפון של רותם, רק של לידים שהגיעו מהאתר.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { ELI_WA, greenApi, IDAN_WA, israeliMobile, SC_GROUP } from "../../../lib/store-notify";
import { siteSourceOf } from "../../../lib/site-wa-prefills";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = Record<string, unknown> & { type?: string; textMessage?: string; extendedTextMessage?: { text?: string } };

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-leads") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`site-leads:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const raw = req.nextUrl.searchParams.get("phone") || "";
  // self=1: קבוצת site-control-il (ההתראות של המערכת, כולל בקשות בדיקת מלאי של טל), או הצ'אט של רותם עם עצמו.
  const isGroup = raw === SC_GROUP;
  const phone = isGroup ? raw : israeliMobile(raw);
  // הצ'אטים עם הספק (עידן, ומ-7.10.2026 גם אלי) נקראים רק דרך idan-history
  if (!phone || phone === IDAN_WA || phone === ELI_WA) return NextResponse.json({ error: "bad phone" }, { status: 400 });
  const self = req.nextUrl.searchParams.get("self") === "1" && (isGroup || phone === (process.env.STORE_ALERT_WHATSAPP || "972502256866"));
  if (isGroup && !self) return NextResponse.json({ error: "bad phone" }, { status: 400 });
  const count = Math.min(300, Math.max(1, Number(req.nextUrl.searchParams.get("count")) || 200));
  const history = await greenApi<Msg[]>("getChatHistory", { chatId: isGroup ? phone : `${phone}@c.us`, count });
  if (!history) return NextResponse.json({ error: "greenapi unavailable" }, { status: 502 });
  const fromSite = self || history.some((m) => m.type === "incoming" && siteSourceOf(m.textMessage || m.extendedTextMessage?.text || ""));
  if (!fromSite) return NextResponse.json({ error: "not a site lead" }, { status: 403 });
  // ?ids=a,b: סטטוס הודעות שנשלחו (sent / delivered / read), לאימות אחרי שליחה
  const ids = (req.nextUrl.searchParams.get("ids") || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 10);
  if (ids.length) {
    const status = await Promise.all(ids.map(async (idMessage) => {
      const r = await greenApi<Msg & { statusMessage?: string; timestamp?: number }>("getMessage", { chatId: isGroup ? phone : `${phone}@c.us`, idMessage });
      return { idMessage, status: r?.statusMessage || null, timestamp: r?.timestamp || null };
    }));
    return NextResponse.json({ phone, status }, { headers: { "Cache-Control": "no-store" } });
  }
  const keep = ["idMessage", "timestamp", "type", "typeMessage", "textMessage", "caption", "fileName", "mimeType", "downloadUrl", "statusMessage", "senderName", "quotedMessage", "extendedTextMessage", "sendByApi"];
  const messages = history.map((m) => Object.fromEntries(keep.filter((k) => m[k] !== undefined).map((k) => [k, m[k]])));
  return NextResponse.json({ phone, count: messages.length, messages }, { headers: { "Cache-Control": "no-store" } });
}
