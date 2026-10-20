// רלי בקבוצת ההתראות (רותם 20.10.2026: "לקבוצת ההתראות, רלי בפנים"). ההתראות של טל ("צריך אותך", "מוכן לקנות")
// יוצאות מהמספר של רותם לקבוצה SC_GROUP; כדי שרלי תראה אותן, הקו שלה צריך להיות חבר בקבוצה.
// GET = האם הקו של רלי בקבוצה (בלי מספרים של אחרים). POST ?action=add-rali = הוספה (צריך שהמספר של רותם יהיה מנהל בקבוצה).
// מוגן במפתח admin (app/lib/admin-auth.ts). רק הקו של רלי, רק לקבוצה הזאת: אין כאן הוספה של מספר כלשהו.
import { NextRequest, NextResponse } from "next/server";
import { adminAuthorized } from "../../../lib/admin-auth";
import { CUSTOMER_WA, OPS_WA, SC_GROUP, greenApi } from "../../../lib/store-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Group = { participants?: { id?: string; isAdmin?: boolean; isSuperAdmin?: boolean }[]; subject?: string };

async function status() {
  const g = await greenApi<Group>("getGroupData", { groupId: SC_GROUP });
  if (!g) return null;
  const p = g.participants || [];
  const me = p.find((x) => x.id === `${OPS_WA}@c.us`);
  return { group: g.subject || "", members: p.length, raliInGroup: p.some((x) => x.id === `${CUSTOMER_WA}@c.us`), opsIsAdmin: Boolean(me?.isAdmin || me?.isSuperAdmin) };
}

export async function GET(req: NextRequest) {
  if (!adminAuthorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const s = await status();
  return s ? NextResponse.json(s, { headers: { "Cache-Control": "no-store" } }) : NextResponse.json({ error: "greenapi unavailable" }, { status: 502 });
}

export async function POST(req: NextRequest) {
  if (!adminAuthorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (req.nextUrl.searchParams.get("action") !== "add-rali") return NextResponse.json({ error: "bad request" }, { status: 400 });
  const before = await status();
  if (!before) return NextResponse.json({ error: "greenapi unavailable" }, { status: 502 });
  if (before.raliInGroup) return NextResponse.json({ ok: true, already: true, ...before });
  const r = await greenApi<{ addParticipant?: boolean }>("addGroupParticipant", { groupId: SC_GROUP, participantChatId: `${CUSTOMER_WA}@c.us` });
  const after = await status();
  return NextResponse.json({ ok: Boolean(after?.raliInGroup), result: r, ...after });
}
