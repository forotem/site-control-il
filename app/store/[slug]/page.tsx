import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { storeProducts, deliveryOptions, WHATSAPP_NUMBER, WARRANTY_TEXT } from "../../data/store-catalog";
import { attrsOf, fitLine, kindLabel, nightLabel, aiLabel, audioLabel, isCamera, isRecorder } from "../../data/store-attrs";
import { Breadcrumb, BreadcrumbSchema } from "../../components/Breadcrumb";
import { ProductCard, SpecChips } from "../ProductCard";
import { CompareTable } from "../CompareTable";
import { AddToCart } from "../CartUI";
import styles from "../store.module.css";

export function generateStaticParams() {
  return storeProducts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = storeProducts.find((x) => x.slug === params.slug);
  if (!p) return {};
  const a = attrsOf(p);
  const shortTitle = `${p.brand} ${p.model} | ${kindLabel[a.kind]} | Site-Control`;
  const desc = trim155(`${p.title}. ${p.highlights[0] || ""}. ${WARRANTY_TEXT}, משלוח או התקנה.`);
  return {
    title: shortTitle.length <= 70 ? shortTitle : `${p.brand} ${p.model} | Site-Control`,
    description: desc,
    alternates: { canonical: `/store/${p.slug}` },
    robots: { index: true, follow: true },
    openGraph: { title: `${p.brand} ${p.model} | Site-Control`, description: p.highlights.join(" · "), type: "website", locale: "he_IL", images: p.image ? [{ url: p.image }] : undefined },
  };
}

