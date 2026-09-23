// עקביות נתונים: קטלוג מול טיוטה, תמונות, מאפיינים, שאלון (כל הצירופים), ידע של טל
const fs = require("fs");
const path = require("path");
const W = require("path").resolve(__dirname, "..", "..") + "/";
const S = path.dirname(__filename);
const issues = [];

// transpile the TS modules once with tsc -> CJS in S/tsout
const { execSync } = require("child_process");
execSync(`npx tsc app/store/finder-logic.ts app/data/store-knowledge.ts --outDir "${S}/tsout" --module commonjs --target es2020 --esModuleInterop --skipLibCheck --moduleResolution node --jsx react`, { cwd: W, stdio: "pipe" });
const { storeProducts, storeCategories } = require(S + "/tsout/data/store-catalog.js");
const { storeAttrs, attrsOf, fitLine } = require(S + "/tsout/data/store-attrs.js");
const { recommend, totalOf, questions } = require(S + "/tsout/store/finder-logic.js");
const { STORE_KNOWLEDGE } = require(S + "/tsout/data/store-knowledge.js");
const { storeGuides } = require(S + "/tsout/data/store-guides.js");

// 1) catalog vs draft
const draft = JSON.parse(fs.readFileSync(W + "docs/telran-supplier-2026-09/catalog_draft_2026-09-23.json", "utf8"));
const draftRows = Array.isArray(draft) ? draft : draft.rows || draft.items || Object.values(draft);
const byModel = new Map(draftRows.map((r) => [r.model, r]));
for (const p of storeProducts) {
  const d = byModel.get(p.model);
  if (!d) { issues.push(["catalog", p.slug, "no draft row for model"]); continue; }
  if ((d.recommended_price_ils || null) !== p.price) issues.push(["price", p.slug, `store ${p.price} vs draft ${d.recommended_price_ils}`]);
  if (!p.image || !fs.existsSync(W + "public" + p.image)) issues.push(["image", p.slug, "missing file " + p.image]);
  if (!storeAttrs[p.slug]) issues.push(["attrs", p.slug, "no attrs"]);
  if (!fitLine(p)) issues.push(["fit", p.slug, "empty fit line"]);
  if (!storeCategories.find((c) => c.id === p.category)) issues.push(["category", p.slug, p.category]);
  if (p.specs.length < 2) issues.push(["specs", p.slug, `only ${p.specs.length} specs`]);
}
const slugs = new Set(storeProducts.map((p) => p.slug));
if (slugs.size !== storeProducts.length) issues.push(["catalog", "-", "duplicate slugs"]);

// 2) guides reference real slugs
for (const g of Object.values(storeGuides)) for (const c of g.compare) for (const s of c.slugs) if (!slugs.has(s)) issues.push(["guide", g.id, "unknown slug " + s]);

// 3) finder: every combination
let combos = 0, empty = 0, errors = 0, overBudget = 0;
const opts = Object.fromEntries(questions.map((q) => [q.id, q.options.map((o) => o.value)]));
for (const place of opts.place) for (const existing of opts.existing) for (const count of opts.count) for (const priority of opts.priority) for (const budget of opts.budget) {
  combos++;
  try {
    const r = recommend({ place, existing, count, priority, budget });
    if (!r.items.length && !(r.ext && r.ext.length)) { empty++; issues.push(["finder", `${place}/${existing}/${count}/${priority}/${budget}`, "empty recommendation"]); }
    for (const it of r.items) if (!slugs.has(it.product.slug)) issues.push(["finder", "-", "unknown product " + it.product.slug]);
    const t = totalOf(r.items).sum;
    const max = budget === "low" ? 1500 : budget === "mid" ? 3500 : Infinity;
    if (t > max * 2.5 && r.items.length) overBudget++;
  } catch (e) { errors++; issues.push(["finder", `${place}/${existing}/${count}/${priority}/${budget}`, "throws: " + e.message]); }
}

// 4) knowledge: every product and its price appears
for (const p of storeProducts) {
  if (!STORE_KNOWLEDGE.includes(`[${p.slug}]`)) issues.push(["knowledge", p.slug, "missing from knowledge"]);
  if (p.price && !STORE_KNOWLEDGE.includes(`[${p.slug}] ${p.brand} ${p.model}${p.sku ? ` (מק"ט ${p.sku})` : ""} | ${p.price} ₪`)) issues.push(["knowledge", p.slug, "price line mismatch"]);
}

console.log(JSON.stringify({ products: storeProducts.length, draftRows: draftRows.length, finder: { combos, empty, errors, farOverBudget: overBudget }, knowledgeChars: STORE_KNOWLEDGE.length, issues }, null, 1));
