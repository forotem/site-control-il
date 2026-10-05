// חיבור/ניתוק של בוט הווצאפ (טל) ל-GreenAPI: מגדיר webhookUrl + webhookUrlToken ב-instance.
// לפני החיבור נבדק (5.10.2026) שתור ההתראות לא נצרך על ידי אף מערכת (ההתראה בראש התור בת 24 שעות),
// כלומר מערכת הלידים של TimelapseIT לא עובדת עם התור, וה-webhook לא יפריע לה.
// מוגן במפתח admin (to-rotem). action=status|connect|disconnect.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { greenApi } from "../../../lib/store-notify";
import { botToken } from "../../../lib/wa-bot-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT_URL = "https://www.site-control-il.com/api/whatsapp/bot";

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-admin") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`to-rotem:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const action = req.nextUrl.searchParams.get("action") || "status";
  if (action === "connect") {
    const token = botToken();
    if (!token) return NextResponse.json({ error: "no token" }, { status: 500 });
    const r = await greenApi("setSettings", { webhookUrl: BOT_URL, webhookUrlToken: token, incomingWebhook: "yes" });
    return NextResponse.json({ action, result: r });
  }
  if (action === "disconnect") {
    const r = await greenApi("setSettings", { webhookUrl: "", webhookUrlToken: "" });
    return NextResponse.json({ action, result: r });
  }
  const s = await greenApi<Record<string, unknown>>("getSettings");
  return NextResponse.json({ action: "status", webhookUrl: s?.webhookUrl || "", incomingWebhook: s?.incomingWebhook });
}
