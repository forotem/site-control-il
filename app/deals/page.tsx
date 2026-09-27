import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { WHATSAPP_NUMBER, WARRANTY_TEXT, productName } from "../data/store-catalog";
import { deals, dealProduct, withVat } from "../data/deals";
import { InstallForm } from "../installation/InstallForm";
import home from "../home.module.css";
import styles from "./deals.module.css";

const nis = (n: number) => n.toLocaleString("he-IL");
const first = deals[0];

export const metadata: Metadata = {
  title: "מבצעים: מצלמת 4G עם התקנה במחיר סגור | Site-Control",
  description: `מבצע Reolink TrackMix Wired LTE: מצלמת 4G ממונעת עם שתי עדשות, זום ומעקב אוטומטי, מותקנת ועובדת ב-${nis(first.price)} ₪ + מע״מ (${nis(withVat(first.price))} ₪ כולל מע״מ). התקנה בכל הארץ.`,
  alternates: { canonical: "/deals" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "מצלמת 4G ממונעת, מותקנת ועובדת | מבצע Site-Control",
    description: `מצלמה, התקנה והגדרה ב-${nis(first.price)} ₪ + מע״מ. בכל הארץ.`,
    url: "/deals",
    type: "website",
    locale: "he_IL",
    images: ["/og-default.jpg"],
  },
};

