import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { WHATSAPP_NUMBER } from "../data/store-catalog";
import styles from "../home.module.css";

export const metadata: Metadata = {
  title: "הצהרת נגישות | Site-Control",
  description: "מה עשינו כדי שהאתר של Site-Control יהיה נגיש, מה עדיין לא מושלם, ואיך פונים אלינו בבעיית נגישות.",
  alternates: { canonical: "/accessibility" },
};

const UPDATED = "24.9.2026";

const h2 = { fontSize: "1.3rem", color: "var(--text-bright)", marginBottom: "0.6rem" } as const;
const p = { color: "var(--muted)", lineHeight: 1.8, maxWidth: "75ch" } as const;
const ul = { ...p, paddingInlineStart: "1.2rem", display: "grid", gap: "0.35rem" } as const;

export default function AccessibilityPage() {
  const items = [{ name: "הצהרת נגישות", url: "/accessibility" }];
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי, נתקלתי בבעיית נגישות באתר")}`;
  return (
    <main className={styles.wrap} style={{ gap: "2rem" }}>
      <BreadcrumbSchema items={items} />
      <Breadcrumb items={items} />

      <section className={styles.heroText}>
        <span className={styles.kicker}>עודכן לאחרונה: {UPDATED}</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.4rem)", color: "var(--text-bright)" }}>הצהרת נגישות</h1>
        <p style={p}>
          חשוב לנו שכל אחד יוכל לבחור ולהזמין מצלמות, לקבל ייעוץ ולפנות אלינו, גם עם מוגבלות. אנחנו פועלים להתאים את האתר
          לתקן הישראלי ת&quot;י 5568, המבוסס על הנחיות WCAG 2.0 ברמה AA, לפי תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013.
        </p>
      </section>

      <section>
        <h2 style={h2}>מה עשינו באתר</h2>
        <ul style={ul}>
          <li>האתר מוגדר בעברית ובכיוון מימין לשמאל, כך שקוראי מסך מקריאים אותו נכון.</li>
          <li>מבנה כותרות היררכי, ופירורי לחם (breadcrumbs) בכל דף.</li>
          <li>כפתורי וואטסאפ, טלפון ועגלה עם תוויות לקוראי מסך.</li>
          <li>שדות הטפסים מסומנים בתוויות, ומספרי טלפון מוגדרים כך שבנייד נפתחת מקלדת מספרים.</li>
          <li>טקסט חלופי לתמונות המוצרים ולתמונות התוכן.</li>
          <li>אפשר להגדיל את התצוגה עד פי 5 בנייד בלי שהדף נשבר, והאתר מותאם למסכים בכל גודל.</li>
          <li>ניווט במקלדת (Tab) בתפריט, בטפסים ובכפתורים.</li>
        </ul>
      </section>

      <section>
        <h2 style={h2}>מה עדיין לא מושלם</h2>
        <p style={p}>
          אנחנו ממשיכים לבדוק ולתקן. ייתכן שתמצאו חלקים שעדיין לא נגישים במלואם, בעיקר:
        </p>
        <ul style={ul}>
          <li>פוסטים ישנים בבלוג, ותמונות עם טקסט (אינפוגרפיקות) שאין להן תיאור מלא.</li>
          <li>תמונות ומפרטים שמגיעים מהיבואנים, וקבצים חיצוניים כמו מדריכי יצרן.</li>
          <li>ניגודיות צבעים בחלק מהטקסטים המשניים על הרקע הכהה.</li>
        </ul>
        <p style={{ ...p, marginTop: "0.6rem" }}>
          אם משהו באתר לא עובד בשבילכם, אפשר תמיד לקבל את אותו שירות בטלפון או בוואטסאפ: ייעוץ, מחיר והזמנה.
        </p>
      </section>

      <section>
        <h2 style={h2}>שירות מחוץ לאתר</h2>
        <p style={p}>
          השירות ניתן בעיקר בטלפון, בוואטסאפ ובאתר. אין לנו חנות פתוחה לקהל, ואיסוף עצמי והתקנות נעשים בתיאום מראש.
          אם אתם צריכים התאמה כלשהי בשירות, כתבו לנו ונתאים את עצמנו.
        </p>
      </section>

      <section>
        <h2 style={h2}>פנייה בנושא נגישות</h2>
        <p style={p}>נתקלתם בבעיה? נשמח לדעת, ונחזור אליכם תוך 7 ימי עבודה. כדאי לציין באיזה דף זה קרה ואיזה דפדפן או טכנולוגיה מסייעת שימשו אתכם.</p>
        <ul style={ul}>
          <li>טלפון: <a href="tel:+972502256866">050-2256866</a></li>
          <li>וואטסאפ: <a href={wa} target="_blank" rel="noopener noreferrer">לשליחת הודעה</a></li>
          <li>אימייל: <a href="mailto:info@site-control-il.com">info@site-control-il.com</a></li>
        </ul>
        <p style={{ ...p, marginTop: "0.6rem" }}>
          ראו גם את <Link href="/privacy">מדיניות הפרטיות</Link>.
        </p>
      </section>
    </main>
  );
}
