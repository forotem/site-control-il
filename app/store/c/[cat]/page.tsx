import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { storeCategories, storeProducts, WHATSAPP_NUMBER, WARRANTY_TEXT, productName } from "../../../data/store-catalog";
import { categorySeo } from "../../../data/store-category-seo";
import { Breadcrumb, BreadcrumbSchema } from "../../../components/Breadcrumb";
import { ProductCard } from "../../ProductCard";
import { CategoryGuide } from "../../CategoryGuide";
import { BASE_URL } from "../../../config";
import { BUSINESS } from "../../../data/business";
import { InstallForm } from "../../../installation/InstallForm";
import styles from "../../store.module.css";
import home from "../../../home.module.css";

// קטגוריות שקמפייני הלידים שולחים אליהן: מקבלות טופס "צריך גם התקנה?" עם id="quote"
const QUOTE_CATEGORIES = new Set(["intercom", "ip", "recorders", "analog"]);

// דף קטגוריה אמיתי (לא עוגן #) כדי שגוגל יוכל לדרג "אינטרקום לבניין", "מקליט NVR" וכו',
// ושיהיה דף נחיתה ממוקד לכל קבוצת מודעות.
export const dynamicParams = false;

export function generateStaticParams() {
  return storeCategories.filter((c) => categorySeo[c.id]).map((c) => ({ cat: c.id }));
}

export function generateMetadata({ params }: { params: { cat: string } }): Metadata {
  const seo = categorySeo[params.cat];
  if (!seo) return {};
  const url = `/store/c/${params.cat}`;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: url },
    openGraph: { title: seo.h1, description: seo.description, url, type: "website", locale: "he_IL", siteName: "Site-Control", images: ["/og-default.jpg"] },
    twitter: { card: "summary_large_image", title: seo.h1, description: seo.description },
  };
}

export default function CategoryPage({ params }: { params: { cat: string } }) {
  const cat = storeCategories.find((c) => c.id === params.cat);
  const seo = categorySeo[params.cat];
  if (!cat || !seo) notFound();
  const items = storeProducts.filter((p) => p.category === cat.id);
  const withQuote = QUOTE_CATEGORIES.has(cat.id);
  const breadcrumbItems = [
    { name: "חנות", url: "/store" },
    { name: cat.name, url: `/store/c/${cat.id}` },
  ];
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`היי, הגעתי מדף ${cat.name} באתר ואשמח להמלצה והצעת מחיר`)}`;
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: seo.h1,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${BASE_URL}/store/${p.slug}`, name: productName(p) })),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className={styles.wrap}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumb items={breadcrumbItems} />

      <header className={styles.hero}>
        <div className={styles.heroText}>
          <h1>{seo.h1}</h1>
          <p>{seo.intro}</p>
          <div className={styles.heroCtas} data-track={`category_${cat.id}`}>
            <a className={`${styles.cta} ${styles.ctaAccent}`} href="#products">ל-{items.length} המוצרים עם מחיר</a>
            {withQuote
              ? <a className={`${styles.cta} ${styles.ctaSecondary}`} href="#quote">הצעת מחיר כולל התקנה</a>
              : <a className={`${styles.cta} ${styles.ctaSecondary}`} href={wa} target="_blank" rel="noopener noreferrer">המלצה והצעת מחיר בווצאפ</a>}
          </div>
          <div className={styles.trust}>
            <span>{WARRANTY_TEXT}</span>
            <span>ציוד מיבואן בישראל</span>
            <span>משלוח לכל הארץ. התקנה בנפרד, בתיאום ולפי הצעת מחיר</span>
          </div>
        </div>
      </header>

      <section id="products" className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2>{cat.name}</h2>
            <p>{cat.blurb}</p>
          </div>
          <span className={styles.count}>{items.length} מוצרים</span>
        </div>
        <CategoryGuide category={cat.id} />
        <div className={styles.grid}>
          {items.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </section>

      {withQuote && (
        <section id="quote" className={styles.section} aria-labelledby="quote-title" data-track={`category_${cat.id}_quote`} style={{ scrollMarginTop: "90px" }}>
          <div className={styles.sectionHead}>
            <div>
              <h2 id="quote-title">צריך גם התקנה או תכנון?</h2>
              <p>משאירים שם, טלפון ומה צריך, וחוזרים אליך עם הצעה לציוד. התקנה {BUSINESS.installAreaIn}.</p>
            </div>
          </div>
          <InstallForm variant="short" category={cat.id} />
        </section>
      )}

      <section className={styles.section} aria-labelledby="faq-title">
        <div className={styles.sectionHead}><h2 id="faq-title">שאלות נפוצות</h2></div>
        <div className={home.faq}>
          {seo.faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p style={{ padding: "0 1.1rem 1rem", color: "var(--muted)", lineHeight: 1.7 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className={styles.catNav} aria-label="קטגוריות נוספות">
        {storeCategories.filter((c) => c.id !== cat.id && categorySeo[c.id]).map((c) => (
          <Link key={c.id} href={`/store/c/${c.id}`}>{c.name}</Link>
        ))}
      </nav>

      <section className={styles.closing} data-track={`category_${cat.id}_closing`}>
        <h2>לא בטוחים מה מתאים?</h2>
        <p>ענו על 5 שאלות וקבלו המלצה עם מחיר, או כתבו לנו בווצאפ מה צריך ואיפה. אם צריך גם התקנה, נחזור עם הצעת מחיר כוללת.</p>
        <div className={styles.heroCtas}>
          <Link className={`${styles.cta} ${styles.ctaAccent}`} href="/store/finder">שאלון התאמה</Link>
          <a className={`${styles.cta} ${styles.ctaPrimary}`} href={wa} target="_blank" rel="noopener noreferrer">לכתוב בווצאפ</a>
        </div>
      </section>
    </main>
  );
}
