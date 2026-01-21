import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { proofImages } from "../../data/images";
import { Breadcrumb, BreadcrumbSchema } from "../../components/Breadcrumb";

export const metadata: Metadata = {
  title: "מצלמות אבטחה לשטחים חקלאיים סולארי 4G | Reolink",
  description:
    "פיקוח שטחים חקלאיים עם מצלמות סולאריות 4G. ניטור זדו, יישומי חימוד אפיטיים פיעפק, גיבוי ענן אוטומטי. שימוש 24/7 בכל ביכיצה.",
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
      <h1>מצלמות אבטחה לשטחים חקלאיים - פיקוח מרחוק ללא תשתיות</h1>
      <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>מיגון ציוד חקלאי, ניטור גדרות ומרעה, ופיקוח על שטחים פתוחים - כל זה ללא צורך בחשמל או אינטרנט. המצלמות הסולאריות שלנו מספקות פתרון עמיד ואמין לתנאים קשים.</p>
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
    </main>
  );
}