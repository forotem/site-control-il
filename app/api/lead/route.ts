// ליד מטופס קצר (דף ההתקנה): שם, טלפון ומה צריך. בלי מייל חובה, כדי שיהיה קל להשאיר פרטים.
import { NextRequest, NextResponse } from "next/server";
import { notifyTeam } from "../../lib/store-notify";
import { attributionLabel } from "../../lib/attribution-label";

export const runtime = "nodejs";

const clean = (v: unknown, n: number) => String(v ?? "").replace(/[<>]/g, "").trim().slice(0, n);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20).replace(/[^\d+]/g, "");
  if (name.length < 2 || phone.replace(/\D/g, "").length < 9) return NextResponse.json({ error: "צריך שם וטלפון תקין כדי שנחזור אליך" }, { status: 400 });
  const text = [
    `שם: ${name}`,
    `טלפון: ${phone}`,
    `סוג: ${clean(body.kind, 40) || "-"}`,
    `מה צריך: ${clean(body.need, 60) || "-"}`,
    `יישוב: ${clean(body.city, 60) || "-"}`,
    body.note ? `פרטים: ${clean(body.note, 600)}` : null,
    `דף: ${clean(body.page, 80) || "-"}`,
    `מקור: ${attributionLabel(body.attribution)}`,
  ].filter(Boolean).join("\n");
  const sent = await notifyTeam(`ליד התקנה חדש: ${name}`, text);
  if (!sent.whatsapp && !sent.email) return NextResponse.json({ error: "לא הצלחנו לשלוח כרגע. אפשר לכתוב לנו בווצאפ ונחזור מיד." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
