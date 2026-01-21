import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'אודות Site-Control | בשיתוף Reolink',
  description: 'Site-Control - ספק מוביל של מצלמות אבטחה סולאריות 4G בשיתוף Reolink. פתרונות מתקדמים לאתרי בנייה וחקלאות.',
};

export default function AboutPage() {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>אודות Site-Control</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>שיתוף פעולה עם Reolink - יצרנית מובילה בעולם במצלמות אבטחה מתקדמות</p>
      </div>

      {/* Partnership Section */}
      <section style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '8px', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#007bff', marginBottom: '1.5rem', borderBottom: '2px solid #007bff', paddingBottom: '0.5rem' }}>
          בשיתוף עם Reolink
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ color: '#333', marginTop: 0 }}>מי זה Reolink?</h3>
            <p style={{ lineHeight: '1.6', color: '#555' }}>
              Reolink היא חברה מובילה בתחום מצלמות האבטחה המתקדמות, מפתחת ומייצרת מצלמות איכות גבוהה עם טכנולוגיות חדישות כמו 4G, סולארי, ו-AI.
            </p>
          </div>
          <div>
            <h3 style={{ color: '#333', marginTop: 0 }}>מה אנחנו מציעים?</h3>
            <p style={{ lineHeight: '1.6', color: '#555' }}>
              Site-Control משתמשת בציוד מובחר של Reolink כדי להציע פתרונות בטחוניים מותאמים לתנאי הקרקע הישראלי - מאתרי בנייה ועד שטחים חקלאיים בודדים.
            </p>
          </div>
          <div>
            <h3 style={{ color: '#333', marginTop: 0 }}>למה Reolink?</h3>
            <p style={{ lineHeight: '1.6', color: '#555' }}>
              Reolink ידועה בעולם בגיבוי ענן מתקדם, ממשק משתמש ידידותי, ותמיכה בטכנולוגיות אלחוטיות כמו סולארי ו-4G.
            </p>
          </div>
        </div>
      </section>

      {/* Application Info */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1.5rem' }}>אפליקציית Reolink</h2>
        <div style={{ background: 'white', border: '2px solid #007bff', borderRadius: '8px', padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ color: '#007bff' }}>🔴 Live Streaming</h3>
              <p>צפו בשידור חי מיידי מכל המצלמות שלכם בזמן אמת, מכל מקום בעולם.</p>
            </div>
            <div>
              <h3 style={{ color: '#007bff' }}>☁️ Cloud Backup</h3>
              <p>גיבוי אוטומטי של כל הצילומים בענן. גם אם המצלמה נגנבת, הראיות בטוחות.</p>
            </div>
            <div>
              <h3 style={{ color: '#007bff' }}>🎥 Playback</h3>
              <p>חזור ובדוק צילומים קודמים ישירות מהאפליקציה - בלי צורך במחשב.</p>
            </div>
            <div>
              <h3 style={{ color: '#007bff' }}>📢 Alerts & Notifications</h3>
              <p>קבל התראות מיידיות בנייד כשמתחוור אזור מסוים או יש תנועה חשודה.</p>
            </div>
            <div>
              <h3 style={{ color: '#007bff' }}>👥 Team Share</h3>
              <p>שתף גישה לצוות שלך - מנהל אתר, בעל עסק, או משכנתא בנק.</p>
            </div>
            <div>
              <h3 style={{ color: '#007bff' }}>🔧 Pan-Tilt-Zoom</h3>
              <p>שלוט מרחוק בתנועת המצלמה - הטה, סובב וזום ישר מהנייד.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '1.5rem' }}>טכנולוגיות שלנו</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { title: '☀️ סולארי', desc: 'טעינה אוטומטית מהשמש - 365 יום בשנה' },
            { title: '📡 4G', desc: 'חיבור אינטרנט דרך סיים - בלי צורך בWiFi' },
            { title: '☁️ Reolink Cloud', desc: 'שרתים בעולם עם הצפנה מקצועית' },
            { title: '🤖 AI Detection', desc: 'זיהוי חכם של תנועה, אנשים וכלים' },
            { title: '📹 4K Video', desc: 'קרוב פי 4 לפרטים עדיין בהשוואה ל-HD' },
            { title: '🌧️ IP67', desc: 'עמיד לגשם, שלג, אבק וחום קיצוני' },
          ].map((tech, idx) => (
            <div key={idx} style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', borderRight: '4px solid #007bff' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{tech.title}</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>{tech.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', color: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', marginTop: 0 }}>מעוניין בפתרון מתקדם?</h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>צור קשר עם הצוות שלנו לקבלת ייעוץ חינם</p>
        <a href="/contact" style={{ display: 'inline-block', background: 'white', color: '#007bff', padding: '0.75rem 2rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', transition: 'all 0.3s' }}>
          צור קשר עכשיו
        </a>
      </section>
    </main>
  );
}
