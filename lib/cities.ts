export interface City {
  id: string;
  name: string;
  slug: string;
  description: string;
  region: string;
  population: string;
  challenges: string[];
  solutions: string[];
}

export const cities: City[] = [
  {
    id: '1',
    name: 'ירושלים',
    slug: 'jerusalem',
    description: 'בירת ישראל - פרויקטים גדולים ובנייה אינטנסיבית',
    region: 'ירושלים',
    population: '1M+',
    challenges: [
      'אתרי בנייה גדולים ורבי-שנתיים',
      'שטח הררי ומבודד',
      'צורך במעקב מרחוק ממשרדים מרכזיים',
    ],
    solutions: [
      'מערכת 4 מצלמות PTZ בחיסכון',
      'ניהול שוטף ודיווחים יומיים',
      'טיים-לאפס שיווקי למשקיעים',
    ],
  },
  {
    id: '2',
    name: 'תל אביב',
    slug: 'tel-aviv',
    description: 'מטרופולין עם פרויקטים קטנים אך רבים',
    region: 'תל אביב',
    population: '500K+',
    challenges: [
      'פרויקטים קטנים בעיר צפופה',
      'ניהול מרובה אתרים בו-זמנית',
      'גניבות של ציוד בתוך עיר',
    ],
    solutions: [
      'מצלמה בודדת + ניהול שקט',
      'ביטוח מלא נגד גניבות',
      'צפייה Live מכל מקום',
    ],
  },
  {
    id: '3',
    name: 'חיפה',
    slug: 'haifa',
    description: 'בנייה בשטח הררי עם אתגרי טבע',
    region: 'חיפה',
    population: '280K+',
    challenges: [
      'שטח הררי וקשה לגישה',
      'תנאי מזג אוויר קשים',
      'בנייה ממושכת בשטח',
    ],
    solutions: [
      'מצלמות עמידות בתנאים קשים',
      'ללא צורך בתחזוקה קבועה',
      'פאנל סולארי חזק',
    ],
  },
  {
    id: '4',
    name: 'באר שבע',
    slug: 'beersheba',
    description: 'שטח דרומי עם שמש חזקה ופרויקטים רחוקים',
    region: 'באר שבע',
    population: '190K+',
    challenges: [
      'שטח מבודד בדרום',
      'שמש חזקה וחום קיצוני',
      'רחוק ממרכז המדינה',
    ],
    solutions: [
      'מצלמות סולאריות עם פאנל חזק',
      'עמידות לחום קיצוני',
      'תקשורת סלולרית מהימנה',
    ],
  },
  {
    id: '5',
    name: 'ראשון לציון',
    slug: 'rishon-lezion',
    description: 'עיר מתפתחת עם פרויקטים אזוריים',
    region: 'מרכז',
    population: '250K+',
    challenges: [
      'פרויקטים מעל לממוצע',
      'ניהול מבחוץ מהעיר',
      'צורך בשיווק פרויקטים',
    ],
    solutions: [
      'חבילת 4 מצלמות בחיסכון',
      'Time-Lapse שיווקי',
      'דיווחים אוטומטיים',
    ],
  },
  {
    id: '6',
    name: 'גליל',
    slug: 'galilee',
    description: 'אזור חקלאי עם פרויקטים כפריים',
    region: 'צפון',
    population: 'תושבים מפוזרים',
    challenges: [
      'שטחים חקלאיים מבודדים',
      'גניבות ציוד חקלאי',
      'מרחקים גדולים בין אתרים',
    ],
    solutions: [
      'מצלמות שביל עם זיהוי תנועה',
      'מעקב 24/7 בלי ניטור רציף',
      'ביטוח מפני גניבה',
    ],
  },
  {
    id: '7',
    name: 'שנגור',
    slug: 'negev',
    description: 'אזור מתפתח עם פרויקטים חדשים',
    region: 'דרום',
    population: 'מתפתח',
    challenges: [
      'קליטה של עובדים חדשים',
      'פרויקטים באזור מבודד',
      'צורך בניהול קשוב',
    ],
    solutions: [
      'מערכת מצלמות סולארית',
      'ניהול שוטף וביטוח',
      'תוכן שיווקי בעברית',
    ],
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}

export function getCitiesByRegion(region: string): City[] {
  return cities.filter((city) => city.region === region);
}

export function getRegions(): string[] {
  return [...new Set(cities.map((city) => city.region))];
}
