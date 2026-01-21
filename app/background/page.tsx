import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'עיצוב ברקע - Site-Control',
  description: 'חומרי עיצוב וברקע לשימוש ב-Site-Control',
};

export default function BackgroundPage() {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333' }}>עיצוב ברקע</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>חומרי עיצוב וברקע לשימוש בפרויקט</p>
      </div>

      {/* Pattern Backgrounds */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1.5rem' }}>דוגמות רקע</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {/* Pattern 1 - Diagonal */}
          <div style={{
            background: 'linear-gradient(45deg, #007bff 25%, #0056b3 25%, #0056b3 50%, #007bff 50%, #007bff 75%, #0056b3 75%, #0056b3)',
            backgroundSize: '20px 20px',
            padding: '2rem',
            borderRadius: '8px',
            color: 'white',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>רקע אלכסוני</h3>
              <p style={{ margin: '0.5rem 0 0 0' }}>דוגמה לדפוס אלכסוני</p>
            </div>
          </div>

          {/* Pattern 2 - Dots */}
          <div style={{
            background: 'radial-gradient(circle, #28a745 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundColor: '#f5f5f5',
            padding: '2rem',
            borderRadius: '8px',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>רקע נקודות</h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>דוגמה לדפוס נקודות</p>
            </div>
          </div>

          {/* Pattern 3 - Grid */}
          <div style={{
            background: 'linear-gradient(#e0e0e0 1px, transparent 1px), linear-gradient(90deg, #e0e0e0 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>רקע רשת</h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>דוגמה לדפוס רשת</p>
            </div>
          </div>

          {/* Pattern 4 - Gradient */}
          <div style={{
            background: 'linear-gradient(135deg, #007bff 0%, #00d4ff 100%)',
            padding: '2rem',
            borderRadius: '8px',
            color: 'white',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>גראדיאנט</h3>
              <p style={{ margin: '0.5rem 0 0 0' }}>גראדיאנט מהדרגה</p>
            </div>
          </div>

          {/* Pattern 5 - Waves */}
          <div style={{
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 20\'%3E%3Cpath d=\'M0,10 Q5,0 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10\' stroke=\'%23007bff\' stroke-width=\'1\' fill=\'none\'/%3E%3C/svg%3E")',
            backgroundSize: '100px 20px',
            backgroundColor: '#f0f8ff',
            padding: '2rem',
            borderRadius: '8px',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>גלים</h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>דוגמה לדפוס גלים</p>
            </div>
          </div>

          {/* Pattern 6 - Hexagon */}
          <div style={{
            background: 'linear-gradient(120deg, #28a745 25%, transparent 25%), linear-gradient(240deg, #28a745 25%, transparent 25%), linear-gradient(0deg, #28a745 25%, transparent 25%)',
            backgroundSize: '30px 30px',
            backgroundColor: '#f5f5f5',
            padding: '2rem',
            borderRadius: '8px',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>משושים</h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>דוגמה לדפוס משושים</p>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1.5rem' }}>팔레ט צבעים</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'כחול ראשי', color: '#007bff', hex: '#007bff' },
            { name: 'כחול כהה', color: '#0056b3', hex: '#0056b3' },
            { name: 'ירוק', color: '#28a745', hex: '#28a745' },
            { name: 'אדום', color: '#dc3545', hex: '#dc3545' },
            { name: 'כתום', color: '#fd7e14', hex: '#fd7e14' },
            { name: 'אפור בהיר', color: '#f5f5f5', hex: '#f5f5f5' },
            { name: 'אפור כהה', color: '#333', hex: '#333' },
            { name: 'לבן', color: '#ffffff', hex: '#ffffff' },
          ].map((color, idx) => (
            <div key={idx} style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ background: color.color, height: '120px' }} />
              <div style={{ padding: '1rem', background: 'white' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 'bold', color: '#333' }}>
                  {color.name}
                </p>
                <code style={{ fontSize: '0.85rem', color: '#666' }}>{color.hex}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1.5rem' }}>טיפוגרפיה</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#333' }}>כותרת ראשית</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Heading 1 - 2.5rem</p>
          </div>
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#333' }}>כותרת משנית</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Heading 2 - 2rem</p>
          </div>
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#333' }}>כותרת שלישית</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Heading 3 - 1.5rem</p>
          </div>
          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: '#333' }}>טקסט רגיל</p>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Body - 1.05rem</p>
          </div>
        </div>
      </section>

      {/* Icons Grid */}
      <section>
        <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '1.5rem' }}>אייקונים זמינים</h2>
        <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '8px' }}>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            האתר משתמש באייקונים מ-SVG icon library. הקבצים זמינים בתקיית <code>איקונים svg</code>:
          </p>
          <ul style={{ color: '#555', lineHeight: '1.8' }}>
            <li>bullet-camera.optimized.svg - אייקון מצלמה bullet</li>
            <li>dome-camera.optimized.svg - אייקון מצלמה כיפה</li>
            <li>ptz-camera.optimized.svg - אייקון מצלמה PTZ</li>
            <li>brick-wall.optimized.svg - אייקון קיר לבנים</li>
            <li>lock-2.optimized.svg - אייקון נעילה</li>
            <li>key-security.optimized.svg - אייקון אבטחה מפתח</li>
            <li>vehicle-security.optimized.svg - אייקון אבטחה כלי רכב</li>
            <li>wallmount-camera.optimized.svg - אייקון מצלמה על קיר</li>
            <li>smart-home-connection.optimized.svg - אייקון בית חכם</li>
            <li>fire-alarm-button.optimized.svg - אייקון כפתור אזעקה</li>
            <li>secured-by-alarm-system.optimized.svg - אייקון מוגן על ידי מערכת אזעקה</li>
            <li>smart-home-checked.optimized.svg - אייקון בית חכם מאושר</li>
            <li>unlock-2.optimized.svg - אייקון פתיחה</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
