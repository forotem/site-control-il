// זחילה על כל האתר המקומי: סטטוסים, קישורים פנימיים שבורים, תמונות חסרות, SEO בסיסי
const BASE = process.argv[2] || "http://localhost:3005";
const out = { pages: {}, brokenLinks: [], brokenImages: [], seo: [], externals: {} };
const queue = [];
const seen = new Set();
const ok = (u) => { const p = u.replace(BASE, ""); return p; };

async function getText(url) {
  const r = await fetch(url, { redirect: "manual", headers: { "user-agent": "audit-bot" } });
  const status = r.status;
  const loc = r.headers.get("location");
  const ct = r.headers.get("content-type") || "";
  const text = ct.includes("text/html") || ct.includes("xml") ? await r.text() : "";
  return { status, loc, ct, text };
}

// seed: sitemap
const sm = await getText(`${BASE}/sitemap.xml`);
const smUrls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, ""));
for (const p of ["/", "/store", "/store/finder", "/about", "/contact", "/blog", "/packages", "/pricing", "/locations", ...smUrls]) if (!seen.has(p)) { seen.add(p); queue.push(p); }
out.sitemapCount = smUrls.length;

const imgChecked = new Map();
async function checkImg(src) {
  if (imgChecked.has(src)) return imgChecked.get(src);
  let status = 0;
  try { const r = await fetch(src.startsWith("http") ? src : BASE + src, { method: "GET", headers: { "user-agent": "audit-bot" } }); status = r.status; } catch { status = -1; }
  imgChecked.set(src, status);
  return status;
}

let n = 0;
while (queue.length && n < 400) {
  const path = queue.shift(); n++;
  let res;
  try { res = await getText(BASE + path); } catch (e) { out.pages[path] = { status: -1, err: String(e) }; continue; }
  const page = { status: res.status };
  if (res.loc) page.redirect = res.loc;
  out.pages[path] = page;
  if (res.status !== 200 || !res.text) continue;
  const h = res.text;
  const title = (h.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1] || "";
  const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  const canonical = (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
  const robots = (h.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || "";
  const h1s = (h.match(/<h1[\s>]/g) || []).length;
  const ogTitle = /property="og:title"/.test(h);
  const ld = (h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || []);
  let ldBad = 0; for (const s of ld) { try { JSON.parse(s.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "")); } catch { ldBad++; } }
  Object.assign(page, { title, titleLen: title.length, descLen: desc.length, canonical, robots, h1s, ogTitle, ld: ld.length, ldBad });
  if (!title) out.seo.push([path, "no title"]);
  if (title.length > 70) out.seo.push([path, `title ${title.length} chars`]);
  if (!desc) out.seo.push([path, "no description"]);
  else if (desc.length > 165 || desc.length < 60) out.seo.push([path, `description ${desc.length} chars`]);
  if (!canonical) out.seo.push([path, "no canonical"]);
  else if (!canonical.endsWith(path) && !(path === "/" && /site-control-il\.com\/?$/.test(canonical))) out.seo.push([path, `canonical mismatch: ${canonical}`]);
  if (h1s !== 1) out.seo.push([path, `h1 count ${h1s}`]);
  if (/noindex/.test(robots)) out.seo.push([path, `noindex`]);
  if (ldBad) out.seo.push([path, `invalid JSON-LD x${ldBad}`]);
  // links
  const links = [...h.matchAll(/href="([^"#?]+)(?:[#?][^"]*)?"/g)].map((m) => m[1]);
  for (const l of links) {
    if (l.startsWith("/") && !l.startsWith("//") && !/\.(png|jpg|jpeg|webp|avif|svg|ico|pdf|xml|txt|css|js)$/i.test(l)) {
      if (!seen.has(l)) { seen.add(l); queue.push(l); }
    } else if (/^https?:\/\//.test(l) && !l.includes("site-control-il.com")) {
      out.externals[l] = (out.externals[l] || 0) + 1;
    }
  }
  const imgs = [...h.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]).filter((s) => !s.startsWith("data:"));
  for (const src of imgs) {
    const st = await checkImg(src.replace(/&amp;/g, "&"));
    if (st !== 200) out.brokenImages.push([path, src, st]);
  }
}
// broken internal links = pages with non-200 that were reached
for (const [p, v] of Object.entries(out.pages)) if (v.status !== 200 && !(v.status >= 300 && v.status < 400)) out.brokenLinks.push([p, v.status]);
const redirects = Object.entries(out.pages).filter(([, v]) => v.redirect).map(([p, v]) => [p, v.status, v.redirect]);
// duplicate titles
const byTitle = {}; for (const [p, v] of Object.entries(out.pages)) if (v.title) (byTitle[v.title] = byTitle[v.title] || []).push(p);
const dupTitles = Object.entries(byTitle).filter(([, ps]) => ps.length > 1);
console.log(JSON.stringify({ crawled: Object.keys(out.pages).length, sitemap: out.sitemapCount, brokenLinks: out.brokenLinks, brokenImages: out.brokenImages.slice(0, 40), brokenImagesCount: out.brokenImages.length, seo: out.seo, redirects, dupTitles, externals: Object.keys(out.externals).length }, null, 1));
import("fs").then((fs) => fs.writeFileSync(new URL("./crawl-result.json", import.meta.url), JSON.stringify(out, null, 1)));
