import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Site-Control - מצלמות אבטחה סולאריות 4G',
    short_name: 'Site-Control',
    description: 'מצלמות אבטחה סולאריות 4G לאתרי בנייה וחקלאות - ניטור מרחוק עם גיבוי ענן',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1622',
    theme_color: '#00c2ff',
    orientation: 'portrait',
    icons: [
      {
        src: '/optimized-variants/הלוגו שלי/site-control-logo.optimized-w480.avif',
        sizes: '480x480',
        type: 'image/avif',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'security', 'productivity'],
    lang: 'he',
    dir: 'rtl',
  }
}
