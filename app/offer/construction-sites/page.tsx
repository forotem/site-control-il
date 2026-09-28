import type { Metadata } from "next";
import Link from "next/link";
import { WHATSAPP_NUMBER, WARRANTY_TEXT, productName } from "../../data/store-catalog";
import { VAT_RATE } from "../../data/deals";
import { SITE_OFFER, offerProduct, tierEquipment, installDayWithVat } from "../../data/site-offer";
import { BUSINESS } from "../../data/business";
import { OfferCalculator, SiteOfferForm, type CalcTier } from "./OfferCalculator";
import home from "../../home.module.css";
import deal from "../../deals/deals.module.css";
import styles from "./offer.module.css";

// דף הצעה שרותם שולח ללקוחות עם כמה אתרי בנייה. לא באינדקס ולא בתפריט (ראו site-offer.ts)
export const metadata: Metadata = {
  title: "מצלמות לאתרי בנייה בלי חשמל: חבילה עם התקנה | Site-Control",
  description: "חבילות מצלמות 4G סולאריות לאתרי בנייה: 4 עד 6 מצלמות לאתר, עם התקנה או בלי. התראה לנייד, צבע בלילה, דיבור דרך המצלמה וגיבוי בענן.",
  robots: { index: false, follow: false },
};

const nis = (n: number) => Math.round(n).toLocaleString("he-IL");

const needs = [
  { q: "אין באתר חשמל יציב", a: "כל מצלמה עובדת על סוללה נטענת ופאנל סולארי משלה. לא צריך שקע, לא צריך כבלים, והיא לא נופלת כשמנתקים את החשמל באתר." },
  { q: "אין אינטרנט באתר", a: "בכל מצלמה יש סים 4G. היא שולחת התראות ומשדרת לנייד דרך הרשת הסלולרית, כמו טלפון." },
  { q: "שתצלם טוב בלילה", a: "זרקור מובנה וראיית לילה צבעונית: רואים בלילה צבע ופרטים, לא רק צל אפור." },
  { q: "לדעת כשמישהו נכנס", a: "המצלמה מזהה אדם ושולחת התראה לנייד עם תמונה. מגדירים שההתראות פעילות רק בשעות שהאתר סגור, כדי שלא יציפו אתכם ביום." },
  { q: "לעשות משהו כשזה קורה", a: "פותחים את השידור החי מההתראה ומדברים דרך הרמקול של המצלמה עם מי שנכנס. רואים מה קורה ומחליטים אם להזעיק משטרה או את השומר." },
  { q: "שהחומר לא ילך אם גונבים את המצלמה", a: "גיבוי בענן של Reolink: כל קטע תנועה עולה לענן ברגע שהוא מוקלט, כך שגם אם שוברים או לוקחים את המצלמה, התיעוד כבר בחוץ. בנוסף יש כרטיס זיכרון בתוך המצלמה." },
  { q: "כמה אתרים, והם מתחלפים", a: "כל האתרים באפליקציה אחת בנייד. בסוף פרויקט מורידים את המצלמות מהגדר ומעבירים לאתר הבא, בלי חשמלאי ובלי תשתית." },
];

