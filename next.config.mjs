/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
  redirects: async () => {
    // כתובות ישנות עם באג "undefined" בסלאג + עמודים כפולים שהוסרו
    return [
      // 23.9.2026: הטיימלאפס עבר כולו ל-timelapseit.co.il. העמוד והפוסטים מופנים לשם.
      { source: '/timelapse', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/documentation-project-construction-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/photography-timelapse-construction-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/timelapse-marketing-advertising-projects-construction-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/monitoring-progress-project-construction-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/documentation-construction-legal-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/construction-professional-undefined', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/construction-undefined', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/complete-undefined', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/timelapse-video-contractors-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/complete-construction-undefined', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/timelapse-marketing-construction-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/%D7%9E%D7%A0%D7%A2%D7%95%D7%9C%D7%99%D7%9D-%D7%97%D7%9B%D7%9E%D7%99%D7%9D-%D7%91%D7%99%D7%95%D7%9E%D7%98%D7%A8%D7%99%D7%99%D7%9D-2026-%D7%94%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%94%D7%9E%D7%9C%D7%90-%D7%9C%D7%93%D7%9C%D7%AA-%D7%94%D7%9B%D7%A0%D7%99', destination: '/blog/smart-biometric-locks-2026', permanent: true },
      { source: '/blog/%D7%9E%D7%A2%D7%A8%D7%9B%D7%95%D7%AA-%D7%90%D7%91%D7%98%D7%97%D7%94-%D7%97%D7%9B%D7%9E%D7%95%D7%AA-%D7%A2%D7%9D-ai-%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-2026', destination: '/blog/smart-security-ai-2026', permanent: true },
      // איחוד פוסטים כפולים (12.9.2026): טיימלאפס / תיעוד בנייה / מצלמות לאתר בנייה
      { source: '/blog/timelapse-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/timelapse-construction-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/timelapse-documentation-construction-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/construction-site-timelapse-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/cameras-timelapse-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/video-timelapse-contractors-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/video-progress-construction-developers-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/complete-construction-2027', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/documentation-sites-construction-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/digital-documentation-construction-sites-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/documentation-construction-professional-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/documentation-progress-construction-cameras-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/documentation-projects-construction-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/cameras-projects-2026', destination: 'https://timelapseit.co.il/', permanent: true },
      { source: '/blog/cameras-security-sites-construction-2027', destination: '/blog/cameras-security-construction-2026', permanent: true },
      { source: '/blog/cameras-monitoring-2026', destination: '/blog/cameras-security-construction-2026', permanent: true },
      { source: '/blog/photography-sites-construction-2026', destination: '/blog/cameras-security-construction-2026', permanent: true },
      { source: '/blog/solar-cameras-construction', destination: '/blog/cameras-security-construction-2026', permanent: true },
    ];
  },
  headers: async () => {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
