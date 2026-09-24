'use client';

import { useEffect } from 'react';
import { track } from '../lib/analytics';
import { captureAttribution } from '../lib/attribution';

// מודד כל קליק על קישור וואטסאפ או טלפון באתר (גם בקומפוננטות שרת), במקום onClick בכל קישור.
// location = data-track של הקישור או של אחד ההורים, ואם אין, הנתיב של הדף.
export function SiteTracking() {
  useEffect(() => {
    captureAttribution();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const tagged = a.closest('[data-track]')?.getAttribute('data-track');
      const location = tagged || window.location.pathname;
      if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(href)) track.whatsapp(location);
      else if (href.startsWith('tel:')) track.phone(location);
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
