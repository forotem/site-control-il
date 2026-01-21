import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import { Inter, Assistant } from "next/font/google";
import { Analytics } from "./components/Analytics";
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
    "מצלמות 4G LTE ישראל"
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
    google: "google-site-verification-code",
  },
};

const navStyle = {
  nav: { background: '#1a1a1a', color: 'white', padding: '0.75rem 1rem', position: 'sticky' as const, top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
  navDiv: { maxWidth: '1200px', margin: '0 auto', display: 'flex' as const, gap: '1rem', justifyContent: 'flex-start' as const, flexWrap: 'wrap' as const, alignItems: 'center' as const },
  logo: { color: 'white', textDecoration: 'none', fontWeight: 'bold', display: 'flex' as const, alignItems: 'center' as const, gap: '0.5rem', fontSize: '1rem', minWidth: '120px', order: -1 },
  link: { color: 'white', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.3s', padding: '0.5rem 0', whiteSpace: 'nowrap' as const },
  ctaButton: { color: 'white', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.3s', background: '#007bff', padding: '0.5rem 0.75rem', borderRadius: '4px', whiteSpace: 'nowrap' as const },
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
                width={35}
                height={35}
                style={{ borderRadius: '4px' }}
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
            <Link href="/blog" style={navStyle.link}>
              בלוג
            </Link>
            <Link href="/contact" style={navStyle.ctaButton}>
              יצירת קשר
            </Link>
          </div>
        </nav>
        {children}
        <Analytics />
        <footer style={{ background: '#1a1a1a', color: 'white', padding: '3rem 2rem', marginTop: '3rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h4>על Site-Control</h4>
              <p>ספק מוביל של מצלמות אבטחה סולאריות 4G עם גיבוי ענן לאתרי בנייה, חקלאות ואתרים מבודדים.</p>
            </div>
            <div>
              <h4>קישורים</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><Link href="/" style={{ color: '#007bff', textDecoration: 'none' }}>בעמוד הבית</Link></li>
                <li><Link href="/blog" style={{ color: '#007bff', textDecoration: 'none' }}>בלוג</Link></li>
                <li><Link href="/contact" style={{ color: '#007bff', textDecoration: 'none' }}>יצירת קשר</Link></li>
              </ul>
            </div>
            <div>
              <h4>מידע משפטי</h4>
              <p style={{ fontSize: '0.9rem' }}>אנחנו בשיתוף פעולה עם <strong>Reolink</strong> - יצרנית מובילה של מצלמות אבטחה מתקדמות.</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #333', paddingTop: '1.5rem', textAlign: 'center' }}>
            <p>© 2024 Site-Control - פתרונות בטחוני סולאריים. כל הזכויות שמורות. בשיתוף Reolink.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
