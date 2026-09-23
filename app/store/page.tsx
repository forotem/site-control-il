import type { Metadata } from "next";
import { storeCategories, storeProducts, WARRANTY_TEXT } from "../data/store-catalog";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { ProductCard } from "./ProductCard";
import styles from "./store.module.css";

export const metadata: Metadata = {
  title: "חנות מצלמות אבטחה ובקרת כניסה | Site-Control",
  description:
    "מצלמות IP של Hikvision ו-UNV, ערכות Reolink מוכנות, מקליטים, אינטרקום וקודנים. מלאי בישראל, אחריות שנה, משלוח או התקנה על ידי הצוות שלנו.",
  alternates: { canonical: "/store" },
  // טרום-השקה: החנות פתוחה לקישור ישיר בלבד עד לאישור מחירים סופיים
  robots: { index: false, follow: false },
  openGraph: { title: "חנות מצלמות אבטחה ובקרת כניסה | Site-Control", description: "מלאי בישראל, אחריות שנה, משלוח או התקנה מקצועית.", type: "website", locale: "he_IL" },
};

export default function StorePage() {
  const breadcrumbItems = [{ name: "חנות", url: "/store" }];
  return (
    <main className={styles.wrap}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />
      <header className={styles.hero}>
        <span className={styles.eyebrow}>החנות של Site-Control</span>
        <h1>ציוד אבטחה מקצועי, מהמלאי של היבואן, עם אנשים שגם מתקינים אותו</h1>
        <p>
          מצלמות IP, ערכות מוכנות, מקליטים, אינטרקום ובקרת כניסה של Hikvision, UNV, Reolink, VisionNet ו-Tenda.
          אותם מוצרים שהצוות שלנו מתקין באתרי בנייה ובעסקים, במחיר שמתחרה בכל חנות אונליין, ועם אפשרות להתקנה מקצועית.
        </p>
        <div className={styles.trust}>
          <span>{WARRANTY_TEXT}</span>
          <span>מלאי בישראל, זמינות מאושרת לפני חיוב</span>
          <span>משלוח, איסוף עצמי או התקנה</span>
          <span>ייעוץ טכני בווצאפ לפני הקנייה</span>
        </div>
      </header>

      <nav className={styles.catNav} aria-label="קטגוריות">
        {storeCategories.map((c) => {
          const n = storeProducts.filter((p) => p.category === c.id).length;
          return n ? <a key={c.id} href={`#${c.id}`}>{c.name} ({n})</a> : null;
        })}
      </nav>

      {storeCategories.map((c) => {
        const items = storeProducts.filter((p) => p.category === c.id);
        if (!items.length) return null;
        return (
          <section key={c.id} id={c.id} className={styles.section}>
            <div className={styles.sectionHead}>
              <div>
                <h2>{c.name}</h2>
                <p>{c.blurb}</p>
              </div>
              <span className={styles.count}>{items.length} מוצרים</span>
            </div>
            <div className={styles.grid}>
              {items.map((p) => <ProductCard key={p.slug} p={p} />)}
            </div>
          </section>
        );
      })}
    </main>
  );
}