export default function ConstructionSitesOffer() {
  const tiers: CalcTier[] = SITE_OFFER.tiers.map((t) => {
    const p = offerProduct(t.productSlug);
    return { id: t.id, name: t.name, tagline: t.tagline, equipment: tierEquipment(t), image: p?.image ?? null, product: p ? productName(p) : t.productSlug, points: t.points };
  });
  const [value, best] = tiers;
  const day = installDayWithVat();
  const withSim = (t: CalcTier) => t.equipment + SITE_OFFER.sim.price;
  const mix4 = withSim(best) + 3 * withSim(value) + day; // 4 מצלמות = יום התקנה אחד
  const plus = offerProduct("reolink-trackmix-lte-plus-solar");
  const hero = offerProduct(SITE_OFFER.tiers[1].productSlug);
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי, אשמח לייעוץ על מצלמות לאתר בנייה. מצרפים סרטון מהאתר. האתר נמצא ב: ")}`;
  const survey = nis(SITE_OFFER.surveyPrice);

  const faq = [
    { q: "כמה עולה ההתקנה?", a: `זה תלוי במיקום, במורכבות ובכמות המצלמות. יום עבודה של מתקין מקצועי הוא כ-${nis(SITE_OFFER.installDay)} ₪ + מע״מ, ובאתר רגיל מתקינים ביום עד ${SITE_OFFER.camsPerDay} מצלמות על גדר, קונטיינר או עמוד קיים. צריך עמוד ייעודי, הרמה או עבודה בגובה? נגיד מראש. המחיר הסופי נסגר אחרי שרואים את האתר, בסרטון או בסיור, ולפני שמתחילים.` },
    { q: "אפשר בלי שתגיעו לאתר קודם?", a: `כן. שולחים סרטון קצר מהאתר בווצאפ, לאורך הגדר והכניסות, ונייעץ מרחוק כמה מצלמות צריך ואיפה. רוצים שמישהו מקצועי יגיע? סיור באתר עולה ${survey} ₪, ובמהלכו קובעים את הנקודות והמיקום של כל מצלמה.` },
    { q: "המצלמות מקליטות כל הזמן?", a: `מצלמות סוללה מקליטות כשיש תנועה, וכך הסוללה מחזיקה עם הפאנל. צריך הקלטה רציפה 24/7, למשל על השער הראשי? יש ערכת ${plus ? productName(plus) : "TrackMix LTE Plus"} עם פאנל 66W${plus?.price ? ` ב-${nis(plus.price)} ₪` : ""} שמקליטה ברצף גם בלי חשמל.` },
    { q: "מה קורה בחורף או כשמעונן?", a: "הפאנל טוען גם ביום מעונן, והסוללה מחזיקה כמה ימים בלי שמש. בהתקנה מכוונים את הפאנל לדרום ובלי צל, וזה מה שקובע." },
    { q: "המצלמה מתקשרת למשטרה לבד?", a: "לא. היא שולחת לכם התראה עם תמונה, אתם רואים שידור חי ויכולים לדבר דרכה עם מי שנכנס. את ההחלטה אם להזעיק משטרה או שומר מקבלים אתם, כשכבר ברור מה קורה." },
    { q: "כמה עולה הגיבוי בענן?", a: "הענן הוא מנוי חודשי של Reolink שמשלמים ישירות להם, והמחיר תלוי במספר המצלמות ובכמה ימים שומרים. נעזור לבחור מסלול ולהפעיל אותו כבר בהתקנה." },
    { q: "כמה גלישה המצלמה צורכת?", a: `מעט. ההקלטה לכרטיס לא צורכת גלישה בכלל, והגלישה משמשת להתראות, לצפייה מהנייד ולענן. חבילת הסים שלנו: ${SITE_OFFER.sim.gb}GB ל-${SITE_OFFER.sim.months} חודשים ב-${nis(SITE_OFFER.sim.price)} ₪, תשלום חד-פעמי. אפשר גם סים משלכם מכל חברה.` },
    { q: "צריך קליטה סלולרית במקום?", a: "כן. בכל אתר בודקים קליטה לפני ההתקנה." },
    { q: "אפשר כמה אנשים באפליקציה?", a: "כן. מנהל העבודה, מנהל הפרויקט והמשרד יכולים לראות את אותן מצלמות, כל אחד בנייד שלו." },
    { q: "איפה אתם מתקינים?", a: `${BUSINESS.installAreaIn}. יש לכם אתרים במרכז, בצפון ובדרום? מתאמים לפי אזור.` },
  ];

  return (
    <main className={home.wrap} data-lead-page="offer_construction_sites">
      <header className={deal.hero}>
        <div className={deal.heroText}>
          <span className={deal.badge}>הצעה לחברות בנייה</span>
          <h1 className={deal.title}>מצלמות לאתרי בנייה, בלי חשמל ובלי אינטרנט</h1>
          <p className={deal.lead}>
            סוללה, פאנל סולארי וסים 4G בכל מצלמה. מתריעות לנייד כשמישהו נכנס, מצלמות בצבע בלילה, ואפשר לדבר דרכן. 4 עד 6 מצלמות לאתר, עם התקנה או בלי.
          </p>
          <div className={deal.price}>
            <strong>מ-{nis(value.equipment)} ₪ <small>למצלמה</small></strong>
            <span>ציוד כולל מע״מ: מצלמה + פאנל סולארי. התקנה: יום עבודה של מתקין, כ-{nis(SITE_OFFER.installDay)} ₪ + מע״מ לאתר של עד {SITE_OFFER.camsPerDay} מצלמות.</span>
          </div>
          <div className={home.ctas}>
            <a className={`${home.cta} ${home.ctaAccent}`} href="#calc">לחשב חבילה לאתר</a>
            <a className={`${home.cta} ${home.ctaWa}`} href={wa} target="_blank" rel="noopener noreferrer">לשלוח סרטון מהאתר בווצאפ</a>
          </div>
          <div className={home.trust}>
            <span>{WARRANTY_TEXT}</span>
            <span>עוברות איתכם לאתר הבא</span>
            <span>כל האתרים באפליקציה אחת</span>
          </div>
        </div>
        {hero?.image && (
          <Link href={`/store/${hero.slug}`} className={deal.shot} aria-label={`לדף המוצר ${productName(hero)}`}>
            <img src={hero.image} alt={hero.title} />
            <em>{productName(hero)}</em>
          </Link>
        )}
      </header>

      <section aria-labelledby="needs">
        <div className={home.sectionHead}>
          <h2 id="needs">מה ביקשתם, ומה מקבלים</h2>
          <p>אלה השאלות שעולות בכל אתר בנייה. כל אחת מהמצלמות בחבילות עונה על כולן.</p>
        </div>
        <div className={styles.needs}>
          {needs.map((n) => (
            <div key={n.q}><b>{n.q}</b><p>{n.a}</p></div>
          ))}
        </div>
      </section>

      <section id="calc" className={styles.calcSection} aria-labelledby="calc-title">
        <div className={home.sectionHead}>
          <h2 id="calc-title">שתי חבילות, מחיר לאתר</h2>
          <p>בוחרים כמה מצלמות בכל אתר, כמה אתרים, ואם להתקין. הציוד במחירי החנות. ההתקנה מחושבת לפי ימי עבודה של מתקין, והיא הערכה עד שרואים את האתר.</p>
        </div>
        <OfferCalculator tiers={tiers} installDay={SITE_OFFER.installDay} camsPerDay={SITE_OFFER.camsPerDay} sim={SITE_OFFER.sim} camsOptions={SITE_OFFER.camsOptions}
          sitesMax={SITE_OFFER.sitesMax} vatRate={VAT_RATE} giftCardGb={SITE_OFFER.giftCardGb} />
        <p className={styles.mix}>
          <b>מה שהכי נפוץ אצל קבלנים:</b> {best.name} אחת על הכניסה, שמתקרבת ועוקבת אחרי מי שנכנס, והחסכונית בהיקף.
          ארבע מצלמות כאלה באתר, עם סים ויום התקנה: כ-{nis(mix4)} ₪ כולל מע״מ ({nis(mix4 / (1 + VAT_RATE))} ₪ לפני מע״מ).
        </p>
      </section>

      <section aria-labelledby="includes">
        <div className={home.sectionHead}><h2 id="includes">מה כלול כשאנחנו מתקינים</h2></div>
        <div className={deal.includes}>
          {[
            { t: "מצלמה ופאנל סולארי", b: "ציוד Reolink חדש באריזה, עם אחריות שנה." },
            { t: "התקנה באתר", b: `מתקין מקצועי מקבע את המצלמות והפאנלים על גדר, קונטיינר, עמוד או קיר קיים ומכוון את הפאנלים לשמש. כ-${nis(SITE_OFFER.installDay)} ₪ + מע״מ ליום עבודה.` },
            { t: `כרטיס ${SITE_OFFER.giftCardGb}GB במתנה`, b: "מותקן בכל מצלמה, כך שהיא מקליטה מהרגע הראשון." },
            { t: "סים והגדרה", b: `הסים מותקן ומוגדר. חבילה שלנו ב-${nis(SITE_OFFER.sim.price)} ₪, או סים שלכם.` },
            { t: "אפליקציה והתראות", b: "מגדירים בנייד של כל מי שצריך: אזורי זיהוי, שעות התראה וגיבוי בענן." },
          ].map((x, i) => (
            <div key={x.t}><i>{i + 1}</i><b>{x.t}</b><p>{x.b}</p></div>
          ))}
        </div>
      </section>

      <section aria-labelledby="how">
        <div className={home.sectionHead}><h2 id="how">איך זה עובד</h2></div>
        <div className={home.ways}>
          {[
            { t: "שולחים סרטון מהאתר", b: "מסתובבים עם הנייד לאורך הגדר והכניסות ושולחים בווצאפ. נייעץ מרחוק כמה מצלמות צריך ואיפה." },
            { t: `או סיור מקצועי ב-${survey} ₪`, b: "מגיעים לאתר וקובעים יחד את הנקודות והמיקום של כל מצלמה, איפה הפאנל מקבל שמש, ובודקים קליטה." },
            { t: "מתקינים ומגדירים", b: "מתקינים את המצלמות באתר ומגדירים את האפליקציה אצל כל מי שצריך." },
            { t: "אתר נגמר? עוברים", b: "מורידים את המצלמות ומעבירים לאתר הבא. אפשר גם שנעביר אנחנו, בתיאום." },
          ].map((x, i) => (
            <div key={x.t} className={home.way}><i>{i + 1}</i><b>{x.t}</b><p>{x.b}</p></div>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq">
        <div className={home.sectionHead}><h2 id="faq">שאלות שכדאי לשאול לפני</h2></div>
        <div className={home.faq}>
          {faq.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>
      </section>

      <section id="order" className={deal.order} aria-labelledby="order-title" data-track="site_offer_form">
        <div>
          <h2 id="order-title">איך מתחילים: סרטון או סיור</h2>
          <p><b>הכי מהיר:</b> שולחים סרטון קצר מהאתר בווצאפ, ונייעץ מרחוק כמה מצלמות צריך ואיפה.</p>
          <div className={home.ctas}>
            <a className={`${home.cta} ${home.ctaWa}`} href={wa} target="_blank" rel="noopener noreferrer">לשלוח סרטון בווצאפ</a>
          </div>
          <p><b>רוצים שמישהו יגיע?</b> סיור מקצועי באתר ב-{survey} ₪. בסיור קובעים את הנקודות והמיקום של כל מצלמה, ואחריו מקבלים הצעה סגורה. משאירים פרטים ורותם חוזר לתאם.</p>
        </div>
        <SiteOfferForm surveyPrice={survey} />
      </section>

      <p className={styles.disc}>
        המחירים כוללים מע״מ אלא אם כתוב אחרת, נכונים לספטמבר 2026 ומתעדכנים לפי מחירי החנות. ציוד בלי התקנה: {BUSINESS.shipping.short}.
        הגיבוי בענן הוא מנוי של Reolink ולא כלול במחיר.
      </p>
    </main>
  );
}
