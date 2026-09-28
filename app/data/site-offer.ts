// הצעה לאתרי בנייה בלי חשמל יציב ובלי אינטרנט (דף /offer/construction-sites, לא באינדקס; רותם שולח אותו ללקוחות).
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
  points: string[];
};

export const SITE_OFFER = {
  /** התקנה למצלמה, לפני מע"מ: קיבוע המצלמה והפאנל על גדר/קונטיינר/עמוד קיים, סים, כרטיס זיכרון והגדרת האפליקציה.
   *  הצעה של 28.9.2026 שממתינה לאישור רותם. לפני פרסום לעדכן כאן את המספר שהוא קובע. */
  installPerCamera: 750,
  /** חבילת הסים של החנות (זהה למבצע) */
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
      points: [
        "עדשה רחבה שרואה את כל האתר ועדשת זום שמתקרבת",
        "מסתובבת לבד אחרי אדם או רכב, ואפשר לסובב ולעשות זום מהנייד",
        "זרקורים וצבע בלילה, רמקול ומיקרופון",
        "סוללה + פאנל סולארי, סים 4G",
      ],
    },
  ] as OfferTier[],
};

export const offerProduct = (slug: string | null): StoreProduct | undefined =>
  slug ? storeProducts.find((p) => p.slug === slug) : undefined;

/** מחיר ציוד למצלמה אחת בחבילה, כולל מע"מ: מצלמה + פאנל */
export const tierEquipment = (t: OfferTier) => (offerProduct(t.productSlug)?.price ?? 0) + (offerProduct(t.panelSlug)?.price ?? 0);

export const installWithVat = () => Math.round(SITE_OFFER.installPerCamera * (1 + VAT_RATE));
