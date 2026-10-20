/**
 * טבלת הלידים של רלי (Site-Control). רותם 20.10.2026: "הלידים מגיעים לרלי. והכל מתעדכן בטבלה".
 *
 * מה הסקריפט עושה:
 * 1. מקבל מהאתר (app/lib/leads-sheet.ts) כל ליד: טופס, הצ'אט בחנות, הזמנה, שיחת ווצאפ עם טל. שורה אחת לכל טלפון:
 *    ליד חדש נוסף למטה, ליד קיים מתעדכן. העמודות של רלי (איפה זה עומד, מי מטפל, הערות, לחזור בתאריך) לא נדרסות אף פעם.
 * 2. עונה לטל מי מטפל בליד (עמודה "מי מטפל"): "רלי" = טל לא עונה בשיחה, "טל" = טל חוזר לענות.
 * 3. "שלח פתיחה": רלי מוסיפה שורה (למשל ליד מפייסבוק או אינסטגרם) עם שם וטלפון, מסמנת את התיבה, וטל שולח הודעת
 *    פתיחה מהקו של רלי. התוצאה נכתבת בעמודה "הודעת פתיחה".
 *
 * התקנה (פעם אחת): פרויקט Apps Script עצמאי (script.google.com > פרויקט חדש) של חשבון שיש לו עריכה בגיליון, להדביק,
 * לשמור ולהריץ את setup (לאשר הרשאות). 20.10.2026: סקריפט שמחובר לגיליון (הרחבות > Apps Script) נכשל בפריסה עם
 * "You do not have permission", כי רק בעלת הגיליון יכולה לפרוס אותו; פרויקט עצמאי פותח את הגיליון לפי SHEET_ID.
 * אחר כך: פריסה > פריסה חדשה > סוג: אפליקציית אינטרנט, "הפעלה בתור: אני", "למי יש גישה: כל אחד". את הכתובת שמקבלים
 * שמים ב-Vercel כ-LEADS_SHEET_URL. הסוד: setup מייצר אותו ומדפיס ביומן (LEADS_SHEET_SECRET ב-Vercel).
 * הגישה "כל אחד" בטוחה: בלי הסוד הסקריפט לא עושה כלום.
 */

const TAB = "לידים";
const SHEET_ID = "1Asdy-kueGoK3n16BiRQt1JSCA0JyWqeEh_i86ffNeX8"; // הגיליון של רלי
/** הגיליון: המחובר (אם הסקריפט מחובר לגיליון), אחרת לפי SHEET_ID */
const book = () => SpreadsheetApp.getActive() || SpreadsheetApp.openById(SHEET_ID);
// חמש העמודות הראשונות הן אלה שרלי פתחה בגיליון (שם, טלפון, מייל, בקשת הלקוח, איפה זה עומד). האוטומטיות אחריהן.
const COLS = [
  "שם", "טלפון", "מייל", "בקשת הלקוח", "איפה זה עומד",
  "מקור", "תאריך", "מה טל הבין", "אפיון", "מצב (אוטומטי)", "מי מטפל", "שלח פתיחה", "הודעת פתיחה",
  "מס' פנייה", "יישוב", "דף", "הודעה אחרונה מהלקוח", "עודכן", "הערות", "לחזור בתאריך", "מי מטפל עודכן",
];
const C = Object.fromEntries(COLS.map((name, i) => [name, i + 1]));
// השדות שמגיעים מהאתר -> עמודה. "keep" = לא דורסים ערך קיים (המקור והבקשה הראשונים נשארים)
const FIELDS = {
  name: { col: "שם", keep: true },
  source: { col: "מקור", keep: true },
  need: { col: "בקשת הלקוח", keep: true },
  tal: { col: "מה טל הבין" },
  leadType: { col: "אפיון" },
  status: { col: "מצב (אוטומטי)" },
  opening: { col: "הודעת פתיחה" },
  ref: { col: "מס' פנייה", keep: true },
  email: { col: "מייל", keep: true },
  city: { col: "יישוב", keep: true },
  page: { col: "דף", keep: true },
  lastMessage: { col: "הודעה אחרונה מהלקוח" },
};
const MY_STATUS = ["חדש", "בטיפול", "הצעה נשלחה", "ממתין ללקוח", "נסגר", "לא רלוונטי"];

const props = () => PropertiesService.getScriptProperties();
const siteUrl = () => (props().getProperty("SITE_URL") || "https://www.site-control-il.com").replace(/\/$/, "");

