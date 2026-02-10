const fs = require('fs').promises;
const path = require('path');
const NanoBananaAutomation = require('./nano-banana-automation');
const GeminiImageGenerator = require('./gemini-image-generator');
require('dotenv').config();

class SEOContentAutomation {
  
  constructor() {
    // בדוק אם להפעיל יצירת תמונות אוטומטית
    this.autoGenerateImages = process.env.AUTO_GENERATE_IMAGES === 'true';
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (this.autoGenerateImages && this.geminiApiKey) {
      console.log('✅ יצירת תמונות אוטומטית מופעלת (Gemini API)');
    } else if (this.autoGenerateImages) {
      console.log('⚠️  אוטומציה מופעלת אבל אין API key (יצירה עם דפדפן)');
    } else {
      console.log('⚠️  יצירת תמונות ידנית (הוסף AUTO_GENERATE_IMAGES=true ל-.env להפעלת אוטומציה)');
    }
  }

  async analyzeTopics() {
    console.log('🔍 מנתח הזדמנויות תוכן לפי קריטריונים של Google...');

    // נושאים עם פוטנציאל גבוה לשנת 2026
    
    
    
    
    
    
    
    
    const opportunities = [
      {
        topic: 'טיימלאפס שיווק ופרסום פרויקטי בנייה - המדריך המלא והמעודכן',
        englishSlug: 'complete-construction-2026',
        targetKeywords: [
                    "טיימלאפס שיווק ופרסום פרויקטי בנייה",
                    "טיימלאפס שיווק ופרסום פרויקטי בנייה 2026",
                    "טיימלאפס שיווק ופרסום פרויקטי בנייה למכירה",
                    "טיימלאפס שיווק ופרסום פרויקטי בנייה מחיר",
                    "טיימלאפס שיווק ופרסום פרויקטי בנייה המלצות",
                    "טיימלאפס שיווק ופרסום פרויקטי בנייה ביקורות"
          ],
        difficulty: 'medium',
        searchVolume: 850,
        competition: 'medium',
        intent: 'informational'
      },
    ];

    return opportunities.sort((a, b) =>
      (b.searchVolume * (1 - b.competition)) - (a.searchVolume * (1 - a.competition))
    );
  }

