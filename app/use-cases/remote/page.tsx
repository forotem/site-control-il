import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { appShots } from "../../data/images";
import { Breadcrumb, BreadcrumbSchema } from "../../components/Breadcrumb";

export const metadata: Metadata = {
  title: "ניהול ראות מנוה גדולים עם מצלמות 4G | Reolink",
  description:
    "צפייה חיה, שליטה מרחוק, טל מכל מקום. מצלמות 4G סולאריות פרי אתרים מרחוקים. AI דחורים, אחסון כפול, עדכון קלטטוט.",
};

export default function RemoteUseCasePage() {
  const breadcrumbItems = [
    { name: "תחומי שימוש", url: "/use-cases" },
    { name: "אתרים מבודדים", url: "/use-cases/remote" }
  ];

  return (
    <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />
      <h1>ניהול אתרים מבודדים - שליטה מלאה מכל מקום</h1>
      <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>ניהול ובקרה מרחוק ללא תלות בתשתיות - הכל מהאפליקציה. צפייה חיה, גישה לצילומים, שיתוף עם צוות ושליטה מלאה במצלמות <Link href="/products/go" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>4G סולאריות</Link> מכל מקום בעולם.</p>
      
      <section style={{marginBottom: '3rem'}}>
        <h2>תכונות האפליקציה</h2>
        <ul style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem'}}>
          <li>צפייה חיה (Live View) בזמן אמת</li>
          <li>גישה לצילומים מוקלטים ב<Link href="/cloud-backup" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>ענן</Link> ובכרטיס SD</li>
          <li>התראות Push עם תמונות על זיהוי תנועה</li>
          <li>שליטה ב-<Link href="/products/ptz" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>PTZ</Link> - סיבוב, הטיה וזום מרחוק</li>
          <li>הפעלת זרקור וסירנה להרתעה</li>
          <li>שיתוף גישה עם עובדים ובני משפחה</li>
          <li>ממשק בעברית - קל ונוח לשימוש</li>
        </ul>
        
        {appShots.map((shot) => (
          <Image
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            sizes="(max-width: 768px) 100vw, 900px"
            style={{ width: "100%", height: "auto", marginBottom: 12 }}
          />
        ))}
      </section>
      
      <div style={{marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
        <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>מוכנים להתחיל לפקח על האתר שלכם מרחוק?</p>
        <Link href="/packages" style={{display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', marginLeft: '1rem'}}>צפו בחבילות</Link>
        <Link href="/contact" style={{display: 'inline-block', padding: '12px 24px', background: 'transparent', color: 'var(--accent)', border: '2px solid var(--accent)', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'}}>צרו קשר</Link>
      </div>
    </main>
  );
}