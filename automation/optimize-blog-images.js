const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

/**
 * אופטימיזציה של תמונות הבלוג
 * מקטין PNG כבדות ל-WebP ו-AVIF
 */

const BLOG_IMAGES_DIR = path.join(process.cwd(), '..', 'public', 'blog-images');

async function optimizeImage(imagePath) {
  try {
    const dir = path.dirname(imagePath);
    const ext = path.extname(imagePath);
    const baseName = path.basename(imagePath, ext);
    
    console.log(`\n🖼️  מעבד: ${baseName}${ext}`);
    
    // קריאת התמונה המקורית
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    const originalSize = (await fs.stat(imagePath)).size;
    console.log(`   📊 גודל מקורי: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   📐 רזולוציה: ${metadata.width}×${metadata.height}`);
    
    // יצירת גרסת WebP (איכות גבוהה)
    const webpPath = path.join(dir, `${baseName}.webp`);
    await image
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);
    
    const webpSize = (await fs.stat(webpPath)).size;
    console.log(`   ✅ WebP נוצר: ${(webpSize / 1024 / 1024).toFixed(2)} MB (חיסכון ${((1 - webpSize/originalSize) * 100).toFixed(1)}%)`);
    
    // יצירת גרסת AVIF (איכות מעולה + דחיסה טובה יותר)
    const avifPath = path.join(dir, `${baseName}.avif`);
    await image
      .avif({ quality: 80, effort: 6 })
      .toFile(avifPath);
    
    const avifSize = (await fs.stat(avifPath)).size;
    console.log(`   ✅ AVIF נוצר: ${(avifSize / 1024 / 1024).toFixed(2)} MB (חיסכון ${((1 - avifSize/originalSize) * 100).toFixed(1)}%)`);
    
    // מחיקת PNG המקורי (אופציונלי)
    // await fs.unlink(imagePath);
    // console.log(`   🗑️  PNG מקורי נמחק`);
    
    return {
      original: imagePath,
      webp: webpPath,
      avif: avifPath,
      originalSize,
      webpSize,
      avifSize
    };
  } catch (error) {
    console.error(`❌ שגיאה בעיבוד ${imagePath}:`, error.message);
    return null;
  }
}

async function findAllBlogImages() {
  const images = [];
  
  try {
    const blogDirs = await fs.readdir(BLOG_IMAGES_DIR);
    
    for (const blogDir of blogDirs) {
      const blogPath = path.join(BLOG_IMAGES_DIR, blogDir);
      const stat = await fs.stat(blogPath);
      
      if (stat.isDirectory()) {
        const files = await fs.readdir(blogPath);
        
        for (const file of files) {
          if (file.endsWith('.png') && !file.includes('optimized')) {
            images.push(path.join(blogPath, file));
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ שגיאה בסריקת תיקיות:', error.message);
  }
  
  return images;
}

async function updateBlogPageImages(blogSlug) {
  try {
    const pagePath = path.join(process.cwd(), '..', 'app', 'blog', blogSlug, 'page.tsx');
    
    let content = await fs.readFile(pagePath, 'utf8');
    
    // החלפת .png ל-.webp בתמונות
    content = content.replace(
      /\/blog-images\/([^"]+)\.png/g,
      '/blog-images/$1.webp'
    );
    
    // הוספת picture element עם fallback
    content = content.replace(
      /<img src="(\/blog-images\/[^"]+)\.webp" alt="([^"]*)" style="([^"]*)" \/>/g,
      `<picture>
        <source srcset="$1.avif" type="image/avif" />
        <source srcset="$1.webp" type="image/webp" />
        <img src="$1.png" alt="$2" style="$3" loading="lazy" />
      </picture>`
    );
    
    await fs.writeFile(pagePath, content, 'utf8');
    console.log(`✅ עודכן דף בלוג: ${blogSlug}`);
    
  } catch (error) {
    console.error(`❌ שגיאה בעדכון דף ${blogSlug}:`, error.message);
  }
}

async function main() {
  console.log('🚀 מתחיל אופטימיזציה של תמונות הבלוג...\n');
  
  const images = await findAllBlogImages();
  console.log(`📁 נמצאו ${images.length} תמונות PNG לאופטימיזציה\n`);
  
  if (images.length === 0) {
    console.log('✨ כל התמונות כבר מאופטמזות!');
    return;
  }
  
  let totalOriginal = 0;
  let totalWebp = 0;
  let totalAvif = 0;
  
  // אופטימיזציה של כל התמונות
  for (const imagePath of images) {
    const result = await optimizeImage(imagePath);
    if (result) {
      totalOriginal += result.originalSize;
      totalWebp += result.webpSize;
      totalAvif += result.avifSize;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 סיכום האופטימיזציה:');
  console.log('='.repeat(60));
  console.log(`   גודל מקורי כולל: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   גודל WebP כולל: ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   גודל AVIF כולל: ${(totalAvif / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   💰 חיסכון WebP: ${((1 - totalWebp/totalOriginal) * 100).toFixed(1)}%`);
  console.log(`   💰 חיסכון AVIF: ${((1 - totalAvif/totalOriginal) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));
  
  // עדכון דפי הבלוג
  console.log('\n🔄 מעדכן קוד דפי הבלוג...\n');
  
  const blogDirs = await fs.readdir(path.join(process.cwd(), '..', 'app', 'blog'));
  for (const blogDir of blogDirs) {
    const blogPath = path.join(process.cwd(), '..', 'app', 'blog', blogDir);
    const stat = await fs.stat(blogPath);
    
    if (stat.isDirectory()) {
      const pagePath = path.join(blogPath, 'page.tsx');
      try {
        await fs.access(pagePath);
        await updateBlogPageImages(blogDir);
      } catch {
        // הקובץ לא קיים, ממשיכים
      }
    }
  }
  
  console.log('\n🎉 האופטימיזציה הושלמה בהצלחה!');
}

main().catch(console.error);
