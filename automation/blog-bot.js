#!/usr/bin/env node
/**
 * Blog Bot - אוטומציית בלוג פשוטה ומלאה
 * 
 * מה זה עושה:
 * 1. שולף נתוני Google Search Console (חי מה-API או מקובץ סטטי)
 * 2. מוצא הזדמנויות SEO - שאילתות עם חשיפה גבוהה ומיקום נמוך
 * 3. יוצר תוכן בלוג מקצועי עם Gemini 2.5 Flash
 * 4. מייצר תמונת hero עם Gemini 3 Pro Image (Nano Banana Pro)
 * 5. כותב את הקבצים לפרויקט ומעדכן את רשימת הבלוגים
 * 
 * הרצה: node automation/blog-bot.js
 */

const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// ---------- CONFIG ----------
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BLOG_DATA_PATH = path.join(PROJECT_ROOT, 'app', 'data', 'blog.ts');
const BLOG_DIR = path.join(PROJECT_ROOT, 'app', 'blog');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'blog-images');
const GSC_JSON_PATH = path.join(PROJECT_ROOT, 'gsc_output.json');
const SITE_URL = 'sc-domain:site-control-il.com';

// Gemini models
const CONTENT_MODEL = 'gemini-2.5-flash';
const IMAGE_MODEL = 'gemini-3-pro-image-preview';

// ---------- HEBREW → ENGLISH DICTIONARY ----------
const HEBREW_TO_ENGLISH = {
  'מצלמות': 'cameras', 'מצלמה': 'camera', 'אבטחה': 'security',
  'חכמות': 'smart', 'חכמה': 'smart', 'בנייה': 'construction',
  'בית': 'home', 'עסק': 'business', 'חקלאות': 'agriculture',
  'סולארי': 'solar', 'סולארית': 'solar', 'מנעולים': 'locks',
  'ביומטרי': 'biometric', 'ביומטריים': 'biometric',
  'זיהוי': 'detection', 'פנים': 'face', 'ענן': 'cloud',
  'הקלטה': 'recording', 'התקנה': 'installation', 'חיצוניות': 'outdoor',
  'עמידות': 'weatherproof', 'מים': 'water', 'לילה': 'night',
  'אלחוטיות': 'wireless', 'אלחוטית': 'wireless',
  'טיימלאפס': 'timelapse', 'תיעוד': 'documentation',
  'פרויקט': 'project', 'פרויקטים': 'projects', 'פרויקטי': 'projects',
  'מעקב': 'monitoring', 'התקדמות': 'progress',
  'שיווק': 'marketing', 'פרסום': 'advertising',
  'מקצועי': 'professional', 'מקצועית': 'professional',
  'לקבלנים': 'contractors', 'קבלנים': 'contractors',
  'יזמים': 'developers', 'ליזמים': 'developers',
  'סרטון': 'video', 'צילום': 'photography',
  'אתר': 'site', 'אתרי': 'sites', 'משפטי': 'legal', 'משפטיים': 'legal',
  'צרכים': 'needs', 'ישראל': 'israel',
  'דירה': 'apartment', 'משרד': 'office',
  'חנות': 'store', 'מפעל': 'factory', 'מחסן': 'warehouse',
  'גלאי': 'detector', 'חיישן': 'sensor', 'חיישנים': 'sensors',
  'אזעקה': 'alarm', 'אזעקות': 'alarms',
  'פרטיות': 'privacy', 'חוק': 'law', 'תיקון': 'amendment',
  'מדריך': 'guide', 'השוואה': 'comparison',
  'ופרסום': 'advertising', 'לאתרי': 'sites',
  'עם': '', 'ב': '', 'ל': '', 'של': '', 'על': '', 'את': '', 'או': '',
  'מה': '', 'כל': '', 'כדאי': '', 'לקנות': 'buy', 'למכירה': 'sale',
  'מחיר': 'price', 'מחירים': 'prices',
  'המלצות': 'recommendations', 'ביקורות': 'reviews',
  'היתרונות': 'advantages', 'החסרונות': 'disadvantages',
};

