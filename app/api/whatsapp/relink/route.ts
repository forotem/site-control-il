// חיבור מחדש של GreenAPI לווצאפ של 050-2256866, מהטלפון בלי QR. 6.10.2026: ה-instance היה "notAuthorized"
// יום שלם (טל, קליטת לידים, פולואפים ומערכת TimelapseIT לא עבדו). רותם מבקש קוד, ומזין אותו בעצמו בווצאפ:
// הגדרות > מכשירים מקושרים > קישור מכשיר > קישור עם מספר טלפון במקום. הקוד תקף כ-2.5 דקות.
// GET = מצב החיבור. POST ?action=code = קוד חיבור (רק כשהחיבור מנותק). מוגן במפתח admin.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { greenApi } from "../../../lib/store-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PHONE = Number(process.env.STORE_ALERT_WHATSAPP || "972502256866");

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-admin") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`to-rotem:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const s = await greenApi<{ stateInstance?: string }>("getStateInstance");
  return NextResponse.json({ stateInstance: s?.stateInstance || null }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (req.nextUrl.searchParams.get("action") !== "code") return NextResponse.json({ error: "bad request" }, { status: 400 });
  const s = await greenApi<{ stateInstance?: string }>("getStateInstance");
  if (s?.stateInstance === "authorized") return NextResponse.json({ error: "already authorized" }, { status: 409 });
  const r = await greenApi<{ status?: boolean; code?: string }>("getAuthorizationCode", { phoneNumber: PHONE });
  if (!r?.status || !r.code) return NextResponse.json({ error: "no code", state: s?.stateInstance || null }, { status: 502 });
  return NextResponse.json({ code: r.code, validSeconds: 150 }, { headers: { "Cache-Control": "no-store" } });
}
