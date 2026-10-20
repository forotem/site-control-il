/**
 * טבלת הלידים של רלי (Site-Control). רותם 20.10.2026: "הלידים מגיעים לרלי. והכל מתעדכן בטבלה".
 *
 * מה הסקריפט עושה:
 * 1. מקבל מהאתר (app/lib/leads-sheet.ts) כל ליד: טופס, הצ'אט בחנות, הזמנה, שיחת ווצאפ עם טל. שורה אחת לכל טלפון:
 *    ליד חדש נוסף למטה, ליד קיים מתעדכן. העמודות של רלי (איפה זה עומד, מי מטפל, הערות, לחזור בתאריך) לא נדרסות אף פעם.
 * 2. עונה לטל מי מטפל בליד (עמודה "מי מטפל"): "רלי" = טל לא עונה בשיחה, "טל" = טל חוזר לענות.
 * 3. "שלח פתיחה": רלי מוסיפה שורה (למשל ליד מפייסבוק או אינסטגרם) עם שם וטלפון, מסמנת את התיבה, וטל שולח הודעת
 *    פתיחה מהקו של רלי. התוצאה נכתבת בעמודה "הודעת פתיחה".
 * 4. תקרת הודעות הפתיחה (reserve / release): ספירה נעולה (LockService) ליום ולכל IP לשעה, משותפת לכל השרתים של האתר.
 *
 * העמודות נמצאות לפי שם הכותרת בשורה 1 (לא לפי מיקום): רלי יכולה להזיז, להוסיף ולמחוק עמודות. עמודה חסרה = לא כותבים.
 * הלשונית נמצאת לפי המזהה שלה (נשמר ב-setup): שינוי שם הלשונית לא שובר כלום.
 *
 * התקנה (פעם אחת): פרויקט Apps Script עצמאי (script.google.com > פרויקט חדש) של חשבון שיש לו עריכה בגיליון, להדביק,
 * לשמור ולהריץ את setup (לאשר הרשאות). 20.10.2026: סקריפט שמחובר לגיליון (הרחבות > Apps Script) נכשל בפריסה עם
 * "You do not have permission", כי רק בעלת הגיליון יכולה לפרוס אותו; פרויקט עצמאי פותח את הגיליון לפי SHEET_ID.
 * אחר כך: פריסה > פריסה חדשה > סוג: אפליקציית אינטרנט, "הפעלה בתור: אני", "למי יש גישה: כל אחד". את הכתובת שמקבלים
 * שמים ב-Vercel כ-LEADS_SHEET_URL. הסוד: setup מייצר אותו ומדפיס ביומן (LEADS_SHEET_SECRET ב-Vercel).
 * הגישה "כל אחד" בטוחה: בלי הסוד הסקריפט לא עושה כלום. אחרי שינוי קוד: פריסה > ניהול פריסות > עריכה > גרסה חדשה.
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
// עמודות שמתנקות כשליד חדש נכנס לשורה (שאולי נשארו בה שאריות: תיבה שסומנה בטעות, "מי מטפל" שנבחר בשורה ריקה)
const RESET_ON_NEW = ["מקור", "בקשת הלקוח", "מה טל הבין", "אפיון", "מצב (אוטומטי)", "מי מטפל", "שלח פתיחה", "הודעת פתיחה", "מס' פנייה", "מייל", "יישוב", "דף", "הודעה אחרונה מהלקוח", "מי מטפל עודכן"];
const REQUIRED = ["שם", "טלפון", "תאריך", "עודכן", "מי מטפל", "שלח פתיחה", "הודעת פתיחה", "מצב (אוטומטי)", "מי מטפל עודכן"];
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

/** הלשונית: לפי המזהה שנשמר ב-setup, אחרת לפי השם "לידים", אחרת הלשונית הראשונה */
function sheet() {
  const ss = book();
  const saved = props().getProperty("SHEET_GID");
  if (saved !== null && saved !== "") {
    const byId = ss.getSheets().find((s) => s.getSheetId() === Number(saved));
    if (byId) return byId;
  }
  return ss.getSheetByName(TAB) || ss.getSheets()[0];
}

