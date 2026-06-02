/**
 * סקריפט העברת לידים מגיליון רותם לגיליון נועה
 *
 * התקנה:
 * 1. פתח את גיליון הלידים של רותם
 * 2. כלים → עורך Apps Script
 * 3. מחק את הקוד הקיים והדבק את הסקריפט הזה
 * 4. שמור (Ctrl+S)
 * 5. רענן את הגיליון - יופיע תפריט "פעולות" למעלה
 *
 * שימוש:
 * - סמן את השורה של הליד שרוצים להעביר
 * - לחץ על התפריט "פעולות" → "העבר ליד לנועה"
 * - או לחץ על הכפתור "העבר" שנוסף לגיליון
 */

const NOA_SPREADSHEET_ID = '16OmWANDreIBa5HDVsRKCzWuU7aPHzlURzC95dtLQ4mI';
const ROTEM_SHEET_NAME = 'גליון1'; // שם גיליון הלידים של רותם
const TRANSFERRED_COLUMN = 12; // עמודה L - "הוכנס / נכנס"

// עמודות גיליון רותם (מתחיל מ-1)
const ROTEM_COL = {
  CUSTOMER_NAME: 2,   // B - שם לקוח
  COMPANY: 3,         // C - חברה
  INITIAL_DATE: 4,    // D - תאריך פנייה ראשוני
  PHONE: 5,           // E - מספר פלאפון
  EMAIL: 6,           // F - מייל
  PROJECT_LENGTH: 7,  // G - אורך פרויקט
  LOCATION: 8,        // H - מיקום פרויקט
  QUOTE_DATE: 9,      // I - תאריך שליחת הצעת מחיר
  NOTES: 10,          // J - פירוט
  STATUS: 11,         // K - סטטוס
  TRANSFERRED: 12     // L - הוכנס / נכנס
};

// עמודות גיליון נועה (מתחיל מ-1)
const NOA_COL = {
  TIMESTAMP: 1,       // A - תאריך הוספה
  CUSTOMER_NAME: 2,   // B - שם לקוח
  COMPANY: 3,         // C - שם החברה
  EMAIL: 4,           // D - כתובת מייל
  PHONE: 5,           // E - טלפון
  LOCATION: 6,        // F - מיקום האתר
  PRICE: 7,           // G - מחיר (יושאר ריק לנועה)
  CAMERAS: 8,         // H - כמות מצלמות (יושאר ריק)
  MONTHS: 9,          // I - מספר חודשים צילום
  INSTALL_PRICE: 10,  // J - מחיר התקנה (יושאר ריק)
  EXTRAS: 11,         // K - תוספות (יושאר ריק)
  OVERRUN: 12,        // L - מחיר חריגה (יושאר ריק)
  LAST_UPDATE: 16     // P - תאריך טיפול אחרון
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('פעולות')
    .addItem('⬆️ העבר ליד לנועה', 'transferLead')
    .addSeparator()
    .addItem('➕ הוסף כפתור "העבר" לגיליון', 'addTransferButton')
    .addToUi();
}

