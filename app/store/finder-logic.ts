// לוגיקת "מצא לי את המוצר": שאלון קצר -> המלצה מנומקת מתוך הקטלוג. טהור, בלי React, כדי שאפשר לבדוק אותו בנפרד.
import { storeProducts, type StoreProduct } from "../data/store-catalog";

export type Place = "home" | "apartment" | "business" | "building" | "site";
export type Existing = "none" | "analog" | "ipnvr" | "single" | "access";
export type Count = "1" | "2-4" | "5-8" | "9-16" | "17+";
export type Priority = "color" | "deter" | "ai" | "simple" | "cheap";
export type Budget = "low" | "mid" | "high" | "any";

export type Answers = { place?: Place; existing?: Existing; count?: Count; priority?: Priority; budget?: Budget };

export type Question = {
  id: keyof Answers;
  title: string;
  hint?: string;
  options: { value: string; label: string; desc: string }[];
};

export const questions: Question[] = [
  {
    id: "place",
    title: "מה רוצים לאבטח?",
    options: [
      { value: "home", label: "בית פרטי", desc: "חצר, כניסה, חניה, גדר" },
      { value: "apartment", label: "דירה או משרד קטן", desc: "כניסה, סלון, חדר עבודה" },
      { value: "business", label: "עסק, חנות או מחסן", desc: "קופה, מחסן, כניסת עובדים" },
      { value: "building", label: "בניין משותף", desc: "כניסה, לובי, חניון, אינטרקום" },
      { value: "site", label: "אתר בנייה או שטח פתוח", desc: "בלי חשמל או אינטרנט קבועים" },
    ],
  },
  {
    id: "existing",
    title: "מה כבר קיים אצלך?",
    options: [
      { value: "none", label: "כלום, מתחילים מאפס", desc: "צריך מצלמות ומקליט" },
      { value: "analog", label: "מערכת ישנה על כבל קואקס", desc: "מצלמות אנלוגיות ו-DVR" },
      { value: "ipnvr", label: "יש מקליט IP, צריך רק מצלמות", desc: "NVR קיים או ערכת Reolink/Hikvision" },
      { value: "single", label: "רוצה מצלמה בודדת בלי מקליט", desc: "Wi-Fi, הקלטה לכרטיס ואפליקציה" },
      { value: "access", label: "אינטרקום או בקרת כניסה", desc: "פתיחת דלת, זיהוי פנים, קודן" },
    ],
  },
  {
    id: "count",
    title: "כמה נקודות צילום צריך?",
    hint: "ספירה פשוטה: כל כיוון שרוצים לראות זו נקודה. כניסה, חצר אחורית, חניה, גדר צדדית.",
    options: [
      { value: "1", label: "1", desc: "נקודה אחת" },
      { value: "2-4", label: "2 עד 4", desc: "בית או חנות קטנה" },
      { value: "5-8", label: "5 עד 8", desc: "בית גדול או עסק" },
      { value: "9-16", label: "9 עד 16", desc: "מחסן, מפעל קטן, בניין" },
      { value: "17+", label: "17 ומעלה", desc: "מתחם או מספר מבנים" },
    ],
  },
  {
    id: "priority",
    title: "מה הכי חשוב לך?",
    options: [
      { value: "color", label: "תמונה צבעונית גם בלילה", desc: "לזהות צבע רכב ובגדים בחושך" },
      { value: "deter", label: "הרתעה", desc: "אור מהבהב וסירנה כשמישהו נכנס" },
      { value: "ai", label: "התראות בלי אזעקות שווא", desc: "התראה רק על אדם או רכב, לא על חתול" },
      { value: "simple", label: "התקנה הכי פשוטה", desc: "ערכה מוכנה, כמה שפחות חלקים" },
      { value: "cheap", label: "המחיר הנמוך ביותר", desc: "פתרון בסיסי ואמין" },
    ],
  },
  {
    id: "budget",
    title: "מה התקציב לציוד?",
    hint: "לא כולל התקנה ודיסק קשיח. אפשר לדלג.",
    options: [
      { value: "low", label: "עד 1,500 ₪", desc: "" },
      { value: "mid", label: "1,500 עד 3,500 ₪", desc: "" },
      { value: "high", label: "מעל 3,500 ₪", desc: "" },
      { value: "any", label: "לא קריטי, רוצה את המתאים ביותר", desc: "" },
    ],
  },
];

