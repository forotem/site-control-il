import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { proofImages } from "../../data/images";
import { Breadcrumb, BreadcrumbSchema } from "../../components/Breadcrumb";

export const metadata: Metadata = {
  title: "מצלמות אבטחה לחקלאות 2026 - פיקוח סולארי 4G לשטחים חקלאיים | Site-Control",
  description:
    "מצלמות אבטחה לחקלאות ולשטחים חקלאיים: פיקוח מרחוק 24/7 ללא חשמל עם מצלמות סולאריות 4G. אבטחת שטחים חקלאיים, ניטור גדרות ומרעה, גיבוי ענן אוטומטי, ראיית לילה צבעונית. התקנה מהירה ללא תשתיות.",
  keywords: [
    'מצלמות אבטחה לחקלאות',
    'אבטחת שטחים חקלאיים',
    'מצלמות סולאריות לחקלאות',
    'מצלמות אבטחה לשטחים חקלאיים',
    'מצלמות 4G לחקלאות',
    'פיקוח שטחים חקלאיים',
  ],
  alternates: { canonical: 'https://site-control-il.com/use-cases/agriculture' },
};

export default function AgricultureUseCasePage() {
  const breadcrumbItems = [
    { name: "תחומי שימוש", url: "/use-cases" },
    { name: "שטחים חקלאיים", url: "/use-cases/agriculture" }
  ];

  return (
    <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />
      <h1>מצלמות אבטחה לחקלאות - אבטחת שטחים חקלאיים ללא תשתיות</h1>
      <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>מצלמות אבטחה לשטחים חקלאיים עם טכנולוגיה סולארית 4G - מיגון ציוד חקלאי, ניטור גדרות ומרעה, ופיקוח מרחוק על שטחים פתוחים. ללא צורך בחשמל או אינטרנט, המצלמות הסולאריות שלנו מספקות פתרון עמיד ואמין לתנאים הקשים ביותר בשטח.</p>
      <Image src={proofImages.weather} alt="מצלמה עמידה לגשם" width={1440} height={864} sizes="(max-width: 768px) 100vw, 900px" priority style={{ width: "100%", height: "auto", marginBottom: '2rem' }} />
      
      <section style={{marginTop: '3rem'}}>
        <h2>יתרונות למשקים חקלאיים</h2>
        <ul style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          <li>התקנה פשוטה בכל מקום - ללא צורך בתשתית חשמל</li>
          <li><Link href="/products/ptz" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>PTZ מסתובבת 360°</Link> לכיסוי שטח רחב</li>
          <li>ראיית לילה צבעונית לזיהוי מדויק</li>
          <li><Link href="/weatherproof" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>עמידות קיצונית</Link> לשמש, גשם ואבק</li>
          <li><Link href="/cloud-backup" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>גיבוי ענן אוטומטי</Link> - גם אם המצלמה נגנבת</li>
          <li>צפייה חיה מהסמארטפון בכל מקום</li>
        </ul>
        
        <div style={{marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
          <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>רוצים להגן על המשק החקלאי שלכם?</p>
          <Link href="/contact" style={{display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'}}>צרו קשר לייעוץ חינם</Link>
        </div>
      </section>

      <section style={{marginTop: '3rem'}}>
        <h2>למה לבחור במצלמות אבטחה סולאריות לחקלאות?</h2>
        <p style={{fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem'}}>שטחים חקלאיים מציבים אתגרים ייחודיים: אין חשמל, אין אינטרנט קווי, ומרחקים גדולים מהנקודה הקרובה ביותר. מצלמות אבטחה סולאריות עם 4G פותרות את כל הבעיות האלו בבת אחת.</p>
        <ul style={{fontSize: '1.05rem', lineHeight: '2'}}>
          <li><strong>אנרגיה סולארית עצמאית</strong> - פאנל סולארי וסוללת גיבוי מאפשרים עבודה 24/7</li>
          <li><strong>חיבור 4G LTE</strong> - שידור חי וגיבוי ענן ללא תלות באינטרנט</li>
          <li><strong>זיהוי חכם</strong> - הבחנה בין אדם, רכב ובעל חיים למניעת אזעקות שווא</li>
          <li><strong>עמידות IP66</strong> - עומדות בחום, קור, גשם ואבק</li>
          <li><strong>צפייה מהאפליקציה</strong> - ניטור בזמן אמת מכל מקום בעולם</li>
        </ul>
      </section>

      <section style={{marginTop: '3rem'}}>
        <h2>תחומי שימוש נפוצים באבטחת שטחים חקלאיים</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem'}}>
          <div style={{padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
            <h3>מטעים ופרדסים</h3>
            <p>הגנה על יבול יקר מפני גניבה וונדליזם, ניטור מערכות השקיה ומעקב אחר עובדים.</p>
          </div>
          <div style={{padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
            <h3>רפתות ולולים</h3>
            <p>פיקוח על בעלי חיים, ניטור מרחוק של תנאי הסביבה ואיתור בעיות בזמן אמת.</p>
          </div>
          <div style={{padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
            <h3>חממות ובתי צמיחה</h3>
            <p>מעקב אחרי תנאי גידול, זיהוי חדירות ותיעוד שלבי צמיחה בטיימלאפס.</p>
          </div>
          <div style={{padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
            <h3>ציוד חקלאי</h3>
            <p>הגנה על טרקטורים, מכונות קציר וציוד יקר השוהה בשטח פתוח.</p>
          </div>
        </div>
      </section>

      <section style={{marginTop: '3rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
        <h2>שאלות נפוצות על מצלמות אבטחה לחקלאות</h2>
        <div style={{marginTop: '1rem'}}>
          <h3>כמה עולה מצלמת אבטחה סולארית לשטח חקלאי?</h3>
          <p>מצלמות סולאריות 4G מתחילות מ-2,999 ₪ כולל פאנל סולארי וגיבוי ענן. <Link href="/packages" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>ראו חבילות מחירים</Link>.</p>
          <h3>האם המצלמות עובדות בלילה?</h3>
          <p>כן, כל המצלמות שלנו מצוידות בראיית לילה צבעונית עד 10 מטר ואינפרא אדום עד 15 מטר.</p>
          <h3>האם אפשר לתעד את השטח בטיימלאפס?</h3>
          <p>בהחלט! המצלמות תומכות בצילום טיימלאפס אוטומטי לתיעוד שינויים עונתיים ושלבי גידול. למידע נוסף על שירותי טיימלאפס מקצועיים, בקרו ב-<a href="https://timelapseit.co.il" target="_blank" rel="noopener" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>TimeLapseIt</a>.</p>
        </div>
      </section>
    </main>
  );
}