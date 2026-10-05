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
  const s = await greenApi<Record<string, unknown>>("getSettings");
  const state = await greenApi<{ stateInstance?: string }>("getStateInstance");
  if (!s) return NextResponse.json({ error: "greenapi unavailable" }, { status: 502 });
  const url = String(s.webhookUrl || "");
  let host = "";
  try { host = url ? new URL(url).host : ""; } catch { host = "(invalid)"; }
  const flags = Object.fromEntries(Object.entries(s).filter(([k]) => /Webhook$|delaySendMessagesMilliseconds|markIncomingMessagesReaded|keepOnlineStatus/.test(k)));
  return NextResponse.json({ webhookUrlSet: Boolean(url), webhookHost: host, stateInstance: state?.stateInstance || null, ...flags }, { headers: { "Cache-Control": "no-store" } });
}