// ---------- UTILITIES ----------

function hebrewToSlug(hebrewText) {
  const words = hebrewText.split(/\s+/);
  const englishWords = words
    .map(w => HEBREW_TO_ENGLISH[w] || '')
    .filter(w => w.length > 0);

  if (englishWords.length === 0) {
    // Fallback: use slugify with transliteration
    return slugify(hebrewText, { lower: true, strict: true, locale: 'he' }) || 'blog-post';
  }

  // Deduplicate consecutive same words
  const deduped = englishWords.filter((w, i) => i === 0 || w !== englishWords[i - 1]);
  const slug = deduped.join('-');
  const year = new Date().getFullYear();
  return `${slug}-${year}`;
}

function getExistingSlugs() {
  try {
    const content = fs.readFileSync(BLOG_DATA_PATH, 'utf-8');
    const slugMatches = content.match(/slug:\s*'([^']+)'/g) || [];
    return slugMatches.map(m => m.match(/slug:\s*'([^']+)'/)[1]);
  } catch {
    return [];
  }
}

function getNextBlogId() {
  try {
    const content = fs.readFileSync(BLOG_DATA_PATH, 'utf-8');
    const idMatches = content.match(/id:\s*'(\d+)'/g) || [];
    const ids = idMatches.map(m => parseInt(m.match(/id:\s*'(\d+)'/)[1]));
    return String(Math.max(...ids, 0) + 1);
  } catch {
    return '1';
  }
}

// ---------- GSC DATA ----------

async function fetchGSCData() {
  // Try live API first (needs GSC_SERVICE_ACCOUNT env var)
  if (process.env.GSC_SERVICE_ACCOUNT) {
    try {
      console.log('🔗 מתחבר ל-Google Search Console API...');
      return await fetchLiveGSC();
    } catch (err) {
      console.warn('⚠️ שגיאה בחיבור ל-GSC API, עובר לקובץ סטטי:', err.message);
    }
  }

  // Fallback: read static file
  console.log('📂 קורא נתוני GSC מקובץ סטטי...');
  return readStaticGSC();
}

async function fetchLiveGSC() {
  const { google } = require('googleapis');
  const credentials = JSON.parse(process.env.GSC_SERVICE_ACCOUNT);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const response = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 200,
    },
  });

  const queries = (response.data.rows || []).map(row => ({
    query: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    position: row.position,
  }));

  // Also save to file for future fallback
  const gscData = { site: SITE_URL, dateRange: { start: startDate, end: endDate }, fetchedAt: new Date().toISOString(), queries };
  fs.writeFileSync(GSC_JSON_PATH, JSON.stringify(gscData, null, 2), 'utf-8');
  console.log(`✅ נשלפו ${queries.length} שאילתות מ-GSC, נשמרו ל-gsc_output.json`);

  return queries;
}

function readStaticGSC() {
  try {
    const data = JSON.parse(fs.readFileSync(GSC_JSON_PATH, 'utf-8'));
    console.log(`📊 נקראו ${data.queries.length} שאילתות (עדכון: ${data.fetchedAt})`);
    return data.queries;
  } catch {
    console.log('⚠️ אין קובץ GSC, משתמש בנושאים ברירת מחדל');
    return [];
  }
}

// ---------- FIND OPPORTUNITIES ----------

// Keywords that signal B2B/commercial intent — boost their score
const COMMERCIAL_INTENT_KEYWORDS = [
  'לאתר בנייה', 'לקבלן', 'לחקלאות', 'לשדה', 'לכרם', 'מרוחק', 'מבודד',
  'ללא חשמל', 'ללא אינטרנט', 'סולארי', 'סולארית', '4G', 'LTE',
  'מחיר', 'עלות', 'כמה עולה', 'לקנות', 'השוואה', 'ביקורת',
  'reolink', 'go plus', 'ptz', 'gיבוי ענן', 'גיבוי ענן',
  'טיימלאפס', 'timelapse', 'תיעוד', 'ניטור', 'פיקוח',
];

