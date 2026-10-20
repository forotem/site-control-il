// הודעת פתיחה מטל, מהקו של רלי, ללקוח שהשאיר טלפון (רותם 20.10.2026: "האוטומציה של טל עוברת לטלפון של רלי גם,
// שמשם יצאו הודעות פתיחה"). מקורות: טופס באתר (/api/lead), הצ'אט בחנות (/api/store-chat), ושורה שרלי מסמנת
// בטבלה, למשל ליד מפייסבוק או מאינסטגרם (/api/whatsapp/open).
// כשהלקוח עונה, ה-webhook מגיע ל-/api/whatsapp/bot, וטל ממשיך את השיחה (isOpeningMessage מסמן אותה כליד של Site-Control).
//
// מספר חדש ששולח הודעות לאנשים שלא כתבו לו קודם נחסם בקלות בווצאפ. לכן:
// - רק מהקו של רלי, ורק כשהוא מוגדר בנפרד (לא מהמספר של רותם);
// - תקרה יומית (OPENINGS_PER_DAY, ברירת מחדל 10) ועד 3 פתיחות בשעה מאותה כתובת IP. הספירה המחייבת משותפת לכל
//   המופעים של Vercel ונעולה (Apps Script של הטבלה, פעולת reserve), כדי שגל בקשות במקביל לא יעבור אותה;
// - הודעה אחת, קצרה, בלי קישורים;
// - לא בשבת ובחג, ולא למי שכבר מדבר איתנו בווצאפ (שיחה עם הודעה ב-3 הימים האחרונים).
// אבטחה (בדיקות 20.10.2026): הטופס והצ'אט פתוחים לכל אחד, אז אף מילה שהלקוח הקליד לא נכנסת להודעה: לא שם, לא בקשה.
// מה ביקש ומאיפה הגיע מוצגים רק מתוך רשימות סגורות (NEED_LABELS, SOURCES). שם פרטי רק כשרלי הזינה אותו בטבלה.
import { customerLineReady, greenApi, israeliMobile, sendWhatsAppId } from "./store-notify";
import { restDay } from "./il-time";
import { sheetReady, sheetReserveOpening, sheetReleaseOpening } from "./leads-sheet";

/** מופיע בכל הודעת פתיחה */
export const OPEN_MARK = "קיבלנו את הפנייה שלך";
/** אותו סימן הצגה עצמית כמו בבוט (INTRO_MARK שם): טל לא יציג את עצמו שוב כשהלקוח עונה */
export const INTRO_MARK = "העוזר הדיגיטלי של Site-Control";
const PER_DAY = () => Math.max(0, Number(process.env.OPENINGS_PER_DAY ?? 10) || 0);
const PER_IP_HOUR = 3;

type H = { timestamp?: number; type?: string; sendByApi?: unknown; textMessage?: unknown; extendedTextMessage?: { text?: string } };
const textOf = (m: H) => String(m.textMessage || m.extendedTextMessage?.text || "");

/** הודעת פתיחה שלנו (יוצאת, מה-API, עם שתי השורות הקבועות). "קיבלנו את הפנייה שלך" לבד הוא משפט שגם רלי כותבת */
export function isOpeningMessage(m: H): boolean {
  const t = textOf(m);
  return m.type === "outgoing" && m.sendByApi !== false && t.includes(OPEN_MARK) && t.includes(INTRO_MARK);
}

/** מה הלקוח ביקש, רק מתוך הערכים הקבועים של הטפסים באתר (InstallForm, FloatingCTA, OfferCalculator) ושמות הקטגוריות.
 *  Map ולא אובייקט רגיל: "constructor" / "__proto__" לא מחזירים פנימיות של JavaScript (בדיקה 20.10.2026) */
const NEED_LABELS = new Map<string, string>([
  // InstallForm: needs, kinds, topics
  "מצלמות אבטחה", "אינטרקום", "בקרת כניסה / קודן", "שדרוג מערכת קיימת", "לא בטוח, צריך ייעוץ",
  "בית פרטי / וילה", "דירה", "בניין משותף", "עסק / משרד / חנות", "מחסן / אתר / שטח",
  "הצעת מחיר להתקנה", "שאלה על מוצר או הזמנה מהחנות", "אינטרקום ובקרת כניסה", "מצלמות לעסק",
  // FloatingCTA (שיחה חוזרת)
  "מצלמות לבית", "בלי חשמל ואינטרנט (סולארי 4G)", "אינטרקום לבית או לבניין", "התקנה",
  // OfferCalculator
  "סיור באתר בנייה (מצלמות סולאריות)",
].map((x): [string, string] => [x, x]).concat([
  // דפי קטגוריה (category slug)
  ["intercom", "אינטרקום ובקרת כניסה"], ["ip", "מצלמות IP"], ["recorders", "מקליטים"], ["analog", "שדרוג מערכת קיימת"],
  ["kits", "ערכת מצלמות"], ["wifi", "מצלמות Wi-Fi"], ["solar", "מצלמות סולאריות 4G"],
]));

