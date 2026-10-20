import { Metadata } from 'next';

const SLUG = '4g-solar-security-cameras-remote-sites-2026';
const CANONICAL = `https://www.site-control-il.com/blog/${SLUG}`;
const HERO = `https://www.site-control-il.com/blog-images/${SLUG}/hero.webp`;
const TITLE = "מצלמה סולארית 4G לאתר מרוחק: צ'קליסט לפני קנייה";
const H1 = "מצלמת אבטחה 4G סולארית לאתר מרוחק: צ'קליסט של 9 בדיקות לפני שקונים";
const DESCRIPTION =
  'לפני שקונים מצלמת אבטחה 4G סולארית לאתר מרוחק: איך בודקים קליטה בנקודה, לאן מפנים את הפאנל, איזו מצלמה לבחור, איזה סים וכרטיס, ואיפה תולים.';
const PUBLISHED = '2026-01-27';
const MODIFIED = '2026-10-17';
const HERO_ALT = 'מצלמת אבטחה 4G עם פאנל סולארי על עמוד מעל אתר בנייה, וטאבלט שמציג את התמונה מהמצלמה';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'מצלמה סולארית 4G',
    'מצלמת אבטחה עם סים',
    'מצלמת אבטחה לאתר מרוחק בלי חשמל',
    'בדיקת קליטה סלולרית למצלמה',
    'כיוון פאנל סולארי למצלמה',
    'מצלמת אבטחה 4G לאתר בנייה',
    'סים למצלמת אבטחה',
  ],
  authors: [{ name: 'צוות Site-Control', url: 'https://www.site-control-il.com' }],
  openGraph: {
    title: TITLE,
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
    title: TITLE,
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

const FAQ: { q: string; a: string }[] = [
  {
    q: 'איך בודקים אם יש מספיק קליטה למצלמת 4G סולארית?',
    a: 'שמים בטלפון את הסים שמיועד למצלמה, עומדים בחוץ בדיוק בנקודה שבה היא תותקן ובגובה ההתקנה, ובודקים שהטלפון מתחבר ל-4G. אם הטלפון תומך ב-5G, מעבירים אותו זמנית למצב 4G, כי המצלמות עובדות על רשת 4G. שיחת וידאו של דקה או בדיקת מהירות שמראה גם העלאה (Upload) מראות אם הקליטה מספיקה לווידאו. בדיקה בתוך קונטיינר או משרד לא מלמדת על מה שיקרה בחוץ, וההפך.',
  },
  {
    q: 'לאיזה כיוון מפנים את הפאנל הסולארי בישראל?',
    a: 'דרומה. Reolink ממליצה גם על זווית של קו הרוחב המקומי ועוד 5 מעלות, ובישראל זה יוצא בערך 35 עד 38 מעלות. חשוב לא פחות שהפאנל לא ייכנס לצל של עץ, גג או מבנה במהלך היום, גם בחורף, כשהשמש נמוכה יותר והצללים ארוכים יותר.',
  },
  {
    q: 'מצלמה סולארית 4G מקליטה 24 שעות ביממה?',
    a: 'רוב מצלמות הסוללה מקליטות לפי אירועי תנועה, כדי לחסוך בסוללה. להקלטה רציפה בלי חשמל יש את ערכת Reolink TrackMix LTE Plus עם פאנל סולארי של 66W. אם יש חשמל בנקודה ואין אינטרנט, Reolink TrackMix Wired LTE מתחברת לשקע, עובדת על סים ומקליטה ברציפות או לפי תנועה.',
  },
  {
    q: 'איזה סים צריך למצלמת Reolink 4G?',
    a: 'סים בגודל ננו עם חבילת גלישה פעילה, סים נפרד לכל מצלמה, בלי קוד PIN ולא נעול למכשיר מסוים. את קוד ה-PIN מבטלים מראש בטלפון, בהגדרות הסים. אפשר להשתמש בסים משלכם, ואפשר לקבל מאיתנו סים עם חבילת גלישה שנתית למצלמה.',
  },
  {
    q: 'הפאנל הסולארי כלול עם המצלמה?',
    a: 'תלוי בדגם. ב-Go PT Ultra, ב-Go Ranger PT ובערכת TrackMix LTE Plus הפאנל באריזה. בדגמים כמו Go Plus, Go Ultra ו-TrackMix LTE הפאנל נמכר בנפרד, וזה מצוין בדף של כל מוצר.',
  },
  {
    q: 'אפשר להתקין לבד, או שצריך מתקין?',
    a: 'מצלמת סוללה עם פאנל לא צריכה חשמלאי או כבלים, ואפשר להתקין אותה לבד עם מקדחה וסולם. כשצריך עמוד, גובה רב או כמה מצלמות, אפשר להזמין התקנה. ההתקנה היא שירות נפרד מהציוד: שולחים תמונות או סרטון קצר של המקום בווצאפ ומקבלים הצעת מחיר. מתקינים בכל הארץ, בתיאום.',
  },
];

const BODY = `<nav style="background: rgba(15,52,96,0.05); padding: 1.25rem 1.5rem; border-radius: 10px; margin-bottom: 2rem;"><strong>תוכן העניינים</strong><ul style="margin-top: 0.5rem;"><li><a href="#short">הצ'קליסט בקצרה</a></li><li><a href="#signal">1. קליטה סלולרית בנקודה המדויקת</a></li><li><a href="#sun">2. שמש, צל וכיוון הפאנל</a></li><li><a href="#view">3. מה מצלמים ומאיזה מרחק</a></li><li><a href="#recording">4. הקלטה לפי תנועה או רציפה</a></li><li><a href="#sim">5. סים וחבילת גלישה</a></li><li><a href="#sd">6. כרטיס זיכרון</a></li><li><a href="#mount">7. גובה התקנה והגנה מגניבה</a></li><li><a href="#alerts">8. התראות</a></li><li><a href="#install">9. מי מתקין</a></li><li><a href="#table">הצ'קליסט בטבלה אחת</a></li></ul></nav>

<p>מצלמת 4G סולארית נשמעת כמו פתרון לכל מקום: אין חשמל, אין אינטרנט, תולים על עמוד וזהו. וזה באמת יכול לעבוד ככה, בתנאי שבודקים כמה דברים בשטח לפני הקנייה. אם אחד מהם לא מתאים, גם מצלמה טובה תעבוד רע: קליטה חלשה בדיוק בנקודה שבה תלו אותה, פאנל שנכנס לצל אחר הצהריים, או מצלמה רחבה שתלויה רחוק מדי מהשער שהיא אמורה לתעד.</p>

<p>הצ'קליסט הזה מיועד לחקלאי, לקבלן, לבעלים של מחסן או של חלקה, ולכל מי שצריך לראות מה קורה במקום בלי תשתית. הוא עוסק רק במה שבודקים לפני שקונים. איך מתקינים אחרי שהמצלמה הגיעה, מוסבר ב<a href="/blog/solar-4g-security-camera-remote-site-installation-2026">מדריך ההתקנה של מצלמות סולאריות 4G</a>. את הדגמים עצמם תמצאו ב<a href="/store/c/solar">קטגוריית המצלמות הסולאריות 4G</a> בחנות.</p>

<h2 id="short">הצ'קליסט בקצרה</h2>

<ol>
<li><strong>קליטה:</strong> יש 4G טוב בנקודה המדויקת, בגובה ההתקנה, ברשת של הסים שיהיה במצלמה.</li>
<li><strong>שמש:</strong> יש מקום לפאנל שפונה דרומה ולא נכנס לצל במהלך היום, גם בחורף.</li>
<li><strong>מה מצלמים:</strong> ברור מה המצלמה צריכה לראות, ומאיזה מרחק.</li>
<li><strong>הקלטה וחשמל:</strong> מספיק תיעוד של אירועים, או שצריך הקלטה רציפה? ויש חשמל בנקודה?</li>
<li><strong>סים וגלישה:</strong> סים נפרד לכל מצלמה, עם חבילת גלישה מתאימה.</li>
<li><strong>כרטיס זיכרון:</strong> בגודל המקסימלי שהמצלמה תומכת בו.</li>
<li><strong>גובה וגניבה:</strong> איפה תולים, ואיך מקשים על מי שירצה להוריד את המצלמה.</li>
<li><strong>התראות:</strong> מה אמור להפעיל אותן, ומי מקבל אותן.</li>
<li><strong>התקנה:</strong> מתקינים לבד, או מזמינים מתקין.</li>
</ol>

<p>עכשיו כל סעיף בפירוט.</p>

<h2 id="signal">1. קליטה סלולרית בנקודה המדויקת</h2>

<p>זו הבדיקה הכי חשובה, ואין לה תחליף. מצלמת 4G שולחת את הווידאו דרך הרשת הסלולרית. כשהקליטה חלשה, השידור החי נתקע, ההתראות מגיעות באיחור, ולפעמים המצלמה פשוט מתנתקת. קליטה מלאה בכניסה לחלקה לא אומרת כלום על הפינה הרחוקה שלה, מאחורי מבנה או בתוך ואדי.</p>

<h3>איך בודקים עם הטלפון</h3>
<ul>
<li><strong>עם הסים של המצלמה:</strong> Reolink ממליצה לשים בטלפון את הסים שמיועד למצלמה, ולבדוק שהטלפון מתחבר ל-4G במקום שבו המצלמה תותקן. אם עוד אין לכם סים, בדקו לפחות עם טלפון שעובד על אותה רשת.</li>
<li><strong>על איזו רשת:</strong> בישראל יש כמה רשתות סלולריות, וחברות קטנות רבות עובדות על הרשת של אחת מהן. בררו על איזו רשת הסים שלכם עובד בפועל. בנקודה מסוימת רשת אחת יכולה להיות חזקה, ורשת אחרת כמעט לא לקלוט.</li>
<li><strong>במצב 4G:</strong> מצלמות ה-4G של Reolink עובדות על רשת 4G ולא על 5G. אם הטלפון שלכם מציג 5G, העבירו אותו זמנית למצב 4G (LTE) בהגדרות הרשת הסלולרית, כדי לראות מה המצלמה תקבל בפועל.</li>
<li><strong>במקום ובגובה:</strong> עמדו בדיוק איפה שהמצלמה תהיה, ואם אפשר, הרימו את הטלפון לגובה שבו היא תיתלה.</li>
<li><strong>בדיקת העלאה:</strong> המצלמה בעיקר שולחת וידאו, ולא מורידה. לכן מה שקובע הוא קצב ההעלאה. שיחת וידאו של דקה או שתיים, או בדיקת מהירות שמראה גם Upload, יגידו לכם הרבה יותר מכמות הפסים על המסך.</li>
</ul>

<h3>בחוץ, לא בתוך הקונטיינר</h3>
<p>טעות שכדאי להימנע ממנה, בעיקר באתרי בנייה: בודקים קליטה במשרד או בקונטיינר, ותולים את המצלמה על עמוד בקצה המגרש. או ההפך: בודקים בחוץ ומתכננים להתקין בתוך מבנה. קירות בטון וקונטיינר מתכת מחלישים את האות הסלולרי, ולכן בודקים בדיוק במקום שבו המצלמה תעמוד, בחוץ.</p>

<p>אם הקליטה גבולית, נסו סים של רשת אחרת, או הזיזו את נקודת ההתקנה כמה מטרים, לגובה או למקום פתוח יותר. אלה גם שני הפתרונות ש-Reolink מציעה. אם אין קליטה בכלל, מצלמת 4G לא מתאימה למקום הזה, וחבל לקנות אותה.</p>

<h2 id="sun">2. שמש, צל וכיוון הפאנל</h2>

<p>מצלמת סוללה עם פאנל סולארי עובדת לאורך זמן כל עוד הפאנל מחזיר לסוללה את מה שהמצלמה מוציאה. לכן לפני הקנייה בודקים שיש בנקודה מקום טוב לפאנל, ולא רק למצלמה.</p>
<ul>
<li><strong>כיוון:</strong> בישראל, כמו בכל חצי הכדור הצפוני, מפנים את הפאנל דרומה. זו גם ההמלצה של Reolink.</li>
<li><strong>זווית:</strong> Reolink ממליצה על זווית של קו הרוחב המקומי ועוד 5 מעלות. ישראל נמצאת בערך בין קו רוחב 29.5 (אילת) לקו רוחב 33.3 (מטולה), כך שזה יוצא בערך 35 עד 38 מעלות. ולא מתקינים את הפאנל שטוח לגמרי: לפי Reolink, כך מצטבר עליו יותר לכלוך והוא מפיק פחות.</li>
<li><strong>צל:</strong> עצים, גגות, כרכובים ומבנים סמוכים. בדקו את הנקודה בבוקר ואחר הצהריים, לא רק בצהריים. ובחורף השמש נמוכה יותר והצללים ארוכים יותר, כך שמקום שמשי ביוני יכול להיות בצל בדצמבר. Reolink מציינת שבחורף, עם ימים קצרים ושמש נמוכה, הפאנל מפיק פחות.</li>
<li><strong>מרחק מהמצלמה:</strong> הפאנל לא חייב לשבת צמוד למצלמה. ל-Solar Panel 2 של Reolink יש כבל של 4 מטרים וזרוע מתכווננת, כך שאפשר לשים את המצלמה איפה שהיא רואה טוב, ואת הפאנל במקום השמשי הקרוב. Reolink ממליצה לא להאריך את הכבל ליותר מ-9 מטרים בסך הכול.</li>
<li><strong>אבק:</strong> בשדות, במחצבות ובאתרי בנייה הפאנל מתלכלך מהר. תכננו מראש איך תגיעו לנקות אותו מדי פעם, בלי לפרק את כל ההתקנה.</li>
</ul>
<p>ועוד דבר שבודקים בדף המוצר: האם הפאנל כלול. בחלק מהדגמים הוא באריזה, ובאחרים קונים אותו בנפרד. הפירוט בשאלות הנפוצות בסוף העמוד.</p>

<h2 id="view">3. מה מצלמים ומאיזה מרחק</h2>

<p>לפני שבוחרים דגם, כתבו במשפט אחד מה המצלמה צריכה לתפוס. "לראות מי נכנס בשער" ו"לראות את כל המגרש" הן שתי משימות שונות, ולפעמים צריך בשבילן שתי מצלמות.</p>

<h3>מצלמה קבועה</h3>
<p>עדשה קבועה רואה כל הזמן את אותה תמונה, וזה היתרון שלה: שום דבר לא קורה מחוץ לפריים בזמן שהיא מסתכלת לכיוון אחר. היא מתאימה לנקודה ברורה: שער, דלת של מחסן, כניסה לחלקה. <a href="/store/reolink-go-plus">Reolink Go Plus</a> נותנת 4MP בעדשה רחבה, ו-Go Ultra נותנת 4K עם זרקור לצבע בלילה. כדי לראות פרטים כמו פנים או מספר רכב, מצלמה רחבה צריכה להיות קרובה לנקודה. ככל שהיא רחוקה יותר, האדם בתמונה קטן יותר.</p>
<p>לחזית רחבה, כמו גדר ארוכה או חזית של מגרש, יש את Reolink Duo 2 LTE: שתי עדשות שמחוברות לתמונה רציפה אחת של 180 מעלות.</p>

<h3>מצלמה ממונעת (PTZ)</h3>
<p>מצלמה ממונעת מסתובבת מהאפליקציה, וכך מצלמה אחת יכולה לכסות חצר או מגרש. <a href="/store/reolink-go-pt-ultra">Reolink Go PT Ultra</a> מסתובבת 355 מעלות לצדדים ו-140 מעלות למעלה ולמטה, עוקבת אוטומטית אחרי תנועה, ומגיעה עם פאנל סולארי. החיסרון של כל מצלמה ממונעת: בכל רגע היא מסתכלת לכיוון אחד בלבד. כשהיא פונה לשער, היא לא רואה את המחסן.</p>

<h3>שתי עדשות: רחבה וזום</h3>
<p><a href="/store/reolink-trackmix-lte">Reolink TrackMix LTE</a> משלבת עדשה רחבה קבועה עם עדשת טלה ממונעת וזום היברידי x6. העדשה הרחבה ממשיכה לראות את כל השטח, והטלה ננעלת על אדם או רכב ועוקבת אחריו. זה מתאים למגרש שבו צריך גם תמונה כללית וגם פרטים של מי שנכנס.</p>

<h3>ומה רואים בלילה</h3>
<p>באתר מרוחק, הזמן שהכי חשוב לראות בו הוא לרוב הזמן שאין שם אף אחד, וזה כולל את הלילה. בדקו בדף המוצר איך כל דגם רואה בחושך: אינפרא אדום נותן תמונה בשחור-לבן, ודגמים עם זרקור, כמו Go Ultra ו-Go PT Ultra, נותנים גם צבע. בדף המוצר מופיע לפעמים גם הטווח, למשל ראיית לילה באינפרא עד 10 מטרים ב-Go PT Plus. הטווח הזה קובע עד איפה תראו משהו בלילה, והוא לא תמיד אותו מרחק כמו ביום.</p>

<h2 id="recording">4. הקלטה לפי תנועה או רציפה, ויש חשמל בנקודה?</h2>

<p>שווה לענות על השאלה הזו לפני שבוחרים דגם, כי היא מחלקת את המצלמות לשלוש קבוצות:</p>
<ul>
<li><strong>סוללה ופאנל קטן, הקלטה לפי אירועים:</strong> רוב מצלמות הסוללה. כדי לחסוך בסוללה, המצלמה מקליטה כשחיישן התנועה מזהה משהו, ושולחת התראה. זה מספיק כשהמטרה היא לדעת שמישהו נכנס, ומתי.</li>
<li><strong>בלי חשמל, עם פאנל גדול, הקלטה רציפה:</strong> <a href="/store/reolink-trackmix-lte-plus-solar">ערכת Reolink TrackMix LTE Plus</a> מגיעה עם פאנל סולארי של 66W ומקליטה 24/7. ההבדל בגודל הפאנל, 66W לעומת 6W ב-Solar Panel 2, ממחיש כמה אנרגיה הקלטה רציפה דורשת.</li>
<li><strong>יש חשמל, אין אינטרנט:</strong> אם יש שקע בנקודה, למשל במחסן, בלול או בבית אריזה, לא צריך סוללה בכלל. <a href="/store/reolink-trackmix-wired-lte">Reolink TrackMix Wired LTE</a> מתחברת לחשמל עם ספק 12V שמגיע באריזה, עובדת על סים, ומקליטה ברציפות או לפי תנועה.</li>
</ul>
<p>שאלה שעוזרת להחליט: אם יקרה משהו, מה תרצו לראות? אם מספיק לכם קליפ של מי נכנס ומתי, מצלמת סוללה מתאימה. אם תרצו לגלול אחורה ולראות מה קרה בכל שעה, גם כשאף אחד לא עבר מול החיישן, צריך הקלטה רציפה.</p>

<h2 id="sim">5. סים וחבילת גלישה</h2>

<p>לפי ההנחיות של Reolink למצלמות ה-4G שלה:</p>
<ul>
<li><strong>סים לכל מצלמה:</strong> כל מצלמה צריכה סים משלה. אי אפשר לשתף סים אחד בין כמה מצלמות.</li>
<li><strong>גודל:</strong> סים בגודל ננו (Nano-SIM).</li>
<li><strong>בלי קוד PIN:</strong> סים שנעול בקוד PIN לא יתחבר במצלמה. מבטלים את הקוד מראש: מכניסים את הסים לטלפון ומכבים את נעילת ה-PIN בהגדרות הסים.</li>
<li><strong>סים פתוח:</strong> סים בלי הגבלות של חברת התקשורת, ולא כזה שנעול למכשיר מסוים.</li>
<li><strong>חבילת גלישה פעילה:</strong> כמה גלישה צריך תלוי בעיקר בכמה אירועים המצלמה מקליטה ושולחת, בכמה זמן צופים בשידור חי, ובאיכות הווידאו שמוגדרת. החשבון המלא, ואיך חוסכים, נמצאים במדריך על <a href="/blog/4g-solar-camera-data-consumption-cost-management-2026">צריכת גלישה במצלמות סולאריות 4G</a>.</li>
</ul>
<p>אפשר להשתמש בסים משלכם, ואפשר לקבל מאיתנו סים עם חבילת גלישה שנתית למצלמה. כך או כך, שווה לעשות את בדיקת הקליטה מסעיף 1 עם הסים שבאמת ייכנס למצלמה.</p>

<h2 id="sd">6. כרטיס זיכרון</h2>

<p>מצלמות 4G סולאריות שומרות את ההקלטות על כרטיס microSD שבתוך המצלמה. הענן, בדגמים שתומכים בו, הוא תוספת. כלומר, הכרטיס הוא הארכיון שלכם.</p>
<ul>
<li><strong>גודל:</strong> בדקו בדף המוצר מה המקסימום. בדגמי ה-Go זה 128GB, וב-TrackMix LTE וב-TrackMix Wired LTE עד 256GB. קחו את הגודל המקסימלי: כרטיס גדול יותר שומר היסטוריה ארוכה יותר, וזה חשוב במיוחד כשמגיעים לאתר רק פעם בכמה ימים.</li>
<li><strong>סוג:</strong> להקלטה ב-4K, Reolink ממליצה על כרטיס בדירוג מהירות V30 ומעלה. לפני השימוש מפרמטים את הכרטיס בתוך המצלמה, דרך האפליקציה.</li>
<li><strong>לא תמיד כלול:</strong> ב-TrackMix Wired LTE, למשל, הכרטיס לא כלול. בדקו בדף המוצר ודאגו לכרטיס מראש, כדי שלא תגיעו לאתר בלי כרטיס.</li>
<li><strong>כשהכרטיס מתמלא:</strong> בחלק מהדגמים ההקלטות החדשות נכתבות מעל הישנות אוטומטית, ובאחרים יש לזה הגדרה (Overwrite) בהגדרות האחסון באפליקציה. אחרי ההתקנה ודאו שהיא פעילה, אחרת המצלמה מפסיקה להקליט כשהכרטיס מלא.</li>
</ul>

<h2 id="mount">7. גובה התקנה והגנה מגניבה</h2>

<p>מצלמה באתר מרוחק תלויה במקום שבו אין אף אחד רוב הזמן, ולכן חושבים מראש גם על מי שירצה להוריד אותה. יש כאן שני שיקולים שמושכים לכיוונים הפוכים:</p>
<ul>
<li><strong>גבוה, כדי שלא יגיעו:</strong> ככל שהמצלמה גבוהה יותר, קשה יותר להגיע אליה בלי סולם.</li>
<li><strong>לא גבוה מדי, כדי שתזהה:</strong> Reolink ממליצה להתקין מצלמות סוללה בגובה 2 עד 3 מטרים, ומציינת שחיישן התנועה שלהן מזהה עד כ-10 מטרים, בזווית של 120 מעלות לרוחב. הטווח משתנה בין דגמים. מצלמה שתלויה גבוה מדי או רחוק מדי פשוט לא תתעורר כשמישהו עובר.</li>
</ul>
<p>כמה דברים שעוזרים:</p>
<ul>
<li>תלו את המצלמה על עמוד או על קיר, ולא על גדר שקל לטפס עליה.</li>
<li>גם הפאנל צריך להיות מחוץ להישג יד, והכבל שלו צמוד לעמוד ולא תלוי באוויר.</li>
<li>אם יש שתי מצלמות, כוונו אחת כך שתראה גם את הגישה לשנייה.</li>
<li>זכרו שההקלטות נמצאות על הכרטיס שבתוך המצלמה. מצלמה שנגנבה לוקחת איתה את ההקלטות. לכן חשוב שההתראות יגיעו לטלפון בזמן אמת, ובדגמים עם אפשרות ענן, כמו Go Plus ו-Go Ultra, שווה לשקול אותו כגיבוי.</li>
<li>לשטח פתוח, Go Ranger PT מגיעה בצבע הסוואה, ו-Talon Pro, מצלמת שבילים 4G, כוללת GPS מובנה שמראה איפה המצלמה נמצאת.</li>
</ul>
<p>ואם המצלמה צופה גם על דרך או על שטח של שכנים, כוונו אותה כך שתתעד את השטח שלכם ולא את מה שמסביב.</p>

<h2 id="alerts">8. התראות: מה מפעיל אותן ומי מקבל</h2>

<p>באתר מרוחק, ההתראה היא הדרך היחידה לדעת שקורה משהו בזמן שהוא קורה. כדאי לחשוב עליה עוד לפני שבוחרים את נקודת ההתקנה:</p>
<ul>
<li><strong>כיוון התנועה:</strong> לפי Reolink, חיישן ה-PIR רגיש יותר לתנועה מצד לצד מאשר לתנועה שמתקדמת ישר לעבר המצלמה. לכן עדיף למקם את המצלמה כך שמי שנכנס יחצה את התמונה, ולא יצעד ישר אליה.</li>
<li><strong>מה לא אמור להפעיל אותה:</strong> עצים ושיחים שזזים ברוח, כביש שעובר ברקע, ושמש. Reolink ממליצה לא לכוון את המצלמה מול מקורות אור חזקים, כולל השמש. כל התראה מעירה את המצלמה וצורכת סוללה וגלישה, כך שהתראות שווא עולות גם בסוללה. איך מצמצמים אותן מוסבר במדריך <a href="/blog/prevent-false-alarms-4g-solar-cameras-ai-2026">למניעת התראות שווא במצלמות 4G סולאריות</a>.</li>
<li><strong>מתי:</strong> באתר בנייה, בשעות העבודה כל פועל שעובר יפעיל התראה. החליטו מראש מתי ההתראות חשובות לכם, למשל בלילה ובסופי שבוע.</li>
<li><strong>מי מקבל ומה עושים:</strong> החליטו מי מקבל את ההתראות, ומה הוא עושה כשהן מגיעות: מסתכל בשידור החי, מדבר דרך הרמקול של המצלמה (לרוב הדגמים בקטגוריה יש שמע דו-כיווני), או מתקשר למישהו שנמצא קרוב.</li>
</ul>

<h2 id="install">9. מי מתקין</h2>

<p>מצלמת סוללה עם פאנל לא צריכה חשמלאי ולא כבלים. מי שמסתדר עם מקדחה וסולם יכול להתקין אותה לבד, ומדריך ההתקנה שהזכרנו בהתחלה עובר על זה שלב אחרי שלב.</p>
<p>כדאי להזמין מתקין כשצריך להציב עמוד, כשהנקודה גבוהה או קשה לגישה, כשיש כמה מצלמות שצריך לתכנן יחד, או פשוט כשאין לכם זמן לנסוע לאתר. אצלנו ההתקנה היא שירות נפרד מהציוד: שולחים תמונות או סרטון קצר של המקום ב<a href="https://wa.me/972508277907">ווצאפ</a>, ומקבלים הצעת מחיר אחרי שראינו את האתר. מתקינים בכל הארץ, בתיאום. הפרטים בדף <a href="/installation">התקנת מצלמות</a>, ולקבלנים יש דף נפרד על <a href="/construction-sites">מצלמות לאתרי בנייה</a>.</p>

<h2 id="table">הצ'קליסט בטבלה אחת</h2>

<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; margin: 1rem 0;"><thead><tr style="background: #0f3460; color: #fff;"><th style="padding: 10px; text-align: right;">בדיקה</th><th style="padding: 10px; text-align: right;">איך בודקים</th><th style="padding: 10px; text-align: right;">אם התשובה לא טובה</th></tr></thead><tbody>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 110px;"><strong>קליטה</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">הסים של המצלמה בטלפון, במצב 4G, בחוץ, בנקודה ובגובה ההתקנה. שיחת וידאו או בדיקת Upload</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">סים של רשת אחרת, נקודה פתוחה או גבוהה יותר. בלי קליטה בכלל, 4G לא מתאים</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 110px;"><strong>שמש</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">פאנל דרומה, בזווית של בערך 35 עד 38 מעלות, בלי צל בבוקר ואחר הצהריים, גם בחורף</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">להרחיק את הפאנל מהמצלמה, במסגרת אורך הכבל, למקום שמשי</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 110px;"><strong>מה מצלמים</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">משפט אחד: מה צריך לראות, ומאיזה מרחק, ביום ובלילה</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">מצלמה עם זום, מצלמה פנורמית, או שתי מצלמות במקום אחת</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 110px;"><strong>הקלטה וחשמל</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">מספיק תיעוד של אירועים, או צריך 24/7? יש שקע בנקודה?</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">ל-24/7 בלי חשמל: פאנל גדול. עם חשמל: מצלמת 4G לשקע</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 110px;"><strong>סים</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">ננו, בלי PIN, לא נעול למכשיר, עם חבילת גלישה, אחד לכל מצלמה</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">לבטל את ה-PIN בטלפון, או לקחת סים מאיתנו</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 110px;"><strong>כרטיס זיכרון</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">הגודל המקסימלי לפי דף המוצר, ואם הוא כלול באריזה</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">לקנות כרטיס מראש, לפני שנוסעים לאתר</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 110px;"><strong>גובה וגניבה</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">2 עד 3 מטרים למצלמת סוללה, על עמוד או קיר, פאנל מחוץ להישג יד</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">מצלמה שנייה שרואה את הראשונה, וגיבוי בענן בדגמים שתומכים בו</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 110px;"><strong>התראות</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">מי שנכנס חוצה את התמונה, בלי עצים, כביש או שמש מול העדשה</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">להזיז את המצלמה, או לקבוע מתי ההתראות פעילות</td></tr>
<tr><td style="padding: 10px; border-bottom: 1px solid #ddd; min-width: 110px;"><strong>התקנה</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">יש סולם, כלים וזמן להגיע לאתר?</td><td style="padding: 10px; border-bottom: 1px solid #ddd;">לשלוח תמונות של המקום בווצאפ ולקבל הצעה להתקנה</td></tr>
</tbody></table></div>

<p>עברתם על הרשימה ועדיין לא בטוחים איזה דגם מתאים? שלחו לנו בווצאפ תמונה של הנקודה ותיאור קצר של מה שאתם רוצים לראות, ונעזור לבחור.</p>`;

const FAQ_HTML = `<section style="margin-top: 3rem; padding: 2rem; background: rgba(15,52,96,0.05); border-radius: 12px;">
        <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem; color: var(--accent, #e94560);">שאלות נפוצות</h2>
${FAQ.map(
  (f) => `          <details style="margin-bottom: 1rem; padding: 1rem; background: var(--card, #fff); border-radius: 8px; border: 1px solid var(--border, #eee);">
            <summary style="font-weight: bold; cursor: pointer; color: var(--text, #333); font-size: 1.1rem;">${f.q}</summary>
            <p style="margin-top: 0.75rem; line-height: 1.8; color: var(--text, #555);">${f.a}</p>
          </details>`,
).join('\n')}
      </section>`;

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
    isPartOf: { '@type': 'Blog', '@id': 'https://www.site-control-il.com/blog', name: 'בלוג Site-Control' },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'דף הבית', item: 'https://www.site-control-il.com' },
      { '@type': 'ListItem', position: 2, name: 'בלוג', item: 'https://www.site-control-il.com/blog' },
      { '@type': 'ListItem', position: 3, name: TITLE, item: CANONICAL },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
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
          <span>{TITLE}</span>
        </nav>
        <article style={{ lineHeight: '1.8', color: 'var(--text)' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text)', marginTop: '2rem' }}>
            {H1}
          </h1>
          <img
            src={`/blog-images/${SLUG}/hero.webp`}
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
          <div dangerouslySetInnerHTML={{ __html: BODY }} />
          <div dangerouslySetInnerHTML={{ __html: FAQ_HTML }} />
          <div style={{ marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>לא בטוחים איזה דגם מתאים לכם?</h3>
            <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>חמש שאלות קצרות בחנות שלנו ותקבלו המלצה מנומקת עם מחיר משוער, או שאלו אותנו בווצאפ</p>
            <a href="/store/finder" style={{ display: 'inline-block', padding: '12px 32px', background: '#e94560', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              לשאלון ההתאמה בחנות
            </a>
          </div>
        </article>
      </div>
    </>
  );
}
