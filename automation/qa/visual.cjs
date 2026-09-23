// בדיקה חזותית עם דפדפן אמיתי: גלישה אופקית, אלמנטים קבועים שמכסים אחד את השני, שגיאות קונסול, בקשות שנכשלו
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const BASE = process.argv[2] || "http://localhost:3005";
const OUT = path.join(__dirname, "shots");
fs.mkdirSync(OUT, { recursive: true });

const pages = ["/", "/store", "/store/finder", "/store/ds-2cd1043g2-liu-2-8mm", "/store/reolink-rlk8-410b4-5mp", "/store/ds-kis607-s", "/about", "/contact", "/packages", "/pricing", "/blog", "/products/go", "/locations", "/use-cases/agriculture", "/blog/reolink-go-plus"];
const widths = [375, 768, 1280];
const findings = [];

function rectsOverlap(a, b) { return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top); }

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--lang=he-IL"] });
  for (const w of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: w < 500 ? 812 : 900, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
    const consoleErrors = [];
    const failed = [];
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200)); });
    page.on("requestfailed", (r) => failed.push(r.url().slice(0, 160)));
    page.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url().slice(0, 140)}`); });
    for (const p of pages) {
      consoleErrors.length = 0; failed.length = 0;
      try {
        await page.goto(BASE + p, { waitUntil: "networkidle0", timeout: 45000 });
      } catch (e) { findings.push({ w, p, issue: "load failed: " + e.message.slice(0, 100) }); continue; }
      await new Promise((r) => setTimeout(r, 400));
      const m = await page.evaluate(() => {
        const doc = document.documentElement;
        const overflowX = doc.scrollWidth - doc.clientWidth;
        // elements that stick out to the right/left of the viewport
        const wide = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && (r.right > doc.clientWidth + 2 || r.left < -2) && getComputedStyle(el).position !== "fixed" && r.width < doc.clientWidth * 3) {
            const ov = getComputedStyle(el.parentElement || el).overflowX;
            if (ov !== "auto" && ov !== "scroll" && ov !== "hidden") wide.push((el.tagName + "." + (el.className && el.className.baseVal === undefined ? String(el.className).split(" ")[0] : "")).slice(0, 60));
          }
          if (wide.length > 5) break;
        }
        // fixed elements overlapping
        const fixed = [...document.querySelectorAll("body *")].filter((el) => { const cs = getComputedStyle(el); return (cs.position === "fixed" || cs.position === "sticky") && cs.display !== "none" && el.getBoundingClientRect().width > 0; });
        const rects = fixed.map((el) => ({ el: (el.tagName + "." + String(el.className || "").split(" ")[0]).slice(0, 50), r: el.getBoundingClientRect() }));
        const overlaps = [];
        for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i], b = rects[j];
          if (a.r.width * a.r.height > 300000 || b.r.width * b.r.height > 300000) continue; // full-screen overlays
          if (rects[i].el.startsWith("NAV") || rects[j].el.startsWith("NAV")) continue;
          if (/^(TH|TD)\./.test(rects[i].el) || /^(TH|TD)\./.test(rects[j].el)) continue; // כותרות טבלה דביקות, לא באג
          if (fixed[i].contains(fixed[j]) || fixed[j].contains(fixed[i])) continue;
          const A = a.r, B = b.r;
          if (!(A.right <= B.left || B.right <= A.left || A.bottom <= B.top || B.bottom <= A.top)) overlaps.push(a.el + " x " + b.el);
        }
        const h1 = document.querySelectorAll("h1").length;
        const tinyTap = [...document.querySelectorAll("a,button")].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 28 || r.width < 28) && el.offsetParent !== null; }).length;
        const imgsNoAlt = [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length;
        const brokenImgs = [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0 && !i.src.startsWith("data:")).map((i) => i.getAttribute("src")).slice(0, 5);
        // אריחי תמונה ריקים: מיכל עם רקע לבן/אריח בגודל תמונה בלי img או עם img ריק (כמו אריח הקטגוריה הסולארית 23/09)
        const emptyTiles = [...document.querySelectorAll("[class*=tile], [class*=thumb], [class*=gallery]")].filter((el) => {
          const r = el.getBoundingClientRect(); if (r.width < 60 || r.height < 60 || el.offsetParent === null) return false;
          const img = el.querySelector("img"); return !img || (img.complete && img.naturalWidth === 0) || img.getBoundingClientRect().width === 0;
        }).map((el) => String(el.className || "").split(" ")[0] + " @" + Math.round(el.getBoundingClientRect().top)).slice(0, 5);
        // טקסט מוסתר מתחת לאלמנט אחר: הכותרת הראשית ושלושת הפסקאות הראשונות חייבות להיות מה שנמצא בנקודת המרכז שלהן
        const covered = [];
        for (const el of [document.querySelector("h1"), ...[...document.querySelectorAll("main p, main h2")].slice(0, 3)].filter(Boolean)) {
          const r = el.getBoundingClientRect(); if (r.width === 0 || r.top < 0 || r.top > innerHeight) { el.scrollIntoView({ block: "center" }); }
          const rr = el.getBoundingClientRect(); const hit = document.elementFromPoint(Math.min(innerWidth - 2, Math.max(2, rr.left + rr.width / 2)), rr.top + Math.min(rr.height / 2, 12));
          if (hit && hit !== el && !el.contains(hit) && !hit.contains(el)) { const cs = getComputedStyle(hit); if (cs.position !== "fixed") covered.push(`${el.tagName} under ${hit.tagName}.${String(hit.className || "").split(" ")[0]}`); }
        }
        window.scrollTo(0, 0);
        return { overflowX, wide, overlaps, h1, tinyTap, imgsNoAlt, brokenImgs, emptyTiles, covered };
      });
      if (m.overflowX > 2) findings.push({ w, p, issue: `horizontal overflow ${m.overflowX}px`, detail: m.wide });
      if (m.overlaps.length) findings.push({ w, p, issue: "fixed elements overlap", detail: m.overlaps });
      if (m.h1 !== 1) findings.push({ w, p, issue: `h1 count ${m.h1}` });
      if (m.brokenImgs.length) findings.push({ w, p, issue: "broken images", detail: m.brokenImgs });
      if (m.emptyTiles.length) findings.push({ w, p, issue: "empty image tiles", detail: m.emptyTiles });
      if (m.covered.length) findings.push({ w, p, issue: "text covered by another element", detail: m.covered });
      if (m.imgsNoAlt) findings.push({ w, p, issue: `${m.imgsNoAlt} images without alt` });
      if (consoleErrors.length) findings.push({ w, p, issue: "console errors", detail: [...new Set(consoleErrors)].slice(0, 4) });
      const realFailed = failed.filter((f) => !/googleapis|gstatic|google-analytics|googletagmanager|vercel-insights|clarity/.test(f));
      if (realFailed.length) findings.push({ w, p, issue: "failed requests", detail: [...new Set(realFailed)].slice(0, 5) });
      await page.screenshot({ path: path.join(OUT, `${w}-${p.replace(/[\/]/g, "_") || "home"}.png`), fullPage: false });
    }

    // flows on the store page: finder click-through, chat open, cart open
    try {
      await page.goto(BASE + "/store/ds-2cd1043g2-liu-2-8mm", { waitUntil: "networkidle0", timeout: 45000 });
      await page.click("#store-chat-button");
      await new Promise((r) => setTimeout(r, 300));
      const chat = await page.evaluate(() => {
        const input = document.querySelector("#store-chat-input");
        const r = input.getBoundingClientRect();
        const covering = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        const send = input.closest("form").querySelector("button[type=submit]").getBoundingClientRect();
        const covSend = document.elementFromPoint(send.left + send.width / 2, send.top + send.height / 2);
        return { inputCovered: !(covering === input), sendCovered: !covSend || covSend.tagName !== "BUTTON", inViewport: r.bottom <= innerHeight && r.top >= 0 && send.bottom <= innerHeight };
      });
      if (chat.inputCovered || chat.sendCovered || !chat.inViewport) findings.push({ w, p: "chat", issue: "chat input/send covered or out of viewport", detail: chat });
      await page.screenshot({ path: path.join(OUT, `${w}-chat-open.png`) });
      await page.keyboard.press("Escape");
      await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => x.textContent.includes("סגירה")); b && b.click(); });
      // cart
      await page.click(`#qty-ds-2cd1043g2-liu-2-8mm ~ button`).catch(() => {});
      await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => x.textContent.includes("הוספה לעגלה")); b && b.click(); });
      await new Promise((r) => setTimeout(r, 300));
      await page.click("#store-cart-button");
      await new Promise((r) => setTimeout(r, 300));
      const cart = await page.evaluate(() => {
        const d = document.querySelector('[aria-label="עגלת קניות"]');
        const total = d && d.textContent.includes("339");
        const btn = [...document.querySelectorAll("button")].find((x) => x.textContent.includes("להזמנה ובדיקת זמינות"));
        return { drawer: !!d, total, hasOrderBtn: !!btn };
      });
      if (!cart.drawer || !cart.total || !cart.hasOrderBtn) findings.push({ w, p: "cart", issue: "cart flow problem", detail: cart });
      await page.screenshot({ path: path.join(OUT, `${w}-cart-open.png`) });
      // order form validation: empty submit must not succeed
      await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => x.textContent.includes("להזמנה ובדיקת זמינות")); b && b.click(); });
      await new Promise((r) => setTimeout(r, 200));
      const formOk = await page.evaluate(() => !!document.querySelector("#order-name") && !!document.querySelector("#order-phone"));
      if (!formOk) findings.push({ w, p: "cart", issue: "order form did not open" });
      // finder flow
      await page.goto(BASE + "/store/finder", { waitUntil: "networkidle0", timeout: 45000 });
      for (const id of ["finder-place-home", "finder-existing-none", "finder-count-5-8", "finder-priority-color", "finder-budget-any"]) {
        await page.click("#" + id).catch((e) => findings.push({ w, p: "finder", issue: "missing option " + id }));
        await new Promise((r) => setTimeout(r, 150));
      }
      const rec = await page.evaluate(() => ({ headline: (document.querySelector("#finder h3") || {}).textContent, items: document.querySelectorAll("#finder li").length, wa: !!document.querySelector('#finder a[href^="https://wa.me"]') }));
      if (!rec.items || !rec.wa) findings.push({ w, p: "finder", issue: "finder result incomplete", detail: rec });
      await page.screenshot({ path: path.join(OUT, `${w}-finder-result.png`) });
    } catch (e) { findings.push({ w, p: "flows", issue: "flow error: " + e.message.slice(0, 160) }); }
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, "visual-result.json"), JSON.stringify(findings, null, 1));
  console.log(JSON.stringify(findings, null, 1));
  console.log("findings:", findings.length);
})();