/** טלפון בפורמט אחיד להשוואה: 9725XXXXXXXX */
function norm(phone) {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "972" + d.slice(1);
  else if (/^5\d{8}$/.test(d)) d = "972" + d; // טלפון שהוקלד כמספר בגיליון מאבד את ה-0
  return d;
}
/** לתצוגה בטבלה: 050-1234567 */
function pretty(phone) {
  const d = norm(phone);
  return /^9725\d{8}$/.test(d) ? `0${d.slice(3, 5)}-${d.slice(5)}` : String(phone || "");
}

/** הלשונית "לידים", או הלשונית הראשונה (הגיליון שרלי פתחה) שמקבלת את השם הזה ב-setup */
function sheet() {
  const ss = book();
  return ss.getSheetByName(TAB) || ss.getSheets()[0];
}

/** טקסט מהאתר נשמר כטקסט: ערך שמתחיל ב-= + - @ היה הופך לנוסחה, ומספר או תאריך היו מומרים (בדיקה 20.10.2026) */
function asText(v) {
  const t = String(v);
  return /^[=+\-@]/.test(t) || /^[\d\s/.:-]+$/.test(t) ? "'" + t : t;
}

/** השורה האחרונה שיש בה שם או טלפון (לא getLastRow: תיבות סימון ורשימות בשורות ריקות לא נחשבות) */
function lastDataRow(sh) {
  const max = sh.getLastRow();
  if (max < 2) return 1;
  const vals = sh.getRange(2, 1, max - 1, 2).getValues();
  for (let i = vals.length - 1; i >= 0; i--) if (String(vals[i][0]).trim() || String(vals[i][1]).trim()) return i + 2;
  return 1;
}

/** הרצה ידנית פעם אחת: לשונית, כותרות, תיבות סימון, רשימות, סוד, וטריגר לעריכה */
function setup() {
  const sh = sheet();
  if (sh.getName() !== TAB) sh.setName(TAB);
  sh.setRightToLeft(true);
  sh.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight("bold").setBackground("#e8f0fe");
  sh.setFrozenRows(1);
  const rows = Math.max(sh.getMaxRows() - 1, 999);
  sh.getRange(2, C["מי מטפל"], rows).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(["טל", "רלי"], true).setAllowInvalid(false).build());
  // תיבת סימון בלי ערך (רק אימות נתונים): תאים ריקים לא מזיזים את "השורה האחרונה"
  sh.getRange(2, C["שלח פתיחה"], rows).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  sh.getRange(2, C["איפה זה עומד"], rows).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(MY_STATUS, true).build());
  sh.getRange(2, C["לחזור בתאריך"], rows).setDataValidation(SpreadsheetApp.newDataValidation().requireDate().build());
  sh.getRange(2, C["טלפון"], rows).setNumberFormat("@");
  sh.hideColumns(C["מי מטפל עודכן"]);
  [["תאריך", 110], ["שם", 120], ["טלפון", 110], ["מקור", 170], ["בקשת הלקוח", 240], ["מה טל הבין", 260], ["מצב (אוטומטי)", 200], ["הודעת פתיחה", 200], ["הודעה אחרונה מהלקוח", 240], ["הערות", 240]]
    .forEach(([name, w]) => sh.setColumnWidth(C[name], w));
  if (!props().getProperty("LEADS_SHEET_SECRET")) props().setProperty("LEADS_SHEET_SECRET", Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, ""));
  ScriptApp.getProjectTriggers().filter((t) => t.getHandlerFunction() === "onEditSendOpening").forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("onEditSendOpening").forSpreadsheet(book()).onEdit().create();
  console.log("LEADS_SHEET_SECRET = " + props().getProperty("LEADS_SHEET_SECRET"));
}

function findRow(sh, phone) {
  const n = norm(phone);
  const last = lastDataRow(sh);
  if (!n || last < 2) return 0;
  const vals = sh.getRange(2, C["טלפון"], last - 1, 1).getValues();
  for (let i = vals.length - 1; i >= 0; i--) if (norm(vals[i][0]) === n) return i + 2;
  return 0;
}

