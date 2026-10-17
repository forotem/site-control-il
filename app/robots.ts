import { MetadataRoute } from "next";
import { BASE_URL } from "./config";

// 17.10.2026 (בדיקת SEO): קבוצה אחת לכל הבוטים. קודם קבוצות Googlebot ו-Bingbot עם Allow בלבד ביטלו להם את כל ה-Disallow,
// ובוטים אחרים היו חסומים מ-/_next/ (ה-CSS וה-JS). /seo-dashboard ו-/health לא חסומים כאן אלא מסומנים noindex בדף עצמו.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
