// פרטי העסק במקום אחד: אזור ההתקנה, שעות, פרטים משפטיים. כל דף, סכמה ומודעה קוראים מכאן,
// כדי שהאתר לא יסתור את עצמו או את המודעות (למשל "התקנה בכל הארץ" מול מודעה שמבטיחה מחיר התקנה קבוע).
export const BUSINESS = {
  brand: "Site-Control",
  legalName: "סטודיו גולן",
  licenseId: "039513494", // עוסק מורשה
  installer: "רותם",
  phoneDisplay: "050-2256866",
  phoneE164: "+972502256866",
  email: "info@site-control-il.com",
  /** אזור ההתקנה (החלטת רותם 24.9.2026): שירות נפרד בכל הארץ, בתיאום ולפי הצעת מחיר. מחיר הציוד מחייב, ההתקנה בהצעה. */
  installArea: "כל הארץ, בתיאום ולפי הצעת מחיר",
  installAreaIn: "בכל הארץ, בתיאום ולפי הצעת מחיר",
  hours: "א'-ה' 08:00-18:00, ו' 08:00-14:00",
  hoursSpec: [
    { days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: "08:00", closes: "18:00" },
    { days: ["Friday"], opens: "08:00", closes: "14:00" },
  ],
} as const;
