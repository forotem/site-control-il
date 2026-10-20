import { Metadata } from 'next';

const SLUG = 'smart-alarm-vs-security-cameras-2026';
const CANONICAL = `https://www.site-control-il.com/blog/${SLUG}`;
const HERO = `https://www.site-control-il.com/blog-images/${SLUG}/hero-v2.webp`;
const SEO_TITLE = 'אזעקה או מצלמות אבטחה: מה עדיף לבית ולעסק? | Site-Control';
const SHARE_TITLE = 'אזעקה או מצלמות אבטחה: מה עדיף לבית ולעסק?';
const H1 = 'אזעקה או מצלמות אבטחה: מה עדיף לבית ולעסק, ומתי כדאי לשלב את שתיהן';
const DESCRIPTION =
  'אזעקה מגלה פריצה ויכולה להזעיק מוקד, מצלמות מראות ומתעדות מה קרה. מה כל אחת עושה, מתי מספיקה אחת, ולמה הרבה בתים ועסקים משלבים את שתיהן.';
const KEYWORDS = [
  'מערכת אזעקה או מצלמות',
  'אזעקה או מצלמות אבטחה מה עדיף',
  'מצלמת אבטחה עם סירנה',
  'אזעקה לבית פרטי',
  'מצלמות אבטחה לעסק',
  'מערכת אבטחה משולבת',
  'אזעקה מחוברת למוקד',
];
const PUBLISHED = '2026-01-27';
const MODIFIED = '2026-10-17';
const HERO_ALT = 'לוח מקשים של אזעקה ליד דלת הכניסה, ומצלמת אבטחה עם זרקור בכניסה לבית';

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: 'צוות Site-Control', url: 'https://www.site-control-il.com' }],
  openGraph: {
    title: SHARE_TITLE,
    description: DESCRIPTION,
    type: 'article',
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    locale: 'he_IL',
    siteName: 'Site-Control',
    url: CANONICAL,
    images: [
      {
        url: HERO,
        width: 1200,
        height: 593,
        alt: HERO_ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SHARE_TITLE,
    description: DESCRIPTION,
    images: [HERO],
  },
  alternates: {
    canonical: CANONICAL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: 'האם מצלמות אבטחה יכולות להחליף אזעקה?',
    a: 'לא לגמרי. מצלמה עם סירנה ואור מהבהב יכולה להרתיע ולשלוח לכם התראה לנייד, אבל אם לא ראיתם את ההתראה, אף אחד לא מגיב. אזעקה שמחוברת למוקד מעבירה את האירוע לאנשים שזה התפקיד שלהם. אם חשוב לכם שתהיה תגובה גם כשאתם לא זמינים, או שחברת הביטוח דורשת אזעקה, מצלמות לבד לא יספיקו.',
  },
  {
    q: 'מה עדיף לעסק: אזעקה או מצלמות?',
    a: 'בהרבה עסקים התשובה היא שתיהן, כי כל אחת עובדת בשעות אחרות. בשעות הפתיחה האזעקה מנוטרלת, והמצלמות הן מה שמתעד את הקופה, הכניסה והמחסן. כשהעסק סגור, אזעקה עם מוקד מגיבה לכניסה, והמצלמות מראות מה קרה ומי היה שם. אם יש דרישה של חברת הביטוח, היא זו שקובעת את המינימום.',
  },
  {
    q: 'אילו מצלמות אצלכם כוללות הרתעה של אור וקול?',
    a: 'למשל, במצלמות הקוויות (PoE): Hikvision DS-2CD2047G2H-LIU/SL ו-Hikvision DS-2CD2387G2H-LISU/SL, עם אור מהבהב, התרעה קולית ושמע דו-כיווני. במצלמות ה-Wi-Fi: Tenda CT3 עם אזעקת קול ואור, ו-Reolink Lumus עם זרקור לבן וסירנה. יש בחנות עוד דגמים עם אור מהבהב, סירנה או זרקור, והמחיר העדכני מופיע בדף של כל מוצר.',
  },
  {
    q: 'חברת הביטוח דורשת אזעקה עם מוקד. מצלמות יספיקו?',
    a: 'רק אם חברת הביטוח אישרה את זה בכתב. דרישה כזאת מופיעה בדרך כלל בפוליסה או בהצעה לביטוח, ומצלמות לא נחשבות אוטומטית לתחליף. בקשו מהסוכן לפרט בכתב מה בדיוק נדרש. אם תרצו מצלמות בנוסף לאזעקה, שלחו לנו את המסמך ונתאים את המערכת אליו.',
  },
  {
    q: 'איך מונעים התראות שווא ממצלמות עם סירנה?',
    a: 'מגדירים זיהוי של אדם או רכב במקום כל תנועה, מסמנים אזור זיהוי שלא כולל את המדרכה ועצים שזזים ברוח, ומפעילים את הסירנה רק בשעות שבהן לא אמור להיות אף אחד בחוץ. כדאי גם לנקות מדי פעם קורי עכביש מול העדשה, כי בלילה המצלמה רואה בהם תנועה.',
  },
  {
    q: 'יש תשלום חודשי על אזעקה או על מצלמות?',
    a: 'על מערכת מצלמות עם מקליט לא חייב: ההקלטות נשמרות אצלכם בבית, והצפייה מהנייד דרך האפליקציה בלי מנוי. על אזעקה שמחוברת למוקד יש בדרך כלל דמי מנוי חודשיים, לפי החוזה עם חברת המוקד. אזעקה שמתריעה רק לטלפון שלכם יכולה לעבוד בלי מוקד.',
  },
];

const BODY_HTML = `<nav style="background: rgba(15,52,96,0.05); padding: 1.25rem 1.5rem; border-radius: 10px; margin-bottom: 2rem;"><strong>תוכן העניינים</strong><ul style="margin-top: 0.5rem;"><li><a href="#short-answer">התשובה הקצרה</a></li><li><a href="#alarm">מה אזעקה עושה, ומה היא לא עושה</a></li><li><a href="#cameras">מה מצלמות עושות, ומה הן לא עושות</a></li><li><a href="#compare">טבלת השוואה</a></li><li><a href="#when">מתי מספיקה אחת מהן</a></li><li><a href="#combine">למה הרבה משלבים את שתיהן</a></li><li><a href="#deterrence">מצלמות עם הרתעה: אור, סירנה ודיבור</a></li><li><a href="#insurance">ביטוח ומוקד: מה לבדוק לפני שקונים</a></li><li><a href="#false-alarms">אזעקות שווא בשתי המערכות</a></li><li><a href="#scenarios">ארבעה מצבים נפוצים</a></li><li><a href="#us">מה אנחנו עושים, ומה לא</a></li></ul></nav>

<p>אזעקה או מצלמות? השאלה הזאת עולה כמעט בכל שיחה על אבטחה לבית או לעסק, ובדרך כלל מתוך הנחה שצריך לבחור אחת מהן. בפועל אלה שני כלים שעושים עבודות שונות. אזעקה נועדה לגלות שמישהו נכנס ולהזעיק תגובה. מצלמה נועדה לראות מה קורה, לשמור תיעוד ולהרתיע מראש.</p>

<p>כדאי שתדעו מההתחלה: אנחנו ב-Site-Control מוכרים ומתקינים מצלמות, מקליטים ואינטרקום. מערכות אזעקה אנחנו לא מוכרים. לכן ננסה לתאר את שני הצדדים בהגינות, כולל המקרים שבהם אזעקה היא בדיוק מה שאתם צריכים, ומצלמות לא יחליפו אותה.</p>

<h2 id="short-answer">התשובה הקצרה</h2>

<ul>
<li><strong>אם חשוב לכם שמישהו יגיב</strong> כשנכנסים לבית ריק, גם כשאתם בטיסה או ישנים, אזעקה שמחוברת למוקד עושה את זה טוב יותר ממצלמה.</li>
<li><strong>אם חשוב לכם לדעת מה קרה</strong>, לראות מי עומד בשער, לשמור הוכחות או להרתיע לפני שמישהו מתקרב לדלת, מצלמות עושות את זה, ואזעקה לא.</li>
<li><strong>בעסק עם מלאי, בבית שעומד ריק הרבה זמן, או כשחברת הביטוח דורשת אזעקה</strong>, השילוב של שתיהן הוא בדרך כלל התשובה הנכונה.</li>
</ul>

<h2 id="alarm">מה אזעקה עושה, ומה היא לא עושה</h2>

<p>מערכת אזעקה לגילוי פריצה בנויה מרכזת שמנהלת את המערכת, מגלאים, מלוח מקשים או אפליקציה שבעזרתם דורכים ומנטרלים, ומצופר. הגלאים הנפוצים הם גלאי תנועה בתוך החדרים ומגעים מגנטיים על דלתות וחלונות, שמגלים פתיחה.</p>

<p>כשהמערכת דרוכה וגלאי מזהה כניסה, הרכזת מפעילה את הצופר ושולחת הודעה. לאן ההודעה מגיעה תלוי בשירות שבחרתם: לטלפון שלכם, לבני המשפחה, או למוקד. במוקד יושבים אנשים שמקבלים את האירוע ומטפלים בו לפי מה שסוכם איתכם מראש, למשל שיחה אליכם או שליחת סייר. מה בדיוק המוקד עושה, תוך כמה זמן ובאיזו עלות, נקבע בחוזה מול חברת המוקד.</p>

<h3>היתרונות של אזעקה</h3>
<ul>
<li>מגלה כניסה גם בחושך מוחלט וגם בחדר שאין בו מצלמה.</li>
<li>הצופר מבהיל את מי שנכנס, ומודיע לשכנים שמשהו קורה.</li>
<li>עם מוקד יש מי שמגיב גם כשאתם לא זמינים.</li>
<li>לא מצלמת את בני הבית. בתוך הבית זה יתרון אמיתי.</li>
</ul>

<h3>החולשות של אזעקה</h3>
<ul>
<li><strong>לא מראה מה קרה.</strong> אחרי אירוע יודעים איזה גלאי הופעל ובאיזו שעה, אבל לא מי נכנס ומה הוא לקח.</li>
<li><strong>עובדת רק כשהיא דרוכה.</strong> ביום, כשיש אנשים בבית או כשהעסק פתוח, היא מנוטרלת ולא מתעדת כלום.</li>
<li><strong>מגיבה אחרי שמישהו כבר פתח דלת או חלון.</strong> יש גם גלאים לחוץ, אבל בחוץ הם חשופים יותר לחתולים, לעלים ולרוח, ולכן בדרך כלל האזעקה מגינה בעיקר על הפנים ועל הפתחים.</li>
<li><strong>מוקד הוא הוצאה חודשית קבועה,</strong> בנוסף להתקנה.</li>
</ul>

<h2 id="cameras">מה מצלמות עושות, ומה הן לא עושות</h2>

<p>מערכת מצלמות בנויה ממצלמות שמקליטות למקליט (NVR) או לכרטיס זיכרון בתוך המצלמה, ומאפליקציה בנייד שמחברת את הכול. היא עובדת כל הזמן, לא רק כשמישהו דרך אותה.</p>

<h3>היתרונות של מצלמות</h3>
<ul>
<li><strong>רואים מה קורה,</strong> בזמן אמת ובהקלטה: מי עמד בשער, איזה רכב נכנס, מה בדיוק נלקח.</li>
<li><strong>תיעוד שאפשר למסור</strong> למשטרה או לחברת הביטוח אחרי אירוע.</li>
<li><strong>הרתעה לפני הכניסה.</strong> מצלמה גלויה, ובמיוחד כזאת שמדליקה אור או משמיעה קול, גורמת לחלק מהאנשים לוותר עוד לפני שניסו.</li>
<li><strong>מכסות את מה שבחוץ:</strong> חצר, חניה, שער, מחסן כלים, ובעסק גם קופה ודלפק.</li>
<li><strong>שימוש יומיומי:</strong> לראות שהילדים הגיעו הביתה, לבדוק מי צלצל בשער, לוודא שהעסק נסגר כמו שצריך.</li>
<li><strong>התראה לנייד</strong> כשיש תנועה, ובדגמים שתומכים בזה, רק כשהמצלמה מזהה אדם או רכב.</li>
</ul>

<h3>החולשות של מצלמות</h3>
<ul>
<li><strong>מצלמה לבד לא מזעיקה אף אחד.</strong> ההתראה מגיעה אליכם. אם הטלפון בשקט, אף אחד לא מגיב.</li>
<li><strong>רואה רק את מה שבשדה הראייה שלה.</strong> פינה בלי מצלמה נשארת פינה מתה.</li>
<li><strong>צריכה חשמל,</strong> ומצלמות Wi-Fi צריכות גם ראוטר שעובד וקליטה טובה בנקודה.</li>
<li><strong>פרטיות.</strong> בתוך הבית היא מצלמת גם את בני המשפחה, ומצלמה שמכוונת לרחוב, לשכנים או לחדר מדרגות משותף מחייבת זהירות. פירטנו את זה ב<a href="/blog/privacy-law-amendment-13-cameras-2026">מדריך על חוק הגנת הפרטיות ומצלמות</a>.</li>
</ul>

<h2 id="compare">טבלת השוואה</h2>

<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; margin: 1rem 0;"><thead><tr style="background: #0f3460; color: #fff;"><th style="padding: 10px; text-align: right;">נושא</th><th style="padding: 10px; text-align: right;">אזעקה</th><th style="padding: 10px; text-align: right;">מצלמות</th></tr></thead><tbody>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 120px;"><strong>מה קורה כשמישהו נכנס</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">צופר והודעה למוקד או לנייד</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">הקלטה והתראה לנייד. בדגמים עם הרתעה גם אור וסירנה</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 120px;"><strong>תיעוד</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">רשימת אירועים: איזה גלאי ומתי</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">וידאו, לפי נפח האחסון</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 120px;"><strong>הרתעה</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">שלט וצופר, בעיקר אחרי שנכנסו</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">מצלמה גלויה, ובדגמים מסוימים אור וקול כבר בחצר</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 120px;"><strong>איפה היא חזקה</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">בתוך המבנה ועל הפתחים</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">חצר, חניה, שער, מחסן, קופה</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 120px;"><strong>מי מגיב</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">המוקד, אם יש מנוי</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">אתם, מהאפליקציה</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 120px;"><strong>מתי פעילה</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">רק כשהיא דרוכה</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">כל הזמן. את ההתראות אפשר לתזמן</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 120px;"><strong>תשלום חודשי</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">בדרך כלל, על שירות המוקד</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">לא חובה. מקליט שומר הכול בבית</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 120px;"><strong>פרטיות בבית</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">לא מצלמת</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">מצלמת את מה שבשדה הראייה</td></tr>
</tbody></table></div>

<h2 id="when">מתי מספיקה אחת מהן</h2>

<h3>מתי אזעקה לבד יכולה להספיק</h3>
<ul>
<li>דירה שהכניסה אליה היא דלת אחת וכמה חלונות, ושהחשש העיקרי בה הוא פריצה כשאף אחד לא בבית.</li>
<li>מי שלא רוצה מצלמות בתוך הבית, מסיבות של פרטיות.</li>
<li>כשחברת הביטוח דורשת אזעקה שמחוברת למוקד. במצב כזה מצלמות לא יחליפו אותה, גם אם הן טובות מאוד.</li>
</ul>

<h3>מתי מצלמות לבד יכולות להספיק</h3>
<ul>
<li>בית פרטי שרוב מה שקורה בו קורה בחוץ: שער, חניה, חצר, מחסן כלים, ובית שתמיד יש בו מישהו.</li>
<li>עסק שרוצה לראות מה קורה בשעות הפעילות: קופה, כניסה ומחסן. בשעות האלה אזעקה ממילא מנוטרלת.</li>
<li>מי שצריך בעיקר הוכחות: נזק לרכב בחניה, חבילה שנעלמה מהדלת, ויכוח על מה בדיוק קרה.</li>
<li>מקום בלי חשמל ובלי אינטרנט, כמו מחסן בשדה או אתר בנייה, שבו אזעקה רגילה לא תמיד מעשית, ומצלמת 4G סולארית שולחת התראות לנייד כשיש תנועה.</li>
</ul>

<h2 id="combine">למה הרבה משלבים את שתיהן</h2>

<p>השילוב עובד כי כל מערכת מכסה את החולשה של השנייה. כך זה נראה בפועל:</p>

<ul>
<li><strong>בחוץ מרתיעים, בפנים מגלים.</strong> המצלמות שומרות על החצר, השער והחניה. האזעקה מגלה כניסה לבית ומזעיקה את המוקד.</li>
<li><strong>בודקים לפני שנבהלים.</strong> כשהאזעקה מופעלת באמצע הלילה, אפשר לפתוח את האפליקציה ולראות אם זה פורץ או חתול, לפני שנוסעים הביתה או מבקשים מהשכן לגשת.</li>
<li><strong>שעות היום מכוסות.</strong> כשהאזעקה מנוטרלת, המצלמות ממשיכות להקליט.</li>
<li><strong>תמונה מלאה אחרי אירוע.</strong> יומן האזעקה אומר מתי ואיפה. ההקלטה מראה מי, איך ומה נלקח.</li>
</ul>

<p>המערכות לא חייבות לדבר זו עם זו כדי שהשילוב יעבוד. בהרבה בתים יש פשוט שתי אפליקציות. מי שרוצה חיבור פיזי ביניהן יכול לבחור מצלמה עם כניסה ויציאה של אזעקה, כמו <a href="/store/ds-2cd2387g2h-lisu-sl-2-8mm">Hikvision DS-2CD2387G2H-LISU/SL</a>: לפי המפרט של היצרן יש לה כניסת אזעקה אחת ויציאה אחת, שדרכן אפשר לקשר אותה לרכיב חיצוני. את החיבור עצמו בודקים מול סוג הרכזת שמותקנת אצלכם, יחד עם חברת האזעקה.</p>

<p>עוד דבר קטן שעושה הבדל גדול: אם המקליט, הראוטר ומתג ה-PoE (אם יש) מחוברים לאל-פסק (UPS), מצלמות ה-PoE שמקבלות מהם חשמל ממשיכות לעבוד גם בהפסקת חשמל קצרה. מצלמת Wi-Fi שמחוברת לשקע רגיל תיכבה, אלא אם גם השקע שלה מגובה. לרוב רכזות האזעקה יש סוללת גיבוי משלהן, אבל למצלמות צריך לדאוג בנפרד.</p>

<h2 id="deterrence">מצלמות עם הרתעה: אור, סירנה ודיבור</h2>

<p>יש מצלמות שעושות חלק ממה שאזעקה עושה: כשהן מזהות אדם באזור שהגדרתם, הן מדליקות אור, מפעילות סירנה או משמיעות הודעה קולית, ושולחות לכם התראה. זה לא מחליף אזעקה עם מוקד, אבל זה מוסיף משהו שאזעקה רגילה בדרך כלל לא נותנת: הרתעה בחוץ, לפני שמישהו הגיע לדלת. כמה דגמים מהחנות שהמפרט שלהם כולל את זה:</p>

<ul>
<li><strong><a href="/store/ds-2cd2047g2h-liu-sl-2-8mm">Hikvision DS-2CD2047G2H-LIU/SL</a></strong>: מצלמת מיני-צינור 4MP בכבל רשת (PoE). לפי המפרט של היצרן יש לה אור מהבהב והתרעה קולית להרחקת פורצים, שמע דו-כיווני, סיווג של אדם ורכב, ותאורה היברידית שנותנת צבע בלילה עד 40 מטר. מתאימה לשער, לחניה ולחצר.</li>
<li><strong>Hikvision DS-2CD2387G2H-LISU/SL</strong>: מצלמת טורט 8MP בכבל רשת, עם אור מהבהב, אזעקה קולית, מיקרופון ורמקול, וכאמור גם כניסה ויציאה של אזעקה. מתאימה לקיר מתחת לגג או לתקרה של מרפסת.</li>
<li><strong><a href="/store/ct3">Tenda CT3</a></strong>: מצלמת צינור Wi-Fi ב-1080p, עם שני זרקורים ושתי נורות אינפרא. לפי המפרט של Tenda, כשהיא מזהה חדירה בשעות שהגדרתם היא מפעילה אזעקת קול ואור ושולחת הודעה לנייד. יש לה שמע דו-כיווני, ואפשר להקליט בה עד שלוש הודעות קוליות משלכם, למשל אזהרה.</li>
<li><strong><a href="/store/reolink-lumus-e430">Reolink Lumus (E430)</a></strong>: מצלמת Wi-Fi חיצונית 4MP עם זרקור לבן של 100 לומן, סירנה ושמע דו-כיווני. מתאימה לכניסה, למרפסת או לחניה שקרובה לראוטר.</li>
</ul>

<p>עוד דגמים עם אור מהבהב, סירנה או זרקורים תמצאו ב<a href="/store/c/ip">מצלמות ה-IP</a> וב<a href="/store/c/wifi">מצלמות ה-Wi-Fi</a>. מי שמתחיל מאפס יכול להסתכל גם על <a href="/store/c/kits">הערכות המוכנות</a>: יש ערכות של Reolink עם מצלמות שיש להן זרקורים לצבע בלילה ושמע דו-כיווני, ואת כל המצלמות רואים באותה אפליקציה. המחיר העדכני מופיע בדף של כל מוצר.</p>

<h3>איך להגדיר הרתעה בלי להרגיז את כל השכונה</h3>
<ul>
<li><strong>רק בשעות הנכונות.</strong> מפעילים סירנה בלילה או כשאין אף אחד בבית, ולא בכל שעות היום.</li>
<li><strong>רק באזור הנכון.</strong> מסמנים קו או אזור בתוך החצר, ולא את המדרכה. כך מי שעובר ברחוב לא מפעיל את המצלמה.</li>
<li><strong>רק על אדם.</strong> במצלמות שיש להן סיווג של אדם ורכב, מגדירים שהסירנה תופעל רק כשמזוהה אדם, ולא בכל תנועה של עץ או חתול.</li>
<li><strong>לחשוב על השכנים.</strong> סירנה של מצלמה בחצר נשמעת גם אצלם. בהרבה מקרים אור מהבהב והודעה קולית קצרה מספיקים.</li>
<li><strong>להשתמש בשמע הדו-כיווני.</strong> אפשר לפנות מהנייד למי שעומד בשער, בין אם זה שליח ובין אם מישהו שלא אמור להיות שם.</li>
</ul>

<p>על זיהוי חכם במצלמות באופן כללי, מעבר להרתעה, כתבנו ב<a href="/blog/smart-security-ai-2026">מדריך על מערכות אבטחה עם AI</a>.</p>

<h2 id="insurance">ביטוח ומוקד: מה לבדוק לפני שקונים</h2>

<p>זה הסעיף שהכי חשוב לבדוק לפני שמוציאים כסף. חברות ביטוח עשויות לבקש אמצעי מיגון כתנאי בפוליסה, למשל אזעקה שמחוברת למוקד, סורגים בקומת קרקע או כספת לתכשיטים, בעיקר כשמבטחים תכולה יקרה. מה בדיוק נדרש משתנה בין חברות ובין פוליסות, ולכן:</p>

<ol>
<li><strong>בקשו את הדרישה בכתב.</strong> מהסוכן או מחברת הביטוח, במייל או במסמך: האם נדרשת אזעקה? מחוברת למוקד? אילו גלאים ואיפה? האם המתקין צריך לעמוד בתקן מסוים או לתת אישור התקנה?</li>
<li><strong>שאלו על מצלמות במפורש.</strong> האם הן משפיעות על התנאים או על הפרמיה, ואם כן, מה נדרש מהן, למשל הקלטה רציפה או כמה ימים ההקלטות נשמרות.</li>
<li><strong>בררו מה המוקד עושה.</strong> מה קורה כשמגיעה התראה, למי מתקשרים, האם נשלח סייר, ומה קורה אחרי אזעקות שווא חוזרות.</li>
<li><strong>שלחו לנו את הדרישה הכתובה</strong> כשאתם מבקשים הצעה למצלמות, כדי שנתאים את המערכת אליה ולא נמליץ על משהו שלא עומד בה.</li>
</ol>

<p>שורה תחתונה: מצלמות לא מחליפות אזעקה כשהפוליסה דורשת אזעקה. ולהפך, אם מבקשים מכם תיעוד וידאו, אזעקה לא תספיק.</p>

<h2 id="false-alarms">אזעקות שווא בשתי המערכות</h2>

<p>לשתי המערכות יש אזעקות שווא, וזו לא רק בעיה של נוחות. אזעקה שמופעלת שוב ושוב מלמדת את כולם להתעלם ממנה, את השכנים, את המוקד ואתכם, ואז גם האירוע האמיתי מתפספס.</p>

<h3>באזעקה</h3>
<ul>
<li>חיות מחמד שמסתובבות בבית כשהמערכת דרוכה. יש גלאים שמתאימים לבית עם חיות, וכדאי לבקש אותם מראש.</li>
<li>חלון שנשאר פתוח, או וילון שזז מהמזגן מול גלאי תנועה.</li>
<li>בן משפחה, עובד או מנקה שלא יודעים את הקוד או מתבלבלים בו.</li>
<li>סוללה חלשה בגלאי אלחוטי.</li>
</ul>

<h3>במצלמות</h3>
<ul>
<li>עצים ושיחים שזזים ברוח, צללים ופנסים של רכבים שעוברים.</li>
<li>גשם, וחרקים או קורי עכביש מול העדשה בלילה.</li>
<li>חתולים וכלבים בחצר.</li>
</ul>

<p>הפתרון במצלמות הוא כמעט תמיד בהגדרות: זיהוי של אדם או רכב במקום כל תנועה, אזור זיהוי מדויק, תזמון, וניקוי של העדשה פעם בכמה חודשים. במצלמות סולאריות זה חשוב במיוחד, כי כל התראה מיותרת גם מבזבזת סוללה וגלישה. פירטנו את זה ב<a href="/blog/prevent-false-alarms-4g-solar-cameras-ai-2026">מדריך על התרעות שווא במצלמות 4G סולאריות</a>.</p>

<h2 id="scenarios">ארבעה מצבים נפוצים</h2>

<h3>בית פרטי עם חצר ושער</h3>
<p>מתחילים במצלמות בחוץ: שער, חניה, חצר אחורית וכניסה, עם צבע בלילה בנקודות החשוכות. בנקודה אחת או שתיים הכי רגישות, בדרך כלל השער או הכניסה האחורית, שמים מצלמה עם הרתעה. אם הבית עומד ריק בחופשות, או שיש בו תכולה שחברת הביטוח מתייחסת אליה, מוסיפים אזעקה בפנים.</p>

<h3>דירה בבניין</h3>
<p>אם הביטוח דורש, אזעקה על הדלת ועל חלונות נגישים. בנוסף, מצלמה אחת בתוך הדירה מול הדלת, או פעמון וידאו שמאפשר לראות ולדבר עם מי שעומד בכניסה. מצלמה שמכסה גם את חדר המדרגות המשותף כדאי לתאם מראש עם השכנים ועם ועד הבית.</p>

<h3>חנות או עסק קטן</h3>
<p>מצלמות על הקופה, הכניסה והמחסן, עם הקלטה רציפה למקליט. לשעות שבהן העסק סגור, אזעקה שמחוברת למוקד, כי בשעות האלה אף אחד לא מסתכל באפליקציה. מצלמה עם התרעה קולית בכניסה האחורית או בחצר המשלוחים מוסיפה שכבה של הרתעה.</p>

<h3>מחסן, משק או מקום מרוחק</h3>
<p>כשאין חשמל קבוע או אינטרנט, אזעקה רגילה עם מוקד היא לא תמיד אפשרות פשוטה. מצלמת 4G עם סוללה ופאנל סולארי שולחת התראה לנייד כשיש תנועה, ואפשר לפתוח צפייה חיה ולבדוק מה קורה מכל מקום.</p>

<h2 id="us">מה אנחנו עושים, ומה לא</h2>

<p>אנחנו מוכרים ומתקינים את חלק הווידאו: מצלמות, מקליטים ואינטרקום. אם אתם צריכים גם אזעקה או מוקד, תצטרכו חברה שעוסקת בזה. מה שאנחנו כן יכולים לעשות הוא לתכנן את המצלמות כך שישלימו את האזעקה שיש לכם, ואם יש לכם דרישה כתובה מהביטוח, לעבור עליה לפני שנמליץ על משהו.</p>

<p><a href="/installation">ההתקנה</a> היא שירות נפרד בכל הארץ, בתיאום. שולחים לנו <a href="https://wa.me/972508277907">בווצאפ</a> כמה תמונות או סרטון קצר של המקום, ואיפה אתם רוצים מצלמות, ואחרי שראינו אותו נחזור עם הצעת מחיר להתקנה. מי שמתקין לבד קונה את הציוד בחנות. המשלוח לא כלול במחיר ומתומחר לפי הכתובת.</p>

<p>לא בטוחים מאיפה להתחיל? <a href="/store/finder">שאלון ההתאמה בחנות</a> שואל כמה שאלות קצרות ומחזיר המלצה למצלמות שמתאימות לבית או לעסק שלכם.</p>`;

export default function Page() {
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: H1,
    description: DESCRIPTION,
    image: HERO,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    author: { '@type': 'Organization', name: 'צוות Site-Control', url: 'https://www.site-control-il.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Site-Control',
      logo: { '@type': 'ImageObject', url: 'https://www.site-control-il.com/images/site-control-logo.webp' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': CANONICAL },
    url: CANONICAL,
    inLanguage: 'he-IL',
    keywords: KEYWORDS.join(', '),
    isPartOf: { '@type': 'Blog', '@id': 'https://www.site-control-il.com/blog', name: 'בלוג Site-Control' },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'דף הבית', item: 'https://www.site-control-il.com' },
      { '@type': 'ListItem', position: 2, name: 'בלוג', item: 'https://www.site-control-il.com/blog' },
      { '@type': 'ListItem', position: 3, name: SHARE_TITLE, item: CANONICAL },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <nav style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
          <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>דף הבית</a>
          <span> / </span>
          <a href="/blog" style={{ color: '#007bff', textDecoration: 'none' }}>בלוג</a>
          <span> / </span>
          <span>{SHARE_TITLE}</span>
        </nav>
        <article style={{ lineHeight: '1.8', color: 'var(--text)' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text)', marginTop: '2rem' }}>
            {H1}
          </h1>
          <img
            src={`/blog-images/${SLUG}/hero-v2.webp`}
            alt={HERO_ALT}
            width={1200}
            height={593}
            fetchPriority="high"
            decoding="async"
            style={{ width: '100%', maxWidth: '1200px', height: 'auto', margin: '2rem 0', borderRadius: '8px' }}
          />
          <p style={{ margin: '1rem 0', fontStyle: 'italic', color: 'var(--muted)' }}>
            מעודכן ל-17.10.2026 | צוות Site-Control
          </p>
          <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
          <section style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(15,52,96,0.05)', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--accent, #e94560)' }}>שאלות נפוצות</h2>
            {FAQS.map((f) => (
              <details
                key={f.q}
                style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--card, #fff)', borderRadius: '8px', border: '1px solid var(--border, #eee)' }}
              >
                <summary style={{ fontWeight: 'bold', cursor: 'pointer', color: 'var(--text, #333)', fontSize: '1.1rem' }}>{f.q}</summary>
                <p style={{ marginTop: '0.75rem', lineHeight: '1.8', color: 'var(--text, #555)' }}>{f.a}</p>
              </details>
            ))}
          </section>
          <div style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>לא בטוחים אילו מצלמות מתאימות לכם?</h3>
            <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>כמה שאלות קצרות בחנות שלנו ותקבלו המלצה מנומקת, או שאלו אותנו בווצאפ</p>
            <a href="/store/finder" style={{ display: 'inline-block', padding: '12px 32px', background: '#e94560', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              לשאלון ההתאמה בחנות
            </a>
          </div>
        </article>
      </div>
    </>
  );
}
