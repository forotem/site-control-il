// הודעת פתיחה מטל, מהקו של רלי, ללקוח שהשאיר טלפון (רותם 20.10.2026: "האוטומציה של טל עוברת לטלפון של רלי גם,
// שמשם יצאו הודעות פתיחה"). מקורות: טופס באתר (/api/lead), הצ'אט בחנות (/api/store-chat), ושורה שרלי מסמנת
// בטבלה, למשל ליד מפייסבוק או מאינסטגרם (/api/whatsapp/open).
// כשהלקוח עונה, ה-webhook מגיע ל-/api/whatsapp/bot, וטל ממשיך את השיחה (isOpeningMessage מסמן אותה כליד של Site-Control).
//
// מספר חדש ששולח הודעות לאנשים שלא כתבו לו קודם נחסם בקלות בווצאפ. לכן:
// - רק מהקו של רלי, ורק כשהוא מוגדר בנפרד (לא מהמספר של רותם);
// - תקרה יומית (OPENINGS_PER_DAY, ברירת מחדל 10) לשבועות הראשונים, נספרת מההודעות היוצאות של היממה האחרונה;
// - הודעה אחת, קצרה, בלי קישורים;
// - לא בשבת ובחג, ולא למי שכבר מדבר איתנו בווצאפ (שיחה עם הודעה ב-3 הימים האחרונים).
// אבטחה (בדיקה 20.10.2026): הטופס באתר פתוח לכל אחד, אז אף מילה שהלקוח הקליד לא נכנסת להודעה. מה שהוא ביקש ומאיפה
// הגיע מוצגים רק מתוך רשימות סגורות (NEED_LABELS, SOURCES), אחרת לא מוצגים. אחרת אפשר היה לשלוח מהמספר של רלי כל טקסט
// לכל מספר.
import { customerLineReady, greenApi, israeliMobile, sendWhatsAppId } from "./store-notify";
import { restDay } from "./il-time";

/** מופיע בכל הודעת פתיחה */
export const OPEN_MARK = "קיבלנו את הפנייה שלך";
/** אותו סימן הצגה עצמית כמו בבוט (INTRO_MARK שם): טל לא יציג את עצמו שוב כשהלקוח עונה */
export const INTRO_MARK = "העוזר הדיגיטלי של Site-Control";
const PER_DAY = () => Math.max(0, Number(process.env.OPENINGS_PER_DAY ?? 10) || 0);

type H = { timestamp?: number; type?: string; sendByApi?: boolean; textMessage?: string; extendedTextMessage?: { text?: string } };
const textOf = (m: H) => m.textMessage || m.extendedTextMessage?.text || "";

/** הודעת פתיחה שלנו (יוצאת, מה-API, עם שתי השורות הקבועות). "קיבלנו את הפנייה שלך" לבד הוא משפט שגם רלי כותבת */
export function isOpeningMessage(m: H): boolean {
  const t = textOf(m);
  return m.type === "outgoing" && m.sendByApi !== false && t.includes(OPEN_MARK) && t.includes(INTRO_MARK);
}

/** מה הלקוח ביקש, רק מתוך הערכים הקבועים של הטפסים באתר (InstallForm, FloatingCTA, OfferCalculator) ושמות הקטגוריות */
const NEED_LABELS: Record<string, string> = Object.fromEntries([
  // InstallForm: needs, kinds, topics
  "מצלמות אבטחה", "אינטרקום", "בקרת כניסה / קודן", "שדרוג מערכת קיימת", "לא בטוח, צריך ייעוץ",
  "בית פרטי / וילה", "דירה", "בניין משותף", "עסק / משרד / חנות", "מחסן / אתר / שטח",
  "הצעת מחיר להתקנה", "שאלה על מוצר או הזמנה מהחנות", "אינטרקום ובקרת כניסה", "מצלמות לעסק",
  // FloatingCTA (שיחה חוזרת)
  "מצלמות לבית", "בלי חשמל ואינטרנט (סולארי 4G)", "אינטרקום לבית או לבניין", "התקנה",
  // OfferCalculator
  "סיור באתר בנייה (מצלמות סולאריות)",
].map((x) => [x, x]).concat([
  // דפי קטגוריה (category slug)
  ["intercom", "אינטרקום ובקרת כניסה"], ["ip", "מצלמות IP"], ["recorders", "מקליטים"], ["analog", "שדרוג מערכת קיימת"],
  ["kits", "ערכת מצלמות"], ["wifi", "מצלמות Wi-Fi"], ["solar", "מצלמות סולאריות 4G"],
]));

