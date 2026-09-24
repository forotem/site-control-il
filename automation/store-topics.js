/**
 * Store SEO for the Blog Bot
 * ---------------------------
 * הרחבה של blog-bot.js לקידום החנות (/store): נושאים, מוצרים רלוונטיים
 * מהקטלוג האמיתי (app/data/store-catalog.ts) ופרומפט ייעודי.
 *
 * איך זה משתלב: blog-bot.js קורא ל-pickStoreTopic() כשהפוקוס הוא 'store'
 * (ברירת מחדל: חנות, וביום חמישי הראשון בחודש = סולארי 4G; אפשר לכפות עם
 * BLOG_FOCUS=store|solar), ואז ל-buildStorePrompt() במקום הפרומפט הרגיל.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(PROJECT_ROOT, 'app', 'data', 'store-catalog.ts');

// ---------- קטלוג ----------

let _catalog = null;
function loadCatalog() {
  if (_catalog) return _catalog;
  try {
    const src = fs.readFileSync(CATALOG_PATH, 'utf-8');
    const m = src.match(/export const storeProducts: StoreProduct\[\] = (\[[\s\S]*?\n\]);/);
    // הקובץ נוצר עם JSON.stringify, לכן המערך הוא JSON תקין
    _catalog = m ? JSON.parse(m[1]) : [];
  } catch (err) {
    console.warn('⚠️ לא הצלחתי לקרוא את קטלוג החנות:', err.message);
    _catalog = [];
  }
  return _catalog;
}

// ---------- נושאים ----------
// כל נושא: שאילתה בעברית, slug באנגלית (בלי שנה, היא מתווספת), קטגוריות
// רלוונטיות מהקטלוג, ודגמים לאזכור מפורש (אופציונלי).
const STORE_TOPICS = [
  { query: 'איך לבחור מצלמת אבטחה לבית פרטי: מדריך קנייה', slug: 'how-to-choose-home-security-camera', cats: ['ip', 'kits'] },
  { query: 'ColorVu מול אינפרא אדום: איזו ראיית לילה מתאימה לכם', slug: 'colorvu-vs-infrared-night-vision', cats: ['ip'], models: ['DS-2CD2T47G2H-LI', 'DS-2CD2043G2-IU', 'DS-2CD1043G2-LIU'] },
  { query: 'NVR מול DVR: איזה מקליט מצלמות לקנות', slug: 'nvr-vs-dvr-which-recorder', cats: ['recorders'] },
  { query: 'כמה מצלמות אבטחה צריך לבית פרטי ואיפה לשים אותן', slug: 'how-many-security-cameras-home-placement', cats: ['ip', 'kits'] },
  { query: 'ערכת מצלמות Reolink 4K: סקירה והשוואה בין הערכות', slug: 'reolink-4k-camera-kit-review-comparison', cats: ['kits'] },
  { query: 'AcuSense של Hikvision: איך נפטרים מהתראות שווא', slug: 'hikvision-acusense-false-alarms', cats: ['ip', 'recorders'], models: ['DS-2CD2043G2-IU', 'DS-2CD2143G2-IU', 'DS-7616NXI-K2(D)'] },
  { query: 'אינטרקום לבניין משותף: 2 גידים או IP', slug: 'building-intercom-2-wire-vs-ip', cats: ['intercom'], models: ['VisionNet 2TL-821 / T5 560892', 'DS-KV8413-WME1(C)'] },
  { query: 'אינטרקום וידאו לבית פרטי עם פתיחת שער מהנייד', slug: 'villa-video-intercom-open-gate-from-phone', cats: ['intercom'], models: ['DS-KIS607-S', 'VisionNet DH Hybrid KIT 560171'] },
  { query: 'מסוף זיהוי פנים לעסק: כניסת עובדים ונוכחות', slug: 'face-recognition-terminal-business-attendance', cats: ['intercom'], models: ['DS-K1T344EBFWX-E1', 'DS-K1T671M'] },
  { query: 'שדרוג מערכת מצלמות אנלוגית ישנה בלי להחליף כבלים', slug: 'upgrade-old-analog-cctv-same-cables', cats: ['analog', 'recorders'] },
  { query: 'Hikvision מול Uniview: מה ההבדל ומה עדיף לבית ולעסק', slug: 'hikvision-vs-uniview-comparison', cats: ['ip', 'recorders'] },
  { query: 'מצלמת אבטחה Wi-Fi בלי מקליט: מתי זה מספיק', slug: 'wifi-security-camera-without-recorder', cats: ['wifi'] },
  { query: 'מה זה PoE ולמה כל מצלמת IP צריכה אותו', slug: 'what-is-poe-ip-cameras', cats: ['ip', 'recorders'] },
  { query: 'מצלמה עם סירנה ואור מהבהב: הרתעה במקום תיעוד', slug: 'security-camera-strobe-siren-deterrence', cats: ['ip'], models: ['DS-2CD2387G2H-LISU/SL', 'DS-2CD2047G2H-LIU/SL'] },
  { query: 'מצלמת LPR לזיהוי לוחיות רישוי לחניון ולשער', slug: 'lpr-license-plate-camera-parking-gate', cats: ['ip'], models: ['iDS-2CD7A46G2/P-IZHSY'] },
  { query: 'מצלמת עין דג 180 מעלות לחנות ולמשרד', slug: 'fisheye-180-camera-store-office', cats: ['ip'], models: ['DS-2CD2955G0-ISU', 'DS-2CC52H1T-FITS'] },
  { query: 'איזה דיסק קשיח צריך למקליט מצלמות וכמה זמן הקלטה', slug: 'surveillance-hard-drive-recording-time', cats: ['recorders'] },
  { query: 'מצלמת אבטחה 4K או 4MP: מתי שווה לשלם יותר', slug: '4k-vs-4mp-security-camera', cats: ['ip'] },
  { query: 'צינור, טורט או כיפה: איזה גוף מצלמה לאיזה מקום', slug: 'bullet-turret-dome-camera-types', cats: ['ip'] },
  { query: 'מצלמות אבטחה לחנות: קופה, מחסן וכניסה', slug: 'security-cameras-for-retail-store', cats: ['ip', 'recorders'] },
  { query: 'מצלמות אבטחה לבניין משותף וועד בית: מה מותר ומה כדאי', slug: 'security-cameras-apartment-building-committee', cats: ['ip', 'recorders', 'intercom'] },
  { query: 'קודן לשער חשמלי: איך בוחרים ומה צריך להתקנה', slug: 'gate-keypad-access-control-guide', cats: ['intercom'], models: ['VisionNet K (K-Line) 560820'] },
  { query: 'מצלמה עם עדשה ממונעת (וריפוקל): למה זה שווה בשער ובחניון', slug: 'motorized-varifocal-camera-gate-parking', cats: ['ip'], models: ['DS-2CD1643G2-LIZU', 'DS-2CD1743G2-LIZU'] },
  { query: 'מצלמות Tenda: סקירת CP3 Pro, CT3, CH9 ו-CH10', slug: 'tenda-cameras-review-cp3-ct3-ch9-ch10', cats: ['wifi'] },
  { query: 'כמה עולה מערכת מצלמות לבית ב-2026: פירוט אמיתי', slug: 'home-cctv-system-cost-breakdown', cats: ['ip', 'kits', 'recorders'] },
  { query: 'מצלמת אבטחה עם מיקרופון ורמקול: מה זה נותן בפועל', slug: 'two-way-audio-security-camera', cats: ['ip', 'wifi'] },
  { query: 'ONVIF: איך לחבר מצלמה של יצרן אחד למקליט של אחר', slug: 'onvif-mixing-camera-brands-recorder', cats: ['ip', 'recorders'] },
  { query: 'Turbo HD 3K ColorVu: צבע בלילה על כבל קואקס', slug: 'turbo-hd-3k-colorvu-coax', cats: ['analog'] },
  { query: 'מצלמות אבטחה למחסן ולמפעל קטן: 16 ערוצים ומעלה', slug: 'security-cameras-warehouse-small-factory', cats: ['ip', 'recorders'] },
  { query: 'אינטרקום 2 גידים: איך מחליפים מסך ישן בלי חשמלאי', slug: 'replace-2-wire-intercom-monitor', cats: ['intercom'], models: ['VisionNet 2TL-17 560580', 'VisionNet DH Wi-Fi monitor 560975'] },
];

const STORE_KEYWORDS = ['אינטרקום', 'קודן', 'מקליט', 'nvr', 'dvr', 'colorvu', 'acusense', 'hikvision', 'uniview', 'unv', 'tenda', 'ערכת מצלמות', 'מצלמות לבית', 'מצלמת אבטחה לבית', 'זיהוי פנים', 'בקרת כניסה', 'poe', 'קואקס', 'אנלוגי', 'wifi', 'wi-fi', 'לחנות', 'לבניין', 'ועד בית', 'לוחיות'];

function isStoreQuery(query) {
  const q = String(query || '').toLowerCase();
  return STORE_KEYWORDS.some((k) => q.includes(k));
}

/** בוחר נושא חנות שעדיין אין עליו פוסט. isDuplicateSlug מגיע מ-blog-bot כדי לא לשכפל לוגיקה. */
function pickStoreTopic(existingSlugs, isDuplicateSlug, gscQueries = []) {
  const year = new Date().getFullYear();
  // 1) שאילתות אמיתיות מ-GSC שנוגעות לחנות ועדיין לא מכוסות
  const fromGsc = gscQueries
    .filter((q) => isStoreQuery(q.query) && q.impressions >= 3)
    .sort((a, b) => b.impressions - a.impressions);
  for (const q of fromGsc) {
    const t = STORE_TOPICS.find((s) => s.query.includes(q.query) || q.query.includes(s.query.split(':')[0]));
    if (t) {
      const slug = `${t.slug}-${year}`;
      if (!isDuplicateSlug(slug, existingSlugs)) return { ...t, slug, impressions: q.impressions, clicks: q.clicks, position: q.position, score: 0, focus: 'store' };
    }
  }
  // 2) רשימת הנושאים לפי הסדר
  for (const t of STORE_TOPICS) {
    const slug = `${t.slug}-${year}`;
    if (!isDuplicateSlug(slug, existingSlugs)) return { ...t, slug, impressions: 0, clicks: 0, position: 0, score: 0, focus: 'store' };
  }
  return null;
}

