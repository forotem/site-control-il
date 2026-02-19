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

function findOpportunity(queries) {
  const existingSlugs = getExistingSlugs();
  console.log(`📝 בלוגים קיימים: ${existingSlugs.length}`);

  // Filter: high impressions, low clicks, not in great position
  const opportunities = queries
    .filter(q => q.impressions >= 3 && q.clicks < 20 && q.position > 8)
    .map(q => ({
      ...q,
      slug: hebrewToSlug(q.query),
      score: q.impressions * (1 / Math.max(q.position, 1)),
    }))
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

  // Fallback topics if all GSC opportunities exhausted
  const fallbackTopics = [
    'מצלמות אבטחה לבית חכם',
    'מערכת אבטחה לעסק קטן',
    'מצלמות אבטחה סולאריות אלחוטיות',
    'מצלמות אבטחה עם ראיית לילה צבעונית',
    'מערכת אזעקה חכמה לדירה',
    'מצלמות אבטחה לחנות',
    'התקנת מצלמות אבטחה חיצוניות',
    'מצלמות אבטחה עם חיישן תנועה',
    'מערכת אבטחה היקפית למפעל',
    'מצלמות IP מקצועיות לעסקים',
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

  const prompt = `אתה מומחה למצלמות אבטחה ומערכות ביטחון בישראל, עובד בחברת Site-Control.
כתוב פוסט בלוג מקצועי ומקיף בעברית על הנושא: "${topic.query}"

דרישות:
- 1500-2000 מילים
- כתוב תוכן ייחודי ומקצועי שמדגים ניסיון אמיתי בתחום
- כלול המלצות מוצר ספציפיות (Reolink, Hikvision, Dahua)
- כלול טיפים מעשיים להתקנה ותחזוקה
- כלול מפרטים טכניים ספציפיים (רזולוציה, IP rating, POE, חיבוריות)
- כלול סעיף שאלות נפוצות (FAQ) עם 4-5 שאלות
- כלול קריאה לפעולה (CTA) בסוף - לפנות ל-Site-Control לייעוץ
- שלב מילות מפתח בצורה טבעית: "${topic.query}"
- כתוב בסגנון מקצועי אבל נגיש

מבנה הפלט - החזר JSON בדיוק בפורמט הזה:
{
  "title": "כותרת מושכת בעברית",
  "metaDescription": "תיאור meta עד 160 תווים לגוגל",
  "category": "קטגוריה מתאימה (מצלמות אבטחה / פתרונות לעסקים / מדריכים / תיעוד בנייה)",
  "content": "תוכן המאמר המלא ב-HTML עם תגיות h2, h3, p, ul, li, strong, table. השתמש ב-inline styles תואמים לעיצוב האתר (direction: rtl, font-family: system-ui)",
  "faqItems": [
    {"question": "שאלה", "answer": "תשובה"}
  ],
  "keywords": ["מילת מפתח 1", "מילת מפתח 2", "...עד 8 מילות מפתח"]
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

    const prompt = `Create a professional, modern hero image for a Hebrew blog post about "${topic.query}". 
The image should show: high-tech security cameras, smart home technology, professional surveillance equipment.
Style: clean, professional, modern tech aesthetic with blue and dark tones.
Include subtle tech elements like circuit patterns or holographic displays.
NO text in the image. Photorealistic quality.
The image will be used as a wide banner on a professional security company website.`;

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

  const pageContent = `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${blogData.title.replace(/'/g, "\\'")} | Site-Control',
  description: '${(blogData.metaDescription || '').replace(/'/g, "\\'")}',
  keywords: '${(blogData.keywords || []).join(', ')}',
  openGraph: {
    title: '${blogData.title.replace(/'/g, "\\'")}',
    description: '${(blogData.metaDescription || '').replace(/'/g, "\\'")}',
    type: 'article',
    locale: 'he_IL',
    siteName: 'Site-Control',
  },
  alternates: {
    canonical: 'https://site-control-il.com/blog/${slug}',
  },
};

export default function Page() {
  return (
    <>
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
