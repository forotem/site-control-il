import type { Metadata } from "next";
import Link from "next/link";
import { storeCategories, storeProducts, WARRANTY_TEXT } from "../data/store-catalog";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { ProductCard } from "./ProductCard";
import { ProductFinder } from "./ProductFinder";
import { CategoryGuide } from "./CategoryGuide";
import styles from "./store.module.css";

export const metadata: Metadata = {
  title: "חנות מצלמות אבטחה ובקרת כניסה | Site-Control",
  description:
    "מצלמות IP של Hikvision ו-Uniview, ערכות Reolink, מקליטים, אינטרקום וקודנים. מלאי בישראל, אחריות שנה, משלוח או התקנה. שאלון קצר מתאים לכם את המערכת.",
  alternates: { canonical: "/store" },
  robots: { index: true, follow: true },
  openGraph: { title: "חנות מצלמות אבטחה ובקרת כניסה | Site-Control", description: "מלאי בישראל, אחריות שנה, משלוח או התקנה מקצועית.", type: "website", locale: "he_IL" },
};

// כניסות מהירות לפי מצב הלקוח, במקום לגלול 84 מוצרים
const quickPaths = [
  { title: "בית פרטי, מתחילים מאפס", desc: "ערכת Reolink מוכנה או מצלמות Hikvision עם מקליט", href: "#kits" },
  { title: "יש מערכת ישנה על קואקס", desc: "מצלמות 3K ColorVu ומקליט היברידי על אותם כבלים", href: "#analog" },
  { title: "אינטרקום לבית או לבניין", desc: "2 גידים על הכבל הקיים, או IP עם מענה מהנייד", href: "#intercom" },
  { title: "מצלמה אחת בלי מקליט", desc: "Wi-Fi עם כרטיס זיכרון ואפליקציה", href: "#wifi" },
  { title: "אתר בנייה או שטח בלי חשמל", desc: "המצלמות הסולאריות 4G שלנו", href: "/products/go" },
];

export default function StorePage() {
  const breadcrumbItems = [{ name: "חנות", url: "/store" }];
  return (
    <main className={styles.wrap}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />

      <header className={styles.hero}>
        <div className={styles.heroText}>
          <h1>מצלמות אבטחה, מקליטים ואינטרקום. עם מישהו שיגיד לכם מה באמת מתאים.</h1>
          <p>
            אותו ציוד של Hikvision, Uniview, Reolink ו-VisionNet שהצוות שלנו מתקין בבתים, בעסקים ובאתרי בנייה.
            מהמלאי של היבואן, במחיר שמתחרה בכל חנות אונליין, ועם הסבר פשוט למה לבחור דגם אחד ולא אחר.
          </p>
          <div className={styles.heroCtas}>
            <a className={`${styles.cta} ${styles.ctaAccent}`} href="#finder">עזרו לי לבחור, 5 שאלות</a>
            <a className={`${styles.cta} ${styles.ctaSecondary}`} href="#categories">לכל המוצרים</a>
          </div>
          <div className={styles.trust}>
            <span>{WARRANTY_TEXT}</span>
            <span>זמינות מאושרת בווצאפ לפני חיוב</span>
            <span>משלוח, איסוף עצמי או התקנה</span>
          </div>
        </div>
        <ul className={styles.quick} aria-label="כניסה מהירה לפי מצב">
          {quickPaths.map((q) => (
            <li key={q.href}>
              {q.href.startsWith("#")
                ? <a href={q.href}><b>{q.title}</b><span>{q.desc}</span></a>
                : <Link href={q.href}><b>{q.title}</b><span>{q.desc}</span></Link>}
            </li>
          ))}
        </ul>
      </header>

      <section className={styles.finderSection} aria-labelledby="finder-title">
        <div className={styles.finderIntroCol}>
          <h2 id="finder-title">לא בטוחים מה צריך? זה בדיוק בשביל זה.</h2>
          <p>
            רוב הלקוחות שלנו לא צריכים לדעת מה זה AcuSense או ColorVu. הם צריכים לדעת מה לשים בכניסה ומה בחצר.
            ענו על חמש שאלות ותקבלו המלצה עם הסבר, מחיר משוער וחלופה זולה או משודרגת. אפשר לשלוח אותה אלינו בווצאפ ולקבל מחיר סופי.
          </p>
          <p className={styles.finderSmall}>הכלי מציע מתוך המוצרים שבמלאי בלבד. אין "שילמת יותר כי לא ידעת".</p>
        </div>
        <ProductFinder />
      </section>

      <nav className={styles.catNav} aria-label="קטגוריות" id="categories">
        {storeCategories.map((c) => {
          const n = storeProducts.filter((p) => p.category === c.id).length;
          return n ? <a key={c.id} href={`#${c.id}`}>{c.name} <small>{n}</small></a> : null;
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
            <CategoryGuide category={c.id} />
            <div className={styles.grid}>
              {items.map((p) => <ProductCard key={p.slug} p={p} />)}
            </div>
          </section>
        );
      })}

      <section className={styles.closing}>
        <h2>לא מצאתם? יש עוד במלאי.</h2>
        <p>הקטלוג באתר הוא מה שצילמנו במחסן היבואן השבוע. מנעולים חשמליים, מתגי PoE, כבלים, דיסקים ודגמים נוספים זמינים לפי בקשה.</p>
        <a className={`${styles.cta} ${styles.ctaPrimary}`} href={`https://wa.me/972502256866?text=${encodeURIComponent("היי, אני מחפש מוצר שלא מופיע בחנות באתר:")}`} target="_blank" rel="noopener noreferrer">לשאול בווצאפ</a>
      </section>
    </main>
  );
}