const nis = (v: number) => v.toLocaleString("he-IL");
/** תיאור meta עד 155 תווים, נחתך בגבול מילה */
function trim155(s: string) {
  const t = s.replace(/\s+/g, " ").replace(/\.\s*\./g, ".").trim();
  if (t.length <= 150) return t;
  const cut = t.slice(0, 147);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

/** השכנים הקרובים: אותו סוג גוף, הזול הבא והיקר הבא, להשוואה ישירה */
function neighbours(p: (typeof storeProducts)[number]) {
  const a = attrsOf(p);
  const same = storeProducts
    .filter((x) => x.slug !== p.slug && x.category === p.category && attrsOf(x).kind === a.kind && x.price && p.price)
    .sort((x, y) => (x.price || 0) - (y.price || 0));
  const cheaper = [...same].reverse().find((x) => (x.price || 0) <= (p.price || 0));
  const pricier = same.find((x) => (x.price || 0) > (p.price || 0));
  return [cheaper?.slug, p.slug, pricier?.slug].filter(Boolean) as string[];
}

/** "בקצרה" בשפה של לקוח: מה המצלמה הזאת עושה, לפני המפרט */
function plainSummary(p: (typeof storeProducts)[number]): string[] {
  const a = attrsOf(p);
  const out: string[] = [];
  if (isCamera(a)) {
    if (a.night) out.push(nightLabel[a.night] + (a.range ? `, טווח תאורה עד ${a.range} מטר` : ""));
    if (a.ai && a.ai !== "none") out.push(aiLabel[a.ai]);
    if (a.deter) out.push("אור מהבהב וסירנה שנדלקים כשאדם נכנס לאזור שהגדרתם");
    if (a.audio && a.audio !== "none") out.push(a.audio === "two-way" ? "רמקול ומיקרופון: אפשר לדבר עם מי שמול המצלמה מהנייד" : "מיקרופון: ההקלטה כוללת קול");
    if (a.varifocal) out.push("עדשה ממונעת: מכוונים את הזום מהאפליקציה, בלי לטפס לסולם");
    if (a.wifi) out.push("חיבור Wi-Fi והקלטה לכרטיס זיכרון, בלי מקליט");
    else if (a.kind !== "kit") out.push("הזנה בכבל רשת אחד (PoE) ממתג או ממקליט עם PoE");
  } else if (isRecorder(a)) {
    out.push(`${kindLabel[a.kind]}, עד ${a.channels} מצלמות`);
    out.push(a.poePorts ? `${a.poePorts} יציאות PoE מובנות: המצלמות מתחברות ישר למקליט` : "נדרש מתג PoE להזנת המצלמות");
    out.push(`${a.bays === 2 ? "שני מפרצי דיסק" : "מפרץ דיסק אחד"}, מסופק בלי דיסק`);
    if (a.ai === "acusense") out.push("סינון אדם/רכב במקליט וחיפוש חכם בהקלטות");
  } else if (a.kind === "kit") {
    out.push(`${a.cams} מצלמות ומקליט ${a.channels} ערוצים עם דיסק ${a.hdd}, כבלים ואפליקציה בעברית`);
    if (a.night) out.push(nightLabel[a.night]);
    if (a.audio && a.audio !== "none") out.push(audioLabel[a.audio]);
  } else {
    const wiring: Record<string, string> = { ip: "מתחבר בכבל רשת (IP)", "2wire": "עובד על 2 הגידים הקיימים", "4wire": "חיווט 4 גידים פשוט", hybrid: "2 גידים קיימים + Wi-Fi ואפליקציה", standalone: "עצמאי, בלי מערכת מאחור" };
    if (a.wiring && wiring[a.wiring]) out.push(wiring[a.wiring]);
    if (a.app) out.push("מענה ופתיחת דלת מהנייד");
  }
  const fit = fitLine(p);
  if (fit) out.push(`מתאים ל: ${fit}`);
  return out;
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = storeProducts.find((x) => x.slug === params.slug);
  if (!p) notFound();
  const a = attrsOf(p);
  const related = storeProducts.filter((x) => x.category === p.category && x.slug !== p.slug && attrsOf(x).kind !== a.kind).slice(0, 4);
  const compareSlugs = neighbours(p);
  const summary = plainSummary(p);
  const waText = encodeURIComponent(
    `היי, אני מתעניין ב-${p.title} (${p.brand} ${p.model}${p.sku ? `, מק"ט ${p.sku}` : ""}). האם יש במלאי ומה זמן האספקה?`
  );
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
  const breadcrumbItems = [
    { name: "חנות", url: "/store" },
    { name: p.categoryName, url: `/store#${p.category}` },
    { name: p.model, url: `/store/${p.slug}` },
  ];
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    brand: { "@type": "Brand", name: p.brand },
    mpn: p.model,
    sku: p.sku || p.model,
    image: p.image || undefined,
    description: p.highlights.join(". "),
    offers: p.price
      ? { "@type": "Offer", priceCurrency: "ILS", price: p.price, availability: "https://schema.org/InStock", seller: { "@type": "Organization", name: "Site-Control" } }
      : undefined,
  };

  return (
    <main className={`${styles.wrap} ${styles.productWrap}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />

      <div className={styles.product}>
        {p.image ? (
          <div className={styles.gallery}><img src={p.image} alt={p.title} /></div>
        ) : (
          <div className={styles.galleryEmpty} aria-hidden>{p.brand.split(" ")[0]}</div>
        )}

        <div className={styles.info}>
          <span className={styles.eyebrow}>{p.categoryName} · {kindLabel[a.kind]}</span>
          <h1>{p.title}</h1>
          <div className={styles.meta}>
            <span>מותג: <b>{p.brand}</b></span>
            <span>דגם: <code>{p.model}</code></span>
            {p.sku && <span>מק״ט: <code>{p.sku}</code></span>}
          </div>
          <SpecChips p={p} max={6} />

          {summary.length > 0 && (
            <ul className={styles.plain}>{summary.map((s, i) => <li key={i}>{s}</li>)}</ul>
          )}

          <div className={styles.buyBox}>
            {p.price ? (
              <div className={styles.bigPrice}><strong>{nis(p.price)} ₪</strong><span>כולל מע״מ</span></div>
            ) : (
              <div className={styles.bigPrice}><strong>מחיר לפי פנייה</strong><span>נחזור עם מחיר תוך שעות עבודה</span></div>
            )}
            <p className={styles.stockNote}>
              המלאי מתעדכן יומית אצל היבואן. לפני חיוב אנחנו מאשרים זמינות ומועד אספקה, כך שלא תשלם על מוצר שאין במלאי.
            </p>
            <AddToCart slug={p.slug} />
            <a className={`${styles.cta} ${styles.ctaPrimary}`} href={waHref} target="_blank" rel="noopener noreferrer">
              בדיקת זמינות והזמנה בווצאפ
            </a>
            <Link className={`${styles.cta} ${styles.ctaSecondary}`} href="/contact">רוצה שנתקין? דברו איתנו</Link>
            <div className={styles.delivery}>
              <h3>איך תרצה לקבל את המוצר?</h3>
              {deliveryOptions.map((d, i) => (
                <div key={d.id} className={styles.deliveryOpt}>
                  <i>{i + 1}</i>
                  <div><b>{d.title}</b><span>{d.desc}</span></div>
                </div>
              ))}
            </div>
            <p className={styles.note}>{WARRANTY_TEXT}. {p.category === "recorders" ? "המקליט מסופק ללא דיסק קשיח, מתאים לכל דיסק סטנדרטי." : "המחיר כולל מע״מ ואינו כולל התקנה."}</p>
          </div>

          {p.specs.length > 0 && (
            <div className={styles.specs}>
              <h2>מפרט מלא</h2>
              <ul>{p.specs.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}
          <div className={styles.links}>
            {p.datasheet && <a href={p.datasheet} target="_blank" rel="noopener noreferrer">דף נתונים מלא של היצרן (PDF)</a>}
            <Link href={`/store#${p.category}`}>עוד מוצרים ב{p.categoryName}</Link>
            <Link href="/store/finder">לא בטוחים? שאלון התאמה קצר</Link>
          </div>
        </div>
      </div>

      {compareSlugs.length > 1 && (
        <section className={styles.related}>
          <h2>מול הדגם הזול יותר והיקר יותר</h2>
          <p className={styles.compareNote}>אותו סוג גוף, מסודר לפי מחיר. השורות המודגשות הן מה שבאמת שונה.</p>
          <CompareTable slugs={compareSlugs} highlight={p.slug} />
        </section>
      )}

      {related.length > 0 && (
        <section className={styles.related}>
          <h2>משלימים מאותה קטגוריה</h2>
          <div className={styles.grid}>{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
        </section>
      )}

      <div className={`${styles.stickyBar} store-sticky-bar`}>
        <div>
          <b>{p.price ? `${nis(p.price)} ₪` : "מחיר לפי פנייה"}</b>
          <span>{p.model}</span>
        </div>
        <a className={`${styles.cta} ${styles.ctaPrimary}`} href={waHref} target="_blank" rel="noopener noreferrer">בדיקת זמינות בווצאפ</a>
      </div>
    </main>
  );
}
