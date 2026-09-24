import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { WHATSAPP_NUMBER, WARRANTY_TEXT } from "../data/store-catalog";
import { BASE_URL } from "../config";
import { InstallForm } from "./InstallForm";
import styles from "../home.module.css";

export const metadata: Metadata = {
  title: "התקנת מצלמות אבטחה, אינטרקום ובקרת כניסה | Site-Control",
  description:
    "התקנת מצלמות אבטחה לבית, לעסק ולבניין: תכנון, חיווט, מקליט, הגדרת אפליקציה והדרכה. גם אינטרקום ובקרת כניסה. ציוד Hikvision, Uniview ו-Reolink מהמלאי של היבואן, אחריות שנה.",
  alternates: { canonical: "/installation" },
  openGraph: {
    title: "התקנת מצלמות אבטחה ואינטרקום | Site-Control",
    description: "תכנון, חיווט, הגדרה והדרכה. ציוד מהמלאי של היבואן בישראל, אחריות שנה.",
    url: "/installation",
    type: "website",
    locale: "he_IL",
    images: ["/og-default.jpg"],
  },
  twitter: { card: "summary_large_image", title: "התקנת מצלמות אבטחה ואינטרקום | Site-Control", description: "תכנון, חיווט, הגדרה והדרכה. ציוד מהמלאי של היבואן בישראל, אחריות שנה." },
};

const faq = [
  { q: "כמה עולה התקנת מצלמות אבטחה?", a: "המחיר תלוי במספר הנקודות, במרחק מהמקליט ובתשתית הקיימת. שלחו כמה מצלמות ואיפה, או תמונות של המקום בווצאפ, ונחזור עם הצעת מחיר מסודרת לציוד ולהתקנה." },
  { q: "אתם מתקינים גם ציוד שקניתי לבד?", a: "שלחו לנו את הדגמים ונבדוק. ציוד מהחנות שלנו אנחנו מכירים לעומק, ולכן ההתקנה שלו מהירה ופשוטה יותר." },
  { q: "יש לי מערכת ישנה, צריך להחליף הכל?", a: "לא תמיד. על כבלי קואקס קיימים אפשר לשדרג למצלמות 3K ו-4K ולמקליט היברידי, ובאינטרקום 2 גידים אפשר לעבור לוידאו על אותו חיווט." },
  { q: "מה מקבלים בסוף ההתקנה?", a: "מערכת עובדת, אפליקציה מוגדרת בנייד של כל מי שצריך, והסבר איך צופים, מחפשים הקלטה ומקבלים התראות. " + WARRANTY_TEXT + "." },
];

export default function InstallationPage() {
  const items = [{ name: "התקנה", url: "/installation" }];
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי, אשמח להצעת מחיר להתקנת מצלמות / אינטרקום")}`;
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "התקנת מצלמות אבטחה, אינטרקום ובקרת כניסה",
    serviceType: "התקנת מערכות אבטחה",
    provider: { "@type": "Organization", name: "Site-Control", url: BASE_URL, telephone: "+972-50-2256866" },
    areaServed: { "@type": "Country", name: "Israel" },
    url: `${BASE_URL}/installation`,
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <main className={styles.wrap}>
      <BreadcrumbSchema items={items} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumb items={items} />

      <section className={styles.heroText} data-track="installation_hero">
        <span className={styles.kicker}>צוות התקנות, לא רק חנות</span>
        <h1>התקנת מצלמות אבטחה, אינטרקום ובקרת כניסה</h1>
        <p style={{ color: "var(--muted)", fontSize: "1.08rem", lineHeight: 1.75, maxWidth: "65ch" }}>
          מתכננים, מחווטים, מתקינים ומגדירים את האפליקציה בנייד. בבתים פרטיים, בדירות, בעסקים, בבניינים משותפים ובאתרים.
          הציוד של Hikvision, Uniview, Reolink ו-VisionNet מגיע מהמלאי של היבואן בישראל, במחיר של חנות אונליין.
        </p>
        <div className={styles.ctas}>
          <a className={`${styles.cta} ${styles.ctaAccent}`} href="#quote">הצעת מחיר להתקנה</a>
          <a className={`${styles.cta} ${styles.ctaGhost}`} href={wa} target="_blank" rel="noopener noreferrer">לשלוח תמונה בווצאפ</a>
        </div>
        <div className={styles.trust}>
          <span>{WARRANTY_TEXT}</span>
          <span>ממליצים רק על מה שצריך</span>
          <span>הגדרה והדרכה כלולות</span>
        </div>
      </section>

      <section aria-labelledby="what">
        <div className={styles.sectionHead}><h2 id="what">מה אנחנו מתקינים</h2></div>
        <div className={styles.ways}>
          <Link className={styles.way} href="/store/c/kits"><i>1</i><b>מערכת מצלמות לבית</b><p>4 עד 8 מצלמות עם מקליט, צפייה והתראות בנייד. ערכות מוכנות או מצלמות לפי בחירה.</p><em>לערכות בחנות</em></Link>
          <Link className={styles.way} href="/store/c/ip"><i>2</i><b>מצלמות לעסק</b><p>מצלמות IP ומקליט NVR לחנות, משרד, מחסן או חניון, עם התראות על אדם ורכב.</p><em>למצלמות IP</em></Link>
          <Link className={styles.way} href="/store/c/intercom"><i>3</i><b>אינטרקום ובקרת כניסה</b><p>אינטרקום וידאו לוילה ולבניין, קודנים, קוראי כרטיסים ומסופי זיהוי פנים.</p><em>לאינטרקום</em></Link>
          <Link className={styles.way} href="/store/c/analog"><i>4</i><b>שדרוג מערכת קיימת</b><p>מצלמות חדשות על הכבלים הקיימים, מקליט היברידי, והחלפת אינטרקום ישן.</p><em>למצלמות לשדרוג</em></Link>
        </div>
      </section>

      <section aria-labelledby="how">
        <div className={styles.sectionHead}><h2 id="how">איך זה עובד</h2></div>
        <div className={styles.ways}>
          <div className={styles.way}><i>1</i><b>מספרים לנו מה צריך</b><p>בטופס או בווצאפ: איפה, כמה נקודות, ומה יש היום. תמונה של המקום עוזרת מאוד.</p></div>
          <div className={styles.way}><i>2</i><b>מקבלים הצעת מחיר</b><p>ציוד והתקנה בהצעה אחת, עם הסבר למה בחרנו כל רכיב. בלי להעמיס מה שלא צריך.</p></div>
          <div className={styles.way}><i>3</i><b>מתקינים ומגדירים</b><p>התקנה, חיווט, הגדרת המקליט והאפליקציה, והדרכה קצרה בסוף.</p></div>
        </div>
      </section>

      <section id="quote" aria-labelledby="quote-title">
        <div className={styles.sectionHead}>
          <h2 id="quote-title">הצעת מחיר להתקנה</h2>
          <p>משאירים שם וטלפון ומה צריך, ואנחנו חוזרים עם הצעה. בלי התחייבות.</p>
        </div>
        <InstallForm />
      </section>

      <section aria-labelledby="faq">
        <div className={styles.sectionHead}><h2 id="faq">שאלות נפוצות על התקנה</h2></div>
        <div className={styles.faq}>
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p style={{ padding: "0 1.1rem 1rem", color: "var(--muted)", lineHeight: 1.7 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