/** מאיפה הגיע, רק מרשימה סגורה ("קיבלנו את הפנייה שלך ב...") */
const SOURCES: [RegExp, string][] = [
  [/פייסבוק|facebook|\bfb\b|מטא|meta/i, "פייסבוק"],
  [/אינסטגרם|instagram|\big\b/i, "אינסטגרם"],
  [/טיקטוק|tiktok/i, "טיקטוק"],
  [/שיחה חוזרת/, "טופס שיחה חוזרת באתר"],
  [/צ'?אט|chat/i, "צ'אט באתר"],
  [/טופס|ליד|form|פנייה מיצירת קשר/i, "טופס באתר"],
];
export function canonicalSource(s?: string): string | undefined {
  // בלי הסוגריים: בשורות שהאתר כותב לטבלה הם מקור הפרסום ("ליד התקנה (פייסבוק / ...)"), והלקוח מילא טופס באתר
  const t = String(s || "").replace(/\(.*$/s, "");
  for (const [re, label] of SOURCES) if (re.test(t)) return label;
  return undefined;
}

export type OpeningLead = {
  phone: string;
  name?: string;
  /** מאיפה (נבדק מול SOURCES) */
  source?: string;
  /** מה ביקש: ערכים גולמיים מהטופס / מהטבלה. מוצגים רק אם הם ב-NEED_LABELS; שאלת הבירור נבחרת לפי מילות מפתח */
  needs?: string[];
  ref?: string;
  /** ביקש שיחה חוזרת: רלי מתקשרת, וההודעה רק מאשרת ומאפשרת לכתוב */
  callback?: boolean;
};
export type OpeningResult = { sent: boolean; status: string; idMessage?: string };

/** שם פרטי שנראה כמו שם אמיתי (לא "לקוח", לא מספר) */
function firstName(name?: string): string {
  const f = String(name || "").trim().split(/\s+/)[0] || "";
  return /^[\p{L}'"-]{2,15}$/u.test(f) && !/^(לקוח|לקוחה|test|בדיקה)$/i.test(f) ? f : "";
}

/** שאלת בירור אחת לפי מה שביקש, כדי שקל לענות. הטקסט הגולמי רק בוחר שאלה קבועה, הוא לא נשלח */
function questionFor(need: string): string {
  const t = need.toLowerCase();
  if (/סולאר|4g|בלי חשמל|אתר בני|בנייה|שטח|חקלא|רפת|לול|פרדס/.test(t)) return "איזה מקום צריך לאבטח, ויש שם קליטה סלולרית טובה?";
  if (/אינטרקום|פנל|דלת|שער|קודן|בקרת כניסה/.test(t)) return "זה לבית פרטי או לבניין, ויש כבר כבל מהדלת?";
  if (/התקנ/.test(t)) return "באיזה יישוב, וכמה מצלמות בערך?";
  if (/עסק|חנות|משרד|מחסן|מפעל/.test(t)) return "איזה עסק, ובערך כמה נקודות צריך לכסות?";
  if (/בית|דירה|וילה|חצר|חניה/.test(t)) return /\d/.test(t) ? "איפה בערך המצלמות אמורות להיות (כניסה, חניה, חצר), ויש Wi-Fi טוב בנקודות?" : "כמה מצלמות בערך, ואיפה (כניסה, חניה, חצר)?";
  return "כדי שנכוון אותך נכון: זה לבית או לעסק, ובערך כמה מצלמות?";
}

export function openingText(lead: OpeningLead): string {
  const name = firstName(lead.name);
  const raw = (lead.needs || []).map((x) => String(x || "").trim()).filter(Boolean);
  const shown = [...new Set(raw.map((x) => NEED_LABELS[x]).filter(Boolean))].slice(0, 2).join(", ");
  const source = canonicalSource(lead.source);
  const ref = /^[A-Za-z0-9-]{3,24}$/.test(lead.ref || "") ? lead.ref : "";
  return [
    `היי${name ? ` ${name}` : ""}, כאן טל, ${INTRO_MARK} 👋`,
    lead.callback
      ? `${OPEN_MARK} (בקשה לשיחה חוזרת מהאתר${shown ? `, ${shown}` : ""}).`
      : `${OPEN_MARK}${source ? ` ב${source}` : ""}${shown ? ` (${shown})` : ""}, ואני ממשיך איתך מכאן.`,
    ...(lead.callback
      ? ["רלי מהצוות תתקשר אליך בהקדם מהמספר הזה. אם נוח יותר, אפשר גם לכתוב כאן מה מחפשים."]
      : [questionFor(raw.join(" ")), "אפשר לענות כאן בהודעה. מי שמעדיף לדבר, רלי מהצוות זמינה בטלפון הזה."]),
    ref ? `מס' פנייה: ${ref}` : "",
  ].filter(Boolean).join("\n");
}

// מגבלת קצב לפי כתובת IP: הטופס והצ'אט פתוחים לכל אחד. עד 3 פתיחות בשעה מאותה כתובת; הליד עצמו תמיד נקלט.
// זיכרון של המופע (כמו store-order/verify), מספיק נגד ניסיון פשוט לשלוח הרבה פתיחות ממקום אחד.
const openingsByIp = new Map<string, number[]>();
const OPENINGS_PER_IP_HOUR = 3;
export function ipAllowsOpening(ip: string, now = Date.now()): boolean {
  return (openingsByIp.get(ip) || []).filter((t) => now - t < 3600_000).length < OPENINGS_PER_IP_HOUR;
}
export function noteIpOpening(ip: string, now = Date.now()): void {
  openingsByIp.set(ip, [...(openingsByIp.get(ip) || []).filter((t) => now - t < 3600_000), now]);
}

// פתיחה אחת לטלפון גם כששתי בקשות מגיעות כמעט יחד (שליחה כפולה של טופס, שני תורות בצ'אט). זיכרון של המופע בלבד;
// הגנה מלאה נותנת בדיקת ההיסטוריה בווצאפ (שכבר כוללת את הפתיחה הקודמת)
const inFlight = new Map<string, number>();

/** שולח הודעת פתיחה מהקו של רלי אם מותר. status בעברית, לטבלה */
export async function sendOpening(lead: OpeningLead, now = new Date()): Promise<OpeningResult> {
  const mobile = israeliMobile(lead.phone);
  if (!mobile) return { sent: false, status: "לא נשלחה: לא מספר נייד" };
  if (!customerLineReady()) return { sent: false, status: "לא נשלחה: הקו של רלי עוד לא מחובר" };
  if (restDay(now)) return { sent: false, status: "לא נשלחה: שבת או חג (לסמן שוב אחרי)" };
  const t = now.getTime();
  if (t - (inFlight.get(mobile) || 0) < 10 * 60 * 1000) return { sent: false, status: "לא נשלחה: כבר נשלחה פתיחה לפני רגע" };
  inFlight.set(mobile, t);
  try {
    const history = await greenApi<H[]>("getChatHistory", { chatId: `${mobile}@c.us`, count: 10 }, undefined, "customer");
    // בלי היסטוריה (שגיאה ב-GreenAPI) לא שולחים: עדיף לפספס פתיחה מאשר לכתוב למי שכבר מדבר איתנו
    if (!history) { inFlight.delete(mobile); return { sent: false, status: "לא נשלחה: לא הצלחנו לבדוק את השיחה בווצאפ (לסמן שוב)" }; }
    if (history.some((m) => t / 1000 - (m.timestamp || 0) < 3 * 24 * 3600)) return { sent: false, status: "לא נשלחה: כבר בשיחה בווצאפ" };
    const out = await greenApi<H[]>("lastOutgoingMessages", undefined, { minutes: 1440 }, "customer");
    if (!out) { inFlight.delete(mobile); return { sent: false, status: "לא נשלחה: לא הצלחנו לבדוק את התקרה היומית (לסמן שוב)" }; }
    const today = out.filter(isOpeningMessage).length;
    if (today >= PER_DAY()) { inFlight.delete(mobile); return { sent: false, status: `לא נשלחה: הגענו לתקרה של ${PER_DAY()} פתיחות ביממה (לסמן שוב מחר)` }; }
    const id = await sendWhatsAppId(mobile, openingText(lead), "customer");
    if (!id) inFlight.delete(mobile);
    return id ? { sent: true, status: "פתיחה נשלחה, טל בשיחה", idMessage: id } : { sent: false, status: "לא נשלחה: שגיאה בווצאפ" };
  } catch (e) {
    inFlight.delete(mobile);
    return { sent: false, status: `לא נשלחה: ${e instanceof Error ? e.message.slice(0, 80) : "שגיאה"}` };
  }
}
