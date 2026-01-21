import { MetadataRoute } from "next";
import { BASE_URL } from "./config";

export default function robots(): MetadataRoute.Robots {
  const host = BASE_URL;
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 0,
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
