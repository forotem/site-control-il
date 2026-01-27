const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const sharp = require('sharp');

/**
 * יצירת תמונות עם Gemini API
 * שימוש ב-Imagen דרך Gemini
 */
class GeminiImageGenerator {
  
  constructor(apiKey) {
    if (!apiKey || apiKey === 'placeholder-key') {
      throw new Error('נדרש Gemini API key');
    }
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * יצירת תמונה עם Nano Banana API (Gemini 2.5 Flash Image)
   * מבוסס על התיעוד הרשמי: https://ai.google.dev/gemini-api/docs/image-generation
   */
  async generateImage(prompt, outputPath, dimensions = { width: 1200, height: 675 }) {
    console.log(`🎨 יוצר תמונה עם Nano Banana API: ${path.basename(outputPath)}`);

    try {
      // קובע aspect ratio לפי הממדים
      let aspectRatio = '21:9'; // default for hero (2:1 wide format)
      let imageSize = '2K'; // higher quality for better Hebrew text
      
      if (dimensions && dimensions.width && dimensions.height) {
        const ratio = dimensions.width / dimensions.height;
        if (Math.abs(ratio - 2) < 0.1) aspectRatio = '21:9'; // 2:1 ratio
        else if (Math.abs(ratio - 16/9) < 0.1) aspectRatio = '16:9';
        else if (Math.abs(ratio - 3/2) < 0.1) aspectRatio = '3:2';
        else if (Math.abs(ratio - 1) < 0.1) aspectRatio = '1:1';
      }
      
      // משפר את ה-prompt קודם
      const enhancedPrompt = await this.enhancePromptWithGemini(prompt);
      
      // שומר את ה-prompt המשופר
      const promptPath = outputPath.replace(/\.(png|jpg|jpeg)$/, '-enhanced-prompt.txt');
      await fs.writeFile(promptPath, enhancedPrompt);
      console.log(`💾 Prompt משופר נשמר: ${path.basename(promptPath)}`);
      
      // יוצר תמונה עם gemini-3-pro-image-preview (better for Hebrew)
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-3-pro-image-preview' 
      });
      
      console.log(`🖼️  יוצר תמונה (${aspectRatio})...`);
      
      const result = await model.generateContent(
        enhancedPrompt,
        {
          generationConfig: {
            responseModalities: ['IMAGE'],
            imageConfig: {
              aspectRatio: aspectRatio,
              imageSize: imageSize
            }
          }
        }
      );
      
      const response = result.response;
      
      // מחפש את התמונה ב-response
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          const imageData = Buffer.from(part.inlineData.data, 'base64');
          await fs.writeFile(outputPath, imageData);
          console.log(`✅ תמונה PNG נוצרה: ${path.basename(outputPath)}`);
          
          // יצירת גרסאות אופטימיזציה - WebP ו-AVIF
          await this.optimizeImage(outputPath);
          
          return { success: true, path: outputPath };
        }
      }
      
      throw new Error('לא נמצאה תמונה בתגובת ה-API');

    } catch (error) {
      console.error('❌ שגיאה ביצירת תמונה:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * אופטימיזציה של תמונה ל-WebP ו-AVIF
   */
  async optimizeImage(imagePath) {
    try {
      const dir = path.dirname(imagePath);
      const ext = path.extname(imagePath);
      const baseName = path.basename(imagePath, ext);
      
      const image = sharp(imagePath);
      
      // יצירת גרסת WebP (איכות גבוהה)
      const webpPath = path.join(dir, `${baseName}.webp`);
      await image.webp({ quality: 85, effort: 6 }).toFile(webpPath);
      console.log(`   ✅ WebP נוצר: ${path.basename(webpPath)}`);
      
      // יצירת גרסת AVIF (איכות מעולה)
      const avifPath = path.join(dir, `${baseName}.avif`);
      await image.avif({ quality: 80, effort: 6 }).toFile(avifPath);
      console.log(`   ✅ AVIF נוצר: ${path.basename(avifPath)}`);
      
    } catch (error) {
      console.warn(`   ⚠️  לא הצלחתי לאופטמז את ${path.basename(imagePath)}: ${error.message}`);
    }
  }

  /**
   * שיפור prompt עם Gemini
   */
  async enhancePromptWithGemini(originalPrompt) {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const enhancementPrompt = `You are an expert AI image prompt engineer. 
      
Take this image generation prompt and enhance it to be more detailed, specific, and optimized for AI image generation:

Original prompt:
${originalPrompt}

Create an enhanced version that:
1. Adds specific visual details
2. Specifies lighting, composition, and style
3. Includes technical photography terms
4. Maintains the original intent but makes it more vivid
5. Is optimized for AI image generation tools

Enhanced prompt (respond with just the enhanced prompt, no explanations):`;

      const result = await model.generateContent(enhancementPrompt);
      const response = await result.response;
      return response.text().trim();

    } catch (error) {
      console.warn('⚠️  לא הצלחתי לשפר את ה-prompt, משתמש במקורי');
      return originalPrompt;
    }
  }

  /**
   * אינטגרציה עם DALL-E (אופציונלי - דורש OpenAI API key)
   */
  async generateWithDALLE(prompt, outputPath) {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      throw new Error('נדרש OPENAI_API_KEY ב-.env');
    }

    console.log('🎨 יוצר תמונה עם DALL-E 3...');

    // TODO: הוסף אינטגרציה עם DALL-E API
    // https://platform.openai.com/docs/guides/images

    throw new Error('DALL-E integration not implemented yet');
  }

  /**
   * אינטגרציה עם Stable Diffusion (אופציונלי)
   */
  async generateWithStableDiffusion(prompt, outputPath) {
    const stabilityKey = process.env.STABILITY_API_KEY;
    if (!stabilityKey) {
      throw new Error('נדרש STABILITY_API_KEY ב-.env');
    }

    console.log('🎨 יוצר תמונה עם Stable Diffusion...');

    // TODO: הוסף אינטגרציה עם Stability AI API
    // https://platform.stability.ai/docs/api-reference

    throw new Error('Stable Diffusion integration not implemented yet');
  }

  /**
   * יצירת כל התמונות לבלוג
   */
  async generateBlogImages(imageDir, heroPrompt, infographicPrompt) {
    console.log('\n🤖 מתחיל יצירת תמונות עם Gemini API...\n');

    const results = {
      hero: null,
      infographic: null
    };

    // תמונת Hero
    console.log('📸 תמונת Hero (1200×675):');
    console.log('─'.repeat(60));
    const heroPath = path.join(imageDir, 'hero.png');
    results.hero = await this.generateImage(heroPrompt, heroPath, '1200x675');

    console.log('');

    // אינפוגרפיק
    console.log('📊 אינפוגרפיק (1200×800):');
    console.log('─'.repeat(60));
    const infographicPath = path.join(imageDir, 'infographic.png');
    results.infographic = await this.generateImage(infographicPrompt, infographicPath, '1200x800');

    console.log('\n' + '='.repeat(60));
    console.log('📋 סיכום:');
    console.log('='.repeat(60));
    console.log(`✅ Prompts משופרים נוצרו בהצלחה`);
    console.log(`📁 מיקום: ${imageDir}`);
    console.log(`💡 צור את התמונות ב-https://gemini.google.com עם ה-prompts המשופרים`);
    console.log('='.repeat(60) + '\n');

    return results;
  }
}

module.exports = GeminiImageGenerator;
