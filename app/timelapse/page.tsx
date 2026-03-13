import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema } from "../components/Schema";
import { BASE_URL } from "../config";

export const metadata: Metadata = {
  title: "טיימלאפס לאתרי בנייה - תיעוד ויזואלי מקצועי | Site-Control",
  description:
    "שירות טיימלאפס מקצועי לאתרי בנייה ופרויקטים בשיתוף timelapseit.co.il. מצלמות סולאריות 4G ללא חשמל, תיעוד כל שלב, סרטון מוגמר ללקוחות ויזמים. מ-550 ₪ לחודש.",
  keywords: [
    "טיימלאפס לאתר בנייה",
    "תיעוד בנייה טיימלאפס",
    "סרטון התקדמות בנייה",
    "טיימלאפס פרויקט נדלן",
    "מצלמת טיימלאפס סולארית",
    "תיעוד ויזואלי קבלן",
    "timelapse בנייה ישראל",
    "סרטון בנייה ליזמים",
  ],
  alternates: {
    canonical: `${BASE_URL}/timelapse`,
  },
  openGraph: {
    title: "טיימלאפס לאתרי בנייה | Site-Control × timelapseit.co.il",
    description:
      "שירות טיימלאפס מקצועי לאתרי בנייה — מצלמה סולארית 4G + עריכת סרטון מוגמר. ראו דוגמאות ב-timelapseit.co.il",
    type: "website",
    locale: "he_IL",
    siteName: "Site-Control",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "טיימלאפס לאתרי בנייה",
  description:
    "שירות תיעוד טיימלאפס מקצועי לאתרי בנייה ופרויקטים — מצלמה סולארית 4G ללא תשתיות, גיבוי ענן, ועריכת סרטון מוגמר",
  provider: {
    "@type": "Organization",
    name: "Site-Control",
    url: BASE_URL,
    sameAs: ["https://timelapseit.co.il"],
  },
  areaServed: { "@type": "Country", name: "Israel" },
  offers: {
    "@type": "Offer",
    price: "550",
    priceCurrency: "ILS",
    priceSpecification: { "@type": "UnitPriceSpecification", unitText: "month" },
    availability: "https://schema.org/InStock",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "כמה עולה שירות טיימלאפס לאתר בנייה?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "השירות עולה 550 ₪ לחודש וכולל מצלמה ייעודית, גיבוי חודשי, ועריכת סרטון סיום. סרטוני ביניים בתוספת תשלום.",
      },
    },
    {
      "@type": "Question",
      name: "האם המצלמה צריכה חשמל?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "לא. המצלמה פועלת על פאנל סולארי וסוללה מובנית, ומתקשרת דרך 4G LTE. אין צורך בחשמל, WiFi, או אינטרנט באתר.",
      },
    },
    {
      "@type": "Question",
      name: "מה מקבלים בסוף הפרויקט?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "סרטון טיימלאפס מוגמר ומעורך המתעד את כל שלבי הבנייה. הסרטון מתאים לשיווק, הצגה ללקוחות ויזמים, ולארכיב.",
      },
    },
    {
      "@type": "Question",
      name: "כמה זמן לוקחת ההתקנה?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ההתקנה לוקחת כ-2 שעות ואפשרית בכל אתר — גם ללא תשתיות חשמל. המצלמה מוכנה לצלם מיד עם ההתקנה.",
      },
    },
  ],
};