/** מספרי העמודות לפי שמות הכותרות בשורה 1 */
function colMap(sh) {
  const head = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0];
  const m = {};
  head.forEach((h, i) => { const k = String(h).trim(); if (k && !m[k]) m[k] = i + 1; });
  return m;
}
const missing = (C) => REQUIRED.filter((k) => !C[k]);

/** טקסט מהאתר נשמר כטקסט: ערך שמתחיל ב-= + - @ היה הופך לנוסחה, ומספר או תאריך היו מומרים (בדיקה 20.10.2026) */
function asText(v) {
  const t = String(v);
  return /^[=+\-@]/.test(t) || /^[\d\s/.:-]+$/.test(t) ? "'" + t : t;
}

/** השורה האחרונה שיש בה שם או טלפון (לא getLastRow: תיבות סימון ורשימות בשורות ריקות לא נחשבות) */
function lastDataRow(sh, C) {
  const max = sh.getLastRow();
  if (max < 2) return 1;
  const a = sh.getRange(2, C["שם"], max - 1, 1).getValues();
  const b = sh.getRange(2, C["טלפון"], max - 1, 1).getValues();
  for (let i = a.length - 1; i >= 0; i--) if (String(a[i][0]).trim() || String(b[i][0]).trim()) return i + 2;
  return 1;
}

/** הרצה ידנית פעם אחת (ושוב אחרי שינויים): כותרות חסרות נוספות בסוף, תיבות סימון, רשימות, סוד, וטריגר לעריכה */
function setup() {
  const sh = sheet();
  props().setProperty("SHEET_GID", String(sh.getSheetId()));
  if (sh.getName() !== TAB && !book().getSheetByName(TAB)) sh.setName(TAB);
  sh.setRightToLeft(true);
  let C = colMap(sh);
  if (!Object.keys(C).length) {
    sh.getRange(1, 1, 1, COLS.length).setValues([COLS]);
  } else {
    // לא דורסים את הסדר של רלי: רק מוסיפים בסוף כותרות שחסרות
    const add = COLS.filter((k) => !C[k]);
    if (add.length) sh.getRange(1, sh.getLastColumn() + 1, 1, add.length).setValues([add]);
  }
  C = colMap(sh);
  sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight("bold").setBackground("#e8f0fe");
  sh.setFrozenRows(1);
  const rows = Math.max(sh.getMaxRows() - 1, 999);
  sh.getRange(2, C["מי מטפל"], rows).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(["טל", "רלי"], true).setAllowInvalid(false).build());
  // תיבת סימון בלי ערך (רק אימות נתונים): תאים ריקים לא מזיזים את "השורה האחרונה"
  sh.getRange(2, C["שלח פתיחה"], rows).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  if (C["איפה זה עומד"]) sh.getRange(2, C["איפה זה עומד"], rows).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(MY_STATUS, true).build());
  if (C["לחזור בתאריך"]) sh.getRange(2, C["לחזור בתאריך"], rows).setDataValidation(SpreadsheetApp.newDataValidation().requireDate().build());
  sh.getRange(2, C["טלפון"], rows).setNumberFormat("@");
  sh.hideColumns(C["מי מטפל עודכן"]);
  [["תאריך", 110], ["שם", 120], ["טלפון", 110], ["מקור", 170], ["בקשת הלקוח", 240], ["מה טל הבין", 260], ["מצב (אוטומטי)", 200], ["הודעת פתיחה", 200], ["הודעה אחרונה מהלקוח", 240], ["הערות", 240]]
    .forEach(([name, w]) => { if (C[name]) sh.setColumnWidth(C[name], w); });
  if (!props().getProperty("LEADS_SHEET_SECRET")) props().setProperty("LEADS_SHEET_SECRET", Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, ""));
  ScriptApp.getProjectTriggers().filter((t) => t.getHandlerFunction() === "onEditSendOpening").forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("onEditSendOpening").forSpreadsheet(book()).onEdit().create();
  console.log("LEADS_SHEET_SECRET = " + props().getProperty("LEADS_SHEET_SECRET"));
}

