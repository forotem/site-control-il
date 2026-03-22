import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "./components/Hero";
import { FeatureGrid } from "./components/FeatureGrid";
import { FeatureCarousel } from "./components/FeatureCarousel";
import { Packages } from "./components/Packages";
import { ProofSections } from "./components/ProofSections";
import { FAQ } from "./components/FAQ";
import { LocationsList } from "./components/LocationsList";
import { BlogList } from "./components/BlogList";
import { StatsSection } from "./components/StatsSection";
import { TrustBar } from "./components/TrustBar";
import { LocalBusinessSchema, OrganizationSchema, ProductSchema, WebSiteSchema } from "./components/Schema";
import { BASE_URL } from "./config";

export const metadata: Metadata = {
  alternates: { canonical: BASE_URL },
};

export default function Page() {
  return (
    <>
      <WebSiteSchema />
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
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 96px' }}>
        {/* Hero Title */}
        <div style={{ textAlign: 'center', paddingTop: '40px', marginBottom: '8px' }}>
          <h1 style={{ marginBottom: 16, fontSize: '2.8rem', lineHeight: '1.15', maxWidth: '900px', margin: '0 auto 16px' }}>
            מצלמות אבטחה 4G סולאריות לאתרי בנייה ושטחים פתוחים
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: '800px', margin: '0 auto 16px', fontSize: '1.15rem', lineHeight: '1.7' }}>
            מערכות מעקב מתקדמות עם סוללה וסולאר, חיבור 4G LTE ללא צורך בחשמל או אינטרנט. 
            איכות 4K, ראיית לילה צבעונית, גיבוי ענן אוטומטי והתראות בזמן אמת.
          </p>
        </div>

        {/* Trust Bar */}
        <TrustBar />

        {/* Hero Section */}
        <Hero />

        {/* Stats Section */}
        <StatsSection />

        {/* Features */}
        <FeatureGrid />

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 194, 255, 0.3) 50%, transparent 100%)', margin: '20px 0 80px', opacity: 0.5 }} />

        {/* Carousel */}
        <FeatureCarousel />

        {/* Packages */}
        <Packages />

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 194, 255, 0.3) 50%, transparent 100%)', margin: '20px 0 80px', opacity: 0.5 }} />

        {/* Proof Sections */}
        <ProofSections />

        {/* Locations */}
        <LocationsList />

        {/* Blog */}
        <BlogList />

        {/* CTA Banner */}
        <section style={{
          position: 'relative',
          padding: '64px 32px',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          textAlign: 'center',
          margin: '80px 0 40px'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0, 194, 255, 0.12) 0%, rgba(0, 102, 255, 0.08) 50%, rgba(123, 45, 255, 0.1) 100%)',
            border: '1px solid rgba(0, 194, 255, 0.15)',
            borderRadius: 'var(--radius-xl)'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0, 194, 255, 0.1) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', color: 'white' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '8px' }}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              מוכנים להגן על האתר שלכם?
            </h2>
            <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 32px', fontSize: '1.1rem', lineHeight: '1.7' }}>
              צרו קשר עוד היום לייעוץ חינם וסיור שטח מקצועי. אנחנו נתאים לכם את הפתרון המושלם.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="button" style={{ fontSize: '1.1rem', padding: '18px 40px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg> דברו איתנו עכשיו
              </Link>
              <Link href="/packages" className="button secondary" style={{ fontSize: '1.1rem', padding: '18px 40px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> ראו חבילות
              </Link>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <section style={{
          margin: '48px 0 20px',
          padding: '40px',
          background: 'var(--glass)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--glass-border)'
        }}>
          <h2 style={{ marginBottom: '32px', fontSize: '1.6rem', textAlign: 'center' }}>גלה עוד על המצלמות שלנו</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ 
              padding: '24px', 
              background: 'rgba(0, 194, 255, 0.03)', 
              borderRadius: 'var(--radius)', 
              border: '1px solid rgba(0, 194, 255, 0.06)' 
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', color: 'var(--accent)' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '6px' }}><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg> תחומי שימוש</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="/use-cases/construction" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>מצלמות לאתרי בנייה →</Link></li>
                <li><Link href="/use-cases/agriculture" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>מצלמות לשטחים חקלאיים →</Link></li>
                <li><Link href="/use-cases/remote" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>ניהול אתרים מבודדים →</Link></li>
              </ul>
            </div>
            <div style={{ 
              padding: '24px', 
              background: 'rgba(0, 194, 255, 0.03)', 
              borderRadius: 'var(--radius)', 
              border: '1px solid rgba(0, 194, 255, 0.06)' 
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', color: 'var(--accent)' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '6px' }}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg> תכונות מרכזיות</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="/video-quality" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>איכות וידאו 4K →</Link></li>
                <li><Link href="/cloud-backup" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>גיבוי ענן בזמן אמת →</Link></li>
                <li><Link href="/weatherproof" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>עמידות למזג אוויר →</Link></li>
              </ul>
            </div>
            <div style={{ 
              padding: '24px', 
              background: 'rgba(0, 194, 255, 0.03)', 
              borderRadius: 'var(--radius)', 
              border: '1px solid rgba(0, 194, 255, 0.06)' 
            }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', color: 'var(--accent)' }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '6px' }}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> המוצרים שלנו</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="/products/go" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Reolink GO Plus 4G →</Link></li>
                <li><Link href="/products/ptz" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Reolink PTZ Solar →</Link></li>
                <li><Link href="/packages" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>כל החבילות →</Link></li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ />
      </main>
    </>
  );
}
