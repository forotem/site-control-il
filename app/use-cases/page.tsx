import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import styles from "../home.module.css";

export const metadata: Metadata = {
  title: "תחומי שימוש: מצלמות סולאריות 4G לאתרים בלי חשמל | Site-Control",
  description: "אתרי בנייה, שטחים חקלאיים ואתרים מבודדים: מה מתאים לכל אחד, ומתי עדיף מערכת קווית מהחנות. מדריכי שימוש של Site-Control.",
  alternates: { canonical: "/use-cases" },
};

const cases = [
  { href: "/use-cases/construction", title: "אתרי בנייה", desc: "הגנה על ציוד ומכולות, התראות בלילה, התקנה על עמוד או פיגום ביום אחד." },
  { href: "/use-cases/agriculture", title: "חקלאות ומשקים", desc: "שדות, מטעים, חממות ומחסני ציוד בלי חשמל ואינטרנט, עם סים 4G ופאנל סולארי." },
  { href: "/use-cases/remote", title: "אתרים מבודדים", desc: "מחסנים, מגרשים ומתקנים מרוחקים: ניטור מהנייד וגיבוי ענן." },
];

export default function UseCasesPage() {
  const items = [{ name: "תחומי שימוש", url: "/use-cases" }];
  return (
    <main className={styles.wrap}>
      <BreadcrumbSchema items={items} />
      <Breadcrumb items={items} />
      <section className={styles.heroText}>
        <span className={styles.kicker}>מצלמות סולאריות 4G</span>
        <h1 style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)", lineHeight: 1.18, color: "var(--text-bright)" }}>איפה מצלמה סולארית 4G היא הפתרון הנכון</h1>
        <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "62ch" }}>
          כשאין חשמל ואינטרנט קבועים, מצלמה קווית לא רלוונטית. בשלושת התחומים האלה אנחנו מתקינים מצלמות Reolink סולאריות עם סים 4G.
          יש חשמל במקום? אז מערכת קווית מהחנות תעלה פחות לאורך זמן. <Link href="/store">לחנות</Link>.
        </p>
      </section>
      <section className={styles.ways}>
        {cases.map((c, i) => (
          <Link key={c.href} href={c.href} className={styles.way}>
            <i>{i + 1}</i>
            <b>{c.title}</b>
            <p>{c.desc}</p>
            <em>לקריאה</em>
          </Link>
        ))}
      </section>
      <section className={styles.closing}>
        <h2>לא בטוחים איזה פתרון מתאים?</h2>
        <p>חבילות ומחירים למצלמות הסולאריות, או שאלון קצר לכל השאר.</p>
        <div className={styles.ctas}>
          <Link className={`${styles.cta} ${styles.ctaAccent}`} href="/packages">חבילות סולאריות 4G</Link>
          <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/store/finder">שאלון: מה מתאים לי</Link>
        </div>
      </section>
    </main>
  );
}
