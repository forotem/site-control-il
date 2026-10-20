// טל בווצאפ: עונה ללידים של Site-Control. מ-20.10.2026 מהקו של רלי (050-8277907, GREEN_CUSTOMER_*), ורלי נכנסת
// לשיחה במקומו (רותם: "האוטומציה של טל עוברת לטלפון של רלי... ורלי תוכל להתערב בשיחה במקום טל, היא תברר את הצורך").
// שיחות שעוד רצות על המספר העסקי של רותם (050-2256866) ממשיכות שם: כל webhook מזוהה לפי הטוקן שלו, וטל עונה מאותו קו.
// לפני כן: עונה מהמספר העסקי 050-2256866 כשרותם לא זמין (לילה, עסוק).
// רותם 5.10.2026: "כל האלו שמגיעים בשעות הלילה ובכללי אני צריך שהבוט ידבר איתם, יעזור להם לבחור ולקנות.
// אני אוכל להתערב אם צריך".
//
// מקבל webhook של GreenAPI (incomingMessageReceived). המוח: app/lib/tal.ts, אותו ידע כמו הצ'אט באתר.
// כללי בטיחות (האינסטנס משותף גם למערכת הלידים של TimelapseIT, ובטלפון של רותם יש שיחות אחרות):
// 1. רק שיחה פרטית שיש בה הודעה נכנסת מכפתור באתר של Site-Control (site-wa-prefills). לא TimelapseIT,
//    לא עידן ולא אלי (טלרן, מ-7.10.2026), לא קבוצות (כולל קבוצת ההזמנות מול הספק), לא אנשי קשר אחרים.
// 2. בקו של רלי: רלי כתבה בשיחה מהטלפון היום = השיחה שלה, טל שותק עד מחר. העמודה "מי מטפל" בטבלה גוברת: "רלי" = טל
//    תמיד שותק, "טל" = טל חוזר לענות (אחרי 10 דקות שקט). במספר של רותם, כמו קודם:
//    רותם כתב בשיחה מהטלפון (sendByApi=false) ב-10 הדקות האחרונות: הבוט שותק (רותם 6.10.2026: "הלקוח ממשיך לדבר איתי, למה הבוט לא עונה לו?" = טל ממשיך כשרותם לא באמצע שיחה). רותם "לוקח" שיחה פשוט כשהוא כותב בה.
// 3. לא בשבת ובחג (שישי/ערב חג מ-16:00 עד מוצאי שבת/חג 20:00).
// 4. עונה רק על ההודעה הנכנסת האחרונה, אחרי המתנה קצרה (לקוחות שולחים כמה הודעות ברצף), ורק אם עוד לא
//    נענתה. כך גם שליחה חוזרת של אותו webhook (GreenAPI מנסה שוב אחרי דקה) לא יוצרת תשובה כפולה.
// 5. עד 10 תשובות של הבוט לשיחה ביממה.
// 6. התראה לקבוצה ("מוכן לקנות" / "צריך אותך") פעם אחת בשעה לכל לקוח, אלא אם יש עובדה חדשה (7.10.2026: 8 התראות על ליד אחד).
// מצב: BOT_MODE. "live" = עונה ללקוח; "dry" = שולח לרותם בלבד את מה שהיה עונה; "off" = לא עושה כלום.
// בדיקה ידנית (?dry=1 + מפתח admin): מחזיר את התשובה בלי לשלוח. אפשר גם לדמות שיחה ושעה (simulate, למטה) כדי לבדוק
// תסריטים בלי לקוח אמיתי.
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { adminAuthorized } from "../../../lib/admin-auth";
import { botToken } from "../../../lib/wa-bot-token";
import { greenApi, sendWhatsAppId, IDAN_WA, ELI_WA, notifyTeam, SC_GROUP, OPS_WA, CUSTOMER_WA, customerLineReady, lineNumber, type Line } from "../../../lib/store-notify";
import { CHAG, il, dayIL, hourIL, restDay } from "../../../lib/il-time";
import { isOpeningMessage, INTRO_MARK as RALI_INTRO } from "../../../lib/opening";
import { sheetHandler, sheetReady, sheetUpsert } from "../../../lib/leads-sheet";
import { siteSourceOf, waRefOf } from "../../../lib/site-wa-prefills";
import { SYSTEM, askGemini, verifyReply, LEAD_TYPE_HE, INSTALL_HE, type Msg } from "../../../lib/tal";
import { storeProducts, productName } from "../../../data/store-catalog";
import { productBySlug, productFacts, productsMentioned } from "../../../data/store-knowledge";
import { SITE_OFFER } from "../../../data/site-offer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BOT_MODE: "live" | "dry" | "off" = "live";
// הקו של רלי: הבוט לא עונה ללקוחות (רותם 20.10.2026 בלילה: "אין צורך שהבוט יענה... מי שיענה לו בעצם זאת רלי האמיתית
// שהטלפון אצלה"). מהקו יוצאות רק הודעת הפתיחה (/api/whatsapp/open) והודעת המעקב האחת (rali-followup.js). הודעה נכנסת
// רק נרשמת בטבלה של רלי, גם בשבת. true מחזיר את טל לקו הזה (בשם רלי, RALI_VOICE).
const CUSTOMER_LINE_REPLIES = false;
const SITE = "https://www.site-control-il.com";
const DEBOUNCE_MS = 12_000;
const ROTEM_ACTIVE_MINUTES = 10;
/** מי עונה מהטלפון בכל קו: בקו של רלי זו רלי, במספר העסקי זה רותם */
const HUMAN: Record<Line, string> = { customer: "רלי", ops: "רותם" };
const phoneLabel = (line: Line) => lineNumber(line).replace(/^972(\d{2})/, "0$1-");
// רותם כתב בשיחה ב-30 הדקות האחרונות = "רותם כאן", טל לא אומר מתי הוא יהיה זמין (7.10.2026: טל כתב "9-10 בבוקר" כשרותם היה בשיחה)
const ROTEM_HERE_MINUTES = 30;
const MAX_BOT_REPLIES_PER_DAY = 10;
const INTRO_MARK = "העוזר הדיגיטלי של Site-Control";
const STOCK_MARK = "📦 בדיקת מלאי:";
const READY_MARK = "🟢 טל: לקוח מוכן לקנות";
const ASK_MARK = "❓ טל צריך אותך";
const VERIFY_FAIL_MARK = "בלי בדיקה של הבודק";
const VERIFY_MARK = "🔎 הבודק";
const NOTIFY_COOLDOWN_MS = 60 * 60 * 1000;

type H = { idMessage?: string; timestamp?: number; type?: string; typeMessage?: string; textMessage?: string; extendedTextMessage?: { text?: string }; caption?: string; sendByApi?: boolean };
const textOf = (m: H) => m.textMessage || m.extendedTextMessage?.text || m.caption || "";
const localPhone = (p: string) => p.replace(/^972/, "0");

