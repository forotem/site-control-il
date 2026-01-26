import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { productImages } from "../../data/images";
import { ProductSchema } from "../../components/Schema";
import { ImageGallery } from "../../components/ImageGallery";
import { Breadcrumb, BreadcrumbSchema } from "../../components/Breadcrumb";

export const metadata: Metadata = {
  title: "רעולינק GO Plus 4G מצלמת סולארית | אתרי בנייה",
  description:
    "מצלמת Reolink GO Plus 4G - פתרון סולארי מעופציים. 4K, ראיית לילה צבעונית, חיבור 4G LTE, דירוג IP66. שיפור ידעוני למטי אבטחה אחדט.",
};

const galleryImages = [
  { src: "/optimized-variants/2 סוגי המצלמה/reolink-go-plus-security-camera.optimized-w1080.avif", alt: "מצלמת Reolink GO Plus - זווית חזית" },
  { src: "/optimized-variants/2 סוגי המצלמה/reolink-go-plus-security-camera.optimized-w1440.avif", alt: "מצלמת Reolink GO Plus - זווית צד" },
  { src: "/optimized-variants/2 סוגי המצלמה/reolink-go-plus-security-camera.optimized-w1920.avif", alt: "מצלמת Reolink GO Plus - תקריב פנל סולארי" },
];

export default function GoProductPage() {
  const breadcrumbItems = [
    { name: "מוצרים", url: "/#products" },
    { name: "Reolink GO Plus 4G", url: "/products/go" }
  ];

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />
      <h1>מצלמת Reolink GO Plus 4G - פתרון סולארי מושלם ללא תשתיות</h1>
      <Image src={productImages.go} alt="מצלמת Reolink GO Plus" width={1440} height={999} sizes="(max-width: 768px) 100vw, 800px" priority style={{ width: "100%", height: "auto", marginBottom: '2rem' }} />
      
      <section style={{marginBottom: '3rem'}}>
        <h2>תכונות מרכזיות</h2>
        <ul className="list" style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          <li>ללא חשמל/אינטרנט - פאנל סולארי + חיבור 4G LTE</li>
          <li><Link href="/cloud-backup" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>גיבוי ענן בזמן אמת</Link> - גם אם המצלמה נגנבת</li>
          <li>זיהוי תנועה AI לאנשים ורכבים</li>
          <li><Link href="/video-quality" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>איכות 4K</Link> עם ראיית לילה צבעונית</li>
          <li><Link href="/weatherproof" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>עמידות IP66</Link> - מזג אוויר קשה</li>
          <li>סוללה מובנית 9000mAh עם טעינה סולארית</li>
          <li>צפייה חיה ושליטה מ<Link href="/use-cases/remote" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>כל מקום באפליקציה</Link></li>
          <li>אחסון מקומי microSD עד 256GB + גיבוי ענן</li>
        </ul>
      </section>

      <section style={{ margin: '3rem 0' }}>
        <h2>גלריית תמונות</h2>
        <ImageGallery images={galleryImages} />
      </section>
      
      <section style={{marginTop: '3rem'}}>
        <h2>מתאימה ל</h2>
        <ul style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          <li><Link href="/use-cases/construction" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>אתרי בנייה</Link> - הגנה על ציוד ומניעת גניבות</li>
          <li><Link href="/use-cases/agriculture" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>שטחים חקלאיים</Link> - ניטור ציוד, מרעה וגדרות</li>
          <li>מחסנים ומתקני אחסון מבודדים</li>
          <li>חניות רכב ומגרשים פרטיים</li>
          <li>כל מקום ללא גישה לחשמל או WiFi</li>
        </ul>
        
        <div style={{marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
          <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>רוצים פתרון מלא עם התקנה? צפו בחבילות שלנו או צרו קשר לייעוץ.</p>
          <Link href="/packages" style={{display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', marginRight: '1rem'}}>צפו בחבילות</Link>
          <Link href="/contact" style={{display: 'inline-block', padding: '12px 24px', background: 'transparent', color: 'var(--accent)', border: '2px solid var(--accent)', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'}}>צרו קשר</Link>
        </div>
        
        <p style={{marginTop: '2rem', fontSize: '1rem', color: 'var(--muted)'}}>מעוניינים במצלמה מסתובבת עם PTZ? ראו את ה-<Link href="/products/ptz" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>Reolink PTZ Solar</Link>.</p>
      </section>

      <ProductSchema name="Reolink GO Plus" description="מצלמת אבטחה סולארית 4G לשטח" />
    </main>
  );
}