// ארכיון השיחה עם הספק (טלרן): רותם 1.10.2026 ביקש שהשיחה עם עידן תתועד כל הזמן במחשב.
// פרטי GreenAPI קיימים רק ב-Vercel, אז הכלים המקומיים (site-control-tools/idan-archive.js, stock-check.js, deals.js) קוראים דרך כאן.
// מוגן במפתח שנגזר מ-RESEND_API_KEY (קיים גם ב-Vercel וגם ב-.secrets המקומי), ומחזיר רק את צ'אטי הספק מרשימה סגורה.
//
// רותם 7.10.2026: פתח קבוצת הזמנות עם עידן ואלי (שאלות המלאי והמחירים יוצאות לשם, ראו to-idan), ועל אלי: "גם תעקוב
// שם, לפעמים עידן לא עונה אז אלי עונה לי". לכן chat:
//   idan  (ברירת מחדל, כמו קודם) | eli | group (קבוצת ההזמנות) | all (שלושתם יחד, ממוינים מהחדש לישן)
// לכל הודעה נוספו chat ("idan"/"eli"/"group") ו-from ("idan"/"eli"/"rotem", או "other" למשתתף אחר בקבוצה).
// "rotem" = הודעה יוצאת מהמספר העסקי (sendByApi=true: נשלחה אוטומטית, false: רותם כתב מהטלפון).
// שאר המבנה ({chat, count, messages} והשדות של GreenAPI) נשאר כמו שהיה, כדי לא לשבור את הכלים הקיימים.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { ELI_WA, greenApi, IDAN_WA, SUPPLIER_GROUP } from "../../../lib/store-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Msg = Record<string, unknown>;
type ChatName = "idan" | "eli" | "group";
type From = "idan" | "eli" | "rotem" | "other";

const CHATS: Record<ChatName, { chatId: string; label: string }> = {
  idan: { chatId: `${IDAN_WA}@c.us`, label: IDAN_WA },
  eli: { chatId: `${ELI_WA}@c.us`, label: ELI_WA },
  group: { chatId: SUPPLIER_GROUP, label: SUPPLIER_GROUP },
};
const KEEP = ["idMessage", "timestamp", "type", "typeMessage", "textMessage", "caption", "fileName", "mimeType", "downloadUrl", "statusMessage", "senderId", "senderName", "senderContactName", "sendByApi", "quotedMessage", "extendedTextMessage"];

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-archive") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`idan-archive:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

// getChatHistory של GreenAPI נכשל לפעמים (502 / רשימה ריקה) לצ'אט שבטוח יש בו הודעות: עד 3 ניסיונות, כמו בבוט.
// אחרי 3 ניסיונות רשימה ריקה היא תשובה (למשל צ'אט פרטי עם אלי שעוד לא נפתח); null = GreenAPI לא זמין.
async function historyOf(chatId: string, count: number): Promise<Msg[] | null> {
  let h: Msg[] | null = null;
  for (let i = 0; i < 3 && !h?.length; i++) {
    if (i) await new Promise((r) => setTimeout(r, 1500));
    h = (await greenApi<Msg[]>("getChatHistory", { chatId, count })) ?? h;
  }
  return Array.isArray(h) ? h : null;
}

const digits = (v: unknown) => String(v ?? "").replace(/@.*$/, "").replace(/\D/g, "");

/** מי כתב: יוצאת = רותם (המספר העסקי הוא ה-instance). נכנסת: בצ'אט פרטי לפי הצ'אט, בקבוצה לפי senderId */
function fromOf(m: Msg, chat: ChatName): From {
  if (m.type === "outgoing") return "rotem";
  if (chat !== "group") return chat;
  const sender = digits(m.senderId);
  return sender === IDAN_WA ? "idan" : sender === ELI_WA ? "eli" : "other";
}

function shape(m: Msg, chat: ChatName): Msg {
  return { ...Object.fromEntries(KEEP.filter((k) => m[k] !== undefined).map((k) => [k, m[k]])), chat, from: fromOf(m, chat) };
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const count = Math.min(500, Math.max(1, Number(req.nextUrl.searchParams.get("count")) || 100));
  const which = req.nextUrl.searchParams.get("chat") || "idan";
  const noStore = { headers: { "Cache-Control": "no-store" } };

  if (which === "all") {
    // count חל על כל צ'אט בנפרד (כדי שצ'אט שקט לא ייחתך בגלל צ'אט עמוס)
    const names = Object.keys(CHATS) as ChatName[];
    const results = await Promise.all(names.map((c) => historyOf(CHATS[c].chatId, count)));
    const failed = names.filter((_, i) => !results[i]);
    if (failed.length === names.length) return NextResponse.json({ error: "greenapi unavailable" }, { status: 502 });
    const messages = names
      .flatMap((c, i) => (results[i] || []).map((m) => shape(m, c)))
      .sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
    const counts = Object.fromEntries(names.map((c, i) => [c, results[i]?.length ?? null]));
    return NextResponse.json({
      chat: "all",
      chats: Object.fromEntries(names.map((c) => [c, CHATS[c].label])),
      counts,
      ...(failed.length ? { failed } : {}),
      count: messages.length,
      messages,
    }, noStore);
  }

  if (which !== "idan" && which !== "eli" && which !== "group") return NextResponse.json({ error: "bad chat" }, { status: 400 });
  const chat: ChatName = which;
  const history = await historyOf(CHATS[chat].chatId, count);
  if (!history) return NextResponse.json({ error: "greenapi unavailable" }, { status: 502 });
  const messages = history.map((m) => shape(m, chat));
  return NextResponse.json({ chat: CHATS[chat].label, name: chat, count: messages.length, messages }, noStore);
}
