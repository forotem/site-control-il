// תקנון האתר ותנאי הרכישה (רותם 3.10.2026: "מאשר לך בשמי, תעשה אתה"), לקראת Google Merchant Center וסליקה.
// כל עובדה כאן מגיעה מהמקור האחד: BUSINESS (משלוח, החזרות, פרטי העסק) ו-WARRANTY_TEXT. אין כאן התחייבות
// שלא הוחלטה. אמצעי התשלום יפורטו כשרותם יקבע אותם (עד אז: התשלום מול נציג אחרי אישור זמינות, כמו בפועל).
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { WARRANTY_TEXT } from "../data/store-catalog";
import { BUSINESS } from "../data/business";
import styles from "../home.module.css";

export const metadata: Metadata = {
  title: "תקנון ותנאי רכישה | Site-Control",
  description: "תקנון האתר ותנאי הרכישה של Site-Control: הזמנה ואישור זמינות, מחירים, תשלום, משלוח ואיסוף, התקנה, ביטול והחזרות לפי חוק הגנת הצרכן, אחריות ופרטיות.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const UPDATED = "3.10.2026";

const h2 = { fontSize: "1.25rem", color: "var(--text-bright)", marginBottom: "0.5rem" } as const;
const p = { color: "var(--muted)", lineHeight: 1.8, maxWidth: "75ch" } as const;
const ul = { ...p, paddingInlineStart: "1.2rem", display: "grid", gap: "0.35rem" } as const;
const a = { color: "var(--accent)" } as const;

export default function TermsPage() {
  const r = BUSINESS.returns;
  const items = [{ name: "תקנון ותנאי רכישה", url: "/terms" }];
  const sections: { t: string; body: React.ReactNode }[] = [
    {
      t: "1. כללי",
      body: (
        <>
          <p style={p}>
            האתר site-control-il.com והחנות שבו מופעלים על ידי {BUSINESS.legalName}, עוסק מורשה {BUSINESS.licenseId}, תחת השם המסחרי {BUSINESS.brand} (להלן: &quot;אנחנו&quot;).
            התקנון חל על השימוש באתר ועל כל רכישה של מוצר או שירות דרכו, בווצאפ או בטלפון. ביצוע הזמנה הוא הסכמה לתקנון.
          </p>
          <p style={p}>התקנון כתוב בלשון רבים ופונה לכל המינים. אם יש סתירה בין התקנון לבין הוראה של חוק הגנת הצרכן, החוק גובר.</p>
        </>
      ),
    },
    {
      t: "2. המוצרים והמחירים",
      body: (
        <ul style={ul}>
          <li>המחירים באתר בשקלים וכוללים מע״מ. הם לא כוללים משלוח ולא כוללים התקנה, אלא אם נכתב אחרת במפורש (למשל במבצע עם התקנה בדף המבצעים).</li>
          <li>המחירים עשויים להשתנות. המחיר שמחייב אתכם הוא המחיר שאושר לכם באישור ההזמנה.</li>
          <li>התמונות והתיאורים נועדו להמחשה ומבוססים על נתוני היצרן. אם מוצר שונה מהותית ממה שתואר, אפשר לבטל בלי דמי ביטול.</li>
          <li>אם נפלה טעות ברורה במחיר או בפרטי מוצר, נודיע לכם לפני החיוב ותוכלו לבחור אם להמשיך או לבטל בלי עלות.</li>
        </ul>
      ),
    },
    {
      t: "3. הזמנה ואישור זמינות",
      body: (
        <ul style={ul}>
          <li>מזמינים דרך עגלת הקניות באתר, בווצאפ או בטלפון. בהזמנה מהאתר נשלח קוד אימות בווצאפ למספר הטלפון שהזנתם, כדי לוודא שההזמנה באמת שלכם.</li>
          <li>אחרי קבלת ההזמנה אנחנו בודקים זמינות מול היבואן וחוזרים אליכם עם אישור, מחיר משלוח ומועד אספקה. לא גובים כסף לפני האישור הזה.</li>
          <li>אם מוצר לא זמין, נודיע לכם ונציע חלופה. אם החלופה לא מתאימה לכם, ההזמנה מבוטלת בלי שום חיוב.</li>
          <li>העסקה נסגרת כשאישרתם את פרטי ההזמנה הסופיים והתשלום התקבל.</li>
        </ul>
      ),
    },
    {
      t: "4. תשלום",
      body: (
        <ul style={ul}>
          <li>בשלב זה אין חיוב באתר עצמו. התשלום מתבצע מול נציג, בווצאפ או בטלפון, רק אחרי שאישרנו זמינות ומחיר משלוח.</li>
          <li>על כל תשלום מונפקת חשבונית מס כדין.</li>
          <li>פרטי אמצעי תשלום, כמו פרטי כרטיס אשראי, לא נשמרים באתר.</li>
        </ul>
      ),
    },
    {
      t: "5. משלוח ואיסוף",
      body: (
        <>
          <p style={p}>{BUSINESS.shipping.rule} המשלוח בשליחי {BUSINESS.shipping.carrier}. {BUSINESS.shipping.days}</p>
          <p style={p}>אפשר גם איסוף עצמי ללא עלות, בתיאום מראש. הפירוט וההערכות: <Link href="/shipping" style={a}>משלוחים ואיסוף</Link>.</p>
        </>
      ),
    },
    {
      t: "6. התקנה",
      body: (
        <p style={p}>
          התקנה היא שירות נפרד ואופציונלי, {BUSINESS.installAreaIn}, על ידי מתקין מטעמנו. מחיר הציוד באתר מחייב, ומחיר ההתקנה נקבע בהצעת מחיר נפרדת לפני העבודה.
          פרטים ובקשת הצעה: <Link href="/installation" style={a}>התקנה</Link>.
        </p>
      ),
    },
    {
      t: "7. ביטול עסקה והחזרות",
      body: (
        <>
          <p style={p}>{r.summary}</p>
          <ul style={ul}>
            <li><b style={{ color: "var(--text)" }}>דמי ביטול:</b> {r.feeRule}.</li>
            <li><b style={{ color: "var(--text)" }}>החזרת המוצר:</b> {r.returnShipping} {r.condition}</li>
            <li><b style={{ color: "var(--text)" }}>החזר כספי:</b> {r.refund}</li>
            <li><b style={{ color: "var(--text)" }}>מוצר פגום או שונה ממה שהוזמן:</b> {r.defective}</li>
          </ul>
          <p style={p}>איך מבטלים, צעד אחרי צעד: <Link href="/returns" style={a}>החזרות וביטולים</Link>.</p>
        </>
      ),
    },
    {
      t: "8. אחריות",
      body: (
        <p style={p}>
          {WARRANTY_TEXT}, מיום קבלת המוצר. בתקלה בתקופת האחריות פנו אלינו ונטפל בתיקון או בהחלפה. האחריות לא חלה על נזק משימוש שלא לפי הוראות היצרן, מהתקנה שלא בוצעה כראוי על ידי מי שאינו מטעמנו, מפגיעה פיזית, ממים במוצר שאינו עמיד במים, או מחיבור למתח לא מתאים.
        </p>
      ),
    },
    {
      t: "9. פרטיות",
      body: (
        <p style={p}>
          הפרטים שאתם מוסרים בהזמנה (שם, טלפון, כתובת) משמשים לטיפול בהזמנה, למשלוח, להתקנה ולשירות, ולא מועברים לאחרים מלבד מי שצריך אותם לשם כך (למשל חברת השליחויות או היבואן).
          הפירוט המלא: <Link href="/privacy" style={a}>מדיניות פרטיות</Link>.
        </p>
      ),
    },
    {
      t: "10. ביקורות",
      body: (
        <p style={p}>
          רק לקוחות שקנו אצלנו יכולים לכתוב ביקורת, דרך קישור אישי שנשלח אחרי ההזמנה. אנחנו מפרסמים כל ביקורת אמיתית, גם ביקורת שלילית, ומסירים רק ספאם, פרטים אישיים ותוכן פוגע.
        </p>
      ),
    },
    {
      t: "11. קניין רוחני",
      body: (
        <p style={p}>
          התוכן באתר (טקסטים, מדריכים, עיצוב) שייך ל-{BUSINESS.brand}. אין להעתיק אותו לשימוש מסחרי בלי אישור. שמות המותגים והדגמים, וכן תמונות ונתונים של יצרנים, שייכים לבעליהם ומוצגים לצורך תיאור המוצרים.
        </p>
      ),
    },
    {
      t: "12. שינויים בתקנון, דין וסמכות",
      body: (
        <p style={p}>
          אנחנו רשאים לעדכן את התקנון מעת לעת. הנוסח שחל על הזמנה הוא הנוסח שהיה באתר ביום ההזמנה. על התקנון חלים דיני מדינת ישראל, והסמכות נתונה לבתי המשפט המוסמכים בישראל.
        </p>
      ),
    },
  ];

  return (
    <main className={styles.wrap} style={{ gap: "1.6rem" }}>
      <BreadcrumbSchema items={items} />
      <Breadcrumb items={items} />

      <section className={styles.heroText}>
        <span className={styles.kicker}>עודכן לאחרונה: {UPDATED}</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.4rem)", color: "var(--text-bright)" }}>תקנון ותנאי רכישה</h1>
        <p style={p}>הזמנה, תשלום, משלוח, התקנה, ביטול ואחריות: כל התנאים במקום אחד, בשפה פשוטה.</p>
      </section>

      {sections.map((s) => (
        <section key={s.t}>
          <h2 style={h2}>{s.t}</h2>
          {s.body}
        </section>
      ))}

      <section>
        <h2 style={h2}>יצירת קשר</h2>
        <p style={p}>
          {BUSINESS.brand}, {BUSINESS.legalName}, עוסק מורשה {BUSINESS.licenseId}<br />
          טלפון וווצאפ: <a href={`tel:${BUSINESS.phoneE164}`} style={a}>{BUSINESS.phoneDisplay}</a> · מייל: <a href={`mailto:${BUSINESS.email}`} style={a}>{BUSINESS.email}</a><br />
          שעות פעילות: {BUSINESS.hours}
        </p>
      </section>
    </main>
  );
}
