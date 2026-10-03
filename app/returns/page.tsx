import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { WHATSAPP_NUMBER, WARRANTY_TEXT } from "../data/store-catalog";
import { BUSINESS } from "../data/business";
import styles from "../home.module.css";

export const metadata: Metadata = {
  title: "החזרות וביטולים | Site-Control",
  description: "ביטול עסקה והחזרת מוצר תוך 14 יום מקבלתו, לפי חוק הגנת הצרכן: איך מבטלים, מה מחזירים, דמי ביטול והחזר כספי. מוצר פגום מוחלף או נאסף על חשבוננו.",
  alternates: { canonical: "/returns" },
  robots: { index: true, follow: true },
};

const UPDATED = "3.10.2026";

const h2 = { fontSize: "1.3rem", color: "var(--text-bright)", marginBottom: "0.6rem" } as const;
const p = { color: "var(--muted)", lineHeight: 1.8, maxWidth: "75ch" } as const;
const ul = { ...p, paddingInlineStart: "1.2rem", display: "grid", gap: "0.35rem" } as const;

export default function ReturnsPage() {
  const r = BUSINESS.returns;
  const items = [{ name: "החזרות וביטולים", url: "/returns" }];
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי, אני רוצה לבטל הזמנה / להחזיר מוצר.\nשם: \nתאריך ההזמנה: \nהמוצר: ")}`;
  const faq = [
    { q: "תוך כמה זמן אפשר להחזיר מוצר?", a: `תוך ${r.days} יום מיום שקיבלתם אותו. ${r.condition}` },
    { q: "כמה עולה לבטל?", a: `${r.feeRule}. ${r.returnShipping} מוצר שהגיע פגום או שונה ממה שהוזמן מוחזר בלי דמי ביטול.` },
    { q: "מתי מקבלים את הכסף בחזרה?", a: r.refund },
    { q: "איך מבטלים?", a: "שולחים לנו הודעה בווצאפ, במייל או בטלפון עם השם, תאריך ההזמנה והמוצר. אנחנו מאשרים את הביטול ומסבירים איך להחזיר." },
    { q: "הזמנתי ועוד לא שילמתי. צריך לבטל?", a: "כן, עדיף להודיע לנו. בחנות לא משלמים מראש: אנחנו מאשרים זמינות ומחיר משלוח ורק אז גובים, אז ביטול לפני התשלום הוא פשוט הודעה." },
  ];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <main className={styles.wrap} style={{ gap: "2rem" }}>
      <BreadcrumbSchema items={items} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumb items={items} />

      <section className={styles.heroText}>
        <span className={styles.kicker}>עודכן לאחרונה: {UPDATED}</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.4rem)", color: "var(--text-bright)" }}>החזרות וביטולים</h1>
        <p style={{ ...p, color: "var(--text-bright)", fontWeight: 600, fontSize: "1.1rem" }}>{r.summary}</p>
        <p style={p}>
          המדיניות כאן היא לפי חוק הגנת הצרכן לעסקת מכר מרחוק, והיא חלה על כל מה שקונים בחנות של Site-Control, שם מסחרי של {BUSINESS.legalName}, עוסק מורשה {BUSINESS.licenseId}.
          אם משהו לא ברור, פשוט דברו איתנו.
        </p>
      </section>

      <section>
        <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>איך מבטלים</h2></div>
        <div className={styles.ways}>
          <div className={styles.way}><i>1</i><b>שולחים הודעה</b><p>בווצאפ, במייל {BUSINESS.email} או בטלפון {BUSINESS.phoneDisplay}, עם השם, תאריך ההזמנה והמוצר.</p></div>
          <div className={styles.way}><i>2</i><b>מחזירים את המוצר</b><p>{r.condition} {r.returnShipping}</p></div>
          <div className={styles.way}><i>3</i><b>מקבלים החזר</b><p>{r.refund}</p></div>
        </div>
      </section>

      <section>
        <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>התנאים בקצרה</h2></div>
        <ul style={ul}>
          <li><b style={{ color: "var(--text)" }}>מתי:</b> תוך {r.days} יום מיום קבלת המוצר.</li>
          <li><b style={{ color: "var(--text)" }}>דמי ביטול:</b> {r.feeRule}.</li>
          <li><b style={{ color: "var(--text)" }}>משלוח ההחזרה:</b> {r.returnShipping}</li>
          <li><b style={{ color: "var(--text)" }}>מצב המוצר:</b> {r.condition}</li>
          <li><b style={{ color: "var(--text)" }}>מוצר פגום:</b> {r.defective}</li>
          <li><b style={{ color: "var(--text)" }}>אחריות:</b> {WARRANTY_TEXT}. תקלה בתקופת האחריות היא לא ביטול עסקה: פנו אלינו ונטפל בתיקון או בהחלפה.</li>
        </ul>
      </section>

      <section>
        <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>הזמנות עם התקנה</h2></div>
        <p style={p}>
          ציוד שהותקן על ידי המתקין שלנו עבר שימוש, ולכן החזרה שלו נבדקת לגופה, בהתאם למצב המוצר. על ביטול התקנה שתואמה כדאי להודיע לנו מוקדם ככל האפשר. <Link href="/installation">על ההתקנה</Link>
        </p>
      </section>

      <section>
        <div className={styles.sectionHead}><h2>שאלות נפוצות</h2></div>
        <div className={styles.faq}>
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.closing}>
        <h2>רוצים לבטל או להחזיר?</h2>
        <p>שלחו לנו הודעה עם פרטי ההזמנה, ונחזור אליכם עם ההנחיות.</p>
        <div className={styles.ctas}>
          <a className={`${styles.cta} ${styles.ctaWa}`} href={wa} target="_blank" rel="noopener noreferrer">לשלוח הודעה בווצאפ</a>
          <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/shipping">על המשלוחים</Link>
        </div>
      </section>
    </main>
  );
}
