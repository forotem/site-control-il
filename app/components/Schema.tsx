import { BASE_URL } from '../config';
export function JsonLd({ json }: { json: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function LocalBusinessSchema() {
  const json = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store'],
    name: 'Site-Control',
    description:
      'חנות מצלמות אבטחה עם צוות שגם מתקין: מצלמות IP, ערכות, מקליטים, אינטרקום ובקרת כניסה של Hikvision, Uniview, Reolink, VisionNet ו-Tenda מהמלאי של היבואן בישראל. התקנה, משלוח או איסוף עצמי.',
    telephone: '+972-50-2256866',
    email: 'info@site-control-il.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
    },
    areaServed: { '@type': 'Country', name: 'Israel' },
    url: BASE_URL,
    priceRange: '₪-₪₪₪',
    image: `${BASE_URL}/og-default.jpg`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'מצלמות אבטחה, מקליטים ואינטרקום',
      url: `${BASE_URL}/store`,
    },
  };
  return <JsonLd json={json} />;
}

export function ProductSchema({
  name,
  description,
  price,
  image,
}: {
  name: string;
  description: string;
  price?: string;
  image?: string;
}) {
  const imageUrl = image 
    ? `${BASE_URL}${image}` 
    : `${BASE_URL}/optimized-variants/2 סוגי המצלמה/reolink-go-plus-security-camera.optimized-w1080.avif`;
  
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: 'Reolink',
      logo: `${BASE_URL}/optimized-variants/הלוגו של ראולינק/Reolink-logo.optimized-w480.avif`,
    },
    image: imageUrl,
    offers: price ? {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'ILS',
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Site-Control',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IL',
        returnPolicyCategory: 'MerchantReturnFiniteReturnWindow',
        merchantReturnDays: '30',
        returnShippingFeeBusiness: 'FreeReturn',
        returnFees: 'FreeReturn',
        returnMethod: 'ReturnMailIn',
      },
      shippingDetails: {
        '@type': 'ShippingDeliveryTime',
        shippingRate: {
          '@type': 'PriceSpecification',
          priceCurrency: 'ILS',
          price: '0',
        },
        shippingDestination: {
          '@type': 'DeliveryAddress',
          addressCountry: 'IL',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: '3-7',
        },
      },
    } : undefined,
  };
  return <JsonLd json={json} />;
}

export function FAQSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return <JsonLd json={json} />;
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
  return <JsonLd json={json} />;
}

export function WebSiteSchema() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Site-Control',
    url: BASE_URL,
    description: 'חנות והתקנה של מצלמות אבטחה, מקליטים, אינטרקום ובקרת כניסה בישראל, ומצלמות סולאריות 4G לאתרים בלי חשמל',
    inLanguage: 'he',
  };
  return <JsonLd json={json} />;
}

export function OrganizationSchema() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Site-Control',
    url: BASE_URL,
    logo: `${BASE_URL}/images/site-control-logo.webp`,
    description: 'חברת התקנות וחנות אונליין של מצלמות אבטחה, מקליטים, אינטרקום ובקרת כניסה. Hikvision, Uniview, Reolink, VisionNet ו-Tenda, ומצלמות סולאריות 4G לאתרים בלי חשמל.',
    telephone: '+972-50-2256866',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressLocality: 'ישראל',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+972-50-2256866',
      contactType: 'customer service',
      availableLanguage: ['Hebrew', 'English'],
    },
  };
  return <JsonLd json={json} />;
}