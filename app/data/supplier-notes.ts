// ניסיון מול היבואן (עידן, טלרן): מה קרה בהזמנות קודמות ומה הוצע במקום. זה לא מצב מלאי:
// הזמינות נבדקת מחדש בכל הזמנה, והאתר לא מסמן "אזל". ההערות נכנסות להתראת ההזמנה לצוות,
// כדי שאם המוצר שוב לא זמין, כבר יודעים מה להציע. מתעדכן אחרי כל תשובה של עידן.
export type SupplierNote = {
  /** מה קרה ומתי, במילים של מי שמטפל בהזמנה */
  history: string;
  /** חלופות שעידן הציע או שהיו במלאי, לפי סדר העדפה */
  alternatives?: { slug: string; why: string }[];
};

export const SUPPLIER_NOTES: Record<string, SupplierNote> = {
  "reolink-rlk8-1200b4-a": {
    history: "1.10.2026 עידן: לא זמין (חזרה צפויה בעוד 1–3 שבועות). הזמנה SC-MUP3D9EL.",
    alternatives: [
      { slug: "reolink-rlk8-1200d4-a", why: "אותה ערכה 12MP עם כיפות, הייתה במלאי בעדשה 2.8 ו-4 מ\"מ. עידן: למכור אותה, זה ה-12MP שהלקוח ביקש" },
      { slug: "reolink-rlk8-810b4-a-rlk8-800b4", why: "אם חשוב צינור: ערכת 4K 8MP צינור (NVS8-8MB4), עידן הציע אותה ראשונה" },
    ],
  },
  "reolink-rlk8-1200d4-a": {
    history: "1.10.2026 עידן: במלאי בשתי עדשות, 2.8 מ\"מ ו-4 מ\"מ. לשאול את הלקוח איזו עדשה לפני אישור.",
  },
};

export const supplierNoteOf = (slug: string): SupplierNote | undefined => SUPPLIER_NOTES[slug];
