import Script from 'next/script';

export function Analytics() {
  // קריאת ה-Measurement ID מה-environment variables
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  // אופציונלי: מזהה Google Ads (AW-XXXXXXXXX) לרימרקטינג ולתיוג ישיר. ההמרות עצמן מיובאות מ-GA4.
  const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  // אם אין ID, לא לטעון את ה-analytics (למשל בסביבת פיתוח)
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return null;
  }

  return (
    <>
      {/* Google Analytics (GA4) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });${ADS_ID ? `
          gtag('config', '${ADS_ID}');` : ''}
        `}
      </Script>
    </>
  );
}

// הוראות התקנה:
// 1. כנס ל-https://analytics.google.com/
// 2. צור נכס חדש (Property) לאתר שלך
// 3. העתק את ה-Measurement ID (מתחיל ב-G-)
// 4. הוסף לקובץ .env.local:
//    NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR-ID
// 5. הקומפוננט כבר מיובא ב-layout.tsx
