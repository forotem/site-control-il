// קריאה בלבד: הגדרות ה-instance של GreenAPI (האם מוגדר webhook, לאן, ואילו התראות), בלי טוקנים.
// לפני בניית בוט הווצאפ (רותם 5.10.2026) צריך לדעת אם ה-webhook תפוס: אותו instance (050-2256866) משמש גם
// את מערכת הלידים של TimelapseIT (Apps Script), ואסור לשבור אותה.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { greenApi } from "../../../lib/store-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-admin") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`to-rotem:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  // ?groups=1: רשימת הקבוצות (מזהה ושם בלבד), כדי למצוא את קבוצת Site-Control שרותם פתח (5.10.2026)
  if (req.nextUrl.searchParams.get("groups") === "1") {
    const chats = await greenApi<{ id: string; name?: string }[]>("getChats");
    const groups = (chats || []).filter((c) => /@g\.us$/.test(c.id)).map((c) => ({ id: c.id, name: c.name || "" }));
    return NextResponse.json({ groups }, { headers: { "Cache-Control": "no-store" } });
  }
  const s = await greenApi<Record<string, unknown>>("getSettings");
  const state = await greenApi<{ stateInstance?: string }>("getStateInstance");
  if (!s) return NextResponse.json({ error: "greenapi unavailable" }, { status: 502 });
  const url = String(s.webhookUrl || "");
  let host = "";
  try { host = url ? new URL(url).host : ""; } catch { host = "(invalid)"; }
  // הצצה לראש תור ההתראות, בלי deleteNotification (לא צורך כלום): אם ההתראה בראש התור ישנה, אף אחד לא קורא
  // את התור (מערכת TimelapseIT עובדת בשיטה אחרת). מחזירים רק זמן וסוג, בלי תוכן ובלי מספרים.
  const head = await greenApi<{ receiptId?: number; body?: { typeWebhook?: string; timestamp?: number } } | null>("receiveNotification", undefined, { receiveTimeout: 5 });
  const queueHead = head && head.body ? { typeWebhook: head.body.typeWebhook || null, ageMinutes: head.body.timestamp ? Math.round((Date.now() / 1000 - head.body.timestamp) / 60) : null } : null;
  const flags = Object.fromEntries(Object.entries(s).filter(([k]) => /Webhook$|delaySendMessagesMilliseconds|markIncomingMessagesReaded|keepOnlineStatus/.test(k)));
  return NextResponse.json({ webhookUrlSet: Boolean(url), webhookHost: host, stateInstance: state?.stateInstance || null, queueHead, ...flags }, { headers: { "Cache-Control": "no-store" } });
}