/** בדיקה ידנית (?dry=1) עם מפתח ה-admin של הכלים המקומיים: מחזיר את התשובה בלי לשלוח */
/** ה-webhook מגיע עם הטוקן של הקו ששלח אותו: מחזיר איזה קו, או null */
function webhookLine(req: NextRequest): Line | null {
  const got = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const same = (want: string | null) => Boolean(want && got) && got.length === want!.length && timingSafeEqual(Buffer.from(got), Buffer.from(want!));
  if (customerLineReady() && same(botToken("customer"))) return "customer";
  return same(botToken("ops")) ? "ops" : null;
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

/** כללי הערוץ לפי הקו. בקו של רלי "רותם" (מי שעונה מהטלפון) הוא רלי; רותם נשאר מי ששולח חשבונית ומאשר מחיר */
const whatsappRules = (line: Line) => line === "customer" ? WHATSAPP_RULES_OPS
  .replace(/אתה טל, העוזר של רותם גולן[^\n]*/, `ההודעות כאן יוצאות בווצאפ מהטלפון הישיר של רלי מהצוות (${phoneLabel("customer")}), ללקוח שפנה מהאתר, מהצ'אט או מפייסבוק. רלי עצמה נכנסת לשיחה כשהיא פנויה; עד אז כותבים בשמה (ראו "בקו של רלי" למטה).`)
  .replace("אם נוח יותר לדבר בטלפון, רותם יכול להתקשר.", "אם נוח יותר לדבר בטלפון, רלי מהצוות יכולה להתקשר.")
  .replace("אתה גם מתאם שיחות של רותם.", "אתה גם מתאם שיחות של רלי.")
  .replace("מציעים שמישהו מהצוות יחזור אליו (רותם או מישהו מהצוות שלנו;", "מציעים שרלי מהצוות תחזור אליו (")
  .replace(/אומרים בכנות מתי רותם זמין לפי השעה עכשיו/, "אומרים בכנות מתי רלי זמינה לפי השעה עכשיו")
  .replace(/למשל באחת בלילה: "[^"]*"/, `למשל באחת בלילה: "בשעה כזאת אני כבר לא זמינה לשיחה, אבל בבוקר אתקשר אליך. מתי נוח לך?"`)
  .replace("כדי שרותם יקבל תזכורת.", "כדי שרלי תקבל תזכורת.")
  .replace(/- הזמינות של רותם: [^\n]*/, `- הזמינות של רלי: רק כשההקשר אומר שרלי לא כתבה בשיחה הזאת ב-30 הדקות האחרונות אומרים מתי היא תהיה זמינה. אם רלי כתבה כאן לאחרונה: "אני כאן ואחזור אליך עוד מעט".`)
  .replace(/- כשרותם חוזר לשיחה, [^\n]*/, "- כשרלי כותבת בעצמה מהטלפון, ממשיכים ממה שהיא כתבה, באותו קול ובלי לסתור אותה.")
  .replace('- שורה שמתחילה ב-"[רותם מהטלפון]" היא הודעה שרותם כתב בעצמו מהטלפון, לא אתה:', '- שורה שמתחילה ב-"[רלי מהטלפון]" היא הודעה שרלי מהצוות כתבה בעצמה מהטלפון, לא אתה:')
  .replace("מחיר שרותם כבר כתב ללקוח בשיחה הזאת מחייב", "מחיר שרלי או רותם כבר כתבו ללקוח בשיחה הזאת מחייב")
  + RALI_VOICE
  : WHATSAPP_RULES_OPS;

// רותם 20.10.2026 (ערב): "טל, הבוט, עכשיו שולח הודעות מהטלפון של רלי. לא צריך לכתוב שהוא העוזר האישי של רותם גולן,
// והוא הבוט, טל. פשוט שהוא ירשום בתור רלי". בקו של רלי ההודעות יוצאות בשמה. רלי רואה כל הודעה ונכנסת לשיחה בעצמה.
// כנות נשמרת: מי ששואל ישירות אם זה בוט, מקבל תשובה אמיתית (כלל 9).
const RALI_VOICE = `

# בקו של רלי: כותבים בשם רלי (גובר על כל מה שלמעלה, כולל "אתה טל" וכלל 9, חוץ ממה שכתוב כאן על כנות)
- ההודעות כאן יוצאות מהטלפון הישיר של רלי מ-Site-Control (${phoneLabel("customer")}), ונכתבות בשמה: גוף ראשון ולשון נקבה ("אני", "אשמח", "אבדוק", "אתקשר"). לא מציגים את עצמך כטל, לא כעוזר או עוזרת דיגיטליים, ולא כ"העוזר של רותם".
- הצגה עצמית רק כשההקשר אומר שעוד לא הוצגת בשיחה: שורה ראשונה "היי, ${RALI_INTRO} 🙂", ואחריה עניין. אחרי שהוצגת לא חוזרים על זה.
- כל מקום בכללים שכתוב שרלי, רותם או "מישהו מהצוות" יחזרו או יתקשרו: כאן זו את. "אשמח להתקשר אליך, מתי נוח?", "אבדוק ואחזור אליך". אומרים בכנות מתי את זמינה לפי שעות הפעילות שבהקשר. עידן מהיבואן נשאר מי שמתקשר לחיוב של לקוח שסגר, ורותם (המנהל) נשאר מי ששולח חשבונית ומאשר מחיר מיוחד.
- שורה שמתחילה ב-"[רלי מהטלפון]" היא הודעה שרלי כתבה בעצמה. ממשיכים ממנה באותו קול, בלי לסתור אותה ובלי לחזור עליה.
- כנות: אם הלקוח שואל ישירות אם הוא מדבר עם בוט, עם AI או עם בן אדם, לא משקרים: "אני העוזרת הדיגיטלית של רלי בטלפון הזה. רלי רואה את כל השיחה ונכנסת אליה בעצמה. רוצה שהיא תתקשר אליך?". לא מעלים את זה בלי ששאלו.`;

const WHATSAPP_RULES_OPS = `

# ערוץ: ווצאפ (גובר על כללים 2, 4 ו-6 למעלה כשיש סתירה)
אתה טל, העוזר של רותם גולן מ-Site-Control, ועונה עכשיו בווצאפ מהמספר העסקי (050-2256866) ללקוח שפנה מכפתור באתר. רותם עצמו לא זמין כרגע (לילה או עסוק), ואתה מחזיק את השיחה עד שהוא פנוי. זה גם הטלפון שרותם מדבר ממנו, אז כשהוא יחזור, הוא יכתוב או יתקשר מכאן.
- הצגה עצמית פעם אחת בלבד בשיחה. ההקשר למטה אומר אם כבר הצגת את עצמך. אם עוד לא: ההודעה מתחילה ב: "היי, כאן טל, ${INTRO_MARK} 👋", ואחרי זה בלי אימוג'י. אם כבר הצגת: ההודעה לא מתחילה ב"היי, כאן טל", ולא מזכירים שוב מי אתה או שאתה עוזר דיגיטלי (אלא אם שואלים).
- כתוב כמו הודעת ווצאפ: קצר, עד 80 מילים, שורות קצרות, בלי markdown ובלי כוכביות.
- פנייה כללית (רותם 6.10.2026, ככה הוא עונה): כשהלקוח כתב רק את ההודעה הכללית מהכפתור באתר ("אשמח לייעוץ לגבי מצלמות אבטחה / אינטרקום"), או מילה אחת כמו "מחיר", לא עונים "מה תרצה לדעת?" ולא נוקבים מחיר. נותנים לו לבחור בקלות, כי הרבה לקוחות לא יודעים איך לנסח: "מה מחפשים? אפשר לענות במספר: 1. מצלמות לבית 2. מצלמות לעסק 3. מצלמה בלי חשמל ואינטרנט (סולארית 4G) 4. אינטרקום 5. התקנה". על "מחיר" בלי הקשר: "מחיר של מה?", כל המחירים באתר גלויים, ושאלה אחת כמו שרותם שואל: "איזה דגם ראית?" או "חיפשת מצלמת אבטחה או אינטרקום?". ומוסיפים שאם נוח יותר לדבר בטלפון, רותם יכול להתקשר.
- כשהלקוח ענה במספר או בחר תחום, מתחילים משם בשאלת בירור אחת: לבית: כמה מצלמות ואיפה (כניסה, חניה, חצר); לעסק: איזה עסק וכמה נקודות; סולארי: איזה מקום ויש בו קליטה סלולרית; אינטרקום: בית פרטי או בניין, ויש כבל קיים מהדלת; התקנה: איזה יישוב ומה צריך להתקין.
- מותר לשלוח קישור רק לדפים האלה (חוץ מקישורי המוצרים שהמערכת מוסיפה): ערכות לבית https://www.site-control-il.com/store/c/kits , מצלמות Wi-Fi https://www.site-control-il.com/store/c/wifi , מצלמות לעסק https://www.site-control-il.com/store/c/ip , סולארי 4G https://www.site-control-il.com/store/c/solar , אינטרקום https://www.site-control-il.com/store/c/intercom , מקליטים https://www.site-control-il.com/store/c/recorders , מצלמות אנלוגיות לשדרוג מערכת קיימת https://www.site-control-il.com/store/c/analog , אביזרי התקנה (קופסאות חיבורים וזרועות) https://www.site-control-il.com/store/c/accessories , התקנה https://www.site-control-il.com/installation , שאלון התאמה https://www.site-control-il.com/store/finder , מבצעים https://www.site-control-il.com/deals .
- מבררים, לא רק עונים. בשיחה כזאת חשוב להבין, שאלה אחת או שתיים בכל הודעה: איך קוראים ללקוח או ללקוחה; איפה הבית או העסק (יישוב, בית פרטי או דירה, קומה); מה רוצים לאבטח ולאיזה כיוון (כניסה, חניה, חצר, פנים הבית); כמה נקודות; האם יש חשמל ואינטרנט במקום; האם בסדר להעביר כבלים, או שעדיף אלחוטי. כשהלקוח כבר ענה, לא שואלים שוב.
- מסבירים יתרונות וחסרונות, בשורה או שתיים לכל צד, כמו מתקין מנוסה: קווי (PoE עם מקליט) יציב, מקליט 24/7 לדיסק ונראה בטלוויזיה, אבל צריך להעביר כבל לכל מצלמה; אלחוטי (Wi-Fi) מתקינים לבד בלי כבלים, אבל תלוי בקליטה וצריך שקע ליד כל מצלמה; סוללה/4G לאתר בלי חשמל ואינטרנט. באינטרקום: 2 גידים על הכבל הקיים (עם או בלי אפליקציה), IP למי שיש תשתית רשת, והיברידי לדירה בבניין ישן שרוצה לענות מהנייד. למבוגרים: מסך פיזי בכבל, בלי אפליקציה.
- משתמשים בטיפים של עידן היבואן ובמה שלמדנו משיחות (בידע למטה): למשל חלופה שבמלאי, זרוע לכיפה, מסך נוסף לאינטרקום, מצלמה שעוקבת לבד למי שלא מסתדר עם אפליקציה. זה מה שמבדיל בין בוט למוכר טוב.
- אין כרטיסי מוצר בווצאפ. מוצרים שאתה ממליץ עליהם מחזירים ב-products, והמערכת מוסיפה את הקישורים לבד. לא כותבים כתובות של מוצרים בעצמך (קישורי קטגוריות: ראו למטה).
- הלקוח כבר בווצאפ: לא מבקשים ממנו טלפון ולא שולחים קישור wa.me. מותר לבקש שם.
- מלאי: אף פעם לא מבטיחים מהראש שיש במלאי. כשהלקוח שואל אם מוצר מסוים במלאי, או רוצה לקנות אותו, מחזירים את ה-slug שלו בשדה stock_check, והמערכת שואלת את עידן היבואן. היבואן עובד א'-ה' 08:00-17:00, ו' 08:00-13:00, לא בשבת ובחג, וההקשר למטה אומר אם הוא פתוח עכשיו. כשפתוח: "אני בודק עכשיו מול היבואן וחוזר אליך תוך זמן קצר". כשסגור, אומרים את האמת (רותם 7.10.2026: טל כתב "בודק עכשיו" ב-18:07): "היבואן סגור עכשיו, אני בודק ומחזיר תשובה {מתי, לפי ההקשר}", ולא "בודק עכשיו". לא ממציאים תשובת מלאי. אם בשיחה כבר כתוב שבדקנו ("בדקנו מול היבואן"), לא בודקים שוב את אותו מוצר, אלא ממשיכים משם.
- כשההקשר אומר "תוצאת בדיקת מלאי": זו התשובה של עידן. מעבירים אותה ללקוח בפשטות ("בדקנו, יש במלאי ואספקה מיידית" / "לא במלאי כרגע, ועידן ממליץ על..."), ומתקדמים למכירה: איך נוח לו לקבל, איסוף עצמי בתיאום או משלוח לכתובת (המשלוח בתשלום לפי כתובת), ואיך מזמינים.
- איך קונים: מזמינים מדף המוצר באתר (הוספה לעגלה ושליחת הזמנה עם קוד אימות בווצאפ). ההזמנה לא מחייבת: לא גובים כלום עד שרותם מאשר מלאי ומחיר משלוח. אפשר גם פשוט לכתוב כאן מה רוצים להזמין ולאיזו כתובת, ורותם יאשר.
- תשלום (רותם 7.10.2026, אחרי העסקה הראשונה): אין לינק תשלום ואין סליקה באתר. כשהלקוח מבקש לינק לתשלום או רוצה לשלם באשראי, עונים: "כרגע אין לינק תשלום באתר. עידן מהיבואן שלנו בפתח תקווה יתקשר אליך מהמספר שלו לחיוב באשראי בטלפון" (בשעות העבודה של היבואן: "תוך זמן קצר"; מחוץ להן, לפי ההקשר: "מחר בבוקר" או "ביום ראשון בבוקר"). אסור להבטיח לינק, גם לא "רותם ישלח לך לינק". 11.10.2026: כשלקוח אומר שהוא רוצה לקנות, להזמין או לשלם, ויודעים מה הוא קונה, בשדה escalate כותבים "תשלום: {מה קונה, כמות, מחיר האתר, איסוף מפ"ת או משלוח לאיזה יישוב, שם}" ו-intent הוא ready. ההודעה הזו עוברת אוטומטית לעידן כדי שיתקשר ויחייב, אז היא חייבת לכלול את כל מה שהוא צריך. רק אם חסר משהו מהותי (מה קונה, או איסוף/משלוח) שואלים עליו קודם. 18.10.2026 (עידן): הוא מקבל רק לקוח שסגר, "מי שמראה רצון ברכש", ושיחת החיוב היא רק חיוב: "בלי הרבה שאלות". לכן "תשלום:" רק אחרי שכל השאלות של הלקוח נענו כאן (מה כלול, אחריות, מפרט, משלוח) והוא אמר שהוא רוצה לשלם. לקוח שעוד שואל: עונים לו קודם, ורק כשהוא מאשר כותבים "תשלום:". כלל פשוט: בהודעה שבה אתה עונה על שאלה או מבקש פרט (שם מלא, יישוב או כתובת, מייל, איסוף או משלוח), escalate נשאר ריק ו-intent הוא ready. "תשלום:" רק בהודעה שבה כבר לא חסר כלום ואין מה לשאול, כדי שעידן יקבל לקוח שרק צריך לחייב. עידן רק מחייב בטלפון. את החשבונית שולח רותם אחרי החיוב, ואת מחיר המשלוח רותם או הצוות מוסרים לפני התשלום; לא כותבים שעידן שולח חשבונית או מתמחר משלוח. שאלה טכנית שאין עליה תשובה במפרט לא עוברת לעידן אלא לרותם (escalate רגיל).
- לפני תשלום או איסוף אוספים את הפרטים למסמך ולמסירה, שאלה או שתיים בכל הודעה ולא הכול בבת אחת: שם מלא; מייל שאליו נשלח המסמך; אם זה עסק, שם החברה וח.פ.; מי אוסף (איסוף מהיבואן בפתח תקווה) או כתובת למשלוח. מה שהלקוח כבר כתב, לא שואלים שוב. חובה: באותה הודעה שבה מבקשים את הפרטים הראשונים מוסיפים שורה אחת עם תוספת אחת או שתיים שבאמת מתאימות (זה מה שעידן עשה בטלפון ומכר כרטיס 128GB): למצלמות סוללה/4G כרטיס זיכרון 128GB (אין לו מחיר בקטלוג: "בתוספת קטנה, המחיר הסופי בהזמנה", לא ממציאים מחיר); סים של החנות (${SITE_OFFER.sim.price} ₪ לשנה); ענן דרכנו (${SITE_OFFER.cloud.price} ₪ לשנה למצלמה, הכול כלול). למשל: "רוצה להוסיף כרטיס זיכרון 128GB או סים? בתוספת קטנה, המחיר הסופי בהזמנה".
- סכום סופי: לעולם לא כותבים "הסכום הסופי הוא X" ולא מסכמים כמה שולם. מחירי האתר הם מחירי מדף למוצר; מה שנגבה בפועל (עם תוספות, משלוח) יודע רק מי שגבה. אומרים: "רותם ישלח את הסכום המדויק עם החשבונית".
- אחרי שהלקוח כתב ששילם, שסגר, או שחייבו אותו: לא ממשיכים למכור ולא מציעים תוספות. רק מודים בקצרה, אומרים שרותם ישלח את המסמך למייל, ואם עוד אין מייל או שם לחשבונית, מבקשים רק אותם. בשדה escalate כותבים "נסגר: {מה נקנה, שם לחשבונית, ח.פ. אם יש, מייל}" ו-intent הוא ready.
- מחיר שרותם כבר כתב ללקוח בשיחה הזאת מחייב, גם אם במחירון כתוב אחרת. לא סותרים אותו.
- אתה גם מתאם שיחות של רותם. לקוח שרוצה לדבר עם בן אדם, או שהשאלה שלו דורשת את רותם (הנחה, כמות, התקנה, משהו שאתה לא בטוח בו): מציעים שמישהו מהצוות יחזור אליו (רותם או מישהו מהצוות שלנו; עידן מהיבואן מתקשר רק לחיוב של לקוח שסגר, לא לייעוץ, עידן 18.10.2026), ושואלים מתי נוח. אומרים בכנות מתי רותם זמין לפי השעה עכשיו (שעות הפעילות: ${"א'-ה' 08:00-18:00, ו' 08:00-14:00"}). למשל באחת בלילה: "בשעה כזאת רותם עוד לא זמין, בסביבות 9-10 בבוקר הוא כבר יהיה, ואני מוסר לו שיחזור אליך מהטלפון הזה". אחרי שהלקוח אישר: כותבים בשדה escalate "לחזור ל{שם} ב{שעה שביקש}: {מה הוא רוצה}", כדי שרותם יקבל תזכורת.
- הזמינות של רותם: רק כשההקשר אומר שרותם לא כתב בשיחה הזאת ב-30 הדקות האחרונות אומרים מתי הוא יהיה זמין. אם רותם כתב כאן לאחרונה, הוא כאן: "רותם כאן ויענה לך", בלי "רותם יהיה זמין ב-".
- לא חוזרים על מה שכבר נאמר בשיחה, ולא שואלים שוב שאלה שהלקוח כבר ענה עליה.
- כשרותם חוזר לשיחה, הוא כותב מהטלפון בעצמו. אתה לא מתחזה לרותם ולא מדבר בשמו בגוף ראשון.
- מפרט (16.10.2026): על יכולת טכנית של דגם מסוים שהלקוח שאל עליו בשם או מהדף שלו (הקלטה, אחסון, כרטיס זיכרון, Wi-Fi, PoE, הספק, מה כלול, תאימות) עונים לפי סדר עדיפות: קודם "עובדות מאומתות על המוצרים שבשיחה" שבהקשר, אם הדגם מופיע שם; אם הדגם לא מופיע שם, שורת הקטלוג שלו היא המקור. מה שלא כתוב באף אחד מהם: "אני לא בטוח, אבדוק ואחזור אליך", והשאלה בשדה escalate. אסור להסיק מהסוג הכללי של המוצר (טל כתב שפנל אינטרקום "לא מקליט בעצמו", והמפרט אמר הפוך). שאלות כלליות על סוג מערכת (איך Wi-Fi, PoE או סוללה עובדים) עונים מהמדריכים בידע כרגיל.
- שורה שמתחילה ב-"[רותם מהטלפון]" היא הודעה שרותם כתב בעצמו מהטלפון, לא אתה: מה שכתוב שם מחייב (מחיר, הנחה, הבטחה), ולא סותרים אותו.
- אפיון והתקנה בווצאפ (רותם 16.10.2026, כלל 12): בתשובה הראשונה או השנייה, כשלא ברור, שאלה אחת: "יש לך מי שיתקין, או שתרצה שנטפל גם בהתקנה?". בליד מדף מוצר ("יש במלאי?") אפשר לשלב אותה עם תשובת המלאי. איש מקצוע: ישר לעניין, מלאי מול עידן, מחיר האתר, כמות, איסוף מפתח תקווה, בלי הסברים למתחילים. לקוח קצה שרוצה התקנה: שואלים באיזה יישוב, ובשדה escalate כותבים "התקנה: {מוצר}, {יישוב}, {מה צריך}" כדי שרותם או הצוות יחזרו עם הצעה (לא עידן). לבד: אומרים במשפט מה צריך כדי שזה יעבוד, רק מתוך "עובדות מאומתות" של הדגם שבשיחה (לפנל IP של Hikvision למשל: חשמל 12V או PoE בנקודה, מנעול חשמלי עם ספק אם רוצים לפתוח ממנו, Wi-Fi טוב בכניסה; לערכת 2 גידים: כבל בין הפנל למסך, הספק כלול) ושאנחנו מלווים בהגדרה מרחוק. שאלה אחת בהודעה: אם יש כבר שאלת בירור אחרת, שאלת ההתקנה מחכה להודעה הבאה. מצלמות סולארי/4G ואתרי בנייה: לפי כלל 7 (לא חייבים מתקין; לאתר: הערכת יום עבודה, escalate ריק), ו-TrackMix Wired LTE עם התקנה במחיר המבצע הסגור מ-/deals. לא שואלים שוב אם הלקוח כבר ענה.`;

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
  const t0 = Date.now(); // תקציב הזמן של הנתיב (maxDuration): הבודק מקבל רק את מה שנשאר
  const dry = req.nextUrl.searchParams.get("dry") === "1" && adminAuthorized(req); // בדיקה ידנית: מחזיר את התשובה בלי לשלוח
  // kick: לפתוח שיחה עם ליד שכבר מחכה (webhook נשלח רק על הודעות חדשות). כל כללי הבטיחות חלים, בלי המתנה.
  const kick = req.nextUrl.searchParams.get("kick") === "1" && adminAuthorized(req);
  const hookLine = !dry && !kick ? webhookLine(req) : null;
  if (!dry && !kick && !hookLine) return NextResponse.json({ error: "not found" }, { status: 404 });
  let n: { typeWebhook?: string; senderData?: { chatId?: string; senderName?: string }; idMessage?: string; messageData?: { typeMessage?: string }; stockResult?: { slug?: string; answer?: string }; followUp?: { step?: number; note?: string }; trustedLead?: { source?: string }; simulate?: { history?: H[]; now?: string }; line?: string };
  try { n = await req.json(); } catch { return NextResponse.json({ ok: true }); }
  // הקו: ב-webhook לפי הטוקן. ב-kick/dry (כלים מקומיים): line מהבקשה, אחרת מחפשים את השיחה קודם בקו של רלי ואז במספר של רותם
  const askedLine: Line | null = n.line === "customer" || n.line === "ops" ? n.line : null;
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
      const lost = hookLine === "customer"
        ? "עד שמחברים מחדש: הודעות פתיחה, הודעות מעקב וקודי אימות להזמנה לא יוצאים, ופניות חדשות לא נרשמות בטבלה של רלי. הטלפון של רלי צריך להיות דלוק ומחובר לאינטרנט."
        : "עד שמחברים מחדש: התראות לקבוצה, הזמנות לעידן ושיחות ישנות של טל לא עובדים. גם מערכת הלידים של TimelapseIT משתמשת באותו חיבור.";
      await notifyTeam(`⚠️ הווצאפ של Site-Control התנתק (${state}, ${phoneLabel(hookLine || "ops")})`, `החיבור של GreenAPI למספר ${phoneLabel(hookLine || "ops")} התנתק. ${lost}\n\nלחיבור מחדש מהטלפון: לבקש מקלוד קוד חיבור, ואז בווצאפ: הגדרות > מכשירים מקושרים > קישור מכשיר > קישור עם מספר טלפון במקום.`).catch(() => undefined);
    }
    return NextResponse.json({ ok: true });
  }
  if (BOT_MODE === "off" && !dry) return NextResponse.json({ ok: true, skip: "off" });
  if (n.typeWebhook !== "incomingMessageReceived") return NextResponse.json({ ok: true });
  const chatId = String(n.senderData?.chatId || "");
  const phone = chatId.replace(/@c\.us$/, "");
  // קבוצות (גם קבוצת ההזמנות SUPPLIER_GROUP) נופלות כבר בבדיקת @c.us. אלי נוסף 7.10.2026: הוא עונה במקום עידן, לא ליד
  // רותם ורלי מתכתבים בין שני הקווים: זו לא שיחה עם לקוח
  if (!/^\d{11,13}@c\.us$/.test(chatId) || phone === IDAN_WA || phone === ELI_WA || phone === OPS_WA || phone === CUSTOMER_WA) return NextResponse.json({ ok: true, skip: "chat" });
  const recordOnly = hookLine === "customer" && !CUSTOMER_LINE_REPLIES; // רישום בטבלה הוא לא הודעה ללקוח: גם בשבת
  if (restDay(nowDate) && !dry && !recordOnly) return NextResponse.json({ ok: true, skip: "shabbat" });

  if (!dry && !kick) await new Promise((r) => setTimeout(r, DEBOUNCE_MS));
  // getChatHistory של GreenAPI נכשל לפעמים (502 / רשימה ריקה) לשיחה שבטוח יש בה הודעות: עד 3 ניסיונות
  const loadHistory = async (l: Line): Promise<H[] | null> => {
    let h: H[] | null = null;
    for (let i = 0; i < 3 && !h?.length; i++) {
      if (i) await new Promise((r) => setTimeout(r, 3000));
      h = await greenApi<H[]>("getChatHistory", { chatId, count: 40 }, undefined, l);
    }
    return h;
  };
  // ליד של Site-Control: הודעה נכנסת מכפתור באתר, או (בקו של רלי בלבד) שיחה שנפתחה בהודעת פתיחה מאיתנו (app/lib/opening.ts)
  const leadStart = (h: H[], l: Line) => h.find((m) => m.type === "incoming" && siteSourceOf(textOf(m))) || (l === "customer" ? h.find(isOpeningMessage) : undefined);
  // הקו בפועל: בלי הגדרה נפרדת לקו של רלי, "customer" שולח מהמספר של רותם, אז גם הכללים והשמות של רותם
  let line: Line = hookLine || askedLine || "customer";
  if (line === "customer" && !customerLineReady()) line = "ops";
  let history: H[] | null = sim ? sim.history! : null;
  if (!sim) {
    history = await loadHistory(line);
    // kick/dry בלי line: השיחה לא בקו של רלי (או שהוא לא מחובר)? אולי היא שיחה ישנה במספר של רותם
    if (!hookLine && !askedLine && customerLineReady() && !(history?.length && leadStart(history, "customer"))) {
      const old = await loadHistory("ops");
      if (old?.length && (leadStart(old, "ops") || !history?.length)) { history = old; line = "ops"; }
    }
  }
  if (!history?.length) return NextResponse.json({ ok: true, skip: "no history" });
  const msgs = [...history].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  const human = HUMAN[line];

  // הקו של רלי בלי בוט: רלי עונה מהטלפון. כאן רק נרשם בטבלה שלה מי כתב ומה (שורה חדשה לפונה חדש, גם מי שכתב ישירות
  // למספר שבמודעות), בלי Gemini ובלי תשובה. גם kick (מלאי, פולואפ אחרי הצעה) לא שולח כלום בקו הזה.
  if (line === "customer" && !CUSTOMER_LINE_REPLIES) {
    if (dry || kick) return NextResponse.json({ ok: true, skip: "rali line: no bot replies" });
    const lastMsg = msgs[msgs.length - 1];
    if (lastMsg.type !== "incoming" || (n.idMessage && lastMsg.idMessage !== n.idMessage)) return NextResponse.json({ ok: true, skip: "rali line: not the latest message" });
    const first = leadStart(msgs, line);
    const pre = first?.type === "incoming" ? first : undefined;
    const said = textOf(lastMsg) || (lastMsg.typeMessage === "audioMessage" ? "[הודעה קולית]" : lastMsg.typeMessage === "imageMessage" ? "[תמונה]" : lastMsg.typeMessage ? `[${lastMsg.typeMessage}]` : "");
    const ok = await sheetUpsert({
      phone,
      name: n.senderData?.senderName,
      source: first?.type === "outgoing" ? undefined : `ווצאפ: ${pre ? siteSourceOf(textOf(pre)) : "ישירות למספר של רלי"}`,
      ref: pre ? waRefOf(textOf(pre)) || undefined : undefined,
      status: "💬 הלקוח כתב: רלי עונה מהטלפון",
      lastMessage: said.slice(0, 300),
    }, Math.min(8000, Math.max(1000, maxDuration * 1000 - (Date.now() - t0) - 2000)));
    return NextResponse.json({ ok: true, skip: "rali line: no bot replies", recorded: ok });
  }

  // 1. רק לידים מהאתר של Site-Control (או שיחה שפתחנו בהודעת פתיחה)
  const start = leadStart(msgs, line);
  const prefill = start?.type === "incoming" ? start : undefined;
  const opened = start?.type === "outgoing" ? start : undefined;
  if (!start && !trustedLead) return NextResponse.json({ ok: true, skip: "not a site lead" });
  // 4. עונים רק כשההודעה האחרונה בשיחה היא נכנסת (אין עדיין תשובה אחריה)
  const last = msgs[msgs.length - 1];
  if (last.type !== "incoming" && !proactive) return NextResponse.json({ ok: true, skip: "already answered" });
  if (followUp && last.type === "incoming") return NextResponse.json({ ok: true, skip: "customer replied, no follow-up needed" });
  if (!dry && !kick && n.idMessage && last.idMessage !== n.idMessage) return NextResponse.json({ ok: true, skip: "newer message pending" });
  // 2. בן אדם בשיחה (רלי בקו שלה, רותם במספר העסקי): כתב מהטלפון (sendByApi=false)
  const now = nowDate.getTime() / 1000;
  const rotemWrote = (minutes: number) => msgs.some((m) => m.type === "outgoing" && m.sendByApi === false && now - (m.timestamp || 0) < minutes * 60);
  const rotemRecent = rotemWrote(ROTEM_ACTIVE_MINUTES);
  if (rotemRecent && !dry && !proactive) return NextResponse.json({ ok: true, skip: `${line === "customer" ? "rali" : "rotem"} active` });
  // בקו של רלי: העמודה "מי מטפל" בטבלה, ואם היא ריקה, רלי שכתבה היום = השיחה שלה עד מחר (רותם 20.10.2026: "רלי תוכל
  // להתערב בשיחה במקום טל"). "טל" מחזיר את השיחה לטל עד שרלי כותבת בה שוב אחרי השינוי. כשהטבלה לא ענתה בזמן (null)
  // נזהרים: אם רלי כתבה אי פעם בשיחה הזאת, טל לא עונה.
  const looked = line === "customer" && !sim ? await sheetHandler(phone) : { handler: "" as const, at: 0 };
  const handler = looked?.handler || "";
  const humanMsgs = msgs.filter((m) => m.type === "outgoing" && m.sendByApi === false);
  const humanToday = humanMsgs.some((m) => dayIL(new Date((m.timestamp || 0) * 1000)) === dayIL(nowDate));
  const humanSinceHandBack = looked ? humanMsgs.some((m) => (m.timestamp || 0) * 1000 > looked.at) : false;
  // "רלי" חוסם הכול (גם תשובת מלאי); חריג המלאי רק לכללי "רלי כתבה היום"
  const humanHolds = line === "customer" && (
    handler === "רלי"
    || (!stockResult && (
      (handler === "טל" ? humanSinceHandBack && humanToday : humanToday)
      || (!looked && humanMsgs.length > 0)
    ))
  );
  if (!dry && humanHolds) return NextResponse.json({ ok: true, skip: handler === "רלי" ? "sheet: rali handles" : !looked ? "sheet unavailable, rali was in this chat" : "rali took the chat today" });
  // 5. תקרה יומית
  const botToday = msgs.filter((m) => m.type === "outgoing" && m.sendByApi && textOf(m) && now - (m.timestamp || 0) < 24 * 3600).length;
  if (botToday >= MAX_BOT_REPLIES_PER_DAY && !dry) return NextResponse.json({ ok: true, skip: "daily cap" });

  // השיחה כקלט לטל: נכנס = לקוח, יוצא (רותם או מערכת) = הצד שלנו. הודעות רצופות מאותו צד מאוחדות.
  const conv: Msg[] = [];
  for (const m of msgs.slice(-20)) {
    const t = textOf(m) || (m.typeMessage === "audioMessage" ? "[הודעה קולית]" : m.typeMessage === "imageMessage" ? "[תמונה]" : m.typeMessage ? `[${m.typeMessage}]` : "");
    if (!t) continue;
    const role: Msg["role"] = m.type === "incoming" ? "user" : "assistant";
    // רותם או רלי כותבים מהטלפון (sendByApi=false): מסומן, כדי שטל והבודק ידעו שזה לא טל (מחיר שהם כתבו מחייב)
    const said = role === "assistant" && m.sendByApi === false ? `[${human} מהטלפון] ${t}` : t;
    const prev = conv[conv.length - 1];
    if (prev && prev.role === role) prev.content = `${prev.content}\n${said}`.slice(-1500);
    else conv.push({ role, content: said.slice(0, 1500) });
  }
  // שיחה שנפתחה בהודעת פתיחה: מה שכתבנו לפני תשובת הלקוח (הפתיחה, וגם מה שרלי כתבה מהטלפון) נשאר, אחרי תור "לקוח"
  // סינתטי (Gemini דורש שהשיחה תתחיל בלקוח). בלי זה טל רואה רק "כניסה וחניה, יש" ולא יודע על מה (בדיקה 20.10.2026)
  const LEFT_DETAILS = "(השאיר פרטים באתר / בצ'אט / ברשת חברתית)";
  if (opened && conv.length && conv[0].role === "assistant") conv.unshift({ role: "user", content: LEFT_DETAILS });
  while (conv.length && conv[0].role !== "user") conv.shift();
  // הפתיחה ישנה מ-20 ההודעות האחרונות: מחזירים אותה לראש השיחה
  if (opened && !conv.some((m) => m.role === "assistant" && m.content.includes(textOf(opened).slice(0, 40)))) {
    conv.unshift({ role: "user", content: LEFT_DETAILS }, { role: "assistant", content: textOf(opened).slice(0, 1500) });
  }
  if (proactive && conv.length && conv[conv.length - 1].role !== "user") conv.push({ role: "user", content: stockResult ? "(ממתין לתשובה על המלאי)" : "(הלקוח לא ענה מאז ההודעה האחרונה שלנו)" });
  if (!conv.length || conv[conv.length - 1].role !== "user") return NextResponse.json({ ok: true, skip: "no user turn" });
  const lastUserText = conv[conv.length - 1].content;

  const nowIL = il(nowDate, { weekday: "long", hour: "2-digit", minute: "2-digit" }, "he-IL");
  const ctx: string[] = [`השעה עכשיו בישראל: ${nowIL}.`, opened
    ? "הלקוח השאיר פרטים (בטופס באתר, בצ'אט או ברשת חברתית), ואתה פתחת את השיחה בהודעת הפתיחה שבראש השיחה: היא אומרת מאיפה הגיע, מה ביקש ומה שאלת אותו. ממשיכים משם, ולא שואלים שוב מה שכבר נשאל."
    : `הלקוח פנה מהאתר (${prefill ? siteSourceOf(textOf(prefill)) : trustedLead?.source || "כפתור ווצאפ"}).`];
  const fromPage = prefill ? storeProducts.find((p) => textOf(prefill).includes(p.title)) : undefined;
  if (fromPage) ctx.push(`הוא כתב מדף המוצר ${productName(fromPage)} [${fromPage.slug}], מחיר באתר ${fromPage.price ? `${fromPage.price} ₪` : "לפי פנייה"}.`);
  const waitedH = (now - (last.timestamp || now)) / 3600;
  if (waitedH > 3 && last.type === "incoming" && !proactive) ctx.push(`ההודעה האחרונה של הלקוח חיכתה ${Math.round(waitedH)} שעות בלי מענה: פתח בהתנצלות קצרה על העיכוב.`);
  // שעות היבואן והזמינות של רותם מחושבות כאן, לא אצל טל (7.10.2026)
  const idan = idanHours(nowDate);
  ctx.push(idan.open ? "היבואן פתוח עכשיו: על מלאי אפשר לומר \"אני בודק עכשיו מול היבואן\"." : `היבואן סגור עכשיו. תשובת מלאי תהיה ${idan.next}. לא אומרים "בודק עכשיו".`);
  ctx.push(line === "customer"
    ? (rotemWrote(ROTEM_HERE_MINUTES) ? "רלי כתבה בשיחה הזאת ב-30 הדקות האחרונות: רלי כאן. לא אומרים מתי היא תהיה זמינה." : "רלי לא כתבה בשיחה הזאת ב-30 הדקות האחרונות: אם צריך אותה, אומרים בכנות מתי היא זמינה לפי השעה.")
    : (rotemWrote(ROTEM_HERE_MINUTES) ? "רותם כתב בשיחה הזאת ב-30 הדקות האחרונות: רותם כאן. לא אומרים מתי הוא יהיה זמין." : "רותם לא כתב בשיחה הזאת ב-30 הדקות האחרונות: אם צריך אותו, אומרים בכנות מתי הוא זמין לפי השעה."));
  if (handler === "טל") ctx.push("רלי החזירה את השיחה אליך (בטבלה): ממשיכים מאיפה שהיא הפסיקה, בלי לחזור על מה שהיא כבר אמרה.");
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
  // בקו של רלי ההצגה היא "אני רלי מ-Site-Control" (גם בהודעת הפתיחה); שיחות ישנות עם "העוזר הדיגיטלי" נחשבות מוצגות
  const introMark = line === "customer" ? RALI_INTRO : INTRO_MARK;
  const introduced = msgs.some((m) => m.type === "outgoing" && (textOf(m).includes(INTRO_MARK) || textOf(m).includes(RALI_INTRO)));
  // שאלת האפיון (כלל 12) נשאלת פעם אחת בשיחה, גם אם הלקוח לא ענה (רותם: "לא חופר")
  if (msgs.some((m) => m.type === "outgoing" && /מי שיתקין|מתקין בעצמך|נטפל גם בהתקנה/.test(textOf(m)))) ctx.push("שאלת האפיון (מי מתקין) כבר נשאלה בשיחה הזאת: לא שואלים אותה שוב, גם אם הלקוח לא ענה.");
  ctx.push(introduced ? (line === "customer" ? "כבר הצגת את עצמך בשיחה הזאת (כרלי): אל תציג שוב." : "כבר הצגת את עצמך בשיחה הזאת: אל תציג שוב, ואל תתחיל ב\"היי, כאן טל\".") : "עוד לא הצגת את עצמך בשיחה הזאת.");
  if (n.senderData?.senderName) ctx.push(`השם שלו בווצאפ: ${n.senderData.senderName} (אפשר לפנות בשם הפרטי אם נראה כמו שם אמיתי).`);
  // המוצרים שבשיחה (דף המוצר שממנו פנה, המוצר בבדיקת המלאי, וכל דגם או קישור שהוזכר): המפרט המלא שלהם נכנס להקשר, כי
  // הקטלוג אצל טל מקוצר (16.10.2026: טל כתב ללקוחה שפנל DS-KV6124-WBE1 "לא מקליט בעצמו", והדאטהשיט אומר הפוך).
  const inPlay = [fromPage, stockResult?.slug ? productBySlug(stockResult.slug) : undefined, ...productsMentioned(conv.map((m) => m.content).join("\n"))]
    .filter((p, i, arr) => p && arr.findIndex((q) => q?.slug === p.slug) === i)
    .slice(0, 4) as NonNullable<typeof fromPage>[];
  const facts = productFacts(inPlay);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false, error: "no gemini key" }, { status: 503 });

  let data;
  try { data = await askGemini(apiKey, `${SYSTEM}${whatsappRules(line)}\n\n# הקשר נוכחי\n${ctx.join("\n")}${facts ? `\n\n${facts}` : ""}`, conv); }
  catch (e) { console.error("wa bot gemini", e instanceof Error ? e.message : e); return NextResponse.json({ ok: false, error: "gemini" }, { status: 200 }); }
  // הבודק (רותם 16.10.2026): מודל חזק יותר בודק כל עובדה בטיוטה מול המפרט, הקטלוג וההקשר, ומתקן לפני השליחה.
  // תקציב: 25 שניות, אבל לא יותר ממה שנשאר עד maxDuration פחות 10 שניות לשליחה ולהתראות (אחרי debounce, היסטוריה וטיוטה)
  const check = await verifyReply(apiKey, { system: `${SYSTEM}${whatsappRules(line)}`, context: ctx.join("\n"), facts, messages: conv, draft: data, timeoutMs: Math.min(25_000, maxDuration * 1000 - (Date.now() - t0) - 10_000), channel: "whatsapp" });
  if (!check.ok) {
    // שורת ההצגה הראשונה (INTRO_MARK) חייבת להישאר, אחרת בתור הבא טל יציג את עצמו שוב
    const introLine = data.reply.split("\n")[0];
    data.reply = check.changed && data.reply.includes(introMark) && !check.reply.includes(introMark) ? `${introLine}\n${check.reply}` : check.reply;
    if (check.changed && check.products) data.products = check.products;
  }
  // השאלה של הבודק נשארת בשדה נפרד: data.escalate עובר כמו שהוא לעידן (handoff.js) כשהוא מתחיל ב"תשלום:"
  const verifierAsk = check.escalate.replace(/\s+/g, " ").trim();
  console.log("wa bot verify", JSON.stringify({ ok: check.ok, verified: check.verified, changed: check.changed, ms: check.ms, model: check.model, kinds: check.issues.map((i) => i.kind), error: check.error?.slice(0, 120) }));

  const links = data.products.map((s) => productBySlug(s.trim().replace(/^\[|\]$/g, ""))).filter(Boolean).slice(0, 3)
    // 20.10.2026 (SC-035): "DS-KV6124-WBE1, 769 ₪" נקרא בווצאפ "1,769" (הספרה בסוף הדגם + פסיק), ועידן שאל "למה 1769?".
    // מילה בעברית בין הדגם למחיר מפרידה אותם.
    .map((p) => `${productName(p!)}${p!.price ? ` · מחיר ${p!.price.toLocaleString("he-IL")} ₪` : ""}:\n${SITE}/store/${p!.slug}`);
  const body = data.reply.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/^\s*[*-]\s+/gm, "• ").trim();
  const text = [body, ...links].filter(Boolean).join("\n\n").slice(0, 3500);

  // התראה לרותם: שאלה שצריך אותו, או לקוח שמוכן לקנות. כלל 6: לא אותה התראה פעמיים בשעה, אלא אם יש עובדה חדשה.
  const wantAlert = Boolean(data.escalate.trim()) || Boolean(verifierAsk) || data.intent === "ready";
  const marker = data.intent === "ready" ? READY_MARK : ASK_MARK;
  const newFact = NEW_FACT_RE.test(lastUserText);
  const suppressed = wantAlert && !newFact && (await alertedRecently(phone, marker, nowDate.getTime()));
  if (dry) return NextResponse.json({ ok: true, dry: true, simulated: Boolean(sim), text, escalate: data.escalate, intent: data.intent, stock_check: data.stock_check, followUp: followUp?.step, alert: wantAlert ? (suppressed ? "suppressed (sent in the last hour)" : "would send") : "none", verifierAsk, lead_type: data.lead_type, install: data.install, verify: check, facts, ctx, build: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local" });
  // בקשת בדיקת מלאי: הודעה מסומנת לווצאפ של רותם (לעצמו). הכלי המקומי (stock-check.js) קורא אותה, שואל את עידן
  // בשעות העבודה שלו, ומחזיר את התשובה לכאן עם stockResult. רותם 5.10.2026: "לא להציק לו סתם, רק בשעות עבודה".
  // 7.10.2026: הסימון נשאר בקבוצה הפנימית (SC_GROUP), לא בקבוצת ההזמנות מול הספק. לספק יוצאת רק השאלה המנוסחת
  // של הכלי המקומי, דרך /api/whatsapp/to-idan (שמעכשיו שולח לקבוצת ההזמנות).
  const stockProduct = data.stock_check ? productBySlug(data.stock_check.trim().replace(/^\[|\]$/g, "")) : undefined;
  if (stockProduct && !proactive) {
    await sendWhatsAppId(SC_GROUP, `${STOCK_MARK} ${phone} ${stockProduct.slug}
לקוח: ${n.senderData?.senderName || localPhone(phone)}
מוצר: ${productName(stockProduct)}${stockProduct.sku ? ` (מק"ט ${stockProduct.sku})` : ""} · מחיר באתר ${stockProduct.price ? `${stockProduct.price} ₪` : "לפי פנייה"}
(טל שואל את עידן בשעות העבודה שלו, ומחזיר ללקוח)`);
  }

  // מצב dry: לרותם בלבד
  if (BOT_MODE === "dry") {
    await sendWhatsAppId(SC_GROUP, `🤖 טל היה עונה ל-${localPhone(phone)}:\n\n${text}`);
    return NextResponse.json({ ok: true, mode: "dry" });
  }
  const id = await sendWhatsAppId(phone, text, line);
  // רותם רואה בקבוצה מה הבודק תיקן (עובדה או מדיניות), וגם כשהבודק נכשל והתשובה יצאה בלי בדיקה
  // תיקון עובדה או מדיניות: אם יוצאת עכשיו התראה (❓ / 🟢) הוא נכנס לתוכה; אחרת הודעה נפרדת, פעם בשעה ללקוח (כלל 6)
  const corrections = check.issues.filter((i) => i.kind === "fact" || i.kind === "policy");
  const correctionsText = corrections.map((i) => `• ${i.what}${i.fix ? ` ← ${i.fix}` : ""}`).join("\n");
  const verifierVerb = check.changed ? "תיקן את טל" : "סימן בעיה אצל טל (בלי לשנות את התשובה)";
  if (corrections.length && !(wantAlert && !suppressed) && !(await alertedRecently(phone, VERIFY_MARK, nowDate.getTime()))) {
    recentAlerts.set(`${phone}:${VERIFY_MARK}`, nowDate.getTime());
    await sendWhatsAppId(SC_GROUP, `${VERIFY_MARK} ${verifierVerb} (${localPhone(phone)}):\n${correctionsText}`).catch(() => undefined);
  } else if (check.error && !(await alertedRecently("", VERIFY_FAIL_MARK, nowDate.getTime()))) {
    // פעם בשעה לכל היותר (כלל 6), אחרת מודל לא זמין או timeout שגרתי מציפים את הקבוצה
    recentAlerts.set(`:${VERIFY_FAIL_MARK}`, nowDate.getTime());
    const reason = /abort/i.test(check.error) ? "הבודק לא הספיק בזמן" : check.error === "no time budget" ? "לא נשאר זמן לבדיקה" : `שגיאה: ${check.error.slice(0, 160)}`;
    await sendWhatsAppId(SC_GROUP, `⚠️ טל ענה ל-${localPhone(phone)} ${VERIFY_FAIL_MARK} (${reason}). התראה אחת בשעה.`).catch(() => undefined);
  }
  const takeOver = line === "customer"
    ? `כדי לקחת את השיחה: רלי פשוט כותבת לו מהטלפון שלה (${phoneLabel("customer")}). מאותו רגע טל לא עונה בשיחה הזאת עד מחר.${sheetReady() ? ` להחזיר לטל לפני כן: בטבלה, "מי מטפל" = טל. לקחת לגמרי: "מי מטפל" = רלי.` : ""}`
    : `השיחה במספר של רותם (${phoneLabel("ops")}). כדי לקחת אותה: פשוט לכתוב לו מהטלפון. טל מחכה 10 דקות אחרי כל הודעה שלך ואז ממשיך.`;
  if (wantAlert && !suppressed) {
    recentAlerts.set(`${phone}:${marker}`, nowDate.getTime());
    const lastIn = textOf(last).slice(0, 300);
    const ref = prefill ? waRefOf(textOf(prefill)) : null;
    await notifyTeam(
      `${marker} (${localPhone(phone)})`,
      `${data.escalate ? `שאלה: ${data.escalate}\n` : ""}${verifierAsk ? `הבודק שואל: ${verifierAsk}\n` : ""}${corrections.length ? `הבודק ${verifierVerb}:\n${correctionsText}\n` : ""}${data.lead_summary ? `סיכום: ${data.lead_summary}\n` : ""}אפיון: ${LEAD_TYPE_HE[data.lead_type]} | התקנה: ${INSTALL_HE[data.install]}\n${ref ? `מס' פנייה: ${ref}\n` : ""}הלקוח כתב: ${lastIn}\n\nטל ענה:\n${text}\n\n${takeOver}`,
    ).catch(() => undefined);
  }
  // הטבלה של רלי: מה טל הבין עד עכשיו ובאיזה מצב השיחה (העמודות של רלי לא נדרסות)
  const escalation = data.escalate.trim();
  await sheetUpsert({
    phone,
    name: n.senderData?.senderName,
    source: opened ? undefined : `ווצאפ: ${prefill ? siteSourceOf(textOf(prefill)) : trustedLead?.source || "כפתור באתר"}${line === "ops" ? " (במספר של רותם)" : ""}`,
    ref: prefill ? waRefOf(textOf(prefill)) || undefined : undefined,
    tal: data.lead_summary || undefined,
    leadType: `${LEAD_TYPE_HE[data.lead_type]} | התקנה: ${INSTALL_HE[data.install]}`,
    status: !id ? "טל לא הצליח לשלוח" : /^תשלום:/.test(escalation) ? "🟢 מוכן לשלם (עבר לעידן)" : /^נסגר:/.test(escalation) ? "✅ נסגר" : data.intent === "ready" ? "🟢 מוכן לקנות" : escalation || verifierAsk ? `❓ טל צריך את רלי: ${(escalation || verifierAsk).slice(0, 200)}` : "טל בשיחה",
    lastMessage: textOf(last).slice(0, 300),
  }, Math.min(5000, Math.max(1000, maxDuration * 1000 - (Date.now() - t0) - 2000)));
  return NextResponse.json({ ok: Boolean(id), sent: Boolean(id), line, alert: wantAlert ? (suppressed ? "suppressed" : "sent") : "none" });
}
