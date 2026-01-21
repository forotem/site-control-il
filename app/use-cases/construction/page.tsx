import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { proofImages } from "../../data/images";
import { Breadcrumb, BreadcrumbSchema } from "../../components/Breadcrumb";

export const metadata: Metadata = {
  title: "מצלמות אבטחה לאתרי בנייה סולארי 4G | ללא חשמל",
  description:
    "מצלמות אבטחה סולאריות 4G לאתרי בנייה עם Reolink. הגנה מפני גניבה, תיעוד התקדמות, גיבוי ענן אוטומטי וסירט 24/7. פתרון מושלם לאתרים גדולים.",
};

export default function ConstructionUseCasePage() {
  const breadcrumbItems = [
    { name: "תחומי שימוש", url: "/use-cases" },
    { name: "אתרי בנייה", url: "/use-cases/construction" }
  ];

  return (
    <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />
      <h1>מצלמות אבטחה לאתרי בנייה - ללא חשמל וללא אינטרנט</h1>
      <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>כיסוי היקפי לאתרי בנייה ללא תשתיות, כולל <Link href="/cloud-backup" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>גיבוי ענן</Link> והתראות חכמות. המצלמות הסולאריות 4G שלנו מספקות פתרון מושלם להגנה על ציוד, מניעת גניבות ותיעוד התקדמות העבודה.</p>
      <Image src={proofImages.quality} alt="איכות 4K לאתרי בנייה" width={1440} height={712} sizes="(max-width: 768px) 100vw, 900px" priority style={{ width: "100%", height: "auto", marginBottom: '2rem' }} />
      
      <section style={{marginTop: '3rem'}}>
        <h2>למה מצלמות 4G מושלמות לאתרי בנייה?</h2>
        <ul style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          <li>ללא צורך בחשמל - <Link href="/products/go" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>פאנל סולארי וסוללה מובנית</Link></li>
          <li>ללא צורך באינטרנט - חיבור סלולרי 4G LTE</li>
          <li><Link href="/video-quality" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>איכות 4K</Link> לזיהוי פרטים קטנים</li>
          <li><Link href="/weatherproof" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>עמידות קיצונית למזג אוויר</Link> - IP66</li>
          <li>התראות חכמות עם זיהוי אנשים ורכבים</li>
        </ul>
        
        <div style={{marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
          <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>מעוניינים בפתרון מלא לאתר הבנייה שלכם?</p>
          <Link href="/packages" style={{display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'}}>צפו בחבילות המלאות שלנו</Link>
        </div>
      </section>
    </main>
  );
}