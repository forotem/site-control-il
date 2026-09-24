import { MetadataRoute } from "next";
import { blogPosts } from "./data/blog";
import { storeCategories, storeProducts } from "./data/store-catalog";
import { categorySeo } from "./data/store-category-seo";
import { BASE_URL } from "./config";

// מפת האתר משקפת את המיצוב הנוכחי: חנות, קטגוריות, מוצרים והתקנה.
// דפי האתר הישן (סולארי לאתרי בנייה, דפי מיקום) מופנים ב-301 ב-next.config.mjs ולכן לא מופיעים כאן.
// תאריך עדכון הקטלוג: כשהקטלוג נבנה מחדש, לעדכן כאן.
const CATALOG_UPDATED = new Date("2026-09-24");

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
    { url: url("/"), lastModified: CATALOG_UPDATED, changeFrequency: "weekly", priority: 1.0 },
    { url: url("/store"), lastModified: CATALOG_UPDATED, changeFrequency: "weekly", priority: 0.95 },
    { url: url("/installation"), lastModified: CATALOG_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/store/finder"), lastModified: CATALOG_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/about"), lastModified: CATALOG_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contact"), lastModified: CATALOG_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/blog"), lastModified: CATALOG_UPDATED, changeFrequency: "weekly", priority: 0.6 },
  ];
  const categories: MetadataRoute.Sitemap = storeCategories
    .filter((c) => categorySeo[c.id])
    .map((c) => ({ url: url(`/store/c/${c.id}`), lastModified: CATALOG_UPDATED, changeFrequency: "weekly", priority: 0.9 }));
  const products: MetadataRoute.Sitemap = storeProducts.map((p) => ({
    url: url(`/store/${p.slug}`),
    lastModified: CATALOG_UPDATED,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: parseDate(post.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...staticPages, ...categories, ...products, ...posts];
}
