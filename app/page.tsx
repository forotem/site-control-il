import type { Metadata } from "next";
import Link from "next/link";
import { storeProducts, storeCategories, WHATSAPP_NUMBER, WARRANTY_TEXT } from "./data/store-catalog";
import { ProductCard } from "./store/ProductCard";
import { BlogList } from "./components/BlogList";
import { LocalBusinessSchema, OrganizationSchema, WebSiteSchema } from "./components/Schema";
import { BASE_URL } from "./config";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: "מצלמות אבטחה, מקליטים ואינטרקום | חנות והתקנה | Site-Control",
  description:
    "חנות מצלמות אבטחה עם צוות שגם מתקין: Hikvision, Uniview, Reolink ו-VisionNet מהמלאי של היבואן. מצלמות IP, מקליטים, אינטרקום וסולארי 4G. אחריות שנה.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "מצלמות אבטחה, מקליטים ואינטרקום | Site-Control",
    description: "חנות מצלמות אבטחה עם צוות שגם מתקין. מלאי בישראל, אחריות שנה, ייעוץ לפני הקנייה.",
    type: "website",
    locale: "he_IL",
    siteName: "Site-Control",
  },
};

const bySlug = (slug: string) => storeProducts.find((p) => p.slug === slug)!;

// מוצר מייצג לכל קטגוריה, לתמונת האריח
const catImage: Record<string, string> = {
  ip: "ds-2cd2t47g2h-li-2-8mm",
  kits: "reolink-rlk8-810b4-a-rlk8-800b4",
  recorders: "ds-7616nxi-k2",
  intercom: "ds-kis607-s",
  wifi: "ch10",
  analog: "ds-2ce12kf0t-lfs-2-8mm",
};

// המותגים שאנחנו עובדים איתם: לוגו רשמי בלבן על אריח כהה בשפה של האתר
const brands = [
  { key: "hikvision", name: "Hikvision", line: "מצלמות IP, מקליטים ואינטרקום", href: "/store#ip" },
  { key: "uniview", name: "Uniview", line: "מצלמות IP ומקליטים במחיר חכם", href: "/store#ip" },
  { key: "reolink", name: "Reolink", line: "ערכות מוכנות ומצלמות סולאריות 4G", href: "/store#kits" },
  { key: "visionnet", name: "VisionNet", line: "אינטרקום 2 גידים וקודנים", href: "/store#intercom" },
  { key: "tenda", name: "Tenda", line: "מצלמות Wi-Fi לבית", href: "/store#wifi" },
  { key: "hiwatch", name: "HiWatch by Hikvision", line: "מצלמות 4K במחיר נגיש", href: "/store#ip" },
];
const popular = ["ds-2cd1043g2-liu-2-8mm", "ipc2124lb-af28k-dl2", "ds-2cd2t47g2h-li-2-8mm", "reolink-rlk8-410b4-5mp", "nvr301-08s3", "ds-kis607-s", "cp3-pro", "ds-2ce10kf0t-lpfs-2-8mm"];

