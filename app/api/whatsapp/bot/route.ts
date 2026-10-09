// טל בווצאפ: עונה ללידים של Site-Control מהמספר העסקי 050-2256866 כשרותם לא זמין (לילה, עסוק).
// רותם 5.10.2026: "כל האלו שמגיעים בשעות הלילה ובכללי אני צריך שהבוט ידבר איתם, יעזור להם לבחור ולקנות.
// אני אוכל להתערב אם צריך".
//
// מקבל webhook של GreenAPI (incomingMessageReceived). המוח: app/lib/tal.ts, אותו ידע כמו הצ'אט באתר.
// כללי בטיחות (האינסטנס משותף גם למערכת הלידים של TimelapseIT, ובטלפון של רותם יש שיחות אחרות):
// 1. רק שיחה פרטית שיש בה הודעה נכנסת מכפתור באתר של Site-Control (site-wa-prefills). לא TimelapseIT,
//    לא עידן ולא אלי (טלרן, מ-7.10.2026), לא קבוצות (כולל קבוצת ההזמנות מול הספק), לא אנשי קשר אחרים.
// 2. רותם כתב בשיחה מהטלפון (sendByApi=false) ב-10 הדקות האחרונות: הבוט שותק (רותם 6.10.2026: "הלקוח ממשיך לדבר איתי, למה הבוט לא עונה לו?" = טל ממשיך כשרותם לא באמצע שיחה). רותם "לוקח" שיחה פשוט כשהוא כותב בה.
// 3. לא בשבת ובחג (שישי/ערב חג מ-16:00 עד מוצאי שבת/חג 20:00).
// 4. עונה רק על ההודעה הנכנסת האחרונה, אחרי המתנה קצרה (לקוחות שולחים כמה הודעות ברצף), ורק אם עוד לא
//    נענתה. כך גם שליחה חוזרת של אותו webhook (GreenAPI מנסה שוב אחרי דקה) לא יוצרת תשובה כפולה.
// 5. עד 10 תשובות של הבוט לשיחה ביממה.
// 6. התראה לקבוצה ("מוכן לקנות" / "צריך אותך") פעם אחת בשעה לכל לקוח, אלא אם יש עובדה חדשה (7.10.2026: 8 התראות על ליד אחד).
// מצב: BOT_MODE. "live" = עונה ללקוח; "dry" = שולח לרותם בלבד את מה שהיה עונה; "off" = לא עושה כלום.
// בדיקה ידנית (?dry=1 + מפתח admin): מחזיר את התשובה בלי לשלוח. אפשר גם לדמות שיחה ושעה (simulate, למטה) כדי לבדוק
// תסריטים בלי לקוח אמיתי.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { botToken } from "../../../lib/wa-bot-token";
import { greenApi, sendWhatsAppId, IDAN_WA, ELI_WA, notifyTeam, SC_GROUP } from "../../../lib/store-notify";
import { siteSourceOf, waRefOf } from "../../../lib/site-wa-prefills";
import { SYSTEM, askGemini, type Msg } from "../../../lib/tal";
import { storeProducts, productName } from "../../../data/store-catalog";
import { productBySlug } from "../../../data/store-knowledge";
import { SITE_OFFER } from "../../../data/site-offer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BOT_MODE: "live" | "dry" | "off" = "live";
const ROTEM = process.env.STORE_ALERT_WHATSAPP || "972502256866";
const SITE = "https://www.site-control-il.com";
const DEBOUNCE_MS = 12_000;
const ROTEM_ACTIVE_MINUTES = 10;
// רותם כתב בשיחה ב-30 הדקות האחרונות = "רותם כאן", טל לא אומר מתי הוא יהיה זמין (7.10.2026: טל כתב "9-10 בבוקר" כשרותם היה בשיחה)
const ROTEM_HERE_MINUTES = 30;
const MAX_BOT_REPLIES_PER_DAY = 10;
const INTRO_MARK = "העוזר הדיגיטלי של Site-Control";
const STOCK_MARK = "📦 בדיקת מלאי:";
const READY_MARK = "🟢 טל: לקוח מוכן לקנות";
const ASK_MARK = "❓ טל צריך אותך";
const NOTIFY_COOLDOWN_MS = 60 * 60 * 1000;

type H = { idMessage?: string; timestamp?: number; type?: string; typeMessage?: string; textMessage?: string; extendedTextMessage?: { text?: string }; caption?: string; sendByApi?: boolean };
const textOf = (m: H) => m.textMessage || m.extendedTextMessage?.text || m.caption || "";
const localPhone = (p: string) => p.replace(/^972/, "0");