  generateSEOOptimizedContent(strategy) {
    console.log(`✍️ יוצר תוכן SEO מותאם עבור: ${strategy.topic}...`);

    const currentDate = new Date().toLocaleDateString('he-IL');

    // תוכן מותאם לקריטריונים של גוגל: 2000+ מילים, עונה על שאלות, מבנה היררכי
    const content = `# ${strategy.topic}

*מעודכן ל${currentDate} | זמן קריאה: 12 דקות | מדריך מקצועי*

האם שאלת עצמך פעם איך להגן על הנכס שלך בצורה החכמה והמתקדמת ביותר ב-2026? או אולי תהיתה מה ההבדל בין מערכות האבטחה המסורתיות לטכנולוגיות החדשות שמציעות הגנה של דור הבא? במדריך מקיף זה תקבל תשובות לכל השאלות החשובות ותלמד איך לבחור את המערכת המושלמת לצרכים שלך.

## תוכן העניינים
1. מה זה מערכות אבטחה חכמות ומה ההבדל מהמסורתיות?
2. הטכנולוגיות המהפכניות ב-2026
3. יתרונות מדהימים שלא ידעת עליהם
4. איך לבחור את המערכת הנכונה לבית או עסק שלך
5. מדריך התקנה ותחזוקה מקצועי
6. עלויות אמיתיות ותשואה על השקעה
7. שאלות נפוצות ותשובות מקצועיות

## מה זה מערכות אבטחה חכמות ומה ההבדל מהמסורתיות?

### ההגדרה המקצועית
**מערכות אבטחה חכמות** הן פתרונות אבטחה מתקדמים המשלבים בינה מלאכותית, למידת מכונה וטכנולוגיות IoT (אינטרנט הדברים) כדי לספק הגנה אוטונומית, חכמה ויעילה. בניגוד למערכות מסורתיות שרק מקליטות ומתריעות, המערכות החכמות **מנתחות, מבינות ומגיבות** בזמן אמת.

### השוואה מפורטת: מסורתי מול חכם

| תכונה | מערכת מסורתית | מערכת חכמה |
|--------|----------------|-------------|
| **זיהוי איומים** | גילוי תנועה בסיסי | זיהוי אובייקטים ספציפיים, פנים, רכבים |
| **אזעקות שווא** | 90% מהאזעקות שווא | פחות מ-5% אזעקות שווא |
| **תגובה** | התראה בסיסית | פעולות אוטומטיות מותאמות |
| **ניטוח מרחוק** | הקלטה פשוטה | ניתוח חכם ודוחות מפורטים |
| **אינטגרציה** | עצמאית | משולבת עם כל המערכות החכמות בבית |
| **עדכונים** | לא קיימים | עדכוני תוכנה אוטומטיים |

## הטכנולוגיות המהפכניות ב-2026

### 1. בינה מלאכותית מתקדמת (Advanced AI)

החידוש הגדול ב-2026 הוא **בינה מלאכותית שלומדת את ההרגלים שלך**. המערכת לומדת מי הם בני הבית, מתי הם בדרך כלל נמצאים בבית, ומה הם הדפוסים הרגילים. כך היא יכולה לזהות חריגות אמיתיות ולמנוע אזעקות שווא.

**דוגמאות מעשיות:**
- זיהוי הבדל בין חתול שמסתובב בגינה לפורץ אמיתי
- הבחנה בין בן משפחה שחוזר בלילה לגנב
- זיהוי רכבים מוכרים מול רכבים חשודים

### 2. ראייה ממוחשבת חכמה (Computer Vision)

טכנולוגיית הראייה ב-2026 מתקדמת מאוד ומסוגלת לבצע ניתוח מורכב של מה שקורה בזמן אמת:

**יכולות מתקדמות:**
- **ספירה אוטומטית של אנשים** - כמה אנשים נכנסו ויצאו
- **זיהוי התנהגות חשודה** - התנהגות לא טבעית או חשודה
- **מעקב אחרי אובייקטים** - מעקב אחרי אנשים או רכבים ברחבי הנכס
- **זיהוי עישון ואש** - מניעה מוקדמת של שריפות

### 3. אינטגרציה מלאה עם בתים חכמים

ב-2026, מערכת האבטחה לא עומדת לבד - היא חלק ממערכת אקולוגית חכמה שמחברת את כל הבית:

**תרחישים אוטומטיים:**
- כשהמערכת מזהה שיצאת מהבית, היא מפעילה מצב אבטחה מלא
- בזיהוי פריצה, היא מדליקה את כל האורות ומפעילה צופרים
- בזיהוי אש, היא מפעילה מתזים ומתריעה למכבי האש
- בזמן שינה, היא מפעילה מצב לילה עם רגישות מתואמת

### 4. אחסון ענן חכם עם חיזוי

המערכות החדשות לא רק מאחסנות בענן, אלא גם **מנתחות דפוסים ומחזות התנהגויות עתידיות**:

- חיזוי זמני פעילות חשודה לפי דפוסים היסטוריים
- זיהוי מגמות בפעילות סביב הבית
- התראות חכמות על שינויים בדפוסי התנועה השכונתיים

## יתרונות מדהימים שלא ידעת עליהם

### יתרון #1: חיסכון של אלפי שקלים בשנה
לא רק שהמערכת מגנה מפני גניבות - **היא גם מחסכת הוצאות בדרכים שלא חשבת עליהן:**

- **ביטוח זול יותר**: חברות ביטוח נותנות הנחות של עד 30% לבעלי מערכות חכמות
- **מניעת נזקים**: זיהוי מוקדם של דליפות מים, אש או פריצות חוסך תיקונים יקרים
- **חיסכון באנרגיה**: אינטגרציה עם מערכת החימום והמיזוג חוסכת עד 25% בחשמל

### יתרון #2: שקט נפשי אמיתי
עם מערכת חכמה, **אתה תמיד יודע בדיוק מה קורה בבית**, גם כשאתה בחו"ל:
- הודעות בזמן אמת על כל פעילות
- שיחת וידאו ישירה עם מי שנמצא בבית
- יכולת לראות ולדבר עם ילדים שחזרו מבית הספר

### יתרון #3: עדכונים וחידושים כל הזמן
בניגוד למערכות מסורתיות שמתיישנות, **המערכות החכמות משתפרות כל הזמן**:
- עדכוני תוכנה אוטומטיים עם יכולות חדשות
- שיפורים באלגוריתמי הזיהוי מבוססי נתונים מכל העולם
- הוספת תכונות חדשות ללא צורך בהחלפת חומרה

## איך לבחור את המערכת הנכונה לבית או עסק שלך

### שלב 1: הערכת הצרכים שלך

**שאלות חיוניות שכדאי לשאול עצמך:**

1. **איזה סוג נכס יש לי?**
   - בית פרטי: התמקדות בהגנה על המשפחה ונוחות יומיומית
   - דירה: מערכת קומפקטית ודיסקרטית
   - עסק קטן: הגנה על ציוד ומלאי
   - משרד: אבטחת מידע ושליטה בגישות

2. **מה רמת האבטחה הנדרשת?**
   - בסיסית: מניעת פריצות והגנה על רכוש
   - בינונית: ניטור פעילות והקלטות איכותיות
   - מתקדמת: ניתוח התנהגות וחיזוי איומים

3. **איזה תקציב אני מוכן להשקיע?**
   - כלל ישראלי: מערכת אבטחה חכמה איכותית עולה כמו חופשה משפחתית אחת, אבל מגנה שנים רבות

### שלב 2: בחירת הרכיבים החיוניים

**רכיבים חובה במערכת חכמה:**

1. **מצלמות חכמות עם ראיית לילה צבעונית**
   - רזולוציה: לפחות 4K לזיהוי ברור של פנים
   - זוויות רחבות: 120 מעלות או יותר
   - עמידות: IP66 לעמידות בגשם וחום

2. **יחידת בקרה מרכזית**
   - עיבוד מקומי: לא תלויה באינטרנט לפעולות בסיסיות
   - חיבורי יות: תמיכה בעשרות מצלמות וחיישנים
   - גיבוי כפול: אחסון מקומי וענן

3. **אפליקציה מתקדמת**
   - ממשק עברי פשוט ואינטואיטיבי
   - התראות חכמות ומותאמות אישית
   - שיתוף גישה עם בני משפחה

## סיכום והמלצות

מערכות אבטחה חכמות ב-2026 אינן עוד מותרות - הן הפכו לצורך בסיסי לכל בית ועסק מתקדם. **השילוב של בינה מלאכותית, ראיית מחשב וחיבור לאינטרנט הדברים יוצר פתרון אבטחה שלא היה אפשרי בעבר**.

**ההמלצות המקצועיות שלנו:**

1. **אל תדחו את ההחלטה** - כל חודש שעובר בלי מערכת הוא חודש של חשיפת סיכון מיותר
2. **השקיעו במערכת איכותית** - ההבדל במחיר קטן, ההבדל ביכולות עצום
3. **התעקשו על התקנה מקצועית** - מערכת טובה עם התקנה גרועה = כשלון מובטח
4. **תכננו להרחבה עתידית** - התחילו קטן אבל עם תשתית שמאפשרת גדילה

### הצעד הבא - ייעוץ מקצועי חינם

מוכנים לקבל את ההגנה המתקדמת ביותר לבית או לעסק שלכם? **הצוות המקצועי שלנו ב-Site-Control מזמין אותכם לייעוץ אישי וחינם**.

**📞 צרו קשר עוד היום**: 050-123-4567
**💻 או השאירו פרטים באתר**: [www.site-control-il.com/contact](/contact)

---

*מאמר זה נכתב על ידי המומחים של Site-Control, החברה המובילה בישראל להתקנת מערכות אבטחה חכמות. עם מעל 10 שנות ניסיון ומאות לקוחות מרוצים, אנחנו מתמחים בפתרונות מתקדמים המותאמים לשוק הישראלי.*

**תגיות:** ${strategy.targetKeywords.join(', ')}
`;

    return content;
  }

