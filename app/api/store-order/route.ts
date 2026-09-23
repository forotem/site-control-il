// הזמנה מהעגלה: מאמתים מול הקטלוג, מחשבים סכום, שולחים לצוות (ווצאפ/מייל) ומחזירים אישור.
// אין חיוב באתר: הצוות מאשר זמינות מול היבואן וחוזר ללקוח לתשלום.
import { NextRequest, NextResponse } from "next/server";
import { productBySlug } from "../../data/store-knowledge";
import { deliveryOptions } from "../../data/store-catalog";
import { notifyTeam } from "../../lib/store-notify";

export const runtime = "nodejs";

type Line = { slug: string; qty: number };

export async function POST(req: NextRequest) {
  let body: { name?: string; phone?: string; delivery?: string; note?: string; items?: Line[]; email?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const name = String(body.name || "").trim().slice(0, 80);
  const phone = String(body.phone || "").replace(/[^\d+]/g, "").slice(0, 20);
  if (name.length < 2 || phone.replace(/\D/g, "").length < 9) return NextResponse.json({ error: "צריך שם וטלפון תקין כדי שנחזור אליך" }, { status: 400 });
  const items = (body.items || []).map((l) => ({ p: productBySlug(String(l.slug)), qty: Math.max(1, Math.min(200, Math.floor(Number(l.qty) || 1))) })).filter((l) => l.p);
  if (!items.length) return NextResponse.json({ error: "העגלה ריקה" }, { status: 400 });

  const delivery = deliveryOptions.find((d) => d.id === body.delivery)?.title || "לא נבחר";
  let total = 0, unknown = 0, units = 0;
  const lines = items.map(({ p, qty }) => {
    units += qty;
    if (p!.price) total += p!.price * qty; else unknown++;
    return `- ${qty} x ${p!.brand} ${p!.model}${p!.sku ? ` (מק"ט ${p!.sku})` : ""} | ${p!.price ? `${p!.price} ₪ ליח', ${p!.price * qty} ₪` : "לפי פנייה"} | /store/${p!.slug}`;
  });
  const bulk = units >= 5 || total >= 5000 || items.some((l) => l.qty >= 5);
  const ref = `SC-${Date.now().toString(36).toUpperCase()}`;
  const text = [
    `מספר הזמנה: ${ref}`,
    `שם: ${name}`,
    `טלפון: ${phone}`,
    body.email ? `מייל: ${String(body.email).slice(0, 120)}` : null,
    `אספקה: ${delivery}`,
    bulk ? "כמות/סכום של קבלן: להכין הצעת מחיר עם הנחת כמות" : null,
    "",
    "פריטים:",
    ...lines,
    "",
    `סה"כ (כולל מע"מ, ללא משלוח): ${total.toLocaleString("he-IL")} ₪${unknown ? ` + ${unknown} פריטים לפי פנייה` : ""}`,
    body.note ? `\nהערה מהלקוח: ${String(body.note).slice(0, 500)}` : null,
    "",
    "לעשות: לבדוק זמינות מול עידן (טלרן), לחזור ללקוח לאישור מחיר סופי ותשלום.",
  ].filter((x) => x !== null).join("\n");

  const sent = await notifyTeam(`הזמנה חדשה מהחנות ${ref}${bulk ? " (קבלן)" : ""}`, text);
  return NextResponse.json({ ok: true, ref, total, unknown, bulk, delivered: sent.whatsapp || sent.email });
}