export default function DealsPage() {
  const items = [{ name: "מבצעים", url: "/deals" }];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: deals.flatMap((d) => d.faq).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className={home.wrap} data-lead-page="deals">
      <BreadcrumbSchema items={items} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumb items={items} />

      {deals.map((d, i) => {
        const p = dealProduct(d);
        if (!p) return null;
        const Title = i === 0 ? "h1" : "h2";
        const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`היי, אני מתעניין ב${d.name} (${nis(d.price)} ₪ + מע"מ). היישוב שלי: `)}`;
        const formId = `${d.id}-form`;
        return (
          <article key={d.id} id={d.id} className={styles.deal} data-track={`deal_${d.id}`}>
            <header className={styles.hero}>
              <div className={styles.heroText}>
                <span className={styles.badge}>מבצע · מצלמה + התקנה</span>
                <Title className={styles.title}>{d.title}</Title>
                <p className={styles.lead}>{d.lead}</p>
                <div className={styles.price}>
                  <strong>{nis(d.price)} ₪ <small>+ מע״מ</small></strong>
                  <span>למצלמה, כולל התקנה והגדרה. {nis(withVat(d.price))} ₪ כולל מע״מ.</span>
                </div>
                <div className={home.ctas}>
                  <a className={`${home.cta} ${home.ctaAccent}`} href={`#${formId}`}>אני רוצה את המבצע</a>
                  <a className={`${home.cta} ${home.ctaWa}`} href={wa} target="_blank" rel="noopener noreferrer">לשאול בווצאפ</a>
                </div>
                <div className={home.trust}>
                  <span>התקנה בכל הארץ</span>
                  <span>כרטיס זיכרון {d.giftCardGb}GB במתנה</span>
                  <span>{WARRANTY_TEXT}</span>
                </div>
              </div>
              <Link href={`/store/${p.slug}`} className={styles.shot} aria-label={`לדף המוצר ${productName(p)}`}>
                {p.image && <img src={p.image} alt={p.title} />}
                <em>{productName(p)}</em>
              </Link>
            </header>

            <section aria-labelledby={`${d.id}-includes`}>
              <div className={home.sectionHead}>
                <h2 id={`${d.id}-includes`}>מה כלול במחיר</h2>
              </div>
              <div className={styles.includes}>
                {d.includes.map((x, n) => (
                  <div key={x.title}><i>{n + 1}</i><b>{x.title}</b><p>{x.body}</p></div>
                ))}
              </div>
            </section>

            <section className={styles.terms} aria-labelledby={`${d.id}-terms`}>
              <div><h2 id={`${d.id}-terms`}>למי המבצע מתאים</h2></div>
              <ul>{d.conditions.map((c) => <li key={c}>{c}</li>)}</ul>
              <p>לא בטוחים שהמקום מתאים? שלחו תמונה בווצאפ ונגיד לכם לפני שמתחייבים.</p>
            </section>

            <section aria-labelledby={`${d.id}-why`}>
              <div className={home.sectionHead}>
                <h2 id={`${d.id}-why`}>למה דווקא המצלמה הזאת</h2>
                <p>לא כל מצלמה מתאימה למחיר סגור עם התקנה. את זאת אנחנו מכירים היטב, והיא נותנת כיסוי של כמה מצלמות רגילות.</p>
              </div>
              <div className={home.why}>
                {d.advantages.map((x) => <div key={x.title}><b>{x.title}</b><p>{x.body}</p></div>)}
              </div>
            </section>

            <section aria-labelledby={`${d.id}-paths`}>
              <div className={home.sectionHead}><h2 id={`${d.id}-paths`}>שתי דרכים לקבל אותה</h2></div>
              <div className={styles.paths}>
                <div className={`${styles.path} ${styles.pathMain}`}>
                  <span className={styles.badge}>המבצע</span>
                  <b>מותקנת ועובדת</b>
                  <strong>{nis(d.price)} ₪ <small>+ מע״מ</small></strong>
                  <ul>
                    <li>מצלמה, התקנה וחיבור לחשמל</li>
                    <li>כרטיס זיכרון {d.giftCardGb}GB במתנה</li>
                    <li>התקנת סים והגדרה. חבילת {d.sim.gb}GB ל-{d.sim.months} חודשים בתוספת {nis(d.sim.price)} ₪</li>
                    <li>הגדרת האפליקציה והדרכה</li>
                    <li>בכל הארץ, בתיאום</li>
                  </ul>
                  <a className={`${home.cta} ${home.ctaAccent}`} href={`#${formId}`}>להזמנת המבצע</a>
                </div>
                <div className={styles.path}>
                  <b>רק המצלמה, מתקינים לבד</b>
                  <strong>{p.price ? <>{nis(p.price)} ₪ <small>כולל מע״מ</small></> : "מחיר לפי פנייה"}</strong>
                  <ul>
                    <li>משלוח עד הבית או איסוף עצמי</li>
                    <li>נסביר בטלפון או בווצאפ איך מחברים ומגדירים</li>
                    <li>חבילת סים {d.sim.gb}GB ל-{d.sim.months} חודשים בתוספת {nis(d.sim.price)} ₪</li>
                    <li>כרטיס זיכרון קונים בנפרד</li>
                    <li>{WARRANTY_TEXT}</li>
                  </ul>
                  <Link className={`${home.cta} ${home.ctaGhost}`} href={`/store/${p.slug}`}>לדף המוצר והמפרט</Link>
                </div>
              </div>
            </section>

            <section aria-labelledby={`${d.id}-how`}>
              <div className={home.sectionHead}><h2 id={`${d.id}-how`}>איך זה עובד</h2></div>
              <div className={home.ways}>
                {d.steps.map((x, n) => <div key={x.title} className={home.way}><i>{n + 1}</i><b>{x.title}</b><p>{x.body}</p></div>)}
              </div>
            </section>

            <section id={formId} className={styles.order} aria-labelledby={`${formId}-title`} data-track={`deal_${d.id}_form`}>
              <div>
                <h2 id={`${formId}-title`}>להזמנת המבצע</h2>
                <p>משאירים פרטים ואנחנו חוזרים לתאם. לא משלמים כלום עד שמוודאים יחד שהמקום מתאים.</p>
                <div className={styles.price}>
                  <strong>{nis(d.price)} ₪ <small>+ מע״מ</small></strong>
                  <span>למצלמה, כולל התקנה והגדרה. {nis(withVat(d.price))} ₪ כולל מע״מ.</span>
                </div>
              </div>
              <InstallForm variant="deal" deal={d.name} />
            </section>

            <section aria-labelledby={`${d.id}-faq`}>
              <div className={home.sectionHead}><h2 id={`${d.id}-faq`}>שאלות נפוצות על המבצע</h2></div>
              <div className={home.faq}>
                {d.faq.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </article>
        );
      })}

      <section className={home.closing} data-track="deals_closing">
        <h2>צריכים משהו אחר?</h2>
        <p>לכל ציוד אחר בחנות ההתקנה היא בהצעת מחיר נפרדת. ספרו לנו מה צריך ואיפה, ונחזור עם הצעה.</p>
        <div className={home.ctas}>
          <Link className={`${home.cta} ${home.ctaGhost}`} href="/store">לחנות</Link>
          <Link className={`${home.cta} ${home.ctaGhost}`} href="/installation#quote">הצעת מחיר להתקנה</Link>
        </div>
      </section>
    </main>
  );
}
