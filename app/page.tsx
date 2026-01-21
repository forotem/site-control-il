import Link from "next/link";
import { Hero } from "./components/Hero";
import { FeatureGrid } from "./components/FeatureGrid";
import { FeatureCarousel } from "./components/FeatureCarousel";
import { Packages } from "./components/Packages";
import { ProofSections } from "./components/ProofSections";
import { FAQ } from "./components/FAQ";
import { LocationsList } from "./components/LocationsList";
import { BlogList } from "./components/BlogList";
import { LocalBusinessSchema, OrganizationSchema, ProductSchema } from "./components/Schema";

export default function Page() {
  return (
    <>
      <LocalBusinessSchema />
      <OrganizationSchema />
      <ProductSchema
        name="Reolink GO Plus 4G"
        description="מצלמת אבטחה סולארית 4G עם איכות 4K, ראיית לילה צבעונית, גיבוי ענן אוטומטי"
        price="2999"
        image="/optimized-variants/2 סוגי המצלמה/reolink-go-plus-security-camera.optimized-w1080.avif"
      />
      <ProductSchema
        name="Reolink PTZ Solar"
        description="מצלמת אבטחה מסתובבת סולארית 4G עם זום 8x, ראיית לילה צבעונית, גיבוי ענן"
        price="3999"
        image="/optimized-variants/2 סוגי המצלמה/reolink-ptz-solar-security-camera-with-solar-panel.optimized-w1080.avif"
      />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <h1 style={{marginBottom: 16, textAlign: 'center', fontSize: '2.5rem', lineHeight: '1.2'}}>מצלמות אבטחה 4G סולאריות לאתרי בנייה ושטחים פתוחים - Reolink GO Plus ו-PTZ</h1>
        <p style={{textAlign: 'center', color: 'var(--muted)', maxWidth: '900px', margin: '0 auto 32px', fontSize: '1.1rem', lineHeight: '1.6'}}>
          מערכות מעקב מתקדמות עם סוללה וסולאר, חיבור 4G LTE ללא צורך בחשמל או אינטרנט. פתרון מושלם למקומות מרוחקים - אתרי בנייה, חקלאות, שטחים חקלאיים, שמירה על ציוד בשטח. איכות 4K, ראיית לילה צבעונית, גיבוי ענן אוטומטי והתראות בזמן אמת.
        </p>
        <Hero />
        <FeatureGrid />
        <FeatureCarousel />
        <Packages />
        <ProofSections />
        <LocationsList />
        <BlogList />
        <section style={{margin: '48px 0', padding: '32px', background: 'var(--bg-secondary)', borderRadius: '8px'}}>
          <h2 style={{marginBottom: '24px', fontSize: '1.8rem'}}>למד עוד על מצלמות האבטחה שלנו</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px'}}>
            <div>
              <h3 style={{fontSize: '1.2rem', marginBottom: '8px'}}>תחומי שימוש</h3>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li><Link href="/use-cases/construction" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>מצלמות לאתרי בנייה</Link></li>
                <li><Link href="/use-cases/agriculture" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>מצלמות לשטחים חקלאיים</Link></li>
                <li><Link href="/use-cases/remote" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>ניהול אתרים מבודדים</Link></li>
              </ul>
            </div>
            <div>
              <h3 style={{fontSize: '1.2rem', marginBottom: '8px'}}>תכונות מרכזיות</h3>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li><Link href="/video-quality" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>איכות וידאו 4K</Link></li>
                <li><Link href="/cloud-backup" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>גיבוי ענן בזמן אמת</Link></li>
                <li><Link href="/weatherproof" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>עמידות למזג אוויר</Link></li>
              </ul>
            </div>
            <div>
              <h3 style={{fontSize: '1.2rem', marginBottom: '8px'}}>המוצרים שלנו</h3>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li><Link href="/products/go" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>Reolink GO Plus 4G</Link></li>
                <li><Link href="/products/ptz" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>Reolink PTZ Solar</Link></li>
                <li><Link href="/packages" style={{color: 'var(--link-color)', textDecoration: 'underline'}}>כל החבילות</Link></li>
              </ul>
            </div>
          </div>
        </section>
        <FAQ />
      </main>
    </>
  );
}
