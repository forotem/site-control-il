import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

interface ImageReplacement {
  originalName: string;
  newImagePath: string;
  targetFormats: ('webp' | 'avif' | 'jpg')[];
  sizes: { width: number; height: number; suffix: string }[];
}

class ImageReplacer {
  private readonly blogSlug: string;
  private readonly outputDir: string;
  
  constructor(blogSlug: string) {
    this.blogSlug = blogSlug;
    this.outputDir = path.join(process.cwd(), 'public', 'optimized-variants', 'blog', blogSlug);
  }
  
  async replaceImages(replacements: ImageReplacement[]): Promise<void> {
    console.log(`🔄 מחליף תמונות עבור בלוג: ${this.blogSlug}...`);
    
    for (const replacement of replacements) {
      await this.processReplacement(replacement);
    }
    
    console.log('✅ הושלמה החלפת התמונות!');
  }
  
  private async processReplacement(replacement: ImageReplacement): Promise<void> {
    console.log(`📷 מעבד תמונה: ${replacement.originalName}...`);
    
    try {
      // Check if source image exists
      const sourceExists = await fs.access(replacement.newImagePath).then(() => true).catch(() => false);
      if (!sourceExists) {
        console.warn(`⚠️  תמונה לא נמצאה: ${replacement.newImagePath}`);
        return;
      }
      
      // Remove old SVG placeholder
      const oldSvgPath = path.join(this.outputDir, `${replacement.originalName}.svg`);
      await fs.unlink(oldSvgPath).catch(() => {}); // Ignore errors if file doesn't exist
      
      // Generate optimized versions
      for (const size of replacement.sizes) {
        for (const format of replacement.targetFormats) {
          const outputName = `${replacement.originalName}${size.suffix}.${format}`;
          const outputPath = path.join(this.outputDir, outputName);
          
          await sharp(replacement.newImagePath)
            .resize(size.width, size.height, {
              fit: 'cover',
              position: 'center'
            })
            .toFormat(format, {
              quality: format === 'jpg' ? 85 : 80,
              effort: format === 'avif' ? 6 : undefined
            })
            .toFile(outputPath);
            
          console.log(`  ✓ נוצר: ${outputName}`);
        }
      }
      
      // Update page file to use new image format instead of SVG
      await this.updatePageImageReferences(replacement);
      
    } catch (error) {
      console.error(`❌ שגיאה בעיבוד ${replacement.originalName}:`, error);
    }
  }
  
  private async updatePageImageReferences(replacement: ImageReplacement): Promise<void> {
    const pagePath = path.join(process.cwd(), 'app', 'blog', this.blogSlug, 'page.tsx');
    
    try {
      let pageContent = await fs.readFile(pagePath, 'utf8');
      
      // Replace SVG reference with WebP (first priority format)
      const oldSrc = `/optimized-variants/blog/${this.blogSlug}/${replacement.originalName}.svg`;
      const newSrc = `/optimized-variants/blog/${this.blogSlug}/${replacement.originalName}.webp`;
      
      pageContent = pageContent.replace(
        new RegExp(`src="${oldSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
        `src="${newSrc}"`
      );
      
      await fs.writeFile(pagePath, pageContent);
      console.log(`  ✓ עודכן הפניות בדף עבור: ${replacement.originalName}`);
      
    } catch (error) {
      console.warn(`⚠️  לא ניתן לעדכן הפניות בדף עבור ${replacement.originalName}:`, error);
    }
  }
}

// Pre-configured replacements for smart-security-ai-2026 blog
const BLOG_IMAGE_REPLACEMENTS: ImageReplacement[] = [
  {
    originalName: 'hero-main',
    newImagePath: '', // Will be filled by user
    targetFormats: ['webp', 'avif', 'jpg'],
    sizes: [
      { width: 1200, height: 675, suffix: '' },
      { width: 800, height: 450, suffix: '-medium' },
      { width: 400, height: 225, suffix: '-small' }
    ]
  },
  {
    originalName: 'infographic-timeline',
    newImagePath: '', // Will be filled by user
    targetFormats: ['webp', 'avif'],
    sizes: [
      { width: 1200, height: 800, suffix: '' },
      { width: 800, height: 533, suffix: '-medium' }
    ]
  },
  {
    originalName: 'comparison-chart',
    newImagePath: '', // Will be filled by user
    targetFormats: ['webp', 'avif'],
    sizes: [
      { width: 1000, height: 600, suffix: '' },
      { width: 600, height: 360, suffix: '-medium' }
    ]
  }
];

// CLI function for easy usage
async function replaceWithUserImages(imagePaths: { [key: string]: string }) {
  const replacements = BLOG_IMAGE_REPLACEMENTS.map(replacement => ({
    ...replacement,
    newImagePath: imagePaths[replacement.originalName] || ''
  })).filter(r => r.newImagePath); // Only process replacements with provided images
  
  if (replacements.length === 0) {
    console.log('❌ לא סופקו נתיבי תמונות. השתמש כך:');
    console.log('npx ts-node automation/image-generation/replace-images.ts "hero=/path/to/hero.jpg,timeline=/path/to/timeline.png"');
    return;
  }
  
  const replacer = new ImageReplacer('smart-security-ai-2026');
  await replacer.replaceImages(replacements);
}

// Parse command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const imagePaths: { [key: string]: string } = {};
    
    // Parse "hero=/path/to/image,timeline=/path/to/image" format
    args[0].split(',').forEach(pair => {
      const [key, path] = pair.split('=');
      if (key && path) {
        // Map short names to full names
        const nameMapping: { [key: string]: string } = {
          'hero': 'hero-main',
          'timeline': 'infographic-timeline',
          'comparison': 'comparison-chart'
        };
        
        const fullName = nameMapping[key.trim()] || key.trim();
        imagePaths[fullName] = path.trim();
      }
    });
    
    replaceWithUserImages(imagePaths);
  } else {
    console.log('📖 שימוש:');
    console.log('npx ts-node automation/image-generation/replace-images.ts "hero=/path/to/hero.jpg,timeline=/path/to/timeline.png,comparison=/path/to/chart.jpg"');
    console.log('');
    console.log('🎯 זמין עבור:');
    console.log('  hero = תמונת Hero ראשית');
    console.log('  timeline = אינפוגרפיק התפתחות טכנולוגיה');
    console.log('  comparison = טבלת השוואה');
  }
}

export { ImageReplacer, replaceWithUserImages };
export default ImageReplacer;