import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { WHATSAPP_NUMBER, WARRANTY_TEXT } from "../data/store-catalog";
import styles from "../home.module.css";

export const metadata: Metadata = {
  title: "אודות Site-Control | מתקינים ומוכרים מצלמות אבטחה",
  description:
    "Site-Control: חברת התקנות של מצלמות אבטחה, מקליטים, אינטרקום ובקרת כניסה, שמוכרת את אותו ציוד גם אונליין מהמלאי של היבואן בישראל.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "אודות Site-Control",
    description: "מתקינים ומוכרים מצלמות אבטחה. מלאי בישראל, אחריות שנה, ייעוץ לפני הקנייה.",
    type: "website",
    locale: "he_IL",
  },
};

export default function AboutPage() {
  const items = [{ name: "אודות", url: "/about" }];
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי, הגעתי מעמוד האודות ויש לי שאלה")}`;
  return (
    <main className={styles.wrap}>
      <BreadcrumbSchema items={items} />
      <Breadcrumb items={items} />

      <section className={styles.heroText}>
        <span className={styles.kicker}>אודות</span>
        <h1 style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)", lineHeight: 1.18, color: "var(--text-bright)" }}>
          התחלנו כמתקינים. החנות נולדה מהשאלות של הלקוחות.
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.08rem", lineHeight: 1.75, maxWidth: "65ch" }}>
          Site-Control מתקינה מצלמות אבטחה בבתים פרטיים, בעסקים, בבניינים משותפים ובאתרי בנייה. כמעט כל לקוח שאל אותנו את אותה שאלה:
          "כל המצלמות נראות אותו דבר, מה ההבדל?" החנות באתר היא התשובה: אותם מוצרים שאנחנו מתקינים, במחיר של חנות אונליין,
          עם ההסבר שהיינו נותנים בשיחה.
        </p>
      </section>

      <section aria-labelledby="what">
        <div className={styles.sectionHead}><h2 id="what">מה אנחנו עושים</h2></div>
        <div className={styles.why}>
          <div><b>התקנה</b><p>מערכות מצלמות IP ואנלוגיות, מקליטים, אינטרקום 2 גידים ו-IP, בקרת כניסה וזיהוי פנים. תכנון, חיווט, הגדרת אפליקציה והדרכה.</p></div>
          <div><b>חנות</b><p>מצלמות של Hikvision, Uniview, Reolink, VisionNet ו-Tenda מהמלאי של היבואן בישראל. משלוח, איסוף עצמי או התקנה על ידינו. <Link href="/store">לחנות</Link>.</p></div>
          <div><b>אתרים בלי חשמל</b><p>לאתרי בנייה, חקלאות ושטחים מרוחקים: מצלמות סוללה של Reolink עם סים 4G ופאנל סולארי, <Link href="/store#solar">בחנות עם מחיר</Link>, והתקנה על ידינו לפי הצעת מחיר.</p></div>
          <div><b>ייעוץ לפני הקנייה</b><p>שאלון התאמה, מדריכי בחירה, השוואות ועוזר AI שמכיר את כל המפרטים. ומי שרוצה, מדבר איתנו בווצאפ.</p></div>
        </div>
      </section>

      <section aria-labelledby="how">
        <div className={styles.sectionHead}><h2 id="how">איך זה עובד כשקונים אצלנו</h2></div>
        <div className={styles.ways}>
          <div className={styles.way}><i>1</i><b>בוחרים</b><p>לבד בקטלוג, עם השאלון, או בשיחה איתנו. ממליצים רק על מה שמתאים, לא על היקר ביותר.</p></div>
          <div className={styles.way}><i>2</i><b>מאשרים זמינות</b><p>לפני כל חיוב אנחנו בודקים מלאי ומועד אספקה מול היבואן וחוזרים אליכם. אף אחד לא משלם על מוצר שאין.</p></div>
          <div className={styles.way}><i>3</i><b>מקבלים</b><p>משלוח עד הבית, איסוף עצמי בתיאום, או התקנה על ידי הצוות שלנו לפי הצעת מחיר. {WARRANTY_TEXT}.</p></div>
        </div>
      </section>

      <section className={styles.closing}>
        <h2>יש שאלה שלא כתובה כאן?</h2>
        <p>ווצאפ הוא הדרך הכי מהירה. אפשר גם להשאיר פרטים ונחזור בטלפון.</p>
        <div className={styles.ctas}>
          <a className={`${styles.cta} ${styles.ctaWa}`} href={wa} target="_blank" rel="noopener noreferrer">לכתוב בווצאפ</a>
          <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/contact">להשאיר פרטים</Link>
        </div>
      </section>
    </main>
  );
}
