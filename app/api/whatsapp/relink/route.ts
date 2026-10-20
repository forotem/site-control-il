// חיבור מחדש של GreenAPI לווצאפ של 050-2256866, מהטלפון בלי QR. 6.10.2026: ה-instance היה "notAuthorized"
// יום שלם (טל, קליטת לידים, פולואפים ומערכת TimelapseIT לא עבדו). רותם מבקש קוד, ומזין אותו בעצמו בווצאפ:
// הגדרות > מכשירים מקושרים > קישור מכשיר > קישור עם מספר טלפון במקום. הקוד תקף כ-2.5 דקות.
// GET = מצב החיבור. POST ?action=code = קוד חיבור (רק כשהחיבור מנותק). מוגן במפתח admin.
// ?line=customer: הקו של רלי (050-8277907, מ-20.10.2026). רלי מזינה את הקוד בטלפון שלה.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { greenApi, CUSTOMER_WA, OPS_WA, customerLineReady, type Line } from "../../../lib/store-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const lineOf = (req: NextRequest): Line => (req.nextUrl.searchParams.get("line") === "customer" && customerLineReady() ? "customer" : "ops");

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-admin") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`to-rotem:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const line = lineOf(req);
  const s = await greenApi<{ stateInstance?: string }>("getStateInstance", undefined, undefined, line);
  return NextResponse.json({ line, stateInstance: s?.stateInstance || null }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (req.nextUrl.searchParams.get("action") !== "code") return NextResponse.json({ error: "bad request" }, { status: 400 });
  const line = lineOf(req);
  const s = await greenApi<{ stateInstance?: string }>("getStateInstance", undefined, undefined, line);
  if (s?.stateInstance === "authorized") return NextResponse.json({ error: "already authorized" }, { status: 409 });
  const r = await greenApi<{ status?: boolean; code?: string }>("getAuthorizationCode", { phoneNumber: Number(line === "customer" ? CUSTOMER_WA : OPS_WA) }, undefined, line);
  if (!r?.status || !r.code) return NextResponse.json({ error: "no code", state: s?.stateInstance || null }, { status: 502 });
  return NextResponse.json({ code: r.code, validSeconds: 150 }, { headers: { "Cache-Control": "no-store" } });
}