export type RecItem = { product: StoreProduct; qty: number; role: string; why: string };
export type ExtItem = { href: string; label: string; why: string };
export type Recommendation = {
  headline: string;
  intro: string;
  items: RecItem[];
  ext?: ExtItem[];
  notes: string[];
  alternatives: { title: string; items: RecItem[]; why: string }[];
};

const bySlug = (slug: string) => {
  const p = storeProducts.find((x) => x.slug === slug);
  if (!p) throw new Error("finder: missing product " + slug);
  return p;
};
const item = (slug: string, qty: number, role: string, why: string): RecItem => ({ product: bySlug(slug), qty, role, why });

const camCount = (c?: Count) => (c === "1" ? 1 : c === "2-4" ? 4 : c === "5-8" ? 8 : c === "9-16" ? 16 : c === "17+" ? 24 : 4);
const budgetMax = (b?: Budget) => (b === "low" ? 1500 : b === "mid" ? 3500 : Infinity);

export function totalOf(items: RecItem[]) {
  let sum = 0, unknown = 0;
  for (const it of items) { if (it.product.price) sum += it.product.price * it.qty; else unknown++; }
  return { sum, unknown };
}

/** בחירת מצלמת IP לפי עדיפות, עם מדרגות מחיר */
function pickIpCamera(place: Place | undefined, priority: Priority | undefined, cheaper = 0): RecItem {
  const outdoor = place !== "apartment";
  const picks: Record<Priority, { slug: string; why: string }[]> = {
    color: [
      { slug: "ds-2cd2t47g2h-li-2-8mm", why: "ColorVu עם חיישן גדול 1/1.8 אינץ' ותאורה עד 60 מטר: צבע אמיתי גם בחצר חשוכה" },
      { slug: "ds-2cd1347g2-luf-2-8mm", why: "ColorVu טורט קומפקטית: צבע 24/7 עד 30 מטר, מיקרופון מובנה" },
      { slug: "ipc3614lb-af28k-dl2", why: "תאורה כפולה: אינפרא בשגרה, אור לבן וצבע כשיש תנועה. המחיר הכי נמוך ל-4MP" },
    ],
    deter: [
      { slug: "ds-2cd2387g2h-lisu-sl-2-8mm", why: "4K, אור מהבהב, סירנה ורמקול: הפורץ יודע שראו אותו לפני שנגע במשהו" },
      { slug: "ds-2cd2087g2h-liu-sl-2-8mm", why: "מיני-צינור 4K עם התראה קולית ואור, מתאימה לקיר חיצוני" },
      { slug: "ds-2cd2047g2h-liu-sl-2-8mm", why: "4MP עם סטרובוסקופ ורמקול, AcuSense מפעיל את ההרתעה רק על אדם או רכב" },
    ],
    ai: [
      { slug: "ds-2cd2043g2-iu-2-8mm", why: "AcuSense: מסווג אדם ורכב, מתעלם מחתולים ועלים. אינפרא עד 40 מטר ומיקרופון" },
      { slug: "ds-2cd2143g2-iu-2-8mm", why: "אותו AcuSense בגוף כיפה חסין ונדליזם IK10 עם מיקרופון" },
      { slug: "ipc2124lb-af28k-dl2", why: "מסנן אדם/רכב בסיסי במחיר נמוך, תאורה כפולה" },
    ],
    simple: [
      { slug: "ds-2cd1043g2-liu-2-8mm", why: "4MP עם תאורה היברידית ומיקרופון: הדגם שאנחנו מתקינים הכי הרבה בבתים" },
      { slug: "ipc3614lb-af28k-dl2", why: "טורט 4MP פשוטה לכיוון, תאורה כפולה, מיקרופון" },
      { slug: "ipc2124lb-af28k-dl2", why: "צינור 4MP במחיר הכי נמוך בחנות" },
    ],
    cheap: [
      { slug: "ipc2124lb-af28k-dl2", why: "צינור 4MP של Uniview: תאורה כפולה, מיקרופון, המחיר הכי נמוך בחנות" },
      { slug: "ipc3614lb-af28k-dl2", why: "אותו מפרט בגוף טורט, נוח יותר לכניסה ולתקרה" },
      { slug: "ds-2cd1143g2-liu-2-8mm", why: "כיפה 4MP של Hikvision עם מיקרופון, לתקרה" },
    ],
  };
  const list = picks[priority || "simple"];
  const idx = Math.min(cheaper, list.length - 1);
  const chosen = list[idx];
  const p = bySlug(chosen.slug);
  return { product: p, qty: 1, role: outdoor ? "מצלמה לחוץ ולפנים" : "מצלמה", why: chosen.why };
}