function findRow(sh, C, phone) {
  const n = norm(phone);
  const last = lastDataRow(sh, C);
  if (!n || last < 2) return 0;
  const vals = sh.getRange(2, C["טלפון"], last - 1, 1).getValues();
  for (let i = vals.length - 1; i >= 0; i--) if (norm(vals[i][0]) === n) return i + 2;
  return 0;
}

/** נעילה קצרה: האתר מחכה לכל היותר כמה שניות, אז עדיף "busy" מסודר מאשר דף שגיאה */
function withLock(ms, fn) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(ms)) return { error: "busy" };
  try { return fn(); } finally { lock.releaseLock(); }
}

function upsert(row) {
  const sh = sheet();
  const C = colMap(sh);
  if (missing(C).length) return { error: "missing columns: " + missing(C).join(", ") };
  return withLock(8000, () => {
    const now = new Date();
    let r = findRow(sh, C, row.phone);
    if (!r) {
      r = lastDataRow(sh, C) + 1;
      if (r > sh.getMaxRows()) sh.insertRowsAfter(sh.getMaxRows(), 100);
      RESET_ON_NEW.forEach((k) => { if (C[k]) sh.getRange(r, C[k]).clearContent(); });
      sh.getRange(r, C["תאריך"]).setValue(now).setNumberFormat("dd/MM/yyyy HH:mm");
      sh.getRange(r, C["טלפון"]).setNumberFormat("@").setValue(pretty(row.phone));
      if (C["איפה זה עומד"]) sh.getRange(r, C["איפה זה עומד"]).setValue("חדש");
    }
    Object.keys(FIELDS).forEach((k) => {
      const v = row[k];
      const col = C[FIELDS[k].col];
      if (v === undefined || v === null || v === "" || !col) return;
      if (FIELDS[k].keep && sh.getRange(r, col).getValue() !== "") return;
      sh.getRange(r, col).setValue(asText(v));
    });
    sh.getRange(r, C["עודכן"]).setValue(now).setNumberFormat("dd/MM HH:mm");
    return { ok: true, row: r };
  });
}

/** תפיסת מקום בתקרת הודעות הפתיחה: יום (שעון ישראל) וכתובת IP לשעה. נעול, כדי שבקשות במקביל לא יעברו יחד.
 *  rid (מזהה בקשה מהאתר): ניסיון חוזר עם אותו rid מחזיר את אותה תשובה בלי לספור שוב. גוגל לפעמים מאבד את התשובה של
 *  ה-Web App (דף שגיאה במקום JSON) אחרי שהפעולה כבר רצה, והאתר מנסה שוב (בדיקה 20.10.2026). */
function reserve(o) {
  return withLock(6000, () => {
    const p = props();
    const now = new Date();
    const day = Utilities.formatDate(now, "Asia/Jerusalem", "yyyy-MM-dd");
    const hour = Utilities.formatDate(now, "Asia/Jerusalem", "yyyy-MM-dd-HH");
    const rid = String(o.rid || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 40);
    if (rid) { const prev = p.getProperty("rid:" + rid); if (prev) return JSON.parse(prev); }
    // ניקוי מונים ישנים ומזהי בקשה מלפני יותר משעה
    const cutoff = now.getTime() - 3600 * 1000;
    p.getKeys().forEach((k) => {
      if ((k.startsWith("cap:") && k !== "cap:" + day) || (k.startsWith("ip:") && !k.endsWith(":" + hour))) p.deleteProperty(k);
      else if (k.startsWith("rid:")) { try { if ((JSON.parse(p.getProperty(k)).t || 0) < cutoff) p.deleteProperty(k); } catch (e) { p.deleteProperty(k); } }
    });
    const capKey = "cap:" + day;
    const cap = Number(p.getProperty(capKey)) || 0;
    const ip = String(o.ip || "").slice(0, 60);
    const ipKey = ip ? "ip:" + ip + ":" + hour : "";
    let out;
    if (cap >= Number(o.perDay || 0)) out = { ok: false, reason: "day" };
    else if (ipKey && (Number(p.getProperty(ipKey)) || 0) >= Number(o.perIpHour || 0)) out = { ok: false, reason: "ip" };
    else {
      p.setProperty(capKey, String(cap + 1));
      if (ipKey) p.setProperty(ipKey, String((Number(p.getProperty(ipKey)) || 0) + 1));
      out = { ok: true, day: day, hour: hour, ip: ip, rid: rid };
    }
    if (rid) p.setProperty("rid:" + rid, JSON.stringify(Object.assign({ t: now.getTime() }, out)));
    return out;
  });
}

