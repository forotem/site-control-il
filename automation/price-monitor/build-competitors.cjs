// בונה את competitors.json: לכל slug בחנות, רשימת דפי מתחרים ישראליים לסריקה + רצפת מחיר.
// מקורות: catalog_draft (market_prices[].url), וקבצי אימות של סוכני המחקר (verify_*.json) אם קיימים.
// הרצה: node automation/price-monitor/build-competitors.cjs [verify1.json verify2.json ...]
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..", "..");
const draftPath = path.join(root, "docs/telran-supplier-2026-09/catalog_draft_2026-09-23.json");
const outPath = path.join(__dirname, "competitors.json");
const IL_HOSTS = /\.co\.il$|\.org\.il$|kav-isr\.com$|\.il$/;
const draft = JSON.parse(fs.readFileSync(draftPath, "utf8"));
const rows = Array.isArray(draft) ? draft : draft.rows;
const catSrc = fs.readFileSync(path.join(root, "app/data/store-catalog.ts"), "utf8");
const catalog = eval(catSrc.match(/export const storeProducts[^=]*=\s*(\[[\s\S]*?\n\]);/)[1]);
const bySlugModel = new Map(catalog.map((p) => [p.model, p.slug]));
const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")) : {};
const out = {};
const norm = (u) => { try { const x = new URL(u); x.hash = ""; return x.toString(); } catch { return null; } };
const host = (u) => { try { return new URL(u).host.replace(/^www\./, ""); } catch { return ""; } };

for (const p of catalog) {
  const row = rows.find((r) => r.model === p.model) || {};
  const isReolink = /reolink/i.test(p.brand);
  const prev = existing[p.slug] || {};
  const entry = { model: p.model, brand: p.brand, policy: isReolink ? "undercut" : "undercut-with-floor", floor: prev.floor ?? (isReolink ? 0 : Math.round((row.estimated_cost_ils || 0) * 1.05)), urls: [] };
  const seen = new Set();
  const add = (u, seller, note) => { const n = norm(u); if (!n || seen.has(n) || !IL_HOSTS.test(host(n))) return; seen.add(n); entry.urls.push({ url: n, seller: seller || host(n), note: note || "" }); };
  for (const u of prev.urls || []) add(u.url, u.seller, u.note);
  for (const m of row.market_prices || []) if (m.url && (!m.currency || m.currency === "ILS")) add(m.url, m.site || m.source || m.seller, m.comparable === false ? "" : (m.note || ""));
  out[p.slug] = entry;
}
// קבצי אימות מהסוכנים
for (const f of process.argv.slice(2)) {
  if (!fs.existsSync(f)) { console.error("missing", f); continue; }
  const arr = JSON.parse(fs.readFileSync(f, "utf8"));
  for (const it of arr) {
    const normModel = String(it.model || "").replace(/\s*\(.*$/, "").trim();
    const tokens = normModel.split(/[\s\/]+/).filter((t) => /\d/.test(t)).sort((a, b) => b.length - a.length);
    let slug = (it.slug && catalog.find((p) => p.slug === it.slug)?.slug)
      || catalog.find((p) => p.model === normModel || p.model.includes(normModel) || normModel.includes(p.model))?.slug;
    if (!slug && tokens.length) { const hits = catalog.filter((p) => p.model.toUpperCase().includes(tokens[0].toUpperCase())); if (hits.length === 1) slug = hits[0].slug; }
    if (!slug) { console.error("no slug for", it.model); continue; }
    const e = out[slug]; const seen = new Set(e.urls.map((u) => u.url));
    for (const l of it.listings || []) { const n = norm(l.url); if (!n || seen.has(n) || !IL_HOSTS.test(host(n))) continue; if (l.bundle_note && /comparable|דומה|related/i.test(l.bundle_note)) continue; seen.add(n); e.urls.push({ url: n, seller: l.seller || host(n), note: l.bundle_note || "" }); }
  }
}
fs.writeFileSync(outPath, JSON.stringify(out, null, 1));
const withUrls = Object.values(out).filter((e) => e.urls.length).length;
console.log(`competitors.json: ${Object.keys(out).length} slugs, ${withUrls} with IL urls, ${Object.values(out).reduce((a, e) => a + e.urls.length, 0)} urls`);
