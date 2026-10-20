/**
 * טבלת הלידים של רלי (Site-Control). רותם 20.10.2026: "הלידים מגיעים לרלי. והכל מתעדכן בטבלה".
 *
 * מה הסקריפט עושה:
 * 1. מקבל מהאתר (app/lib/leads-sheet.ts) כל ליד: טופס, הצ'אט בחנות, הזמנה, שיחת ווצאפ עם טל. שורה אחת לכל טלפון:
 *    ליד חדש נוסף למטה, ליד קיים מתעדכן. העמודות של רלי (מי מטפל, סטטוס שלי, הערות, לחזור בתאריך) לא נדרסות אף פעם.
 * 2. עונה לטל מי מטפל בליד (עמודה "מי מטפל"): "רלי" = טל לא עונה בשיחה, "טל" = טל חוזר לענות.
 * 3. "שלח פתיחה": רלי מוסיפה שורה (למשל ליד מפייסבוק או אינסטגרם) עם שם וטלפון, מסמנת את התיבה, וטל שולח הודעת
 *    פתיחה מהקו של רלי. התוצאה נכתבת בעמודה "הודעת פתיחה".
 *
 * התקנה (פעם אחת, מתוך הגיליון): הרחבות > Apps Script, להדביק את הקובץ הזה, לשמור, ולהריץ את setup (לאשר הרשאות).
 * אחר כך: פריסה > פריסה חדשה > סוג: אפליקציית אינטרנט, "הפעלה בתור: אני", "למי יש גישה: כל אחד". את הכתובת שמקבלים
 * שמים ב-Vercel כ-LEADS_SHEET_URL. הסוד: setup מייצר אותו ומדפיס ביומן (LEADS_SHEET_SECRET ב-Vercel).
 * הגישה "כל אחד" בטוחה: בלי הסוד הסקריפט לא עושה כלום.
 */

const TAB = "לידים";
const COLS = [
  "תאריך", "שם", "טלפון", "מקור", "מה ביקש", "מה טל הבין", "אפיון", "מצב (אוטומטי)",
  "מי מטפל", "שלח פתיחה", "הודעת פתיחה", "מס' פנייה", "מייל", "יישוב", "דף", "הודעה אחרונה מהלקוח", "עודכן",
  "סטטוס שלי", "הערות", "לחזור בתאריך",
];
const C = Object.fromEntries(COLS.map((name, i) => [name, i + 1]));
// השדות שמגיעים מהאתר -> עמודה. "keep" = לא דורסים ערך קיים (המקור והבקשה הראשונים נשארים)
const FIELDS = {
  name: { col: "שם", keep: true },
  source: { col: "מקור", keep: true },
  need: { col: "מה ביקש", keep: true },
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

function sheet() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(TAB);
  if (!sh) sh = ss.insertSheet(TAB, 0);
  return sh;
}

/** הרצה ידנית פעם אחת: לשונית, כותרות, תיבות סימון, רשימות, סוד, וטריגר לעריכה */
function setup() {
  const sh = sheet();
  sh.setRightToLeft(true);
  sh.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight("bold").setBackground("#e8f0fe");
  sh.setFrozenRows(1);
  const rows = Math.max(sh.getMaxRows() - 1, 999);
  sh.getRange(2, C["מי מטפל"], rows).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(["טל", "רלי"], true).setAllowInvalid(false).build());
  sh.getRange(2, C["שלח פתיחה"], rows).insertCheckboxes();
  sh.getRange(2, C["סטטוס שלי"], rows).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(MY_STATUS, true).build());
  sh.getRange(2, C["לחזור בתאריך"], rows).setDataValidation(SpreadsheetApp.newDataValidation().requireDate().build());
  sh.getRange(2, C["טלפון"], rows).setNumberFormat("@");
  [["תאריך", 110], ["שם", 120], ["טלפון", 110], ["מקור", 170], ["מה ביקש", 240], ["מה טל הבין", 260], ["מצב (אוטומטי)", 200], ["הודעת פתיחה", 200], ["הודעה אחרונה מהלקוח", 240], ["הערות", 240]]
    .forEach(([name, w]) => sh.setColumnWidth(C[name], w));
  if (!props().getProperty("LEADS_SHEET_SECRET")) props().setProperty("LEADS_SHEET_SECRET", Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, ""));
  ScriptApp.getProjectTriggers().filter((t) => t.getHandlerFunction() === "onEditSendOpening").forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("onEditSendOpening").forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create();
  console.log("LEADS_SHEET_SECRET = " + props().getProperty("LEADS_SHEET_SECRET"));
}

function findRow(sh, phone) {
  const n = norm(phone);
  const last = sh.getLastRow();
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
      r = sh.getLastRow() + 1;
      sh.getRange(r, C["תאריך"]).setValue(now).setNumberFormat("dd/MM/yyyy HH:mm");
      sh.getRange(r, C["טלפון"]).setNumberFormat("@").setValue(pretty(row.phone));
      sh.getRange(r, C["שלח פתיחה"]).insertCheckboxes();
      sh.getRange(r, C["סטטוס שלי"]).setValue("חדש");
    }
    const current = sh.getRange(r, 1, 1, COLS.length).getValues()[0];
    Object.keys(FIELDS).forEach((k) => {
      const v = row[k];
      if (v === undefined || v === null || v === "") return;
      const col = C[FIELDS[k].col];
      if (FIELDS[k].keep && current[col - 1] !== "") return;
      sh.getRange(r, col).setValue(String(v));
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
    return json({ handler: r ? String(sh.getRange(r, C["מי מטפל"]).getValue() || "") : "" });
  }
  return json({ error: "bad action" });
}

/** טריגר עריכה (מותקן ב-setup): סימון "שלח פתיחה" שולח הודעת פתיחה מטל דרך האתר */
function onEditSendOpening(e) {
  const range = e && e.range;
  if (!range || range.getSheet().getName() !== TAB || range.getColumn() !== C["שלח פתיחה"] || range.getRow() < 2) return;
  if (range.getValue() !== true) return;
  const sh = range.getSheet();
  const r = range.getRow();
  const v = sh.getRange(r, 1, 1, COLS.length).getValues()[0];
  const phone = v[C["טלפון"] - 1];
  const out = sh.getRange(r, C["הודעת פתיחה"]);
  if (!norm(phone)) { out.setValue("לא נשלחה: חסר טלפון"); range.setValue(false); return; }
  if (!sh.getRange(r, C["תאריך"]).getValue()) sh.getRange(r, C["תאריך"]).setValue(new Date()).setNumberFormat("dd/MM/yyyy HH:mm");
  out.setValue("שולח...");
  try {
    const res = UrlFetchApp.fetch(siteUrl() + "/api/whatsapp/open", {
      method: "post",
      contentType: "text/plain;charset=utf-8",
      payload: JSON.stringify({
        secret: props().getProperty("LEADS_SHEET_SECRET"),
        phone: pretty(phone), name: v[C["שם"] - 1], source: v[C["מקור"] - 1], need: v[C["מה ביקש"] - 1], ref: v[C["מס' פנייה"] - 1],
      }),
      muteHttpExceptions: true,
    });
    const body = JSON.parse(res.getContentText() || "{}");
    out.setValue(body.status || `שגיאה (${res.getResponseCode()})`);
    if (body.ok) sh.getRange(r, C["מצב (אוטומטי)"]).setValue("פתיחה נשלחה, טל בשיחה");
  } catch (err) {
    out.setValue("לא נשלחה: " + err);
  }
  range.setValue(false);
  sh.getRange(r, C["עודכן"]).setValue(new Date()).setNumberFormat("dd/MM HH:mm");
}
