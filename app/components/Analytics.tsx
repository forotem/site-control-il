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
      {/* Google Analytics (GA4). 17.10.2026 (בדיקת SEO): gtag/js (191KB) היה כ-חצי מחסימת הדפדפן בכל דף. הוא נטען עכשיו
          בלחיצה/גלילה הראשונה, כשהדפדפן פנוי אחרי הטעינה, או כשהלשונית מוסתרת. ה-dataLayer וה-gtag נשארים מיד, כך שאירועים לא הולכים לאיבוד.
          כניסה ממודעה (gclid/gbraid/wbraid/gad_source/fbclid/utm_) טוענת מיד: הספרייה קוראת את הפרמטרים מהכתובת, ולחיצה על קישור פנימי משנה אותה. */}
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
          (function(){var done=!1,go=function(){if(done)return;done=!0;var s=document.createElement('script');s.async=!0;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';document.head.appendChild(s)};if(/[?&](gclid|gbraid|wbraid|gad_source|fbclid|utm_[a-z]+)=/i.test(location.search)){go()}['pointerdown','keydown','touchstart','scroll'].forEach(function(x){window.addEventListener(x,go,{once:!0,passive:!0})});document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')go()});var idle=function(){(window.requestIdleCallback||function(c){return setTimeout(c,1)})(go,{timeout:3000})};document.readyState==='complete'?setTimeout(idle,2500):window.addEventListener('load',function(){setTimeout(idle,2500)});})();
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
