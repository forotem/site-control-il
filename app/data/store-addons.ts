// תוספות למצלמה שעובדת לבד (רותם 22.10.2026): "חלק מהמצלמות שלא צריכות מקליט חיצוני כן כדאי למכור אותם עם כרטיס
// זיכרון... להציע להם גם כרטיס זיכרון וגם סים דאטה... שהם יבינו שהמצלמה הזאת מגיעה בלי דאטה ובלי כרטיס סים... צ'קבוקס".
// התוספות נכנסות לעגלה ולהזמנה כמו מוצר, אבל הן לא חלק מהקטלוג: אין להן דף, הן לא ברשימות, במפת האתר ובפיד.
// מחיר הכרטיס: 109 ₪ ל-128GB כמו בעסקה SC-018 (7.10.2026, עידן). נשאל את עידן 22.10 על חברה, גודל ומחיר. הסים: 500 ₪
// לשנה, כמו במבצע (app/data/deals.ts).
import type { StoreProduct } from "./store-catalog";
import { attrsOf, isCamera } from "./store-attrs";

const addon = (slug: string, model: string, title: string, price: number, specs: string[]): StoreProduct => ({
  slug, brand: "", model, sku: null, title, category: "addon", categoryName: "תוספות", price,
  specs, highlights: [], image: null, datasheet: null, oldStock: false,
});

export const SD_ADDON = addon("addon-microsd-128gb", "כרטיס זיכרון microSD 128GB", "כרטיס זיכרון microSD 128GB למצלמה, מותקן ומפורמט", 109,
  ["128GB, מתאים לכל המצלמות שמקליטות לכרטיס", "שומר את ההקלטות בתוך המצלמה, בלי מקליט ובלי ענן"]);
export const SIM_ADDON = addon("addon-sim-data-12m", "סים דאטה לשנה", "סים עם גלישה למצלמת 4G, 12 חודשים", 500,
  ["סים ישראלי עם חבילת גלישה ל-12 חודשים", "מגיע מוכן להכנסה למצלמה"]);

export const STORE_ADDONS = [SD_ADDON, SIM_ADDON];
export const addonBySlug = (slug: string) => STORE_ADDONS.find((a) => a.slug === slug);
export const isAddon = (slug: string) => slug.startsWith("addon-");

// מקליטים לכרטיס בלי מקליט, אבל הם לא "מצלמה" ב-store-attrs
const SD_EXTRA = ["ds-kv6124-wbe1", "reolink-video-doorbell-wifi"];

/** אילו תוספות להציע עם המוצר: כרטיס למי שמקליט לבד (סוללה / Wi-Fi / 4G), וסים למצלמות 4G */
export function addonsFor(p: StoreProduct | string): { sd: boolean; sim: boolean } {
  const slug = typeof p === "string" ? p : p.slug;
  const a = attrsOf(p);
  const standalone = isCamera(a) && Boolean(a.battery || a.lte || a.wifi);
  return { sd: Boolean(a.sd) && (standalone || SD_EXTRA.includes(slug)), sim: Boolean(a.lte) };
}
