import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

interface ImageOptimization {
  inputPath: string;
  outputPath: string;
  sizes: { width: number; height?: number; suffix: string }[];
  formats: ('webp' | 'avif' | 'jpeg' | 'png')[];
  quality: number;
}

class ImageOptimizer {

  async optimizeImage(options: ImageOptimization): Promise<string[]> {
    console.log(`🖼️  מתחיל אופטימיזציה: ${options.inputPath}...`);

    const outputPaths: string[] = [];

    // יצירת תקייה אם לא קיימת
    await fs.mkdir(options.outputPath, { recursive: true });

    // טעינת התמונה
    const image = sharp(options.inputPath);
    const metadata = await image.metadata();

    console.log(`📐 מידות מקוריות: ${metadata.width}x${metadata.height}`);

    // אופטימיזציה לכל גודל ופורמט
    for (const size of options.sizes) {
      for (const format of options.formats) {
        const filename = `${path.parse(options.inputPath).name}-${size.suffix}.${format}`;
        const outputFile = path.join(options.outputPath, filename);

        let pipeline = image.clone().resize({
          width: size.width,
          height: size.height,
          fit: 'cover',
          withoutEnlargement: true
        });

        // הגדרת פורמט ואיכות
        switch (format) {
          case 'webp':
            pipeline = pipeline.webp({
              quality: options.quality,
              effort: 6  // איכות מקסימלית
            });
            break;
          case 'avif':
            pipeline = pipeline.avif({
              quality: options.quality,
              effort: 9  // דחיסה מקסימלית
            });
            break;
          case 'jpeg':
            pipeline = pipeline.jpeg({
              quality: options.quality,
              progressive: true
            });
            break;
        }

        await pipeline.toFile(outputFile);
        outputPaths.push(outputFile);

        const stats = await fs.stat(outputFile);
        console.log(`✅ ${filename}: ${Math.round(stats.size / 1024)}KB`);
      }
    }

    return outputPaths;
  }

  async optimizeBlogImages(blogSlug: string): Promise<void> {
    console.log(`🎨 מתחיל אופטימיזציה עבור בלוג: ${blogSlug}...`);

    const blogImageDir = path.join(process.cwd(), 'public', 'optimized-variants', 'blog', blogSlug);
    const sourceDir = path.join(process.cwd(), 'public', 'blog-images', blogSlug);

    try {
      // בדיקה שקיימות תמונות מקור
      await fs.access(sourceDir);
      const files = await fs.readdir(sourceDir);

      for (const file of files) {
        if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;

        const inputPath = path.join(sourceDir, file);
        const baseName = path.parse(file).name;

        if (baseName.includes('hero')) {
          // תמונת Hero - רזולוציות מרובות
          await this.optimizeImage({
            inputPath,
            outputPath: blogImageDir,
            sizes: [
              { width: 400, suffix: 'w400' },
              { width: 800, suffix: 'w800' },
              { width: 1200, suffix: 'w1200' },
              { width: 1920, suffix: 'w1920' }
            ],
            formats: ['webp', 'avif'],
            quality: 85
          });
        } else if (baseName.includes('infographic')) {
          // אינפוגרפיק - איכות גבוהה
          await this.optimizeImage({
            inputPath,
            outputPath: blogImageDir,
            sizes: [
              { width: 1200, suffix: 'infographic' },
              { width: 800, suffix: 'infographic-mobile' }
            ],
            formats: ['webp', 'png'],
            quality: 95
          });
        } else {
          // תמונות רגילות
          await this.optimizeImage({
            inputPath,
            outputPath: blogImageDir,
            sizes: [
              { width: 600, suffix: 'standard' },
              { width: 400, suffix: 'mobile' }
            ],
            formats: ['webp'],
            quality: 80
          });
        }
      }

      console.log(`✅ אופטימיזציה הושלמה עבור ${blogSlug}`);

    } catch (error) {
      console.log(`⚠️  לא נמצאו תמונות ב-${sourceDir}`);
      console.log('📝 יש ליצור תמונות בנאנו בננה ולהעביר לתקייה זו');
    }
  }

