import { MetadataRoute } from "next";
import { blogPosts } from "./data/blog";
import { storeCategories, storeProducts } from "./data/store-catalog";
import { categorySeo } from "./data/store-category-seo";
import { BASE_URL } from "./config";
import catalogDates from "./data/catalog-dates.json";

// מפת האתר משקפת את המיצוב הנוכחי: חנות, קטגוריות, מוצרים והתקנה.
// דפי האתר הישן (סולארי לאתרי בנייה, דפי מיקום) מופנים ב-301 ב-next.config.mjs ולכן לא מופיעים כאן.
// 17.10.2026: lastmod אמיתי. מוצרים וקטגוריות מ-data/catalog-dates.json (automation/catalog-dates.mjs מעדכן כשמוצר משתנה),
// פוסטים מ-modified (או date). CATALOG_UPDATED רק לדפים סטטיים שלא השתנו מאז ההשקה.
const CATALOG_UPDATED = new Date("2026-09-27");
const dates = catalogDates as { latest: string; products: Record<string, { d: string }>; categories: Record<string, string> };
const day = (d?: string) => (d ? new Date(d) : CATALOG_UPDATED);
const STORE_UPDATED = day(dates.latest);

function parseDate(dateStr?: string): Date {
  if (!dateStr) return CATALOG_UPDATED;
  const d = dateStr.includes("/")
    ? (() => { const [dd, mm, yyyy] = dateStr.split("/"); return new Date(`${yyyy}-${mm}-${dd}`); })()
    : new Date(dateStr);
  return isNaN(d.getTime()) ? CATALOG_UPDATED : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${BASE_URL}${path}`;
  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: new Date("2026-10-17"), changeFrequency: "weekly", priority: 1.0 },
    { url: url("/store"), lastModified: STORE_UPDATED, changeFrequency: "weekly", priority: 0.95 },
    { url: url("/installation"), lastModified: CATALOG_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/deals"), lastModified: CATALOG_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/construction-sites"), lastModified: new Date("2026-10-17"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/store/finder"), lastModified: CATALOG_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/about"), lastModified: CATALOG_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contact"), lastModified: CATALOG_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/shipping"), lastModified: CATALOG_UPDATED, changeFrequency: "monthly", priority: 0.4 },
    { url: url("/jobs"), lastModified: new Date("2026-10-14"), changeFrequency: "weekly", priority: 0.5 },
    { url: url("/returns"), lastModified: new Date("2026-10-03"), changeFrequency: "yearly", priority: 0.3 },
    { url: url("/terms"), lastModified: new Date("2026-10-03"), changeFrequency: "yearly", priority: 0.3 },
    { url: url("/privacy"), lastModified: CATALOG_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/accessibility"), lastModified: CATALOG_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/blog"), lastModified: new Date(blogPosts.map((p) => p.modified || p.date).sort().slice(-1)[0] || "2026-09-27"), changeFrequency: "weekly", priority: 0.6 },
  ];
  const categories: MetadataRoute.Sitemap = storeCategories
    .filter((c) => categorySeo[c.id] && !categorySeo[c.id].noindex) // accessories: noindex עד 6 מוצרים
    .map((c) => ({ url: url(`/store/c/${c.id}`), lastModified: day(dates.categories[c.id]), changeFrequency: "weekly", priority: 0.9 }));
  const products: MetadataRoute.Sitemap = storeProducts.map((p) => ({
    url: url(`/store/${p.slug}`),
    lastModified: dates.products[p.slug] ? day(dates.products[p.slug].d) : STORE_UPDATED, // מוצר חדש שעוד אין לו תאריך
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: parseDate(post.modified || post.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...staticPages, ...categories, ...products, ...posts];
}
