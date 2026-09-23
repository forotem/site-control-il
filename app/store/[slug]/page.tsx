import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { storeProducts, deliveryOptions, WHATSAPP_NUMBER, WARRANTY_TEXT } from "../../data/store-catalog";
import { Breadcrumb, BreadcrumbSchema } from "../../components/Breadcrumb";
import { ProductCard } from "../ProductCard";
import styles from "../store.module.css";

export function generateStaticParams() {
  return storeProducts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = storeProducts.find((x) => x.slug === params.slug);
  if (!p) return {};
  return {
    title: `${p.title} | ${p.model} | Site-Control`,
    description: `${p.brand} ${p.model}. ${p.highlights.join(". ")}. ${WARRANTY_TEXT}. משלוח, איסוף או התקנה מקצועית.`,
    alternates: { canonical: `/store/${p.slug}` },
    robots: { index: false, follow: false },
    openGraph: { title: `${p.title} | Site-Control`, description: p.highlights.join(" · "), type: "website", locale: "he_IL", images: p.image ? [{ url: p.image }] : undefined },
  };
}

const nis = (v: number) => v.toLocaleString("he-IL");

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = storeProducts.find((x) => x.slug === params.slug);
  if (!p) notFound();
  const related = storeProducts.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
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
    <main className={styles.wrap}>
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
          <span className={styles.eyebrow}>{p.categoryName}</span>
          <h1>{p.title}</h1>
          <div className={styles.meta}>
            <span>מותג: <b>{p.brand}</b></span>
            <span>דגם: <code>{p.model}</code></span>
            {p.sku && <span>מק״ט: <code>{p.sku}</code></span>}
          </div>

          <div className={styles.buyBox}>
            {p.price ? (
              <div className={styles.bigPrice}><strong>{nis(p.price)} ₪</strong><span>כולל מע״מ</span></div>
            ) : (
              <div className={styles.bigPrice}><strong>מחיר לפי פנייה</strong></div>
            )}
            <p className={styles.stockNote}>
              המלאי מתעדכן יומית אצל היבואן. לפני חיוב אנחנו מאשרים זמינות ומועד אספקה, כך שלא תשלם על מוצר שאין במלאי.
            </p>
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
              <h2>מפרט עיקרי</h2>
              <ul>{p.specs.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}
          <div className={styles.links}>
            {p.datasheet && <a href={p.datasheet} target="_blank" rel="noopener noreferrer">דף נתונים מלא של היצרן (PDF)</a>}
            <Link href={`/store#${p.category}`}>עוד מוצרים ב{p.categoryName}</Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <h2>מוצרים דומים</h2>
          <div className={styles.grid}>{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
        </section>
      )}
    </main>
  );
}