// ---------- מוצרים רלוונטיים לנושא ----------

const CAT_NAMES = { ip: 'מצלמות IP', kits: 'ערכות מוכנות', recorders: 'מקליטים', intercom: 'אינטרקום ובקרת כניסה', wifi: 'מצלמות Wi-Fi', analog: 'מצלמות אנלוגיות' };

function relevantProducts(topic, max = 8) {
  const all = loadCatalog();
  const picked = [];
  const seen = new Set();
  const add = (p) => { if (p && !seen.has(p.slug)) { seen.add(p.slug); picked.push(p); } };
  // דגמים שצוינו במפורש
  for (const m of topic.models || []) add(all.find((p) => p.model === m));
  // מכל קטגוריה רלוונטית: הזול, האמצעי והיקר (עם מחיר)
  for (const cat of topic.cats || []) {
    const inCat = all.filter((p) => p.category === cat && p.price).sort((a, b) => a.price - b.price);
    if (!inCat.length) continue;
    add(inCat[0]);
    add(inCat[Math.floor(inCat.length / 2)]);
    add(inCat[Math.floor(inCat.length * 0.8)]); // דגם משודרג, לא היקר ביותר (מצלמת LPR לא שייכת למדריך לבית)
  }
  return picked.slice(0, max);
}

function productLine(p) {
  const price = p.price ? `${p.price.toLocaleString('he-IL')} ₪` : 'מחיר לפי פנייה';
  const hl = (p.highlights || []).slice(0, 2).join('; ');
  return `- <a href="/store/${p.slug}">${p.brand} ${p.model}</a> (${CAT_NAMES[p.category] || p.categoryName}, ${price}): ${p.title}. ${hl}`;
}

