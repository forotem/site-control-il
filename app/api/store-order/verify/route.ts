// שליחת קוד אימות בווצאפ לפני הזמנה. מגבלות נגד שימוש לרעה: דקה בין קודים לאותו מספר, עד 4 בשעה למספר ועד 10 בשעה לכתובת IP.
import { NextRequest, NextResponse } from "next/server";
import { israeliMobile, sendWhatsApp } from "../../../lib/store-notify";
import { issueCode, otpEnabled } from "../../../lib/order-otp";

export const runtime = "nodejs";

const byPhone = new Map<string, number[]>();
const byIp = new Map<string, number[]>();
const recent = (m: Map<string, number[]>, key: string, windowMs: number) => (m.get(key) || []).filter((t) => Date.now() - t < windowMs);

export async function POST(req: NextRequest) {
  let body: { phone?: string; website?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  if (!otpEnabled()) return NextResponse.json({ ok: true, skip: true });
  // מלכודת ספאם: שדה נסתר שרק בוטים ממלאים
  if (body.website) return NextResponse.json({ ok: true, token: "0.0" });

  const mobile = israeliMobile(String(body.phone || ""));
  if (!mobile) return NextResponse.json({ error: "צריך מספר נייד ישראלי (05X) כדי לשלוח קוד אימות בווצאפ." }, { status: 400 });

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const phoneHits = recent(byPhone, mobile, 60 * 60 * 1000);
  const ipHits = recent(byIp, ip, 60 * 60 * 1000);
  if (phoneHits.length && Date.now() - phoneHits[phoneHits.length - 1] < 60 * 1000) return NextResponse.json({ error: "כבר שלחנו קוד לפני רגע. אפשר לבקש שוב בעוד דקה." }, { status: 429 });
  if (phoneHits.length >= 4 || ipHits.length >= 10) return NextResponse.json({ error: "יותר מדי ניסיונות. אפשר לשלוח את ההזמנה בווצאפ במקום." }, { status: 429 });

  const { code, token } = issueCode(mobile);
  const ok = await sendWhatsApp(mobile, `קוד האימות להזמנה ב-Site-Control: ${code}\nמזינים אותו באתר כדי לשלוח את ההזמנה. אם לא ביקשת קוד, אפשר להתעלם מההודעה.`);
  if (!ok) return NextResponse.json({ error: "לא הצלחנו לשלוח קוד בווצאפ כרגע. אפשר לשלוח את ההזמנה בווצאפ במקום." }, { status: 502 });
  byPhone.set(mobile, [...phoneHits, Date.now()]);
  byIp.set(ip, [...ipHits, Date.now()]);
  return NextResponse.json({ ok: true, token, to: `0${mobile.slice(3, 5)}-${mobile.slice(5, 8)}-${mobile.slice(8)}` });
}