function getCommercialScore(query) {
  const lower = query.toLowerCase();
  return COMMERCIAL_INTENT_KEYWORDS.filter(k => lower.includes(k)).length;
}

function findOpportunity(queries) {
  const existingSlugs = getExistingSlugs();
  console.log(`📝 בלוגים קיימים: ${existingSlugs.length}`);

  // Filter: high impressions, low clicks, position 8-50 (sweet spot — off first page but indexable)
  const opportunities = queries
    .filter(q => q.impressions >= 3 && q.clicks < 30 && q.position > 7 && q.position < 60)
    .map(q => {
      const commercialBonus = getCommercialScore(q.query) * 10;
      // Position 11-20 (page 2) = highest priority — easiest to push to page 1
      const positionBonus = (q.position >= 11 && q.position <= 20) ? 20 : 0;
      return {
        ...q,
        slug: hebrewToSlug(q.query),
        score: (q.impressions * (1 / Math.max(q.position, 1))) + commercialBonus + positionBonus,
      };
    })
    .sort((a, b) => b.score - a.score);

  // Find first opportunity that doesn't have a blog yet
  for (const opp of opportunities) {
    const slugBase = opp.slug.replace(/-\d{4}$/, ''); // Remove year for comparison
    const alreadyExists = existingSlugs.some(s =>
      s === opp.slug || s.includes(slugBase) || slugBase.includes(s.replace(/-\d{4}$/, ''))
    );

    if (!alreadyExists) {
      console.log(`🎯 הזדמנות נמצאה: "${opp.query}" (${opp.impressions} impressions, position ${opp.position.toFixed(1)})`);
      return opp;
    }
  }

  // Fallback topics - focused on B2B target audience (construction, agriculture, remote sites)
  const fallbackTopics = [
    // Construction site monitoring - high commercial intent
    'מצלמות אבטחה לאתר בנייה ללא חשמל',
    'ניטור אתר בנייה מרחוק 24/7',
    'מצלמות מעקב לקבלן בנין',
    'מניעת גניבות ציוד באתר בנייה',
    'פיקוח על עובדים באתר בנייה מצלמות',
    'תיעוד התקדמות בנייה מצלמות סולאריות',
    // Agriculture - high commercial intent
    'מצלמות אבטחה לשדה חקלאי ללא חשמל',
    'ניטור ציוד חקלאי מרחוק 4G',
    'אבטחת מחסן חקלאי מבודד',
    'מצלמות לכרם ומטע ללא אינטרנט',
    // Remote sites - core use case
    'מצלמות אבטחה לאתר מבודד ללא חשמל',
    'פתרון אבטחה ללא תשתיות חשמל ואינטרנט',
    'מצלמות 4G סולאריות לאתרים מרוחקים',
    // Timelapse - strong differentiator
    'טיימלאפס לפרויקט בנייה',
    'תיעוד ויזואלי של פרויקט בנייה ללקוחות',
    'סרטון התקדמות בנייה ליזמים',
    // Comparison / informational with buying intent
    'השוואת מצלמות סולאריות 4G לאתרי בנייה',
    'Reolink GO Plus ביקורת בעברית',
    'מצלמת אבטחה סולארית עם גיבוי ענן',
    'כמה עולה מצלמת אבטחה לאתר בנייה',
  ];

  for (const topic of fallbackTopics) {
    const slug = hebrewToSlug(topic);
    if (!existingSlugs.includes(slug)) {
      console.log(`🎯 נושא מ-fallback: "${topic}"`);
      return { query: topic, slug, impressions: 0, clicks: 0, position: 0, score: 0 };
    }
  }

  console.log('❌ אין הזדמנויות חדשות');
  return null;
}

// ---------- GEMINI CONTENT GENERATION ----------

