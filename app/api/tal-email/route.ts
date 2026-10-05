// טל כותב פולואפ במייל (מ-info@site-control-il.com) ללקוח שקיבל הצעת מחיר. רותם 5.10.2026: "פולואפים
// אוטומטיים... גם מהמייל של סייט קונטרול וגם מהווצאפ". הכלי המקומי (lead-agent/followups.js) שולח את התמליל
// של השרשור, מקבל נושא וגוף, ושולח דרך Gmail API (gmail.js) כתשובה באותו שרשור. מוגן במפתח admin.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { SYSTEM, askGemini, type Msg } from "../../lib/tal";

export const runtime = "nodejs";
export const maxDuration = 30;

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-admin") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`to-rotem:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

const EMAIL_RULES = `

# ערוץ: מייל (גובר על כללים 2, 4 ו-6 למעלה כשיש סתירה)
אתה כותב עכשיו מייל פולואפ מהכתובת info@site-control-il.com, בשם רותם גולן מ-Site-Control, ללקוח שכבר קיבל מאיתנו הצעת מחיר במייל. השיחה למטה היא תמליל השרשור.
- חתימה: "רותם גולן, Site-Control, 050-2256866". אתה מנסח, רותם חותם, ולכן בלי "כאן טל" ובלי אזכור של AI.
- מייל קצר: פתיחה בשם, 3 עד 6 שורות, בלי markdown, בלי כוכביות ובלי אימוג'י. שורות קצרות.
- המטרה: לוודא שההצעה התקבלה ושהכול ברור, לשאול אם משהו חסר או שרוצים לשנות, ולהציע שיחה או מענה לשאלות. בלי לחץ מכירתי ובלי הנחות.
- לא ממציאים שינויים בהצעה ולא נוקבים מחירים שלא מופיעים בתמליל.
- בשדה reply מחזירים את גוף המייל בלבד. בשדה lead_summary מחזירים את שורת הנושא (קצרה, בעברית, בלי "Re:").
- products, escalate, lead_name, lead_phone, stock_check: ריקים.`;

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no gemini key" }, { status: 503 });
  let b: { transcript?: Msg[]; step?: number; name?: string; note?: string };
  try { b = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const transcript = (b.transcript || []).filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").map((m) => ({ role: m.role, content: m.content.slice(0, 4000) })).slice(-12);
  if (!transcript.length) return NextResponse.json({ error: "no transcript" }, { status: 400 });
  const steps: Record<number, string> = {
    1: "פולואפ ראשון, כמה ימים אחרי ההצעה: לוודא שהתקבלה ושהכול ברור.",
    2: "פולואפ שני: לשאול אם עברו על ההצעה, אם משהו חסר או שרוצים לשנות (כמויות, דגמים, התקנה, מוקד), ולהציע שיחה.",
    3: "פולואפ אחרון, מכבד: אם לא מתאים כרגע, ההצעה בתוקף ואפשר לחזור מתי שנוח. לא שולחים אחרי זה.",
  };
  const ctx = [`${steps[b.step ?? 1] || steps[1]}`, b.name ? `שם הלקוח: ${b.name}.` : "", b.note ? `מה שהוצע: ${String(b.note).slice(0, 400)}.` : "", "אם ההודעה האחרונה בתמליל היא של הלקוח (ולא שלנו), כתוב תשובה עניינית להודעה שלו במקום פולואפ."].filter(Boolean);
  if (transcript[transcript.length - 1].role !== "user") transcript.push({ role: "user", content: "(הלקוח לא ענה מאז המייל האחרון שלנו)" });
  try {
    const data = await askGemini(apiKey, `${SYSTEM}${EMAIL_RULES}\n\n# הקשר נוכחי\n${ctx.join("\n")}`, transcript);
    const body = data.reply.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#{1,6}\s+/gm, "").trim();
    return NextResponse.json({ subject: (data.lead_summary || "בהמשך להצעת המחיר").slice(0, 120), body, intent: data.intent });
  } catch (e) {
    console.error("tal-email", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "gemini" }, { status: 502 });
  }
}