export default function TimelapsePage() {
  const breadcrumbItems = [
    { name: "בעמוד הבית", url: "/" },
    { name: "טיימלאפס", url: "/timelapse" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 6rem" }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "2rem" }}>
          <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>דף הבית</Link>
          <span> / </span>
          <span>טיימלאפס</span>
        </nav>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,194,255,0.1)",
            border: "1px solid rgba(0,194,255,0.3)",
            borderRadius: "999px",
            padding: "6px 18px",
            fontSize: "0.85rem",
            color: "#00c2ff",
            marginBottom: "1.5rem",
            letterSpacing: "0.05em",
          }}>
            בשיתוף עם timelapseit.co.il
          </div>
          <h1 style={{ fontSize: "2.8rem", lineHeight: "1.2", marginBottom: "1.2rem", maxWidth: "800px", margin: "0 auto 1.2rem" }}>
            טיימלאפס לאתרי בנייה —<br />תעדו כל שלב, רשימו כל רגע
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--muted)", maxWidth: "680px", margin: "0 auto 2.5rem", lineHeight: "1.8" }}>
            אנחנו מציעים שירות תיעוד טיימלאפס מקצועי לאתרי בנייה, יזמים וקבלנים — בשיתוף פעולה עם{" "}
            <a href="https://timelapseit.co.il" target="_blank" rel="noopener" style={{ color: "#00c2ff", fontWeight: 600 }}>
              timelapseit.co.il
            </a>
            , המומחים לצילום טיימלאפס בנייה בישראל.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="button" style={{ fontSize: "1.05rem", padding: "16px 36px" }}>
              קבל הצעת מחיר
            </Link>
            <a
              href="https://timelapseit.co.il"
              target="_blank"
              rel="noopener"
              className="button secondary"
              style={{ fontSize: "1.05rem", padding: "16px 36px" }}
            >
              ראה דוגמאות ב-timelapseit.co.il ←
            </a>
          </div>
        </div>

        {/* Partnership Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(0,194,255,0.08) 0%, rgba(123,45,255,0.08) 100%)",
          border: "1px solid rgba(0,194,255,0.2)",
          borderRadius: "20px",
          padding: "2.5rem",
          marginBottom: "4rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
          alignItems: "center",
        }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Site-Control × timelapseit.co.il
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: "1.8" }}>
              Site-Control מתמחה במצלמות סולאריות 4G ותשתיות צילום ללא חשמל.{" "}
              <a href="https://timelapseit.co.il" target="_blank" rel="noopener" style={{ color: "#00c2ff" }}>
                timelapseit.co.il
              </a>{" "}
              מתמחה בצילום, עריכה ויצירת סרטוני טיימלאפס מקצועיים. ביחד — אנחנו מספקים פתרון מלא מהתקנה ועד סרטון מוגמר.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: "📹", text: "מצלמה סולארית 4G — ללא חשמל, ללא WiFi" },
              { icon: "☁️", text: "גיבוי ענן אוטומטי — כל תמונה בטוחה" },
              { icon: "🎬", text: "עריכת סרטון מקצועית — מוכן לשיווק" },
              { icon: "📍", text: "התקנה בכל אתר — גם מרוחק ומבודד" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.95rem" }}>
                <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
                <span style={{ color: "var(--muted)" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Video Examples Section */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.75rem", textAlign: "center" }}>
            דוגמאות מעבודות שלנו
          </h2>
          <p style={{ textAlign: "center", color: "var(--muted)", marginBottom: "2.5rem" }}>
            סרטוני הטיימלאפס הבאים צולמו עם מצלמות סולאריות 4G שלנו ועורכו על ידי{" "}
            <a href="https://timelapseit.co.il" target="_blank" rel="noopener" style={{ color: "#00c2ff" }}>
              timelapseit.co.il
            </a>
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem" }}>
            {/*
              TODO: החלף את ה-VIDEO_ID_1, VIDEO_ID_2, VIDEO_ID_3
              ב-IDs האמיתיים מ-YouTube/Vimeo שלך
              לדוגמה YouTube: https://www.youtube.com/watch?v=VIDEO_ID_1
              Vimeo: https://vimeo.com/VIDEO_ID_1
            */}
            {[
              { id: "VIDEO_ID_1", title: "פרויקט בנייה - תל אביב" },
              { id: "VIDEO_ID_2", title: "מגדל מגורים - ירושלים" },
              { id: "VIDEO_ID_3", title: "מתחם מסחרי - חיפה" },
            ].map((video, i) => (
              <div key={i} style={{
                background: "var(--glass)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
              }}>
                {video.id === "VIDEO_ID_1" || video.id === "VIDEO_ID_2" || video.id === "VIDEO_ID_3" ? (
                  /* Placeholder עד שתחליף עם ID אמיתי */
                  <a
                    href="https://timelapseit.co.il"
                    target="_blank"
                    rel="noopener"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "220px",
                      background: "linear-gradient(135deg, rgba(0,194,255,0.1) 0%, rgba(123,45,255,0.1) 100%)",
                      textDecoration: "none",
                      gap: "12px",
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="rgba(0,194,255,0.8)" stroke="none">
                      <circle cx="12" cy="12" r="10" fill="rgba(0,194,255,0.15)" stroke="rgba(0,194,255,0.4)" strokeWidth="1.5"/>
                      <polygon points="10 8 16 12 10 16 10 8" fill="#00c2ff"/>
                    </svg>
                    <span style={{ color: "#00c2ff", fontSize: "0.9rem" }}>צפה ב-timelapseit.co.il</span>
                  </a>
                ) : (
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    />
                  </div>
                )}
                <div style={{ padding: "1rem 1.25rem" }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>{video.title}</p>
                  <a
                    href="https://timelapseit.co.il"
                    target="_blank"
                    rel="noopener"
                    style={{ fontSize: "0.82rem", color: "#00c2ff", textDecoration: "none" }}
                  >
                    עריכה: timelapseit.co.il ↗
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <a
              href="https://timelapseit.co.il"
              target="_blank"
              rel="noopener"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#00c2ff",
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
                padding: "12px 28px",
                border: "1px solid rgba(0,194,255,0.3)",
                borderRadius: "12px",
                transition: "all 0.3s",
              }}
            >
              לכל הדוגמאות באתר timelapseit.co.il ←
            </a>
          </div>
        </section>

        {/* How it works */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2.5rem", textAlign: "center" }}>
            איך זה עובד?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              { step: "01", title: "ייעוץ חינם", desc: "נגיע לאתר, נבין את הפרויקט ונמליץ על מיקום המצלמה הכי אפקטיבי." },
              { step: "02", title: "התקנה", desc: "מתקינים מצלמה סולארית 4G תוך שעתיים — ללא חפירות, ללא חשמלאי." },
              { step: "03", title: "צילום רציף", desc: "המצלמה מצלמת אוטומטית לפי לוח זמנים. כל התמונות נשמרות בענן." },
              { step: "04", title: "סרטון מוגמר", desc: "בסוף הפרויקט (או לפי בקשה), timelapseit.co.il עורכים סרטון מוגמר." },
            ].map((item) => (
              <div key={item.step} style={{
                padding: "2rem 1.5rem",
                background: "var(--glass)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-xl)",
                position: "relative",
              }}>
                <div style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "rgba(0,194,255,0.15)",
                  lineHeight: 1,
                  marginBottom: "0.75rem",
                  fontFamily: "monospace",
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.6rem" }}>{item.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: "1.7", margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>מחיר ותמורה</h2>
          <div style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "linear-gradient(135deg, rgba(0,194,255,0.08) 0%, rgba(0,102,255,0.06) 100%)",
            border: "1px solid rgba(0,194,255,0.25)",
            borderRadius: "20px",
            padding: "2.5rem",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "0.85rem", color: "#00c2ff", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>
              תוספת טיים-לאפס
            </div>
            <div style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "0.25rem" }}>
              550 ₪
              <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--muted)" }}>/חודש</span>
            </div>
            <p style={{ color: "var(--muted)", marginBottom: "2rem", fontSize: "0.95rem" }}>
              ניתן לצרף לכל חבילת אבטחה קיימת
            </p>
            <ul style={{ listStyle: "none", padding: 0, textAlign: "right", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "מצלמה ייעודית לתיעוד (סולארית 4G)",
                "גיבוי ענן חודשי של כל הצילומים",
                "עריכת סרטון סיום מקצועי",
                "סרטוני ביניים — בתוספת",
                "שיתוף דיגיטלי ללקוחות ויזמים",
              ].map((b, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00c2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  {b}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="button">
                שדרג לטיימלאפס
              </Link>
              <Link href="/packages" className="button secondary">
                ראה כל החבילות
              </Link>
            </div>
          </div>
        </section>

        {/* Why timelapse */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>
            למה טיימלאפס לפרויקט הבנייה שלכם?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[
              {
                title: "שיווק ופרסום",
                desc: "סרטון מרשים של הבנייה מחזיר את ההשקעה כבר בפרסום הפרויקט הבא. יזמים שמשתמשים בטיימלאפס מדווחים על עלייה ניכרת במכירות.",
                icon: "📈",
              },
              {
                title: "תיעוד משפטי",
                desc: "ויכוח עם קבלן משנה? תלונה על עיכובים? הטיימלאפס מתעד כל יום ושעה — הוכחה חזותית שאי אפשר לערער עליה.",
                icon: "⚖️",
              },
              {
                title: "פיקוח מרחוק",
                desc: "ראו כל שלב מכל מקום. הצגה ללוח המנהלים, לשותפים, לבנקים — בלחיצת כפתור.",
                icon: "👁️",
              },
              {
                title: "קונטנט לרשתות",
                desc: "סרטוני טיימלאפס של בנייה הם אחד הסוגי תוכן הכי ויראליים ב-Instagram, LinkedIn ו-YouTube.",
                icon: "📱",
              },
            ].map((item) => (
              <div key={item.title} style={{
                padding: "1.75rem",
                background: "var(--glass)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius-xl)",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.6rem" }}>{item.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: "1.7", margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>שאלות נפוצות</h2>
          <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              {
                q: "האם המצלמה צריכה חשמל?",
                a: "לא. המצלמה פועלת על פאנל סולארי וסוללה מובנית, ומשדרת דרך 4G LTE. אפשר להתקין בכל מקום — גם בלב שטח ללא תשתיות.",
              },
              {
                q: "כמה עולה השירות?",
                a: "550 ₪ לחודש כתוספת לחבילת האבטחה. כולל מצלמה ייעודית, גיבוי ענן, ועריכת סרטון סיום מקצועי. ניתן להזמין סרטוני ביניים בתוספת תשלום.",
              },
              {
                q: "מי מטפל בעריכת הסרטון?",
                a: 'שותפינו timelapseit.co.il — מומחי טיימלאפס בנייה עם ניסיון בפרויקטים גדולים ברחבי ישראל. ראו דוגמאות עבודות באתר שלהם.',
              },
              {
                q: "כמה זמן לוקחת ההתקנה?",
                a: "כ-2 שעות. אנחנו מגיעים לאתר, מתקינים את המצלמה ומגדירים אותה. המצלמה מתחילה לצלם מיד.",
              },
              {
                q: "האם אפשר להוסיף על חבילה קיימת?",
                a: "כן — זו בדיוק הכוונה. אם יש לך כבר חבילת אבטחה שלנו, תוספת הטיימלאפס מוסיפה מצלמה ייעודית לתיעוד ושירות עריכה.",
              },
            ].map((item, i) => (
              <details key={i} style={{
                padding: "1.25rem 1.5rem",
                background: "var(--glass)",
                border: "1px solid var(--glass-border)",
                borderRadius: "var(--radius)",
              }}>
                <summary style={{ fontWeight: 600, cursor: "pointer", fontSize: "1rem" }}>
                  {item.q}
                </summary>
                <p style={{ marginTop: "0.75rem", color: "var(--muted)", lineHeight: "1.8", margin: "0.75rem 0 0" }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section style={{
          textAlign: "center",
          padding: "4rem 2rem",
          background: "linear-gradient(135deg, rgba(0,194,255,0.1) 0%, rgba(0,102,255,0.08) 50%, rgba(123,45,255,0.1) 100%)",
          border: "1px solid rgba(0,194,255,0.15)",
          borderRadius: "var(--radius-xl)",
        }}>
          <h2 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
            מוכנים לתעד את הפרויקט שלכם?
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: "560px", margin: "0 auto 2rem", fontSize: "1.05rem", lineHeight: "1.8" }}>
            צרו קשר לייעוץ חינם. נגיע לאתר, נתאים פתרון, ונדאג שכל שלב יתועד.{" "}
            <a href="https://timelapseit.co.il" target="_blank" rel="noopener" style={{ color: "#00c2ff" }}>
              ראו דוגמאות ב-timelapseit.co.il
            </a>
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="button" style={{ fontSize: "1.1rem", padding: "18px 40px" }}>
              קבל הצעת מחיר חינם
            </Link>
            <a
              href="https://timelapseit.co.il"
              target="_blank"
              rel="noopener"
              className="button secondary"
              style={{ fontSize: "1.1rem", padding: "18px 40px" }}
            >
              דוגמאות עבודות ←
            </a>
          </div>
        </section>

      </main>
    </>
  );
}