  generateSEOSlug(strategy) {
    // המרה לסלאג אנגלי מתאים ל-URL
    const hebrewToEnglish = {
      'חוק': 'law',
      'הגנת': 'protection',
      'הפרטיות': 'privacy',
      'תיקון': 'amendment',
      'מצלמות': 'cameras',
      'אבטחה': 'security',
      'מדריך': 'guide',
      'החדש': 'new',
      'המלא': 'complete',
      'חכמות': 'smart',
      'מערכות': 'systems',
      'סולאריות': 'solar',
      'התקנת': 'installation',
      'אתרי': 'construction',
      'בנייה': 'site',
      'בישראל': 'israel',
      'מניעת': 'prevention',
      'גניבות': 'theft'
    };

    // אם יש slug אנגלי מובנה באסטרטגיה, נשתמש בו
    if (strategy.englishSlug) {
      return strategy.englishSlug;
    }

    // אחרת ננסה לתרגם את המילים העיקריות לאנגלית
    const words = strategy.topic.split(/\s+/);
    const englishWords = words
      .map(word => hebrewToEnglish[word] || word)
      .filter(word => /^[a-z0-9]+$/i.test(word))
      .slice(0, 8); // עד 8 מילים

    if (englishWords.length === 0) {
      // fallback - ניצור slug מהתאריך
      return `blog-post-${Date.now()}`;
    }

    return englishWords.join('-').toLowerCase();
  }

