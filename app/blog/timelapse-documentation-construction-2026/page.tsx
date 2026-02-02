import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תיעוד בנייה בטיימלאפס 2026 - המדריך המקצועי ליזמים וקבלנים | Site-Control',
  description: 'מדריך מקיף לתיעוד פרויקטי בנייה בטיימלאפס: חיסכון בעלויות, שיווק יזמי, בקרת איכות ותיעוד משפטי. גלו איך לתעד את הפרויקט שלכם מההתחלה ועד המסירה.',
  keywords: 'תיעוד בנייה, טיימלאפס בנייה, צילום אתר בנייה, תיעוד פרויקט בנייה, מצלמת טיימלאפס לבנייה, תיעוד התקדמות בנייה, צילום טיימלאפס מקצועי',
  openGraph: {
    title: 'תיעוד בנייה בטיימלאפס 2026 - המדריך המקצועי',
    description: 'כל מה שצריך לדעת על תיעוד פרויקטי בנייה בטיימלאפס - חיסכון, שיווק ובקרה',
    images: ['/blog-images/timelapse-documentation-construction-2026/hero.webp'],
  },
};

export default function BlogPage() {
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
        <div style={{ marginBottom: '3rem' }}>
          <img
            src="/blog-images/timelapse-documentation-construction-2026/hero.webp"
            alt="תיעוד בנייה בטיימלאפס - מבט על אתר בנייה"
            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 112, 243, 0.15)' }}
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0070f3' }}>
          תיעוד בנייה בטיימלאפס 2026 - המדריך המקצועי ליזמים וקבלנים
        </h1>

        <header style={{ marginBottom: '3rem', textAlign: 'center', borderBottom: '2px solid #0070f3', paddingBottom: '2rem' }}>
          <div style={{ color: '#666', fontSize: '1rem' }}>
            <span>מעודכן ל-2.2.2026</span> •
            <span> זמן קריאה: 10 דקות</span> •
            <span> תיעוד בנייה מקצועי</span>
          </div>
        </header>

        {/* Introduction */}
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: '500',
            color: '#0070f3',
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderLeft: '4px solid #0070f3',
            borderRadius: '0 8px 8px 0'
          }}>
            <strong>תיעוד בנייה</strong> הוא הכלי החשוב ביותר בניהול פרויקט מוצלח. עם טכנולוגיית <strong>טיימלאפס</strong> מתקדמת, 
            יזמים וקבלנים יכולים לעקוב, לתעד ולשווק את הפרויקט שלהם בצורה שלא הייתה אפשרית בעבר. 
            במדריך זה נסביר כיצד לנצל את הטכנולוגיה לחיסכון משמעותי בזמן ובכסף.
          </p>

          {/* Table of Contents */}
          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '3rem',
            border: '1px solid #0070f3'
          }}>
            <h3 style={{ color: '#0070f3', marginTop: 0 }}>📋 תוכן עניינים</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>• <a href="#why-documentation" style={{ color: '#0070f3' }}>למה תיעוד בנייה הכרחי ב-2026?</a></li>
              <li style={{ marginBottom: '0.5rem' }}>• <a href="#timelapse-benefits" style={{ color: '#0070f3' }}>יתרונות הטיימלאפס לתיעוד בנייה</a></li>
              <li style={{ marginBottom: '0.5rem' }}>• <a href="#use-cases" style={{ color: '#0070f3' }}>שימושים מעשיים בתיעוד בנייה</a></li>
              <li style={{ marginBottom: '0.5rem' }}>• <a href="#technology" style={{ color: '#0070f3' }}>הטכנולוגיה מאחורי מצלמות התיעוד</a></li>
              <li style={{ marginBottom: '0.5rem' }}>• <a href="#roi" style={{ color: '#0070f3' }}>החזר השקעה: המספרים מדברים</a></li>
              <li style={{ marginBottom: '0.5rem' }}>• <a href="#choosing" style={{ color: '#0070f3' }}>איך לבחור מערכת תיעוד נכונה?</a></li>
            </ul>
          </div>

          <h2 id="why-documentation" style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            🏗️ למה תיעוד בנייה הכרחי ב-2026?
          </h2>

          <p>
            בעולם הבנייה המודרני, <strong>תיעוד בנייה</strong> הפך מ"נחמד שיש" ל"חובה מוחלטת". 
            הדרישות הרגולטוריות, הציפיות של משקיעים והצורך בשקיפות מלאה הפכו את התיעוד לחלק בלתי נפרד מכל פרויקט.
          </p>

          <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div style={{ backgroundColor: '#fef3c7', padding: '1.5rem', borderRadius: '8px', border: '1px solid #f59e0b' }}>
              <h3 style={{ color: '#d97706', marginTop: '0', fontSize: '1.2rem' }}>⚖️ דרישות משפטיות</h3>
              <p style={{ marginBottom: 0 }}>
                <strong>תיעוד בנייה</strong> משמש כראיה משפטית במקרה של מחלוקות עם קבלני משנה, 
                תביעות ביטוח או סכסוכי גבולות. תיעוד רציף יכול לחסוך מיליוני שקלים בהוצאות משפט.
              </p>
            </div>
            <div style={{ backgroundColor: '#dcfce7', padding: '1.5rem', borderRadius: '8px', border: '1px solid #22c55e' }}>
              <h3 style={{ color: '#16a34a', marginTop: '0', fontSize: '1.2rem' }}>📊 בקרת איכות</h3>
              <p style={{ marginBottom: 0 }}>
                עם <strong>צילום טיימלאפס</strong> רציף, מנהלי פרויקטים יכולים לזהות ליקויים בזמן אמת, 
                לוודא עמידה בלוחות זמנים ולשפר את איכות הבנייה.
              </p>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #0070f3' }}>
              <h3 style={{ color: '#0070f3', marginTop: '0', fontSize: '1.2rem' }}>💰 שיווק ומכירות</h3>
              <p style={{ marginBottom: 0 }}>
                סרטון <strong>טיימלאפס בנייה</strong> מרשים הוא כלי השיווק היעיל ביותר ליזמים. 
                רוכשים פוטנציאליים רוצים לראות את ההתקדמות בעיניים.
              </p>
            </div>
          </div>

          <h2 id="timelapse-benefits" style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            🎬 יתרונות הטיימלאפס לתיעוד בנייה
          </h2>

          <p>
            טכנולוגיית <strong>טיימלאפס לבנייה</strong> מציעה יתרונות משמעותיים על פני שיטות תיעוד מסורתיות:
          </p>

          <div style={{ 
            backgroundColor: '#1a1a2e', 
            color: 'white', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '2rem' 
          }}>
            <h3 style={{ color: '#f97316', marginTop: 0 }}>🔄 תיעוד רציף 24/7</h3>
            <p>בניגוד לסיורים תקופתיים, <strong>מצלמת טיימלאפס לבנייה</strong> מתעדת כל רגע - ביום ובלילה, בשמש ובגשם.</p>
            
            <h3 style={{ color: '#f97316' }}>☁️ גיבוי אוטומטי בענן</h3>
            <p>כל תמונה שמצולמת עולה מיד לענן מאובטח. גם אם המצלמה נגנבת או נפגעת - <strong>תיעוד הבנייה</strong> שמור לנצח.</p>
            
            <h3 style={{ color: '#f97316' }}>📱 גישה מכל מקום</h3>
            <p>מנהלי פרויקטים יכולים לצפות ב<strong>תיעוד התקדמות הבנייה</strong> מהטלפון הנייד, מהבית או מהמשרד.</p>
            
            <h3 style={{ color: '#f97316', marginBottom: 0 }}>🤖 ניתוח AI חכם</h3>
            <p style={{ marginBottom: 0 }}>המערכת מזהה אוטומטית שינויים משמעותיים, מספרת כלי רכב ומייצרת דוחות התקדמות.</p>
          </div>

          <h2 id="use-cases" style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            🎯 שימושים מעשיים בתיעוד בנייה
          </h2>

          <div style={{ display: 'grid', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '1rem',
              padding: '1.5rem',
              backgroundColor: '#fff7ed',
              borderRadius: '8px',
              border: '1px solid #f97316'
            }}>
              <span style={{ fontSize: '2rem' }}>🏢</span>
              <div>
                <h4 style={{ color: '#ea580c', marginTop: 0, marginBottom: '0.5rem' }}>פרויקטי מגורים</h4>
                <p style={{ marginBottom: 0 }}>
                  <strong>תיעוד בנייה</strong> של בניינים ושכונות מגורים. סרטוני <strong>טיימלאפס</strong> משמשים לעדכון רוכשים, 
                  שיווק לרוכשים חדשים ותיעוד לביטוח.
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '1rem',
              padding: '1.5rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #22c55e'
            }}>
              <span style={{ fontSize: '2rem' }}>🏭</span>
              <div>
                <h4 style={{ color: '#16a34a', marginTop: 0, marginBottom: '0.5rem' }}>מבני תעשייה ולוגיסטיקה</h4>
                <p style={{ marginBottom: 0 }}>
                  מפעלים, מחסנים ומרכזים לוגיסטיים דורשים <strong>תיעוד פרויקט בנייה</strong> מדויק לצורך 
                  קבלת אישורים רגולטוריים ודיווח למשקיעים.
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '1rem',
              padding: '1.5rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #0070f3'
            }}>
              <span style={{ fontSize: '2rem' }}>🛣️</span>
              <div>
                <h4 style={{ color: '#0070f3', marginTop: 0, marginBottom: '0.5rem' }}>תשתיות ופרויקטים ציבוריים</h4>
                <p style={{ marginBottom: 0 }}>
                  כבישים, גשרים ומבני ציבור. <strong>צילום אתר בנייה</strong> רציף נדרש לבקרה ממשלתית 
                  ודיווח לציבור על התקדמות הפרויקט.
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '1rem',
              padding: '1.5rem',
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #f59e0b'
            }}>
              <span style={{ fontSize: '2rem' }}>☀️</span>
              <div>
                <h4 style={{ color: '#d97706', marginTop: 0, marginBottom: '0.5rem' }}>אנרגיה מתחדשת</h4>
                <p style={{ marginBottom: 0 }}>
                  חוות סולאריות וטורבינות רוח. <strong>תיעוד התקדמות בנייה</strong> חיוני לדיווח למשקיעים 
                  ולעמידה בתנאי מענקים ממשלתיים.
                </p>
              </div>
            </div>
          </div>

          <h2 id="technology" style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            ⚙️ הטכנולוגיה מאחורי מצלמות התיעוד
          </h2>

          <p>
            <strong>מצלמות טיימלאפס לבנייה</strong> של Site-Control הן יחידות אוטונומיות לחלוטין שפותחו במיוחד לתנאי אתרי בנייה:
          </p>

          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginBottom: '2rem',
            fontSize: '1rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#0070f3', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'right', borderRadius: '8px 0 0 0' }}>מאפיין</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderRadius: '0 8px 0 0' }}>פרטים</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}><strong>רזולוציה</strong></td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>4K/8K Ultra HD לתיעוד מפורט</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}><strong>אנרגיה</strong></td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>פאנל סולארי + סוללת גיבוי - ללא תלות בחשמל</td>
              </tr>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}><strong>תקשורת</strong></td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>4G/5G - העלאה אוטומטית לענן</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}><strong>עמידות</strong></td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>IP67 - עמידות מוחלטת למים ואבק</td>
              </tr>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}><strong>תדירות צילום</strong></td>
                <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>כל 5-15 דקות (ניתן להתאמה)</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem' }}><strong>אחסון בענן</strong></td>
                <td style={{ padding: '1rem' }}>ללא הגבלה - כל התמונות נשמרות לכל אורך הפרויקט</td>
              </tr>
            </tbody>
          </table>

          <h2 id="roi" style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            💵 החזר השקעה: המספרים מדברים
          </h2>

          <p>
            השקעה ב<strong>מערכת תיעוד בנייה</strong> מחזירה את עצמה במהירות. הנה נתונים מפרויקטים אמיתיים:
          </p>

          <div style={{ 
            background: 'linear-gradient(135deg, #0070f3 0%, #0050a3 100%)', 
            color: 'white', 
            padding: '2rem', 
            borderRadius: '12px', 
            marginBottom: '2rem' 
          }}>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>30%</div>
                <div>פחות מחלוקות עם קבלני משנה</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>15%</div>
                <div>שיפור בעמידה בלוחות זמנים</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>50%</div>
                <div>יותר פניות ממשקיעים (עם סרטון טיימלאפס)</div>
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#dcfce7',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '1px solid #22c55e'
          }}>
            <h4 style={{ color: '#16a34a', marginTop: 0 }}>💡 דוגמה מעשית</h4>
            <p style={{ marginBottom: 0 }}>
              פרויקט מגורים של 200 יחידות דיור שהשתמש ב<strong>תיעוד טיימלאפס</strong>: 
              היזם חסך ₪180,000 בהוצאות משפט בזכות תיעוד ברור של עיכוב שנגרם על ידי קבלן משנה. 
              בנוסף, סרטון ה<strong>טיימלאפס</strong> שהופק הביא ל-35 פניות נוספות של רוכשים פוטנציאליים.
            </p>
          </div>

          <h2 id="choosing" style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            ✅ איך לבחור מערכת תיעוד נכונה?
          </h2>

          <p>
            בבחירת <strong>מערכת תיעוד בנייה</strong>, יש לשים לב למספר פרמטרים קריטיים:
          </p>

          <ol style={{ paddingRight: '1.5rem' }}>
            <li style={{ marginBottom: '1rem' }}>
              <strong>אוטונומיות מלאה</strong> - המערכת חייבת לעבוד ללא תלות בחשמל או אינטרנט קווי. 
              <strong>מצלמות טיימלאפס סולאריות עם 4G</strong> הן הפתרון האידיאלי.
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong>איכות תמונה</strong> - רזולוציה של לפחות 4K נדרשת ל<strong>תיעוד בנייה</strong> איכותי 
              שישמש גם לשיווק וגם למטרות משפטיות.
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong>גיבוי בענן</strong> - כל התמונות חייבות לעלות אוטומטית לענן מאובטח. 
              אסור לסמוך על כרטיס זיכרון מקומי בלבד.
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong>פורטל ניהול</strong> - גישה נוחה לכל ה<strong>תיעוד</strong> דרך ממשק ווב או אפליקציה, 
              עם אפשרות לסנן לפי תאריך ושעה.
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong>הפקת סרטונים</strong> - שירות הפקת סרטוני <strong>טיימלאפס</strong> מקצועיים בסיום הפרויקט.
            </li>
          </ol>

          {/* FAQ Section */}
          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            ❓ שאלות נפוצות על תיעוד בנייה
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              borderRight: '4px solid #0070f3'
            }}>
              <h4 style={{ color: '#0070f3', marginTop: 0 }}>כמה עולה מערכת תיעוד בנייה?</h4>
              <p style={{ marginBottom: 0 }}>
                עלות <strong>מערכת תיעוד טיימלאפס</strong> נעה בין ₪500 ל-₪1,500 לחודש, תלוי במספר המצלמות 
                ורמת השירות. לפרויקט ממוצע של שנתיים, מדובר בהשקעה של כ-0.1% מעלות הפרויקט הכוללת.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              borderRight: '4px solid #0070f3'
            }}>
              <h4 style={{ color: '#0070f3', marginTop: 0 }}>האם אפשר להתקין מצלמת טיימלאפס בעצמי?</h4>
              <p style={{ marginBottom: 0 }}>
                כן, <strong>מצלמות הטיימלאפס</strong> שלנו מגיעות מוכנות לשימוש. ההתקנה פשוטה ולוקחת כ-30 דקות. 
                אנחנו גם מציעים התקנה מקצועית ללא עלות נוספת.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              marginBottom: '1rem',
              borderRight: '4px solid #0070f3'
            }}>
              <h4 style={{ color: '#0070f3', marginTop: 0 }}>כמה זמן לוקח לקבל את סרטון הטיימלאפס?</h4>
              <p style={{ marginBottom: 0 }}>
                סרטוני <strong>טיימלאפס</strong> מופקים תוך 7-14 ימי עסקים מסיום הפרויקט. 
                אפשר לקבל גם סרטוני ביניים במהלך הבנייה לצורכי שיווק.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px',
              borderRight: '4px solid #0070f3'
            }}>
              <h4 style={{ color: '#0070f3', marginTop: 0 }}>האם התיעוד קביל בבית משפט?</h4>
              <p style={{ marginBottom: 0 }}>
                כן. כל תמונה מתויגת בחותמת זמן מאומתת (timestamp) ונשמרת בענן מאובטח. 
                <strong>תיעוד הבנייה</strong> שלנו התקבל כראיה במאות תיקים משפטיים.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            color: 'white',
            padding: '3rem',
            borderRadius: '12px',
            marginTop: '4rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(249, 115, 22, 0.3)'
          }}>
            <h2 style={{ marginTop: '0', fontSize: '2rem', color: 'white' }}>מתחילים פרויקט בנייה חדש?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: '0.9' }}>
              אל תתחילו בלי <strong>מערכת תיעוד טיימלאפס</strong> מקצועית.<br />
              השאירו פרטים ונחזור אליכם תוך שעה עם הצעה מותאמת.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/contact" style={{
                backgroundColor: 'white',
                color: '#f97316',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'inline-block'
              }}>
                קבלו הצעת מחיר
              </a>
              <a href="tel:050-000-0000" style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                border: '2px solid white',
                display: 'inline-block'
              }}>
                📞 שיחת ייעוץ חינם
              </a>
            </div>
          </div>

          {/* Related Articles */}
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '2px solid #e5e7eb' }}>
            <h3 style={{ color: '#0070f3' }}>📚 מאמרים קשורים</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <a href="/blog/construction-site-timelapse-2026" style={{ color: '#0070f3', textDecoration: 'none' }}>
                  ← צילום טיימלאפס לאתרי בנייה 2026
                </a>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <a href="/blog/digital-documentation-construction-sites-2026" style={{ color: '#0070f3', textDecoration: 'none' }}>
                  ← תיעוד דיגיטלי לאתרי בנייה 2026
                </a>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <a href="/blog/4g-solar-security-cameras-remote-sites-2026" style={{ color: '#0070f3', textDecoration: 'none' }}>
                  ← מצלמות אבטחה 4G ללא חשמל 2026
                </a>
              </li>
            </ul>
          </div>

        </div>
      </article>
    </div>
  );
}
