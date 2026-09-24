import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import styles from "../home.module.css";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | Site-Control",
  description: "איזה מידע Site-Control אוספת באתר, למה, עם מי הוא משותף, ואיך מבקשים לעיין בו, לתקן או למחוק אותו.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const UPDATED = "24.9.2026";

const h2 = { fontSize: "1.3rem", color: "var(--text-bright)", marginBottom: "0.6rem" } as const;
const p = { color: "var(--muted)", lineHeight: 1.8, maxWidth: "75ch" } as const;
const ul = { ...p, paddingInlineStart: "1.2rem", display: "grid", gap: "0.35rem" } as const;

export default function PrivacyPage() {
  const items = [{ name: "מדיניות פרטיות", url: "/privacy" }];
  return (
    <main className={styles.wrap} style={{ gap: "2rem" }}>
      <BreadcrumbSchema items={items} />
      <Breadcrumb items={items} />

      <section className={styles.heroText}>
        <span className={styles.kicker}>עודכן לאחרונה: {UPDATED}</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.4rem)", color: "var(--text-bright)" }}>מדיניות פרטיות</h1>
        <p style={p}>
          המסמך מסביר איזה מידע Site-Control (&quot;אנחנו&quot;) אוספת כשאתם גולשים באתר site-control-il.com, משאירים פרטים,
          שולחים הזמנה או מדברים עם העוזר בחנות, מה אנחנו עושים איתו ומה הזכויות שלכם לפי חוק הגנת הפרטיות, התשמ&quot;א-1981.
        </p>
      </section>

      <section>
        <h2 style={h2}>1. מידע שאתם מוסרים לנו</h2>
        <ul style={ul}>
          <li><b>טופס יצירת קשר וטופס התקנה:</b> שם, טלפון, אימייל, שם העסק, יישוב, סוג הנכס, מה צריך ותוכן ההודעה.</li>
          <li><b>הזמנה מהעגלה:</b> שם, טלפון, המוצרים והכמויות, אופן הקבלה (משלוח, איסוף או התקנה) והערות, כמו כתובת למשלוח.</li>
          <li><b>צ&apos;אט העוזר בחנות:</b> ההודעות שאתם כותבים, ומספר טלפון אם בחרתם להשאיר אותו.</li>
          <li><b>וואטסאפ, טלפון ומייל:</b> מה שאתם שולחים לנו ישירות בערוצים האלה.</li>
        </ul>
        <p style={{ ...p, marginTop: "0.6rem" }}>
          אינכם חייבים על פי חוק למסור לנו מידע. בלי פרטי קשר פשוט לא נוכל לחזור אליכם, לתת הצעת מחיר או לטפל בהזמנה.
          אין תשלום באתר, ואנחנו לא מבקשים באתר פרטי כרטיס אשראי.
        </p>
      </section>

      <section>
        <h2 style={h2}>2. מידע שנאסף אוטומטית</h2>
        <ul style={ul}>
          <li><b>Google Analytics:</b> דפים שנצפו, סוג מכשיר ודפדפן, מיקום משוער (עיר או מדינה), מקור ההגעה, ופעולות כמו לחיצה על וואטסאפ או טלפון, הוספה לעגלה ושליחת טופס. המידע נאסף באמצעות עוגיות (cookies) ומוצג לנו כנתונים מצטברים.</li>
          <li><b>פרסום בגוגל:</b> כשאתם מגיעים ממודעה של Google Ads, גוגל עשויה להשתמש בעוגיות כדי למדוד אם המודעה הביאה פנייה, ולהציג לכם מודעות שלנו בהמשך (רימרקטינג).</li>
          <li><b>מקור הפנייה:</b> כשאתם נכנסים לאתר, הדפדפן שלכם שומר אצלו (ב-localStorage, ל-90 יום) מאיפה הגעתם, למשל &quot;Google Ads&quot; ושם הקמפיין, ואיזה דף ראיתם ראשון. המידע הזה מצורף לפנייה או להזמנה שאתם שולחים, כדי שנדע איזה פרסום עובד. הוא לא כולל את המזהה הטכני של הקליק.</li>
          <li><b>עגלת הקניות</b> נשמרת בדפדפן שלכם בלבד, עד שאתם שולחים הזמנה.</li>
        </ul>
      </section>

      <section>
        <h2 style={h2}>3. למה אנחנו משתמשים במידע</h2>
        <ul style={ul}>
          <li>לחזור אליכם, לתת ייעוץ והצעת מחיר, לבדוק זמינות מול היבואן, לספק מוצרים ולתאם התקנה.</li>
          <li>שירות, אחריות ותמיכה אחרי הקנייה.</li>
          <li>לשפר את האתר, ולמדוד אילו מודעות ודפים מביאים פניות.</li>
          <li>לעמוד בחובות לפי דין, כמו הנהלת חשבונות.</li>
        </ul>
        <p style={{ ...p, marginTop: "0.6rem" }}>לא נשלח לכם דיוור שיווקי בלי הסכמה מפורשת, ולא נמכור את המידע שלכם לאף אחד.</p>
      </section>

      <section>
        <h2 style={h2}>4. עם מי המידע משותף</h2>
        <p style={p}>רק עם ספקים שעוזרים לנו להפעיל את האתר והשירות, ורק במידה הנדרשת:</p>
        <ul style={ul}>
          <li><b>Vercel</b>: אחסון האתר.</li>
          <li><b>Resend</b>: שליחת המיילים מהטפסים (אלינו, ומייל אישור אליכם).</li>
          <li><b>Green API</b>: העברת התראה על הזמנה או ליד חדש לוואטסאפ של הצוות שלנו.</li>
          <li><b>Google</b>: מדידה (Analytics), פרסום (Ads), ומודל Gemini שמנסח את תשובות העוזר בצ&apos;אט. ההודעות שכותבים בצ&apos;אט נשלחות לגוגל לשם כך, ולכן לא כדאי לכתוב בו מידע רגיש.</li>
          <li><b>יבואנים, ספקים וחברות שילוח</b>: פרטים הנדרשים לאספקת ההזמנה בלבד.</li>
        </ul>
        <p style={{ ...p, marginTop: "0.6rem" }}>
          חלק מהספקים שומרים מידע בשרתים מחוץ לישראל. נמסור מידע גם אם נחויב לכך על פי דין.
        </p>
      </section>

      <section>
        <h2 style={h2}>5. עוגיות ואיך לחסום אותן</h2>
        <p style={p}>
          אפשר לחסום או למחוק עוגיות בהגדרות הדפדפן. האתר ימשיך לעבוד, אבל לא נוכל למדוד את הביקור.
          כדי לא לקבל מודעות מותאמות אישית מגוגל, אפשר לשנות את ההגדרות ב-
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">הגדרות המודעות של Google</a>.
          כדי שהביקורים שלכם לא יימדדו ב-Analytics, אפשר להתקין את
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer"> תוסף ההסרה של Google Analytics</a>.
        </p>
      </section>

      <section>
        <h2 style={h2}>6. כמה זמן שומרים ואיך מאבטחים</h2>
        <p style={p}>
          אנחנו שומרים פניות והזמנות כל עוד צריך אותן כדי לתת שירות ואחריות, ולפי מה שהדין מחייב. הגישה למידע מוגבלת לצוות
          ולספקים שצוינו למעלה, והתקשורת עם האתר מוצפנת (HTTPS). אין אבטחה מושלמת, ואם נגלה אירוע שפוגע במידע שלכם, נפעל לפי הדין.
        </p>
      </section>

      <section>
        <h2 style={h2}>7. הזכויות שלכם</h2>
        <p style={p}>
          אתם יכולים לבקש לעיין במידע שלכם, לתקן אותו או למחוק אותו, ולבקש שלא נפנה אליכם יותר.
          כתבו ל-<a href="mailto:info@site-control-il.com">info@site-control-il.com</a> או בוואטסאפ ל-050-2256866, ונטפל בבקשה תוך 30 יום.
        </p>
      </section>

      <section>
        <h2 style={h2}>8. שינויים במדיניות</h2>
        <p style={p}>
          אם נשנה את המדיניות, נעדכן כאן את התאריך למעלה. לשאלות על פרטיות ועל נגישות האתר, ראו גם את{" "}
          <Link href="/accessibility">הצהרת הנגישות</Link> ואת <Link href="/contact">דף יצירת הקשר</Link>.
        </p>
      </section>
    </main>
  );
}
