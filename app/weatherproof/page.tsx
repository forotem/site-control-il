import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { proofImages } from "../data/images";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "עמידות IP66 למזג אוויר - מצלמות 4G Reolink לשטח",
  description:
    "מצלמות אבטחה עמידות בדירוג IP66 - אטומות לגשם, אבק וחום קיצוני. עובדות מול זרמי מים חזקים במשך שנים ארוכות.",
};

export default function WeatherproofPage() {
  const breadcrumbItems = [
    { name: "תכונות", url: "/#features" },
    { name: "עמידות למזג אוויר", url: "/weatherproof" }
  ];

  return (
    <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />
      <h1>עמידות קיצונית למזג אוויר - IP66 לכל תנאי שטח</h1>
      <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>מצלמות אבטחה בעלות דירוג IP66 - אטומות לחלוטין לאבק, עמידות בפני זרמי מים חזקים, חום קיצון וקור. מתאימות לשימוש חיצוני קשה ב<Link href="/use-cases/construction" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>אתרי בנייה</Link> ו<Link href="/use-cases/agriculture" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>שטחים חקלאיים</Link>.</p>
      <Image src={proofImages.weather} alt="מצלמה עמידה לגשם" width={1440} height={864} style={{ width: "100%", height: "auto", marginBottom: '2rem' }} />
      
      <section style={{marginTop: '3rem'}}>
        <h2>מה זה IP66?</h2>
        <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem'}}>דירוג IP (Ingress Protection) מציין את רמת ההגנה של המכשיר מפני חדירת גופים מוצקים ונוזלים:</p>
        <ul style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          <li><strong>הספרה הראשונה (6):</strong> אטימה מלאה מפני אבק - אפס חדירה</li>
          <li><strong>הספרה השנייה (6):</strong> עמידות בפני זרמי מים חזקים מכל כיוון</li>
        </ul>
        
        <h2 style={{marginTop: '2rem'}}>עמידות בתנאים קיצוניים</h2>
        <ul style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          <li>טווח טמפרטורות: -10°C עד +55°C</li>
          <li>עמידות לגשמים כבדים וסופות</li>
          <li>עמידות לחום קיץ ישראלי קיצוני</li>
          <li>הגנה מפני אבק ורוח במדבר</li>
          <li>בניה חזקה עם חומרים עמידים לקרינת UV</li>
        </ul>
        
        <h2 style={{marginTop: '2rem'}}>נבדקות בשטח</h2>
        <p style={{fontSize: '1.1rem', lineHeight: '1.8'}}>ה-<Link href="/products/go" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>Reolink GO Plus</Link> וה-<Link href="/products/ptz" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>PTZ Solar</Link> עברו בדיקות קפדניות בתנאי שטח קשים - מאתרי בנייה אבקתיים ועד משקים חקלאיים חשופים לשמש ולגשם.</p>
        
        <div style={{marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
          <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>צריכים מצלמות עמידות לתנאי שטח קשים?</p>
          <Link href="/contact" style={{display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'}}>צרו קשר לייעוץ מקצועי</Link>
        </div>
      </section>
    </main>
  );
}