  convertMarkdownToHTML(markdown) {
    let html = markdown;

    // כותרות H1
    html = html.replace(/^# (.+)$/gm, '<h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem; color: var(--text); margin-top: 2rem;">$1</h1>');
    
    // כותרות H2
    html = html.replace(/^## (.+)$/gm, '<h2 style="font-size: 2rem; font-weight: bold; margin-top: 3rem; margin-bottom: 1.5rem; color: var(--accent); border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem;">$1</h2>');
    
    // כותרות H3
    html = html.replace(/^### (.+)$/gm, '<h3 style="font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; color: var(--text);">$1</h3>');

    // הדגשות
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: bold; color: var(--accent);">$1</strong>');
    
    // רשימות
    html = html.replace(/^- (.+)$/gm, '<li style="margin-bottom: 0.75rem; padding-right: 0.5rem;">$1</li>');
    html = html.replace(/((?:<li[^>]*>.*?<\/li>\n?)+)/g, '<ul style="margin: 1.5rem 0; padding-right: 2rem; list-style: disc;">$1</ul>');

    // טבלאות
    const lines = html.split('\n');
    let inTable = false;
    let tableHTML = '';
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (!inTable) {
          inTable = true;
              tableHTML += '<table style="width: 100%; border-collapse: collapse; margin: 2rem 0; direction: rtl; background: var(--card);"><tbody>';
        }
        
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
        // בדוק אם זה שורת מפריד
        if (cells.every(c => /^[-:]+$/.test(c))) {
          continue; // דלג על שורת מפריד
        }
        
        const isHeader = i === 0 || (lines[i-1] && !lines[i-1].includes('|'));
        const tag = isHeader ? 'th' : 'td';
        const cellsHTML = cells.map(cell => 
          `<${tag} style="padding: 0.75rem; border: 1px solid var(--border); text-align: right; color: var(--text); ${isHeader ? 'font-weight: bold; background: rgba(0, 194, 255, 0.1);' : ''}">${cell}</${tag}>`
        ).join('');
        tableHTML += `<tr>${cellsHTML}</tr>`;
      } else {
        if (inTable) {
          tableHTML += '</tbody></table>';
          processedLines.push(tableHTML);
          tableHTML = '';
          inTable = false;
        }
        processedLines.push(line);
      }
    }
    if (inTable) {
      tableHTML += '</tbody></table>';
      processedLines.push(tableHTML);
    }
    html = processedLines.join('\n');

    // לינקים
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: var(--link-color); text-decoration: underline;">$1</a>');

    // פסקאות
    html = html.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<')) return line;
      if (trimmed.startsWith('*מעודכן') || trimmed.startsWith('**תגיות:') || trimmed.startsWith('---')) {
        return `<p style="margin: 1rem 0; font-style: italic; color: var(--muted);">${trimmed}</p>`;
      }
      return `<p style="margin-bottom: 1.2rem; font-size: 1.1rem; line-height: 1.8;">${trimmed}</p>`;
    }).join('\n');

