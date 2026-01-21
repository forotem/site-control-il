import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { proofImages } from "../data/images";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "איכות 4K במצלמות אבטחה | יום וילה צבעוניגגה",
  description:
    "שטחטור הגר ב-4K עם Reolink לראיית יה צבעוניגגה. ראייה לילה בצבעים, IR מאויד. תמונות HDR אטוכר. משטיח לפטטי בנייה.",
};;

export default function VideoQualityPage() {
  const breadcrumbItems = [
    { name: "תכונות", url: "/#features" },
    { name: "איכות וידאו 4K", url: "/video-quality" }
  ];

  return (
    <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />
      <h1>איכות וידאו 4K - חדות מקסימלית ביום ובלילה</h1>
      <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>רזולוציה גבוהה של 4K (3840×2160) מאפשרת זיהוי פרטים קטנים - לוחיות רישוי, פנים, וציוד. ראיית לילה צבעונית מספקת תמונה ברורה גם בחושך מוחלט, בניגוד למצלמות מסורתיות עם ראיית לילה בשחור-לבן.</p>
      <Image src={proofImages.quality} alt="וידאו 4K לאתרי בנייה" width={1440} height={712} style={{ width: "100%", height: "auto", marginBottom: '2rem' }} />
      
      <section style={{marginTop: '3rem'}}>
        <h2>למה איכות 4K חשובה?</h2>
        <ul style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          <li><strong>זיהוי פרטים:</strong> ראו בבירור פנים, לוחיות רישוי ופרטי ציוד</li>
          <li><strong>ראיות משפטיות:</strong> וידאו איכותי מתקבל כראיה בבית משפט</li>
          <li><strong>זום דיגיטלי:</strong> הגדלת תמונה מוקלטת ללא איבוד איכות</li>
          <li><strong>ראיית לילה צבעונית:</strong> זיהוי צבעי בגדים ורכבים גם בחושך</li>
        </ul>
        
        <h2 style={{marginTop: '2rem'}}>המצלמות שלנו</h2>
        <p style={{fontSize: '1.1rem', lineHeight: '1.8'}}>גם ה-<Link href="/products/go" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>Reolink GO Plus</Link> וגם ה-<Link href="/products/ptz" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>PTZ Solar</Link> מצוידות באיכות 4K, עם ראיית לילה צבעונית, HDR לתמונה מאוזנת, וזיהוי AI חכם לאנשים ורכבים.</p>
        
        <div style={{marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
          <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>רוצים לראות את האיכות בעצמכם?</p>
          <Link href="/contact" style={{display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'}}>בקשו הדגמה</Link>
        </div>
      </section>
    </main>
  );
}