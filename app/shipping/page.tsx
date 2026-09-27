import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { WHATSAPP_NUMBER } from "../data/store-catalog";
import { BUSINESS } from "../data/business";
import styles from "../home.module.css";

export const metadata: Metadata = {
  title: "משלוחים ואיסוף עצמי | Site-Control",
  description: "המחירים באתר לא כוללים משלוח. המשלוח עם שליחי UPS, מתומחר בנפרד לפי הכתובת והמשקל ונמסר לפני התשלום. איסוף עצמי ללא עלות, בתיאום.",
  alternates: { canonical: "/shipping" },
  robots: { index: true, follow: true },
};

const UPDATED = "27.9.2026";

const h2 = { fontSize: "1.3rem", color: "var(--text-bright)", marginBottom: "0.6rem" } as const;
const p = { color: "var(--muted)", lineHeight: 1.8, maxWidth: "75ch" } as const;
const ul = { ...p, paddingInlineStart: "1.2rem", display: "grid", gap: "0.35rem" } as const;

const faq = [
  { q: "המחיר באתר כולל משלוח?", a: "לא. כל המחירים באתר, כולל מחירי מבצע, לא כוללים משלוח. דמי המשלוח נקבעים בנפרד לפי הכתובת והמשקל." },
  { q: "כמה עולה משלוח בערך?", a: "לרוב הארץ, חבילה קטנה כמו מצלמה בודדת עולה כ-40 עד 55 ₪, וערכה עם מקליט כ-60 עד 80 ₪. ליישובים מרוחקים יש תוספת. זו הערכה בלבד: המחיר המדויק נקבע לפי הכתובת." },
  { q: "מתי אדע כמה עולה המשלוח?", a: "אחרי ששולחים הזמנה ומוסרים כתובת, אנחנו חוזרים אליכם עם מחיר המשלוח ועם המחיר הסופי. משלמים רק אחרי שאישרתם אותו." },
  { q: "אפשר לאסוף לבד?", a: "כן. איסוף עצמי הוא ללא עלות, בתיאום מראש." },
  { q: "ומה אם הזמנתי התקנה?", a: "כשאנחנו מתקינים, המתקין מביא את הציוד איתו ואין משלוח נפרד." },
];

export default function ShippingPage() {
  const items = [{ name: "משלוחים", url: "/shipping" }];
  const s = BUSINESS.shipping;
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי, אשמח למחיר משלוח. הכתובת: \nהמוצרים: ")}`;
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
        <h1 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.4rem)", color: "var(--text-bright)" }}>משלוחים ואיסוף עצמי</h1>
        <p style={{ ...p, color: "var(--text-bright)", fontWeight: 600, fontSize: "1.1rem" }}>
          המחירים באתר לא כוללים משלוח. המשלוח מתומחר בנפרד, לפי הכתובת שלכם.
        </p>
        <p style={p}>
          אנחנו שולחים לכל הארץ עם שליחים של {s.carrier}. מחיר המשלוח תלוי בכתובת ובמשקל החבילה, ולכן הוא לא מופיע ליד המוצר:
          אתם מוסרים כתובת, ואנחנו חוזרים אליכם עם המחיר לפני שמשלמים.
        </p>
      </section>

      <section>
        <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>איך זה עובד</h2></div>
        <div className={styles.ways}>
          <div className={styles.way}><i>1</i><b>מזמינים</b><p>שולחים הזמנה מהעגלה או בווצאפ, ומוסרים כתובת מלאה למשלוח.</p></div>
          <div className={styles.way}><i>2</i><b>מקבלים מחיר משלוח</b><p>אנחנו מאשרים זמינות, מתמחרים את המשלוח לפי הכתובת והמשקל, וחוזרים אליכם עם המחיר הסופי.</p></div>
          <div className={styles.way}><i>3</i><b>מאשרים ומשלמים</b><p>רק אחרי שאישרתם את המחיר הכולל. שליח של {s.carrier} מביא את החבילה עד הדלת.</p></div>
        </div>
      </section>

      {s.estimates.length > 0 && (
        <section>
          <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>כמה זה עולה, בערך</h2></div>
          <p style={{ ...p, marginBottom: "1rem" }}>
            המחירים כאן הם הערכה בלבד, כולל מע״מ, כדי שתדעו למה לצפות. המחיר המחייב הוא זה שנמסור לכם לפי הכתובת.
          </p>
          <ul style={{ listStyle: "none", display: "grid", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--card)", maxWidth: 820, overflow: "hidden" }}>
            {s.estimates.map((e, i) => (
              <li key={e.what} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "0.2rem 1rem", alignItems: "center", padding: "0.9rem 1.1rem", borderTop: i ? "1px solid var(--border)" : undefined }}>
                <b style={{ color: "var(--text-bright)", fontSize: "1rem" }}>{e.what}</b>
                <strong style={{ gridRow: "1 / span 2", gridColumn: 2, color: "var(--text-bright)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{e.price}</strong>
                <span style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>{e.example}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>מה משפיע על המחיר</h2></div>
        <ul style={ul}>
          <li><b style={{ color: "var(--text)" }}>הכתובת:</b> יישובים מרוחקים, אילת ויישובים שהגישה אליהם מוגבלת עשויים לעלות יותר.</li>
          <li><b style={{ color: "var(--text)" }}>המשקל והגודל:</b> מצלמה בודדת היא חבילה קטנה. ערכה עם מקליט, כמה מצלמות וכבלים כבדה וגדולה יותר.</li>
          <li><b style={{ color: "var(--text)" }}>מספר החבילות:</b> הזמנה גדולה נשלחת לפעמים בכמה חבילות.</li>
        </ul>
      </section>

      {s.days && (
        <section>
          <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>זמן אספקה</h2></div>
          <p style={p}>{s.days}</p>
        </section>
      )}

      <section>
        <div className={styles.sectionHead} style={{ marginBottom: "0.4rem" }}><h2 style={h2}>איסוף עצמי והתקנה</h2></div>
        <ul style={ul}>
          <li><b style={{ color: "var(--text)" }}>איסוף עצמי:</b> ללא עלות, בתיאום מראש.</li>
          <li><b style={{ color: "var(--text)" }}>התקנה:</b> כשאנחנו מתקינים, המתקין מביא את הציוד איתו ואין משלוח נפרד. <Link href="/installation">על ההתקנה</Link></li>
        </ul>
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
        <h2>רוצים מחיר משלוח עכשיו?</h2>
        <p>שלחו לנו את הכתובת ומה אתם מזמינים, ונחזור עם מחיר.</p>
        <div className={styles.ctas}>
          <a className={`${styles.cta} ${styles.ctaWa}`} href={wa} target="_blank" rel="noopener noreferrer">לשלוח כתובת בווצאפ</a>
          <Link className={`${styles.cta} ${styles.ctaGhost}`} href="/store">לחנות</Link>
        </div>
      </section>
    </main>
  );
}
