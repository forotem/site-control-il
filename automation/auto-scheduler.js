const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const GSCAnalyzer = require('./gsc-analyzer');

const execAsync = promisify(exec);

/**
 * אוטומציה מלאה לבלוגים
 * רץ כל יומיים, מנתח GSC, ויוצר בלוג חדש
 */
class AutoScheduler {
  constructor() {
    this.gscAnalyzer = new GSCAnalyzer();
    this.automationPath = path.join(__dirname, 'simple-automation.js');
    this.blogListPath = path.join(__dirname, '..', 'app', 'data', 'blog.ts');
  }

  /**
   * קורא את רשימת הבלוגים הקיימים
   */
  async getExistingBlogs() {
    try {
      const content = await fs.readFile(this.blogListPath, 'utf8');
      // מחלץ slugs
      const slugMatches = content.match(/slug:\s*['"]([^'"]+)['"]/g);
      if (!slugMatches) return [];
      
      return slugMatches.map(match => {
        const slug = match.match(/slug:\s*['"]([^'"]+)['"]/)[1];
        return slug;
      });
    } catch (error) {
      console.error('❌ שגיאה בקריאת blog.ts:', error.message);
      return [];
    }
  }

  /**
   * בודק אם בלוג כבר קיים
   */
  async checkIfBlogExists(slug) {
    const existingBlogs = await this.getExistingBlogs();
    return existingBlogs.includes(slug);
  }

  /**
   * מעדכן את simple-automation.js עם נושא חדש
   */
  async updateAutomationTopic(opportunity) {
    const topic = this.gscAnalyzer.convertToTopic(opportunity.query);
    const slug = this.gscAnalyzer.convertToSlug(opportunity.query);
    const keywords = this.gscAnalyzer.generateKeywords(opportunity.query);
    
    console.log(`\n🎯 נושא נבחר: ${topic}`);
    console.log(`🔗 Slug: ${slug}`);
    console.log(`📊 נתוני GSC:`);
    console.log(`   Impressions: ${opportunity.impressions}`);
    console.log(`   Clicks: ${opportunity.clicks}`);
    console.log(`   Position: ${opportunity.position.toFixed(1)}`);
    
    // קורא את הקובץ
    let content = await fs.readFile(this.automationPath, 'utf8');
    
    // מחפש את המקטע של opportunities
    const opportunitiesRegex = /const opportunities = \[([\s\S]*?)\];/;
    const match = content.match(opportunitiesRegex);
    
    if (!match) {
      throw new Error('לא נמצא opportunities array ב-simple-automation.js');
    }
    
    // יוצר opportunities חדש
    const newOpportunity = `
    const opportunities = [
      {
        topic: '${topic}',
        englishSlug: '${slug}',
        targetKeywords: ${JSON.stringify(keywords, null, 10).replace(/\n/g, '\n          ')},
        difficulty: 'medium',
        searchVolume: ${opportunity.impressions},
        competition: 'medium',
        intent: 'informational'
      },`;
    
    // מחליף
    content = content.replace(opportunitiesRegex, newOpportunity + '\n    ];');
    
    // שומר
    await fs.writeFile(this.automationPath, content, 'utf8');
    
    console.log(`✅ עודכן simple-automation.js עם הנושא החדש\n`);
    
    return { topic, slug };
  }

  /**
   * מריץ את האוטומציה
   */
  async runAutomation() {
    console.log('🚀 מריץ אוטומציית בלוג...\n');
    
    try {
      const { stdout, stderr } = await execAsync(
        'node simple-automation.js',
        {
          cwd: __dirname,
          env: { ...process.env, AUTO_GENERATE_IMAGES: 'true' }
        }
      );
      
      console.log(stdout);
      if (stderr) console.error(stderr);
      
      return true;
    } catch (error) {
      console.error('❌ שגיאה בהרצת האוטומציה:', error.message);
      return false;
    }
  }

  /**
   * עושה commit ו-push ל-Git
   */
  async gitCommitPush(topic) {
    console.log('\n📤 עושה commit ו-push ל-GitHub...');
    
    try {
      // Git add
      await execAsync('git add .', { cwd: path.join(__dirname, '..') });
      
      // Git commit
      const commitMessage = `בלוג אוטומטי: ${topic.substring(0, 60)}...`;
      await execAsync(`git commit -m "${commitMessage}"`, {
        cwd: path.join(__dirname, '..')
      });
      
      // Git push
      await execAsync('git push', { cwd: path.join(__dirname, '..') });
      
      console.log('✅ הועלה ל-GitHub בהצלחה!\n');
      return true;
    } catch (error) {
      console.error('❌ שגיאה ב-Git:', error.message);
      return false;
    }
  }

  /**
   * הפונקציה הראשית
   */
  async run() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   🤖 אוטומציה אוטומטית לבלוגים - Site Control       ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    const startTime = Date.now();
    
    try {
      // 1. מנתח GSC
      console.log('📊 שלב 1: ניתוח Google Search Console...');
      const opportunities = await this.gscAnalyzer.analyzeOpportunities();
      
      if (opportunities.length === 0) {
        console.log('⚠️  לא נמצאו הזדמנויות. מסיים.');
        return;
      }
      
      // 2. בודק דבלים
      console.log('\n🔍 שלב 2: בדיקת דבלים...');
      
      for (const opp of opportunities) {
        const slug = this.gscAnalyzer.convertToSlug(opp.query);
        const exists = await this.checkIfBlogExists(slug);
        
        if (!exists) {
          console.log(`✅ נמצא נושא חדש: ${opp.query}\n`);
          
          // 3. מעדכן את האוטומציה
          console.log('⚙️  שלב 3: עדכון הגדרות אוטומציה...');
          const { topic } = await this.updateAutomationTopic(opp);
          
          // 4. מריץ אוטומציה
          console.log('🎨 שלב 4: יצירת בלוג (תוכן + תמונות)...');
          const success = await this.runAutomation();
          
          if (!success) {
            console.log('❌ האוטומציה נכשלה. מנסה בפעם הבאה.');
            return;
          }
          
          // 5. Git push
          console.log('📤 שלב 5: העלאה ל-GitHub...');
          await this.gitCommitPush(topic);
          
          // סיום
          const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
          
          console.log('\n╔════════════════════════════════════════════════════════╗');
          console.log('║                  ✅ סיום מוצלח!                      ║');
          console.log('╚════════════════════════════════════════════════════════╝');
          console.log(`\n📝 נושא: ${topic}`);
          console.log(`🔗 URL: /blog/${slug}`);
          console.log(`⏱️  זמן: ${duration} דקות`);
          console.log(`📊 SEO: מאופטמז מלא`);
          console.log(`🎨 תמונות: PNG + WebP + AVIF`);
          console.log(`\n🎉 הבלוג החדש זמין באתר!\n`);
          
          return; // בלוג אחד בלבד כל הרצה
        }
        
        console.log(`⚠️  הנושא "${opp.query}" כבר קיים, מנסה הבא...`);
      }
      
      console.log('\n⚠️  כל ההזדמנויות כבר קיימות. נסה שוב ביום הבא.\n');
      
    } catch (error) {
      console.error('\n❌ שגיאה קריטית:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }
}

// הרצה
if (require.main === module) {
  const scheduler = new AutoScheduler();
  scheduler.run();
}

module.exports = AutoScheduler;
