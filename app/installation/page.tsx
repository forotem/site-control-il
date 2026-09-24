import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { WHATSAPP_NUMBER, WARRANTY_TEXT, storeProducts, productName } from "../data/store-catalog";
import { BUSINESS } from "../data/business";
import { BASE_URL } from "../config";
import { InstallForm } from "./InstallForm";
import styles from "../home.module.css";

export const metadata: Metadata = {
  title: "התקנת מצלמות אבטחה, אינטרקום ובקרת כניסה בכל הארץ | Site-Control",
  description:
    `התקנת מצלמות אבטחה, אינטרקום ובקרת כניסה ${BUSINESS.installAreaIn}: תכנון, חיווט, מקליט, אפליקציה והדרכה. Hikvision, Uniview ו-Reolink, אחריות שנה.`,
  alternates: { canonical: "/installation" },
  openGraph: {
    title: "התקנת מצלמות אבטחה ואינטרקום | Site-Control",
    description: `תכנון, חיווט, הגדרה והדרכה ${BUSINESS.installAreaIn}. ${WARRANTY_TEXT}.`,
    url: "/installation",
    type: "website",
    locale: "he_IL",
    images: ["/og-default.jpg"],
  },
  twitter: { card: "summary_large_image", title: "התקנת מצלמות אבטחה ואינטרקום | Site-Control", description: `תכנון, חיווט, הגדרה והדרכה ${BUSINESS.installAreaIn}.` },
};

// ציוד שאנחנו מתקינים הכי הרבה, עם המחיר מהחנות (ציוד בלבד, ההתקנה בהצעת המחיר)
const EQUIPMENT = [
  "reolink-rlk8-410b4-5mp",
  "ds-2cd1347g2-luf-2-8mm",
  "nvr301-08s3",
  "ds-kis607-s",
  "visionnet-kitcom-2-wire-villa-kit-560789",
  "ds-k1t502dbfwx-c",
];

const faq = [
  { q: "באילו אזורים אתם מתקינים?", a: "בכל הארץ, בתיאום. מתקין מטעמנו בודק זמינות באזור שלכם, ובדרך כלל רואה את המקום לפני הצעת המחיר. ציוד מהחנות נשלח לכל הארץ, וההתקנה היא שירות נפרד שלא חובה להזמין." },
  { q: "כמה עולה התקנת מצלמות אבטחה?", a: "המחיר תלוי במספר הנקודות, בגובה ובמרחק מהמקליט, ובתשתית שכבר יש במקום. שלחו כמה מצלמות ואיפה, או תמונות של המקום בווצאפ, ונחזור עם הצעת מחיר. מחיר הציוד הוא המחיר שבחנות, ומחיר ההתקנה נקבע בנפרד אחרי בדיקת המקום." },
  { q: "אתם מתקינים גם ציוד שקניתי לבד?", a: "שלחו לנו את הדגמים ונבדוק. ציוד מהחנות שלנו אנחנו מכירים לעומק, ולכן ההתקנה שלו מהירה ופשוטה יותר." },
  { q: "יש לי מערכת ישנה, צריך להחליף הכל?", a: "לא תמיד. על כבלי קואקס קיימים אפשר לשדרג למצלמות 3K ו-4K ולמקליט היברידי, ובאינטרקום 2 גידים אפשר לעבור לווידאו על אותו חיווט." },
  { q: "מה מקבלים בסוף ההתקנה?", a: "מערכת עובדת, אפליקציה מוגדרת בנייד של כל מי שצריך, והסבר איך צופים, מחפשים הקלטה ומקבלים התראות. " + WARRANTY_TEXT + "." },
];

const nis = (n: number) => n.toLocaleString("he-IL");