async function generateBlogContent(topic) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: CONTENT_MODEL });

  // Read existing blog slugs for internal linking
  const existingSlugs = getExistingSlugs();
  const internalLinks = existingSlugs.slice(0, 5).map(s => `/blog/${s}`);

  // Smart internal links to relevant pages based on topic
  const sitePages = [
    { url: '/products/go', anchor: 'Reolink GO Plus 4G', context: 'מצלמה סולארית 4G' },
    { url: '/products/ptz', anchor: 'Reolink PTZ Solar', context: 'מצלמה מסתובבת סולארית' },
    { url: '/use-cases/construction', anchor: 'מצלמות לאתרי בנייה', context: 'אתרי בנייה' },
    { url: '/use-cases/agriculture', anchor: 'מצלמות לחקלאות', context: 'חקלאות' },
    { url: '/use-cases/remote', anchor: 'ניהול אתרים מבודדים', context: 'אתרים מרוחקים' },
    { url: '/cloud-backup', anchor: 'גיבוי ענן אוטומטי', context: 'גיבוי ענן' },
    { url: '/weatherproof', anchor: 'עמידות IP66', context: 'עמידות מזג אוויר' },
    { url: '/video-quality', anchor: 'איכות וידאו 4K', context: 'רזולוציה 4K' },
    { url: '/packages', anchor: 'חבילות אבטחה', context: 'מחיר וחבילות' },
    { url: '/contact', anchor: 'ייעוץ חינם', context: 'יצירת קשר' },
    { url: '/timelapse', anchor: 'טיימלאפס לאתרי בנייה', context: 'תיעוד טיימלאפס בנייה' },
  ];

  // Check if topic is timelapse-related for external link instruction
  const isTimelapseTopic = /טיימלאפס|timelapse|תיעוד|סרטון|ויזואלי/.test(topic.query.toLowerCase());
  const timelapseLinkInstruction = isTimelapseTopic
    ? `\n## קישור חיצוני (חובה לכלול!):
- כלול קישור לאתר השותף <a href="https://timelapseit.co.il" target="_blank" rel="noopener">timelapseit.co.il</a> — שלב כשמדברים על דוגמאות עבודות, עריכת סרטון, או שיתוף פעולה לצילום טיימלאפס. הצג אותו כשותף המקצועי שלנו לצילום ועריכת טיימלאפס.`
    : '';

  const prompt = `אתה כותב תוכן SEO מומחה בישראל, מתמחה בתחום אבטחה ומצלמות סולאריות 4G, עובד בחברת Site-Control.
Site-Control מתמחה אך ורק במצלמות אבטחה סולאריות 4G (Reolink GO Plus ו-PTZ Solar) לשוק B2B: קבלני בנייה, חקלאים, מנהלי אתרים מבודדים.

כתוב פוסט בלוג מקצועי ומקיף בעברית על הנושא: "${topic.query}"

## קהל יעד מרכזי (כתוב עבורם!):
- קבלני בנייה ומנהלי פרויקטים (שמחפשים לאבטח ציוד ולתעד התקדמות)
- בעלי משקים חקלאיים (שמחפשים פתרון ללא חשמל ואינטרנט)
- מנהלי אתרים מרוחקים (מחסנים, שדות, אתרים מבודדים)

## דרישות תוכן:
- 2500-3000 מילים (ארוך = סמכותי = גוגל)
- פתח עם "כאב" אמיתי של הלקוח - הבעיה שהוא מנסה לפתור
- כלול 3-5 דוגמאות/תרחישים ספציפיים מהמציאות הישראלית (קבלן שאיבד ציוד, חקלאי שהשרתו נכנסו לשדה וכו')
- השווה גישות שונות (לפני/אחרי, עם/בלי מצלמה)
- כלול מפרטים טכניים ספציפיים: רזולוציה 4K, IP66, סוללה 9000mAh, פאנל סולארי, 4G LTE, microSD 256GB
- כלול המלצות ספציפיות לפי שימוש: Reolink GO Plus לאבטחה סטטית, Reolink PTZ Solar לשטחים גדולים
- שלב מילות מפתח בצורה טבעית: "${topic.query}"
- כלול נתונים/סטטיסטיקות רלוונטיות (עלות גניבת ציוד בנייה בישראל, אחוז אתרי בנייה עם מצלמות וכו')
- כלול סעיף FAQ עם 5 שאלות שאנשים ממש שואלים בגוגל
- סיים עם CTA חזק שמדגיש ייעוץ חינם מ-Site-Control

## קישורים פנימיים (כלול 4-6 קישורים בתוך הטקסט):
${sitePages.map(p => `- <a href="${p.url}">${p.anchor}</a> — שלב כשמדברים על: ${p.context}`).join('\n')}${timelapseLinkInstruction}

## מבנה HTML נדרש:
- כלול תוכן עניינים (table of contents) עם anchor links
- כותרות: h2 לסעיפים ראשיים, h3 לתתי-סעיפים
- טבלת השוואה עם מפרטים טכניים אם רלוונטי
- רשימות bullets לטיפים ומאפיינים
- קרוב לוודאי תרצה לכלול: "יתרונות", "חסרונות", "למי מתאים", "מחיר ותמורה"

מבנה הפלט - החזר JSON בדיוק בפורמט הזה:
{
  "title": "כותרת מושכת עם מילת המפתח הראשית, עד 65 תווים",
  "metaDescription": "תיאור meta עד 155 תווים שמכיל את מילת המפתח ופונה לקהל היעד",
  "category": "קטגוריה מתאימה (מצלמות אבטחה / פתרונות B2B / מדריכים / תיעוד בנייה / חקלאות)",
  "content": "תוכן המאמר המלא ב-HTML עם תגיות h2, h3, p, ul, li, strong, table, a. style: direction:rtl. קישורים פנימיים עם href מלא לדפי האתר.",
  "faqItems": [
    {"question": "שאלה בדיוק כמו שאנשים מחפשים בגוגל", "answer": "תשובה מפורטת ומועילה"}
  ],
  "keywords": ["מילת מפתח 1 (ארוכה וספציפית)", "...עד 8 מילות מפתח ספציפיות, לא גנריות"]
}

חשוב: החזר רק JSON תקין, בלי markdown code blocks, בלי טקסט נוסף.`;

  console.log('✍️ מייצר תוכן בלוג עם Gemini...');

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Parse JSON from response, handling possible markdown wrapping
  let jsonStr = text;
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1];

  // Clean any non-JSON prefix/suffix
  jsonStr = jsonStr.trim();
  if (!jsonStr.startsWith('{')) jsonStr = jsonStr.substring(jsonStr.indexOf('{'));
  if (!jsonStr.endsWith('}')) jsonStr = jsonStr.substring(0, jsonStr.lastIndexOf('}') + 1);

  const blogData = JSON.parse(jsonStr);
  console.log(`✅ תוכן נוצר: "${blogData.title}"`);
  return blogData;
}