// ---------- פרומפט ----------

function buildStorePrompt(topic) {
  const products = relevantProducts(topic);
  const productBlock = products.length
    ? products.map(productLine).join('\n')
    : '- (הקטלוג לא נטען, קשר רק ל-/store)';

  return `אתה כותב תוכן SEO מומחה בישראל בתחום מצלמות אבטחה, אינטרקום ובקרת כניסה, ועובד בחברת Site-Control.
Site-Control היא חברת התקנות שמפעילה גם חנות אונליין (/store) עם ציוד מהמלאי של היבואן בישראל: מצלמות IP של Hikvision ו-Uniview, ערכות Reolink מוכנות, מקליטים NVR/DVR, אינטרקום VisionNet ו-Hikvision, מסופי זיהוי פנים, קודנים, ומצלמות Wi-Fi של Tenda. אחריות שנה על הכל, בדיקת זמינות בווצאפ לפני חיוב, משלוח או איסוף עצמי או התקנה על ידי הצוות. בנוסף לחברה יש מצלמות סולאריות 4G לאתרי בנייה, אבל הפוסט הזה עוסק בציוד הקווי לבתים, עסקים ובניינים.

כתוב פוסט בלוג מקצועי ומקיף בעברית על הנושא: "${topic.query}"

## קהל היעד (כתוב עבורם):
- בעלי בתים פרטיים ודירות שמתלבטים מה לקנות
- בעלי עסקים קטנים: חנויות, משרדים, מחסנים
- ועדי בתים ומנהלי בניינים
- אנשים עם מערכת ישנה ששוקלים שדרוג

## דרישות תוכן:
- 2000-2600 מילים. שפה פשוטה של מתקין שמסביר ללקוח, לא של קטלוג. משפטים קצרים.
- פתח עם ההתלבטות האמיתית של הקורא (למשל "כל המצלמות נראות אותו דבר") ותן לו כלל אצבע כבר בפסקה השנייה.
- הסבר מונחים במילים של בן אדם: ColorVu = צבע בלילה באור לבן, אינפרא = שחור-לבן בלילה, היברידי = אינפרא בשגרה ואור לבן כשיש תנועה, AcuSense = התראה רק על אדם או רכב, PoE = חשמל ותקשורת בכבל רשת אחד, 2 גידים = על הכבל הישן של האינטרקום.
- כלול טבלת השוואה אחת לפחות עם המוצרים האמיתיים מהרשימה למטה (דגם, מחיר, מה מיוחד בו, למי מתאים). השתמש רק במחירים שברשימה. אל תמציא מחירים או דגמים.
- כלול 3 תרחישים ישראליים קונקרטיים (בית פרטי במושב, דירה בבניין ישן, חנות בקניון שכונתי) והמלצה ברורה לכל אחד.
- כלול סעיף "טעויות נפוצות" עם 4-5 טעויות שאנשים עושים בקנייה.
- כלול סעיף FAQ עם 5 שאלות שאנשים באמת שואלים בגוגל על הנושא.
- שלב את מילת המפתח "${topic.query}" בצורה טבעית בכותרת, בפסקה הראשונה ובאחד ה-h2.
- סיים עם CTA: שאלון ההתאמה הקצר בחנות (/store/finder) או שאלה בווצאפ. בלי "ייעוץ חינם" גנרי.

## מוצרים אמיתיים מהחנות (קשר אליהם בתוך הטקסט, 4-8 קישורים, עם anchor שהוא שם הדגם):
${productBlock}

## קישורים פנימיים נוספים (כלול 2-3 מהם):
- <a href="/store">החנות של Site-Control</a>
- <a href="/store/finder">שאלון: איזו מערכת מתאימה לי</a>
- <a href="/contact">התקנה על ידי הצוות שלנו</a>
${(topic.cats || []).map((c) => `- <a href="/store#${c}">${CAT_NAMES[c] || c} בחנות</a>`).join('\n')}

## מבנה HTML נדרש:
- אסור לכלול תג <h1>. התוכן מתחיל ישירות מ-<h2> אחרי תוכן העניינים.
- תוכן עניינים עם anchor links, h2 לסעיפים, h3 לתתי-סעיפים.
- טבלה עם <table>, רשימות <ul>, הדגשות <strong>. קישורים עם href יחסי כמו בדוגמאות.

מבנה הפלט - החזר JSON בדיוק בפורמט הזה:
{
  "title": "כותרת עם מילת המפתח, עד 65 תווים",
  "metaDescription": "תיאור meta עד 155 תווים עם מילת המפתח, פונה לקורא",
  "category": "מדריכי קנייה",
  "content": "תוכן המאמר המלא ב-HTML",
  "faqItems": [{"question": "שאלה", "answer": "תשובה"}],
  "keywords": ["עד 8 מילות מפתח ספציפיות"]
}

חשוב: החזר רק JSON תקין, בלי markdown code blocks, בלי טקסט נוסף.`;
}

