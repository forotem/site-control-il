import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { proofImages } from "../data/images";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "גיבוי ענן אוטומטי - מצלמות 4G Reolink | הגנה על צילומים",
  description:
    "גיבוי ענן בגודול 4G - כל צילומים מגובים אוטומטית לענן. שמירה בטוחה, צפייה מממקום בעולם, ראיות יה גם בגנטטו.",
};

export default function CloudBackupPage() {
  const breadcrumbItems = [
    { name: "תכונות", url: "/#features" },
    { name: "גיבוי ענן", url: "/cloud-backup" }
  ];

  return (
    <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />
      <h1>גיבוי ענן בזמן אמת - הגנה מקסימלית על הצילומים</h1>
      <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>כל צילום מגובה אוטומטית לענן ב-4G - גם אם המצלמה נגנבת, נהרסת או נפגעת, הצילומים שמורים בבטחה. גישה מיידית מכל מכשיר עם החשבון שלכם.</p>
      <Image src={proofImages.cloud} alt="גיבוי ענן לצילומי אבטחה" width={1440} height={867} style={{ width: "100%", height: "auto", marginBottom: '2rem' }} />
      
      <section style={{marginTop: '3rem'}}>
        <h2>יתרונות הגיבוי הענן</h2>
        <ul style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          <li><strong>הגנה מפני גניבה:</strong> גם אם המצלמה נגנבת, הצילומים שמורים בענן</li>
          <li><strong>גיבוי אוטומטי:</strong> העלאה רציפה ב-4G ללא צורך בהתערבות</li>
          <li><strong>גישה מכל מקום:</strong> צפו בצילומים מכל מכשיר עם אינטרנט</li>
          <li><strong>שיתוף קל:</strong> שתפו סרטונים עם צוות, משטרה או ביטוח</li>
          <li><strong>אחסון מאובטח:</strong> הצפנה מלאה של כל הצילומים</li>
        </ul>
        
        <h2 style={{marginTop: '2rem'}}>אחסון כפול לביטחון מקסימלי</h2>
        <p style={{fontSize: '1.1rem', lineHeight: '1.8'}}>בנוסף לגיבוי הענן, המצלמות שלנו כוללות גם כרטיס microSD מקומי בנפח עד 256GB. בזכך יש לכם גיבוי כפול - גם מקומי וגם בענן. כל המצלמות שלנו - <Link href="/products/go" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>GO Plus</Link> ו-<Link href="/products/ptz" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>PTZ</Link> - תומכות באחסון כפול זה.</p>
        
        <div style={{marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
          <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>מעוניינים במערכת עם גיבוי ענן אוטומטי?</p>
          <Link href="/packages" style={{display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'}}>צפו בחבילות שלנו</Link>
        </div>
      </section>
    </main>
  );
}