const faq = [
  { q: "אתם חנות או חברת התקנות?", a: "שניהם. הצוות שלנו מתקין מצלמות בבתים, בעסקים ובאתרי בנייה, ואת אותו ציוד אנחנו מוכרים גם באתר. אפשר לקנות לבד ולהתקין עם החשמלאי שלכם, או להזמין אותנו." },
  { q: "המוצרים במלאי?", a: "המוצרים מגיעים מהמלאי של היבואן בישראל. לפני חיוב אנחנו מאשרים זמינות ומועד אספקה בווצאפ או בטלפון, כך שאף אחד לא משלם על מוצר שאין במלאי." },
  { q: "איך אני יודע איזו מצלמה מתאימה לי?", a: "בחנות יש שאלון קצר של חמש שאלות שמצמצם את הבחירה לשניים-שלושה דגמים עם הסבר. יש גם עוזר AI שמכיר את כל המוצרים, ותמיד אפשר לכתוב לנו בווצאפ." },
  { q: "מה עם אחריות ושירות?", a: `${WARRANTY_TEXT}. תקלה בתקופת האחריות מטופלת מולנו, לא מול היבואן. אחרי ההתקנה יש תמיכה טלפונית להגדרות האפליקציה.` },
  { q: "יש הנחה לקבלנים ולכמויות?", a: "כן. מ-5 יחידות מאותו מוצר או הזמנה מעל 5,000 ₪ אנחנו מכינים הצעת מחיר עם הנחת כמות במקום המחיר באתר. אפשר להרכיב עגלה באתר ולסמן שזו הזמנה לקבלן." },
  { q: "ומה עם אתר בנייה בלי חשמל?", a: "לזה יש לנו את המצלמות הסולאריות 4G של Reolink: מצלמה עם סוללה ופאנל סולארי, סים 4G והקלטה לענן. מתקינים על עמוד או פיגום ביום אחד." },
];

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי, אשמח לייעוץ לגבי מצלמות אבטחה")}`;

  return (
    <>
      <WebSiteSchema />
      <LocalBusinessSchema />
      <OrganizationSchema />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className={styles.wrap}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <span className={styles.kicker}>חנות מצלמות אבטחה עם צוות שגם מתקין</span>
            <h1>מצלמות אבטחה, מקליטים ואינטרקום. במחיר של חנות אונליין, עם מי שיודע מה מתאים לכם.</h1>
            <p>
              Hikvision, Uniview, Reolink, VisionNet ו-Tenda מהמלאי של היבואן בישראל. אותם מוצרים שאנחנו מתקינים בבתים, בעסקים ובאתרי בנייה,
              עם הסבר פשוט למה לבחור דגם אחד ולא אחר. קונים לבד, או מזמינים אותנו להתקין.
            </p>
            <div className={styles.ctas}>
              <Link className={`${styles.cta} ${styles.ctaAccent}`} href="/store">לחנות</Link>
              <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/store/finder">עזרו לי לבחור, 5 שאלות</Link>
            </div>
            <div className={styles.trust}>
              <span>{WARRANTY_TEXT}</span>
              <span>זמינות מאושרת לפני חיוב</span>
              <span>משלוח, איסוף עצמי או התקנה</span>
            </div>
          </div>
          <div className={styles.brands} aria-label="המותגים שאנחנו עובדים איתם">
            {brands.map((b) => (
              <Link key={b.key} href={b.href} className={styles.brand} prefetch={false}>
                <span className={styles.brandTile}><img src={`/brand-logos/${b.key}.png`} alt={b.name} loading="eager" /></span>
                <b>{b.name}</b>
                <small>{b.line}</small>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="cats">
          <div className={styles.sectionHead}>
            <h2 id="cats">מה מחפשים?</h2>
            <p>שש קטגוריות, ובכל אחת הסבר קצר איך בוחרים נכון והשוואה בין הדגמים.</p>
          </div>
          <div className={styles.cats}>
            {storeCategories.map((c) => {
              const n = storeProducts.filter((p) => p.category === c.id).length;
              const img = bySlug(catImage[c.id])?.image;
              return (
                <Link key={c.id} href={`/store#${c.id}`} className={styles.cat}>
                  <span className={styles.tile}>{img && <img src={img} alt="" loading="lazy" />}</span>
                  <span>
                    <b>{c.name}</b>
                    <span>{c.blurb}</span>
                    <small>{n} מוצרים</small>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="ways">
          <div className={styles.sectionHead}>
            <h2 id="ways">שלוש דרכים להגיע למוצר הנכון</h2>
          </div>
          <div className={styles.ways}>
            <Link href="/store/finder" className={styles.way}>
              <i>1</i>
              <b>שאלון של חמש שאלות</b>
              <p>מה מאבטחים, מה כבר קיים, כמה נקודות, מה חשוב ומה התקציב. בסוף המלצה עם הסבר, מחיר משוער וחלופות.</p>
              <em>להתחיל</em>
            </Link>
            <Link href="/store" className={styles.way}>
              <i>2</i>
              <b>לעבור על הקטלוג לבד</b>
              <p>כל מוצר עם שבבי מפרט שמבדילים אותו מהשכנים, שורת "מתאים ל", והשוואה מול הדגם הזול והיקר הבא.</p>
              <em>לחנות</em>
            </Link>
            <a href={wa} className={styles.way} target="_blank" rel="noopener noreferrer">
              <i>3</i>
              <b>לדבר עם בן אדם</b>
              <p>שולחים לנו בווצאפ תמונה של המקום או של המערכת הקיימת, ומקבלים המלצה ומחיר. בלי התחייבות.</p>
              <em>ווצאפ</em>
            </a>
          </div>
        </section>

        <section aria-labelledby="popular">
          <div className={styles.sectionHead}>
            <h2 id="popular">הדגמים שאנחנו מתקינים הכי הרבה</h2>
            <p>לא בהכרח היקרים ביותר. אלה שנותנים את התמורה הטובה ביותר לבית, לחנות ולמשרד.</p>
          </div>
          <div className={styles.grid}>{popular.map((s) => <ProductCard key={s} p={bySlug(s)} />)}</div>
          <div className={styles.more}><Link className={`${styles.cta} ${styles.ctaGhost}`} href="/store">לכל {storeProducts.length} המוצרים</Link></div>
        </section>

        <section className={styles.solar} aria-labelledby="solar">
          <div className={styles.solarText}>
            <h2 id="solar">אין חשמל ואינטרנט במקום? יש מצלמות סולאריות 4G.</h2>
            <p>
              אתרי בנייה, שטחים חקלאיים, מחסנים מרוחקים ומגרשים: מצלמת Reolink עם סוללה ופאנל סולארי, סים 4G והקלטה לענן.
              מתקינים על עמוד או פיגום ביום אחד, ורואים הכל מהנייד.
            </p>
            <div className={styles.ctas}>
              <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/packages">חבילות ומחירים לאתרים</Link>
              <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/locations">לפי אזור בארץ</Link>
            </div>
          </div>
          <div className={styles.solarCards}>
            <Link href="/products/go" className={styles.solarCard}>
              <span className={styles.tile}><img src="/optimized-variants/2 סוגי המצלמה/reolink-go-plus-security-camera.optimized-w1080.webp" alt="Reolink GO Plus 4G" loading="lazy" /></span>
              <b>Reolink GO Plus 4G</b>
              <span>נקודה קבועה: כניסה לאתר, מכולה, ציוד. 4K, ראיית לילה צבעונית.</span>
            </Link>
            <Link href="/products/ptz" className={styles.solarCard}>
              <span className={styles.tile}><img src="/optimized-variants/2 סוגי המצלמה/reolink-ptz-solar-security-camera-with-solar-panel.optimized-w1080.webp" alt="Reolink PTZ Solar 4G" loading="lazy" /></span>
              <b>Reolink PTZ Solar 4G</b>
              <span>שטח גדול: מצלמה מסתובבת עם זום וסריקה אוטומטית.</span>
            </Link>
          </div>
        </section>

        <section aria-labelledby="why">
          <div className={styles.sectionHead}>
            <h2 id="why">למה לקנות אצל מתקינים ולא בחנות רגילה</h2>
          </div>
          <div className={styles.why}>
            <div><b>אנחנו חיים עם המוצרים האלה</b><p>הדגמים באתר הם אלה שאנחנו מתקינים בפועל. כשמשהו לא עובד טוב בשטח, הוא לא נכנס לחנות.</p></div>
            <div><b>אין "שילמת יותר כי לא ידעת"</b><p>שאלון התאמה, השוואות ומדריכי בחירה בכל קטגוריה, ועוזר AI שמכיר את כל המפרטים. גם לפני שדיברנו.</p></div>
            <div><b>אחריות שמטופלת מולנו</b><p>{WARRANTY_TEXT}. תקלה? פונים אלינו, לא ליבואן. ואחרי ההתקנה יש למי להתקשר בהגדרות האפליקציה.</p></div>
            <div><b>מלאי בישראל, בלי הפתעות</b><p>אישור זמינות לפני חיוב, משלוח או איסוף עצמי, ומחיר שמתחרה בכל חנות אונליין.</p></div>
          </div>
        </section>

        <section aria-labelledby="faq">
          <div className={styles.sectionHead}><h2 id="faq">שאלות נפוצות</h2></div>
          <div className={styles.faq}>
            {faq.map((f) => (
              <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </section>

        <BlogList />

        <section className={styles.closing}>
          <h2>לא בטוחים מאיפה להתחיל?</h2>
          <p>שלחו לנו בווצאפ תמונה של הכניסה, החצר או המערכת הקיימת. נחזור עם המלצה ומחיר, בלי התחייבות.</p>
          <div className={styles.ctas}>
            <a className={`${styles.cta} ${styles.ctaWa}`} href={wa} target="_blank" rel="noopener noreferrer">לכתוב בווצאפ</a>
            <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/contact">להשאיר פרטים</Link>
          </div>
        </section>
      </main>
    </>
  );
}