function storeImageScene(topic) {
  const q = topic.query.toLowerCase();
  if (/אינטרקום|קודן|שער/.test(q)) return 'a modern Israeli villa entrance gate with a sleek video intercom door station and keypad, warm evening light';
  if (/זיהוי פנים|נוכחות|עובדים/.test(q)) return 'an office entrance with a wall-mounted face recognition access terminal, employee walking in';
  if (/חנות|קופה/.test(q)) return 'a small neighborhood shop interior with a discreet dome security camera on the ceiling';
  if (/בניין|ועד/.test(q)) return 'an apartment building lobby and entrance with security cameras and an intercom panel';
  if (/מקליט|nvr|dvr|דיסק/.test(q)) return 'a tidy network recorder on a shelf with a monitor showing a 4-camera grid, home office setting';
  if (/wi-?fi|tenda/.test(q)) return 'a compact white Wi-Fi security camera on a house wall next to a garden, daylight';
  if (/אנלוגי|קואקס|turbo/.test(q)) return 'an installer replacing an old CCTV camera with a new one on a house wall, coax cable visible';
  return 'a private house exterior at dusk with a wired turret security camera under the roofline, warm porch light';
}

module.exports = { STORE_TOPICS, pickStoreTopic, isStoreQuery, buildStorePrompt, storeImageScene, relevantProducts, loadCatalog };