/** כשעוברים את התקציב: מבין שלוש מדרגות המחיר בוחרים את הזולה ביותר */
function cheapestStep(pick: (step: number) => RecItem, qty: number): RecItem {
  const opts = [0, 1, 2].map((s) => { const it = pick(s); it.qty = qty; return it; });
  opts.sort((x, y) => (x.product.price || 1e9) - (y.product.price || 1e9));
  return opts[0];
}

function pickNvr(n: number, priority?: Priority): RecItem {
  if (n <= 8) {
    return priority === "simple"
      ? item("ds-7608nxi-k1-8p", 1, "מקליט", "8 ערוצים עם 8 יציאות PoE מובנות: המצלמות מתחברות ישר למקליט בלי מתג נפרד. AcuSense וקושחה בעברית")
      : item("nvr301-08s3", 1, "מקליט", "NVR 8 ערוצים 4K במחיר הכי משתלם. נדרש מתג PoE קטן להזנת המצלמות (כ-150 ₪)");
  }
  if (n <= 16) return item("ds-7616nxi-k2", 1, "מקליט", "16 ערוצים, 2 דיסקים לזמן הקלטה ארוך, AcuSense מסנן התראות");
  return item("nvr302-32b-iq", 1, "מקליט", "32 ערוצים עד 12MP, 2 דיסקים, במחיר של מקליט 16 ערוצים אצל אחרים");
}

function pickAnalog(priority?: Priority, cheaper = 0): RecItem {
  const picks: Record<Priority, { slug: string; why: string }[]> = {
    color: [
      { slug: "ds-2ce12uf3t-ls-2-8mm", why: "4K ColorVu על אותו כבל קואקס: צבע 24/7 עד 40 מטר, מיקרופון" },
      { slug: "ds-2ce12kf0t-lfs-2-8mm", why: "3K ColorVu היברידית עד 40 מטר, מיקרופון" },
      { slug: "ds-2ce10kf0t-lpfs-2-8mm", why: "3K ColorVu היברידית, הדגם המשתלם ביותר לצבע בלילה" },
    ],
    deter: [
      { slug: "ds-2ce12uf3t-ls-2-8mm", why: "4K עם אור לבן חזק: האור עצמו מרתיע, ותמונה צבעונית של מי שנכנס" },
      { slug: "ds-2ce12kf0t-lfs-2-8mm", why: "3K, אור לבן עד 40 מטר" },
      { slug: "ds-2ce10kf0t-lpfs-2-8mm", why: "3K, אור לבן עד 20 מטר" },
    ],
    ai: [
      { slug: "ds-2ce12kf0t-lfs-2-8mm", why: "במערכת אנלוגית הסינון אדם/רכב נעשה במקליט AcuSense, לכן בוחרים מצלמה חדה: 3K עד 40 מטר" },
      { slug: "ds-2ce10kf0t-lpfs-2-8mm", why: "3K היברידית, מיקרופון" },
      { slug: "uac-b125-af28lm", why: "5MP אינפרא עד 40 מטר, המחיר הכי נמוך" },
    ],
    simple: [
      { slug: "ds-2ce10kf0t-lpfs-2-8mm", why: "3K ColorVu היברידית עם מיקרופון: מחליפים מצלמה במצלמה על אותו כבל" },
      { slug: "uac-t125-af28lm", why: "טורט 5MP אינפרא עד 40 מטר, מיקרופון" },
      { slug: "uac-b125-af28lm", why: "צינור 5MP אינפרא עד 40 מטר" },
    ],
    cheap: [
      { slug: "uac-b125-af28lm", why: "5MP LightHunter עם אינפרא עד 40 מטר ומיקרופון ב-109 ₪" },
      { slug: "uac-t125-af28lm", why: "אותו מפרט בגוף טורט" },
      { slug: "ds-2ce10df0t-pfs-2-8mm", why: "2MP ColorVu: צבע בלילה במחיר בסיסי" },
    ],
  };
  const list = picks[priority || "simple"];
  const c = list[Math.min(cheaper, list.length - 1)];
  return { product: bySlug(c.slug), qty: 1, role: "מצלמה על כבל קואקס", why: c.why };
}

