// הודעת פתיחה מטל, מהקו של רלי, ללקוח שהשאיר טלפון (רותם 20.10.2026: "האוטומציה של טל עוברת לטלפון של רלי גם,
// שמשם יצאו הודעות פתיחה"). מקורות: טופס באתר (/api/lead), הצ'אט בחנות (/api/store-chat), ושורה שרלי מסמנת
// בטבלה, למשל ליד מפייסבוק או מאינסטגרם (/api/whatsapp/open).
// כשהלקוח עונה, ה-webhook מגיע ל-/api/whatsapp/bot, וטל ממשיך את השיחה (OPEN_MARK מסמן אותה כליד של Site-Control).
//
// מספר חדש ששולח הודעות לאנשים שלא כתבו לו קודם נחסם בקלות בווצאפ. לכן:
// - רק מהקו של רלי, ורק כשהוא מוגדר בנפרד (לא מהמספר של רותם);
// - תקרה יומית (OPENINGS_PER_DAY, ברירת מחדל 10) לשבועות הראשונים, נספרת מההודעות היוצאות של היממה האחרונה;
// - הודעה אחת, קצרה, בלי קישורים;
// - לא בשבת ובחג, ולא למי שכבר מדבר איתנו בווצאפ (שיחה עם הודעה ב-3 הימים האחרונים).
import { customerLineReady, greenApi, israeliMobile, sendWhatsAppId } from "./store-notify";
import { restDay } from "./il-time";

/** מופיע בכל הודעת פתיחה: כך הבוט מזהה שיחה שנפתחה מאיתנו כליד של Site-Control */
export const OPEN_MARK = "קיבלנו את הפנייה שלך";
/** אותו סימן הצגה עצמית כמו בבוט (INTRO_MARK שם): טל לא יציג את עצמו שוב כשהלקוח עונה */
const INTRO = "היי{name}, כאן טל, העוזר הדיגיטלי של Site-Control 👋";
const PER_DAY = () => Math.max(0, Number(process.env.OPENINGS_PER_DAY ?? 10) || 0);

export type OpeningLead = {
  phone: string;
  name?: string;
  /** מאיפה: "טופס התקנה", "הצ'אט בחנות", "פייסבוק"... */
  source?: string;
  /** מה ביקש, במילים שלו או בסיכום של טל */
  need?: string;
  ref?: string;
  /** ביקש שיחה חוזרת: רלי מתקשרת, וההודעה רק מאשרת ומאפשרת לכתוב */
  callback?: boolean;
};
export type OpeningResult = { sent: boolean; status: string; idMessage?: string };

type H = { timestamp?: number; type?: string; textMessage?: string; extendedTextMessage?: { text?: string } };
const textOf = (m: H) => m.textMessage || m.extendedTextMessage?.text || "";

/** שם פרטי שנראה כמו שם אמיתי (לא "לקוח", לא מספר) */
function firstName(name?: string): string {
  const f = String(name || "").trim().split(/\s+/)[0] || "";
  return /^[\p{L}'"-]{2,15}$/u.test(f) && !/^(לקוח|לקוחה|test|בדיקה)$/i.test(f) ? f : "";
}

/** שאלת בירור אחת לפי מה שביקש, כדי שקל לענות */
function questionFor(need: string): string {
  const t = need.toLowerCase();
  if (/סולאר|4g|בלי חשמל|אתר בני|בנייה|שטח|חקלא|רפת|לול|פרדס/.test(t)) return "איזה מקום צריך לאבטח, ויש שם קליטה סלולרית טובה?";
  if (/אינטרקום|פנל|דלת|שער/.test(t)) return "זה לבית פרטי או לבניין, ויש כבר כבל מהדלת?";
  if (/התקנ/.test(t)) return "באיזה יישוב, וכמה מצלמות בערך?";
  if (/עסק|חנות|משרד|מחסן|מפעל/.test(t)) return "איזה עסק, ובערך כמה נקודות צריך לכסות?";
  if (/בית|דירה|וילה|חצר|חניה/.test(t)) return /\d/.test(t) ? "איפה בערך המצלמות אמורות להיות (כניסה, חניה, חצר), ויש Wi-Fi טוב בנקודות?" : "כמה מצלמות בערך, ואיפה (כניסה, חניה, חצר)?";
  return "כדי שנכוון אותך נכון: זה לבית או לעסק, ובערך כמה מצלמות?";
}

export function openingText(lead: OpeningLead): string {
  const name = firstName(lead.name);
  const need = String(lead.need || "").replace(/\s+/g, " ").trim().slice(0, 140);
  const about = need ? ` (${need})` : "";
  return [
    INTRO.replace("{name}", name ? ` ${name}` : ""),
    lead.callback
      ? `${OPEN_MARK} (בקשה לשיחה חוזרת מהאתר${need ? `, ${need}` : ""}).`
      : `${OPEN_MARK}${lead.source ? ` ב${lead.source}` : ""}${about}, ואני ממשיך איתך מכאן.`,
    ...(lead.callback
      ? ["רלי מהצוות תתקשר אליך בהקדם מהמספר הזה. אם נוח יותר, אפשר גם לכתוב כאן מה מחפשים."]
      : [questionFor(need), "אפשר לענות כאן בהודעה. מי שמעדיף לדבר, רלי מהצוות זמינה בטלפון הזה."]),
    lead.ref ? `מס' פנייה: ${lead.ref}` : "",
  ].filter(Boolean).join("\n");
}

/** שולח הודעת פתיחה מהקו של רלי אם מותר. status בעברית, לטבלה */
export async function sendOpening(lead: OpeningLead, now = new Date()): Promise<OpeningResult> {
  const mobile = israeliMobile(lead.phone);
  if (!mobile) return { sent: false, status: "לא נשלחה: לא מספר נייד" };
  if (!customerLineReady()) return { sent: false, status: "לא נשלחה: הקו של רלי עוד לא מחובר" };
  if (restDay(now)) return { sent: false, status: "לא נשלחה: שבת או חג (לסמן שוב אחרי)" };
  const history = await greenApi<H[]>("getChatHistory", { chatId: `${mobile}@c.us`, count: 10 }, undefined, "customer");
  const nowS = now.getTime() / 1000;
  if (history?.some((m) => nowS - (m.timestamp || 0) < 3 * 24 * 3600)) return { sent: false, status: "לא נשלחה: כבר בשיחה בווצאפ" };
  const out = await greenApi<H[]>("lastOutgoingMessages", undefined, { minutes: 1440 }, "customer");
  const today = (out || []).filter((m) => textOf(m).includes(OPEN_MARK)).length;
  if (today >= PER_DAY()) return { sent: false, status: `לא נשלחה: הגענו לתקרה של ${PER_DAY()} פתיחות ביממה (לסמן שוב מחר)` };
  const id = await sendWhatsAppId(mobile, openingText(lead), "customer");
  return id ? { sent: true, status: "פתיחה נשלחה, טל בשיחה", idMessage: id } : { sent: false, status: "לא נשלחה: שגיאה בווצאפ" };
}
