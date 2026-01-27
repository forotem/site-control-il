import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מנעולים חכמים ביומטריים 2026 - המדריך המלא לדלת הכניסה | Site-Control',
  description: 'מנעולים חכמים ביומטריים 2026 - המדריך המלא לדלת הכניסה - מדריך מקצועי מלא. מנעול חכם ביומטרי, מנעול טביעת אצבע לדלת, מנעול חכם לדלת כניסה, מנעול חכם עם מצלמה, התקנת מנעול חכם, אבטחת בית חכם',
  keywords: 'מנעול חכם ביומטרי, מנעול טביעת אצבע לדלת, מנעול חכם לדלת כניסה, מנעול חכם עם מצלמה, התקנת מנעול חכם, אבטחת בית חכם',
};

export default function BlogPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <article>
        {/* Hero Image */}
        <div style={{ marginBottom: '3rem' }}>
          <img 
            src="/blog-images/מנעולים-חכמים-ביומטריים-2026-המדריך-המלא-לדלת-הכני/hero.svg" 
            alt="מנעולים חכמים ביומטריים 2026 - המדריך המלא לדלת הכניסה"
            style={{ width: '100%', borderRadius: '12px' }}
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#0070f3' }}>
          מנעולים חכמים ביומטריים 2026 - המדריך המלא לדלת הכניסה
        </h1>

        {/* Content */}
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <p># מנעולים חכמים ביומטריים 2026 - המדריך המלא לדלת הכניסה</p>
<p></p>
<p>## מבוא</p>
<p>מערכות אבטחה חכמות הפכו לחיוניות בשנת 2026...</p>
<p></p>
<p>## תכונות עיקריות</p>
<p>- זיהוי פנים מתקדם</p>
<p>- ניתוח בזמן אמת</p>
<p>- אינטגרציה עם בית חכם</p>
<p></p>
<p>## יתרונות</p>
<p>המערכות החכמות מציעות...</p>
        </div>

        {/* Infographic */}
        <div style={{ margin: '3rem 0', textAlign: 'center' }}>
          <img 
            src="/blog-images/מנעולים-חכמים-ביומטריים-2026-המדריך-המלא-לדלת-הכני/infographic.svg" 
            alt="אינפוגרפיק"
            style={{ width: '100%', maxWidth: '800px' }}
          />
        </div>

        {/* CTA */}
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          padding: '2rem', 
          borderRadius: '12px',
          marginTop: '3rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#0070f3' }}>מעוניינים במערכת אבטחה חכמה?</h3>
          <p>קבלו ייעוץ מקצועי וחינם</p>
          <a href="/contact" style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: '#0070f3',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            marginTop: '1rem'
          }}>
            צרו קשר עכשיו
          </a>
        </div>
      </article>
    </div>
  );
}