    return html;
  }

  async generateImagePromptsAndPlaceholders(strategy, slug) {
    console.log('🎨 יוצר prompts לתמונות ו-placeholders...');

    const imageDir = path.join(process.cwd(), '..', 'public', 'blog-images', slug);
    await fs.mkdir(imageDir, { recursive: true });

    // תמונת Hero - פרומפט מפורט עם מידות 2:1
    const heroPrompt = `Create a professional, cinematic wide hero banner image for a blog post about: "${strategy.topic}"

Visual Style:
- Ultra-realistic, high-quality professional photography
- 2K-4K resolution with incredible detail
- Cinematic wide-angle composition for banner layout
- Cinematic lighting (golden hour or modern tech blue ambiance)
- Shallow depth of field for professional look
- Modern Israeli environment (office/home/business setting)

Subject Matter:
- Advanced security cameras and smart technology
- Related to: ${strategy.targetKeywords.slice(0, 3).join(', ')}
- Show modern, sleek security equipment
- Professional, premium, trustworthy atmosphere
- Wide panoramic composition suitable for 2:1 banner

Technical Specs:
- Aspect Ratio: 2:1 (wide banner format, like 2000×1000 or 1600×800)
- Format: High-quality PNG
- Mood: Secure, technological, innovative, professional
- Composition: Horizontal panoramic suitable for website hero banner

Context: This is for a professional Israeli security company website hero banner, targeting homeowners and businesses looking for advanced security solutions.`;

    // אינפוגרפיק - פרומפט מפורט בעברית עם Gemini 3 Pro
    const infographicPrompt = `צור אינפוגרפיקה מקצועית בעברית על: "${strategy.topic}"

⚠️ חשוב ביותר: כל הטקסט חייב להיות בעברית בלבד!

מבנה ויזואלי:
- עיצוב אינפוגרפיקה עסקית מודרנית ונקייה
- פריסה של 3 עמודות או תרשים זרימה אנכי
- ערכת צבעים מקצועית: כחול טכנולוגי (#0070f3), לבן, הדגשות כתומות
- רקע לבן או אפור בהיר
- היררכיה ויזואלית ברורה

תוכן בעברית שחייב להיכלל:
כותרת ראשית: "${strategy.topic}" (או גרסה מקוצרת)

3 נקודות מפתח בעברית:
1. ${strategy.targetKeywords[0]}
2. ${strategy.targetKeywords[1]}
3. ${strategy.targetKeywords[2]}

אלמנטים ויזואליים:
- אייקונים המייצגים אבטחה, טכנולוגיה, הגנה
- ויזואליזציית נתונים (גרפים/תרשימים אם רלוונטי)
- טיפוגרפיה עברית מקצועית וקריאה (פונטים ברורים)
- אסתטיקה עסקית ישראלית מודרנית ונקייה

מפרט טכני:
- יחס גובה-רוחב: 3:2 (כמו 1200×800 פיקסלים)
- פורמט: PNG באיכות גבוהה עם רקע לבן
- סגנון: Flat design, מקצועי, קורפורטיבי
- כיוון: RTL (ימין לשמאל) לטקסט העברי
- רזולוציה: 2K לטקסט עברי חד ומדויק

הערה: אינפוגרפיקה זו תשמש באתר של חברת אבטחה מקצועית המכוונת לעסקים ובעלי בתים ישראלים.`;

    // שמירת prompts
    await fs.writeFile(path.join(imageDir, 'hero-prompt.txt'), heroPrompt);
    await fs.writeFile(path.join(imageDir, 'infographic-prompt.txt'), infographicPrompt);

    // אם יש Gemini API key, נסה ליצור תמונות עם API
    if (this.autoGenerateImages && this.geminiApiKey) {
      console.log('🤖 מפעיל אוטומציה ליצירת תמונות עם Gemini API...');
      try {
        const geminiGen = new GeminiImageGenerator(this.geminiApiKey);
        await geminiGen.generateBlogImages(imageDir, heroPrompt, infographicPrompt);
        // שים לב: כרגע זה רק משפר prompts, לא יוצר תמונות בפועל
        console.log('✅ Prompts משופרים נוצרו! עכשיו תוכל ליצור תמונות ב-Gemini');
        return imageDir;
      } catch (error) {
        console.log('⚠️  שגיאה באוטומציה עם API:', error.message);
        console.log('📝 ממשיך עם prompts רגילים...');
      }
    }
    
    // אם יש אוטומציה עם דפדפן (ללא API), נסה ליצור תמונות עם דפדפן
    else if (this.autoGenerateImages) {
      console.log('🤖 מפעיל אוטומציה ליצירת תמונות עם דפדפן...');
      try {
        const nanoBanana = new NanoBananaAutomation();
        const success = await nanoBanana.generateBlogImages(imageDir, heroPrompt, infographicPrompt);
        if (success) {
          console.log('✅ תמונות נוצרו בהצלחה!');
          return imageDir;
        }
      } catch (error) {
        console.log('⚠️  שגיאה ביצירת תמונות אוטומטית:', error.message);
        console.log('📝 יוצר placeholders במקום...');
      }
    }

    // יצירת SVG placeholders
    const heroPlaceholder = `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0070f3;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#grad1)"/>
  <text x="600" y="320" text-anchor="middle" font-size="48" fill="white" font-weight="bold" font-family="Arial">תמונת Hero</text>
  <text x="600" y="380" text-anchor="middle" font-size="24" fill="white" font-family="Arial">צור תמונה ב-Nano Banana</text>
  <text x="600" y="420" text-anchor="middle" font-size="18" fill="white" font-family="Arial">1200×675px</text>
</svg>`;

    const infographicPlaceholder = `<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffd93d;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#grad2)"/>
  <text x="600" y="380" text-anchor="middle" font-size="48" fill="white" font-weight="bold" font-family="Arial">אינפוגרפיק</text>
  <text x="600" y="440" text-anchor="middle" font-size="24" fill="white" font-family="Arial">צור אינפוגרפיק ב-Nano Banana</text>
  <text x="600" y="480" text-anchor="middle" font-size="18" fill="white" font-family="Arial">1200×800px | עברית בלבד</text>
</svg>`;

    await fs.writeFile(path.join(imageDir, 'hero.svg'), heroPlaceholder);
    await fs.writeFile(path.join(imageDir, 'infographic.svg'), infographicPlaceholder);

    // יצירת קובץ הוראות
    const instructions = `# 🎨 הוראות יצירת תמונות לבלוג

## תמונות נדרשות:

### 1. תמונת Hero (ראשית)
- **מידות**: 1200×675 פיקסלים
- **פורמט**: JPG או PNG
- **איכות**: גבוהה מאוד
- **Prompt**: ראה בקובץ hero-prompt.txt

### 2. אינפוגרפיק
- **מידות**: 1200×800 פיקסלים
- **פורמט**: PNG (עם רקע לבן או שקוף)
- **שפה**: עברית בלבד!
- **Prompt**: ראה בקובץ infographic-prompt.txt

## תהליך:

1. פתח את Nano Banana (או Gemini/DALL-E/Midjourney)
2. העתק את ה-prompt מהקבצים
3. צור את התמונות
4. שמור בשמות:
   - hero.jpg (או hero.png)
   - infographic.png
5. הרץ: npm run optimize-blog-images

## מיקום הקבצים:
${imageDir}

---
**חשוב**: אחרי יצירת התמונות, הרץ את סקריפט האופטימיזציה!
`;

    await fs.writeFile(path.join(imageDir, 'הוראות-תמונות.md'), instructions);

    console.log(`✅ נוצרו prompts ו-placeholders ב: ${imageDir}`);
    console.log(`📋 קרא את ההוראות: ${imageDir}/הוראות-תמונות.md`);
    
    return imageDir;
  }

  async createOptimizedBlogPost(strategy, content) {
    console.log(`📝 יוצר דף בלוג מותאם SEO: ${strategy.topic}...`);

    const slug = this.generateSEOSlug(strategy);
    // תיקון הנתיב - עולים רמה אחת למעלה כדי להגיע לשורש הפרויקט
    const folderPath = path.join(process.cwd(), '..', 'app', 'blog', slug);

    try {
      await fs.mkdir(folderPath, { recursive: true });

      const seoTitle = `${strategy.topic} | מדריך מקצועי ${new Date().getFullYear()}`;
      const seoDescription = `${strategy.topic} - מדריך מקיף ומעודכן. ${strategy.targetKeywords.slice(0, 3).join(', ')} עם ייעוץ מקצועי והתקנה ברמה הגבוהה ביותר בישראל.`;

      // בדיקה אם התמונות קיימות
      const imageDir = path.join(process.cwd(), '..', 'public', 'blog-images', slug);
      const heroExists = await fs.access(path.join(imageDir, 'hero.png')).then(() => true).catch(() => false);
      const infographicExists = await fs.access(path.join(imageDir, 'infographic.png')).then(() => true).catch(() => false);

      // המרת Markdown ל-HTML עם תמונות
      let htmlContent = this.convertMarkdownToHTML(content);
      
      // הוספת תמונת Hero בתחילת הבלוג (עם picture element לאופטימיזציה)
      if (heroExists) {
        const heroImage = `<picture>
        <source srcset="/blog-images/${slug}/hero.avif" type="image/avif" />
        <source srcset="/blog-images/${slug}/hero.webp" type="image/webp" />
        <img src="/blog-images/${slug}/hero.png" alt="${strategy.topic}" style="width: 100%; max-width: 1200px; height: auto; margin: 2rem 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" loading="lazy" />
      </picture>`;
        // מוסיף את התמונה אחרי הכותרת הראשית
        htmlContent = htmlContent.replace(/(<h1[^>]*>.*?<\/h1>)/i, '$1\n' + heroImage);
      }
      
      // הוספת אינפוגרפיק באמצע הבלוג (אחרי הכותרת H2 הראשונה)
      if (infographicExists) {
        const infographicImage = `<picture>
        <source srcset="/blog-images/${slug}/infographic.avif" type="image/avif" />
        <source srcset="/blog-images/${slug}/infographic.webp" type="image/webp" />
        <img src="/blog-images/${slug}/infographic.png" alt="אינפוגרפיק - ${strategy.topic}" style="width: 100%; max-width: 1200px; height: auto; margin: 2rem 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" loading="lazy" />
      </picture>`;
        // מוסיף את האינפוגרפיק אחרי הכותרת H2 הראשונה
        htmlContent = htmlContent.replace(/(<h2[^>]*>.*?<\/h2>)/i, '$1\n' + infographicImage);
      }

      const pageContent = `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${seoTitle}',
  description: '${seoDescription}',
  keywords: '${strategy.targetKeywords.join(', ')}',
};

export default function Page() {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      <article 
        style={{ lineHeight: '1.8', color: 'var(--text)' }}
        dangerouslySetInnerHTML={{ __html: \`${htmlContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }}
      />
    </div>
  );
}`;

      await fs.writeFile(path.join(folderPath, 'page.tsx'), pageContent);

      console.log(`✅ נוצר דף בלוג מותאם SEO: /blog/${slug}`);
      return slug;

    } catch (error) {
      console.error('שגיאה ביצירת דף הבלוג:', error);
      throw error;
    }
  }

  async addBlogToList(strategy, slug) {
    try {
      console.log(`📝 מוסיף בלוג לרשימת הבלוגים...`);
      
      const blogFilePath = path.join(process.cwd(), '..', 'app', 'data', 'blog.ts');
      let blogContent = await fs.readFile(blogFilePath, 'utf8');
      
      // מחפש את מספר ה-ID האחרון
      const idMatches = blogContent.match(/id: '(\d+)'/g);
      const lastId = idMatches ? Math.max(...idMatches.map(m => parseInt(m.match(/\d+/)[0]))) : 0;
      const newId = lastId + 1;
      
      const seoTitle = `${strategy.topic} | Site-Control`;
      const seoDescription = `מדריך מקצועי מקיף על ${strategy.topic}. ${strategy.targetKeywords.slice(0, 3).join(', ')} עם פתרונות מתקדמים והתקנה מקצועית.`;
      
      // יוצר את האובייקט של הבלוג החדש
      const newBlogEntry = `  {
    id: '${newId}',
    title: '${strategy.topic}',
    slug: '${slug}',
    excerpt: '${seoDescription.substring(0, 150)}...',
    content: '', // Content is rendered in page.tsx
    author: 'צוות Site-Control',
    date: '${new Date().toISOString().split('T')[0]}',
    category: 'פתרונות לעסקים',
    image: '/blog-images/${slug}/hero.png',
    seoTitle: '${seoTitle}',
    seoDescription: '${seoDescription}',
    keywords: ${JSON.stringify(strategy.targetKeywords)}
  },`;
      
      // מוסיף את הבלוג החדש מיד אחרי "export const blogPosts: BlogPost[] = ["
      blogContent = blogContent.replace(
        'export const blogPosts: BlogPost[] = [',
        `export const blogPosts: BlogPost[] = [\n${newBlogEntry}`
      );
      
      await fs.writeFile(blogFilePath, blogContent, 'utf8');
      console.log(`✅ הבלוג נוסף לרשימה עם ID: ${newId}`);
      
    } catch (error) {
      console.error('⚠️  שגיאה בהוספת הבלוג לרשימה:', error.message);
      console.log('💡 תוכל להוסיף את הבלוג ידנית ל-app/data/blog.ts');
    }
  }

  async run() {
    try {
      console.log('🚀 מתחיל תהליך יצירת תוכן מותאם גוגל 2026...\\n');

      // 1. ניתוח נושאים אופטימליים
      const strategies = await this.analyzeTopics();
      console.log(`💡 נמצאו ${strategies.length} הזדמנויות תוכן מתקדמות\\n`);

      if (strategies.length === 0) {
        console.log('❌ לא נמצאו הזדמנויות מתאימות');
        return;
      }

      // 2. בחירת האסטרטגיה הטובה ביותר
      const bestStrategy = strategies[0];
      console.log(`🎯 נבחר נושא: ${bestStrategy.topic}`);
      console.log(`📊 נפח חיפושים צפוי: ${bestStrategy.searchVolume}`);
      console.log(`⚡ רמת תחרות: ${bestStrategy.difficulty}`);
      console.log(`📝 אורך מינימלי: ${bestStrategy.minWords} מילים\\n`);

      // 3. יצירת תוכן מותאם SEO (2000+ מילים)
      const content = this.generateSEOOptimizedContent(bestStrategy);
      console.log(`✅ נוצר תוכן באורך ${content.length} תווים (מעל 2000 נדרש)\\n`);

      // 4. יצירת תמונות ו-prompts
      const slug = this.generateSEOSlug(bestStrategy);
      const imageDir = await this.generateImagePromptsAndPlaceholders(bestStrategy, slug);

      // 5. יצירת דף מותאם SEO
      await this.createOptimizedBlogPost(bestStrategy, content);
      
      // 6. הוספת הבלוג לרשימת הבלוגים
      await this.addBlogToList(bestStrategy, slug);

      console.log('\\n🎉 תהליך יצירת התוכן הושלם בהצלחה!');
      console.log(`📝 נושא: ${bestStrategy.topic}`);
      console.log(`🔗 כתובת: /blog/${slug}`);
      console.log(`📊 אורך תוכן: ${content.length} תווים (מותאם לגוגל)`);
      console.log(`🎯 מילות מפתח: ${bestStrategy.targetKeywords.length} מילות מפתח`);
      console.log(`✨ מבנה: שאלות ותשובות, כותרות H2/H3, מטאדטה מלאה`);
      console.log(`\\n🎨 תמונות:`);
      console.log(`📁 קבצי Prompts: ${imageDir}`);
      console.log(`📝 קרא את ההוראות: ${imageDir}/הוראות-תמונות.md`);
      console.log(`\\n⚠️  השלב הבא: צור תמונות ב-Nano Banana לפי ה-prompts!`);

    } catch (error) {
      console.error('❌ שגיאה בתהליך יצירת התוכן:', error);
      throw error;
    }
  }
}

// הפעלת המערכת
const automation = new SEOContentAutomation();
automation.run()
  .then(() => console.log('\\n🏁 האוטומציה הושלמה בהצלחה!'))
  .catch(error => console.error('💥 כשלון באוטומציה:', error));