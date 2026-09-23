"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productBySlug = exports.STORE_KNOWLEDGE = void 0;
exports.buildKnowledge = buildKnowledge;
// בסיס הידע של עוזר המכירות: טקסט קומפקטי שנבנה פעם אחת מהקטלוג, מהמאפיינים ומהמדריכים.
// נטען רק בצד השרת (API route). אין כאן מידע סודי.
const store_catalog_1 = require("./store-catalog");
const store_attrs_1 = require("./store-attrs");
const store_guides_1 = require("./store-guides");
const packages_1 = require("./packages");
function productLine(p) {
    const a = (0, store_attrs_1.attrsOf)(p);
    const bits = [];
    bits.push(store_attrs_1.kindLabel[a.kind]);
    if ((0, store_attrs_1.isCamera)(a)) {
        if (a.mp)
            bits.push((0, store_attrs_1.mpLabel)(a.mp));
        if (a.night)
            bits.push(store_attrs_1.nightLabel[a.night] + (a.range ? ` עד ${a.range} מ'` : ""));
        if (a.audio && a.audio !== "none")
            bits.push(store_attrs_1.audioLabel[a.audio]);
        if (a.ai && a.ai !== "none")
            bits.push(store_attrs_1.aiLabel[a.ai]);
        if (a.deter)
            bits.push("אור מהבהב וסירנה");
        if (a.varifocal)
            bits.push("עדשה ממונעת");
        if (a.wideSensor)
            bits.push('חיישן 1/1.8"');
        if (a.ik10)
            bits.push("IK10");
        if (a.sd)
            bits.push("כרטיס זיכרון");
        if (a.wifi)
            bits.push("Wi-Fi");
    }
    else if ((0, store_attrs_1.isRecorder)(a)) {
        bits.push(`${a.channels} ערוצים`, a.poePorts ? `${a.poePorts} PoE מובנה` : "בלי PoE (נדרש מתג)", `${a.bays || 1} דיסקים`, `עד ${a.maxMp || 8}MP`);
        if (a.ai === "acusense")
            bits.push("AcuSense");
    }
    else if (a.kind === "kit") {
        bits.push(`${a.cams} מצלמות ${(0, store_attrs_1.mpLabel)(a.mp)}`, `מקליט ${a.channels} ערוצים PoE`, `דיסק ${a.hdd}`);
        if (a.night)
            bits.push(store_attrs_1.nightLabel[a.night]);
    }
    else {
        const wiring = { ip: "IP", "2wire": "2 גידים", "4wire": "4 גידים", hybrid: "2 גידים + Wi-Fi", standalone: "עצמאי", other: "" };
        if (a.wiring && wiring[a.wiring])
            bits.push(wiring[a.wiring]);
        if (a.app)
            bits.push("אפליקציה");
        if (a.auth?.length)
            bits.push("פתיחה: " + a.auth.join("/"));
    }
    const price = p.price ? `${p.price} ₪` : "מחיר לפי פנייה";
    const hl = p.highlights.slice(0, 2).join("; ");
    return `- [${p.slug}] ${p.brand} ${p.model}${p.sku ? ` (מק"ט ${p.sku})` : ""} | ${price} | ${p.title} | ${bits.join(", ")} | מתאים ל: ${(0, store_attrs_1.fitLine)(p)}${p.oldStock ? " | מלאי ישן במבצע חיסול" : ""} | ${hl}`;
}
function buildKnowledge() {
    const cats = store_catalog_1.storeCategories.map((c) => {
        const items = store_catalog_1.storeProducts.filter((p) => p.category === c.id);
        const g = store_guides_1.storeGuides[c.id];
        const guide = g
            ? `איך בוחרים: ${g.lead}\n${g.choose.map((x) => `* ${x.title}: ${x.body}`).join("\n")}\nמונחים: ${g.terms.map((t) => `${t.term} = ${t.explain}`).join(" | ")}`
            : "";
        return `## ${c.name} (${items.length} מוצרים)\n${c.blurb}\n${guide}\nמוצרים:\n${items.map(productLine).join("\n")}`;
    });
    const policies = [
        `אחריות: ${store_catalog_1.WARRANTY_TEXT}.`,
        `אספקה: ${store_catalog_1.deliveryOptions.map((d) => `${d.title} (${d.desc})`).join("; ")}.`,
        "מלאי: המוצרים מגיעים מהמלאי של היבואן בישראל. לפני חיוב מאשרים זמינות ומועד אספקה בווצאפ, כך שאף אחד לא משלם על מוצר שאין במלאי.",
        "מחירים: כוללים מע\"מ, לא כוללים התקנה ולא כוללים דיסק קשיח למקליטים.",
        "הנחת כמות: מ-5 יחידות מאותו מוצר, או הזמנה מעל 5,000 ₪, יש מחיר לקבלנים: אוספים פרטים ומחזירים הצעת מחיר.",
        "התקנה: הצוות של Site-Control מתקין בכל הארץ, לפי הצעת מחיר. אתרי בנייה ושטחים בלי חשמל: מצלמות סולאריות 4G (Reolink GO Plus ו-PTZ Solar) בעמודים /products/go ו-/products/ptz.",
        "תשלום: כרגע ההזמנה נסגרת בווצאפ או בטלפון מול נציג, אחרי אישור זמינות. אין תשלום אונליין באתר בשלב זה.",
        "קישורים: חנות /store, שאלון התאמה /store/finder, דף מוצר /store/<slug>, יצירת קשר /contact, ווצאפ https://wa.me/972502256866.",
    ].join("\n");
    const solar = [
        "מצלמות סולאריות 4G של Reolink לאתרי בנייה, חקלאות, מחסנים מרוחקים ומגרשים בלי חשמל ואינטרנט. אלה מוצרים של Site-Control שאנחנו גם מתקינים ומנהלים (סים, ענן), והם לא חלק מקטלוג החנות למעלה, לכן אין להם slug: כשממליצים עליהם כותבים בטקסט את הקישור לדף.",
        "- Reolink GO Plus 4G (/products/go): מצלמה קבועה סולארית. 4K, ראיית לילה צבעונית, זיהוי AI לאנשים ורכבים, סוללה 9000mAh עם פאנל סולארי, חיבור 4G LTE עם סים, IP66, microSD עד 256GB + גיבוי ענן בזמן אמת (גם אם המצלמה נגנבת ההקלטות בענן). מחיר מצלמה בודדת כ-2,999 ₪ (בחבילת 'קנה והתקן' 3,750 ₪ כולל כרטיס 64GB והדרכה). מתאימה לנקודה אחת: כניסה לאתר, מכולה, ציוד, שער.",
        "- Reolink PTZ Solar 4G (/products/ptz): מצלמה מסתובבת 360° עם זום אופטי 8x, מעקב אוטומטי אחרי תנועה, 4K, ראיית לילה צבעונית, 4G, פאנל סולארי וסוללה, IP66, microSD + ענן. מחיר מצלמה בודדת כ-3,999 ₪. מתאימה לשטח גדול: סריקה של כל האתר במצלמה אחת, חניונים, משקים.",
        "חבילות (/packages, פירוט והשוואה גם ב-/pricing):",
        ...packages_1.packages.map((k) => `- ${k.title}: ${k.price}${k.monthly && k.monthly !== "ללא" ? ` + ${k.monthly}` : ""}. כולל: ${k.bullets.join(", ")}.`),
        "הסבר: 'קנה והתקן' = הלקוח מתקין לבד, סים וענן באחריותו. 'ראש שקט' = אנחנו מתקינים ומנהלים סים, ענן וניטור סוללה, בתשלום חודשי. 'אתר בבנייה' = 4 מצלמות PTZ עם ניהול מלא. ביטוח אופציונלי. הקמה בדרך כלל תוך ימים ספורים, אין חוזה ארוך.",
        "דפים נוספים: /use-cases/construction (אתרי בנייה), /use-cases/agriculture (חקלאות), /use-cases/remote (אתרים מבודדים), /cloud-backup, /weatherproof, /video-quality, /locations (לפי אזור בארץ).",
        "טיימלאפס וסרטוני התקדמות בנייה אינם שירות של האתר הזה: מפנים לאתר האחות https://timelapseit.co.il.",
    ].join("\n");
    return `# מדיניות ושירות\n${policies}\n\n# קטלוג\n${cats.join("\n\n")}\n\n# מצלמות סולאריות 4G וחבילות שירות\n${solar}`;
}
exports.STORE_KNOWLEDGE = buildKnowledge();
const productBySlug = (slug) => store_catalog_1.storeProducts.find((p) => p.slug === slug);
exports.productBySlug = productBySlug;