/** בדיקה ידנית (?dry=1) עם מפתח ה-admin של הכלים המקומיים: מחזיר את התשובה בלי לשלוח */
function adminAuthorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-admin") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`to-rotem:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}
function authorized(req: NextRequest): boolean {
  const want = botToken();
  const got = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return Boolean(want && got) && got.length === want!.length && timingSafeEqual(Buffer.from(got), Buffer.from(want!));
}

// ימי חג בישראל (שבתון) עד סוף 2027. ערב חג כמו שישי.
const CHAG = ["2026-10-03", "2027-04-22", "2027-04-28", "2027-06-11", "2027-10-02", "2027-10-03", "2027-10-11", "2027-10-16", "2027-10-23"];
const il = (d: Date, opts: Intl.DateTimeFormatOptions, locale = "en-US") => new Intl.DateTimeFormat(locale, { timeZone: "Asia/Jerusalem", ...opts }).format(d);
const dayIL = (d: Date) => il(d, { year: "numeric", month: "2-digit", day: "2-digit" }, "en-CA");
const hourIL = (d: Date) => Number(il(d, { hour: "numeric", hour12: false })) % 24;
function restDay(now = new Date()): boolean {
  const wd = il(now, { weekday: "short" });
  const hour = hourIL(now);
  const today = dayIL(now);
  const tomorrow = dayIL(new Date(now.getTime() + 24 * 3600 * 1000));
  const eve = wd === "Fri" || CHAG.includes(tomorrow);
  const holy = wd === "Sat" || CHAG.includes(today);
  return (eve && hour >= 16) || (holy && hour < 20);
}

/** שעות העבודה של עידן היבואן: א'-ה' 08:00-17:00, ו' 08:00-13:00, לא בשבת ובחג. open = אפשר לבדוק מלאי עכשיו; next = מתי
 *  תהיה תשובה כשסגור. 7.10.2026: טל כתב "בודק עכשיו מול היבואן" ב-18:07, אז עכשיו הזמן מחושב כאן ונמסר לטל בהקשר. */
function idanHours(now = new Date()): { open: boolean; next: string } {
  const wd = il(now, { weekday: "short" });
  const hour = hourIL(now);
  const today = dayIL(now);
  const tomorrow = dayIL(new Date(now.getTime() + 24 * 3600 * 1000));
  const chag = CHAG.includes(today);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu"].includes(wd);
  const open = !chag && ((weekday && hour >= 8 && hour < 17) || (wd === "Fri" && hour >= 8 && hour < 13));
  let next = "מחר מ-08:00";
  if (!chag && hour < 8 && (weekday || wd === "Fri")) next = "היום מ-08:00";
  else if (wd === "Fri" || wd === "Sat") next = "ביום ראשון מ-08:00";
  else if (wd === "Thu" && hour >= 17) next = "מחר (שישי) מ-08:00";
  if (chag || CHAG.includes(tomorrow)) next = "אחרי החג, מ-08:00";
  return { open, next };
}

