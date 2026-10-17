// תאריך עדכון אמיתי לכל מוצר ולכל קטגוריה, בשביל lastmod במפת האתר (app/sitemap.ts).
// 17.10.2026 (בדיקת SEO): קודם 156 כתובות קיבלו את אותו תאריך קבוע (27/9) גם כשמוצר השתנה, וגוגל לומד להתעלם משדה כזה.
//
// איך זה עובד: לכל מוצר נשמר hash של הנתונים שלו ב-app/data/catalog-dates.json. כשה-hash משתנה (מחיר, כותרת, מפרט, תמונה),
// התאריך של המוצר מתעדכן להיום (שעון ישראל). הקטגוריה מקבלת את התאריך של המוצר החדש ביותר בה.
//   node automation/catalog-dates.mjs          עדכון (רץ ב-price-monitor.yml וב-catalog-dates.yml אחרי כל שינוי בקטלוג)
//   node automation/catalog-dates.mjs --seed   בנייה ראשונה מ-git blame: התאריך של השורה האחרונה שהשתנתה בבלוק של כל מוצר
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG = join(ROOT, "app/data/store-catalog.ts");
const OUT = join(ROOT, "app/data/catalog-dates.json");
const SEED = process.argv.includes("--seed");

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(new Date());

/** המערך מתוך store-catalog.ts, כמו ב-automation/price-monitor/monitor.mjs (עמיד לפסיקים בסוף, לסוגריים בתוך מחרוזות) */
function loadProducts(src) {
  const m = src.match(/export const storeProducts[^=]*=\s*(\[[\s\S]*?\n\]);/);
  if (!m) throw new Error("storeProducts array not found");
  return (0, eval)(`(${m[1]})`);
}

const src = readFileSync(CATALOG, "utf8");
let products;
try { products = loadProducts(src); } catch (e) {
  // לא חוסמים את price-monitor בגלל lastmod: אזהרה ויציאה תקינה
  console.warn(`catalog-dates: skipped, could not read the catalog (${e.message})`);
  process.exit(0);
}
const hashOf = (p) => createHash("sha1").update(JSON.stringify(p)).digest("hex").slice(0, 12);

/** git blame: לכל מוצר, התאריך של השורה הכי חדשה בבלוק שלו (שורות שלא נשמרו עדיין = היום) */
function blameDates() {
  const out = execFileSync("git", ["blame", "--line-porcelain", "--", "app/data/store-catalog.ts"], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 }).toString("utf8");
  const times = [];
  let cur = null;
  for (const line of out.split("\n")) {
    if (/^[0-9a-f]{40} /.test(line)) cur = { sha: line.slice(0, 40) };
    else if (line.startsWith("author-time ")) cur.t = Number(line.slice(12));
    else if (line.startsWith("\t")) times.push(/^0{40}$/.test(cur.sha) ? Date.now() / 1000 : cur.t);
  }
  const lines = src.split("\n");
  const slugLines = [];
  lines.forEach((l, n) => { const m = l.match(/^\s*"slug": "([^"]+)"/); if (m) slugLines.push([m[1], n]); });
  const dates = {};
  slugLines.forEach(([slug, n], k) => {
    const from = n - 1; // השורה של "{"
    const to = k + 1 < slugLines.length ? slugLines[k + 1][1] - 2 : n + 40;
    let max = 0;
    for (let x = from; x <= to && x < times.length; x++) max = Math.max(max, times[x] || 0);
    dates[slug] = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(new Date(max * 1000));
  });
  return dates;
}

const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { products: {}, categories: {} };
const seeded = SEED ? blameDates() : null;
const next = { note: "נוצר אוטומטית ע\"י automation/catalog-dates.mjs. לא לערוך ידנית.", latest: "", products: {}, categories: {} };
let changed = 0;
for (const p of products) {
  const h = hashOf(p);
  const old = prev.products[p.slug];
  let d;
  if (seeded) d = seeded[p.slug] || today;
  else if (old && old.h === h) d = old.d;
  else { d = today; changed++; }
  next.products[p.slug] = { h, d };
  if (!next.categories[p.category] || next.categories[p.category] < d) next.categories[p.category] = d;
  if (next.latest < d) next.latest = d;
}
const text = `${JSON.stringify(next, null, 1)}\n`;
if (!existsSync(OUT) || readFileSync(OUT, "utf8") !== text) {
  writeFileSync(OUT, text);
  console.log(`catalog-dates: ${products.length} products, ${changed} changed${SEED ? " (seeded from git blame)" : ""}, latest ${next.latest}`);
} else console.log("catalog-dates: no changes");
