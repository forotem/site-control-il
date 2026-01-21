import Script from 'next/script';

export function Analytics() {
  // Replace with your actual Google Analytics ID
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}

// Instructions:
// 1. Go to https://analytics.google.com/
// 2. Create a new property for your website
// 3. Copy your Measurement ID (starts with G-)
// 4. Replace 'G-XXXXXXXXXX' above with your actual ID
// 5. Import and add <Analytics /> to your layout.tsx file
