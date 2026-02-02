const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * אוטומציה מלאה ליצירת תמונות עם Nano Banana
 * פותח את Nano Banana בדפדפן, מדביק prompts, ומוריד תמונות אוטומטית
 */
class NanoBananaAutomation {
  
  constructor() {
    // כתובת ה-URL של כלי יצירת התמונות
    // אופציות נפוצות:
    // - Gemini (Google): https://gemini.google.com
    // - DALL-E (OpenAI): https://chatgpt.com
    // - Leonardo AI: https://leonardo.ai
    // - Ideogram: https://ideogram.ai
    this.imageGenUrl = 'https://gemini.google.com/app'; // ברירת מחדל: Gemini
    this.browser = null;
    this.page = null;
  }

  /**
   * פונקציית המתנה (מחליפה waitForTimeout שהוסרה מ-Puppeteer)
   */
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * פתיחת דפדפן והתחברות
   */
  async initialize() {
    console.log('🌐 פותח דפדפן אוטומטי...');
    
    this.browser = await puppeteer.launch({
      headless: false, // דפדפן גלוי כדי שתוכל לראות מה קורה
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--start-maximized']
    });

    this.page = await this.browser.newPage();
    
    // ניווט לאתר
    console.log('📍 מנווט לכלי יצירת תמונות...');
    await this.page.goto(this.imageGenUrl, { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    
    console.log('✅ דפדפן פתוח ומוכן!');
  }

  /**
   * יצירת תמונה עם prompt
   */
  async generateImage(prompt, outputPath, imageType = 'hero') {
    console.log(`🎨 יוצר תמונת ${imageType}...`);
    
    try {
      // המתן שהעמוד יטען
      await new Promise(resolve => setTimeout(resolve, 2000));

      // חפש את שדה ה-prompt ב-Gemini
      // Gemini משתמש ב-textarea או contenteditable div
      const promptSelectors = [
        'div[contenteditable="true"]',  // Gemini משתמש ב-contenteditable
        'textarea[aria-label*=""]',     // שדה טקסט עם aria-label
        'div.ql-editor',                // Quill editor (נפוץ ב-Gemini)
        '[data-test-id="prompt-textarea"]',
        '.input-field',
        'textarea',
        '[role="textbox"]'
      ];

      let promptField = null;
      for (const selector of promptSelectors) {
        try {
          promptField = await this.page.$(selector);
          if (promptField) {
            console.log(`✅ מצאתי שדה prompt: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!promptField) {
        console.log('⚠️  לא מצאתי שדה prompt אוטומטית');
        console.log('🖱️ אנא הדבק את ה-prompt ידנית ולחץ Enter להמשיך...');
        console.log('📋 Prompt להעתקה:');
        console.log('─'.repeat(60));
        console.log(prompt);
        console.log('─'.repeat(60));
        
        // המתן ל-Enter מהמשתמש
        await this.waitForUserInput();
      } else {
        // מדביק את ה-prompt
        console.log('✅ מצאתי שדה קלט, מדביק prompt...');
        
        // אם זה contenteditable div, נשתמש בשיטה מתאימה
        await promptField.click();
        await this.wait(500);
        
        // מנקה את השדה קודם
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('A');
        await this.page.keyboard.up('Control');
        await this.page.keyboard.press('Backspace');
        
        // מדביק את הטקסט
        await promptField.type(prompt, { delay: 20 });
        await this.wait(1000);
        console.log('✅ Prompt הודבק בהצלחה');

        // חפש כפתור "Generate" או כפתור שליחה
        const generateButtons = [
          'button[aria-label*="Send"]',    // Gemini משתמש ב-Send
          'button[data-test-id="send-button"]',
          'button svg',                     // כפתור עם אייקון
          'button:has-text("Send")',
          'button:has-text("Generate")',
          'button:has-text("Create")',
          'button[type="submit"]'
        ];

        let generateButton = null;
        for (const selector of generateButtons) {
          try {
            generateButton = await this.page.$(selector);
            if (generateButton) {
              await generateButton.click();
              console.log('✅ לחצתי על כפתור Generate');
              break;
            }
          } catch (e) {
            continue;
          }
        }

        if (!generateButton) {
          console.log('⚠️  לא מצאתי כפתור Generate');
          console.log('🖱️ אנא לחץ על Generate ידנית...');
        }
      }

      // המתן ליצירת התמונה (בדרך כלל 30-120 שניות)
      console.log('⏳ ממתין ליצירת התמונה... (זה יכול לקחת 1-2 דקות)');
      
      // חכה לתמונה להופיע
      await new Promise(resolve => setTimeout(resolve, 5000)); // המתן ראשוני
      
      console.log('🔍 מחפש את התמונה שנוצרה...');
      
      // נסה למצוא את התמונה
      const imageSelectors = [
        'img[alt*="generated"]',
        'img[src*="blob"]',
        'img[src*="data:image"]',
        '.generated-image img',
        '.result img',
        'canvas'
      ];

      let foundImage = false;
      let attempts = 0;
      const maxAttempts = 60; // 2 דקות (2 שניות * 60)

      while (!foundImage && attempts < maxAttempts) {
        for (const selector of imageSelectors) {
          try {
            const element = await this.page.$(selector);
            if (element) {
              console.log(`✅ מצאתי תמונה: ${selector}`);
              foundImage = true;
              
              // הורד את התמונה
              if (selector.includes('canvas')) {
                // אם זה canvas, המר ל-image
                await this.downloadFromCanvas(element, outputPath);
              } else {
                await this.downloadImage(element, outputPath);
              }
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (!foundImage) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
          if (attempts % 10 === 0) {
            console.log(`⏳ עדיין ממתין... (${attempts * 2} שניות)`);
          }
        }
      }

      if (!foundImage) {
        console.log('⚠️  לא הצלחתי למצוא את התמונה אוטומטית');
        console.log('💾 אנא שמור את התמונה ידנית בשם:', path.basename(outputPath));
        console.log('📁 בתיקייה:', path.dirname(outputPath));
        await this.waitForUserInput();
      }

      console.log(`✅ תמונת ${imageType} נשמרה בהצלחה!`);
      return true;

    } catch (error) {
      console.error(`❌ שגיאה ביצירת תמונת ${imageType}:`, error.message);
      return false;
    }
  }

  /**
   * הורדת תמונה מאלמנט
   */
  async downloadImage(imageElement, outputPath) {
    const src = await imageElement.evaluate(el => el.src);
    
    if (src.startsWith('data:')) {
      // תמונת base64
      const base64Data = src.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      await fs.writeFile(outputPath, buffer);
    } else if (src.startsWith('blob:')) {
      // blob URL - נצטרך להוריד דרך fetch
      const buffer = await this.page.evaluate(async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        return Array.from(new Uint8Array(arrayBuffer));
      }, src);
      await fs.writeFile(outputPath, Buffer.from(buffer));
    } else {
      // URL רגיל
      const viewSource = await this.page.goto(src);
      const buffer = await viewSource.buffer();
      await fs.writeFile(outputPath, buffer);
      await this.page.goBack();
    }
  }

  /**
   * הורדה מ-canvas
   */
  async downloadFromCanvas(canvasElement, outputPath) {
    const dataUrl = await canvasElement.evaluate(canvas => {
      return canvas.toDataURL('image/png');
    });
    
    const base64Data = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(outputPath, buffer);
  }

  /**
   * המתן להקלדת Enter מהמשתמש
   */
  async waitForUserInput() {
    return new Promise((resolve) => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
  }

  /**
   * סגירת הדפדפן
   */
  async close() {
    if (this.browser) {
      console.log('🔒 סוגר דפדפן...');
      await this.browser.close();
    }
  }

  /**
   * תהליך מלא: יצירת כל התמונות לבלוג
   */
  async generateBlogImages(imageDir, heroPrompt, infographicPrompt) {
    try {
      await this.initialize();

      // תמונת Hero
      console.log('\n📸 תמונת Hero:');
      console.log('─'.repeat(60));
      const heroPath = path.join(imageDir, 'hero.png');
      await this.generateImage(heroPrompt, heroPath, 'Hero (1200×675)');

      // המתן קצר בין תמונות
      await new Promise(resolve => setTimeout(resolve, 3000));

      // אינפוגרפיק
      console.log('\n📊 אינפוגרפיק:');
      console.log('─'.repeat(60));
      const infographicPath = path.join(imageDir, 'infographic.png');
      await this.generateImage(infographicPrompt, infographicPath, 'Infographic (1200×800)');

      console.log('\n🎉 כל התמונות נוצרו בהצלחה!');
      return true;

    } catch (error) {
      console.error('❌ שגיאה באוטומציה:', error);
      return false;
    } finally {
      await this.close();
    }
  }
}

module.exports = NanoBananaAutomation;