// ---------- GEMINI IMAGE GENERATION ----------

async function generateBlogImage(topic, slug) {
  const imageDir = path.join(IMAGES_DIR, slug);
  fs.mkdirSync(imageDir, { recursive: true });

  if (!process.env.GEMINI_API_KEY) {
    console.log('⚠️ אין GEMINI_API_KEY, יוצר placeholder');
    createPlaceholderImage(imageDir, topic.query);
    return;
  }

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: IMAGE_MODEL });

    // Determine relevant visual context based on topic
    const topicLower = topic.query.toLowerCase();
    let sceneContext = 'a construction site with security cameras on poles';
    if (topicLower.includes('חקלא') || topicLower.includes('שדה') || topicLower.includes('כרם')) {
      sceneContext = 'an agricultural field or farm with solar-powered security cameras';
    } else if (topicLower.includes('טיימלאפס') || topicLower.includes('timelapse') || topicLower.includes('תיעוד')) {
      sceneContext = 'a construction site timelapse setup with cameras and solar panels';
    } else if (topicLower.includes('מבודד') || topicLower.includes('מרוחק') || topicLower.includes('ללא חשמל')) {
      sceneContext = 'a remote outdoor location with solar-powered 4G security cameras';
    }

    const prompt = `Create a professional, photorealistic hero image for a security camera company blog post about: "${topic.query}".

Scene: ${sceneContext}
Equipment visible: Reolink-style solar security camera with small solar panel attached, mounted on a pole or wall
Environment: Israeli landscape, clear sky, professional B2B setting
Style: wide 16:9 banner format, clean and professional, natural daylight
Color palette: blues, whites, and earthy tones matching Israeli construction/agriculture
Mood: trustworthy, professional, modern technology in real-world use
NO text or logos in the image. Photorealistic, high quality.`;

    console.log('🎨 מייצר תמונת hero עם Gemini 3 Pro Image...');

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    // Extract image from response
    const response = result.response;
    let imageFound = false;

    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
          const ext = part.inlineData.mimeType === 'image/png' ? 'png' : 
                      part.inlineData.mimeType === 'image/webp' ? 'webp' : 'png';
          fs.writeFileSync(path.join(imageDir, `hero.${ext}`), imageBuffer);
          console.log(`✅ תמונת hero נשמרה (${(imageBuffer.length / 1024).toFixed(0)}KB)`);
          imageFound = true;
          break;
        }
      }
    }

    if (!imageFound) {
      console.log('⚠️ לא התקבלה תמונה מ-Gemini, יוצר placeholder');
      createPlaceholderImage(imageDir, topic.query);
    }
  } catch (err) {
    console.warn('⚠️ שגיאה ביצירת תמונה:', err.message);
    
    // Fallback: try with gemini-2.5-flash-image
    try {
      console.log('🔄 מנסה fallback עם gemini-2.5-flash-image...');
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-native-audio-dialog' });
      
      // If fallback also doesn't work, use placeholder
      createPlaceholderImage(imageDir, topic.query);
    } catch {
      createPlaceholderImage(imageDir, topic.query);
    }
  }
}

