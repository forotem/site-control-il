import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { productImages } from "../../data/images";
import { ProductSchema } from "../../components/Schema";
import { Breadcrumb, BreadcrumbSchema } from "../../components/Breadcrumb";

export const metadata: Metadata = {
  title: "רעולינק PTZ Solar 4G - מצלמה מסתובבת | אאטרים",
  description:
  "מצלמת Reolink PTZ Solar עם זום אופטי 8x, סיבוב 360°, חיבור 4G, גיבוי ענן ורזולוציית 4K — פתרון אידיאלי לשטחים גדולים.",
};

export default function PtzProductPage() {
  const breadcrumbItems = [
    { name: "מוצרים", url: "/#products" },
    { name: "Reolink PTZ Solar", url: "/products/ptz" }
  ];

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />
      <h1>מצלמת Reolink PTZ Solar 4G - שליטה מלאה ב360°</h1>
      <Image src={productImages.ptz} alt="מצלמת PTZ סולארית" width={954} height={1080} sizes="(max-width: 768px) 100vw, 600px" priority style={{ width: "100%", height: "auto", marginBottom: '2rem' }} />
      
      <section style={{marginBottom: '3rem'}}>
        <h2>תכונות מרכזיות</h2>
        <ul className="list" style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          <li><strong>PTZ מסתובבת 360°</strong> - סיבוב, הטיה וזום מ<Link href="/use-cases/remote" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>שליטה מרחוק</Link></li>
          <li>זום אופטי 8x - הגדלת פרטים ללא איבוד איכות</li>
          <li>חיבור 4G LTE - ללא צורך ב-WiFi או אינטרנט</li>
          <li><Link href="/cloud-backup" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>גיבוי ענן אוטומטי</Link> ב-4G בזמן אמת</li>
          <li><Link href="/video-quality" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>רזולוציה 4K</Link> עם ראיית לילה צבעונית</li>
          <li>מעקב אוטומטי אחר תנועה עם AI</li>
          <li><Link href="/weatherproof" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>עמידות IP66</Link> - מזג אוויר קשה</li>
          <li>פאנל סולארי + סוללה מובנית - ללא צורך בחשמל</li>
          <li>אחסון כפול: microSD עד 256GB + ענן</li>
        </ul>
      </section>
      
      <section style={{marginTop: '3rem'}}>
        <h2>מה זה PTZ?</h2>
        <p style={{fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem'}}>PTZ הוא ראשי תיבות של Pan-Tilt-Zoom: מצלמה שמסתובבפת 360 מעלות אופקית ו-90 מעלות אנכית, עם יכולת זום אופטי להגדלת פרטים. באמצעות האפליקציה תוכלו לשלוט במצלמה מרחוק, להטותה ולזום לכל נקודה שתרצו.</p>
        
        <h3>יתרונות ה-PTZ</h3>
        <ul style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          <li>כיסוי שטח רחב עם מצלמה אחת</li>
          <li>מעקב אוטומטי אחר פולשים ורכבים</li>
          <li>הגדלת פרטים בזום 8x</li>
          <li>שליטה מלאה מרחוק באפליקציה</li>
          <li>נקודות צפייה מוגדרות מראש</li>
        </ul>
      </section>
      
      <section style={{marginTop: '3rem'}}>
        <h2>מתאימה ל</h2>
        <ul style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          <li><Link href="/use-cases/construction" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>אתרי בנייה גדולים</Link> - סריקה על כל האתר עם מצלמה אחת</li>
          <li><Link href="/use-cases/agriculture" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>משקים חקלאיים</Link> - מעקב אחר בעלי חיים וציוד</li>
          <li>חניונים - כיסוי מקיף של כל המגרש</li>
          <li>מחסנים - פיקוח על כל המתקן</li>
          <li>אתרים מבודדים הדורשים כיסוי רחב</li>
        </ul>
        
        <div style={{marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
          <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>מחפשים פתרון מלא עם התקנה? צפו בחבילות שלנו או צרו קשר לייעוץ.</p>
          <Link href="/packages" style={{display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', marginLeft: '1rem'}}>צפו בחבילות</Link>
          <Link href="/contact" style={{display: 'inline-block', padding: '12px 24px', background: 'transparent', color: 'var(--accent)', border: '2px solid var(--accent)', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'}}>צרו קשר</Link>
        </div>
        
        <p style={{marginTop: '2rem', fontSize: '1rem', color: 'var(--muted)'}}>מחפשים פתרון פשוט יותר? ראו את ה-<Link href="/products/go" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>Reolink GO Plus</Link> הקבועה.</p>
      </section>

      <ProductSchema name="Reolink PTZ Solar" description="מצלמת PTZ סולארית 4G עם שליטה מרחוק" />
    </main>
  );
}