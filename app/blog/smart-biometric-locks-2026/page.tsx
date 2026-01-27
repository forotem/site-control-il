import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מנעולים חכמים ביומטריים 2026 - המדריך המלא לדלת הכניסה | Site-Control',
  description: 'מדריך מקיף ועדכני ל-2026: איך בוחרים מנעול חכם ביומטרי? השוואת דגמים, יתרונות אבטחה, זיהוי פנים לעומת טביעת אצבע, ומדריך התקנה מלא.',
  keywords: 'מנעול חכם ביומטרי, מנעול טביעת אצבע לדלת, מנעול חכם לדלת כניסה, מנעול חכם עם מצלמה, התקנת מנעול חכם, אבטחת בית חכם, מנעול פלדלת חכם',
  openGraph: {
    title: 'מנעולים חכמים ביומטריים 2026 - המדריך המלא',
    description: 'כל מה שרציתם לדעת על מנעולים חכמים: אבטחה, נוחות, ומחירים משתלמים.',
    images: ['/blog-images/smart-biometric-locks-2026/hero.webp'],
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
            src="/blog-images/smart-biometric-locks-2026/hero.webp"
            alt="מנעולים חכמים ביומטריים 2026 - המדריך המלא לדלת הכניסה"
            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 112, 243, 0.15)' }}
          />
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0070f3' }}>
          מנעולים חכמים ביומטריים 2026 - המדריך המלא לדלת הכניסה
        </h1>

        <header style={{ marginBottom: '3rem', textAlign: 'center', borderBottom: '2px solid #0070f3', paddingBottom: '2rem' }}>
          <div style={{ color: '#666', fontSize: '1rem' }}>
            <span>מעודכן ל-27.1.2026</span> •
            <span> זמן קריאה: 12 דקות</span> •
            <span> מדריך מקצועי</span>
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
            שנת 2026 מסמנת את סוף עידן המפתח הפיזי.
            מנעולים ביומטריים חכמים הפכו לסטנדרט החדש בבתים בישראל, ומציעים שילוב מושלם של נוחות, אבטחה מתקדמת ושליטה מלאה.
            במדריך זה נסקור את כל מה שצריך לדעת לפני שמשדרגים את דלת הכניסה.
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
              <li><strong>למה כולם עוברים למנעולים חכמים ב-2026?</strong></li>
              <li><strong>איך זה עובד? טביעת אצבע, זיהוי פנים ומה שביניהם</strong></li>
              <li><strong>השוואת הדגמים המובילים בישראל</strong></li>
              <li><strong>אבטחה וסייבר - האם זה באמת בטוח?</strong></li>
              <li><strong>מדריך התקנה (והאם אפשר לבד?)</strong></li>
              <li><strong>מחירים ועלויות נלוות</strong></li>
              <li><strong>שאלות נפוצות</strong></li>
            </ol>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            1. למה כולם עוברים למנעולים חכמים ב-2026?
          </h2>

          <p>
            אם פעם מנעול חכם היה גאדג'ט ל"משוגעים לדבר" בלבד, היום הוא מוצר צריכה בסיסי בכל בית מודרני.
            השילוב של טכנולוגיה בשלה, מחירים נגישים וצורך גובר באבטחה אישית הפך את המנעול הביומטרי לפתרון המועדף.
          </p>

          <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: '8px', border: '1px solid #22c55e' }}>
              <h3 style={{ color: '#16a34a', marginTop: '0', fontSize: '1.2rem' }}>🔑 נוחות (Convenience)</h3>
              <p>שכחתם מפתח? אין בעיה. הילדים חזרו מוקדם? הדלת פתוחה עבורם. הידיים עמוסות בקניות? הדלת נפתחת בזיהוי פנים.</p>
            </div>
            <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #3b82f6' }}>
              <h3 style={{ color: '#2563eb', marginTop: '0', fontSize: '1.2rem' }}>🛡️ אבטחה משופרת</h3>
              <p>מפתחות אפשר לגנוב או לשכפל בקלות. טביעת אצבע או תווי פנים הם ייחודיים לכם וכמעט בלתי ניתנים לזיוף.</p>
            </div>
            <div style={{ backgroundColor: '#fef3c7', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eab308' }}>
              <h3 style={{ color: '#ca8a04', marginTop: '0', fontSize: '1.2rem' }}>📱 שליטה ובקרה</h3>
              <p>קבלו התראה לנייד בכל פתיחה של הדלת. דעו בדיוק מי נכנס ומתי, ונעלו את הדלת מרחוק אם שכחתם.</p>
            </div>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            2. איך זה עובד? השיטות המובילות לפתיחה
          </h2>

          <p>המנעולים של 2026 לא מסתמכים על שיטה אחת, אלא מציעים מגוון אפשרויות גישה לנוחות מקסימלית:</p>

          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1.5rem', paddingRight: '1rem', borderRight: '4px solid #10b981', backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>👆 טביעת אצבע ביומטרית (Fingerprint)</h3>
              <p style={{ margin: 0 }}>השיטה הנפוצה ביותר. חיישנים קרמיים מתקדמים מגיבים תוך 0.3 שמניות ומזהים גם אצבעות רטובות או של ילדים וקשישים בדיוק גבוה.</p>
            </li>
            <li style={{ marginBottom: '1.5rem', paddingRight: '1rem', borderRight: '4px solid #3b82f6', backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>👤 זיהוי פנים תלת-ממדי (3D Face ID)</h3>
              <p style={{ margin: 0 }}>הטכנולוגיה המתקדמת ביותר. מצלמות אינפרא-אדום (IR) ממפות את הפנים בתלת-ממד, כך שתמונה לא תעבוד. המנעול מזהה אתכם ממרחק ופותח את הדלת ללא מגע.</p>
            </li>
            <li style={{ marginBottom: '1.5rem', paddingRight: '1rem', borderRight: '4px solid #8b5cf6', backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>🔢 קוד אישי (Pin Code)</h3>
              <p style={{ margin: 0 }}>פתרון גיבוי אמין. ניתן להפיק קודים קבועים לבני הבית, וקודים חד-פעמיים לשליחים או אורחים שנמחקים אוטומטית לאחר השימוש.</p>
            </li>
            <li style={{ marginBottom: '1.5rem', paddingRight: '1rem', borderRight: '4px solid #ec4899', backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>📱 אפליקציה וקרבה (Proximity)</h3>
              <p style={{ margin: 0 }}>פתיחה בלחיצת כפתור באפליקציה, או פתיחה אוטומטית כשהטלפון בכיס (באמצעות Bluetooth משופר).</p>
            </li>
          </ul>

          {/* Infographic Image */}
          <div style={{ margin: '4rem 0', textAlign: 'center' }}>
            <img
              src="/blog-images/smart-biometric-locks-2026/infographic.webp"
              alt="אינפוגרפיק שיטות פתיחה מתקדמות"
              style={{ width: '100%', maxWidth: '800px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>תרשים: 4 שיטות הפתיחה המובילות במנעולים חכמים 2026</p>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            3. השוואת סוגי מנעולים
          </h2>

          <p>לא כל המנעולים נולדו שווים. חשוב להתאים את המנעול לסוג הדלת ולצרכים שלכם:</p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0070f3', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'right', borderRadius: '0 8px 0 0' }}>סוג מנעול</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>תכונות מפתח</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>מחיר ממוצע</th>
                  <th style={{ padding: '1rem', textAlign: 'right', borderRadius: '8px 0 0 0' }}>מתאים ל...</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: '#fff' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>מנעול "הלבשה" (Retrofit)</td>
                  <td style={{ padding: '1rem' }}>מתלבש על הצילינדר הקיים, התקנה פשוטה, מבחוץ נראה רגיל</td>
                  <td style={{ padding: '1rem' }}>₪800 - ₪1,500</td>
                  <td style={{ padding: '1rem' }}>שוכרי דירות, בתים משותפים</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: '#f9fafb' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>ידית חכמה מלאה (Push-Pull)</td>
                  <td style={{ padding: '1rem' }}>מחליף את כל הידית והמנגנון, עיצוב יוקרתי, חיישן טביעת אצבע בידית</td>
                  <td style={{ padding: '1rem' }}>₪1,800 - ₪3,500</td>
                  <td style={{ padding: '1rem' }}>בעלי דירות, משפצים</td>
                </tr>
                <tr style={{ backgroundColor: '#fff' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>מנעול משולב מצלמה</td>
                  <td style={{ padding: '1rem' }}>מנעול + אינטרקום וידאו + פעמון חכם במכשיר אחד</td>
                  <td style={{ padding: '1rem' }}>₪2,500 - ₪4,800</td>
                  <td style={{ padding: '1rem' }}>בתים פרטיים, וילות</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            4. אבטחה וסייבר - האם זה באמת בטוח?
          </h2>

          <div style={{ backgroundColor: '#fef2f2', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #ef4444' }}>
            <h3 style={{ color: '#b91c1c', marginTop: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🚫</span> מיתוס מול מציאות
            </h3>
            <p><strong>מיתוס:</strong> "האקרים יכולים לפרוץ לי לבית דרך המחשב."</p>
            <p><strong>מציאות:</strong> פריצה פיזית (כמו קידוח צילינדר או פריצת דלת בלום) עדיין קלה ונפוצה פי 100 מפריצת סייבר למנעול מוצפן.</p>
            <hr style={{ border: 'none', borderTop: '1px solid #fecaca', margin: '1rem 0' }} />
            <p style={{ margin: 0 }}>
              המנעולים המודרניים בשנת 2026 משתמשים בהצפנת <strong>AES-256</strong> (רמה צבאית/בנקאית). בנוסף, לרוב הדגמים המובילים יש מנגנון נעילה פיזי (Deadbolt) שנכנס לפעולה ומנוע פריצה גם אם המערכת האלקטרונית נפגעת. המידע הביומטרי שלכם נשמר מוצפן מקומית על המנעול ולא עולה לענן, לפרטיות מירבית.
            </p>
          </div>

          <h2 style={{ color: '#0070f3', fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
            5. שאלות נפוצות
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h4 style={{ color: '#0070f3', marginTop: '0', fontSize: '1.1rem' }}>❓ מה קורה אם נגמרת הסוללה?</h4>
              <p style={{ margin: 0 }}>לכל המנעולים יש התראת סוללה חלשה שבועות מראש (באפליקציה ועל המנעול). בחירום, יש תמיד שתי אפשרויות גיבוי: מפתח פיזי מכני מוסתר, או שקע USB-C חיצוני לחיבור סוללת גיבוי (Power Bank) להפעלה זמנית לצורך פתיחה.</p>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h4 style={{ color: '#0070f3', marginTop: '0', fontSize: '1.1rem' }}>❓ האם זה עובד בשבת?</h4>
              <p style={{ margin: 0 }}>כן! רוב המנעולים המיובאים לישראל כיום מגיעים עם "מצב שבת" ייעודי (מכני בלבד) שמאושר על ידי מכון צומת. במצב זה המנעול מתפקד כמנעול מכני רגיל ללא חילול שבת.</p>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h4 style={{ color: '#0070f3', marginTop: '0', fontSize: '1.1rem' }}>❓ האם זה מתאים לדלת רב-בריח / פלדלת?</h4>
              <p style={{ margin: 0 }}>בהחלט. השוק הישראלי ייחודי עם דלתות הפלדה שלו, ולכן היבואנים מתאימים את המנעולים למנגנונים הרב-בריחיים הנפוצים בארץ. חשוב לוודא בעת הרכישה שהדגם מותאם ל"תקן ישראלי".</p>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            background: 'linear-gradient(135deg, #0070f3 0%, #00d4ff 100%)',
            color: 'white',
            padding: '3rem',
            borderRadius: '12px',
            marginTop: '4rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 112, 243, 0.3)'
          }}>
            <h2 style={{ marginTop: '0', fontSize: '2rem', color: 'white' }}>שדרגו את הכניסה לבית עוד היום</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: '0.9' }}>
              הצוות המקצועי שלנו ב-Site-Control מתמחה בהתאמה והתקנה של מנעולים חכמים.<br />
              השאירו פרטים ונחזור אליכם עם הצעה משתלמת במיוחד למנעול המתאים בדיוק לדלת שלכם.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/contact" style={{
                backgroundColor: 'white',
                color: '#0070f3',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                display: 'inline-block'
              }}>
                ייעוץ והתקנה
              </a>
              <a href="/services" style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                display: 'inline-block'
              }}>
                לכל השירותים
              </a>
            </div>
          </div>

        </div>
      </article>
    </div>
  );
}