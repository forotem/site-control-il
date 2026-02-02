/**
 * יצירת תמונות לבלוג "תיעוד בנייה בטיימלאפס 2026"
 */

const GeminiImageGenerator = require('./gemini-image-generator.js');
const path = require('path');
const fs = require('fs').promises;

require('dotenv').config({ path: path.join(__dirname, '.env') });

async function generateTimelapseDocImages() {
  console.log('🎬 יוצר תמונות לבלוג "תיעוד בנייה בטיימלאפס 2026"');
  console.log('='.repeat(60));

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ חסר GEMINI_API_KEY ב-.env');
    return;
  }

  const generator = new GeminiImageGenerator(apiKey);
  
  // תיקיית התמונות
  const imageDir = path.join(__dirname, '..', 'public', 'blog-images', 'timelapse-documentation-construction-2026');
  
  // ודא שהתיקייה קיימת
  await fs.mkdir(imageDir, { recursive: true });
  
  // Prompt לתמונת Hero
  const heroPrompt = `Professional aerial drone photograph of a modern construction site in Israel at golden hour.
  
  The image shows:
  - A large residential building under construction with visible concrete framework
  - Multiple tower cranes silhouetted against a dramatic sunset sky
  - A professional timelapse camera mounted on a pole in the foreground
  - Solar panel attached to the camera unit
  - City skyline in the background
  - Hebrew text overlay: "תיעוד בנייה בטיימלאפס" (Construction Documentation Timelapse)
  
  Style: 
  - Ultra high quality 4K photography
  - Professional real estate marketing style
  - Warm orange and blue color grading
  - Sharp focus on construction details
  - Cinematic wide-angle lens perspective
  
  Do NOT include any people in the image.
  Make it look like a promotional image for a construction documentation service.`;

  // Prompt לאינפוגרפיק
  const infographicPrompt = `Professional infographic in Hebrew about construction site documentation benefits.
  
  Layout (right to left, Hebrew):
  - Title at top: "יתרונות תיעוד בנייה בטיימלאפס" (Benefits of Construction Timelapse Documentation)
  - 4 main sections in a grid:
    1. תיעוד משפטי (Legal Documentation) - scale of justice icon
    2. שיווק ומכירות (Marketing & Sales) - graph trending up icon
    3. בקרת איכות (Quality Control) - checklist icon
    4. ניהול פרויקט (Project Management) - calendar icon
  
  - Each section has a percentage stat:
    - 30% פחות מחלוקות (30% less disputes)
    - 50% יותר פניות (50% more leads)
    - 15% שיפור בלוחות זמנים (15% schedule improvement)
    - 24/7 תיעוד רציף (24/7 continuous documentation)
  
  Style:
  - Clean, modern infographic design
  - Blue and orange color scheme (matching Site-Control brand)
  - Professional icons (not cartoonish)
  - White background with subtle gradient
  - Hebrew text must be clear and readable
  - Minimalist corporate style`;

  console.log('\n📸 יוצר תמונת Hero...');
  console.log('─'.repeat(60));
  
  const heroPath = path.join(imageDir, 'hero.png');
  const heroResult = await generator.generateImage(heroPrompt, heroPath, { width: 1200, height: 675 });
  
  if (heroResult.success) {
    console.log('✅ תמונת Hero נוצרה בהצלחה!');
  } else {
    console.log('❌ שגיאה ביצירת Hero:', heroResult.error);
  }

  console.log('\n📊 יוצר אינפוגרפיק...');
  console.log('─'.repeat(60));
  
  const infographicPath = path.join(imageDir, 'infographic.png');
  const infographicResult = await generator.generateImage(infographicPrompt, infographicPath, { width: 1200, height: 800 });
  
  if (infographicResult.success) {
    console.log('✅ אינפוגרפיק נוצר בהצלחה!');
  } else {
    console.log('❌ שגיאה ביצירת אינפוגרפיק:', infographicResult.error);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 סיכום:');
  console.log('='.repeat(60));
  console.log(`📁 מיקום התמונות: ${imageDir}`);
  console.log('');
  console.log('אם יצירת התמונות נכשלה, תוכל להשתמש ב-Prompts המשופרים ב:');
  console.log(`   ${path.join(imageDir, 'hero-enhanced-prompt.txt')}`);
  console.log(`   ${path.join(imageDir, 'infographic-enhanced-prompt.txt')}`);
  console.log('');
  console.log('כדי ליצור ידנית ב: https://gemini.google.com');
  console.log('='.repeat(60));
}

generateTimelapseDocImages().catch(console.error);
