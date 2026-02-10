const fs = require('fs').promises;
const path = require('path');
const slugify = require('slugify');

/**
 * מנתח נתונים מ-Google Search Console ומוצא הזדמנויות תוכן
 * 
 * הערה חשובה: מחלקה זו קוראת מקובץ סטטי מקומי (gsc_output.txt) 
 * ואינה מתחברת ישירות ל-Google Search Console API.
 * יש לעדכן את הקובץ ידנית או באמצעות סקריפט נפרד.
 */
class GSCAnalyzer {
  constructor() {
    this.gscDataPath = path.join(__dirname, '..', 'gsc_output.json');
    // שנה נוכחית לתוכן רלוונטי
    this.currentYear = new Date().getFullYear();
  }

  /**
   * קורא נתונים מקובץ GSC (JSON)
   */
  async readGSCData() {
    try {
      const data = await fs.readFile(this.gscDataPath, 'utf8');
      const jsonData = JSON.parse(data);
      console.log(`📅 נתונים מתאריך: ${jsonData.dateRange?.start} עד ${jsonData.dateRange?.end}`);
      return jsonData.queries || [];
    } catch (error) {
      console.error('❌ לא הצלחתי לקרוא GSC data:', error.message);
      return [];
    }
  }

  /**
   * מפרסר את נתוני GSC
   */
  parseGSCData(data) {
    const queries = [];
    const lines = data.split('\n');
    
    for (const line of lines) {
      // מחפש שורות עם clicks, impressions, position
      const match = line.match(/Clicks:\s*(\d+),\s*Impressions:\s*(\d+),\s*Pos:\s*([\d.]+)/);
      if (match) {
        const queryMatch = line.match(/^-\s*(.+?)\s*\(Clicks/);
        if (queryMatch) {
          let query = queryMatch[1].trim();
          // מנקה encoding issues
          query = this.cleanHebrewText(query);
          
          queries.push({
            query,
            clicks: parseInt(match[1]),
            impressions: parseInt(match[2]),
            position: parseFloat(match[3])
          });
        }
      }
    }
    
    return queries;
  }

  /**
   * מנקה טקסט עברי מבעיות encoding
   */
  cleanHebrewText(text) {
    if (!text) return '';
    
    // הסרת תווי encoding שבורים נפוצים
    let cleaned = text
      .replace(/[╫×]/g, '') // תווים שבורים מ-CP1252/UTF-8 mismatch
      .replace(/[\x00-\x1F\x7F]/g, '') // control characters
      .replace(/\uFFFD/g, '') // replacement character
      .replace(/[─│┌┐└┘├┤┬┴┼]/g, '') // box drawing characters
      .replace(/\s+/g, ' ') // normalize whitespace
      .trim();
    
    return cleaned;
  }

  /**
   * מנתח הזדמנויות תוכן
   */
  async analyzeOpportunities() {
    console.log('📊 מנתח נתוני Google Search Console...');
    
    const queries = await this.readGSCData();
    
    if (queries.length === 0) {
      console.log('⚠️  לא נמצאו queries ב-GSC data');
      return this.getFallbackOpportunities();
    }
    
    console.log(`✅ נמצאו ${queries.length} queries מ-GSC`);
    
    // סינון הזדמנויות - סף נמוך לאתר חדש
    const opportunities = queries.filter(q => {
      return q.impressions >= 3 &&      // סף נמוך לאתר חדש
             q.clicks < 20 &&            // אבל אין clicks (פוטנציאל!)
             q.position > 8;             // יש מקום לשיפור
    });
    
    // מדרג לפי פוטנציאל
    opportunities.sort((a, b) => {
      // ציון = (impressions / clicks+1) * (position-10)
      const scoreA = a.impressions / (a.clicks + 1) * (a.position - 10);
      const scoreB = b.impressions / (b.clicks + 1) * (b.position - 10);
      return scoreB - scoreA;
    });
    
    console.log(`✅ נמצאו ${opportunities.length} הזדמנויות פוטנציאליות`);
    
    if (opportunities.length === 0) {
      console.log('⚠️  לא נמצאו הזדמנויות מתאימות, משתמש בנושאים fallback');
      return this.getFallbackOpportunities();
    }
    
    return opportunities.slice(0, 5); // מחזיר 5 הטובים ביותר
  }

  /**
   * נושאים fallback אם GSC לא עובד או שהנושאים מכוסים
   */
  getFallbackOpportunities() {
    return [
      {
        query: 'מצלמות אבטחה לעסקים קטנים',
        impressions: 3200,
        clicks: 5,
        position: 15.2
      },
      {
        query: 'מצלמות אבטחה עם ראיית לילה',
        impressions: 2800,
        clicks: 8,
        position: 14.5
      },
      {
        query: 'מצלמות אבטחה לחניון',
        impressions: 2400,
        clicks: 6,
        position: 16.8
      },
      {
        query: 'מצלמות אבטחה למחסנים ומפעלים',
        impressions: 2100,
        clicks: 4,
        position: 18.3
      },
      {
        query: 'מצלמות אבטחה לגני ילדים',
        impressions: 3500,
        clicks: 12,
        position: 13.1
      }
    ];
  }

  /**
   * ממיר query לנושא בלוג
   * לפעמים עם שנה, לפעמים בלי - לגיוון טבעי יותר
   */
  convertToTopic(query) {
    const year = this.currentYear;
    // חלק מהתבניות עם שנה, חלק בלי - לגיוון טבעי
    const templates = [
      `${query} - המדריך המלא והמעודכן`,
      `${query} - כל מה שצריך לדעת לפני הרכישה`,
      `${query} - השוואה מקיפה והמלצות מקצועיות`,
      `${query} ${year} - היתרונות, החסרונות ומה כדאי לקנות`,
      `${query} - מדריך מקצועי עם טיפים וטריקים`,
      `${query} - המדריך המקצועי ${year}`,
      `${query} בישראל - כל מה שצריך לדעת`
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate;
  }

  /**
   * ממיר query ל-English slug
   * משתמש במילון ידני להמרות ספציפיות, ואז slugify לניקוי סופי
   */
  convertToSlug(query) {
    // מילון המרות ידניות - עדיפות על פני transliteration אוטומטית
    const transliterationMap = {
      'מצלמות': 'cameras',
      'מצלמה': 'camera',
      'אבטחה': 'security',
      'בטחון': 'security',
      'אזעקה': 'alarm',
      'חכם': 'smart',
      'חכמה': 'smart',
      'חכמות': 'smart',
      'זיהוי': 'detection',
      'פנים': 'face',
      'התקנה': 'installation',
      'התקנת': 'installation',
      'הקלטה': 'recording',
      'ענן': 'cloud',
      'חיצוני': 'outdoor',
      'חיצונית': 'outdoor',
      'חיצוניות': 'outdoor',
      'עמיד': 'weatherproof',
      'עמידה': 'weatherproof',
      'עמידות': 'weatherproof',
      'מים': 'water',
      'במים': 'waterproof',
      'מערכת': 'system',
      'מלא': 'complete',
      'מלאה': 'complete',
      'בית': 'home',
      'לבית': 'home',
      'סולארי': 'solar',
      'סולארית': 'solar',
      'סולאריות': 'solar',
      'אלחוטי': 'wireless',
      'אלחוטית': 'wireless',
      'אלחוטיות': 'wireless',
      '4G': '4g',
      'עם': 'with',
      'ללא': 'without',
      'חשמל': 'power',
      'מחיר': 'price',
      'מחירים': 'prices',
      'המלצות': 'recommendations',
      'ביקורות': 'reviews',
      'השוואה': 'comparison',
      'מדריך': 'guide',
      'טיפים': 'tips',
      'לקנות': 'buy',
      'רכישה': 'purchase',
      'איכות': 'quality',
      'מקצועי': 'professional',
      'ביתי': 'residential',
      'עסקי': 'commercial',
      // נוספו מילים חדשות
      'חקלאות': 'agriculture',
      'לחקלאות': 'agriculture',
      'חקלאי': 'agricultural',
      'חקלאיים': 'agricultural',
      'בנייה': 'construction',
      'לבנייה': 'construction',
      'אתרי': 'sites',
      'לאתרי': 'sites',
      'אתר': 'site',
      'עסקים': 'business',
      'לעסקים': 'business',
      'קטנים': 'small',
      'גדולים': 'large',
      'ראיית': 'night-vision',
      'לילה': 'night',
      'חניון': 'parking',
      'לחניון': 'parking',
      'מחסנים': 'warehouses',
      'למחסנים': 'warehouses',
      'מפעלים': 'factories',
      'גני': 'kindergarten',
      'ילדים': 'children',
      'שטחים': 'areas',
      'לשטחים': 'areas'
    };
    
    let text = query;
    
    // שלב 1: המרה לפי מילון ידני
    for (const [heb, eng] of Object.entries(transliterationMap)) {
      text = text.replace(new RegExp(heb, 'g'), eng);
    }
    
    // שלב 2: שימוש ב-slugify לניקוי וטיפול בתווים שנותרו
    let slug = slugify(text, {
      lower: true,           // המרה ל-lowercase
      strict: true,          // הסרת תווים מיוחדים
      remove: /[*+~.()'"!:@]/g, // הסרת תווים ספציפיים
      trim: true             // הסרת רווחים מההתחלה והסוף
    });
    
    // שלב 3: ניקוי סופי - הסרת מקפים כפולים וריקים
    slug = slug
      .replace(/-+/g, '-')   // מקפים כפולים
      .replace(/^-|-$/g, '') // מקפים בהתחלה/סוף
      || 'post';             // fallback אם הכל נמחק
    
    // מוסיף שנה רק לפעמים - לא תמיד
    const addYear = Math.random() > 0.5;
    return addYear ? `${slug}-${this.currentYear}` : slug;
  }

  /**
   * יוצר keywords מה-query
   */
  generateKeywords(query) {
    const baseKeywords = [query];
    
    // מוסיף וריאציות עם שנה דינמית
    const variations = [
      `${query} ${this.currentYear}`,
      `${query} למכירה`,
      `${query} מחיר`,
      `${query} המלצות`,
      `${query} ביקורות`,
      `${query} השוואה`
    ];
    
    return [...baseKeywords, ...variations.slice(0, 5)];
  }
}

module.exports = GSCAnalyzer;