/** מאיפה הגיע, רק מרשימה סגורה ("קיבלנו את הפנייה שלך ב..."). הטופס באתר מזוהה רק לפי הטקסטים המדויקים שהאתר כותב,
 *  לא לפי המילה "ליד" (רלי כותבת "ליד מהפייס") */
const SOURCES: [RegExp, string][] = [
  [/פייסבוק|פייס|facebook|\bfb\b|\bmeta\b|מטא/i, "פייסבוק"],
  [/אינסטגרם|אינסטה|instagram|\big\b/i, "אינסטגרם"],
  [/טיקטוק|tiktok/i, "טיקטוק"],
  [/^\s*(📞\s*)?(בקשת שיחה חוזרת|טופס שיחה חוזרת באתר)/, "טופס שיחה חוזרת באתר"],
  [/^\s*(הצ'אט בחנות|צ'אט באתר)/, "צ'אט באתר"],
  [/^\s*(ליד התקנה|ליד מדף קטגוריה|ליד מבצע|פנייה מיצירת קשר|טופס באתר)\s*$/, "טופס באתר"],
];
export function canonicalSource(s?: string): string | undefined {
  // בלי הסוגריים: בשורות שהאתר כותב לטבלה הם מקור הפרסום ("ליד התקנה (פייסבוק / ...)"), והלקוח מילא טופס באתר
  const t = String(s || "").replace(/\(.*$/s, "").trim();
  for (const [re, label] of SOURCES) if (re.test(t)) return label;
  return undefined;
}

export type OpeningLead = {
  phone: string;
  /** שם פרטי: רק כשרלי הזינה אותו בטבלה. מהטופס והצ'אט לא נכנס להודעה */
  trustedName?: string;
  /** מאיפה (נבדק מול SOURCES) */
  source?: string;
  /** מה ביקש: ערכים גולמיים. מוצגים רק אם הם ב-NEED_LABELS; שאלת הבירור נבחרת לפי מילות מפתח */
  needs?: string[];
  ref?: string;
  /** ביקש שיחה חוזרת: רלי מתקשרת, וההודעה רק מאשרת ומאפשרת לכתוב */
  callback?: boolean;
};
/** duplicate: כבר בשיחה / פתיחה כבר בדרך. אז לא דורסים בטבלה את תוצאת הפתיחה הקודמת */
export type OpeningResult = { sent: boolean; status: string; idMessage?: string; duplicate?: boolean };

/** שם פרטי בעברית בלבד (שרלי הזינה), בלי מקפים ובלי אותיות לטיניות */
function firstName(name?: string): string {
  const f = String(name || "").trim().split(/\s+/)[0] || "";
  return /^[א-ת][א-ת'"׳״]{1,11}$/.test(f) && !/^(לקוח|לקוחה|בדיקה)$/.test(f) ? f : "";
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
  const name = firstName(lead.trustedName);
  const raw = (lead.needs || []).map((x) => String(x || "").trim()).filter(Boolean);
  const shown = [...new Set(raw.map((x) => NEED_LABELS.get(x)).filter((x): x is string => typeof x === "string"))].slice(0, 2).join(", ");
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

/** מפתח IP למגבלה: IPv6 לפי /64 (כתובת אחת מתחלפת בקלות בתוך הטווח) */
export function ipKey(ip: string): string {
  const t = String(ip || "").trim();
  return t.includes(":") ? t.split(":").slice(0, 4).join(":") : t;
}

// שכבה מקומית (בתוך מופע אחד), סינכרונית: נתפסת לפני כל await, כך ששתי בקשות באותו מופע לא עוברות יחד
const inFlight = new Map<string, number>();
const localByIp = new Map<string, number[]>();
let pending = 0;

/** שולח הודעת פתיחה מהקו של רלי אם מותר. status בעברית, לטבלה.
 *  ip: כתובת הפונה (טופס / צ'אט); בלי ip (שורה שרלי סימנה) אין מגבלת IP, רק התקרה היומית.
 *  deadlineMs: זמן (Date.now) שאחריו כבר לא מתחילים, כדי לא לעבור את maxDuration של הנתיב */
export async function sendOpening(lead: OpeningLead, opts: { ip?: string; deadlineMs?: number; now?: Date } = {}): Promise<OpeningResult> {
  const now = opts.now || new Date();
  const mobile = israeliMobile(lead.phone);
  if (!mobile) return { sent: false, status: "לא נשלחה: לא מספר נייד" };
  if (!customerLineReady()) return { sent: false, status: "לא נשלחה: הקו של רלי עוד לא מחובר" };
  if (restDay(now)) return { sent: false, status: "לא נשלחה: שבת או חג (לסמן שוב אחרי)" };
  const t = now.getTime();
  const timeLeft = () => (opts.deadlineMs ? opts.deadlineMs - Date.now() : 30_000);
  const callTimeout = () => Math.max(1000, Math.min(8000, timeLeft() - 1500));
  if (timeLeft() < 5000) return { sent: false, status: "לא נשלחה: לא נשאר זמן (לסמן שוב)" };
  if (t - (inFlight.get(mobile) || 0) < 10 * 60 * 1000) return { sent: false, duplicate: true, status: "לא נשלחה: פתיחה למספר הזה כבר יצאה או בדרך (לפני פחות מ-10 דקות)" };
  const ip = opts.ip ? ipKey(opts.ip) : "";
  const ipHits = ip ? (localByIp.get(ip) || []).filter((x) => t - x < 3600_000) : [];
  if (ip && ipHits.length >= PER_IP_HOUR) return { sent: false, status: "לא נשלחה: יותר מדי פניות מאותה כתובת בשעה האחרונה (לבדוק ולסמן ידנית)" };
  // תפיסה מקומית לפני כל await
  inFlight.set(mobile, t);
  if (ip) localByIp.set(ip, [...ipHits, t]);
  pending++;
  let reservation: Awaited<ReturnType<typeof sheetReserveOpening>> = null;
  let sent = false;
  let keepInFlight = false;
  try {
    const history = await greenApi<H[]>("getChatHistory", { chatId: `${mobile}@c.us`, count: 10 }, undefined, "customer", callTimeout());
    // בלי היסטוריה (שגיאה ב-GreenAPI) לא שולחים: עדיף לפספס פתיחה מאשר לכתוב למי שכבר מדבר איתנו
    if (!history) return { sent: false, status: "לא נשלחה: לא הצלחנו לבדוק את השיחה בווצאפ (לסמן שוב)" };
    if (history.some((m) => t / 1000 - (m.timestamp || 0) < 3 * 24 * 3600)) return { sent: false, duplicate: true, status: "לא נשלחה: כבר בשיחה בווצאפ" };
    // התקרה המשותפת (נעולה ב-Apps Script): יום + IP. כשהטבלה מחוברת ולא ענתה, לא שולחים (עדיף לפספס מאשר לפרוץ את התקרה)
    if (sheetReady()) {
      reservation = await sheetReserveOpening({ ip, perDay: PER_DAY(), perIpHour: PER_IP_HOUR }, callTimeout());
      if (!reservation) return { sent: false, status: "לא נשלחה: לא הצלחנו לבדוק את התקרה היומית (לסמן שוב)" };
      if (!reservation.ok) {
        const why = reservation.reason === "ip" ? "יותר מדי פניות מאותה כתובת בשעה האחרונה (לבדוק ולסמן ידנית)" : `הגענו לתקרה של ${PER_DAY()} פתיחות ביום (לסמן שוב מחר)`;
        reservation = null;
        return { sent: false, status: `לא נשלחה: ${why}` };
      }
    }
    // גיבוי: ההודעות היוצאות של היממה האחרונה בקו של רלי, פלוס מה שבדרך במופע הזה
    const out = await greenApi<H[]>("lastOutgoingMessages", undefined, { minutes: 1440 }, "customer", callTimeout());
    if (!out) return { sent: false, status: "לא נשלחה: לא הצלחנו לבדוק את התקרה היומית (לסמן שוב)" };
    if (out.filter(isOpeningMessage).length + pending - 1 >= PER_DAY()) return { sent: false, status: `לא נשלחה: הגענו לתקרה של ${PER_DAY()} פתיחות ביממה (לסמן שוב מחר)` };
    if (timeLeft() < 2500) return { sent: false, status: "לא נשלחה: לא נשאר זמן (לסמן שוב)" };
    const id = await sendWhatsAppId(mobile, openingText(lead), "customer");
    sent = Boolean(id);
    keepInFlight = sent;
    return id ? { sent: true, status: "פתיחה נשלחה, טל בשיחה", idMessage: id } : { sent: false, status: "לא נשלחה: שגיאה בווצאפ" };
  } catch (e) {
    return { sent: false, status: `לא נשלחה: ${e instanceof Error ? e.message.slice(0, 80) : "שגיאה"}` };
  } finally {
    pending--;
    if (!keepInFlight) inFlight.delete(mobile);
    if (!sent) {
      if (ip) { const l = localByIp.get(ip) || []; const i = l.lastIndexOf(t); if (i >= 0) l.splice(i, 1); }
      if (reservation?.ok) await sheetReleaseOpening(reservation, 3000).catch(() => undefined);
    }
  }
}