function upsert(row) {
  const sh = sheet();
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const now = new Date();
    let r = findRow(sh, row.phone);
    if (!r) {
      r = lastDataRow(sh) + 1;
      if (r > sh.getMaxRows()) sh.insertRowsAfter(sh.getMaxRows(), 100);
      sh.getRange(r, C["תאריך"]).setValue(now).setNumberFormat("dd/MM/yyyy HH:mm");
      sh.getRange(r, C["טלפון"]).setNumberFormat("@").setValue(pretty(row.phone));
      sh.getRange(r, C["איפה זה עומד"]).setValue("חדש");
    }
    const current = sh.getRange(r, 1, 1, COLS.length).getValues()[0];
    Object.keys(FIELDS).forEach((k) => {
      const v = row[k];
      if (v === undefined || v === null || v === "") return;
      const col = C[FIELDS[k].col];
      if (FIELDS[k].keep && current[col - 1] !== "") return;
      sh.getRange(r, col).setValue(asText(v));
    });
    sh.getRange(r, C["עודכן"]).setValue(now).setNumberFormat("dd/MM HH:mm");
    return r;
  } finally {
    lock.releaseLock();
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ error: "bad request" }); }
  const secret = props().getProperty("LEADS_SHEET_SECRET");
  if (!secret || body.secret !== secret) return json({ error: "not found" });
  if (body.action === "upsert" && body.row && body.row.phone) return json({ ok: true, row: upsert(body.row) });
  if (body.action === "handler") {
    const sh = sheet();
    const r = findRow(sh, body.phone);
    if (!r) return json({ handler: "", at: 0 });
    const at = sh.getRange(r, C["מי מטפל עודכן"]).getValue();
    return json({ handler: String(sh.getRange(r, C["מי מטפל"]).getValue() || ""), at: at instanceof Date ? at.getTime() : Number(at) || 0 });
  }
  return json({ error: "bad action" });
}

/** טריגר עריכה (מותקן ב-setup):
 *  - "מי מטפל" שונה: נרשם מתי (העמודה הנסתרת "מי מטפל עודכן"), כדי ש"טל" יחזיר את השיחה לטל רק עד שרלי כותבת שוב.
 *  - "שלח פתיחה" סומן: הודעת פתיחה מטל דרך האתר, לכל שורה שסומנה (גם כמה בבת אחת). */
function onEditSendOpening(e) {
  const range = e && e.range;
  if (!range || range.getSheet().getName() !== TAB) return;
  const sh = range.getSheet();
  const c0 = range.getColumn(), c1 = range.getLastColumn(), r0 = Math.max(2, range.getRow()), r1 = range.getLastRow();
  if (r1 < 2) return;
  if (c0 <= C["מי מטפל"] && C["מי מטפל"] <= c1) {
    sh.getRange(r0, C["מי מטפל עודכן"], r1 - r0 + 1, 1).setValue(new Date());
  }
  if (!(c0 <= C["שלח פתיחה"] && C["שלח פתיחה"] <= c1)) return;
  for (let r = r0; r <= r1; r++) {
    const box = sh.getRange(r, C["שלח פתיחה"]);
    if (box.getValue() === true) sendOpeningRow(sh, r, box);
  }
}

function sendOpeningRow(sh, r, box) {
  const v = sh.getRange(r, 1, 1, COLS.length).getValues()[0];
  const phone = v[C["טלפון"] - 1];
  const out = sh.getRange(r, C["הודעת פתיחה"]);
  if (!norm(phone)) { out.setValue("לא נשלחה: חסר טלפון"); box.clearContent(); return; }
  if (!sh.getRange(r, C["תאריך"]).getValue()) sh.getRange(r, C["תאריך"]).setValue(new Date()).setNumberFormat("dd/MM/yyyy HH:mm");
  out.setValue("שולח...");
  try {
    const res = UrlFetchApp.fetch(siteUrl() + "/api/whatsapp/open", {
      method: "post",
      contentType: "text/plain;charset=utf-8",
      payload: JSON.stringify({
        secret: props().getProperty("LEADS_SHEET_SECRET"),
        phone: pretty(phone), name: v[C["שם"] - 1], source: v[C["מקור"] - 1], need: v[C["בקשת הלקוח"] - 1], ref: v[C["מס' פנייה"] - 1],
      }),
      muteHttpExceptions: true,
    });
    let body = {};
    try { body = JSON.parse(res.getContentText() || "{}"); } catch (err) { body = {}; }
    out.setValue(body.status || `שגיאה (${res.getResponseCode()})`);
    if (body.ok) sh.getRange(r, C["מצב (אוטומטי)"]).setValue("פתיחה נשלחה, טל בשיחה");
  } catch (err) {
    out.setValue("לא נשלחה: " + err);
  }
  box.clearContent(); // חוזר לתיבה ריקה (טריגר עריכה לא נורה על שינוי שהסקריפט עושה)
  sh.getRange(r, C["עודכן"]).setValue(new Date()).setNumberFormat("dd/MM HH:mm");
}
