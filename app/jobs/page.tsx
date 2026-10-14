import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { WHATSAPP_NUMBER } from "../data/store-catalog";
import { BUSINESS } from "../data/business";
import styles from "../home.module.css";

// דף משרה (רותם 14.10.2026): גיוס רכז/ת מכירות ותפעול למשרד בקריית שמונה. כל קמפייני הגיוס מפנים לכאן,
// וסכמת JobPosting מאפשרת לגוגל להציג את המשרה בחיפוש. מועמדויות בווצאפ לטלפון של רותם.
// הטקסט שבקישור הווצאפ לא נמצא ב-site-wa-prefills.ts בכוונה: מועמד/ת הוא לא ליד, טל לא עונה לו וקליטת הלידים לא רושמת אותו.
// הכפתור הצף מוסתר בדף הזה (FloatingCTA), והלחיצות נמדדות כ-job_apply ולא כהמרת מכירה (SiteTracking).
// חוק שוויון ההזדמנויות בעבודה: ניסוח לשני המינים, בלי דרישת גיל או מגדר.

const TITLE = "רכז/ת מכירות ותפעול";
const POSTED = "2026-10-14";
const VALID_THROUGH = "2026-12-31";

export const metadata: Metadata = {
  title: `דרושים: ${TITLE} בקריית שמונה | Site-Control`,
  description: "Site-Control מגייסת רכז/ת מכירות ותפעול למשרד בקריית שמונה: מכירות, תיאום התקנות ואנשי שטח, הזמנות מול ספקים ועבודה מסודרת בטבלאות. משרה מלאה, שכר בסיס ובונוסים, התחלה מיידית.",
  alternates: { canonical: "/jobs" },
  robots: { index: true, follow: true },
  openGraph: { images: [{ url: "/images/jobs/hiring-feed-4x5.png", width: 1080, height: 1350, alt: "דרושים: רכז/ת מכירות ותפעול בקריית שמונה" }] },
};

const h2 = { fontSize: "1.3rem", color: "var(--text-bright)", marginBottom: "0.6rem" } as const;
const p = { color: "var(--muted)", lineHeight: 1.8, maxWidth: "75ch" } as const;
const ul = { ...p, paddingInlineStart: "1.2rem", display: "grid", gap: "0.35rem" } as const;

const DUTIES = [
  "מכירות ומענה ללקוחות, בווצאפ ובטלפון",
  "תכלול: לראות את התוכנית קדימה, לתכנן ולתאם התקנות עם המתקינים ואנשי השטח",
  "הזמנות, מלאי ומחירים מול הספקים",
  "עבודה מסודרת בטבלאות: אקסל ו-monday, הזנת נתונים ומעקב",
  "עבודה עם אפליקציות המצלמות (Reolink ועוד). את זה לומדים אצלנו",
];
const REQUIREMENTS = [
  "ראש גדול: מבין/ה מהר, חושב/ת קדימה ואוהב/ת לסגור קצוות",
  "מסודר/ת, עם שליטה טובה במחשב, באינטרנט ובאפליקציות",
  "רישיון נהיגה: חובה",
  "גר/ה באזור קריית שמונה והגליל העליון, או יכול/ה להגיע למשרד כל יום",
  "ניסיון במכירות או בתפעול: יתרון",
];
const OFFER = [
  "שכר בסיס ובונוסים על הצלחות ומכירות",
  "משרה לטווח ארוך, עם אפשרות לגדול יחד עם העסק",
  "חפיפה מלאה: בהתחלה עבודה צמודה אלינו",
  "רכב חברה לנסיעות עבודה, כשצריך",
];

