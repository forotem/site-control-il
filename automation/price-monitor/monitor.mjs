// סורק מחירי מתחרים ישראליים ומשווה למחירי החנות.
// הרצה: node automation/price-monitor/monitor.mjs [--apply] [--only slug1,slug2] [--limit N]
//  --apply : מעדכן מחירים ב-app/data/store-catalog.ts (רק כשיש ראיה חזקה, ראה RULES).
// פלט: automation/price-monitor/reports/latest.json + reports/YYYY-MM-DD.md, והודעת ווצאפ אם GREEN_ID_INSTANCE/GREEN_API_TOKEN קיימים.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const only = (flag("--only") || "").split(",").filter(Boolean);
const limit = Number(flag("--limit")) || Infinity;

// RULES
const UNDERCUT = 0.98;        // יעד: 2% מתחת לזול ביותר, מעוגל ל-9, ולפחות 10 ₪ מתחת
const MAX_AUTO_DROP = 0.25;   // הורדה אוטומטית של עד 25% מהמחיר הנוכחי; מעבר לזה: לבדיקה ידנית
const RAISE_HINT = 0.08;      // אם אנחנו 8%+ מתחת לכולם: רק רמז להעלאה, לא אוטומטי
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

const to9 = (v) => { const x = Math.round(v); const r = x % 10; return r === 9 ? x : (x - r + 9 > x + 5 ? x - r - 1 : x - r + 9); };
const undercut = (low) => { let t = to9(low * UNDERCUT); if (t > low - 10) t = to9(low - 20); return Math.max(t, 9); };
const nis = (n) => n.toLocaleString("he-IL");

const catPath = path.join(root, "app/data/store-catalog.ts");
const catSrc = fs.readFileSync(catPath, "utf8");
const catalog = eval(catSrc.match(/export const storeProducts[^=]*=\s*(\[[\s\S]*?\n\]);/)[1]);
const competitors = JSON.parse(fs.readFileSync(path.join(here, "competitors.json"), "utf8"));

async function fetchHtml(url) {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 25000);
  try {
    const res = await fetch(url, { headers: { "user-agent": UA, "accept-language": "he-IL,he;q=0.9,en;q=0.7", accept: "text/html,*/*" }, redirect: "follow", signal: ctrl.signal });
    const html = await res.text();
    return { status: res.status, html, finalUrl: res.url };
  } catch (e) { return { status: 0, html: "", error: String(e.message || e) }; }
  finally { clearTimeout(t); }
}

// מפתחות זיהוי של הדגם בטקסט (בלי שם המותג): "DS-KIS607-S", "Go PT Ultra", "RLK8-820D4-A"
function modelKeys(p) {
  const brandWords = new Set(String(p.brand).toLowerCase().split(/[\s()]+/));
  return String(p.model).split(/[\/()]+/).map((alt) => alt.split(/\s+/).filter((w) => w && !brandWords.has(w.toLowerCase()) && !/^(hiwatch|unv|uniview)$/i.test(w)).join(" ").trim()).filter((k) => k.length >= 3);
}

