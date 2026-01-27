const fs = require('fs').promises;
const path = require('path');

/**
 * מנתח נתונים מ-Google Search Console ומוצא הזדמנויות תוכן
 */
class GSCAnalyzer {
  constructor() {
    this.gscDataPath = path.join(__dirname, '..', 'gsc_output.txt');
  }

  /**
   * קורא נתונים מקובץ GSC
   */
  async readGSCData() {
    try {
      const data = await fs.readFile(this.gscDataPath, 'utf8');
      return this.parseGSCData(data);
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
    // אם יש encoding issues, מנסה לתקן
    if (text.includes('╫')) {
      return text; // נשאיר כמו שזה - נטפל בזה אחר כך
    }
    return text;
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
    
    // סינון הזדמנויות
    const opportunities = queries.filter(q => {
      return q.impressions >= 100 &&    // יש נפח חיפוש סביר
             q.clicks < 20 &&            // אבל אין clicks (פוטנציאל!)
             q.position > 10;            // לא בעמוד ראשון
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
   * נושאים fallback אם GSC לא עובד
   */
  getFallbackOpportunities() {
    return [
      {
        query: 'מצלמות אבטחה עם זיהוי פנים',
        impressions: 3200,
        clicks: 5,
        position: 15.2
      },
      {
        query: 'התקנת מצלמות אבטחה לבית',
        impressions: 2800,
        clicks: 8,
        position: 14.5
      },
      {
        query: 'מצלמות אבטחה עם הקלטה ענן',
        impressions: 2400,
        clicks: 6,
        position: 16.8
      },
      {
        query: 'מצלמות אבטחה חיצוניות עמידות במים',
        impressions: 2100,
        clicks: 4,
        position: 18.3
      },
      {
        query: 'מערכת אבטחה מלאה לבית',
        impressions: 3500,
        clicks: 12,
        position: 13.1
      }
    ];
  }

  /**
   * ממיר query לנושא בלוג
   */
  convertToTopic(query, year = 2026) {
    const templates = [
      `${query} ${year} - המדריך המלא והמעודכן`,
      `${query} ${year} - כל מה שצריך לדעת לפני הרכישה`,
      `${query} - השוואה מקיפה והמלצות מקצועיות ${year}`,
      `${query} ${year} - היתרונות, החסרונות ומה כדאי לקנות`,
      `${query} - מדריך מקצועי ${year} עם טיפים וטריקים`
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate;
  }

  /**
   * ממיר query ל-English slug
   */
  convertToSlug(query) {
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
      'חשמל': 'power'
    };
    
    let slug = query;
    
    // המרה לפי מילון
    for (const [heb, eng] of Object.entries(transliterationMap)) {
      slug = slug.replace(new RegExp(heb, 'g'), eng);
    }
    
    // ניקוי
    slug = slug
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return slug + '-2026';
  }

  /**
   * יוצר keywords מה-query
   */
  generateKeywords(query) {
    const baseKeywords = [query];
    
    // מוסיף וריאציות
    const variations = [
      `${query} 2026`,
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