  async createImagePlaceholders(blogSlug: string, imageInstructions: any): Promise<void> {
    console.log(`📋 יוצר placeholders עבור ${blogSlug}...`);

    const outputDir = path.join(process.cwd(), 'public', 'optimized-variants', 'blog', blogSlug);
    await fs.mkdir(outputDir, { recursive: true });

    // יצירת SVG placeholder לתמונת Hero
    const heroPlaceholder = `<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="675" fill="#f0f9ff"/>
      <text x="600" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#3b82f6">
        תמונת Hero - ${blogSlug}
      </text>
      <text x="600" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">
        ממתין לתמונה מנאנו בננה
      </text>
      <text x="600" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
        Prompt: ${imageInstructions.heroImage?.prompt || 'Professional security system'}
      </text>
    </svg>`;

    await fs.writeFile(path.join(outputDir, `${blogSlug}-hero-placeholder.svg`), heroPlaceholder);

    // הוראות ליצירת תמונות
    const instructions = `
# הוראות יצירת תמונות עבור ${blogSlug}

## תמונת Hero
**Prompt:** ${imageInstructions.heroImage?.prompt || 'Professional smart security system in modern Israeli home'}
**גדלים נדרשים:** 1920x1080, 1200x675, 800x450, 400x225
**פורמטים:** WebP + AVIF
**איכות:** 85%

## אינפוגרפיק
**Prompt:** ${imageInstructions.infographic?.prompt || 'Timeline infographic of security technology evolution 2020-2026'}
**גדלים נדרשים:** 1200x800, 800x600
**פורמטים:** WebP + PNG (עבור שקיפות)
**איכות:** 95%

## הוראות השמירה:
1. שמור תמונות בתקייה: temp/blog-images/${blogSlug}/
2. הרץ: npx ts-node automation/image-optimizer.ts ${blogSlug}
3. התמונות יועברו אוטומטית ל: public/optimized-variants/blog/${blogSlug}/
`;

    await fs.writeFile(
      path.join(process.cwd(), 'automation', `${blogSlug}-image-instructions.txt`),
      instructions
    );

    console.log(`📋 נוצרו placeholders והוראות עבור ${blogSlug}`);
  }

  async generateResponsiveImageCode(imagePath: string, alt: string, sizes: string): Promise<string> {
    const baseName = path.parse(imagePath).name;
    const dir = path.dirname(imagePath);

    return `
<picture>
  <source
    media="(max-width: 400px)"
    srcSet="${dir}/${baseName}-w400.avif 400w"
    type="image/avif"
  />
  <source
    media="(max-width: 400px)"
    srcSet="${dir}/${baseName}-w400.webp 400w"
    type="image/webp"
  />
  <source
    media="(max-width: 800px)"
    srcSet="${dir}/${baseName}-w800.avif 800w"
    type="image/avif"
  />
  <source
    media="(max-width: 800px)"
    srcSet="${dir}/${baseName}-w800.webp 800w"
    type="image/webp"
  />
  <source
    srcSet="${dir}/${baseName}-w1200.avif 1200w, ${dir}/${baseName}-w1920.avif 1920w"
    type="image/avif"
  />
  <source
    srcSet="${dir}/${baseName}-w1200.webp 1200w, ${dir}/${baseName}-w1920.webp 1920w"
    type="image/webp"
  />
  <Image
    src="${dir}/${baseName}-w1200.webp"
    alt="${alt}"
    width={1200}
    height={675}
    className={styles.responsiveImage}
    sizes="${sizes}"
    loading="lazy"
  />
</picture>
`;
  }
}

// הפעלה עם פרמטר slug אם ניתן
if (require.main === module) {
  const optimizer = new ImageOptimizer();
  const blogSlug = process.argv[2];

  if (blogSlug) {
    console.log(`🚀 מתחיל אופטימיזציה עבור: ${blogSlug}`);
    optimizer.optimizeBlogImages(blogSlug)
      .then(() => console.log('✅ האופטימיזציה הושלמה בהצלחה!'))
      .catch((error) => console.error('❌ שגיאה באופטימיזציה:', error));
  } else {
    console.log('⚠️  נא לציין blog slug: npx ts-node automation/image-optimizer.ts <slug>');
  }
}

export default ImageOptimizer;