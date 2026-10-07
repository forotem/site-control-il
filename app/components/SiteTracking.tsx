'use client';

import { useEffect } from 'react';
import { track } from '../lib/analytics';
import { captureAttribution } from '../lib/attribution';
import { hrefWithWaRef, makeWaRef, reportWaRef } from '../lib/wa-ref';

// מודד כל קליק על קישור וואטסאפ או טלפון באתר (גם בקומפוננטות שרת), במקום onClick בכל קישור.
// location = data-track של הקישור או של אחד ההורים, ואם אין, הנתיב של הדף.
// 7.10.2026: באותה לחיצה על קישור ווצאפ נוסף קוד פנייה להודעה ונשלח לשרת (app/lib/wa-ref.ts). ה-href מעודכן כאן,
// בשלב ה-capture, לפני שהדפדפן מבצע את הניווט, ולכן זה עובד גם לקישורים סטטיים כמו הכפתור הצף. המדידה לא השתנתה.
export function SiteTracking() {
  useEffect(() => {
    captureAttribution();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const tagged = a.closest('[data-track]')?.getAttribute('data-track');
      const location = tagged || window.location.pathname;
      if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(href)) {
        track.whatsapp(location);
        const code = makeWaRef();
        const next = hrefWithWaRef(href, code);
        if (next) {
          a.setAttribute('href', next);
          reportWaRef(code, href, location);
        }
      } else if (href.startsWith('tel:')) track.phone(location);
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