/** החזרת מקום שנתפס כשהפתיחה לא נשלחה. עם rid: פעם אחת בלבד, גם אם האתר שלח שוב */
function release(o) {
  return withLock(6000, () => {
    const p = props();
    const rid = String(o.rid || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 40);
    if (rid) {
      const prev = p.getProperty("rid:" + rid);
      if (!prev) return { ok: true, skipped: "unknown rid" };
      const rec = JSON.parse(prev);
      if (!rec.ok || rec.released) return { ok: true, skipped: "nothing to release" };
      rec.released = true;
      p.setProperty("rid:" + rid, JSON.stringify(rec));
    }
    const dec = (k) => { const n = Number(p.getProperty(k)) || 0; if (n > 0) p.setProperty(k, String(n - 1)); };
    if (o.day) dec("cap:" + o.day);
    if (o.ip && o.hour) dec("ip:" + String(o.ip).slice(0, 60) + ":" + o.hour);
    return { ok: true };
  });
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ error: "bad request" }); }
  const secret = props().getProperty("LEADS_SHEET_SECRET");
  if (!secret || body.secret !== secret) return json({ error: "not found" });
  if (body.action === "upsert" && body.row && body.row.phone) return json(upsert(body.row));
  if (body.action === "reserve") return json(reserve(body));
  if (body.action === "release") return json(release(body));
  if (body.action === "handler") {
    const sh = sheet();
    const C = colMap(sh);
    if (missing(C).length) return json({ error: "missing columns" });
    const r = findRow(sh, C, body.phone);
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
  if (!range) return;
  const sh = range.getSheet();
  if (sh.getSheetId() !== sheet().getSheetId()) return;
  const C = colMap(sh);
  if (missing(C).length) return;
  const c0 = range.getColumn(), c1 = range.getLastColumn(), r0 = Math.max(2, range.getRow()), r1 = range.getLastRow();
  if (r1 < 2) return;
  if (c0 <= C["מי מטפל"] && C["מי מטפל"] <= c1) {
    sh.getRange(r0, C["מי מטפל עודכן"], r1 - r0 + 1, 1).setValue(new Date());
  }
  if (!(c0 <= C["שלח פתיחה"] && C["שלח פתיחה"] <= c1)) return;
  for (let r = r0; r <= r1; r++) {
    const box = sh.getRange(r, C["שלח פתיחה"]);
    if (box.getValue() === true) sendOpeningRow(sh, C, r, box);
  }
}

function sendOpeningRow(sh, C, r, box) {
  const get = (k) => (C[k] ? sh.getRange(r, C[k]).getValue() : "");
  const phone = get("טלפון");
  // שורה ריקה (תיבה שסומנה בטעות): רק מנקים את התיבה, בלי לכתוב כלום (אחרת ליד חדש יירש את הסטטוס)
  if (!String(get("שם")).trim() && !String(phone).trim()) { box.clearContent(); return; }
  const out = sh.getRange(r, C["הודעת פתיחה"]);
  if (!norm(phone)) { out.setValue("לא נשלחה: חסר טלפון"); box.clearContent(); return; }
  if (!get("תאריך")) sh.getRange(r, C["תאריך"]).setValue(new Date()).setNumberFormat("dd/MM/yyyy HH:mm");
  out.setValue("שולח...");
  try {
    const res = UrlFetchApp.fetch(siteUrl() + "/api/whatsapp/open", {
      method: "post",
      contentType: "text/plain;charset=utf-8",
      payload: JSON.stringify({
        secret: props().getProperty("LEADS_SHEET_SECRET"),
        phone: pretty(phone), name: get("שם"), source: get("מקור"), need: get("בקשת הלקוח"), ref: get("מס' פנייה"),
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
