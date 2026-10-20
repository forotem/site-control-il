import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import styles from "../home.module.css";

// דף המשרה (פורסם 14.10.2026, גיוס רכז/ת מכירות ותפעול לקריית שמונה). רותם 20.10.2026: "אין צורך בגיוס, אני סגרתי עם רלי".
// המשרה אוישה: בלי סכמת JobPosting (גוגל מוריד מודעת משרה שאינה פעילה), noindex, לא במפת האתר ולא בפוטר.
// הדף נשאר כדי שמי שמגיע מקישור ישן או מהמודעה יראה שהמשרה אוישה ולא 404. בלי כפתור צף ובלי טל (FloatingCTA, StoreChat).

const TITLE = "רכז/ת מכירות ותפעול";

export const metadata: Metadata = {
  title: `המשרה אוישה: ${TITLE} | Site-Control`,
  description: "משרת רכז/ת מכירות ותפעול בקריית שמונה אוישה. תודה לכל מי שפנה.",
  alternates: { canonical: "/jobs" },
  robots: { index: false, follow: true },
};

const p = { color: "var(--muted)", lineHeight: 1.8, maxWidth: "75ch" } as const;

export default function JobsPage() {
  const items = [{ name: "דרושים", url: "/jobs" }];
  return (
    <main className={styles.wrap} style={{ gap: "2rem" }}>
      <BreadcrumbSchema items={items} />
      <Breadcrumb items={items} />

      <section className={styles.heroText}>
        <span className={styles.kicker}>דרושים</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.4rem)", color: "var(--text-bright)" }}>המשרה אוישה</h1>
        <p style={{ ...p, color: "var(--text-bright)", fontWeight: 600, fontSize: "1.1rem" }}>
          משרת {TITLE} בקריית שמונה אוישה. תודה רבה לכל מי שפנה והגיש מועמדות.
        </p>
        <p style={p}>כשנגייס שוב, המשרות יפורסמו כאן.</p>
      </section>

      <section className={styles.closing}>
        <h2>מחפשים מצלמות אבטחה?</h2>
        <p>בחנות יש מצלמות, ערכות ואינטרקום, עם מחירים ומפרט מלא.</p>
        <div className={styles.ctas}>
          <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/store">לחנות</Link>
          <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/about">מי אנחנו</Link>
        </div>
      </section>
    </main>
  );
}
