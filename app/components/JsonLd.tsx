'use client';

export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SiteControl - פתרונות צילום ומעקב',
    image: 'https://sitecontrol.co.il/logo.jpg',
    description:
      'מצלמות סולאריות 4G ללא תשתית, עם גיבוי ענן וביטוח מלא לאתרי בנייה ושטחים חקלאיים',
    url: 'https://sitecontrol.co.il',
    telephone: '+972-50-XXXXXXX',
    email: 'info@sitecontrol.co.il',
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