function pickHybridRecorder(n: number, priority?: Priority): RecItem {
  if (n <= 4) return priority === "cheap"
    ? item("xvr301-04g3", 1, "מקליט היברידי", "4 ערוצי BNC + 2 IP: מחליף את ה-DVR הישן ומאפשר להוסיף מצלמות IP בהמשך")
    : item("ids-7204hqhi-m1-xt", 1, "מקליט היברידי", "4 ערוצים אנלוגיים + 2 IP, AcuSense מסנן אדם/רכב גם למצלמות הישנות");
  if (n <= 8) return priority === "cheap"
    ? item("xvr301-08g3", 1, "מקליט היברידי", "8 ערוצי BNC + 4 IP במחיר משתלם")
    : item("ids-7208hqhi-m1-xt", 1, "מקליט היברידי", "8 ערוצים אנלוגיים + 4 IP, AcuSense, הקלטה 3K");
  if (n <= 16) return item("ids-7216hqhi-m1-xt", 1, "מקליט היברידי", "16 ערוצים אנלוגיים + 8 IP, AcuSense");
  return item("ids-7232hqhi-m2-xt", 1, "מקליט היברידי", "32 ערוצים אנלוגיים + 8 IP, 2 דיסקים");
}

function pickKit(place: Place | undefined, priority: Priority | undefined, budget: Budget | undefined): RecItem {
  if (priority === "color" || budget === "high") {
    return place === "business" || place === "building"
      ? item("reolink-rlk8-1200d4-a", 1, "ערכה מוכנה", "4 כיפות 12MP עם זרקורים וצבע מלא בלילה, מקליט 8 ערוצים עם דיסק 2TB, קושחה בעברית")
      : item("reolink-rlk8-1200b4-a", 1, "ערכה מוכנה", "4 מצלמות צינור 12MP עם זרקורים, שמע דו-כיווני, מקליט עם דיסק 2TB. הכי חדה בחנות");
  }
  if (budget === "low" || priority === "cheap") {
    return item("reolink-rlk8-410b4-5mp", 1, "ערכה מוכנה", "4 מצלמות 5MP, מקליט 8 ערוצים PoE עם דיסק 2TB. הכל בקופסה אחת, מחברים ועובד");
  }
  return place === "business" || place === "building"
    ? item("reolink-rlk8-820d4-a", 1, "ערכה מוכנה", "4 כיפות 4K לתקרות ופנים, מקליט 8 ערוצים PoE עם דיסק 2TB, אפליקציה בעברית")
    : item("reolink-rlk8-810b4-a-rlk8-800b4", 1, "ערכה מוכנה", "4 מצלמות צינור 4K לחוץ, מקליט 8 ערוצים PoE עם דיסק 2TB, אפליקציה בעברית");
}