function transferLead() {
  const ui = SpreadsheetApp.getUi();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(ROTEM_SHEET_NAME)
                || spreadsheet.getActiveSheet();

  const selectedRange = sheet.getActiveRange();
  const row = selectedRange.getRow();

  // בדיקה שלא נבחרה שורת כותרת
  if (row <= 1) {
    ui.alert('שגיאה', 'אנא בחר שורת ליד (לא את שורת הכותרות)', ui.ButtonSet.OK);
    return;
  }

  // קריאת הנתונים מהשורה הנבחרת
  const rowData = sheet.getRange(row, 1, 1, 12).getValues()[0];

  const customerName   = rowData[ROTEM_COL.CUSTOMER_NAME - 1];
  const company        = rowData[ROTEM_COL.COMPANY - 1];
  const initialDate    = rowData[ROTEM_COL.INITIAL_DATE - 1];
  const phone          = rowData[ROTEM_COL.PHONE - 1];
  const email          = rowData[ROTEM_COL.EMAIL - 1];
  const projectLength  = rowData[ROTEM_COL.PROJECT_LENGTH - 1];
  const location       = rowData[ROTEM_COL.LOCATION - 1];
  const alreadyTransferred = rowData[ROTEM_COL.TRANSFERRED - 1];

  // בדיקה שהשורה לא ריקה
  if (!customerName) {
    ui.alert('שגיאה', 'השורה הנבחרת ריקה. אנא בחר שורה עם נתונים.', ui.ButtonSet.OK);
    return;
  }

  // בדיקה שהליד לא הועבר כבר
  if (alreadyTransferred && alreadyTransferred.toString().trim() !== '') {
    const response = ui.alert(
      'הליד כבר הועבר',
      `הליד "${customerName}" הועבר כבר בעבר (${alreadyTransferred}).\nהאם להעביר שוב?`,
      ui.ButtonSet.YES_NO
    );
    if (response !== ui.Button.YES) return;
  }

  // פתיחת גיליון נועה
  let noaSpreadsheet;
  try {
    noaSpreadsheet = SpreadsheetApp.openById(NOA_SPREADSHEET_ID);
  } catch (e) {
    ui.alert('שגיאה', 'לא ניתן לגשת לגיליון של נועה. ודא שיש הרשאות גישה.', ui.ButtonSet.OK);
    return;
  }

  const noaSheet = noaSpreadsheet.getSheets()[0];

  // מציאת השורה הפנויה הבאה בגיליון נועה
  const nextRow = findNextEmptyRow(noaSheet);

  // כתיבת הנתונים לגיליון נועה
  noaSheet.getRange(nextRow, NOA_COL.TIMESTAMP).setValue(initialDate);
  noaSheet.getRange(nextRow, NOA_COL.CUSTOMER_NAME).setValue(customerName);
  noaSheet.getRange(nextRow, NOA_COL.COMPANY).setValue(company);
  noaSheet.getRange(nextRow, NOA_COL.EMAIL).setValue(email);
  noaSheet.getRange(nextRow, NOA_COL.PHONE).setValue(phone);
  noaSheet.getRange(nextRow, NOA_COL.LOCATION).setValue(location);
  noaSheet.getRange(nextRow, NOA_COL.MONTHS).setValue(projectLength);

  // סימון בגיליון רותם שהליד הועבר
  const transferDate = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yy HH:mm');
  sheet.getRange(row, ROTEM_COL.TRANSFERRED).setValue(`הועבר לנועה ${transferDate}`);

  // צביעת השורה בירוק בגיליון רותם לסימון ויזואלי
  sheet.getRange(row, 1, 1, 12).setBackground('#c6efce');

  ui.alert(
    '✅ הועבר בהצלחה!',
    `הליד של "${customerName}" הועבר לגיליון נועה בשורה ${nextRow}.`,
    ui.ButtonSet.OK
  );
}

/**
 * מוצא את השורה הפנויה הבאה בגיליון נועה
 * מחפש את השורה הראשונה שבה עמודה B (שם לקוח) ריקה, אחרי שורת הכותרת
 */
function findNextEmptyRow(sheet) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return 2; // אין נתונים עדיין, חזור לשורה 2

  const nameColumn = sheet.getRange(2, NOA_COL.CUSTOMER_NAME, lastRow - 1, 1).getValues();

  for (let i = 0; i < nameColumn.length; i++) {
    if (!nameColumn[i][0] || nameColumn[i][0].toString().trim() === '') {
      return i + 2; // +2 כי מתחילים משורה 2 והאינדקס מתחיל מ-0
    }
  }

  // אין שורות ריקות - מוסיפים בסוף
  return lastRow + 1;
}

/**
 * מוסיף כפתור "העבר" לגיליון (פועל פעם אחת בהתקנה)
 */
function addTransferButton() {
  const sheet = SpreadsheetApp.getActiveSheet();

  // בדיקה אם הכפתור כבר קיים
  const drawings = sheet.getDrawings();
  for (const d of drawings) {
    if (d.getContainerInfo().getOffsetX() < 50) {
      SpreadsheetApp.getUi().alert('הכפתור כבר קיים בגיליון!');
      return;
    }
  }

  // יצירת כפתור
  const button = sheet.newDrawing()
    .setPosition(1, 1, 5, 5)
    .setWidth(120)
    .setHeight(40)
    .build();

  sheet.insertDrawing(button);

  SpreadsheetApp.getUi().alert(
    'כפתור נוסף!',
    'הכפתור נוסף לגיליון.\n\nכדי לקשר אותו לפעולת ההעברה:\n1. לחץ ימני על הכפתור\n2. "הקצה סקריפט"\n3. הכנס: transferLead',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
