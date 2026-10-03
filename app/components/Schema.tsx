import { BASE_URL } from '../config';
import { BUSINESS } from '../data/business';
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
      'חנות מצלמות אבטחה עם שירות התקנה: מצלמות IP, ערכות, מקליטים, אינטרקום ובקרת כניסה של Hikvision, Uniview, Reolink, VisionNet ו-Tenda ציוד מיבואן בישראל. משלוח, איסוף עצמי, או התקנה בתיאום ולפי הצעת מחיר.',
    legalName: BUSINESS.legalName,
    telephone: BUSINESS.phoneE164,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
    },
    // החנות שולחת לכל הארץ; ההתקנה בכל הארץ בתיאום ולפי הצעת מחיר (סכמת Service בדף /installation)
    areaServed: { '@type': 'Country', name: 'Israel' },
    openingHoursSpecification: BUSINESS.hoursSpec.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
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

/**
 * מדיניות החזרה לסכמת Offer (MerchantReturnPolicy), מקבילה לדף /returns ול-BUSINESS.returns.
 * גוגל: applicableCountry + returnPolicyCategory חובה, merchantReturnDays חובה לחלון סופי;
 * ReturnFeesCustomerResponsibility = הלקוח מחזיר על חשבונו (ואז לא מציינים returnShippingFeesAmount).
 */
export function merchantReturnPolicy() {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'IL',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: BUSINESS.returns.days,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
    merchantReturnLink: `${BASE_URL}/returns`,
  };
}

/**
 * פרטי משלוח לסכמת Offer (OfferShippingDetails) לפי קטגוריית המוצר בחנות.
 * המספרים ב-BUSINESS.shipping.schema: תקרת מחיר (גוגל דורשת value או maxValue) וימי אספקה.
 */
export function offerShippingDetails(category: string) {
  const s = BUSINESS.shipping.schema;
  const size = (s.largeCategories as readonly string[]).includes(category) ? 'large' : 'small';
  const qty = (range: readonly [number, number]) => ({ '@type': 'QuantitativeValue', minValue: range[0], maxValue: range[1], unitCode: 'DAY' });
  return {
    '@type': 'OfferShippingDetails',
    shippingRate: { '@type': 'MonetaryAmount', maxValue: s.maxNis[size], currency: 'ILS' },
    shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IL' },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: qty(s.handlingDays),
      transitTime: qty(s.transitDays),
    },
  };
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
      // הערכים הישנים כאן (החזרה חינם 30 יום, משלוח חינם) לא היו נכונים; עכשיו מהמקור האחד ב-BUSINESS.
      shippingDetails: offerShippingDetails('solar'),
      hasMerchantReturnPolicy: merchantReturnPolicy(),
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
    legalName: BUSINESS.legalName,
    telephone: BUSINESS.phoneE164,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS.phoneE164,
      contactType: 'customer service',
      availableLanguage: ['Hebrew', 'English'],
    },
  };
  return <JsonLd json={json} />;
}