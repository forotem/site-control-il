// הודעת פתיחה מטל לליד שרלי מסמנת בטבלה (רותם 20.10.2026: גם "מי שביקש בפייסבוק צ'אט או אינסטגרם"). רלי מוסיפה שורה
// עם שם, טלפון ומקור ומסמנת "שלח פתיחה", וה-Apps Script של הגיליון (automation/leads-sheet/Code.gs) קורא לכאן.
// מוגן בסוד המשותף של הטבלה (LEADS_SHEET_SECRET). כל המגבלות של sendOpening חלות (קו של רלי, שבת, תקרה יומית, שיחה קיימת).
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { sendOpening } from "../../../lib/opening";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const clean = (v: unknown, n: number) => String(v ?? "").replace(/[<>\r\n\t]+/g, " ").trim().slice(0, n);

function authorized(secret: unknown): boolean {
  const want = process.env.LEADS_SHEET_SECRET || "";
  const got = String(secret || "");
  return Boolean(want && got) && got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = JSON.parse(await req.text()); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  if (!authorized(body.secret)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const r = await sendOpening({
    phone: clean(body.phone, 20),
    name: clean(body.name, 60),
    source: clean(body.source, 200) || undefined,
    needs: [clean(body.need, 200)],
    ref: clean(body.ref, 40),
    callback: /שיחה חוזרת/.test(clean(body.source, 200)),
  });
  return NextResponse.json({ ok: r.sent, status: r.status });
}