// מחלץ מועמדי מחיר: קודם נתונים מובנים (JSON-LD / meta), אחר כך טקסט עם סימן שקל ליד אזכור הדגם
function extractPrices(html, ours, keys) {
  const strong = [], weak = [], anywhere = [];
  const lo = ours * 0.35, hi = ours * 3;
  const inRange = (n) => n >= lo && n <= hi;
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (o) => {
        if (!o || typeof o !== "object") return;
        if (Array.isArray(o)) return o.forEach(walk);
        for (const k of ["price", "lowPrice"]) if (o[k] != null) { const n = Number(String(o[k]).replace(/,/g, "")); if (inRange(n)) strong.push(n); }
        Object.values(o).forEach(walk);
      };
      walk(JSON.parse(m[1].trim()));
    } catch { /* ignore bad json-ld */ }
  }
  const metaRe1 = /<meta[^>]+(?:property|itemprop|name)=["'](?:product:price:amount|og:price:amount|price)["'][^>]+content=["']([^"']+)["']/gi;
  const metaRe2 = /content=["']([^"']+)["'][^>]+(?:property|itemprop)=["'](?:product:price:amount|og:price:amount|price)["']/gi;
  for (const re of [metaRe1, metaRe2]) for (const m of html.matchAll(re)) { const n = Number(m[1].replace(/[^\d.]/g, "")); if (inRange(n)) strong.push(n); }
  let text = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&quot;/gi, '"').replace(/&amp;/gi, "&")
    .replace(/&#8362;|&#x20aa;|&shekel;/gi, "₪")
    .replace(/\s+/g, " ");
  // מסירים מחירים לפני מע"מ, משלוח וסכומים כוללים: הם לא מחיר המוצר
  text = text.replace(/(לפני מע["״]?מ|מחיר משלוח|כולל משלוח|דמי משלוח)\s*:?\s*₪?\s*\d[\d,.]*/g, " ");
  // \u05E1\u05D9\u05DE\u05DF \u05E9\u05E7\u05DC, \u05E9"\u05D7, \u05E9\u05D7, ILS/NIS \u05DC\u05E4\u05E0\u05D9 \u05D0\u05D5 \u05D0\u05D7\u05E8\u05D9 \u05D4\u05DE\u05E1\u05E4\u05E8
  const priceRe = /(?:\u20AA|\u05E9"\u05D7|\u05E9\u05D7|ILS|NIS)\s*(\d[\d,]*(?:\.\d+)?)|(\d[\d,]*(?:\.\d+)?)\s*(?:\u20AA|\u05E9"\u05D7|\u05E9\u05D7|ILS|NIS)/g;
  const lower = text.toLowerCase();
  const hits = [];
  for (const k of keys) { let i = -1; const kk = k.toLowerCase(); while ((i = lower.indexOf(kk, i + 1)) !== -1 && hits.length < 40) hits.push(i); }
  // ציון לכל מחיר: כמה אזכורי דגם קרובים אליו (מחיר ראשי יושב ליד הכותרת, המק"ט והסל; מוצר קשור ליד אזכור אחד לכל היותר)
  const score = new Map();
  for (const m of text.matchAll(priceRe)) {
    const n = Number((m[1] || m[2]).replace(/,/g, "")); if (!inRange(n)) continue;
    const before = text.slice(Math.max(0, m.index - 30), m.index);
    if (/תשלומים|לחודש|החל מ|X\s*\d+/.test(before)) continue; // תשלומים, לא מחיר
    anywhere.push(n);
    let s = 0; for (const h of hits) { const d = Math.abs(h - m.index); if (d <= 400) s += 1 - d / 400; }
    if (s > 0) { weak.push(n); score.set(n, (score.get(n) || 0) + s); }
  }
  return { strong, weak, anywhere, score, modelSeen: hits.length > 0 };
}

function pickPrice(ex) {
  if (ex.strong.length) return { price: Math.min(...ex.strong), method: "structured" };
  if (ex.weak.length) {
    // המחיר עם הציון הגבוה; מחיר מבצע ומחיר מקורי צמודים, לכן בין שני המובילים לוקחים את הנמוך
    const ranked = [...ex.score.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
    const top = ranked[0]; const second = ranked[1];
    const price = second && second[1] >= top[1] * 0.6 && second[0] < top[0] ? second[0] : top[0];
    return { price, method: top[1] >= 1.2 ? "near-model-repeated" : "near-model" };
  }
  if (ex.anywhere.length) return { price: Math.min(...ex.anywhere), method: "text-anywhere" };
  return null;
}

const results = []; let n = 0;
for (const p of catalog) {
  if (only.length && !only.includes(p.slug)) continue;
  const c = competitors[p.slug]; if (!c || !c.urls.length || !p.price) continue;
  if (++n > limit) break;
  const offers = [];
  for (const u of c.urls) {
    const r = await fetchHtml(u.url);
    if (!r.html || r.status >= 400) { offers.push({ ...u, ok: false, status: r.status, error: r.error || "" }); continue; }
    const ex = extractPrices(r.html, p.price, modelKeys(p));
    const picked = pickPrice(ex);
    // senetic מציגים מחירים לפני מע"מ
    if (picked && /senetic\.co\.il/.test(r.finalUrl || u.url)) { picked.price = Math.round(picked.price * 1.18); picked.method += "+vat"; }
    const label = `${u.seller} ${u.note}`;
    // דגם אחר בתיאור המוכר (וריאנט, דור קודם, ערכה) = לא להשוואה ישירה
    const foreignModel = [...label.matchAll(/[A-Z]{2,4}-?\d{2,}[A-Z0-9/()-]*/g)].map((m) => m[0]).some((tok) => !String(p.model).toUpperCase().includes(tok.toUpperCase().replace(/[()]/g, "")));
    const comparable = !foreignModel && !/variant|predecessor|related|kit |bundle|wired only|ללא |בלי |דומה|ערכה|קודם|similar|comparable|-2T|-4T/i.test(label);
    offers.push({ ...u, ok: !!picked, comparable, status: r.status, modelSeen: ex.modelSeen, finalUrl: r.finalUrl, ...(picked || {}) });
  }
  const good = offers.filter((o) => o.ok && o.comparable && o.method !== "text-anywhere" && (o.method === "structured" || o.modelSeen));
  const low = good.length ? Math.min(...good.map((o) => o.price)) : null;
  const lowOffer = good.find((o) => o.price === low);
  let action = "no_data", target = null, reason = "";
  if (low != null) {
    const strongEvidence = good.some((o) => o.method === "structured" || o.method === "near-model-repeated") || good.length >= 2;
    if (p.price >= low - 5) {
      target = Math.max(undercut(low), c.floor || 0);
      if (target >= p.price) { action = "floor_blocks"; reason = `רצפה ${c.floor} לא מאפשרת לרדת מתחת ל-${low}`; }
      else if (!strongEvidence) { action = "review"; reason = "ראיה חלשה (מחיר בודד מטקסט)"; }
      else if (target < p.price * (1 - MAX_AUTO_DROP)) { action = "review"; reason = `ירידה של ${Math.round((1 - target / p.price) * 100)}% דורשת אישור`; }
      else action = APPLY ? "applied" : "lower";
    } else if (p.price < low * (1 - RAISE_HINT)) { action = "room_to_raise"; }
    else action = "ok";
  } else if (offers.some((o) => o.ok && !o.comparable)) { action = "no_comparable"; reason = "נמצאו רק דגמים דומים/ערכות, לא אותו דגם"; } else if (offers.length) action = "fetch_failed";
  results.push({ slug: p.slug, model: p.model, brand: String(p.model).toLowerCase().startsWith(String(p.brand).toLowerCase()) ? "" : p.brand, ours: p.price, low, lowSeller: lowOffer?.seller || null, lowUrl: lowOffer?.url || null, target, action, reason, offers });
  process.stderr.write(`${p.slug}: ours ${p.price} low ${low ?? "-"} -> ${action}${target ? " " + target : ""}\n`);
}

// החלה
let applied = 0;
if (APPLY) {
  let src = catSrc;
  for (const r of results.filter((x) => x.action === "applied")) {
    const re = new RegExp(`("slug": "${r.slug}",[\\s\\S]*?"price": )\\d+`);
    if (re.test(src)) { src = src.replace(re, `$1${r.target}`); applied++; }
  }
  if (applied) {
    fs.writeFileSync(catPath, src);
    // מסנכרנים גם את טיוטת הקטלוג, אחרת data.cjs מדווח על פער בין החנות לטיוטה
    const draftPath = path.join(root, "docs/telran-supplier-2026-09/catalog_draft_2026-09-23.json");
    if (fs.existsSync(draftPath)) {
      const draft = JSON.parse(fs.readFileSync(draftPath, "utf8")); const rows = Array.isArray(draft) ? draft : draft.rows;
      for (const r of results.filter((x) => x.action === "applied")) {
        const row = rows.find((x) => x.model === r.model); if (!row) continue;
        row.recommended_price_ils = r.target; row.market_low_ils = r.low;
        row.pricing_note = `${row.pricing_note ? row.pricing_note + " | " : ""}סורק מתחרים ${day}: הזול ${r.low} (${r.lowSeller}), הוזל ל-${r.target}`;
      }
      fs.writeFileSync(draftPath, JSON.stringify(draft, null, 2));
    }
  }
}

// דוחות
const day = new Date().toISOString().slice(0, 10);
const repDir = path.join(here, "reports"); fs.mkdirSync(repDir, { recursive: true });
fs.writeFileSync(path.join(repDir, "latest.json"), JSON.stringify({ date: day, apply: APPLY, results }, null, 1));
const groups = (a) => results.filter((r) => r.action === a);
const line = (r) => `- ${r.brand} ${r.model}: אצלנו ${nis(r.ours)}${r.target ? ` -> ${nis(r.target)}` : ""} | הזול בשוק ${r.low != null ? nis(r.low) : "?"} (${r.lowSeller || "-"})${r.reason ? ` | ${r.reason}` : ""}`;
const md = [
  `# סריקת מחירי מתחרים ${day}`, "",
  `נסרקו ${results.length} מוצרים, ${results.reduce((a, r) => a + r.offers.length, 0)} דפים. ${APPLY ? `עודכנו אוטומטית: ${applied}.` : ""}`, "",
  `## הוזלו אוטומטית (${groups("applied").length})`, ...groups("applied").map(line), "",
  `## יש להוזיל (${groups("lower").length})`, ...groups("lower").map(line), "",
  `## לבדיקה ידנית (${groups("review").length})`, ...groups("review").map(line), "",
  `## הרצפה חוסמת (${groups("floor_blocks").length})`, ...groups("floor_blocks").map(line), "",
  `## אנחנו הכי זולים, יש מרווח להעלות (${groups("room_to_raise").length})`, ...groups("room_to_raise").map(line), "",
  `## תקין, כבר מתחת לשוק (${groups("ok").length})`, ...groups("ok").map((r) => `- ${r.brand} ${r.model}: ${nis(r.ours)} מול ${nis(r.low)} (${r.lowSeller})`), "",
  `## הסריקה נכשלה (${groups("fetch_failed").length})`, ...groups("fetch_failed").map((r) => `- ${r.brand} ${r.model}: ${r.offers.map((o) => `${o.seller} ${o.status || o.error}`).join("; ")}`), "",
].join("\n");
fs.writeFileSync(path.join(repDir, `${day}.md`), md);
console.log(md);

// ווצאפ
const { GREEN_ID_INSTANCE, GREEN_API_TOKEN, GREEN_API_URL, STORE_ALERT_WHATSAPP } = process.env;
if (GREEN_ID_INSTANCE && GREEN_API_TOKEN) {
  const summary = [
    `סריקת מחירים ${day}`,
    `הוזלו אוטומטית: ${applied}`,
    `לבדיקה: ${groups("review").length + groups("lower").length}`,
    `רצפה חוסמת: ${groups("floor_blocks").length}`,
    `נכשלו: ${groups("fetch_failed").length}`,
    ...groups("applied").slice(0, 10).map((r) => `• ${r.model} ${nis(r.ours)} -> ${nis(r.target)}`),
    ...groups("review").slice(0, 5).map((r) => `? ${r.model}: ${r.reason}`),
    `דוח מלא: github.com/forotem/site-control-il/blob/master/automation/price-monitor/reports/${day}.md`,
  ].join("\n");
  const base = (GREEN_API_URL || "https://api.green-api.com").replace(/\/$/, "");
  await fetch(`${base}/waInstance${GREEN_ID_INSTANCE}/sendMessage/${GREEN_API_TOKEN}`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ chatId: `${STORE_ALERT_WHATSAPP || "972502256866"}@c.us`, message: summary }),
  }).then((r) => console.error("whatsapp", r.status)).catch((e) => console.error("whatsapp failed", e.message));
}
