export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.site-control-il.com';

// Meta (פייסבוק/אינסטגרם): מזהה הפיקסל וקוד אימות הדומיין. אלה ערכים ציבוריים (מופיעים ב-HTML של כל דף),
// ולכן הם כאן ולא כסוד. משתנה סביבה ב-Vercel גובר אם הוגדר. ריק = הפיקסל כבוי והאתר עובד כרגיל.
// dataset "Site-Control" בפורטפוליו "סטודיו גולן" (נוצר 25.9.2026)
const metaPixel = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1409926661266999';
export const META_PIXEL_ID = /^\d{6,20}$/.test(metaPixel) ? metaPixel : '';
// קוד האימות של site-control-il.com בפורטפוליו "סטודיו גולן" (Business Settings → Domains, נוסף 25.9.2026)
export const META_DOMAIN_VERIFICATION = (process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION || 'noq31g02sx97t7t0mp3d0vspnerlh2').replace(/[^a-z0-9]/gi, '');