function createPlaceholderImage(imageDir, title) {
  // Create a simple SVG placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="200" cy="315" r="80" fill="none" stroke="#0f3460" stroke-width="3" opacity="0.5"/>
  <circle cx="200" cy="315" r="40" fill="#0f3460" opacity="0.3"/>
  <circle cx="200" cy="315" r="15" fill="#e94560"/>
  <rect x="280" y="280" width="600" height="70" rx="8" fill="none" stroke="#0f3460" stroke-width="2" opacity="0.3"/>
  <text x="600" y="325" text-anchor="middle" fill="#ffffff" font-size="24" font-family="Arial" opacity="0.9">Site-Control | מצלמות אבטחה מתקדמות</text>
  <line x1="100" y1="500" x2="1100" y2="500" stroke="#0f3460" stroke-width="1" opacity="0.3"/>
  <text x="600" y="540" text-anchor="middle" fill="#a0a0a0" font-size="16" font-family="Arial">www.site-control-il.com</text>
</svg>`;

  fs.writeFileSync(path.join(imageDir, 'hero.svg'), svg, 'utf-8');
  console.log('📎 נוצר placeholder SVG');
}

// ---------- WRITE BLOG FILES ----------

function writeBlogPage(slug, blogData, topic) {
  const blogDir = path.join(BLOG_DIR, slug);
  fs.mkdirSync(blogDir, { recursive: true });

  // Build FAQ Schema
  const faqSchema = blogData.faqItems && blogData.faqItems.length > 0 ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: blogData.faqItems.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }) : null;

  // Build FAQ HTML
  const faqHtml = blogData.faqItems && blogData.faqItems.length > 0
    ? `<section style="margin-top: 3rem; padding: 2rem; background: rgba(15,52,96,0.05); border-radius: 12px;">
        <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem; color: var(--accent, #e94560);">שאלות נפוצות</h2>
        ${blogData.faqItems.map(faq => `
          <details style="margin-bottom: 1rem; padding: 1rem; background: var(--card, #fff); border-radius: 8px; border: 1px solid var(--border, #eee);">
            <summary style="font-weight: bold; cursor: pointer; color: var(--text, #333); font-size: 1.1rem;">${faq.question}</summary>
            <p style="margin-top: 0.75rem; line-height: 1.8; color: var(--text, #555);">${faq.answer}</p>
          </details>
        `).join('')}
      </section>` 
    : '';

  // Determine image extension
  const imageDir = path.join(IMAGES_DIR, slug);
  let imageExt = 'svg';
  for (const ext of ['png', 'webp', 'jpg', 'jpeg', 'avif']) {
    if (fs.existsSync(path.join(imageDir, `hero.${ext}`))) {
      imageExt = ext;
      break;
    }
  }

  const today = new Date().toISOString().split('T')[0];
  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blogData.title,
    description: blogData.metaDescription || '',
    image: `https://site-control-il.com/blog-images/${slug}/hero.${imageExt}`,
    datePublished: today,
    dateModified: today,
    author: {
      '@type': 'Organization',
      name: 'צוות Site-Control',
      url: 'https://site-control-il.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Site-Control',
      logo: {
        '@type': 'ImageObject',
        url: 'https://site-control-il.com/optimized-variants/הלוגו שלי/site-control-logo.optimized-w480.avif',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://site-control-il.com/blog/${slug}`,
    },
    keywords: (blogData.keywords || []).join(', '),
    articleSection: blogData.category || 'מצלמות אבטחה',
    url: `https://site-control-il.com/blog/${slug}`,
    isPartOf: {
      '@type': 'Blog',
      '@id': 'https://site-control-il.com/blog',
      name: 'בלוג Site-Control',
    },
  });

  const pageContent = `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${blogData.title.replace(/'/g, "\\'")} | Site-Control',
  description: '${(blogData.metaDescription || '').replace(/'/g, "\\'")}',
  keywords: ${JSON.stringify(blogData.keywords || [])},
  authors: [{ name: 'צוות Site-Control', url: 'https://site-control-il.com' }],
  openGraph: {
    title: '${blogData.title.replace(/'/g, "\\'")}',
    description: '${(blogData.metaDescription || '').replace(/'/g, "\\'")}',
    type: 'article',
    publishedTime: '${today}',
    locale: 'he_IL',
    siteName: 'Site-Control',
    url: 'https://site-control-il.com/blog/${slug}',
    images: [
      {
        url: 'https://site-control-il.com/blog-images/${slug}/hero.${imageExt}',
        width: 1200,
        height: 630,
        alt: '${blogData.title.replace(/'/g, "\\'")}',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '${blogData.title.replace(/'/g, "\\'")}',
    description: '${(blogData.metaDescription || '').replace(/'/g, "\\'")}',
    images: ['https://site-control-il.com/blog-images/${slug}/hero.${imageExt}'],
  },
  alternates: {
    canonical: 'https://site-control-il.com/blog/${slug}',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: \`${articleSchema.replace(/`/g, '\\`')}\` }}
      />
      ${faqSchema ? `<script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: \`${faqSchema.replace(/`/g, '\\`')}\` }}
      />` : ''}
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <nav style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
          <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>דף הבית</a>
          <span> / </span>
          <a href="/blog" style={{ color: '#007bff', textDecoration: 'none' }}>בלוג</a>
          <span> / </span>
          <span>${blogData.title.replace(/'/g, "\\'")}</span>
        </nav>
        <article style={{ lineHeight: '1.8', color: 'var(--text)' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text)', marginTop: '2rem' }}>
            ${blogData.title.replace(/'/g, "\\'")}
          </h1>
          <picture>
            <img
              src="/blog-images/${slug}/hero.${imageExt}"
              alt="${blogData.title.replace(/"/g, '&quot;')}"
              style={{ width: '100%', maxWidth: '1200px', height: 'auto', margin: '2rem 0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              loading="lazy"
            />
          </picture>
          <p style={{ margin: '1rem 0', fontStyle: 'italic', color: 'var(--muted)' }}>
            מעודכן ל-${new Date().toLocaleDateString('he-IL')} | צוות Site-Control
          </p>
          <div dangerouslySetInnerHTML={{ __html: \`${(blogData.content || '').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
          ${faqHtml ? `<div dangerouslySetInnerHTML={{ __html: \`${faqHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />` : ''}
          <div style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>צריכים ייעוץ מקצועי?</h3>
            <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>הצוות שלנו ב-Site-Control ישמח לעזור לכם לבחור את הפתרון המושלם</p>
            <a href="/contact" style={{ display: 'inline-block', padding: '12px 32px', background: '#e94560', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              צרו קשר עכשיו
            </a>
          </div>
        </article>
      </div>
    </>
  );
}
`;

  fs.writeFileSync(path.join(blogDir, 'page.tsx'), pageContent, 'utf-8');
  console.log(`📄 דף בלוג נוצר: app/blog/${slug}/page.tsx`);
}

function addBlogEntry(slug, blogData) {
  const content = fs.readFileSync(BLOG_DATA_PATH, 'utf-8');
  const nextId = getNextBlogId();
  const today = new Date().toISOString().split('T')[0];

  // Determine image extension
  const imageDir = path.join(IMAGES_DIR, slug);
  let imageExt = 'svg';
  for (const ext of ['png', 'webp', 'jpg', 'jpeg', 'avif']) {
    if (fs.existsSync(path.join(imageDir, `hero.${ext}`))) {
      imageExt = ext;
      break;
    }
  }

  const excerpt = (blogData.metaDescription || blogData.title).substring(0, 150) + '...';

  const newEntry = `  {
    id: '${nextId}',
    title: '${blogData.title.replace(/'/g, "\\'")}',
    slug: '${slug}',
    excerpt: '${excerpt.replace(/'/g, "\\'")}',
    content: '', // Content is rendered in page.tsx
    author: 'צוות Site-Control',
    date: '${today}',
    category: '${(blogData.category || 'מצלמות אבטחה').replace(/'/g, "\\'")}',
    image: '/blog-images/${slug}/hero.${imageExt}',
    seoTitle: '${blogData.title.replace(/'/g, "\\'")} | Site-Control',
    seoDescription: '${(blogData.metaDescription || '').replace(/'/g, "\\'")}',
    keywords: ${JSON.stringify(blogData.keywords || [])}
  },`;

  // Insert after the array opening
  const updatedContent = content.replace(
    /export const blogPosts: BlogPost\[\] = \[/,
    `export const blogPosts: BlogPost[] = [\n${newEntry}`
  );

  fs.writeFileSync(BLOG_DATA_PATH, updatedContent, 'utf-8');
  console.log(`📋 ערך בלוג נוסף ל-blog.ts (id: ${nextId})`);
}

// ---------- MAIN ----------

async function main() {
  console.log('🤖 Blog Bot מתחיל...\n');

  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    // Try loading from .env
    try {
      require('dotenv').config({ path: path.join(__dirname, '.env') });
      require('dotenv').config({ path: path.join(PROJECT_ROOT, '.env.local') });
    } catch {}
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ חסר GEMINI_API_KEY. הגדר אותו ב-.env או כ-environment variable.');
    process.exit(1);
  }

  // Step 1: Get GSC data
  const queries = await fetchGSCData();

  // Step 2: Find opportunity
  const opportunity = findOpportunity(queries);
  if (!opportunity) {
    console.log('✅ אין הזדמנויות חדשות כרגע. Blog Bot מסיים.');
    return;
  }

  // Step 3: Generate content
  const blogData = await generateBlogContent(opportunity);

  // Step 4: Generate image
  await generateBlogImage(opportunity, opportunity.slug);

  // Step 5: Write files
  writeBlogPage(opportunity.slug, blogData, opportunity);
  addBlogEntry(opportunity.slug, blogData);

  console.log(`\n🎉 בלוג חדש נוצר בהצלחה!`);
  console.log(`   📝 נושא: ${blogData.title}`);
  console.log(`   🔗 URL: /blog/${opportunity.slug}`);
  console.log(`   📊 מבוסס על: "${opportunity.query}" (${opportunity.impressions} impressions)`);
}

main().catch(err => {
  console.error('❌ שגיאה:', err);
  process.exit(1);
});
