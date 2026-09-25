'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { META_PIXEL_ID } from '../config';

// Meta Pixel (פייסבוק/אינסטגרם). נטען רק כשיש מזהה פיקסל ב-config.ts.
// קוד הבסיס שולח את ה-PageView הראשון; מעברי דף בתוך האתר (ניווט בצד הלקוח) נשלחים כאן.
// אירועי ההמרה (ליד, וואטסאפ, טלפון, עגלה, הזמנה) נשלחים מ-lib/analytics.ts, יחד עם GA4.
export function MetaPixel() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    if (first.current) { first.current = false; return; }
    window.fbq?.('track', 'PageView');
  }, [pathname]);

  if (!META_PIXEL_ID) return null;

  // בלי <noscript><img>: Next.js טוען מראש (preload) גם תמונה שבתוך noscript, וזה שולח PageView כפול בכל טעינה.
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`}
    </Script>
  );
}