export default function InstallationPage() {
  const items = [{ name: "התקנה", url: "/installation" }];
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי, אשמח להצעת מחיר להתקנת מצלמות / אינטרקום. מצרף תמונה של המקום:")}`;
  const equipment = EQUIPMENT.map((slug) => storeProducts.find((p) => p.slug === slug)).filter((p): p is NonNullable<typeof p> => !!p && !!p.price);
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "התקנת מצלמות אבטחה, אינטרקום ובקרת כניסה",
    serviceType: "התקנת מערכות אבטחה",
    provider: { "@type": "LocalBusiness", name: BUSINESS.brand, legalName: BUSINESS.legalName, url: BASE_URL, telephone: BUSINESS.phoneE164 },
    areaServed: { "@type": "Country", name: "Israel" },
    url: `${BASE_URL}/installation`,
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const card = { padding: "1.4rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-accent)", background: "var(--glass-strong)", display: "grid", gap: "0.8rem", scrollMarginTop: "90px" } as const;
  return (
    <main className={styles.wrap} data-lead-page="installation">
      <BreadcrumbSchema items={items} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumb items={items} />

      <section className={styles.hero} data-track="installation_hero">
        <div className={styles.heroText}>
          <span className={styles.kicker}>שירות התקנה בכל הארץ, בנפרד מהחנות</span>
          <h1>התקנת מצלמות אבטחה, אינטרקום ובקרת כניסה</h1>
          <p>
            מתכננים, מחווטים, מתקינים ומגדירים את האפליקציה בנייד. בבתים פרטיים, בדירות, בעסקים ובבניינים משותפים.
            הציוד של Hikvision, Uniview, Reolink ו-VisionNet, במחיר של חנות אונליין.
          </p>
          <p>
            מצלמות אבטחה לווילה, לבית במושב ולוועד בית בבניין משותף.
          </p>
          <p style={{ color: "var(--text-bright)", fontWeight: 600 }}>
            התקנה {BUSINESS.installAreaIn} · מתקין מטעמנו בתיאום · ההצעה נפרדת ממחיר הציוד, אחרי בדיקת המקום
          </p>
          <div className={styles.trust}>
            <span>{WARRANTY_TEXT}</span>
            <span>הצעת מחיר בלי התחייבות</span>
            <span>הגדרה והדרכה כלולות</span>
          </div>
          <div className={styles.ctas}>
            <a className={`${styles.cta} ${styles.ctaWa}`} href={wa} target="_blank" rel="noopener noreferrer">לשלוח תמונה של המקום בווצאפ</a>
            {/* בנייד הטופס יורד מתחת לטקסט: כפתור שמקפיץ אליו */}
            <a className={`${styles.cta} ${styles.ctaGhost}`} href="#quote">לטופס הקצר</a>
          </div>
        </div>
        <div id="quote" style={card}>
          <h2 style={{ fontSize: "1.35rem", color: "var(--text-bright)" }}>הצעת מחיר להתקנה</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>שם, טלפון ומה צריך. נחזור אליך עם שאלות קצרות והצעה.</p>
          <InstallForm variant="short" />
        </div>
      </section>

      <section aria-labelledby="what">
        <div className={styles.sectionHead}><h2 id="what">מה אנחנו מתקינים</h2></div>
        <div className={styles.ways}>
          <a className={styles.way} href="#quote"><i>1</i><b>מערכת מצלמות לבית</b><p>4 עד 8 מצלמות עם מקליט, צפייה והתראות בנייד.</p><em>להצעת מחיר</em></a>
          <a className={styles.way} href="#quote"><i>2</i><b>מצלמות לעסק</b><p>מצלמות IP ומקליט NVR לחנות, משרד, מחסן או חניון, עם התראות על אדם ורכב.</p><em>להצעת מחיר</em></a>
          <a className={styles.way} href="#quote"><i>3</i><b>אינטרקום ובקרת כניסה</b><p>אינטרקום וידאו לווילה ולבניין, קודנים, קוראי כרטיסים ומסופי זיהוי פנים.</p><em>להצעת מחיר</em></a>
          <a className={styles.way} href="#quote"><i>4</i><b>שדרוג מערכת קיימת</b><p>מצלמות חדשות על הכבלים הקיימים, מקליט היברידי, והחלפת אינטרקום ישן.</p><em>להצעת מחיר</em></a>
        </div>
      </section>

      {equipment.length > 0 && (
        <section aria-labelledby="equipment">
          <div className={styles.sectionHead}>
            <h2 id="equipment">הציוד שאנחנו מתקינים</h2>
            <p>אלה הדגמים שאנחנו מתקינים הכי הרבה. המחיר הוא של הציוד בלבד, כמו בחנות. ההתקנה נכנסת להצעת המחיר.</p>
          </div>
          <div className={styles.shelf}>
            {equipment.map((p) => (
              <Link key={p.slug} href={`/store/${p.slug}`}>
                <span className={styles.tile}>{p.image && <img src={p.image} alt={productName(p)} loading="lazy" />}</span>
                <b>{productName(p)}</b>
                <small>{nis(p.price as number)} ₪ לציוד</small>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="how">
        <div className={styles.sectionHead}><h2 id="how">איך זה עובד</h2></div>
        <div className={styles.ways}>
          <div className={styles.way}><i>1</i><b>מספרים לנו מה צריך</b><p>בטופס או בווצאפ: איפה, כמה נקודות, ומה יש היום. תמונה של המקום עוזרת מאוד.</p></div>
          <div className={styles.way}><i>2</i><b>מקבלים הצעת מחיר</b><p>מחיר הציוד כמו בחנות, והתקנה בהצעה נפרדת אחרי שבודקים זמינות באזור ובדרך כלל גם את המקום. עם הסבר למה בחרנו כל רכיב. בלי להעמיס מה שלא צריך.</p></div>
          <div className={styles.way}><i>3</i><b>מתקינים ומגדירים</b><p>התקנה, חיווט, הגדרת המקליט והאפליקציה, והדרכה קצרה בסוף.</p></div>
        </div>
      </section>

      <section id="pricing" aria-labelledby="pricing-title">
        <div className={styles.sectionHead}>
          <h2 id="pricing-title">איך בנויה הצעת מחיר להתקנה</h2>
          <p>אין מחיר אחד לכולם, כי כל מקום שונה. אלה ארבעת הרכיבים של כל הצעה:</p>
        </div>
        <div className={styles.why}>
          <div><b>ציוד</b><p>במחיר של החנות באתר. אפשר לבדוק כל דגם לפני שמחליטים.</p></div>
          <div><b>עבודה</b><p>לפי מספר הנקודות, הגובה והמרחק מהמקליט, ולפי מה שכבר קיים במקום.</p></div>
          <div><b>חומרים</b><p>כבלים, תעלות, קופסאות ומתאמים, לפי אורך החיווט בפועל.</p></div>
          <div><b>הגדרה והדרכה</b><p>הגדרת המקליט והאפליקציה בנייד של כל מי שצריך, והסבר קצר בסוף. כלולות.</p></div>
        </div>
      </section>

      <section aria-labelledby="faq">
        <div className={styles.sectionHead}><h2 id="faq">שאלות נפוצות על התקנה</h2></div>
        <div className={styles.faq}>
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.closing} data-track="installation_closing">
        <h2>מוכנים להצעת מחיר?</h2>
        <p>הכי מהיר: תמונה של המקום בווצאפ עם כמה מילים על מה שצריך.</p>
        <div className={styles.ctas}>
          <a className={`${styles.cta} ${styles.ctaWa}`} href={wa} target="_blank" rel="noopener noreferrer">לכתוב בווצאפ</a>
          <a className={`${styles.cta} ${styles.ctaGhost}`} href="#quote">לטופס הקצר</a>
        </div>
      </section>
    </main>
  );
}