const WHATSAPP_RULES = `

# ערוץ: ווצאפ (גובר על כללים 2, 4 ו-6 למעלה כשיש סתירה)
אתה טל, העוזר של רותם גולן מ-Site-Control, ועונה עכשיו בווצאפ מהמספר העסקי (050-2256866) ללקוח שפנה מכפתור באתר. רותם עצמו לא זמין כרגע (לילה או עסוק), ואתה מחזיק את השיחה עד שהוא פנוי. זה גם הטלפון שרותם מדבר ממנו, אז כשהוא יחזור, הוא יכתוב או יתקשר מכאן.
- הצגה עצמית פעם אחת בלבד בשיחה. ההקשר למטה אומר אם כבר הצגת את עצמך. אם עוד לא: ההודעה מתחילה ב: "היי, כאן טל, ${INTRO_MARK} 👋", ואחרי זה בלי אימוג'י. אם כבר הצגת: ההודעה לא מתחילה ב"היי, כאן טל", ולא מזכירים שוב מי אתה או שאתה עוזר דיגיטלי (אלא אם שואלים).
- כתוב כמו הודעת ווצאפ: קצר, עד 80 מילים, שורות קצרות, בלי markdown ובלי כוכביות.
- פנייה כללית (רותם 6.10.2026, ככה הוא עונה): כשהלקוח כתב רק את ההודעה הכללית מהכפתור באתר ("אשמח לייעוץ לגבי מצלמות אבטחה / אינטרקום"), או מילה אחת כמו "מחיר", לא עונים "מה תרצה לדעת?" ולא נוקבים מחיר. נותנים לו לבחור בקלות, כי הרבה לקוחות לא יודעים איך לנסח: "מה מחפשים? אפשר לענות במספר: 1. מצלמות לבית 2. מצלמות לעסק 3. מצלמה בלי חשמל ואינטרנט (סולארית 4G) 4. אינטרקום 5. התקנה". על "מחיר" בלי הקשר: "מחיר של מה?", כל המחירים באתר גלויים, ושאלה אחת כמו שרותם שואל: "איזה דגם ראית?" או "חיפשת מצלמת אבטחה או אינטרקום?". ומוסיפים שאם נוח יותר לדבר בטלפון, רותם יכול להתקשר.
- כשהלקוח ענה במספר או בחר תחום, מתחילים משם בשאלת בירור אחת: לבית: כמה מצלמות ואיפה (כניסה, חניה, חצר); לעסק: איזה עסק וכמה נקודות; סולארי: איזה מקום ויש בו קליטה סלולרית; אינטרקום: בית פרטי או בניין, ויש כבל קיים מהדלת; התקנה: איזה יישוב ומה צריך להתקין.
- מותר לשלוח קישור רק לדפים האלה (חוץ מקישורי המוצרים שהמערכת מוסיפה): ערכות לבית https://www.site-control-il.com/store/c/kits , מצלמות Wi-Fi https://www.site-control-il.com/store/c/wifi , מצלמות לעסק https://www.site-control-il.com/store/c/ip , סולארי 4G https://www.site-control-il.com/store/c/solar , אינטרקום https://www.site-control-il.com/store/c/intercom , התקנה https://www.site-control-il.com/installation , שאלון התאמה https://www.site-control-il.com/store/finder .
- מבררים, לא רק עונים. בשיחה כזאת חשוב להבין, שאלה אחת או שתיים בכל הודעה: איך קוראים ללקוח או ללקוחה; איפה הבית או העסק (יישוב, בית פרטי או דירה, קומה); מה רוצים לאבטח ולאיזה כיוון (כניסה, חניה, חצר, פנים הבית); כמה נקודות; האם יש חשמל ואינטרנט במקום; האם בסדר להעביר כבלים, או שעדיף אלחוטי. כשהלקוח כבר ענה, לא שואלים שוב.
- מסבירים יתרונות וחסרונות, בשורה או שתיים לכל צד, כמו מתקין מנוסה: קווי (PoE עם מקליט) יציב, מקליט 24/7 לדיסק ונראה בטלוויזיה, אבל צריך להעביר כבל לכל מצלמה; אלחוטי (Wi-Fi) מתקינים לבד בלי כבלים, אבל תלוי בקליטה וצריך שקע ליד כל מצלמה; סוללה/4G לאתר בלי חשמל ואינטרנט. באינטרקום: 2 גידים על הכבל הקיים (עם או בלי אפליקציה), IP למי שיש תשתית רשת, והיברידי לדירה בבניין ישן שרוצה לענות מהנייד. למבוגרים: מסך פיזי בכבל, בלי אפליקציה.
- משתמשים בטיפים של עידן היבואן ובמה שלמדנו משיחות (בידע למטה): למשל חלופה שבמלאי, זרוע לכיפה, מסך נוסף לאינטרקום, מצלמה שעוקבת לבד למי שלא מסתדר עם אפליקציה. זה מה שמבדיל בין בוט למוכר טוב.
- אין כרטיסי מוצר בווצאפ. מוצרים שאתה ממליץ עליהם מחזירים ב-products, והמערכת מוסיפה את הקישורים לבד. לא כותבים כתובות של מוצרים בעצמך (קישורי קטגוריות: ראו למטה).
- הלקוח כבר בווצאפ: לא מבקשים ממנו טלפון ולא שולחים קישור wa.me. מותר לבקש שם.
- מלאי: אף פעם לא מבטיחים מהראש שיש במלאי. כשהלקוח שואל אם מוצר מסוים במלאי, או רוצה לקנות אותו, מחזירים את ה-slug שלו בשדה stock_check, והמערכת שואלת את עידן היבואן. היבואן עובד א'-ה' 08:00-17:00, ו' 08:00-13:00, לא בשבת ובחג, וההקשר למטה אומר אם הוא פתוח עכשיו. כשפתוח: "אני בודק עכשיו מול היבואן וחוזר אליך תוך זמן קצר". כשסגור, אומרים את האמת (רותם 7.10.2026: טל כתב "בודק עכשיו" ב-18:07): "היבואן סגור עכשיו, אני בודק ומחזיר תשובה {מתי, לפי ההקשר}", ולא "בודק עכשיו". לא ממציאים תשובת מלאי. אם בשיחה כבר כתוב שבדקנו ("בדקנו מול היבואן"), לא בודקים שוב את אותו מוצר, אלא ממשיכים משם.
- כשההקשר אומר "תוצאת בדיקת מלאי": זו התשובה של עידן. מעבירים אותה ללקוח בפשטות ("בדקנו, יש במלאי ואספקה מיידית" / "לא במלאי כרגע, ועידן ממליץ על..."), ומתקדמים למכירה: איך נוח לו לקבל, איסוף עצמי בתיאום או משלוח לכתובת (המשלוח בתשלום לפי כתובת), ואיך מזמינים.
- איך קונים: מזמינים מדף המוצר באתר (הוספה לעגלה ושליחת הזמנה עם קוד אימות בווצאפ). ההזמנה לא מחייבת: לא גובים כלום עד שרותם מאשר מלאי ומחיר משלוח. אפשר גם פשוט לכתוב כאן מה רוצים להזמין ולאיזו כתובת, ורותם יאשר.
- תשלום (רותם 7.10.2026, אחרי העסקה הראשונה): אין לינק תשלום ואין סליקה באתר. כשהלקוח מבקש לינק לתשלום או רוצה לשלם באשראי, עונים: "כרגע אין לינק תשלום באתר. אפשר אשראי בטלפון מול היבואן שלנו בפתח תקווה, או ביט/העברה לרותם. רותם חוזר אליך תוך דקות בשעות הפעילות". אסור להבטיח לינק, גם לא "רותם ישלח לך לינק". בשדה escalate כותבים "תשלום: {מה הלקוח קונה ואיך הוא רוצה לשלם}".
- לפני תשלום או איסוף אוספים את הפרטים למסמך ולמסירה, שאלה או שתיים בכל הודעה ולא הכול בבת אחת: שם מלא; מייל שאליו נשלח המסמך; אם זה עסק, שם החברה וח.פ.; מי אוסף (איסוף מהיבואן בפתח תקווה) או כתובת למשלוח. מה שהלקוח כבר כתב, לא שואלים שוב. חובה: באותה הודעה שבה מבקשים את הפרטים הראשונים מוסיפים שורה אחת עם תוספת אחת או שתיים שבאמת מתאימות (זה מה שעידן עשה בטלפון ומכר כרטיס 128GB): למצלמות סוללה/4G כרטיס זיכרון 128GB (אין לו מחיר בקטלוג: "בתוספת קטנה, המחיר הסופי בהזמנה", לא ממציאים מחיר); סים של החנות (${SITE_OFFER.sim.price} ₪ לשנה); ענן דרכנו (${SITE_OFFER.cloud.price} ₪ לשנה למצלמה, הכול כלול). למשל: "רוצה להוסיף כרטיס זיכרון 128GB או סים? בתוספת קטנה, המחיר הסופי בהזמנה".
- סכום סופי: לעולם לא כותבים "הסכום הסופי הוא X" ולא מסכמים כמה שולם. מחירי האתר הם מחירי מדף למוצר; מה שנגבה בפועל (עם תוספות, משלוח) יודע רק מי שגבה. אומרים: "רותם ישלח את הסכום המדויק עם החשבונית".
- אחרי שהלקוח כתב ששילם, שסגר, או שחייבו אותו: לא ממשיכים למכור ולא מציעים תוספות. רק מודים בקצרה, אומרים שרותם ישלח את המסמך למייל, ואם עוד אין מייל או שם לחשבונית, מבקשים רק אותם. בשדה escalate כותבים "נסגר: {מה נקנה, שם לחשבונית, ח.פ. אם יש, מייל}" ו-intent הוא ready.
- מחיר שרותם כבר כתב ללקוח בשיחה הזאת מחייב, גם אם במחירון כתוב אחרת. לא סותרים אותו.
- אתה גם מתאם שיחות של רותם. לקוח שרוצה לדבר עם בן אדם, או שהשאלה שלו דורשת את רותם (הנחה, כמות, התקנה, משהו שאתה לא בטוח בו): מציעים שרותם יחזור אליו מהטלפון הזה, ושואלים מתי נוח. אומרים בכנות מתי רותם זמין לפי השעה עכשיו (שעות הפעילות: ${"א'-ה' 08:00-18:00, ו' 08:00-14:00"}). למשל באחת בלילה: "בשעה כזאת רותם עוד לא זמין, בסביבות 9-10 בבוקר הוא כבר יהיה, ואני מוסר לו שיחזור אליך מהטלפון הזה". אחרי שהלקוח אישר: כותבים בשדה escalate "לחזור ל{שם} ב{שעה שביקש}: {מה הוא רוצה}", כדי שרותם יקבל תזכורת.
- הזמינות של רותם: רק כשההקשר אומר שרותם לא כתב בשיחה הזאת ב-30 הדקות האחרונות אומרים מתי הוא יהיה זמין. אם רותם כתב כאן לאחרונה, הוא כאן: "רותם כאן ויענה לך", בלי "רותם יהיה זמין ב-".
- לא חוזרים על מה שכבר נאמר בשיחה, ולא שואלים שוב שאלה שהלקוח כבר ענה עליה.
- כשרותם חוזר לשיחה, הוא כותב מהטלפון בעצמו. אתה לא מתחזה לרותם ולא מדבר בשמו בגוף ראשון.`;

