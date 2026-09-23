// בודק שתמונות המוצרים "מדברות בשפה של האתר": מוצר על רקע לבן, בלי קולאז' שיווקי (תגים אדומים, טקסט, לוגואים).
// מדדים לכל תמונה: אחוז פיקסלים צבעוניים (רוויים), אחוז אדום רווי, יחס גובה/רוחב.
// הרצה: node automation/qa/image-style.cjs  -> מדפיס JSON של החשודות ושומר automation/qa/image-style.json
const fs = require("fs");
const path = require("path");
const sharp = (() => { for (const d of ["../../node_modules/sharp", "../node_modules/sharp"]) { try { return require(path.resolve(__dirname, d)); } catch {} } return require("sharp"); })();
const W = path.resolve(__dirname, "..", "..");
const catSrc = fs.readFileSync(path.join(W, "app/data/store-catalog.ts"), "utf8");
const catalog = eval(catSrc.match(/export const storeProducts[^=]*=\s*(\[[\s\S]*?\n\]);/)[1]);

async function measure(file) {
  const img = sharp(file);
  const meta = await img.metadata();
  const { data, info } = await img.removeAlpha().resize(160, 160, { fit: "inside" }).raw().toBuffer({ resolveWithObject: true });
  let colorful = 0, red = 0, white = 0, n = 0;
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max ? (max - min) / max : 0;
    n++;
    if (max > 240 && sat < 0.06) white++;
    if (sat > 0.45 && max > 90) { colorful++; if (r > 150 && r > g * 1.8 && r > b * 1.8) red++; }
  }
  return { w: meta.width, h: meta.height, ratio: +(meta.height / meta.width).toFixed(2), colorful: +(100 * colorful / n).toFixed(1), red: +(100 * red / n).toFixed(1), white: +(100 * white / n).toFixed(1) };
}

// חריגים מאושרים (נבדקו בעין): מסך המוצר עצמו צבעוני, או רינדור רשמי לגובה שנשאר כי הוא מוכל היטב מאז תיקון ה-CSS
const allowPath = path.join(__dirname, "image-style-allow.json");
const allow = fs.existsSync(allowPath) ? JSON.parse(fs.readFileSync(allowPath, "utf8")) : {};

(async () => {
  const out = [];
  for (const p of catalog) {
    if (!p.image) continue;
    const file = path.join(W, "public", p.image);
    if (!fs.existsSync(file)) { out.push({ slug: p.slug, issue: "missing file" }); continue; }
    const m = await measure(file);
    const issues = [];
    if (m.red >= 2.5) issues.push("red badges/text");
    else if (m.colorful >= 9) issues.push("colorful collage");
    if (m.ratio >= 1.25) issues.push("portrait " + m.ratio);
    if (m.white < 25) issues.push("dark/non-white background");
    if (allow[p.slug]) continue;
    if (issues.length) out.push({ slug: p.slug, image: p.image, brand: p.brand, model: p.model, ...m, issues });
  }
  fs.writeFileSync(path.join(__dirname, "image-style.json"), JSON.stringify(out, null, 1));
  console.log(JSON.stringify({ checked: catalog.filter((p) => p.image).length, flagged: out.length, byIssue: out.reduce((a, x) => { for (const i of x.issues || [x.issue]) a[i.split(" ")[0]] = (a[i.split(" ")[0]] || 0) + 1; return a; }, {}) }, null, 1));
  for (const x of out) console.log(`${x.slug} | ${(x.issues || [x.issue]).join(", ")} | red ${x.red} colorful ${x.colorful} white ${x.white} ${x.w}x${x.h}`);
})();
