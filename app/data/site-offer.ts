// דף הקבלנים /construction-sites (לאינדקס; /sites ו-/offer/construction-sites מפנים אליו). מצלמות לאתרי בנייה בלי חשמל ובלי אינטרנט.
// נבנתה 28.9.2026 לפי שיחה עם לקוחה שיש לה כמה אתרי בנייה, 4 עד 6 מצלמות לאתר: עובד בלי חשמל, מצלם טוב בלילה,
// מתריע לנייד כשמישהו נכנס, אפשר לדבר דרך המצלמה, והחומר נשמר גם אם גונבים את המצלמה.
// מחירי הציוד נקראים מהקטלוג (כוללים מע"מ), כך שההצעה מתעדכנת עם החנות. מחיר ההתקנה נקוב לפני מע"מ, כמו במבצעים.
import { storeProducts, type StoreProduct } from "./store-catalog";
import { deals, VAT_RATE } from "./deals";

export type OfferTier = {
  id: "value" | "best";
  name: string;
  tagline: string;
  productSlug: string;
  /** פאנל סולארי שנמכר בנפרד ונכנס לכל מצלמה בחבילה (null כשהפאנל כלול באריזה) */
  panelSlug: string | null;
  /** תמונה של המצלמה עם הפאנל (רותם 6.10.2026: כשהמחיר כולל פאנל, רואים אותו גם בתמונה). נבנתה מתמונות המוצרים
   *  בסקריפט scratchpad/kitimg/compose.py; בלי שדה זה מוצגת תמונת המצלמה לבד */
  kitImage?: string;
  points: string[];
};

export const SITE_OFFER = {
  /** התקנה = הערכה לפי ימי עבודה, לא מחיר סגור (רותם 28.9.2026: "ההתקנה תלויה במיקום, במורכבות ובכמות המצלמות.
   *  יום עבודה של מתקין מקצועי עולה 2,500 ₪ בערך"). installDay לפני מע"מ. camsPerDay = כמה מצלמות סוללה+פאנל
   *  מתקינים ביום באתר רגיל (גדר/קונטיינר/עמוד קיים); זו הערכה שלנו, המחיר הסופי אחרי ביקור באתר. */
  installDay: 2500,
  camsPerDay: 6,
  /** איך מתחילים (רותם 28.9.2026): הלקוח שולח סרטון מהאתר ומייעצים מרחוק, או סיור מקצועי באתר שבו קובעים
   *  את הנקודות והמיקום של כל מצלמה. מחיר הסיור כפי שרותם נקב ("400 שח") */
  surveyPrice: 400,
  /** הסים של החנות, 500 ₪ לשנה למצלמה (זהה למבצע, רותם 6.10.2026) */
  sim: deals[0].sim,
  /** כרטיס זיכרון במתנה בהזמנה עם התקנה, כמו במבצע */
  giftCardGb: deals[0].giftCardGb,
  camsOptions: [4, 5, 6],
  sitesMax: 5,
  tiers: [
    {
      id: "value",
      name: "החסכונית",
      tagline: "4K קבועה עם זרקור. הכי הרבה מצלמות לכל שקל",
      productSlug: "reolink-go-ultra",
      panelSlug: "reolink-solar-panel-2",
      kitImage: "/store-images/reolink-go-ultra-solar-kit.webp",
      points: [
        "תמונה 4K חדה, זרקור וצבע גם בלילה",
        "זיהוי אדם והתראה לנייד",
        "רמקול ומיקרופון: מדברים עם מי שנכנס",
        "סוללה + פאנל סולארי, סים 4G",
      ],
    },
    {
      id: "best",
      name: "המקסימום",
      tagline: "שתי עדשות, זום x6 ומעקב אוטומטי אחרי מי שנכנס",
      productSlug: "reolink-trackmix-lte",
      panelSlug: "reolink-solar-panel-2",
      kitImage: "/store-images/reolink-trackmix-lte-solar-kit.webp",
      points: [
        "עדשה רחבה שרואה את כל האתר ועדשת זום שמתקרבת",
        "מסתובבת לבד אחרי אדם או רכב, ואפשר לסובב ולעשות זום מהנייד",
        "זרקורים וצבע בלילה, רמקול ומיקרופון",
        "סוללה + פאנל סולארי, סים 4G",
      ],
    },
  ] as OfferTier[],
};

/** מדריך המרחקים בדף. ppm = פיקסלים למטר שהתקן EN 62676-4 דורש (תצפית 62.5, זיהוי 250); לוחית רישוי: 200, מקובל לקריאה.
 *  נתוני המצלמות מ-Reolink (נבדק 29.9.2026): Go Ultra 3840 פיקסלים, 105°; Go PT Ultra 3840, 90°; TrackMix LTE 4MP (2560),
 *  עדשה רחבה כ-105° ועדשת זום 38°. חיישן התנועה במצלמות הסוללה: עד 10 מ'. */
export const GUIDE = {
  goals: [
    { id: "see", label: "לראות שנכנס אדם ומה הוא עושה", short: "שמישהו נכנס", ppm: 62.5, object: "person" as const },
    { id: "plate", label: "לקרוא מספר רכב", short: "מספר רכב", ppm: 200, object: "plate" as const },
    { id: "face", label: "לזהות מי זה", short: "מי זה (פנים)", ppm: 250, object: "face" as const },
  ],
  cameras: [
    { slug: "reolink-go-ultra", name: "Go Ultra", lenses: [{ label: "", hres: 3840, hfov: 105 }] },
    { slug: "reolink-go-pt-ultra", name: "Go PT Ultra", lenses: [{ label: "", hres: 3840, hfov: 90 }] },
    { slug: "reolink-trackmix-lte", name: "TrackMix LTE", lenses: [{ label: "עדשה רחבה", hres: 2560, hfov: 105 }, { label: "עדשת הזום", hres: 2560, hfov: 38 }] },
  ],
};

export const offerProduct = (slug: string | null): StoreProduct | undefined =>
  slug ? storeProducts.find((p) => p.slug === slug) : undefined;

/** מחיר ציוד למצלמה אחת בחבילה, כולל מע"מ: מצלמה + פאנל */
export const tierEquipment = (t: OfferTier) => (offerProduct(t.productSlug)?.price ?? 0) + (offerProduct(t.panelSlug)?.price ?? 0);

/** יום התקנה כולל מע"מ */
export const installDayWithVat = () => Math.round(SITE_OFFER.installDay * (1 + VAT_RATE));
