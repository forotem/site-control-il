// הקו של רלי (050-8277907) משמש גם את דף מטבחי החוץ של China Steel: עסק נפרד (הדוד של רותם), האתר שלו ב-
// chinasteel-kitchens.vercel.app והלידים שלו בטבלה נפרדת. פרטי GreenAPI של הקו קיימים רק כאן ב-Vercel, אז האתר ההוא
// (api/lead.js) והסקריפט של טבלת הלידים (automation/leads-sheet/Code.gs) שולחים דרך הנתיב הזה. שתי פעולות בלבד:
//  open:   הודעת פתיחה קבועה בשם רלי לליד שהשאיר פרטים בטופס של דף המטבחים. רותם 25.11.2026: "שמגיע ליד חדש, יירשם
//          בטופס קודם כל, ואחר כך שישלח לליד הודעה מרלי, שיפתח איתו שיחה מהוואטסאפ של רלי". כמו בפתיחה של Site-Control
//          (app/lib/opening.ts): הודעה אחת, קצרה, בלי קישורים ובלי אף מילה שהלקוח הקליד; לא בשבת ובחג; לא למי שכבר
//          בשיחה; תקרה יומית. התקרה המחייבת (יום + כתובת IP) נעולה ב-Apps Script של הטבלה, כאן רק גיבוי.
//  notify: הודעה לרותם על ליד חדש ("אותי אפשר לעדכן בוואטסאפ הפרטי שלי"). היעד קבוע: המספר של רותם.
// הנתיב לא נוגע בלידים של Site-Control, בטבלה של רלי או בטל. הנוסח לא מכיל את הסימנים של isOpeningMessage.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { CUSTOMER_WA, ELI_WA, IDAN_WA, OPS_WA, customerLineReady, greenApi, israeliMobile, sendWhatsAppId } from "../../../lib/store-notify";
import { il, restDay } from "../../../lib/il-time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** SHA-256 של המפתח של אתר המטבחים (המפתח עצמו רק ב-Vercel של chinasteel-kitchens). אותו ערך כמו ב-Code.gs */
const KITCHEN_KEY_SHA256 = "957eff5ba76d16794719675b20dbaff82f3629141b0b2fb409af5b8db9c0d6c5";
/** מופיע בכל הודעת פתיחה של המטבחים: לפיו נספרת התקרה היומית */
const OPEN_MARK = "ממטבחי החוץ של China Steel";
const OPENING = `היי, כאן רלי ${OPEN_MARK}. ראיתי שהשארת פרטים באתר שלנו.\nאני זמינה כאן בווצאפ לכל שאלה על המטבח, המידות והמחיר. מתי נוח לך שאתקשר?`;
const PER_DAY = 8;

type H = { timestamp?: number; textMessage?: unknown; extendedTextMessage?: { text?: string } };
const textOf = (m: H) => String(m.textMessage || m.extendedTextMessage?.text || "");
const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/** אתר המטבחים מזדהה במפתח שלו; הסקריפט של טבלת הלידים בסוד המשותף של הטבלה */
function authorized(body: Record<string, unknown>): boolean {
  const key = typeof body.key === "string" ? body.key : "";
  if (key.length >= 20 && key.length <= 200 && same(createHash("sha256").update(key).digest("hex"), KITCHEN_KEY_SHA256)) return true;
  const want = process.env.LEADS_SHEET_SECRET || "";
  const got = typeof body.secret === "string" ? body.secret : "";
  return Boolean(want && got) && same(got, want);
}

async function sendKitchenOpening(phone: string): Promise<{ sent: boolean; status: string }> {
  const mobile = israeliMobile(phone);
  if (!mobile || mobile === IDAN_WA || mobile === ELI_WA || mobile === CUSTOMER_WA) return { sent: false, status: "לא נשלחה: לא מספר נייד של לקוח" };
  if (!customerLineReady()) return { sent: false, status: "לא נשלחה: הקו של רלי לא מחובר. לכתוב ללקוח ידנית" };
  if (restDay()) return { sent: false, status: "לא נשלחה: שבת או חג. לכתוב ללקוח אחרי" };
  // מספר שאין בו ווצאפ (טעות הקלדה, מספר מומצא): לא שולחים. הודעות למספרים כאלה הן מה שמסכן את הקו
  const wa = await greenApi<{ existsWhatsapp?: boolean }>("checkWhatsapp", { phoneNumber: Number(mobile) }, undefined, "customer", 7000);
  if (wa && wa.existsWhatsapp === false) return { sent: false, status: "לא נשלחה: אין ווצאפ במספר הזה. להתקשר ללקוח" };
  const history = await greenApi<H[]>("getChatHistory", { chatId: `${mobile}@c.us`, count: 10 }, undefined, "customer", 7000);
  // בלי היסטוריה (שגיאה ב-GreenAPI) לא שולחים: עדיף לפספס פתיחה מאשר לכתוב למי שכבר מדבר עם רלי
  if (!history) return { sent: false, status: "לא נשלחה: לא הצלחנו לבדוק את השיחה בווצאפ. לכתוב ללקוח ידנית" };
  if (history.some((m) => Date.now() / 1000 - (m.timestamp || 0) < 3 * 24 * 3600)) return { sent: false, status: "לא נשלחה: כבר יש איתו שיחה בווצאפ" };
  const out = await greenApi<H[]>("lastOutgoingMessages", undefined, { minutes: 1440 }, "customer", 7000);
  if (!out) return { sent: false, status: "לא נשלחה: לא הצלחנו לבדוק את התקרה היומית. לכתוב ללקוח ידנית" };
  if (out.filter((m) => textOf(m).includes(OPEN_MARK)).length >= PER_DAY) return { sent: false, status: `לא נשלחה: הגענו לתקרה של ${PER_DAY} הודעות פתיחה ביממה. לכתוב ללקוח ידנית` };
  const id = await sendWhatsAppId(mobile, OPENING, "customer");
  if (!id) return { sent: false, status: "לא נשלחה: שגיאה בווצאפ. לכתוב ללקוח ידנית" };
  return { sent: true, status: `נשלחה ${il(new Date(), { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }, "en-GB").replace(",", "")}` };
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = JSON.parse(await req.text()); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  if (!body || typeof body !== "object" || !authorized(body)) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (body.action === "open") {
    const r = await sendKitchenOpening(String(body.phone ?? "").slice(0, 20));
    return NextResponse.json({ ok: true, ...r });
  }
  if (body.action === "notify") {
    const text = String(body.text ?? "").replace(/[<>\r\t]+/g, " ").trim().slice(0, 1500);
    if (!text) return NextResponse.json({ error: "bad request" }, { status: 400 });
    // מהקו של רלי למספר של רותם (הודעה מהמספר של רותם לעצמו לא מצלצלת). הבוט מדלג על הודעות מהקו של רלי
    const sent = Boolean(await sendWhatsAppId(OPS_WA, text, "customer"));
    return NextResponse.json({ ok: sent, sent });
  }
  return NextResponse.json({ error: "bad action" }, { status: 400 });
}