// הלקוח כתב ששילם או סגר: טל מודה ולא ממשיך למכור (7.10.2026: אחרי "שילמתי כבר" טל המשיך עם "הסכום הסופי")
const PAID_RE = /שילמתי|שלמתי|שילמנו|שולם|חויבתי|חייבו אותי|חייבת אותי|העברתי (לך|לכם|את ה)|סגרתי|שלחתי ביט|ביט נשלח|הכסף (עבר|נשלח|הועבר)/;
// עובדה חדשה שמצדיקה התראה נוספת גם בתוך שעת ההמתנה: תשלום, פרטים לחשבונית, מייל
const NEW_FACT_RE = /שילמתי|שלמתי|שילמנו|שולם|חויבתי|חייבו אותי|העברתי|חשבונית|ח\.?פ\.?|ח"פ|[\w.+-]+@[\w-]+\.[\w.]+/;

// כלל 6: אותה התראה (אותו לקוח, אותו סוג) לא יותר מפעם בשעה. זיכרון של הפונקציה (ב-Vercel לא אמין, כל מופע לחוד),
// ולכן גם גיבוי: 20 ההודעות האחרונות בקבוצה. ההתראה נשלחת לקבוצה כ"{סימן} ({טלפון})" בשורה הראשונה, אז מחפשים את שניהם.
const recentAlerts = new Map<string, number>();
async function alertedRecently(phone: string, marker: string, nowMs: number): Promise<boolean> {
  const key = `${phone}:${marker}`;
  const mem = recentAlerts.get(key);
  if (mem && nowMs - mem < NOTIFY_COOLDOWN_MS) return true;
  const group = await greenApi<H[]>("getChatHistory", { chatId: SC_GROUP, count: 20 });
  const since = (nowMs - NOTIFY_COOLDOWN_MS) / 1000;
  return Boolean(group?.some((m) => m.type === "outgoing" && (m.timestamp || 0) > since && textOf(m).includes(marker) && textOf(m).includes(localPhone(phone))));
}

