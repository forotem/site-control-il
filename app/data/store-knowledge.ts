// בסיס הידע של עוזר המכירות: טקסט קומפקטי שנבנה פעם אחת מהקטלוג, מהמאפיינים ומהמדריכים.
// נטען רק בצד השרת (API route). אין כאן מידע סודי.
import { storeProducts, storeCategories, deliveryOptions, WARRANTY_TEXT } from "./store-catalog";
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
  return `- [${p.slug}] ${p.brand} ${p.model}${p.sku ? ` (מק"ט ${p.sku})` : ""} | ${price} | ${p.title} | ${bits.join(", ")} | מתאים ל: ${fitLine(p)}${p.oldStock ? " | מלאי ישן במבצע חיסול" : ""} | ${hl}`;
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
    `אספקה: ${deliveryOptions.map((d) => `${d.title} (${d.desc})`).join("; ")}.`,
    "מלאי: המוצרים מגיעים מהמלאי של היבואן בישראל. לפני חיוב מאשרים זמינות ומועד אספקה בווצאפ, כך שאף אחד לא משלם על מוצר שאין במלאי.",
    "מחירים: כוללים מע\"מ, לא כוללים התקנה ולא כוללים דיסק קשיח למקליטים.",
    "הנחת כמות: מ-5 יחידות מאותו מוצר, או הזמנה מעל 5,000 ₪, יש מחיר לקבלנים: אוספים פרטים ומחזירים הצעת מחיר.",
    "התקנה: הצוות של Site-Control מתקין בכל הארץ, לפי הצעת מחיר. אתרי בנייה ושטחים בלי חשמל: מצלמות סולאריות 4G (Reolink GO Plus ו-PTZ Solar) בעמודים /products/go ו-/products/ptz.",
    "תשלום: כרגע ההזמנה נסגרת בווצאפ או בטלפון מול נציג, אחרי אישור זמינות. אין תשלום אונליין באתר בשלב זה.",
    "קישורים: חנות /store, שאלון התאמה /store/finder, דף מוצר /store/<slug>, יצירת קשר /contact, ווצאפ https://wa.me/972502256866.",
  ].join("\n");
  return `# מדיניות ושירות\n${policies}\n\n# קטלוג\n${cats.join("\n\n")}`;
}

export const STORE_KNOWLEDGE = buildKnowledge();
export const productBySlug = (slug: string) => storeProducts.find((p) => p.slug === slug);
