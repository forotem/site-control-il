// ארכיון השיחה עם עידן (טלרן): רותם 1.10.2026 ביקש שהשיחה תתועד כל הזמן במחשב.
// פרטי GreenAPI קיימים רק ב-Vercel, אז הכלי המקומי (site-control-tools/idan-archive.js) קורא את ההיסטוריה דרך כאן.
// מוגן במפתח שנגזר מ-RESEND_API_KEY (קיים גם ב-Vercel וגם ב-.secrets המקומי), ומחזיר רק את הצ'אט עם עידן.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { greenApi, IDAN_WA } from "../../../lib/store-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = Record<string, unknown>;

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-archive") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`idan-archive:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const count = Math.min(500, Math.max(1, Number(req.nextUrl.searchParams.get("count")) || 100));
  const history = await greenApi<Msg[]>("getChatHistory", { chatId: `${IDAN_WA}@c.us`, count });
  if (!history) return NextResponse.json({ error: "greenapi unavailable" }, { status: 502 });
  const keep = ["idMessage", "timestamp", "type", "typeMessage", "textMessage", "caption", "fileName", "mimeType", "downloadUrl", "statusMessage", "senderName", "quotedMessage", "extendedTextMessage"];
  const messages = history.map((m) => Object.fromEntries(keep.filter((k) => m[k] !== undefined).map((k) => [k, m[k]])));
  return NextResponse.json({ chat: IDAN_WA, count: messages.length, messages }, { headers: { "Cache-Control": "no-store" } });
}
