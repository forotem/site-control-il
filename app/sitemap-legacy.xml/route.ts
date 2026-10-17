// מפת אתר זמנית לכתובות ישנות שמפנות (308), כדי שגוגל יסרוק אותן שוב ויעבד את ההפניה.
// 17.10.2026 (בדיקת SEO): 20 כתובות כאלה עדיין היו באינדקס עם התוכן הישן, כ-14% מהחשיפות. לא חלק מ-sitemap.xml.
// להסיר (את התיקייה הזאת ואת ההגשה ב-Search Console) כשכולן מופיעות כ-'Page with redirect', בערך בתחילת דצמבר 2026.
import { BASE_URL } from "../config";

const LEGACY = ["/blog/security-construction-2026", "/blog/site-construction-2026", "/blog/cameras-security-construction-2026", "/blog/cameras-sites-construction-2026", "/blog/cameras-monitoring-2026", "/blog/solar-cameras-construction", "/blog/photography-sites-construction-2026", "/blog/construction-2026", "/products/go", "/products/ptz", "/packages", "/cloud-backup", "/video-quality", "/use-cases/agriculture", "/use-cases/remote", "/locations", "/locations/remote-sites-north", "/locations/livestock-center", "/locations/construction-negev", "/blog/monitoring-progress-project-construction-2026", "/blog/smart-agriculture-monitoring"];

export const dynamic = "force-static";

export function GET() {
  const lastmod = "2026-10-17";
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${LEGACY.map((p) => `  <url><loc>${BASE_URL}${p}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