export async function POST(req: NextRequest) {
  const dry = req.nextUrl.searchParams.get("dry") === "1" && adminAuthorized(req); // בדיקה ידנית: מחזיר את התשובה בלי לשלוח
  // kick: לפתוח שיחה עם ליד שכבר מחכה (webhook נשלח רק על הודעות חדשות). כל כללי הבטיחות חלים, בלי המתנה.
  const kick = req.nextUrl.searchParams.get("kick") === "1" && adminAuthorized(req);
  if (!dry && !kick && !authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  let n: { typeWebhook?: string; senderData?: { chatId?: string; senderName?: string }; idMessage?: string; messageData?: { typeMessage?: string }; stockResult?: { slug?: string; answer?: string }; followUp?: { step?: number; note?: string }; trustedLead?: { source?: string }; simulate?: { history?: H[]; now?: string } };
  try { n = await req.json(); } catch { return NextResponse.json({ ok: true }); }
  // תוצאת בדיקת מלאי מהכלי המקומי (רק עם מפתח admin): טל ממשיך את השיחה עם תשובת עידן
  const stockResult = kick && n.stockResult && typeof n.stockResult.answer === "string" ? n.stockResult : undefined;
  // פולואפ יזום אחרי הצעת מחיר (מהכלי המקומי followups.js): {step: 1|2|3, note: "..."}. טל כותב את הפולואפ לפי השיחה.
  const followUp = kick && n.followUp && typeof n.followUp.step === "number" ? n.followUp : undefined;
  const proactive = Boolean(stockResult || followUp);
  // ליד שרשום בטבלת הלידים אבל ההודעה הראשונה שלו לא בהיסטוריה (הגיע בזמן ניתוק GreenAPI, 6.10.2026). רק מהכלים
  // המקומיים (מפתח admin), שמפעילים את זה רק לשורות מהטבלה.
  const trustedLead = kick && n.trustedLead ? n.trustedLead : undefined;
  // דימוי (רק ב-dry, 7.10.2026): simulate.history במקום ההיסטוריה מ-GreenAPI, simulate.now במקום השעה. לבדיקת תסריטים
  // (לינק אשראי, "שילמתי", הודעה ב-23:00) בלי לקוח אמיתי. שום דבר לא נשלח במצב dry.
  const sim = dry && n.simulate && Array.isArray(n.simulate.history) ? n.simulate : undefined;
  const nowDate = sim?.now && !Number.isNaN(Date.parse(sim.now)) ? new Date(sim.now) : new Date();
  // החיבור לווצאפ נותק (6.10.2026: נותק יום שלם בלי שאף אחד ידע): התראה במייל, כי בווצאפ אי אפשר לשלוח
  if (n.typeWebhook === "stateInstanceChanged") {
    const state = String((n as { stateInstance?: string }).stateInstance || "");
    // "starting" = הפעלה מחדש של כמה שניות אצל GreenAPI, לא ניתוק (9.10.2026: 10 התראות שווא בלילה אחד)
    if (state && state !== "authorized" && state !== "starting") {
      await notifyTeam(`⚠️ הווצאפ של Site-Control התנתק (${state})`, `החיבור של GreenAPI למספר 050-2256866 התנתק. עד שמחברים מחדש: טל לא עונה, לידים לא נקלטים, פולואפים ובדיקות מלאי לא יוצאים. גם מערכת הלידים של TimelapseIT משתמשת באותו חיבור.\n\nלחיבור מחדש מהטלפון: לבקש מקלוד קוד חיבור, ואז בווצאפ: הגדרות > מכשירים מקושרים > קישור מכשיר > קישור עם מספר טלפון במקום.`).catch(() => undefined);
    }
    return NextResponse.json({ ok: true });
  }
  if (BOT_MODE === "off" && !dry) return NextResponse.json({ ok: true, skip: "off" });
  if (n.typeWebhook !== "incomingMessageReceived") return NextResponse.json({ ok: true });
  const chatId = String(n.senderData?.chatId || "");
  const phone = chatId.replace(/@c\.us$/, "");
  // קבוצות (גם קבוצת ההזמנות SUPPLIER_GROUP) נופלות כבר בבדיקת @c.us. אלי נוסף 7.10.2026: הוא עונה במקום עידן, לא ליד
  if (!/^\d{11,13}@c\.us$/.test(chatId) || phone === IDAN_WA || phone === ELI_WA || phone === ROTEM) return NextResponse.json({ ok: true, skip: "chat" });
  if (restDay(nowDate) && !dry) return NextResponse.json({ ok: true, skip: "shabbat" });

  if (!dry && !kick) await new Promise((r) => setTimeout(r, DEBOUNCE_MS));
  // getChatHistory של GreenAPI נכשל לפעמים (502 / רשימה ריקה) לשיחה שבטוח יש בה הודעות: עד 3 ניסיונות
  let history: H[] | null = sim ? sim.history! : null;
  for (let i = 0; i < 3 && !sim && !history?.length; i++) {
    if (i) await new Promise((r) => setTimeout(r, 3000));
    history = await greenApi<H[]>("getChatHistory", { chatId, count: 40 });
  }
  if (!history?.length) return NextResponse.json({ ok: true, skip: "no history" });
  const msgs = [...history].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  // 1. רק לידים מהאתר של Site-Control
  const prefill = msgs.find((m) => m.type === "incoming" && siteSourceOf(textOf(m)));
  if (!prefill && !trustedLead) return NextResponse.json({ ok: true, skip: "not a site lead" });
  // 4. עונים רק כשההודעה האחרונה בשיחה היא נכנסת (אין עדיין תשובה אחריה)
  const last = msgs[msgs.length - 1];
  if (last.type !== "incoming" && !proactive) return NextResponse.json({ ok: true, skip: "already answered" });
  if (followUp && last.type === "incoming") return NextResponse.json({ ok: true, skip: "customer replied, no follow-up needed" });
  if (!dry && !kick && n.idMessage && last.idMessage !== n.idMessage) return NextResponse.json({ ok: true, skip: "newer message pending" });
  // 2. רותם פעיל בשיחה
  const now = nowDate.getTime() / 1000;
  const rotemWrote = (minutes: number) => msgs.some((m) => m.type === "outgoing" && m.sendByApi === false && now - (m.timestamp || 0) < minutes * 60);
  const rotemRecent = rotemWrote(ROTEM_ACTIVE_MINUTES);
  if (rotemRecent && !dry && !proactive) return NextResponse.json({ ok: true, skip: "rotem active" });
  // 5. תקרה יומית
  const botToday = msgs.filter((m) => m.type === "outgoing" && m.sendByApi && textOf(m) && now - (m.timestamp || 0) < 24 * 3600).length;
  if (botToday >= MAX_BOT_REPLIES_PER_DAY && !dry) return NextResponse.json({ ok: true, skip: "daily cap" });

  // השיחה כקלט לטל: נכנס = לקוח, יוצא (רותם או מערכת) = הצד שלנו. הודעות רצופות מאותו צד מאוחדות.
  const conv: Msg[] = [];
  for (const m of msgs.slice(-20)) {
    const t = textOf(m) || (m.typeMessage === "audioMessage" ? "[הודעה קולית]" : m.typeMessage === "imageMessage" ? "[תמונה]" : m.typeMessage ? `[${m.typeMessage}]` : "");
    if (!t) continue;
    const role: Msg["role"] = m.type === "incoming" ? "user" : "assistant";
    const prev = conv[conv.length - 1];
    if (prev && prev.role === role) prev.content = `${prev.content}\n${t}`.slice(-1500);
    else conv.push({ role, content: t.slice(0, 1500) });
  }
  while (conv.length && conv[0].role !== "user") conv.shift();
  if (proactive && conv.length && conv[conv.length - 1].role !== "user") conv.push({ role: "user", content: stockResult ? "(ממתין לתשובה על המלאי)" : "(הלקוח לא ענה מאז ההודעה האחרונה שלנו)" });
  if (!conv.length || conv[conv.length - 1].role !== "user") return NextResponse.json({ ok: true, skip: "no user turn" });
  const lastUserText = conv[conv.length - 1].content;

  const nowIL = il(nowDate, { weekday: "long", hour: "2-digit", minute: "2-digit" }, "he-IL");
  const ctx: string[] = [`השעה עכשיו בישראל: ${nowIL}.`, `הלקוח פנה מהאתר (${prefill ? siteSourceOf(textOf(prefill)) : trustedLead?.source || "כפתור ווצאפ"}).`];
  const fromPage = prefill ? storeProducts.find((p) => textOf(prefill).includes(p.title)) : undefined;
  if (fromPage) ctx.push(`הוא כתב מדף המוצר ${productName(fromPage)} [${fromPage.slug}], מחיר באתר ${fromPage.price ? `${fromPage.price} ₪` : "לפי פנייה"}.`);
  const waitedH = (now - (last.timestamp || now)) / 3600;
  if (waitedH > 3 && last.type === "incoming" && !proactive) ctx.push(`ההודעה האחרונה של הלקוח חיכתה ${Math.round(waitedH)} שעות בלי מענה: פתח בהתנצלות קצרה על העיכוב.`);
  // שעות היבואן והזמינות של רותם מחושבות כאן, לא אצל טל (7.10.2026)
  const idan = idanHours(nowDate);
  ctx.push(idan.open ? "היבואן פתוח עכשיו: על מלאי אפשר לומר \"אני בודק עכשיו מול היבואן\"." : `היבואן סגור עכשיו. תשובת מלאי תהיה ${idan.next}. לא אומרים "בודק עכשיו".`);
  ctx.push(rotemWrote(ROTEM_HERE_MINUTES) ? "רותם כתב בשיחה הזאת ב-30 הדקות האחרונות: רותם כאן. לא אומרים מתי הוא יהיה זמין." : "רותם לא כתב בשיחה הזאת ב-30 הדקות האחרונות: אם צריך אותו, אומרים בכנות מתי הוא זמין לפי השעה.");
  const paid = PAID_RE.test(lastUserText);
  if (paid) ctx.push("הלקוח כתב ששילם או שסגר את העסקה: לא מוכרים יותר ולא מציעים תוספות. רק תודה קצרה, רותם ישלח את המסמך למייל, ובקשה לפרטים שחסרים למסמך (שם לחשבונית, ח.פ. אם זה עסק, מייל) אם עוד לא נמסרו. לא נוקבים סכום. escalate מתחיל ב\"נסגר:\".");
  if (followUp) {
    const steps: Record<number, string> = {
      1: "פולואפ ראשון, יומיים אחרי ההצעה: לוודא בקצרה שההצעה התקבלה ושהכול ברור, ולהציע לענות על שאלות. הודעה קצרה וחמה, בלי לחץ.",
      2: "פולואפ שני, כמה ימים אחרי: לשאול אם עבר על ההצעה, אם משהו חסר או שרוצה לשנות משהו (כמות, דגם, התקנה), ולהזכיר שאפשר לדבר עם רותם.",
      3: "פולואפ אחרון: הודעה קצרה ומכבדת. אם זה לא מתאים כרגע, בסדר גמור, ההצעה נשארת בתוקף ואפשר לחזור מתי שנוח. לא שולחים אחרי זה יותר.",
    };
    ctx.push(`זה פולואפ יזום (${steps[followUp.step ?? 2] || steps[2]})${followUp.note ? ` מה שהוצע: ${String(followUp.note).slice(0, 300)}.` : ""} לא ממציאים שינויים בהצעה, לא מורידים מחיר. השדה stock_check ריק.`);
  }
  if (stockResult) {
    const sp = stockResult.slug ? productBySlug(stockResult.slug) : undefined;
    ctx.push(`תוצאת בדיקת מלאי מעידן היבואן${sp ? ` על ${productName(sp)} [${sp.slug}]` : ""}: "${String(stockResult.answer).slice(0, 400)}". תעביר ללקוח ותתקדם למכירה.`);
  }
  const introduced = msgs.some((m) => m.type === "outgoing" && textOf(m).includes(INTRO_MARK));
  ctx.push(introduced ? "כבר הצגת את עצמך בשיחה הזאת: אל תציג שוב, ואל תתחיל ב\"היי, כאן טל\"." : "עוד לא הצגת את עצמך בשיחה הזאת.");
  if (n.senderData?.senderName) ctx.push(`השם שלו בווצאפ: ${n.senderData.senderName} (אפשר לפנות בשם הפרטי אם נראה כמו שם אמיתי).`);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false, error: "no gemini key" }, { status: 503 });

  let data;
  try { data = await askGemini(apiKey, `${SYSTEM}${WHATSAPP_RULES}\n\n# הקשר נוכחי\n${ctx.join("\n")}`, conv); }
  catch (e) { console.error("wa bot gemini", e instanceof Error ? e.message : e); return NextResponse.json({ ok: false, error: "gemini" }, { status: 200 }); }

  const links = data.products.map((s) => productBySlug(s.trim().replace(/^\[|\]$/g, ""))).filter(Boolean).slice(0, 3)
    .map((p) => `${productName(p!)}${p!.price ? `, ${p!.price.toLocaleString("he-IL")} ₪` : ""}:\n${SITE}/store/${p!.slug}`);
  const body = data.reply.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/^\s*[*-]\s+/gm, "• ").trim();
  const text = [body, ...links].filter(Boolean).join("\n\n").slice(0, 3500);

  // התראה לרותם: שאלה שצריך אותו, או לקוח שמוכן לקנות. כלל 6: לא אותה התראה פעמיים בשעה, אלא אם יש עובדה חדשה.
  const wantAlert = Boolean(data.escalate.trim()) || data.intent === "ready";
  const marker = data.intent === "ready" ? READY_MARK : ASK_MARK;
  const newFact = NEW_FACT_RE.test(lastUserText);
  const suppressed = wantAlert && !newFact && (await alertedRecently(phone, marker, nowDate.getTime()));
  if (dry) return NextResponse.json({ ok: true, dry: true, simulated: Boolean(sim), text, escalate: data.escalate, intent: data.intent, stock_check: data.stock_check, followUp: followUp?.step, alert: wantAlert ? (suppressed ? "suppressed (sent in the last hour)" : "would send") : "none", ctx });
  // בקשת בדיקת מלאי: הודעה מסומנת לווצאפ של רותם (לעצמו). הכלי המקומי (stock-check.js) קורא אותה, שואל את עידן
  // בשעות העבודה שלו, ומחזיר את התשובה לכאן עם stockResult. רותם 5.10.2026: "לא להציק לו סתם, רק בשעות עבודה".
  // 7.10.2026: הסימון נשאר בקבוצה הפנימית (SC_GROUP), לא בקבוצת ההזמנות מול הספק. לספק יוצאת רק השאלה המנוסחת
  // של הכלי המקומי, דרך /api/whatsapp/to-idan (שמעכשיו שולח לקבוצת ההזמנות).
  const stockProduct = data.stock_check ? productBySlug(data.stock_check.trim().replace(/^\[|\]$/g, "")) : undefined;
  if (stockProduct && !proactive) {
    await sendWhatsAppId(SC_GROUP, `${STOCK_MARK} ${phone} ${stockProduct.slug}
לקוח: ${n.senderData?.senderName || localPhone(phone)}
מוצר: ${productName(stockProduct)}${stockProduct.sku ? ` (מק"ט ${stockProduct.sku})` : ""}, ${stockProduct.price ? `${stockProduct.price} ₪` : "לפי פנייה"}
(טל שואל את עידן בשעות העבודה שלו, ומחזיר ללקוח)`);
  }

  // מצב dry: לרותם בלבד
  if (BOT_MODE === "dry") {
    await sendWhatsAppId(SC_GROUP, `🤖 טל היה עונה ל-${localPhone(phone)}:\n\n${text}`);
    return NextResponse.json({ ok: true, mode: "dry" });
  }
  const id = await sendWhatsAppId(phone, text);
  if (wantAlert && !suppressed) {
    recentAlerts.set(`${phone}:${marker}`, nowDate.getTime());
    const lastIn = textOf(last).slice(0, 300);
    const ref = prefill ? waRefOf(textOf(prefill)) : null;
    await notifyTeam(
      `${marker} (${localPhone(phone)})`,
      `${data.escalate ? `שאלה: ${data.escalate}\n` : ""}${data.lead_summary ? `סיכום: ${data.lead_summary}\n` : ""}${ref ? `מס' פנייה: ${ref}\n` : ""}הלקוח כתב: ${lastIn}\n\nטל ענה:\n${text}\n\nכדי לקחת את השיחה: פשוט לכתוב לו מהטלפון. טל מחכה 10 דקות אחרי כל הודעה שלך ואז ממשיך.`,
    ).catch(() => undefined);
  }
  return NextResponse.json({ ok: Boolean(id), sent: Boolean(id), alert: wantAlert ? (suppressed ? "suppressed" : "sent") : "none" });
}
