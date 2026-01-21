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
    '@type': 'LocalBusiness',
    name: 'Site-Control',
    description:
      'מצלמות אבטחה סולאריות 4G לאתרי בנייה, חקלאות ושטחים מבודדים - גיבוי ענן אוטומטי, איכות 4K, ראיית לילה צבעונית ושליטה מרחוק 24/7',
    telephone: '+972-50-0000000',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressLocality: 'ישראל',
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '31.5',
        longitude: '34.9',
      },
      geoRadius: '200000',
    },
    url: BASE_URL,
    priceRange: '₪₪-₪₪₪',
    image: `${BASE_URL}/optimized-variants/תמונת הירו ראשית/reolink-go-plus-security-camera.optimized-w1920.avif`,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
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

export function OrganizationSchema() {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Site-Control',
    url: BASE_URL,
    logo: `${BASE_URL}/optimized-variants/הלוגו שלי/site-control-logo.optimized-w480.avif`,
    description: 'ספק מוביל של מצלמות אבטחה סולאריות 4G בישראל - פתרונות מעקב מתקדמים לאתרי בנייה, חקלאות ושטחים מבודדים',
    telephone: '+972-50-0000000',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressLocality: 'ישראל',
    },
    sameAs: [
      'https://www.facebook.com/sitecontrol',
      'https://www.linkedin.com/company/sitecontrol',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+972-50-0000000',
      contactType: 'customer service',
      availableLanguage: ['Hebrew', 'English'],
    },
  };
  return <JsonLd json={json} />;
}