import { MetadataRoute } from "next";
import { blogPosts } from "./data/blog";
import { BASE_URL } from "./config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BASE_URL;
  
  const staticPages = [
    { url: "/", priority: 1.0, changefreq: "daily" as const },
    { url: "/packages", priority: 0.9, changefreq: "weekly" as const },
    { url: "/products/go", priority: 0.9, changefreq: "weekly" as const },
    { url: "/products/ptz", priority: 0.9, changefreq: "weekly" as const },
    { url: "/use-cases/construction", priority: 0.8, changefreq: "weekly" as const },
    { url: "/use-cases/agriculture", priority: 0.8, changefreq: "weekly" as const },
    { url: "/use-cases/remote", priority: 0.8, changefreq: "weekly" as const },
    { url: "/cloud-backup", priority: 0.7, changefreq: "monthly" as const },
    { url: "/weatherproof", priority: 0.7, changefreq: "monthly" as const },
    { url: "/video-quality", priority: 0.7, changefreq: "monthly" as const },
    { url: "/contact", priority: 0.6, changefreq: "monthly" as const },
    { url: "/blog", priority: 0.8, changefreq: "weekly" as const },
  ];

  const blogPages = blogPosts.map((post) => ({
    url: `/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changefreq: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages.map(page => ({
      url: `${base}${page.url}`,
      lastModified: new Date(),
      changefreq: page.changefreq,
      priority: page.priority,
    })),
    ...blogPages.map(page => ({
      url: `${base}${page.url}`,
      lastModified: page.lastModified,
      changefreq: page.changefreq,
      priority: page.priority,
    })),
  ];
}