export default function JobsPage() {
  const items = [{ name: "דרושים", url: "/jobs" }];
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`שלום, אני רוצה להגיש מועמדות למשרת ${TITLE} בקריית שמונה.\nשם: \nאיפה אני גר/ה: \nקצת עליי: `)}`;
  const li = (s: string) => `<li>${s}</li>`;
  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: TITLE,
    description: `<p>${BUSINESS.brand} מוכרת ומתקינה מצלמות אבטחה וטכנולוגיה לאתרים, ומגייסת ${TITLE} למשרד בקריית שמונה. העבודה פיזית במשרד.</p>`
      + `<p><b>התפקיד:</b></p><ul>${DUTIES.map(li).join("")}</ul>`
      + `<p><b>דרישות:</b></p><ul>${REQUIREMENTS.map(li).join("")}</ul>`
      + `<p><b>מה מציעים:</b></p><ul>${OFFER.map(li).join("")}</ul>`
      + `<p>משרה מלאה, התחלה מיידית. מועמדות בווצאפ: ${BUSINESS.phoneDisplay}. המשרה מיועדת לנשים ולגברים כאחד.</p>`,
    identifier: { "@type": "PropertyValue", name: BUSINESS.brand, value: "SC-JOB-2026-10" },
    datePosted: POSTED,
    validThrough: `${VALID_THROUGH}T23:59:00+02:00`,
    employmentType: "FULL_TIME",
    directApply: false,
    hiringOrganization: { "@type": "Organization", name: BUSINESS.brand, sameAs: "https://www.site-control-il.com" },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: "קריית שמונה", addressRegion: "מחוז הצפון", addressCountry: "IL" },
    },
  };
  const box = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "1.2rem 1.4rem" } as const;
  return (
    <main className={styles.wrap} style={{ gap: "2rem" }}>
      <BreadcrumbSchema items={items} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} />
      <Breadcrumb items={items} />

      <section className={styles.heroText}>
        <span className={styles.kicker}>דרושים · משרה מלאה · התחלה מיידית</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.4rem)", color: "var(--text-bright)" }}>{TITLE}</h1>
        <p style={{ ...p, color: "var(--text-bright)", fontWeight: 600, fontSize: "1.1rem" }}>
          אנחנו מוכרים ומתקינים מצלמות אבטחה וטכנולוגיה לאתרים, ומחפשים מישהו/י עם ראש גדול שיחזיק איתנו את העסק: מכירות, תיאום ותכנון קדימה.
        </p>
        <div style={{ ...box, borderColor: "rgba(255, 215, 0, 0.35)" }}>
          <b style={{ color: "var(--gold)" }}>📍 העבודה פיזית במשרד שלנו בקריית שמונה, בגליל העליון.</b>
          <p style={{ ...p, margin: "0.4rem 0 0" }}>זו לא משרה מהבית. בהתחלה עובדים צמוד אלינו, עם חפיפה מלאה, ואחר כך במשרד בקריית שמונה.</p>
        </div>
      </section>

      <section>
        <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>מה עושים בתפקיד</h2></div>
        <ul style={ul}>{DUTIES.map((d) => <li key={d}>{d}</li>)}</ul>
        <p style={{ ...p, marginTop: "0.6rem" }}>העבודה בעיקר משרדית. אנשי השטח והמתקינים נוסעים, ואת/ה מתכלל/ת אותם מהמשרד.</p>
      </section>

      <section>
        <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>את מי אנחנו מחפשים</h2></div>
        <ul style={ul}>{REQUIREMENTS.map((d) => <li key={d}>{d}</li>)}</ul>
      </section>

      <section>
        <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>מה אנחנו מציעים</h2></div>
        <ul style={ul}>{OFFER.map((d) => <li key={d}>{d}</li>)}</ul>
        <p style={{ ...p, marginTop: "0.6rem" }}>משרה מלאה. המשרה מיועדת לנשים ולגברים כאחד.</p>
      </section>

      <section>
        <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>איך מגישים מועמדות</h2></div>
        <div className={styles.ways}>
          <div className={styles.way}><i>1</i><b>שולחים הודעה בווצאפ</b><p>ל-{BUSINESS.phoneDisplay}, עם השם, איפה גרים וכמה מילים על עצמכם.</p></div>
          <div className={styles.way}><i>2</i><b>מצרפים קורות חיים</b><p>אם יש. אפשר לשלוח כקובץ או כתמונה באותה שיחה.</p></div>
          <div className={styles.way}><i>3</i><b>שיחה קצרה ופגישה</b><p>חוזרים למתאימים לשיחת היכרות, ואחריה פגישה.</p></div>
        </div>
      </section>

      <section className={styles.closing}>
        <h2>מתאים לך?</h2>
        <p>שלחו הודעה עכשיו. מתחילים מיד.</p>
        <div className={styles.ctas}>
          <a className={`${styles.cta} ${styles.ctaWa}`} href={wa} target="_blank" rel="noopener noreferrer">להגשת מועמדות בווצאפ</a>
          <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/about">מי אנחנו</Link>
        </div>
      </section>
    </main>
  );
}
