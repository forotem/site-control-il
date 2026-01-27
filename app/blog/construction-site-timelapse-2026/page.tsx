import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'צילום טיימלאפס לאתרי בנייה 2026 - לתעד את ההצלחה | Site-Control',
  description: 'מדריך מקיף לצילום טיימלאפס באתרי בנייה: שיווק פרויקטים, בקרה הנדסית, ותיעוד משפטי. גלו איך מצלמות חכמות משפרות את ניהול האתר.',
  keywords: 'צילום טיימלאפס, בנייה, ניהול פרויקטים, מצלמות אבטחה, שיווק נדלן, תיעוד בנייה',
  openGraph: {
    title: 'צילום טיימלאפס לאתרי בנייה 2026',
    description: 'המדריך המלא לתיעוד אתרי בנייה',
    images: ['/blog-images/construction-site-timelapse-2026/hero.webp'],
  },
};

export default function BlogPage() {
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: '1.6',
      color: '#333'
    }}>
      <article>
        {/* Hero Image */}
        <div style={{ marginBottom: '3rem' }}>
          <img
            src="/blog-images/construction-site-timelapse-2026/hero.webp"
            alt="צילום טיימלאפס לאתרי בנייה - מבט על"
            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 112, 243, 0.15)' }}
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0070f3' }}>
          צילום טיימלאפס לאתרי בנייה 2026 - לתעד את ההצלחה
        </h1>

        <header style={{ marginBottom: '3rem', textAlign: 'center', borderBottom: '2px solid #0070f3', paddingBottom: '2rem' }}>
          <div style={{ color: '#666', fontSize: '1rem' }}>
            <span>מעודכן ל-27.1.2026</span> •
            <span> זמן קריאה: 8 דקות</span> •
            <span> פתרונות לעסקים</span>
          </div>
        </header>

        {/* Introduction */}
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: '500',
            color: '#0070f3',
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderLeft: '4px solid #0070f3',
            borderRadius: '0 8px 8px 0'
          }}>
            בניית גורד שחקים או שכונת מגורים היא תהליך שלוקח שנים. אבל איך מספרים את הסיפור הזה בדקה אחת?
            מערכות צילום טיימלאפס (Timelapse) הפכו לכלי חובה עבור יזמים וקבלנים ב-2026, ומספקות הרבה יותר מאשר סרטון יפה.
          </p>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            1. מעבר ליופי: הערך העסקי של טיימלאפס
          </h2>

          <p>
            בעוד שכולנו נהנים לראות בניין צומח מהאדמה בהילוך מהיר, הערך האמיתי של המערכת טמון ביכולות הניהול והבקרה שהיא מספקת בזמן אמת.
          </p>

          <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div style={{ backgroundColor: '#fff7ed', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f97316' }}>
              <h3 style={{ color: '#ea580c', marginTop: '0', fontSize: '1.2rem' }}>📢 שיווק מנצח</h3>
              <p>אין כלי שיווקי חזק יותר מסרטון שמראה את התקדמות הפרויקט. משקיעים, רוכשים ושותפים רוצים לראות בעיניים שהעסק "זז".</p>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #0070f3' }}>
              <h3 style={{ color: '#0284c7', marginTop: '0', fontSize: '1.2rem' }}>👷 בקרה וניהול</h3>
              <p>מנהל הפרויקט יכול "לחזור בזמן" לכל תאריך ושעה, לבדוק מתי הגיע המנוף, מתי נוצקה התקרה, ולזהות עיכובים בזמן אמת.</p>
            </div>
            <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #64748b' }}>
              <h3 style={{ color: '#475569', marginTop: '0', fontSize: '1.2rem' }}>⚖️ תיעוד משפטי</h3>
              <p>במקרה של מחלוקת עם קבלני משנה או תאונה באתר, הצילום הרציף ברזולוציה גבוהה (4K/8K) משמש כראיה חד משמעית.</p>
            </div>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            2. הטכנולוגיה: איך זה עובד?
          </h2>

          <p>המצלמות המודרניות שלנו ב-Site-Control הן יחידות אוטונומיות לחלוטין:</p>

          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem', paddingRight: '1rem', borderRight: '4px solid #f97316' }}>
              <strong>📸 איכות 4K/8K:</strong> צילום תמונות סטילס באיכות על-גבוהה כל 5-15 דקות.
            </li>
            <li style={{ marginBottom: '1rem', paddingRight: '1rem', borderRight: '4px solid #f97316' }}>
              <strong>☀️ אנרגיה סולארית:</strong> פאנל סולארי מובנה וסוללת גיבוי מאפשרים עבודה רציפה גם ללא חיבור לחשמל.
            </li>
            <li style={{ marginBottom: '1rem', paddingRight: '1rem', borderRight: '4px solid #f97316' }}>
              <strong>☁️ גיבוי בענן:</strong> כל תמונה עולה מיד לענן מאובטח, כך ששום מידע לא הולך לאיבוד גם אם המצלמה נפגעת.
            </li>
          </ul>

          {/* Infographic Image */}
          <div style={{ margin: '4rem 0', textAlign: 'center' }}>
            <img
              src="/blog-images/construction-site-timelapse-2026/infographic.webp"
              alt="אינפוגרפיק הערך העסקי של טיימלאפס"
              style={{ width: '100%', maxWidth: '800px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>תרשים: הערך העסקי של מערכת טיימלאפס</p>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            3. מה מקבלים בסוף הפרויקט?
          </h2>

          <p>בסיום הפרויקט, צוות העריכה שלנו מפיק עבורכם:</p>
          <ol>
            <li><strong>סרטון טיימלאפס מלא:</strong> דקה וחצי שמסכמת שנתיים של עבודה.</li>
            <li><strong>סרטוני "היילייטס":</strong> דגש על שלבים קריטיים (יציקות בטון, הרכבת מנופים).</li>
            <li><strong>פורטל גישה היסטורי:</strong> גישה לכל התמונות שצולמו אי פעם באתר, מסודרות לפי תאריך ושעה.</li>
          </ol>

          {/* CTA Section */}
          <div style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', // Orange theme for construction
            color: 'white',
            padding: '3rem',
            borderRadius: '12px',
            marginTop: '4rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(249, 115, 22, 0.3)'
          }}>
            <h2 style={{ marginTop: '0', fontSize: '2rem', color: 'white' }}>מנהלים פרויקט בנייה?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: '0.9' }}>
              אל תתנו לפרויקט שלכם לחמוק מהרדאר. תיעוד מקצועי הוא הנכס הכי חשוב שלכם.<br />
              השאירו פרטים לקבלת הצעת מחיר למערכת טיימלאפס סולארית.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/contact" style={{
                backgroundColor: 'white',
                color: '#f97316',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'inline-block'
              }}>
                קבלו הצעה
              </a>
            </div>
          </div>

        </div>
      </article>
    </div>
  );
}