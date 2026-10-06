import type { Metadata } from "next";
import Link from "next/link";
import { WHATSAPP_NUMBER, WARRANTY_TEXT, productName } from "../data/store-catalog";
import { VAT_RATE } from "../data/deals";
import { SITE_OFFER, GUIDE, offerProduct, tierEquipment, installDayWithVat } from "../data/site-offer";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";
import { DistanceGuide, type GuideCamera } from "./DistanceGuide";
import { BUSINESS } from "../data/business";
import { OfferCalculator, SiteOfferForm, type CalcTier } from "./OfferCalculator";
import home from "../home.module.css";
import deal from "../deals/deals.module.css";
import styles from "./offer.module.css";

// דף הקבלנים: מצלמות לאתרי בנייה בלי חשמל ובלי אינטרנט (רותם 29.9.2026: מדריך מרחקים, התקנה עצמית, הדרכה לאיש צוות,
// מחיר לקבלנים בכמויות). הדף היחיד של האתר לכוונה "מצלמות לאתר בנייה"; /sites, /offer/construction-sites ו-/use-cases/construction מפנים לכאן.
export const metadata: Metadata = {
  title: "מצלמות לאתרי בנייה: 4G סולאריות, בלי חשמל ובלי מתקין | Site-Control",
  description: "מצלמות אבטחה לאתרי בנייה שעובדות בלי חשמל ובלי אינטרנט: סוללה, פאנל סולארי וסים 4G. מדריך מרחקים לבחירת מצלמה, התקנה עצמית בליווי או מתקין מטעמנו, מחשבון מחיר לאתר ומחיר לקבלנים.",
  alternates: { canonical: "/construction-sites" },
  robots: { index: true, follow: true },
  openGraph: { title: "מצלמות לאתרי בנייה, בלי חשמל ובלי מתקין | Site-Control", description: "מדריך מרחקים, מחשבון מחיר לאתר, התקנה עצמית בליווי שלנו.", url: "/construction-sites", type: "website", locale: "he_IL", images: ["/og-default.jpg"] },
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

export default function ConstructionSites() {
  const tiers: CalcTier[] = SITE_OFFER.tiers.map((t) => {
    const p = offerProduct(t.productSlug);
    return { id: t.id, name: t.name, tagline: t.tagline, equipment: tierEquipment(t), image: t.kitImage ?? p?.image ?? null, product: `${p ? productName(p) : t.productSlug}${t.panelSlug ? " + פאנל סולארי" : ""}`, points: t.points };
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
    { q: "באיזה מרחק המצלמה מזהה אדם או מספר רכב?", a: "זה תלוי ברזולוציה ובזווית. Go Ultra ב-4K רואה אדם עד כ-23 מטר, קוראת מספר רכב עד כ-7 מטרים ומזהה פנים עד כ-6 מטרים. TrackMix עם עדשת הזום מגיעה לקריאת מספר רכב עד כ-18 מטרים. חיישן התנועה של מצלמות הסוללה מתחיל הקלטה עד כ-10 מטרים, ולכן מציבים את המצלמה קרוב לשער, למחסן או לקונטיינר. במדריך המרחקים בדף הזה אפשר לבדוק כל מרחק." },
    { q: "אפשר להתקין לבד, בלי מתקין?", a: "כן, וזה חוסך את רוב עלות ההתקנה. תולים את המצלמה ואת הפאנל על גדר, קונטיינר או עמוד, מכניסים סים וכרטיס זיכרון, וסורקים את הברקוד באפליקציה של Reolink. אין חיווט ואין חשמלאי. אנחנו מלווים בטלפון, בווצאפ או בשיחת וידאו עד שהמצלמה עובדת." },
    { q: "יש לנו הרבה אתרים בכל הארץ. מה הכי משתלם?", a: "במקום לשלוח מתקין לכל אתר, אנחנו מדריכים איש צוות אחד מטעמכם, והוא מתקין ומעביר מצלמות בין האתרים. חבילת הדרכה בתיאום, בשיחת וידאו או באחד האתרים. רוצים בכל זאת מתקינים? יש לנו מתקינים שעובדים איתנו." },
    { q: "יש מחיר לקבלנים?", a: "כן. על 5 מצלמות ומעלה, או כמה אתרים יחד, כתבו לנו כמה צריך ונחזור עם מחיר לקבלנים. המחירים בדף הם מחירי החנות למצלמה בודדת." },
    { q: "כמה עולה ההתקנה?", a: `זה תלוי במיקום, במורכבות ובכמות המצלמות. יום עבודה של מתקין מקצועי הוא כ-${nis(SITE_OFFER.installDay)} ₪ + מע״מ, ובאתר רגיל מתקינים ביום עד ${SITE_OFFER.camsPerDay} מצלמות על גדר, קונטיינר או עמוד קיים. צריך עמוד ייעודי, הרמה או עבודה בגובה? נגיד מראש. המחיר הסופי נסגר אחרי שרואים את האתר, בסרטון או בסיור, ולפני שמתחילים.` },
    { q: "אפשר בלי שתגיעו לאתר קודם?", a: `כן. שולחים סרטון קצר מהאתר בווצאפ, לאורך הגדר והכניסות, ונייעץ מרחוק כמה מצלמות צריך ואיפה. רוצים שמישהו מקצועי יגיע? סיור באתר עולה ${survey} ₪, ובמהלכו קובעים את הנקודות והמיקום של כל מצלמה.` },
    { q: "המצלמות מקליטות כל הזמן?", a: `מצלמות סוללה מקליטות כשיש תנועה, וכך הסוללה מחזיקה עם הפאנל. צריך הקלטה רציפה 24/7, למשל על השער הראשי? יש ערכת ${plus ? productName(plus) : "TrackMix LTE Plus"} עם פאנל 66W${plus?.price ? ` ב-${nis(plus.price)} ₪` : ""} שמקליטה ברצף גם בלי חשמל.` },
    { q: "מה קורה בחורף או כשמעונן?", a: "הפאנל טוען גם ביום מעונן, והסוללה מחזיקה כמה ימים בלי שמש. בהתקנה מכוונים את הפאנל לדרום ובלי צל, וזה מה שקובע. ובנקודה שיש לידה חשמל עדיף לחבר ל-5V, ואז זה בכלל לא תלוי בשמש." },
    { q: "אפשר לחבר את המצלמות לחשמל במקום לפאנל?", a: "כן, וזו ההמלצה שלנו בכל נקודה שיש לידה חשמל: קונטיינר, משרד האתר או לוח חשמל זמני. המצלמה צריכה 5V, כמו מטען של טלפון, בכבל דק, בלי חשמלאי ובלי סכנה. כך היא עובדת לאורך כל הפרויקט בלי תלות בשמש, והסוללה נשארת גיבוי אם החשמל נופל. בנקודות שאין לידן חשמל משאירים פאנל סולארי." },
    { q: "המצלמה מתקשרת למשטרה לבד?", a: "לא. היא שולחת לכם התראה עם תמונה, אתם רואים שידור חי ויכולים לדבר דרכה עם מי שנכנס. את ההחלטה אם להזעיק משטרה או שומר מקבלים אתם, כשכבר ברור מה קורה." },
    { q: "כמה עולה הגיבוי בענן?", a: "הענן הוא מנוי חודשי של Reolink שמשלמים ישירות להם, והמחיר תלוי במספר המצלמות ובכמה ימים שומרים. נעזור לבחור מסלול ולהפעיל אותו כבר בהתקנה." },
    { q: "כמה גלישה המצלמה צורכת?", a: `מעט. ההקלטה לכרטיס לא צורכת גלישה בכלל, והגלישה משמשת להתראות, לצפייה מהנייד ולענן. סים וגלישה שלנו: ${nis(SITE_OFFER.sim.price)} ₪ לשנה למצלמה. אפשר גם סים משלכם מכל חברה.` },
    { q: "צריך קליטה סלולרית במקום?", a: "כן. בכל אתר בודקים קליטה לפני ההתקנה." },
    { q: "אפשר כמה אנשים באפליקציה?", a: "כן. מנהל העבודה, מנהל הפרויקט והמשרד יכולים לראות את אותן מצלמות, כל אחד בנייד שלו." },
    { q: "איפה אתם מתקינים?", a: `${BUSINESS.installAreaIn}. יש לכם אתרים במרכז, בצפון ובדרום? מתאמים לפי אזור.` },
  ];

  const crumbs = [{ name: "חנות", url: "/store" }, { name: "מצלמות לאתרי בנייה", url: "/construction-sites" }];
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  const guideCams: GuideCamera[] = GUIDE.cameras.map((c) => ({ ...c, image: offerProduct(c.slug)?.image ?? null }));

  return (
    <main className={home.wrap} data-lead-page="construction_sites">
      <BreadcrumbSchema items={crumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Breadcrumb items={crumbs} />
      <header className={deal.hero}>
        <div className={deal.heroText}>
          <span className={deal.badge}>לקבלנים ולמנהלי עבודה</span>
          <h1 className={deal.title}>מצלמות לאתרי בנייה, בלי חשמל ובלי אינטרנט</h1>
          <p className={deal.lead}>
            סוללה, פאנל סולארי וסים 4G בכל מצלמה. מתריעות לנייד כשמישהו נכנס, מצלמות בצבע בלילה, ואפשר לדבר דרכן. לא חייבים מתקין: תולים, מכניסים סים וסורקים ברקוד באפליקציה, ואנחנו מלווים מרחוק.
          </p>
          <div className={deal.price}>
            <strong>מ-{nis(value.equipment)} ₪ <small>למצלמה</small></strong>
            <span>ציוד כולל מע״מ: מצלמה + פאנל סולארי. מתקינים בעצמכם בליווי שלנו, או מתקין מטעמנו: כ-{nis(SITE_OFFER.installDay)} ₪ + מע״מ ליום עבודה. 5 מצלמות ומעלה: מחיר לקבלנים.</span>
          </div>
          <div className={home.ctas}>
            <a className={`${home.cta} ${home.ctaAccent}`} href="#guide">איזו מצלמה מתאימה לי?</a>
            <a className={`${home.cta} ${home.ctaGhost}`} href="#calc">מחשבון מחיר לאתר</a>
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
            <img src={SITE_OFFER.tiers[1].kitImage ?? hero.image} alt={`${hero.title}${SITE_OFFER.tiers[1].kitImage ? ", עם פאנל סולארי" : ""}`} />
            <em>{productName(hero)}{SITE_OFFER.tiers[1].kitImage ? " + פאנל סולארי" : ""}</em>
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

      {/* רותם 6.10.2026, אחרי שיחה עם קבלן: "אם באמת רוצים להיות ב-100% בטוחים שאין תקלות, זה נכון לחבר את זה לחשמל" */}
      <section aria-labelledby="power">
        <div className={home.sectionHead}>
          <h2 id="power">סולארי או חשמל? ההמלצה שלנו</h2>
          <p>המצלמות עובדות עם סוללה ופאנל סולארי, ובלי שמש הסוללה מחזיקה כמה ימים. אבל אם רוצים להיות בטוחים במאה אחוז שאין תקלות לאורך כל הפרויקט, אנחנו ממליצים לחבר לחשמל בכל נקודה שיש לידה חשמל. באתר בנייה הפאנל טוען פחות ממה שנדמה: בחורף, באבק ובצל של הבניין שעולה. וכשעובדים באתר כל היום יש הרבה תנועה, וכל הקלטה צורכת סוללה.</p>
        </div>
        <div className={styles.split}>
          <div><b>זה לא קו חשמל</b><p>המצלמה צריכה 5V, כמו מטען של טלפון. כבל דק, בלי חשמלאי ובלי סכנה, גם במקום שבו מסוכן למתוח קו חשמל רגיל.</p></div>
          <div><b>איפה יש חשמל באתר</b><p>בקונטיינר, במשרד האתר או בלוח החשמל הזמני. מחברים את המצלמות שקרובות אליהם, והסוללה נשארת גיבוי אם החשמל באתר נופל.</p></div>
          <div><b>פאנל סולארי לנקודות בלי חשמל</b><p>גדר רחוקה, פינה של המגרש או מצלמה שזזה הרבה בין נקודות. בשער, אם יש חשמל קרוב, אפשר גם <Link href="/store/reolink-trackmix-wired-lte">TrackMix Wired LTE</Link>, שמיועדת לחשמל קבוע ומקליטה 24/7.</p></div>
        </div>
      </section>

      <section id="guide" className={styles.calcSection} aria-labelledby="guide-title">
        <div className={home.sectionHead}>
          <h2 id="guide-title">איזו מצלמה מתאימה למרחק שלכם?</h2>
          <p>לכל אתר צורך אחר: יש מי שצריך לראות שמישהו נכנס בלילה, יש מי שצריך לקרוא מספר של משאית בשער, ויש מי שצריך לזהות פנים. בוחרים מה חשוב ובאיזה מרחק, ורואים מה כל מצלמה באמת תראה.</p>
        </div>
        <DistanceGuide goals={GUIDE.goals} cameras={guideCams} />
      </section>

      <section aria-labelledby="diy">
        <div className={home.sectionHead}>
          <h2 id="diy">לא חייבים מתקין</h2>
          <p>אין חיווט, אין חשמלאי ואין תקשורת לפרוס. מי שיודע להחזיק מקדחה מתקין מצלמה כזאת, ואנחנו מלווים מרחוק עד שהיא עובדת.</p>
        </div>
        <div className={home.ways}>
          {[
            { t: "תולים", b: "את המצלמה ואת הפאנל הסולארי על גדר, קונטיינר, עמוד או קיר, עם הזרוע והברגים שבאריזה. הפאנל פונה לדרום, בלי צל." },
            { t: "מכניסים סים וכרטיס", b: "סים עם גלישה מכל חברה, או החבילה שלנו, וכרטיס זיכרון להקלטה בתוך המצלמה." },
            { t: "סורקים ברקוד", b: "באפליקציה של Reolink סורקים את הברקוד שעל המצלמה, נותנים לה שם, וזהו. מגדירים שעות התראה ומשתפים את מי שצריך." },
          ].map((x, i) => (
            <div key={x.t} className={home.way}><i>{i + 1}</i><b>{x.t}</b><p>{x.b}</p></div>
          ))}
        </div>
        <div className={styles.split}>
          <div><b>יש לכם כמה אתרים?</b><p>במקום לשלוח מתקין לכל אתר, מדריכים איש צוות אחד מטעמכם. הוא מתקין, מעביר מצלמות בין האתרים ומכיר את המערכת. חבילת הדרכה בתיאום, בשיחת וידאו או באחד האתרים.</p></div>
          <div><b>צריכים בכל זאת מתקין?</b><p>יש לנו מתקינים שעובדים איתנו. יום עבודה של מתקין מקצועי הוא כ-{nis(SITE_OFFER.installDay)} ₪ + מע״מ, ובאתר רגיל מתקינים עד {SITE_OFFER.camsPerDay} מצלמות ביום.</p></div>
          <div><b>מחיר לקבלנים</b><p>המחירים באתר פתוחים לכולם. על 5 מצלמות ומעלה, או כמה אתרים יחד, כתבו לנו כמה צריך ונחזור עם מחיר לקבלנים.</p></div>
        </div>
      </section>

      <section id="calc" className={styles.calcSection} aria-labelledby="calc-title">
        <div className={home.sectionHead}>
          <h2 id="calc-title">שתי חבילות, מחיר לאתר</h2>
          <p>בוחרים כמה מצלמות בכל אתר, כמה אתרים, ואם מתקינים בעצמכם או עם מתקין מטעמנו. הציוד במחירי החנות. ההתקנה מחושבת לפי ימי עבודה של מתקין, והיא הערכה עד שרואים את האתר.</p>
        </div>
        <OfferCalculator tiers={tiers} installDay={SITE_OFFER.installDay} camsPerDay={SITE_OFFER.camsPerDay} sim={SITE_OFFER.sim} camsOptions={SITE_OFFER.camsOptions}
          sitesMax={SITE_OFFER.sitesMax} vatRate={VAT_RATE} giftCardGb={SITE_OFFER.giftCardGb} />
        <p className={styles.mix}>
          <b>מה שהכי נפוץ אצל קבלנים:</b> {best.name} אחת על הכניסה, שמתקרבת ועוקבת אחרי מי שנכנס, והחסכונית בהיקף.
          ארבע מצלמות כאלה באתר, עם סים ויום התקנה: כ-{nis(mix4)} ₪ כולל מע״מ ({nis(mix4 / (1 + VAT_RATE))} ₪ לפני מע״מ).
        </p>
      </section>

      <section aria-labelledby="includes">
        <div className={home.sectionHead}><h2 id="includes">מה כלול כשמתקין מטעמנו מגיע</h2></div>
        <div className={deal.includes}>
          {[
            { t: "מצלמה ופאנל סולארי", b: "ציוד Reolink חדש באריזה, עם אחריות שנה." },
            { t: "התקנה באתר", b: `מתקין מקצועי מקבע את המצלמות והפאנלים על גדר, קונטיינר, עמוד או קיר קיים ומכוון את הפאנלים לשמש. כ-${nis(SITE_OFFER.installDay)} ₪ + מע״מ ליום עבודה.` },
            { t: `כרטיס ${SITE_OFFER.giftCardGb}GB במתנה`, b: "מותקן בכל מצלמה, כך שהיא מקליטה מהרגע הראשון." },
            { t: "סים והגדרה", b: `הסים מותקן ומוגדר. סים וגלישה שלנו ב-${nis(SITE_OFFER.sim.price)} ₪ לשנה, או סים שלכם.` },
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
            { t: "מתקינים ומגדירים", b: "בעצמכם בליווי שלנו, או עם מתקין מטעמנו. מגדירים את האפליקציה אצל כל מי שצריך." },
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
