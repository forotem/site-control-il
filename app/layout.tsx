import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import { Inter, Assistant } from "next/font/google";
import { Analytics } from "./components/Analytics";
import { FloatingCTA } from "./components/FloatingCTA";
import { ScrollToTop } from "./components/ScrollToTop";
import "./globals.css";
import { logo } from "./data/images";
import { BASE_URL } from "./config";

// Use next/font to avoid render-blocking font requests
const inter = Inter({ subsets: ["latin"], display: "swap" });
const assistant = Assistant({ subsets: ["hebrew"], display: "swap" });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0f1622',
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "מצלמות אבטחה סולאריות 4G 2026 | Site-Control - Reolink GO Plus & PTZ",
  description:
    "מצלמות אבטחה 4G סולאריות מתקדמות לאתרי בנייה, חקלאות ושטחים מבודדים ללא חשמל. איכות 4K, ראיית לילה צבעונית, גיבוי ענן אוטומטי, IP66. התקנה מהירה ושליטה מרחוק דרך אפליקציה.",
  keywords: [
    "מצלמות אבטחה סולאריות",
    "מצלמות 4G",
    "Reolink GO Plus",
    "Reolink PTZ",
    "מצלמות לאתרי בנייה",
    "מצלמות אבטחה ללא חשמל",
    "גיבוי ענן",
    "מצלמות סולאריות 4K",
    "ראיית לילה צבעונית",
    "IP66",
    "מצלמות אבטחה לחקלאות",
    "מצלמות 4G LTE ישראל",
    "מצלמות אבטחה לאתרי בנייה",
    "צילום טיימלאפס",
    "אבטחת שטחים חקלאיים",
    "מצלמות בנייה",
    "טיימלאפס לאתר בנייה",
    "תיעוד בנייה טיימלאפס"
  ],
  authors: [{ name: "Site-Control" }],
  creator: "Site-Control",
  publisher: "Site-Control",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: BASE_URL,
    siteName: "Site-Control",
    title: "מצלמות אבטחה סולאריות 4G 2026 - Reolink GO Plus & PTZ",
    description: "מצלמות אבטחה 4G סולאריות מתקדמות לאתרי בנייה וחקלאות. איכות 4K, גיבוי ענן אוטומטי, התקנה ללא חשמל.",
    images: [
      {
        url: "/optimized-variants/תמונת הירו ראשית/reolink-go-plus-security-camera.optimized-w1920.avif",
        width: 1920,
        height: 1080,
        alt: "מצלמת אבטחה סולארית Reolink GO Plus 4G",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "מצלמות אבטחה סולאריות 4G - Site-Control",
    description: "מצלמות אבטחה 4G עם סולאר וגיבוי ענן לאתרי בנייה וחקלאות. התקנה ללא חשמל.",
    images: ["/optimized-variants/תמונת הירו ראשית/reolink-go-plus-security-camera.optimized-w1920.avif"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

const navStyle = {
  nav: { 
    background: 'rgba(6, 10, 16, 0.8)', 
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: 'white', 
    padding: '0.75rem 1.5rem', 
    position: 'sticky' as const, 
    top: 0, 
    zIndex: 100, 
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
  },
  navDiv: { 
    maxWidth: '1280px', 
    margin: '0 auto', 
    display: 'flex' as const, 
    gap: '0.5rem', 
    justifyContent: 'flex-start' as const, 
    flexWrap: 'wrap' as const, 
    alignItems: 'center' as const 
  },
  logo: { 
    color: 'white', 
    textDecoration: 'none', 
    fontWeight: 'bold' as const, 
    display: 'flex' as const, 
    alignItems: 'center' as const, 
    gap: '0.6rem', 
    fontSize: '1.05rem', 
    minWidth: '140px', 
    order: -1,
    letterSpacing: '-0.02em'
  },
  link: { 
    color: 'rgba(255, 255, 255, 0.75)', 
    textDecoration: 'none', 
    fontSize: '0.88rem', 
    fontWeight: '500' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
    padding: '0.5rem 0.75rem', 
    borderRadius: '8px',
    whiteSpace: 'nowrap' as const 
  },
  ctaButton: { 
    color: 'white', 
    textDecoration: 'none', 
    fontSize: '0.88rem', 
    fontWeight: '600' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
    background: 'linear-gradient(135deg, #00c2ff 0%, #0066ff 50%, #7b2dff 100%)', 
    padding: '0.55rem 1.2rem', 
    borderRadius: '10px', 
    whiteSpace: 'nowrap' as const,
    boxShadow: '0 4px 16px rgba(0, 194, 255, 0.3)'
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/* Preconnects to external fonts removed; next/font handles optimization */}
        <meta name="theme-color" content="#0f1622" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} ${assistant.className}`}>
        <nav style={navStyle.nav as any}>
          <div style={navStyle.navDiv}>
            <Link href="/" style={navStyle.logo}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={38}
                height={38}
                style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 194, 255, 0.2)' }}
              />
              <span>Site-Control</span>
            </Link>
            <Link href="/" style={navStyle.link}>
              בעמוד הבית
            </Link>
            <Link href="/about" style={navStyle.link}>
              אודות
            </Link>
            <Link href="/packages" style={navStyle.link}>
              חבילות
            </Link>
            <Link href="/locations" style={navStyle.link}>
              אזורים
            </Link>
            <Link href="/timelapse" style={navStyle.link}>
              טיימלאפס
            </Link>
            <Link href="/blog" style={navStyle.link}>
              בלוג
            </Link>
            <Link href="/contact" style={navStyle.ctaButton}>
              יצירת קשר
            </Link>
          </div>
        </nav>
        {children}
        <FloatingCTA />
        <ScrollToTop />
        <Analytics />
        <footer style={{ 
          background: 'linear-gradient(180deg, rgba(6, 10, 16, 0) 0%, rgba(6, 10, 16, 1) 15%)', 
          color: 'white', 
          padding: '6rem 2rem 2rem', 
          marginTop: '0',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(0, 194, 255, 0.3) 50%, transparent 100%)'
          }} />
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Image src={logo.src} alt={logo.alt} width={32} height={32} style={{ borderRadius: '8px' }} />
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Site-Control</span>
                </div>
                <p style={{ color: 'rgba(139, 163, 191, 0.9)', lineHeight: '1.7', fontSize: '0.95rem' }}>ספק מוביל של מצלמות אבטחה סולאריות 4G עם גיבוי ענן לאתרי בנייה, חקלאות ואתרים מבודדים.</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(0, 194, 255, 0.1)', border: '1px solid rgba(0, 194, 255, 0.2)', fontSize: '0.8rem', color: '#00c2ff' }}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> אבטחה מקצועית</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(0, 194, 255, 0.1)', border: '1px solid rgba(0, 194, 255, 0.2)', fontSize: '0.8rem', color: '#00c2ff' }}><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> סולארי</span>
                </div>
              </div>
              <div>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600, color: 'white' }}>ניווט מהיר</h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li><Link href="/" style={{ color: 'rgba(139, 163, 191, 0.9)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> דף הבית</Link></li>
                  <li><Link href="/packages" style={{ color: 'rgba(139, 163, 191, 0.9)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> חבילות ומחירים</Link></li>
                  <li><Link href="/blog" style={{ color: 'rgba(139, 163, 191, 0.9)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg> בלוג</Link></li>
                  <li><Link href="/timelapse" style={{ color: 'rgba(139, 163, 191, 0.9)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg> טיימלאפס</Link></li>
                  <li><Link href="/about" style={{ color: 'rgba(139, 163, 191, 0.9)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> אודות</Link></li>
                  <li><Link href="/contact" style={{ color: 'rgba(139, 163, 191, 0.9)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> צור קשר</Link></li>
                </ul>
              </div>
              <div>
                <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600, color: 'white' }}>שותפים</h4>
                <p style={{ fontSize: '0.95rem', color: 'rgba(139, 163, 191, 0.9)', lineHeight: '1.7' }}>אנחנו בשיתוף פעולה עם <strong style={{ color: '#00c2ff' }}>Reolink</strong> - יצרנית מובילה של מצלמות אבטחה מתקדמות ברמה עולמית.</p>
                <p style={{ fontSize: '0.9rem', color: 'rgba(139, 163, 191, 0.7)', lineHeight: '1.7', marginTop: '0.5rem' }}>שירותי טיימלאפס מקצועיים: <a href="https://timelapseit.co.il" target="_blank" rel="noopener" style={{ color: '#00c2ff', textDecoration: 'none' }}>TimeLapseIt</a></p>
                <div style={{ marginTop: '1rem', padding: '16px', background: 'rgba(12, 18, 32, 0.7)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.2rem', display: 'flex' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></span>
                    <span style={{ fontSize: '0.85rem', color: '#ffd700', fontWeight: 600 }}>מפיץ מורשה בישראל</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(139, 163, 191, 0.7)', margin: 0 }}>אחריות מלאה + תמיכה טכנית בעברית</p>
                </div>
              </div>
            </div>
            <div style={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.06)', 
              paddingTop: '1.5rem', 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(139, 163, 191, 0.6)' }}>© {new Date().getFullYear()} Site-Control - פתרונות אבטחה סולאריים מתקדמים. כל הזכויות שמורות.</p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(139, 163, 191, 0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>בשיתוף Reolink <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(139, 163, 191, 0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg></p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