export function recommend(a: Answers): Recommendation {
  const n = camCount(a.count);
  const max = budgetMax(a.budget);
  const notes: string[] = [];

  // 1. אתר בנייה / שטח פתוח: הפתרון הסולארי של האתר
  if (a.place === "site") {
    const wired: RecItem[] = [pickIpCamera("home", "deter"), pickNvr(n)];
    wired[0].qty = n;
    return {
      headline: "לאתר בלי חשמל ואינטרנט קבועים: מצלמה סולארית 4G",
      intro: "מצלמות קוויות צריכות חשמל, כבל רשת ומקליט. באתר בנייה או בשטח פתוח זה בדרך כלל לא קיים, ולכן הפתרון שאנחנו מתקינים שם הוא מצלמה סולארית עם סים 4G, שמצלמת לענן ושולחת התראות לנייד.",
      items: [],
      ext: [
        { href: "/products/go", label: "Reolink GO Plus 4G סולארית", why: "נקודה קבועה: כניסה לאתר, מכולה, ציוד. סוללה 9000mAh ופאנל סולארי" },
        { href: "/products/ptz", label: "Reolink PTZ Solar 4G", why: "שטח גדול: מצלמה מסתובבת עם זום, סריקה אוטומטית" },
        { href: "https://timelapseit.co.il", label: "טיימלאפס לפרויקט (אתר האחות timelapseit.co.il)", why: "אם רוצים גם סרטון התקדמות של הבנייה ללקוחות ולמשקיעים" },
      ],
      notes: ["המצלמות הסולאריות אינן מוצר מדף: מתמחרים לפי האתר. השאירו פרטים ונחזור עם הצעה.", "יש באתר חשמל ואינטרנט יציב? אז מערכת קווית זולה יותר לטווח ארוך. ראו את החלופה למטה."],
      alternatives: [{ title: "יש חשמל ואינטרנט באתר", items: wired, why: "מצלמות 4K עם הרתעה (אור וסירנה) ומקליט, מתאים למחסן ציוד קבוע או למשרד אתר" }],
    };
  }

  // 2. אינטרקום ובקרת כניסה
  if (a.existing === "access") {
    if (a.place === "building") {
      const units = n;
      const items = [
        item("visionnet-2tl-821-t5-560892", 1, "פנל כניסה לבניין", "מסך מגע 5 אינץ' עם רשימת שמות בעברית, קודן וקורא תגים, על 2 גידים"),
        item("visionnet-2tl-17-560580", units, "מסך לכל דירה", "מסך 7 אינץ' על אותם 2 גידים, בלי חיווט חדש"),
      ];
      return {
        headline: "אינטרקום לבניין משותף על 2 גידים",
        intro: "בבניין קיים הכבל הישן הוא הנכס: מערכת 2 גידים של VisionNet רצה עליו בלי לפתוח קירות. פנל אחד בכניסה, מסך בכל דירה, ואפשר לשדרג דירות בודדות למסך עם אפליקציה.",
        items,
        notes: ["מספר הדירות קובע את כמות המסכים. השארנו את הכמות לפי מספר הנקודות שסימנת, נדייק בשיחה.", "לדירה שרוצה לענות מהנייד: מסך DH Wi-Fi במקום 2TL-17."],
        alternatives: [
          { title: "כניסה של עד 4 יחידות", items: [item("ds-kv8413-wme1", 1, "פנל כניסה IP", "4 לחצנים, מצלמה, קורא כרטיסים, מענה מהנייד דרך Hik-Connect"), item("ds-kh6350-wte1", Math.min(units, 4), "מסך פנימי", "מסך מגע 7 אינץ' עם Wi-Fi")], why: "בניין קטן או בית משותף עם עד 4 דיירים, כשיש תשתית רשת" },
          { title: "רק קוד ותג לשער", items: [item("visionnet-k-560820", 1, "קודן", "קודן מתכת IP68 עם קורא תגים, 2,000 משתמשים"), item("rain-roof-for-keypads-560878", 1, "גגון", "הגנה מגשם ושמש")], why: "כשלא צריך וידאו, רק בקרת כניסה לשער או לדלת" },
        ],
      };
    }
    if (a.place === "business") {
      const face = a.priority !== "cheap";
      return {
        headline: face ? "כניסת עובדים בזיהוי פנים, כולל דוח נוכחות" : "בקרת כניסה לעסק בקוד, כרטיס או אצבע",
        intro: face
          ? "מסוף זיהוי פנים פותח את הדלת בלי לגעת, ומתעד כניסות ויציאות לדוח נוכחות. הזיהוי לוקח פחות מחצי שנייה ועובד גם בתאורה חלשה."
          : "כשלא צריך זיהוי פנים, מסוף טביעת אצבע או קודן עושים את העבודה בחלק מהמחיר.",
        items: face
          ? [item("ds-k1t344ebfwx-e1", 1, "מסוף זיהוי פנים", "פנים, טביעת אצבע, כרטיס וקוד. 1,500 פנים, מסך 4.3 אינץ', Wi-Fi")]
          : [item("ds-k1t502dbfwx-c", 1, "מסוף בקרת כניסה", "טביעת אצבע, כרטיס Mifare, קוד ו-QR, עם מצלמה לאינטרקום וידאו")],
        notes: ["צריך גם מנעול חשמלי וספק כוח, מוסיפים לפי סוג הדלת. נסגור בשיחה.", "לעסק גדול (מעל 1,500 עובדים או כמה כניסות): DS-K1T671M עם 6,000 פנים ו-IP65 לחוץ."],
        alternatives: [
          { title: "הפתרון הבסיסי", items: [item("visionnet-k-560820", 1, "קודן", "קודן מתכת אנטי-ונדל IP68 עם קורא תגים")], why: "דלת אחורית, מחסן או שער: קוד ותג, בלי מסך ובלי דוחות" },
          { title: "מסוף פנים קומפקטי", items: [item("ds-k1t323mbfwx-e1", 1, "מסוף זיהוי פנים", "מארז צר למשקוף, 1,000 פנים")], why: "כשאין מקום למסוף רחב ליד הדלת" },
        ],
      };
    }
    // בית פרטי / דירה
    const simple = a.priority === "simple" || a.priority === "cheap";
    return {
      headline: simple ? "אינטרקום וידאו לבית פרטי על 2 גידים" : "אינטרקום וידאו לבית פרטי עם מענה מהנייד",
      intro: simple
        ? "ערכת 2 גידים מתחברת על הכבל הקיים של האינטרקום הישן: פנל בשער, מסך 7 אינץ' בבית, ואפשר לפתוח את השער מהמסך."
        : "כשיש תשתית רשת חדשה, ערכת IP של Hikvision נותנת הכל: מסך מגע בבית, מענה ופתיחת שער מהנייד מכל מקום, ותמונות של מי שצלצל כשלא היית.",
      items: simple
        ? [item("visionnet-kitcom-2-wire-villa-kit-560789", 1, "ערכת אינטרקום", "מסך 7 אינץ' ופנל מצלמה, חיבור Plug & Play על 2 גידים")]
        : [item("ds-kis607-s", 1, "ערכת אינטרקום IP", "פנל דלת, מסך מגע 7 אינץ' עם Wi-Fi, מתג PoE, 5 תגים וכרטיס זיכרון, הכל בקופסה")],
      notes: ["רוצה גם 2 גידים וגם אפליקציה? ערכת VisionNet DH ההיברידית עושה את שניהם.", "לשער עם קוד בלי וידאו: פנל DS-KV6124 עם קודן, Bluetooth ואפליקציה."],
      alternatives: simple
        ? [{ title: "2 גידים עם אפליקציה", items: [item("visionnet-dh-hybrid-kit-560171", 1, "ערכה היברידית", "מסך מגע 7 אינץ' עם Wi-Fi ואפליקציה + פנל S4")], why: "אותו כבל ישן, אבל עונים גם מהנייד" }]
        : [{ title: "פנל עם קודן במקום ערכה", items: [item("ds-kv6124-wbe1", 1, "פנל כניסה IP", "מצלמת 4MP 150°, קודן, כרטיס, Bluetooth ואפליקציה, 2 ממסרים לשתי דלתות")], why: "כשמספיק לענות מהנייד ולא צריך מסך בבית" },
           { title: "הכי פשוט וזול", items: [item("ds-kis212", 1, "ערכת 4 גידים", "פנל HD ומסך 7 אינץ' עם לחצנים, בלי רשת")], why: "החלפה ישירה של אינטרקום ישן, בלי אפליקציה" }],
    };
  }

  // 3. מצלמה בודדת בלי מקליט
  if (a.existing === "single" || (a.count === "1" && a.existing === "none")) {
    const indoor = a.place === "apartment" || a.place === "business";
    const items = indoor
      ? [item("cp3-pro", 1, "מצלמת Wi-Fi לפנים", "2K, מסתובבת 360° ועוקבת אחרי אדם, שמע דו-כיווני, זיהוי בכי תינוק. מקליטה לכרטיס ולאפליקציה")]
      : [item("ch10", 1, "מצלמת Wi-Fi לחוץ", "שתי עדשות 10MP: רחבה קבועה ועדשת זום מסתובבת, ראיית לילה צבעונית, חיבור חשמל בלבד")];
    return {
      headline: indoor ? "מצלמה אחת לבית או למשרד, בלי חיווט" : "מצלמה אחת לחצר, חשמל בלבד",
      intro: "כשצריך נקודה אחת, מקליט הוא בזבוז. מצלמת Wi-Fi מקליטה לכרטיס זיכרון, שולחת התראה לנייד ומאפשרת לדבר דרכה.",
      items,
      notes: ["חשוב: צריך שקע חשמל במרחק כבל, ו-Wi-Fi טוב במקום ההתקנה.", "אם בעתיד תרצו 3 או 4 מצלמות עם הקלטה רציפה, עדיף כבר עכשיו ערכת Reolink."],
      alternatives: indoor
        ? [{ title: "לחוץ במקום לפנים", items: [item("ct3", 1, "מצלמת Wi-Fi צינור", "Full HD, ראיית לילה צבעונית עד 30 מטר, אזעקת אור וקול")], why: "כניסה או מרפסת" }]
        : [{ title: "יותר זול", items: [item("ct3", 1, "מצלמת Wi-Fi צינור", "Full HD, ראיית לילה צבעונית עד 30 מטר, שמע דו-כיווני, אזעקת אור וקול")], why: "כיוון קבוע אחד, בלי סיבוב" },
           { title: "איכות של מצלמת IP מקצועית", items: [item("ds-2cd1p47g2-luf-2-8mm", 1, "מצלמה ממונעת PT", "4MP ColorVu, מסתובבת מרחוק, כרטיס זיכרון, מחייבת כבל רשת PoE")], why: "כשיש אפשרות להעביר כבל רשת" }],
    };
  }

  // 4. שדרוג מערכת אנלוגית
  if (a.existing === "analog") {
    let cam = pickAnalog(a.priority);
    let rec = pickHybridRecorder(n, a.priority);
    cam.qty = n;
    let t = totalOf([cam, rec]).sum;
    if (t > max) cam = cheapestStep((s) => pickAnalog(a.priority, s), n);
    if (t > max && a.priority !== "cheap") { rec = pickHybridRecorder(n, "cheap"); }
    return {
      headline: "שדרוג המערכת הקיימת על אותם כבלים",
      intro: "לא צריך לפרק כלום: מצלמות Turbo HD חדשות מתחברות לכבל הקואקס הקיים, ומקליט היברידי חדש נותן תמונה חדה, סינון אדם/רכב ואפליקציה. אפשר להחליף מצלמה-מצלמה בקצב שלכם.",
      items: [cam, rec],
      notes: ["המקליט מסופק בלי דיסק. דיסק 2TB לצפייה כשבועיים אחורה, 4TB לחודש.", "כבל קואקס תקין מעביר גם 4K. אם הכבל ישן מאוד או מעל 150 מטר, נבדוק לפני."],
      alternatives: [
        { title: "מעבר ל-IP במקום שדרוג", items: [(() => { const c = pickIpCamera(a.place, a.priority); c.qty = n; return c; })(), pickNvr(n, a.priority)], why: "כשמשפצים ממילא: מצלמות IP נותנות יותר פרטים, זום דיגיטלי אמיתי וגמישות להרחבה" },
      ],
    };
  }

  // 5. רק מצלמות למקליט קיים
  if (a.existing === "ipnvr") {
    let cam = pickIpCamera(a.place, a.priority);
    cam.qty = n;
    if (totalOf([cam]).sum > max) cam = cheapestStep((s) => pickIpCamera(a.place, a.priority, s), n);
    const better = pickIpCamera(a.place, a.priority === "cheap" ? "simple" : a.priority === "color" ? "deter" : "color");
    better.qty = n;
    return {
      headline: "מצלמות IP למקליט הקיים",
      intro: "כל מצלמת IP בחנות עובדת בפרוטוקול ONVIF, כך שהיא מתחברת למקליטי Hikvision, Uniview, Reolink ורוב האחרים. בחרנו לפי מה שהכי חשוב לך.",
      items: [cam],
      notes: ["בדקו שיש למקליט ערוצים פנויים ויציאת PoE פנויה, או מתג PoE.", "מקליט Reolink? מצלמות Hikvision מתחברות דרך ONVIF, אבל הזיהוי החכם (AcuSense) יפעל רק במקליט Hikvision."],
      alternatives: [{ title: "מדרגה אחת למעלה", items: [better], why: better.why }],
    };
  }

  // 6. מערכת חדשה מאפס
  if (n <= 4 && (a.priority === "simple" || a.budget === "low" || a.priority === "cheap")) {
    const kit = pickKit(a.place, a.priority, a.budget);
    const diy: RecItem[] = [pickIpCamera(a.place, "cheap"), pickNvr(4)];
    diy[0].qty = n;
    return {
      headline: "ערכה מוכנה: 4 מצלמות, מקליט ודיסק בקופסה אחת",
      intro: "ל-2 עד 4 מצלמות ערכת Reolink היא הדרך הכי קצרה למערכת שעובדת: המקליט כולל דיסק 2TB ויציאות PoE, המצלמות מזוהות אוטומטית, והאפליקציה בעברית.",
      items: [kit],
      notes: ["המצלמות מגיעות עם כבל רשת 18 מטר לכל אחת. מרחק גדול יותר: כבל ארוך יותר.", "רוצים לערבב סוגי מצלמות (למשל אחת עם זום)? הרכבה עצמית, למטה."],
      alternatives: [{ title: "הרכבה עצמית, יותר זול", items: diy, why: "מקליט Uniview 8 ערוצים + מצלמות 4MP במחיר נמוך יותר, אבל בלי דיסק ובלי מתג PoE (כ-450 ₪ נוספים)" }],
    };
  }
  let cam = pickIpCamera(a.place, a.priority);
  cam.qty = n;
  let rec = pickNvr(n, a.priority);
  if (totalOf([cam, rec]).sum > max) cam = cheapestStep((s) => pickIpCamera(a.place, a.priority, s), n);
  if (n <= 4 && a.place === "apartment") {
    // דירה קטנה: כיפות לתקרה
    cam = { ...item("ds-2cd1143g2-liu-2-8mm", n, "מצלמת כיפה לתקרה", "4MP עם תאורה היברידית ומיקרופון, דיסקרטית על תקרה"), qty: n };
  }
  const extra: RecItem[] = [];
  if (a.place === "business" && n >= 5) extra.push(item("ds-2cd2955g0-isu-1-05mm", 1, "מצלמה פנורמית לחלל המכירה", "180° במצלמה אחת: רואים את כל החנות בלי נקודות מתות"));
  if (a.place === "building" && n >= 5) extra.push(item("ids-2cd7a46g2-p-izhsy-8-32mm", 1, "מצלמת לוחיות לחניון", "קוראת לוחיות רישוי עד 100 מטר, גם בלילה"));
  const items = [cam, rec, ...extra];
  const t = totalOf(items);
  if (a.budget && a.budget !== "any" && t.sum > max) notes.push(`המפרט שבחרת עובר את התקציב שסימנת. אפשר להתחיל בפחות מצלמות ולהוסיף אחר כך: המקליט כבר תומך.`);
  notes.push("המקליט מסופק בלי דיסק קשיח. דיסק Surveillance 4TB מספיק לחודש הקלטה של 8 מצלמות.");
  if (!rec.product.slug.includes("8p")) notes.push("להזנת המצלמות צריך מתג PoE. אנחנו מתאימים מתג לפי מספר המצלמות והמרחקים.");
  const upgrade = pickIpCamera(a.place, a.priority === "deter" ? "deter" : "color");
  upgrade.qty = n;
  return {
    headline: a.place === "business" ? "מערכת IP לעסק: מצלמות, מקליט וסינון התראות" : a.place === "building" ? "מערכת IP לבניין" : "מערכת IP לבית",
    intro: "מערכת מצלמות IP בנויה משלושה חלקים: מצלמות, מקליט ומתג PoE שמזין אותן. בחרנו מצלמה אחת שמתאימה לרוב הנקודות, ומקליט עם מקום לגדול.",
    items,
    notes,
    alternatives: upgrade.product.slug !== cam.product.slug
      ? [{ title: "המצלמה בדרגה גבוהה יותר", items: [upgrade], why: upgrade.why }]
      : [],
  };
}

export function whatsappText(a: Answers, r: Recommendation) {
  const label = (q: keyof Answers) => questions.find((x) => x.id === q)?.options.find((o) => o.value === a[q])?.label;
  const lines = [
    "היי, מילאתי את שאלון ההתאמה באתר.",
    `מה מאבטחים: ${label("place") || "-"}`,
    `קיים: ${label("existing") || "-"}`,
    `נקודות: ${label("count") || "-"}`,
    `חשוב לי: ${label("priority") || "-"}`,
    `תקציב: ${label("budget") || "-"}`,
    `ההמלצה שקיבלתי: ${r.headline}`,
    ...r.items.map((it) => `- ${it.qty} x ${it.product.model}${it.product.sku ? ` (מק"ט ${it.product.sku})` : ""}`),
    "אשמח לבדיקת זמינות ומחיר סופי.",
  ];
  return lines.join("\n");
}
