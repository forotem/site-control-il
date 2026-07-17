'use client';

export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SiteControl - פתרונות צילום ומעקב',
    image: 'https://www.site-control-il.com/optimized-variants/הלוגו שלי/site-control-logo.optimized-w720.webp',
    description:
      'מצלמות סולאריות 4G ללא תשתית, עם גיבוי ענן וביטוח מלא לאתרי בנייה ושטחים חקלאיים',
    url: 'https://www.site-control-il.com',
    telephone: '+972-50-2256866',
    email: 'info@site-control-il.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressRegion: 'Israel',
    },
    areaServed: 'IL',
    serviceType: [
      'מצלמות אבטחה',
      'צילום שטח',
      'מעקב פרויקטים',
      'Time-Lapse',
    ],
    priceRange: '₪₪₪',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
