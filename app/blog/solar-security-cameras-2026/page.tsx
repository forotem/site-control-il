import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מצלמות אבטחה סולאריות לבית ולעסק 2026 - המדריך המלא | Site-Control',
  description: 'מדריך מקיף למצלמות אבטחה סולאריות 2026: יתרונות, התקנה, מחירים והמלצות. גלו איך מצלמות סולאריות חוסכות חשמל ומספקות אבטחה 24/7 ללא תלות ברשת החשמל.',
  keywords: 'מצלמות אבטחה סולאריות, מצלמות סולאריות לבית, מצלמות אבטחה ללא חשמל, מצלמות אבטחה עם פאנל סולארי, מצלמות אבטחה אלחוטיות סולאריות, התקנת מצלמות סולאריות',
  openGraph: {
    title: 'מצלמות אבטחה סולאריות 2026 - המדריך המלא',
    description: 'הכל על מצלמות אבטחה סולאריות: יתרונות, התקנה, מחירים והמלצות מקצועיות',
    images: ['/blog-images/solar-security-cameras-2026/hero.svg'],
  },
};

export default function SolarSecurityCamerasPage() {
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: '1.6',
      color: '#333'
    }}>
      <article>
        {/* Hero Image */}
        {/* Hero Image */}
        <div style={{
          position: 'relative',
          width: '100%',
          marginBottom: '3rem',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 112, 243, 0.1)'
        }}>
          {/* 
            TODO: לאחר יצירת תמונות ב-Nano Banana והרצת אופטימיזציה (npm run optimize-blog-images),
            הסר את ההערה מהקוד הבא כדי להשתמש בתמונות המאופטמות:
          */}
          {/*
          <picture>
             <source srcSet="/optimized-variants/blog/solar-security-cameras-2026/hero-w1200.avif" type="image/avif" />
             <source srcSet="/optimized-variants/blog/solar-security-cameras-2026/hero-w1200.webp" type="image/webp" />
             <img 
               src="/optimized-variants/blog/solar-security-cameras-2026/hero-w1200.webp"
               alt="מצלמות אבטחה סולאריות - פתרון אקולוגי ויעיל"
               style={{ width: '100%', height: 'auto', display: 'block' }}
             />
          </picture>
          */}

          {/* כרגע מציג את ה-SVG Placeholder */}
          <img
            src="/blog-images/solar-security-cameras-2026/hero.webp"
            alt="מצלמות אבטחה סולאריות - פתרון אקולוגי ויעיל"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />

          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
            color: 'white',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              מצלמות אבטחה סולאריות 2026
            </h1>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>המדריך המלא לבחירה והתקנה</p>
          </div>
        </div>

        <header style={{ marginBottom: '3rem', textAlign: 'center', borderBottom: '2px solid #0070f3', paddingBottom: '2rem' }}>
          <div style={{ color: '#666', fontSize: '1rem' }}>
            <span>מעודכן ל-26.1.2026</span> •
            <span> זמן קריאה: 15 דקות</span> •
            <span> מדריך מקצועי</span>
          </div>
        </header>

        <div style={{ fontSize: '1.1rem' }}>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: '500',
            color: '#0070f3',
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderLeft: '4px solid #0070f3'
          }}>
            האם אתם מחפשים פתרון אבטחה שחוסך חשמל, ידידותי לסביבה ועובד 24/7 גם במקומות ללא חיבור לרשת החשמל?
            מצלמות אבטחה סולאריות הן הפתרון המושלם לבית, לעסק, למשק חקלאי ולכל מקום שזקוק לאבטחה עצמאית ואמינה.
          </p>

          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '2rem',
            borderRadius: '8px',
            marginBottom: '3rem',
            border: '1px solid #0070f3'
          }}>
            <h2 style={{ color: '#0070f3', marginTop: '0' }}>תוכן העניינים</h2>
            <ol style={{ paddingRight: '1rem' }}>
              <li><strong>מה זה מצלמות אבטחה סולאריות ואיך הן עובדות?</strong></li>
              <li><strong>יתרונות מצלמות סולאריות על פני מצלמות רגילות</strong></li>
              <li><strong>סוגי מצלמות סולאריות ומה מתאים לכם</strong></li>
              <li><strong>מפרט טכני - על מה לשים לב בבחירה</strong></li>
              <li><strong>התקנה נכונה - המדריך המלא</strong></li>
              <li><strong>עלויות ותשואה על ההשקעה</strong></li>
              <li><strong>שאלות נפוצות ותשובות מקצועיות</strong></li>
            </ol>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            מה זה מצלמות אבטחה סולאריות ואיך הן עובדות?
          </h2>

          <h3 style={{ color: '#333', fontSize: '1.4rem', marginBottom: '1rem' }}>העיקרון הבסיסי</h3>
          <p>
            <strong>מצלמות אבטחה סולאריות</strong> הן מצלמות אבטחה אלחוטיות המופעלות באמצעות
            <strong> פאנל סולארי</strong> שממיר אור שמש לאנרגיה חשמלית. האנרגיה נאגרת ב<strong>סוללה נטענת</strong>
            המאפשרת למצלמה לפעול גם בלילה וביום מעונן.
          </p>

          <div style={{ backgroundColor: '#e0f2fe', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h4 style={{ color: '#0277bd', marginTop: '0' }}>רכיבים עיקריים במערכת:</h4>
            <ul style={{ paddingRight: '1rem' }}>
              <li><strong>פאנל סולארי</strong> - גודל טיפוסי: 5-10 וואט, מספק טעינה מלאה ב-4-6 שעות שמש</li>
              <li><strong>סוללה נטענת</strong> - קיבולת: 10,000-20,000 mAh, מספקת 3-7 ימי פעילה רצופה</li>
              <li><strong>מצלמת אבטחה</strong> - רזולוציה: 1080p-4K, ראיית לילה, זיהוי תנועה חכם</li>
              <li><strong>מערכת ניהול אנרגיה</strong> - מייעלת צריכה ומונעת פריקת יתר של הסוללה</li>
            </ul>
          </div>

          <h3 style={{ color: '#333', fontSize: '1.4rem', marginBottom: '1rem' }}>איך זה עובד בפועל?</h3>
          <p>
            במהלך היום, הפאנל הסולארי סופג אור שמש וממיר אותו לחשמל. החשמל טוען את הסוללה הפנימית
            ומפעיל את המצלמה. בלילה או בימים מעוננים, המצלמה פועלת מכוח הסוללה.
            מערכת ניהול אנרגיה חכמה דואגת לאיזון מושלם בין צריכה לטעינה.
          </p>

          {/* Infographic */}
          <div style={{
            textAlign: 'center',
            margin: '3rem 0',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            {/* 
            TODO: לאחר אופטימיזציה, הסר הערה:
            <picture>
               <source srcSet="/optimized-variants/blog/solar-security-cameras-2026/infographic-infographic.avif" type="image/avif" />
               <source srcSet="/optimized-variants/blog/solar-security-cameras-2026/infographic-infographic.webp" type="image/webp" />
               <img 
                 src="/optimized-variants/blog/solar-security-cameras-2026/infographic-infographic.webp"
                 alt="תרשים: איך עובדות מצלמות סולאריות"
                 style={{ width: '100%', maxWidth: '800px', height: 'auto' }}
               />
            </picture> 
            */}
            <img
              src="/blog-images/solar-security-cameras-2026/infographic.webp"
              alt="תרשים: איך עובדות מצלמות סולאריות"
              style={{
                width: '100%',
                maxWidth: '800px',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            />
            <p style={{
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: '#666',
              fontStyle: 'italic'
            }}>
              מחזור האנרגיה במצלמת אבטחה סולארית
            </p>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            יתרונות מצלמות סולאריות על פני מצלמות רגילות
          </h2>

          <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '2rem', borderRadius: '8px', border: '1px solid #22c55e' }}>
              <h3 style={{ color: '#16a34a', marginTop: '0' }}>💰 חיסכון כלכלי משמעותי</h3>
              <ul style={{ paddingRight: '1rem' }}>
                <li><strong>אפס עלויות חשמל</strong> - חיסכון של ₪200-500 בשנה למצלמה</li>
                <li><strong>ללא צורך בחיווט</strong> - חיסכון של ₪1,500-3,000 בעבודות התקנה</li>
                <li><strong>תחזוקה מינימלית</strong> - ללא צורך בהחלפת כבלים או תיקוני חשמל</li>
                <li><strong>ROI מהיר</strong> - החזר השקעה תוך 2-3 שנים</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#fef3c7', padding: '2rem', borderRadius: '8px', border: '1px solid #eab308' }}>
              <h3 style={{ color: '#ca8a04', marginTop: '0' }}>🌍 ידידותיות לסביבה</h3>
              <ul style={{ paddingRight: '1rem' }}>
                <li><strong>אנרגיה מתחדשת 100%</strong> - אפס פליטת פחמן</li>
                <li><strong>הפחתת טביעת רגל אקולוגית</strong> - תרומה לסביבה נקייה</li>
                <li><strong>עצמאות אנרגטית</strong> - אי-תלות ברשת החשמל</li>
                <li><strong>עמידה בתקני ESG</strong> - מתאים לעסקים ירוקים</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#f0f9ff', padding: '2rem', borderRadius: '8px', border: '1px solid #3b82f6' }}>
              <h3 style={{ color: '#2563eb', marginTop: '0' }}>🔧 גמישות והתקנה קלה</h3>
              <ul style={{ paddingRight: '1rem' }}>
                <li><strong>התקנה במקומות מרוחקים</strong> - אין צורך בגישה לחשמל</li>
                <li><strong>ניידות מלאה</strong> - ניתן להזיז את המצלמה בקלות</li>
                <li><strong>התקנה עצמית</strong> - ללא צורך בחשמלאי מוסמך</li>
                <li><strong>מתאים לשטחים פתוחים</strong> - משקים, חניונים, אתרי בניה</li>
              </ul>
            </div>

            <div style={{ backgroundColor: '#fce7f3', padding: '2rem', borderRadius: '8px', border: '1px solid #ec4899' }}>
              <h3 style={{ color: '#be185d', marginTop: '0' }}>⚡ אמינות ורציפות</h3>
              <ul style={{ paddingRight: '1rem' }}>
                <li><strong>פעילות 24/7</strong> - גם בהפסקות חשמל</li>
                <li><strong>סוללת גיבוי</strong> - 3-7 ימי פעילה ללא שמש</li>
                <li><strong>עמידות במזג אוויר קיצוני</strong> - IP66/IP67 עמידות למים ואבק</li>
                <li><strong>אורך חיים ארוך</strong> - 5-10 שנים עם תחזוקה מינימלית</li>
              </ul>
            </div>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            סוגי מצלמות סולאריות - מה מתאים לכם?
          </h2>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '2rem',
            fontSize: '0.95rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#0070f3', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #ddd' }}>סוג מצלמה</th>
                <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #ddd' }}>מתאים ל...</th>
                <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #ddd' }}>טווח מחיר</th>
                <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #ddd' }}>יתרונות</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd', fontWeight: 'bold' }}>מצלמת Bullet סולארית</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>חניונים, שטחים פתוחים, כניסות</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>₪800-1,500</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>טווח ראייה ארוך, עמידות גבוהה</td>
              </tr>
              <tr>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd', fontWeight: 'bold' }}>מצלמת Dome סולארית</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>בתים, עסקים, מבנים</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>₪900-1,800</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>עיצוב דיסקרטי, זווית רחבה</td>
              </tr>
              <tr>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd', fontWeight: 'bold' }}>מצלמת PTZ סולארית</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>שטחים גדולים, מפעלים</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>₪2,500-5,000</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>סיבוב 360°, זום אופטי, מעקב אוטומטי</td>
              </tr>
              <tr>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd', fontWeight: 'bold' }}>מצלמה סולארית 4G</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>מקומות ללא WiFi, משקים</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>₪1,200-2,500</td>
                <td style={{ padding: '0.8rem', border: '1px solid #ddd' }}>חיבור סלולרי, עצמאות מלאה</td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            מפרט טכני - על מה לשים לב בבחירה
          </h2>

          <div style={{ backgroundColor: '#fef3c7', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h4 style={{ color: '#92400e', marginTop: '0' }}>✅ רשימת בדיקה לפני רכישה:</h4>
            <ul style={{ paddingRight: '1rem' }}>
              <li><strong>רזולוציה</strong>: מינימום 1080p, מומלץ 2K/4K לזיהוי פרטים</li>
              <li><strong>קיבולת סוללה</strong>: לפחות 10,000 mAh, מומלץ 15,000+ mAh</li>
              <li><strong>הספק פאנל</strong>: 5W מינימום, 10W לשימוש אינטנסיבי</li>
              <li><strong>ראיית לילה</strong>: IR עד 20 מטר לפחות, מומלץ ColorNight</li>
              <li><strong>זיהוי תנועה חכם</strong>: AI לזיהוי אנשים/רכבים, הפחתת אזעקות שווא</li>
              <li><strong>אחסון</strong>: תמיכה ב-SD card 128GB+, אופציה לענן</li>
              <li><strong>עמידות</strong>: דירוג IP66 לפחות, עמידות לטמפרטורות -20°C עד 60°C</li>
              <li><strong>חיבוריות</strong>: WiFi dual-band, אופציה ל-4G/LTE</li>
            </ul>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            התקנה נכונה - המדריך המלא
          </h2>

          <div style={{ backgroundColor: '#e0f2fe', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h4 style={{ color: '#0277bd', marginTop: '0' }}>שלבי התקנה מקצועית:</h4>
            <ol style={{ paddingRight: '1rem' }}>
              <li><strong>בחירת מיקום אופטימלי</strong>
                <ul>
                  <li>חשיפה לשמש: 4-6 שעות ביום לפחות</li>
                  <li>כיוון דרום/דרום-מערב לחשיפה מקסימלית</li>
                  <li>ללא הצללה מעצים או מבנים</li>
                  <li>גובה: 2.5-3 מטר לאבטחה אופטימלית</li>
                </ul>
              </li>
              <li><strong>התקנת הפאנל הסולארי</strong>
                <ul>
                  <li>זווית הטיה: 30-35 מעלות למקסימום יעילות</li>
                  <li>מרחק מהמצלמה: עד 3 מטר (תלוי באורך כבל)</li>
                  <li>הידוק חזק למניעת תזוזה ברוח</li>
                </ul>
              </li>
              <li><strong>הרכבת המצלמה</strong>
                <ul>
                  <li>חיבור כבל הפאנל למצלמה</li>
                  <li>כיוון המצלמה לאזור הרצוי</li>
                  <li>בדיקת זווית ראייה באפליקציה</li>
                </ul>
              </li>
              <li><strong>הגדרה וחיבור</strong>
                <ul>
                  <li>הורדת אפליקציה ייעודית</li>
                  <li>חיבור ל-WiFi או 4G</li>
                  <li>הגדרת התראות וזיהוי תנועה</li>
                  <li>בדיקת פעולה תקינה</li>
                </ul>
              </li>
            </ol>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            שאלות נפוצות ותשובות מקצועיות
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4 style={{ color: '#0070f3', marginTop: '0' }}>❓ האם מצלמות סולאריות עובדות גם בחורף?</h4>
              <p style={{ marginBottom: '0' }}>
                <strong>כן!</strong> גם בחורף יש מספיק אור שמש לטעינה. הסוללה מספקת 3-7 ימי גיבוי,
                כך שגם בתקופות מעוננות המצלמה ממשיכה לפעול. בישראל, עם כ-300 ימי שמש בשנה,
                מצלמות סולאריות פועלות ביעילות מקסימלית כל השנה.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4 style={{ color: '#0070f3', marginTop: '0' }}>❓ כמה זמן לוקח לטעון את הסוללה?</h4>
              <p style={{ marginBottom: '0' }}>
                פאנל סולארי סטנדרטי (5-10W) טוען סוללה ריקה ל-100% תוך <strong>4-6 שעות שמש ישירה</strong>.
                במצב תחזוקה (סוללה חלקית), הטעינה מתבצעת באופן רציף במהלך היום.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4 style={{ color: '#0070f3', marginTop: '0' }}>❓ מה קורה בהפסקת חשמל?</h4>
              <p style={{ marginBottom: '0' }}>
                זה היתרון הגדול! מצלמות סולאריות <strong>לא מושפעות מהפסקות חשמל</strong> כלל.
                הן פועלות באופן עצמאי לחלוטין ומספקות אבטחה רצופה גם כשהרשת מושבתת.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4 style={{ color: '#0070f3', marginTop: '0' }}>❓ האם צריך תחזוקה שוטפת?</h4>
              <p style={{ marginBottom: '0' }}>
                תחזוקה מינימלית: <strong>ניקוי הפאנל הסולארי פעם ב-3-6 חודשים</strong> (מים וסמרטוט רך),
                בדיקת חיבורים פעם בשנה. הסוללה מחזיקה 3-5 שנים ואז ניתן להחליף בקלות.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4 style={{ color: '#0070f3', marginTop: '0' }}>❓ מה המחיר הכולל להתקנה?</h4>
              <p style={{ marginBottom: '0' }}>
                <strong>מצלמה בודדת</strong>: ₪800-2,500 (תלוי במפרט)<br />
                <strong>מערכת 4 מצלמות</strong>: ₪3,500-8,000<br />
                <strong>התקנה מקצועית</strong>: ₪500-1,500<br />
                <strong>סה"כ להתקנה מלאה</strong>: ₪4,000-10,000 (מערכת 4 מצלמות)
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: '#0070f3',
            color: 'white',
            padding: '3rem',
            borderRadius: '12px',
            textAlign: 'center',
            marginTop: '4rem'
          }}>
            <h2 style={{ marginTop: '0', fontSize: '2rem' }}>מעוניינים במצלמות אבטחה סולאריות?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              הצוות המקצועי שלנו ב-Site-Control מתמחה בהתקנת מצלמות סולאריות<br />
              קבלו ייעוץ אישי, סקר מקצועי והצעת מחיר ללא התחייבות
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/contact" style={{
                backgroundColor: 'white',
                color: '#0070f3',
                padding: '1rem 2rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                צרו קשר לייעוץ חינם
              </a>
              <a href="/packages" style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '1rem 2rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                צפו בחבילות שלנו
              </a>
            </div>
          </div>

          <footer style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '2px solid #e5e7eb',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            <p>
              <strong>על המחברים:</strong> המאמר נכתב על ידי צוות המומחים של Site-Control,
              החברה המובילה בישראל להתקנת מערכות אבטחה סולאריות ומצלמות אבטחה מתקדמות.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <strong>נושאים קשורים:</strong>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {['מצלמות אבטחה סולאריות', 'מצלמות סולאריות לבית', 'מצלמות אבטחה ללא חשמל', 'מצלמות אבטחה עם פאנל סולארי', 'מצלמות אבטחה אלחוטיות', 'התקנת מצלמות סולאריות'].map(tag => (
                  <span key={tag} style={{
                    backgroundColor: '#f3f4f6',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}