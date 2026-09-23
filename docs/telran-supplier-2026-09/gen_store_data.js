// Generates app/data/store-catalog.ts for site-control-il from catalog_draft.json
const fs = require('fs');
const cat = JSON.parse(fs.readFileSync('catalog_draft.json', 'utf8'));
const out = process.argv[2];
const localImgs = fs.existsSync('local_images_map.json') ? JSON.parse(fs.readFileSync('local_images_map.json','utf8')) : {};
const slugify = s => String(s).toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
function group(p) {
  const b = p.brand || '', m = p.model || '';
  if (/VisionNet/.test(b)) return { id: 'intercom', name: 'אינטרקום ובקרת כניסה' };
  if (/Reolink/.test(b)) return { id: 'kits', name: 'ערכות מצלמות מוכנות' };
  if (/tenda/i.test(b)) return { id: 'wifi', name: 'מצלמות Wi-Fi לבית ולעסק' };
  if (/UNV|Uniview/.test(b)) { if (/^NVR|^XVR/.test(m)) return { id: 'recorders', name: 'מקליטים NVR / DVR' }; if (/^UAC/.test(m)) return { id: 'analog', name: 'מצלמות אנלוגיות' }; return { id: 'ip', name: 'מצלמות IP' }; }
  if (/Hikvision/.test(b)) {
    if (/KIS|KV|KH|K1T/.test(m)) return { id: 'intercom', name: 'אינטרקום ובקרת כניסה' };
    if (/^i?DS-7\d/.test(m)) return { id: 'recorders', name: 'מקליטים NVR / DVR' };
    if (/^DS-2C[EC]/.test(m)) return { id: 'analog', name: 'מצלמות אנלוגיות' };
    return { id: 'ip', name: 'מצלמות IP' };
  }
  return { id: 'other', name: 'אחר' };
}
const seen = new Set();
const items = [];
for (const p of cat) {
  let slug = slugify(p.model); if (seen.has(slug)) slug += '-' + (items.length + 1); seen.add(slug);
  const g = group(p);
  const brand = (p.brand || '').replace(/\s*\(.*\)/, '').replace('Hikvision HiWatch', 'HiWatch by Hikvision').replace('VisionNet / Telran', 'VisionNet');
  const sku = p.telran_sku && !/NOT verified/.test(p.telran_sku) ? String(p.telran_sku).split(' (')[0] : null;
  const title = (p.title_he || p.model).replace(/\s*-\s*[A-Za-z0-9\-\/\.\s()]+$/, '').trim();
  items.push({
    slug, brand, model: p.model, sku, title: title || p.model, category: g.id, categoryName: g.name,
    price: p.recommended_price_ils || null,
    specs: (p.specs || []).slice(0, 6),
    image: localImgs[slug] || null, datasheet: p.datasheet_url || null,
    highlights: (p.specs || []).slice(0, 3),
    oldStock: /DS-2CC52H1T|DS-2CD2347G1-L|DS-2CE10KF0T-FS/.test(p.model),
  });
}
const cats = [
  { id: 'ip', name: 'מצלמות IP', blurb: 'מצלמות רשת PoE של Hikvision ו-UNV, מ-4MP ועד 8MP, עם ראיית לילה צבעונית וזיהוי אדם/רכב.' },
  { id: 'kits', name: 'ערכות מצלמות מוכנות', blurb: 'ערכות Reolink עם מקליט, 4 עד 8 מצלמות, כבלים ודיסק. מחברים ועובד.' },
  { id: 'recorders', name: 'מקליטים NVR / DVR', blurb: 'מקליטי רשת ומקליטים היברידיים, 4 עד 32 ערוצים. נמכרים ללא דיסק, מתאימים לכל דיסק סטנדרטי.' },
  { id: 'intercom', name: 'אינטרקום ובקרת כניסה', blurb: 'אינטרקום וידאו לוילה ולבניין, קודנים, מסופי זיהוי פנים וטביעת אצבע.' },
  { id: 'wifi', name: 'מצלמות Wi-Fi לבית ולעסק', blurb: 'מצלמות Tenda עצמאיות, חיבור חשמל בלבד, מעקב אוטומטי וראיית לילה צבעונית.' },
  { id: 'analog', name: 'מצלמות אנלוגיות', blurb: 'מצלמות Turbo HD ו-TVI לשדרוג מערכות קיימות על כבל קואקס, כולל ColorVu 3K ו-4K.' },
];
const ts = `// נוצר אוטומטית מ-docs/telran-supplier-2026-09/catalog_draft_2026-09-23.json (23/09/2026)
// מחירים = מחיר מכירה מתוכנן (מחיר השוק בישראל פחות כ-3%), עד לאישור עלות מהספק. null = לפי פנייה.
export type StoreProduct = {
  slug: string; brand: string; model: string; sku: string | null; title: string;
  category: string; categoryName: string; price: number | null;
  specs: string[]; highlights: string[]; image: string | null; datasheet: string | null; oldStock: boolean;
};
export type StoreCategory = { id: string; name: string; blurb: string };
export const WHATSAPP_NUMBER = "972502256866";
export const WARRANTY_TEXT = "אחריות שנה על כל המוצרים";
export const deliveryOptions = [
  { id: "courier", title: "משלוח עד הבית", desc: "שליח עד 3-5 ימי עסקים, בתוספת דמי משלוח" },
  { id: "pickup", title: "איסוף עצמי", desc: "ללא עלות, בתיאום מראש" },
  { id: "install", title: "התקנה על ידי הצוות שלנו", desc: "מתקין מוסמך מגיע אליך, לפי הצעת מחיר" },
];
export const storeCategories: StoreCategory[] = ${JSON.stringify(cats, null, 2)};
export const storeProducts: StoreProduct[] = ${JSON.stringify(items, null, 2)};
`;
fs.writeFileSync(out, ts, 'utf8');
console.log('products', items.length, 'with image', items.filter(i => i.image).length, 'with price', items.filter(i => i.price).length);
