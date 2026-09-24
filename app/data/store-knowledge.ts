// בסיס הידע של עוזר המכירות: טקסט קומפקטי שנבנה פעם אחת מהקטלוג, מהמאפיינים ומהמדריכים.
// נטען רק בצד השרת (API route). אין כאן מידע סודי.
import { storeProducts, storeCategories, deliveryOptions, WARRANTY_TEXT, productName } from "./store-catalog";
import { attrsOf, fitLine, kindLabel, nightLabel, audioLabel, aiLabel, isCamera, isRecorder, mpLabel } from "./store-attrs";
import { storeGuides } from "./store-guides";

function productLine(p: (typeof storeProducts)[number]): string {
  const a = attrsOf(p);
  const bits: string[] = [];
  bits.push(kindLabel[a.kind]);
  if (isCamera(a)) {
    if (a.mp) bits.push(mpLabel(a.mp));
    if (a.night) bits.push(nightLabel[a.night] + (a.range ? ` עד ${a.range} מ'` : ""));
    if (a.audio && a.audio !== "none") bits.push(audioLabel[a.audio]);
    if (a.ai && a.ai !== "none") bits.push(aiLabel[a.ai]);
    if (a.deter) bits.push("אור מהבהב וסירנה");
    if (a.varifocal) bits.push("עדשה ממונעת");
    if (a.wideSensor) bits.push('חיישן 1/1.8"');
    if (a.ik10) bits.push("IK10");
    if (a.sd) bits.push("כרטיס זיכרון");
    if (a.wifi) bits.push("Wi-Fi");
  } else if (isRecorder(a)) {
    bits.push(`${a.channels} ערוצים`, a.poePorts ? `${a.poePorts} PoE מובנה` : "בלי PoE (נדרש מתג)", `${a.bays || 1} דיסקים`, `עד ${a.maxMp || 8}MP`);
    if (a.ai === "acusense") bits.push("AcuSense");
  } else if (a.kind === "kit") {
    bits.push(`${a.cams} מצלמות ${mpLabel(a.mp)}`, `מקליט ${a.channels} ערוצים PoE`, `דיסק ${a.hdd}`);
    if (a.night) bits.push(nightLabel[a.night]);
  } else {
    const wiring: Record<string, string> = { ip: "IP", "2wire": "2 גידים", "4wire": "4 גידים", hybrid: "2 גידים + Wi-Fi", standalone: "עצמאי", other: "" };
    if (a.wiring && wiring[a.wiring]) bits.push(wiring[a.wiring]);
    if (a.app) bits.push("אפליקציה");
    if (a.auth?.length) bits.push("פתיחה: " + a.auth.join("/"));
  }
  const price = p.price ? `${p.price} ₪` : "מחיר לפי פנייה";
  const hl = p.highlights.slice(0, 2).join("; ");
  return `- [${p.slug}] ${productName(p)}${p.sku ? ` (מק"ט ${p.sku})` : ""} | ${price} | ${p.title} | ${bits.join(", ")} | מתאים ל: ${fitLine(p)}${p.oldStock ? " | מלאי ישן במבצע חיסול" : ""} | ${hl}`;
}

export function buildKnowledge(): string {
  const cats = storeCategories.map((c) => {
    const items = storeProducts.filter((p) => p.category === c.id);
    const g = storeGuides[c.id];
    const guide = g
      ? `איך בוחרים: ${g.lead}\n${g.choose.map((x) => `* ${x.title}: ${x.body}`).join("\n")}\nמונחים: ${g.terms.map((t) => `${t.term} = ${t.explain}`).join(" | ")}`
      : "";
    return `## ${c.name} (${items.length} מוצרים)\n${c.blurb}\n${guide}\nמוצרים:\n${items.map(productLine).join("\n")}`;
  });
  const policies = [
    `אחריות: ${WARRANTY_TEXT}.`,
    "מדיניות מחיר: המטרה שלנו להיות הזולים בישראל לאותו דגם, בכמה שקלים מתחת לזול ביותר (לא בהנחות של אחוזים). אם לקוח אומר שמצא זול יותר באתר ישראלי, בקש קישור, אמור שנשווה את המחיר, וסמן escalate כדי שרותם יאשר. אל תבטיח בעצמך מחיר נמוך מזה שבקטלוג.",
    `אספקה: ${deliveryOptions.map((d) => `${d.title} (${d.desc})`).join("; ")}.`,
    "מלאי: המוצרים מגיעים מהמלאי של היבואן בישראל. לפני חיוב מאשרים זמינות ומועד אספקה בווצאפ, כך שאף אחד לא משלם על מוצר שאין במלאי.",
    "מחירים: כוללים מע\"מ, לא כוללים התקנה ולא כוללים דיסק קשיח למקליטים.",
    "הנחת כמות: מ-5 יחידות מאותו מוצר, או הזמנה מעל 5,000 ₪, יש מחיר לקבלנים: אוספים פרטים ומחזירים הצעת מחיר.",
    "התקנה: הצוות של Site-Control מתקין בכל הארץ, לפי הצעת מחיר.",
    "תשלום: כרגע ההזמנה נסגרת בווצאפ או בטלפון מול נציג, אחרי אישור זמינות. אין תשלום אונליין באתר בשלב זה.",
    "קישורים: חנות /store, שאלון התאמה /store/finder, דף מוצר /store/<slug>, יצירת קשר /contact, ווצאפ https://wa.me/972502256866.",
  ].join("\n");
  const playbook = [
    "ארבע משפחות של מערכות, וזה ההבדל שמשנה ללקוח:",
    "1) מצלמות רשת IP עם מקליט NVR (Hikvision, Uniview, Reolink PoE): כבל רשת אחד לכל מצלמה מהמקליט או ממתג PoE, הקלטה רציפה 24/7 לדיסק, לא תלוי ב-Wi-Fi, האיכות והיציבות הגבוהות ביותר. מתאים ל-3 מצלמות ומעלה, לעסק, לבניין, לבית עם תשתית. דורש: כבלים (אם אין תשתית, ההתקנה כוללת השחלת כבלים), מקליט + דיסק קשיח, ומתג PoE אם למקליט אין PoE מובנה. ערכה מוכנה (מקליט + 4 או 8 מצלמות + דיסק) היא הדרך הכי פשוטה.",
    "2) מצלמות Wi-Fi עצמאיות (Tenda CH/CP/CT, Reolink E1, Lumus, Duo 2 WiFi, TrackMix WiFi): רק חשמל ו-Wi-Fi ביתי, הקלטה לכרטיס זיכרון (או ל-Reolink Home Hub / NVR אלחוטי), הכל באפליקציה. מתאים ל-1 עד 3 נקודות בבית, בדירה, במשרד או בחנות קטנה, בלי קבלן ובלי כבלים. מגבלות: חייב שקע חשמל ליד המצלמה, תלוי בקליטת Wi-Fi (חצר רחוקה מהראוטר = תמונה קופאת), כרטיס זיכרון קטן ונעלם אם גונבים את המצלמה, לא מתאים לעסק שצריך הקלטה רציפה מכל הזוויות.",
    "3) מצלמות סוללה וסולאריות, Wi-Fi או 4G (Reolink Argus, Go, TrackMix LTE, Duo 2 LTE): בלי חשמל ובלי כבלים. Argus = Wi-Fi בסוללה לבית (כניסה, חצר, מחסן בגינה). Go = סים 4G לאתר בלי אינטרנט (אתר בנייה, מחסן מרוחק, חווה, קרוואן). מקליטות רק באירועים (זיהוי תנועה), לא 24/7. צריך פאנל סולארי או טעינה ידנית, ול-4G סים עם חבילת גלישה.",
    "4) אנלוגי TVI / Turbo HD (Hikvision DS-2CE): רק כשיש כבל קואקס קיים ומקליט DVR, כלומר שדרוג מערכת ישנה. למערכת חדשה לא ממליצים אנלוגי.",
    "שאלות הבירור, בסדר הזה: כמה נקודות? יש חשמל ליד הנקודה? יש תשתית קיימת (כבל רשת או קואקס)? יש שם Wi-Fi יציב, או שהמקום מרוחק? צריך הקלטה רציפה 24/7 (עסק, ביטוח) או מספיקות התראות? זה בית, דירה, עסק או אתר? ומה התקציב?",
    "כללי אצבע: 1 עד 2 מצלמות בבית עם Wi-Fi טוב וחשמל = Wi-Fi עצמאית. 3 מצלמות ומעלה, עסק, או צורך בהקלטה רציפה = IP PoE עם NVR (ערכה). אין חשמל = סוללה עם פאנל. אין אינטרנט = 4G עם סים. יש קואקס ומקליט = אנלוגי. Wi-Fi חלש בחצר = לא Wi-Fi: כבל, או 4G. כבל רשת מגיע עד 100 מטר ממתג או ממקליט; יותר מזה צריך מתג נוסף. אין תשתית אבל רוצים איכות ומקליט: NVR אלחוטי Reolink NVS12W עם מצלמות Wi-Fi של Reolink.",
    "מה להוסיף למחיר כדי שלא תהיה הפתעה: מקליט מגיע בלי דיסק (דיסק 2TB הלקוח קונה בנפרד, בערך 300 עד 400 ₪), מתג PoE אם למקליט אין PoE, כבלים והתקנה לפי הצעת מחיר, סים למצלמת 4G, פאנל סולארי אם לא כלול.",
    "טעויות שמוכר טוב מונע: מצלמת IP בודדת בלי מקליט או מתג PoE (היא לא עובדת לבד); מצלמת Wi-Fi בחצר רחוקה מהראוטר; אנלוגי למערכת חדשה; לשכוח דיסק; מצלמת סוללה למקום שצריך הקלטה רציפה.",
    "איך מסבירים: משפט אחד לכל סוג רלוונטי, ואז שאלה מבררת אחת. אחרי הבירור מציגים שתי אפשרויות עם מחיר מהקטלוג (הזולה והמומלצת) ואומרים מה ההבדל שמשנה. כשצריך פריסת תשתית או התקנה, מציעים לשלוח פרטים כדי שהצוות ייתן הצעת מחיר להתקנה.",
  ].join("\n");
  const solar = [
    "מצלמות הסוללה של Reolink נמצאות בקטלוג בקטגוריה 'סולארי 4G ובסוללה' עם מחירים אמיתיים. שתי משפחות: 4G עם סים (Go Plus, Go Ultra, Go PT Plus, Go PT Ultra, Duo 2 LTE, TrackMix LTE, Go Ranger) לאתרים בלי אינטרנט, ו-Wi-Fi בסוללה (Argus) לבית.",
    "חשוב לשאול לפני מחיר: עם פאנל סולארי או בלי? רוב הדגמים בלי פאנל (Solar Panel 2 נמכר בנפרד, 79 ₪); Go PT Ultra, Go Ranger ו-TrackMix LTE Plus מגיעים עם פאנל. וגם: קבועה, ממונעת או פנורמית, וכמה נקודות.",
    "סים: הלקוח צריך סים עם חבילת גלישה (10 עד 30GB לחודש). אנחנו עוזרים לבחור ולהגדיר. התקנה על עמוד או פיגום באתר: לפי הצעת מחיר, לא כלולה במחיר המצלמה.",
    "טיימלאפס וסרטוני התקדמות בנייה אינם שירות של האתר הזה: מפנים לאתר האחות https://timelapseit.co.il.",
  ].join("\n");
  return `# מדיניות ושירות\n${policies}\n\n# מדריך מכירה: איזה סוג מערכת מתאים ללקוח\n${playbook}\n\n# קטלוג\n${cats.join("\n\n")}\n\n# מצלמות סולאריות 4G וחבילות שירות\n${solar}`;
}

export const STORE_KNOWLEDGE = buildKnowledge();
export const productBySlug = (slug: string) => storeProducts.find((p) => p.slug === slug);
