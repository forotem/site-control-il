import { promises as fs } from 'fs';
import path from 'path';

interface ImageStatus {
  name: string;
  exists: boolean;
  type: 'svg' | 'webp' | 'avif' | 'jpg' | 'png';
  size?: number;
  dimensions?: string;
  promptExists: boolean;
}

class ImageStatusChecker {
  private readonly blogSlug: string;
  private readonly outputDir: string;
  
  constructor(blogSlug: string) {
    this.blogSlug = blogSlug;
    this.outputDir = path.join(process.cwd(), 'public', 'optimized-variants', 'blog', blogSlug);
  }
  
  async checkAllImages(): Promise<void> {
    console.log(`🔍 בודק סטטוס תמונות עבור: ${this.blogSlug}`);
    console.log(`📁 תקייה: ${this.outputDir}\n`);
    
    const expectedImages = [
      'hero-main',
      'infographic-timeline', 
      'comparison-chart'
    ];
    
    try {
      // Check if directory exists
      await fs.access(this.outputDir);
      
      // Get all files in directory
      const files = await fs.readdir(this.outputDir);
      
      console.log('📋 **סטטוס תמונות:**\n');
      
      for (const imageName of expectedImages) {
        await this.checkImageStatus(imageName, files);
      }
      
      // Check for extra files
      const extraFiles = files.filter(file => 
        !expectedImages.some(img => file.startsWith(img)) && 
        !file.endsWith('.json') && 
        !file.includes('instructions')
      );
      
      if (extraFiles.length > 0) {
        console.log('\n📎 **קבצים נוספים:**');
        extraFiles.forEach(file => console.log(`  • ${file}`));
      }
      
      // Show generation instructions
      const instructionsFile = path.join(this.outputDir, 'generation-instructions.json');
      const hasInstructions = files.includes('generation-instructions.json');
      
      console.log('\n📖 **מדריך יצירה:**');
      if (hasInstructions) {
        console.log(`  ✅ קיים: ${instructionsFile}`);
        console.log('  📝 הצג הוראות: cat automation/image-generation/README-IMAGE-GENERATION.md');
      } else {
        console.log('  ❌ קובץ הוראות חסר');
      }
      
      console.log('\n🔗 **קישורים שימושיים:**');
      console.log(`  🌐 דף הבלוג: http://localhost:3003/blog/${this.blogSlug}`);
      console.log('  🎨 Gemini API: https://ai.google.dev/gemini-api/docs/image-generation');
      console.log('  📚 מדריך מלא: automation/image-generation/README-IMAGE-GENERATION.md');
      
    } catch (error) {
      console.error('❌ שגיאה בבדיקת תקייה:', error);
    }
  }
  
  private async checkImageStatus(imageName: string, files: string[]): Promise<void> {
    const relatedFiles = files.filter(file => file.startsWith(imageName));
    const promptFile = `${imageName}-prompt.json`;
    const hasPrompt = files.includes(promptFile);
    
    console.log(`🖼️  **${imageName}:**`);
    
    if (relatedFiles.length === 0) {
      console.log('  ❌ לא נמצאו קבצים');
      return;
    }
    
    // Check for different formats
    const formats = ['svg', 'webp', 'avif', 'jpg', 'png'];
    const foundFormats: string[] = [];
    
    for (const format of formats) {
      const formatFiles = relatedFiles.filter(file => file.endsWith(`.${format}`));
      if (formatFiles.length > 0) {
        foundFormats.push(format);
        
        for (const file of formatFiles) {
          try {
            const filePath = path.join(this.outputDir, file);
            const stats = await fs.stat(filePath);
            const sizeKB = (stats.size / 1024).toFixed(1);
            
            const suffix = file.replace(`${imageName}`, '').replace(`.${format}`, '');
            const displayName = suffix ? `${format}${suffix}` : format;
            
            if (format === 'svg') {
              console.log(`  🎨 ${displayName}: ${sizeKB}KB (Placeholder)`);
            } else {
              console.log(`  ✅ ${displayName}: ${sizeKB}KB`);
            }
          } catch (error) {
            console.log(`  ❌ שגיאה בקובץ ${file}`);
          }
        }
      }
    }
    
    // Prompt status
    if (hasPrompt) {
      console.log(`  📝 Prompt: ✅ קיים`);
    } else {
      console.log(`  📝 Prompt: ❌ חסר`);
    }
    
    // Recommendations
    if (foundFormats.includes('svg') && foundFormats.length === 1) {
      console.log('  💡 המלצה: החלף ב-SVG בתמונה אמיתית');
    } else if (!foundFormats.includes('webp')) {
      console.log('  💡 המלצה: הוסף פורמט WebP לביצועים טובים יותר');
    }
    
    console.log('');
  }
}

// Usage examples and help
function showHelp() {
  console.log('🖼️  **בודק סטטוס תמונות בלוג**\n');
  console.log('📝 **שימוש:**');
  console.log('  npx ts-node automation/image-generation/check-images.ts [blog-slug]\n');
  console.log('🎯 **דוגמאות:**');
  console.log('  npx ts-node automation/image-generation/check-images.ts smart-security-ai-2026');
  console.log('  npx ts-node automation/image-generation/check-images.ts  # בדיקה אוטומטית\n');
  console.log('🔧 **מה הכלי עושה:**');
  console.log('  ✅ בודק קיום תמונות SVG/WebP/AVIF/JPG');
  console.log('  ✅ מציג גדלי קבצים');
  console.log('  ✅ בודק קיום prompt files');
  console.log('  ✅ נותן המלצות לשיפור');
  console.log('  ✅ מציג קישורים שימושיים\n');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  let blogSlug = args[0];
  
  // Auto-detect if no slug provided
  if (!blogSlug) {
    const blogDir = path.join(process.cwd(), 'app', 'blog');
    try {
      const blogs = await fs.readdir(blogDir);
      const validBlogs = [];
      
      for (const blog of blogs) {
        const stat = await fs.stat(path.join(blogDir, blog));
        if (stat.isDirectory() && !blog.startsWith('[') && blog !== 'components') {
          validBlogs.push(blog);
        }
      }
      
      if (validBlogs.length === 1) {
        blogSlug = validBlogs[0];
        console.log(`🎯 זוהה בלוג אוטומטית: ${blogSlug}\n`);
      } else if (validBlogs.length > 1) {
        console.log('🤔 נמצאו מספר בלוגים. אנא ציין איזה:');
        validBlogs.forEach(blog => console.log(`  • ${blog}`));
        return;
      } else {
        console.log('❌ לא נמצאו תקיות בלוג תקינות');
        return;
      }
    } catch (error) {
      console.log('❌ שגיאה בזיהוי בלוגים אוטומטית');
      showHelp();
      return;
    }
  }
  
  const checker = new ImageStatusChecker(blogSlug);
  await checker.checkAllImages();
}

if (require.main === module) {
  main();
}

export { ImageStatusChecker };
export default ImageStatusChecker;