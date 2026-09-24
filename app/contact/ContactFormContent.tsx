import Link from "next/link";
import { InstallForm } from "../installation/InstallForm";
import { WHATSAPP_NUMBER, WARRANTY_TEXT } from "../data/store-catalog";
import { BUSINESS } from "../data/business";
import styles from "../home.module.css";

// דף יצירת קשר: טופס קצר (שם, טלפון, נושא; מייל לא חובה) שנשלח לצוות בווצאפ ובמייל דרך /api/lead,
// ולצידו כל דרכי הקשר ופרטי העסק. בלי הבטחות שאין מאחוריהן שירות (24/7, סיור חינם וכו').
export default function ContactFormContent() {
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי, הגעתי מדף יצירת הקשר")}`;
  const card = { padding: "1.4rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-accent)", background: "var(--glass-strong)", display: "grid", gap: "0.8rem" } as const;
  const info = { padding: "1.2rem", borderRadius: "var(--radius)", border: "1px solid var(--border)", background: "var(--card)", display: "grid", gap: "0.35rem" } as const;
  return (
    <main className={styles.wrap} data-lead-page="contact">
      <section className={styles.hero} data-track="contact">
        <div className={styles.heroText}>
          <span className={styles.kicker}>יצירת קשר</span>
          <h1>דברו איתנו</h1>
          <p>הצעת מחיר להתקנה, שאלה על מוצר מהחנות, או עזרה לבחור. הכי מהיר בווצאפ, ואפשר גם להשאיר פרטים ונחזור אליך.</p>
          <div className={styles.ctas}>
            <a className={`${styles.cta} ${styles.ctaWa}`} href={wa} target="_blank" rel="noopener noreferrer">לכתוב בווצאפ</a>
            <a className={`${styles.cta} ${styles.ctaGhost}`} href={`tel:${BUSINESS.phoneE164}`}>{BUSINESS.phoneDisplay}</a>
          </div>
          <div style={{ display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div style={info}><b style={{ color: "var(--text-bright)" }}>שעות מענה</b><span style={{ color: "var(--muted)" }}>{BUSINESS.hours}</span></div>
            <div style={info}><b style={{ color: "var(--text-bright)" }}>מייל</b><a href={`mailto:${BUSINESS.email}`} dir="ltr" style={{ color: "var(--link-color)" }}>{BUSINESS.email}</a></div>
            <div style={info}><b style={{ color: "var(--text-bright)" }}>התקנות</b><span style={{ color: "var(--muted)" }}>{BUSINESS.installAreaIn}. <Link href="/installation" style={{ color: "var(--link-color)" }}>על ההתקנה</Link></span></div>
            <div style={info}><b style={{ color: "var(--text-bright)" }}>משלוחים</b><span style={{ color: "var(--muted)" }}>לכל הארץ, או איסוף עצמי בתיאום. {WARRANTY_TEXT}.</span></div>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: 0 }}>
            Site-Control היא המותג של {BUSINESS.legalName}, עוסק מורשה {BUSINESS.licenseId}.
          </p>
        </div>
        <div id="quote" style={card}>
          <h2 style={{ fontSize: "1.35rem", color: "var(--text-bright)" }}>להשאיר פרטים</h2>
          <InstallForm variant="contact" />
        </div>
      </section>
    </main>
  );
}
