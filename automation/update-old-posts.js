#!/usr/bin/env node
/**
 * Update Old Posts - עדכון פוסטים ישנים לפי ביצועי GSC
 * 
 * מה זה עושה:
 * 1. שולף נתוני GSC לכל דפי הבלוג הקיימים
 * 2. מזהה פוסטים עם CTR נמוך → משפר title ו-meta description
 * 3. מזהה פוסטים בעמוד 2 (position 11-20) → מרחיב תוכן
 * 4. מרענן תאריך ותוכן של פוסטים שצריכים שיפור
 * 
 * הרצה: node automation/update-old-posts.js
 * Schedule: פעם בחודש
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const BLOG_DATA_PATH = path.join(PROJECT_ROOT, 'app', 'data', 'blog.ts');
const BLOG_DIR = path.join(PROJECT_ROOT, 'app', 'blog');
const GSC_JSON_PATH = path.join(PROJECT_ROOT, 'gsc_output.json');
const SITE_URL = 'sc-domain:site-control-il.com';

// ---------- GSC DATA ----------

async function fetchBlogPerformance() {
  // Try live API
  if (process.env.GSC_SERVICE_ACCOUNT) {
    try {
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
          dimensions: ['page', 'query'],
          dimensionFilterGroups: [{
            filters: [{
              dimension: 'page',
              operator: 'contains',
              expression: '/blog/',
            }],
          }],
          rowLimit: 500,
        },
      });

      const rows = response.data.rows || [];
      console.log(`📊 נשלפו ${rows.length} שורות נתונים מ-GSC`);

      // Group by page
      const pageData = {};
      for (const row of rows) {
        const page = row.keys[0];
        const query = row.keys[1];
        if (!pageData[page]) {
          pageData[page] = { clicks: 0, impressions: 0, ctr: 0, position: 0, queries: [], count: 0 };
        }
        pageData[page].clicks += row.clicks;
        pageData[page].impressions += row.impressions;
        pageData[page].queries.push({ query, clicks: row.clicks, impressions: row.impressions, position: row.position });
        pageData[page].count++;
      }

      // Calculate averages
      for (const page of Object.keys(pageData)) {
        const d = pageData[page];
        d.ctr = d.impressions > 0 ? d.clicks / d.impressions : 0;
        d.position = d.queries.reduce((sum, q) => sum + q.position, 0) / d.queries.length;
      }

      return pageData;
    } catch (err) {
      console.warn('⚠️ שגיאה בחיבור ל-GSC:', err.message);
    }
  }

  // Fallback: use static GSC data to simulate
  console.log('📂 משתמש בנתוני GSC סטטיים (מוגבל)...');
  try {
    const data = JSON.parse(fs.readFileSync(GSC_JSON_PATH, 'utf-8'));
    return data.queries.reduce((acc, q) => {
      if (!acc['_general']) acc['_general'] = { clicks: 0, impressions: 0, queries: [], count: 0 };
      acc['_general'].queries.push(q);
      return acc;
    }, {});
  } catch {
    return {};
  }
}

// ---------- ANALYZE & FIND IMPROVEMENTS ----------

function analyzePostsForImprovement(pageData) {
  const improvements = [];

  for (const [page, data] of Object.entries(pageData)) {
    const slug = page.split('/blog/').pop()?.replace(/\/$/, '');
    if (!slug || slug === '_general') continue;

    // Type 1: High impressions, low CTR → rewrite title & meta
    if (data.impressions > 50 && data.ctr < 0.02) {
      improvements.push({
        type: 'low-ctr',
        slug,
        page,
        data,
        priority: data.impressions * (0.05 - data.ctr),
        reason: `CTR נמוך (${(data.ctr * 100).toFixed(1)}%) עם ${data.impressions} impressions`,
      });
    }

    // Type 2: Position 11-20 (page 2) → expand content  
    if (data.position >= 11 && data.position <= 25 && data.impressions > 20) {
      improvements.push({
        type: 'page-two',
        slug,
        page,
        data,
        priority: data.impressions / data.position,
        reason: `מיקום ${data.position.toFixed(1)} (עמוד 2) - פוטנציאל לעלות לעמוד 1`,
      });
    }

    // Type 3: High impressions but very few clicks
    if (data.impressions > 100 && data.clicks < 3) {
      improvements.push({
        type: 'no-clicks',
        slug,
        page,
        data,
        priority: data.impressions,
        reason: `${data.impressions} impressions אבל רק ${data.clicks} clicks`,
      });
    }
  }

  return improvements.sort((a, b) => b.priority - a.priority);
}

// ---------- IMPROVE WITH GEMINI ----------

async function improvePost(improvement) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const pagePath = path.join(BLOG_DIR, improvement.slug, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    console.log(`⚠️ הקובץ לא נמצא: ${pagePath}`);
    return false;
  }

  const existingContent = fs.readFileSync(pagePath, 'utf-8');
  const topQueries = improvement.data.queries
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 5)
    .map(q => q.query);

  if (improvement.type === 'low-ctr' || improvement.type === 'no-clicks') {
    // Improve title and meta description
    const prompt = `הנה דף בלוג קיים לגבי ${improvement.slug}.
השאילתות המובילות שמביאות אנשים לראות את העמוד בגוגל:
${topQueries.map(q => `- "${q}"`).join('\n')}

ה-CTR הנוכחי נמוך (${(improvement.data.ctr * 100).toFixed(1)}%).

כתוב כותרת ותיאור meta חדשים שיגרמו ליותר אנשים ללחוץ:

דרישות:
- כותרת: מושכת, כוללת מספרים, מילות כוח, ושנה נוכחית
- תיאור meta: עד 155 תווים, כולל CTA, מושך ומדויק
- השתמש במילות המפתח שאנשים מחפשים

החזר JSON:
{
  "newTitle": "כותרת חדשה",
  "newMetaDescription": "תיאור חדש"
}

החזר רק JSON תקין.`;

    console.log(`🔧 משפר כותרת ו-meta ל-${improvement.slug}...`);
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) text = jsonMatch[1];
    if (!text.startsWith('{')) text = text.substring(text.indexOf('{'));
    if (!text.endsWith('}')) text = text.substring(0, text.lastIndexOf('}') + 1);

    const updates = JSON.parse(text);

    // Update the page.tsx title and description
    let updated = existingContent;

    // Update title in metadata
    const titleMatch = existingContent.match(/title:\s*'([^']+)'/);
    if (titleMatch) {
      updated = updated.replace(titleMatch[0], `title: '${updates.newTitle.replace(/'/g, "\\'")}'`);
    }

    // Update description in metadata  
    const descMatch = existingContent.match(/description:\s*'([^']+)'/);
    if (descMatch) {
      updated = updated.replace(descMatch[0], `description: '${updates.newMetaDescription.replace(/'/g, "\\'")}'`);
    }

    if (updated !== existingContent) {
      fs.writeFileSync(pagePath, updated, 'utf-8');
      console.log(`✅ עודכנו כותרת ותיאור: "${updates.newTitle}"`);

      // Also update blog.ts
      updateBlogTsEntry(improvement.slug, updates.newTitle, updates.newMetaDescription);
      return true;
    }
  }

  if (improvement.type === 'page-two') {
    // For page-two posts, add more content sections
    const prompt = `הנה דף בלוג באתר אבטחה (Site-Control) עם slug: ${improvement.slug}
המיקום הממוצע בגוגל: ${improvement.data.position.toFixed(1)} (עמוד 2)

השאילתות שמביאות אנשים:
${topQueries.map(q => `- "${q}"`).join('\n')}

כתוב 2 סעיפים נוספים (כ-400 מילים) שישפרו את הדירוג:
1. סעיף עם מידע מעשי ומפורט שקשור לשאילתות
2. סעיף FAQ עם 3 שאלות ותשובות ממוקדות

החזר HTML עם inline styles (direction: rtl). רק HTML, בלי markdown.`;

    console.log(`📝 מרחיב תוכן ל-${improvement.slug}...`);
    const result = await model.generateContent(prompt);
    const newContent = result.response.text().trim();

    // Insert before the CTA section
    const ctaMarker = 'צריכים ייעוץ מקצועי';
    if (existingContent.includes(ctaMarker)) {
      const insertPoint = existingContent.lastIndexOf('<div', existingContent.indexOf(ctaMarker));
      if (insertPoint > 0) {
        const safeContent = newContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');
        const updated = existingContent.substring(0, insertPoint) +
          `<div dangerouslySetInnerHTML={{ __html: \`${safeContent}\` }} />\n          ` +
          existingContent.substring(insertPoint);
        fs.writeFileSync(pagePath, updated, 'utf-8');
        console.log(`✅ תוכן הורחב ל-${improvement.slug}`);

        // Update date in blog.ts
        updateBlogTsDate(improvement.slug);
        return true;
      }
    }
  }

  return false;
}

function updateBlogTsEntry(slug, newTitle, newMetaDesc) {
  try {
    let content = fs.readFileSync(BLOG_DATA_PATH, 'utf-8');
    
    // Find the entry block for this slug
    const slugIndex = content.indexOf(`slug: '${slug}'`);
    if (slugIndex === -1) return;

    // Find the seoTitle and seoDescription in this entry's block
    const blockStart = content.lastIndexOf('{', slugIndex);
    const blockEnd = content.indexOf('},', slugIndex);
    if (blockStart === -1 || blockEnd === -1) return;

    let block = content.substring(blockStart, blockEnd + 2);
    
    // Update title
    block = block.replace(/title: '[^']+'/,  `title: '${newTitle.replace(/'/g, "\\'")}'`);
    block = block.replace(/seoTitle: '[^']+'/,  `seoTitle: '${newTitle.replace(/'/g, "\\'")} | Site-Control'`);
    
    // Update meta description
    if (newMetaDesc) {
      block = block.replace(/seoDescription: '[^']+'/,  `seoDescription: '${newMetaDesc.replace(/'/g, "\\'")}'`);
    }

    content = content.substring(0, blockStart) + block + content.substring(blockEnd + 2);
    fs.writeFileSync(BLOG_DATA_PATH, content, 'utf-8');
  } catch (err) {
    console.warn(`⚠️ לא ניתן לעדכן blog.ts:`, err.message);
  }
}

function updateBlogTsDate(slug) {
  try {
    let content = fs.readFileSync(BLOG_DATA_PATH, 'utf-8');
    const today = new Date().toISOString().split('T')[0];
    
    // Find the entry and update date
    const slugIndex = content.indexOf(`slug: '${slug}'`);
    if (slugIndex === -1) return;
    
    const blockStart = content.lastIndexOf('{', slugIndex);
    const blockEnd = content.indexOf('},', slugIndex);
    let block = content.substring(blockStart, blockEnd + 2);
    
    block = block.replace(/date: '\d{4}-\d{2}-\d{2}'/, `date: '${today}'`);
    
    content = content.substring(0, blockStart) + block + content.substring(blockEnd + 2);
    fs.writeFileSync(BLOG_DATA_PATH, content, 'utf-8');
    console.log(`📅 תאריך עודכן ל-${today}`);
  } catch {}
}

// ---------- MAIN ----------

async function main() {
  console.log('🔄 Update Old Posts Bot מתחיל...\n');

  // Load env
  try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
    require('dotenv').config({ path: path.join(PROJECT_ROOT, '.env.local') });
  } catch {}

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ חסר GEMINI_API_KEY');
    process.exit(1);
  }

  // Step 1: Get performance data
  const pageData = await fetchBlogPerformance();
  const pages = Object.keys(pageData).filter(p => p !== '_general');

  if (pages.length === 0) {
    console.log('📊 אין נתוני ביצועים לדפי בלוג (צריך GSC_SERVICE_ACCOUNT לנתונים חיים)');
    console.log('✅ סיום.');
    return;
  }

  console.log(`📊 נמצאו ${pages.length} דפי בלוג עם נתונים\n`);

  // Step 2: Analyze
  const improvements = analyzePostsForImprovement(pageData);
  
  if (improvements.length === 0) {
    console.log('✅ כל הפוסטים בסדר! אין שיפורים נדרשים.');
    return;
  }

  console.log(`🎯 נמצאו ${improvements.length} הזדמנויות לשיפור:\n`);
  improvements.forEach((imp, i) => {
    console.log(`  ${i + 1}. [${imp.type}] ${imp.slug}: ${imp.reason}`);
  });

  // Step 3: Improve top 3
  const toImprove = improvements.slice(0, 3);
  console.log(`\n🔧 משפר ${toImprove.length} פוסטים...\n`);

  let improved = 0;
  for (const imp of toImprove) {
    try {
      const success = await improvePost(imp);
      if (success) improved++;
    } catch (err) {
      console.warn(`⚠️ שגיאה בשיפור ${imp.slug}:`, err.message);
    }
  }

  console.log(`\n🎉 סיום! ${improved}/${toImprove.length} פוסטים שופרו.`);
}

main().catch(err => {
  console.error('❌ שגיאה:', err);
  process.exit(1);
});
