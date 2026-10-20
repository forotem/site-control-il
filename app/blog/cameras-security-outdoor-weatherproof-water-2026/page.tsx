import { Metadata } from 'next';

const SLUG = 'cameras-security-outdoor-weatherproof-water-2026';
const CANONICAL = `https://www.site-control-il.com/blog/${SLUG}`;
const HERO = `https://www.site-control-il.com/blog-images/${SLUG}/hero-v2.webp`;
const SEO_TITLE = 'מצלמות אבטחה חיצוניות עמידות למים: IP66, IP67 ו-IK10';
const SHARE_TITLE = SEO_TITLE;
const H1 = 'מצלמות אבטחה חיצוניות עמידות למים: מה באמת אומרים IP66, IP67 ו-IK10, ומה חשוב יותר מהדירוג';
const DESCRIPTION =
  'מה ההבדל בין IP66 ל-IP67, מה זה IK10, מה חום, אבק ומלח מהים עושים למצלמה בחוץ, ואיך מתקינים אותה כך שמים לא ייכנסו דרך החיבור.';
const KEYWORDS = [
  'מצלמות אבטחה חיצוניות עמידות במים',
  'מה ההבדל בין IP66 ל-IP67',
  'מצלמת אבטחה IP67',
  'מצלמה אנטי ונדלית IK10',
  'מצלמת אבטחה ליד הים',
  'איטום חיבור כבל רשת למצלמה',
  'מצלמת אבטחה לחוץ בחום',
];
const PUBLISHED = '2026-01-31';
const MODIFIED = '2026-10-17';
const HERO_ALT = 'מצלמת אבטחה חיצונית על קיר בגשם חזק, עם טיפות מים על גוף המצלמה';

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
    q: 'מה ההבדל בין IP66 ל-IP67 במצלמת אבטחה?',
    a: 'בשתיהן הספרה הראשונה היא 6, כלומר המצלמה אטומה לאבק. ההבדל הוא בבדיקת המים: IP66 נבדק מול סילוני מים חזקים מכל כיוון, ו-IP67 נבדק בטבילה זמנית במים, עד עומק של מטר. לפי התקן, מוצר שנבדק בטבילה לא בהכרח נבדק גם מול סילונים, ומוצר שעבר את שתי הבדיקות מסומן בשתיהן, למשל IP66/IP67. למצלמה על קיר, ההבדל ביניהן חשוב פחות מהאיטום של חיבור הכבל.',
  },
  {
    q: 'מה זה IK10, וצריך את זה בבית פרטי?',
    a: 'IK10 הוא דירוג עמידות למכות לפי התקן IEC 62262: המארז עומד במכה של 20 ג׳אול, כמו משקולת של 5 ק״ג שנופלת מגובה 40 ס״מ. בבית פרטי, כשהמצלמה מותקנת גבוה מתחת לגג, זה בדרך כלל לא הכרחי. בחניון, בחדר מדרגות, בכניסה לחנות או בכל מקום שאפשר להגיע אליו ביד, כיפה עם IK10 שווה את זה.',
  },
  {
    q: 'אפשר להתקין מצלמת אבטחה בבית שקרוב לים?',
    a: 'כן, אבל ליד הים הבעיה היא המלח, ודירוג IP לא בודק עמידות בקורוזיה. כדאי לבחור מצלמה שהיצרן מגדיר לה הגנה מקורוזיה, להשתמש בברגי נירוסטה ולנגב את המצלמה מדי פעם. Hikvision, למשל, מגדירה רמת הגנה בינונית לאזורי חוף במרחק של כ-2 ק״מ מקו החוף, ורמה עליונה לקו החוף עצמו. בבית בשורה הראשונה מול הים, כתבו לנו לפני שאתם קונים.',
  },
  {
    q: 'מצלמה חיצונית עומדת בחום של הקיץ בישראל?',
    a: 'תלוי בדגם ובמקום. בדפי המפרט של מצלמות Hikvision ו-Uniview שבדקנו, טווח העבודה הוא ממינוס 30 עד 60 מעלות. במצלמות Reolink כמו P330 ו-TrackMix Wired LTE הטווח הוא ממינוס 10 עד 55 מעלות. מצלמה בשמש ישירה מתחממת יותר מהאוויר שסביבה, ולכן באזורים חמים כדאי להתקין אותה בצל של גג או בליטה, ולהעדיף דגם שהטווח העליון שלו גבוה יותר.',
  },
  {
    q: 'למה נכנסים מים למצלמה שמדורגת IP67?',
    a: 'בדרך כלל המים לא עוברים דרך גוף המצלמה אלא מגיעים ממקום שהדירוג לא מכסה: חיבור כבל הרשת שנשאר חשוף, מים שזורמים לאורך הכבל אל החיבור, חור בקיר שלא נאטם או מכסה כיפה שלא נסגר עד הסוף. קופסת חיבורים, לולאת טפטוף בכבל ואיטום של החור בקיר פותרים את רוב המקרים האלה.',
  },
  {
    q: 'מצלמות Wi-Fi לחוץ עמידות למים?',
    a: 'הדגמים החיצוניים כן. למשל Reolink E1 Outdoor ו-Tenda CT3 מדורגות IP66, ו-Reolink Argus 3 Pro ו-Lumus מדורגות IP65. הדירוג חל על המצלמה עצמה, לא על ספק הכוח ולא על השקע. אם השקע נמצא בחוץ, הוא צריך להיות שקע מוגן מים, והספק צריך להיות בפנים או בקופסה מוגנת. וחשוב לבדוק שה-Wi-Fi חזק מספיק בנקודה שבה מתקינים.',
  },
];

const TH = 'padding: 10px; text-align: right;';
const TD = 'padding: 10px; border-bottom: 1px solid #ddd; vertical-align: top;';

const BODY_HTML = `<nav style="background: rgba(15,52,96,0.05); padding: 1.25rem 1.5rem; border-radius: 10px; margin-bottom: 2rem;"><strong>תוכן העניינים</strong><ul style="margin-top: 0.5rem;"><li><a href="#short-answer">התשובה הקצרה</a></li><li><a href="#ip-code">מה אומר הקוד IP</a></li><li><a href="#ip66-ip67">IP66 או IP67: מה עדיף</a></li><li><a href="#ik10">IK10: עמידות למכות</a></li><li><a href="#israel">מה התנאים בישראל עושים למצלמה</a></li><li><a href="#catalog">אילו מצלמות בחנות עומדות באיזה דירוג</a></li><li><a href="#install">ההתקנה חשובה יותר מהדירוג</a></li><li><a href="#wifi-solar">מצלמות Wi-Fi וסולאריות</a></li><li><a href="#maintenance">תחזוקה: מה לבדוק פעם בכמה חודשים</a></li><li><a href="#choose">מה מתאים לאיזה מקום</a></li></ul></nav>

<p>על מצלמות חוץ כתוב בדרך כלל דירוג כמו IP65, IP66 או IP67, ועל חלק מהכיפות גם IK10. אלה לא מילים שיווקיות. אלה קודים מתקנים בינלאומיים, ולכל ספרה בהם יש משמעות מדויקת. אבל הם בודקים את המארז של המצלמה, במעבדה, בתנאים מוגדרים.</p>

<p>על קיר של בית בישראל המצלמה פוגשת דברים אחרים: שמש ישירה בקיץ, אבק בימי שרב, אוויר מלוח ליד הים, וגשם עם רוח בחורף. ולא פעם, מה שמקלקל מצלמה בחוץ הוא לא הגשם שפוגע בה, אלא המים שמגיעים לחיבור של הכבל.</p>

<p>במדריך הזה נסביר מה הקודים אומרים ומה הם לא אומרים, אילו מצלמות בחנות שלנו נושאות איזה דירוג, ואיך מתקינים מצלמה בחוץ כך שתחזיק שנים.</p>

<h2 id="short-answer">התשובה הקצרה</h2>

<ul>
<li><strong>IP66 ו-IP67 אטומות לאבק באותה מידה.</strong> ההבדל הוא במים: IP66 נבדקת מול סילוני מים חזקים, IP67 מול טבילה זמנית. למצלמה על קיר, שתיהן מתאימות.</li>
<li><strong>IK10 עוסק במכות, לא במים.</strong> הוא חשוב במקום שאפשר להגיע אליו ביד: חניון, חדר מדרגות, כניסה לחנות.</li>
<li><strong>בישראל כדאי לבדוק גם את טווח טמפרטורת העבודה</strong> בדף המפרט, ובבית קרוב לים גם הגנה מקורוזיה. את שני אלה דירוג IP לא בודק.</li>
<li><strong>ההתקנה קובעת יותר מהדירוג:</strong> קופסת חיבורים, לולאת טפטוף בכבל, איטום של חיבור הרשת ושל החור בקיר, ומיקום מתחת לגג או לבליטה.</li>
</ul>

<h2 id="ip-code">מה אומר הקוד IP (התקן IEC 60529)</h2>

<p>IP הוא קיצור של Ingress Protection, הגנה מפני חדירה. הקוד מוגדר בתקן הבינלאומי IEC 60529, ובנוי משתי ספרות. הראשונה מתארת הגנה מפני גופים מוצקים ואבק, והשנייה הגנה מפני מים. כשמופיע X במקום אחת הספרות, היצרן לא מציין דרגה לאותו סוג של הגנה.</p>

<p>חשוב לדעת גם מה הקוד לא בודק. התקן עצמו מציין שמכות, קורוזיה, קרינת שמש ולחות שנוצרת מעיבוי לא נמצאות בתחום שלו, ומשאיר אותן לתקנים של סוגי המוצרים השונים. לכן מצלמה עם IP67 יכולה להיות מצוינת מול גשם, ועדיין לא מתאימה לבית מול הים או לקיר שעומד בשמש כל היום.</p>

<h3>הספרה הראשונה: אבק</h3>

<p>בכל המצלמות החיצוניות בחנות שלנו שהדירוג מופיע במפרט שלהן, הספרה הראשונה היא 6, כלומר "אטום לאבק": בבדיקה לא נכנס אבק בכלל. בדרגה 5, "מוגן מאבק", מותר שייכנס מעט אבק, כל עוד הוא לא פוגע בפעולה. אבק של יום שרב נכנס לכל חריץ, ולכן למצלמה בחוץ רוצים 6.</p>

<h3>הספרה השנייה: מים</h3>

<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; margin: 1rem 0;"><thead><tr style="background: #0f3460; color: #fff;"><th style="${TH}">ספרה</th><th style="${TH}">מה נבדק לפי התקן</th><th style="${TH}">מה זה אומר בחוץ</th></tr></thead><tbody>
<tr><td style="${TD} white-space: nowrap;">4</td><td style="${TD}">התזת מים מכל כיוון</td><td style="${TD}">גשם. מופיע בחלק ממצלמות הסוללה, יחד עם 6 לאבק: IP64</td></tr>
<tr><td style="${TD} white-space: nowrap;">5</td><td style="${TD}">סילוני מים מנחיר של 6.3 מ״מ, מכל כיוון</td><td style="${TD}">גשם חזק עם רוח</td></tr>
<tr><td style="${TD} white-space: nowrap;">6</td><td style="${TD}">סילוני מים חזקים מנחיר של 12.5 מ״מ, מכל כיוון</td><td style="${TD}">סערה, מים שניתזים מהגג או ממרזב</td></tr>
<tr><td style="${TD} white-space: nowrap;">7</td><td style="${TD}">טבילה זמנית במים, עד עומק של מטר</td><td style="${TD}">גם טבילה קצרה לא מכניסה מים בכמות מזיקה. על קיר זה כמעט לא קורה</td></tr>
<tr><td style="${TD} white-space: nowrap;">8</td><td style="${TD}">טבילה ממושכת, בתנאים שהיצרן מגדיר</td><td style="${TD}">ציוד שעובד מתחת למים. לא רלוונטי למצלמה על קיר</td></tr>
</tbody></table></div>

<p>שימו לב לדבר אחד: מכונת שטיפה בלחץ גבוה חזקה בהרבה מהסילון שבודקים בו IP66. כשמנקים קיר או גג, לא מכוונים אותה ישר למצלמה.</p>

<h2 id="ip66-ip67">IP66 או IP67: מה עדיף?</h2>

<p>הטעות הנפוצה היא לחשוב ש-IP67 הוא IP66 ועוד קצת. זה לא כך. כל ספרה מייצגת בדיקה אחרת: 6 בודקת סילונים, 7 בודקת טבילה. לפי התקן, מוצר עם הספרה 7 לא בהכרח נבדק גם מול סילוני מים. מוצר שעבר את שתי הבדיקות מסומן בשתיהן, למשל IP66/IP67.</p>

<p>מה זה אומר בפועל? מצלמה על קיר לא טובלת במים. היא חוטפת גשם מכל כיוון, לפעמים עם רוח חזקה, ומים שזורמים על הקיר ולאורך הכבל. היצרנים מגדירים מצלמות עם שני הדירוגים לשימוש בחוץ, וההבדל ביניהם כמעט לא מורגש על קיר. מה שמשנה הרבה יותר הוא אם החיבור של הכבל אטום, ואם המצלמה עומדת במקום שהמים זורמים אליו.</p>

<p>מצלמות סוללה וסולאריות רבות מדורגות IP64 או IP65. למשל, Reolink Go PT Ultra מדורגת IP64 ו-Reolink Go Plus מדורגת IP65. הן עדיין מצלמות חוץ, אבל כדאי להתקין אותן מתחת לבליטה כשאפשר, ולוודא שכבל הפאנל מחובר עד הסוף ושהשקע לא נשאר חשוף.</p>

<h2 id="ik10">IK10: עמידות למכות (התקן IEC 62262)</h2>

<p>הקוד IK מוגדר בתקן IEC 62262, שמדרג את ההגנה של מארזים לציוד חשמלי מפני מכות מכניות מבחוץ. הדרגה נקבעת לפי האנרגיה של המכה, בג׳אול:</p>

<ul>
<li><strong>IK08:</strong> מכה של 5 ג׳אול, כמו משקולת של 1.7 ק״ג שנופלת מגובה 30 ס״מ.</li>
<li><strong>IK10:</strong> מכה של 20 ג׳אול, כמו משקולת של 5 ק״ג שנופלת מגובה 40 ס״מ.</li>
</ul>

<p>IK10 היא הדרגה הגבוהה בסולם, ואותה תמצאו בדרך כלל בכיפות שמוגדרות אנטי-ונדליות. היא אומרת שהמארז עמד במכות האלה בבדיקה. היא לא אומרת שאי אפשר לרסס צבע על הכיפה, לכסות אותה בשקית, לסובב אותה עם מקל או לתלוש אותה מהקיר. לכן גם מצלמת IK10 מתקינים גבוה מספיק כדי שלא יגיעו אליה ביד, ומעבירים את הכבל בתוך הקיר או בצינור.</p>

<p>בבית פרטי, כשהמצלמה תלויה מתחת לגג בגובה של קומה, IK10 הוא בדרך כלל לא הכרחי. בחניון, בחדר מדרגות, בכניסה לחנות ובמחסן בשטח פתוח, הוא שווה את זה. דוגמה מהחנות: כיפת <a href="/store/ipc3524le-adf28k-wp">Uniview IPC3524LE</a>, שבדף המפרט שלה מופיעים IP67 לפי IEC 60529 ו-IK10 לפי IEC 62262, עם תאורה לבנה לצבע בלילה.</p>

<h2 id="israel">מה התנאים בישראל עושים למצלמה</h2>

<h3>חום ושמש ישירה</h3>

<p>בדף המפרט של כל מצלמה יש שורה של טמפרטורת עבודה. בדפי המפרט של מצלמות Hikvision ו-Uniview שבדקנו לכתבה הזאת, כמו Hikvision DS-2CD1347G2-LUF ו-Uniview IPC3524LE, הטווח הוא ממינוס 30 עד 60 מעלות. במצלמות Reolink כמו <a href="/store/reolink-p330">P330</a> ו-TrackMix Wired LTE הטווח הוא ממינוס 10 עד 55 מעלות.</p>

<p>כמה חם אצלנו? לפי <a href="https://ims.gov.il/sites/default/files/2025-09/%D7%A1%D7%99%D7%9B%D7%95%D7%9D%20%D7%90%D7%95%D7%92%D7%95%D7%A1%D7%98%202025.pdf" target="_blank" rel="noopener">הסיכום החודשי של השירות המטאורולוגי לאוגוסט 2025</a>, ב-13 באוגוסט נמדדו באילת 48.8 מעלות, שיא חדש לחודש אוגוסט בתחנה, ובגלגל שבבקעת הירדן 49.7 מעלות. אלה מדידות של טמפרטורת האוויר. מצלמה שתלויה בשמש ישירה, על קיר שסופג חום כל אחר הצהריים, מתחממת יותר מהאוויר שסביבה.</p>

<p>לכן בערבה, בבקעה ובכל קיר שחשוף לשמש, שווה לשים לב לגבול העליון בדף המפרט, ולהתקין את המצלמה בצל של גג או בליטה. בצד הקר, הטווחים האלה מכסים את החורף ברוב הארץ. הבעיה של החורף היא מים, לא קור.</p>

<h3>אבק ושרב</h3>

<p>אבק לא נכנס למצלמה שהספרה הראשונה שלה היא 6, אבל הוא מצטבר על הזכוכית שמול העדשה ועל נורות האינפרא. ביום התמונה נראית מטושטשת, ובלילה שכבת האבק מחזירה חלק מאור האינפרא ומלבינה את התמונה. אחרי ימי אובך כדאי לנגב את הזכוכית במטלית רכה ולחה.</p>

<h3>מלח מהים</h3>

<p>ליד הים הסכנה היא לא המים אלא המלח. הוא מאכל ברגים, זרועות ומחברים, ולפעמים גם את הגוף. כאן דירוג IP לא עוזר, כי הוא לא בודק קורוזיה בכלל. היצרנים מתייחסים לזה בנפרד. Hikvision, למשל, מסווגת בדפי המפרט שלה את המצלמות לשלוש רמות של עמידות בקורוזיה:</p>

<ul>
<li><strong>הגנה עליונה:</strong> לקו החוף, לנמלים ולמפעלים כימיים.</li>
<li><strong>הגנה בינונית:</strong> לאזורי חוף במרחק של כ-2 ק״מ מקו החוף, ולאזורים עם גשם חומצי.</li>
<li><strong>ללא הגנה ייעודית:</strong> למקומות שבהם לא צריך הגנה מקורוזיה.</li>
</ul>

<p>מצלמת הצינור <a href="/store/ds-2cd2t87g3-lis2uy-sl-2-8mm">Hikvision DS-2CD2T87G3-LIS2UY/SL</a> מסווגת ברמה הבינונית, עם גוף מתכת והגנה מקורוזיה לפי NEMA 4X. מצלמת הטורט DS-2CD1347G2-LUF מסווגת ללא הגנה ייעודית: היא מתאימה לחצר בפנים הארץ, ופחות לבית ליד הים. ובית בשורה הראשונה מול הים הוא כבר קו החוף, ולפי הסיווג של היצרן עצמו הוא שייך לרמה העליונה. במקרה כזה כתבו לנו לפני שאתם קונים, ונבדוק מה מתאים.</p>

<h3>גשם בחורף</h3>

<p>הגוף של מצלמה עם IP66 או IP67 עומד בגשם. הנקודות החלשות הן החיבור של הכבל, החור בקיר, מכסה של כיפה שלא נסגר עד הסוף, וקופסה או שקע שלא נאטמו. על כל אלה בסעיף ההתקנה.</p>

<h2 id="catalog">אילו מצלמות בחנות עומדות באיזה דירוג</h2>

<p>הדירוגים בטבלה לקוחים מהמפרט של כל מוצר בחנות. המחיר העדכני מופיע בדף המוצר.</p>

<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; margin: 1rem 0;"><thead><tr style="background: #0f3460; color: #fff;"><th style="${TH}">דירוג</th><th style="${TH}">דוגמאות מהחנות</th><th style="${TH}">מתאים ל</th></tr></thead><tbody>
<tr><td style="${TD} white-space: nowrap;">IP67 + IK10</td><td style="${TD}">כיפות: Uniview IPC3524LE, Hikvision DS-2CD2143G2-IU, Hikvision DS-2CD2183G2-IU, Reolink P327</td><td style="${TD}">חניון, חדר מדרגות, כניסה לחנות</td></tr>
<tr><td style="${TD} white-space: nowrap;">IP67</td><td style="${TD}">צינור: Reolink P330, HiWatch HWI-B180HA-LU, Uniview IPC2318LE, Hikvision DS-2CD2T87G3-LIS2UY/SL. פנורמית: Reolink Duo 3 PoE. מצלמת שטח 4G: Reolink Talon Pro</td><td style="${TD}">חצר, חניה, שער</td></tr>
<tr><td style="${TD} white-space: nowrap;">IP66</td><td style="${TD}">PoE: Reolink CX410, P340, P344. Wi-Fi: <a href="/store/reolink-e1-outdoor-e540">Reolink E1 Outdoor</a>, Duo 2 WiFi, Tenda CT3. 4G: Reolink Duo 2 LTE</td><td style="${TD}">חצר וכניסה, עדיף מתחת לבליטה</td></tr>
<tr><td style="${TD} white-space: nowrap;">IP65</td><td style="${TD}">Reolink Go Plus, TrackMix LTE, TrackMix Wired LTE, Argus 3 Pro, Lumus, Tenda CH9</td><td style="${TD}">חוץ, מתחת לגג או לבליטה</td></tr>
<tr><td style="${TD} white-space: nowrap;">IP64</td><td style="${TD}">Reolink Go PT Ultra, Go PT Plus, Go Ranger</td><td style="${TD}">חוץ, במקום מוגן יחסית מגשם ישיר</td></tr>
</tbody></table></div>

<p>את כל המצלמות הקוויות אפשר לראות ב<a href="/store/c/ip">קטגוריית מצלמות IP</a>, את מצלמות ה-Wi-Fi ב<a href="/store/c/wifi">מצלמות Wi-Fi לבית ולעסק</a>, ואת המצלמות למקום בלי חשמל ובלי אינטרנט ב<a href="/store/c/solar">מצלמות סולאריות 4G</a>.</p>

<h2 id="install">ההתקנה חשובה יותר מהדירוג</h2>

<p>מצלמה עם IP67 שהותקנה לא נכון יכולה להיכשל מהר יותר ממצלמה עם IP65 שהותקנה טוב. אלה הפרטים שעושים את ההבדל.</p>

<h3>קופסת חיבורים</h3>

<p>ממצלמת IP יוצא זנב קצר עם מחבר רשת (RJ45), ולפעמים גם שקע חשמל. החיבור בין הזנב הזה לכבל הרשת לא אטום מעצמו, והוא אחת הנקודות הרגישות במערכת. קופסת חיבורים יושבת בין המצלמה לקיר, מסתירה את החיבור ומגינה עליו מגשם. ל-Reolink יש את <a href="/store/reolink-b10">קופסת B10</a> למצלמות צינור ואת D20 למצלמות כיפה, ובדף של כל קופסה כתוב לאילו דגמים היא מתאימה. גם בדפי המפרט של מצלמות Hikvision ו-Uniview שבדקנו מופיעה קופסת חיבורים מתאימה, תחת אביזרים.</p>

<h3>איטום חיבור הרשת</h3>

<p>אם החיבור נשאר בחוץ ולא בתוך קופסה, אוטמים אותו. אם הגיע עם המצלמה כיסוי אטימה לחיבור הרשת, מרכיבים אותו לפי ההוראות, כולל טבעת הגומי. אם לא, מכניסים את החיבור לקופסה אטומה. סרט בידוד לבד לא מחזיק לאורך זמן בשמש ובגשם.</p>

<h3>לולאת טפטוף</h3>

<p>מים זורמים לאורך הכבל. אם הכבל מגיע לחיבור מלמעלה, המים יגיעו בדיוק לשם. הפתרון פשוט: משאירים בכבל לולאה קטנה שיורדת מתחת לנקודת הכניסה, כך שהמים מטפטפים מהנקודה הנמוכה של הלולאה ולא ממשיכים פנימה.</p>

<h3>החור בקיר</h3>

<p>קודחים את החור בשיפוע קל כלפי מטה לכיוון החוץ, כך שמים לא זורמים פנימה, ואוטמים סביב הכבל בסיליקון לשימוש חוץ. בכיפות, בודקים שהמכסה יושב עד הסוף ושהאטם לא נתפס בין החלקים.</p>

<h3>מתחת לגג או לבליטה</h3>

<p>מצלמה מתחת לגג או לבליטה של מרפסת מקבלת פחות גשם ישיר ופחות שמש, ונשארת נקייה יותר. רק להקפיד שהבליטה לא תהיה צמודה לעדשה: משטח קרוב לעדשה מחזיר בלילה את אור האינפרא ומסנוור את המצלמה. אחרי ההתקנה בודקים תמונת לילה, ומוודאים שהגג לא נכנס לפריים.</p>

<h3>הזווית לשמש</h3>

<p>שמש נמוכה שנכנסת ישר לעדשה הופכת חלק מהתמונה ללבן ואת השאר לכהה, ובשעות האלה רואים מעט מאוד. בישראל השמש עוברת בצהריים בצד הדרומי של השמים, כך שמצלמה שפונה צפונה כמעט לא מקבלת שמש ישירה לעדשה. מצלמה שפונה מזרחה תקבל אותה בבוקר, ומצלמה שפונה מערבה לפני השקיעה. מטים את המצלמה מעט כלפי מטה, כך שהאופק לא יהיה בתמונה. WDR עוזר מול תאורה חזקה מאחור, כמו פתח מואר, אבל הוא לא פותר שמש שנכנסת ישר לעדשה.</p>

<h3>כבל, ברגים וחשמל</h3>

<ul>
<li><strong>כבל:</strong> כבל רשת שמיועד לחוץ, או כבל בתוך צינור. מעטה של כבל לפנים מתייבש ונסדק בשמש.</li>
<li><strong>ברגים:</strong> ליד הים, ברגי נירוסטה. ברגים רגילים מחלידים באוויר מלוח.</li>
<li><strong>חשמל:</strong> הדירוג של המצלמה לא חל על הספק ועל השקע. שקע בחוץ צריך להיות מוגן מים, והספק בפנים או בקופסה מוגנת.</li>
</ul>

<p>אם אתם מעדיפים שמישהו אחר יעשה את זה, <a href="/installation">ההתקנה</a> אצלנו היא שירות נפרד, בכל הארץ בתיאום. שולחים <a href="https://wa.me/972508277907">בווצאפ</a> כמה תמונות או סרטון קצר של המקום ואיפה רוצים מצלמות, ואחרי שראינו נחזור עם הצעת מחיר להתקנה. מי שמתקין לבד קונה את הציוד בחנות. המשלוח לא כלול במחיר ומתומחר לפי הכתובת.</p>

<h2 id="wifi-solar">מצלמות Wi-Fi וסולאריות: מה שונה</h2>

<p><strong>מצלמות Wi-Fi לחוץ</strong> מקבלות את אותם דירוגים, אבל יש להן שתי נקודות חלשות משלהן. הראשונה היא החשמל: מצלמה שמתחברת לשקע צריכה ספק ושקע, ואלה בדרך כלל לא עמידים למים כמו המצלמה. מצלמות סוללה פותרות את זה, אבל צריך לטעון אותן או לחבר להן פאנל. השנייה היא הקליטה: קיר בטון ומרחק מהראוטר מחלישים את האות. לפני שמתקינים, בודקים בטלפון שה-Wi-Fi חזק בנקודה עצמה. לנקודה רחוקה בחצר, כבל רשת עדיף.</p>

<p><strong>מצלמות סולאריות 4G</strong> עומדות בשמש כל היום, כי הפאנל צריך אותה. מכוונים את הפאנל דרומה, בשיפוע, ובודקים שהכבל שלו מחובר עד הסוף ושלא נשארו שקעים פתוחים. אבק על הפאנל מקטין את הטעינה. פירטנו את כל זה ב<a href="/blog/solar-4g-camera-maintenance-guide-2026">מדריך התחזוקה למצלמות סולאריות 4G</a>. ולבית שעומד ריק חלק מהשנה, כמו בית נופש או נכס כפרי, יש לנו גם <a href="/blog/villa-rural-home-security-cameras">מדריך למצלמות לוילות ולבתים כפריים</a>.</p>

<h2 id="maintenance">תחזוקה: מה לבדוק פעם בכמה חודשים</h2>

<ul>
<li><strong>ניקוי הזכוכית או הכיפה</strong> במטלית רכה ולחה, בלי חומרים שוחקים. אחרי ימי שרב ואובך, ובמקום מאובק לעתים קרובות יותר.</li>
<li><strong>קורי עכביש וחרקים</strong> מול העדשה. בלילה המצלמה רואה בהם תנועה, ושולחת התראות מיותרות.</li>
<li><strong>אדים או טיפות בתוך הכיפה</strong> הם סימן שנכנסה לחות. בודקים קודם את החיבור, את אטם המכסה ואת החור בקיר.</li>
<li><strong>ברגים, זרוע וכבל</strong> אחרי סערה, ובמיוחד ליד הים: שאין חלודה, שהזרוע לא זזה ושהכבל לא נסדק.</li>
<li><strong>שכבת מלח</strong> על מצלמה ליד הים: מנגבים את הגוף והזכוכית מדי פעם במטלית לחה.</li>
<li><strong>הקלטה:</strong> נכנסים למקליט או לאפליקציה ובודקים שכל המצלמות מקליטות, וגם איך נראית תמונת הלילה.</li>
</ul>

<h2 id="choose">מה מתאים לאיזה מקום</h2>

<ul>
<li><strong>חצר של בית בפנים הארץ:</strong> IP66 או IP67, מתחת לבליטה, עם קופסת חיבורים ולולאת טפטוף.</li>
<li><strong>בית קרוב לים:</strong> מצלמה שהיצרן מגדיר לה הגנה מקורוזיה, ברגי נירוסטה, וניגוב של המלח מדי פעם.</li>
<li><strong>חניון, חדר מדרגות, כניסה לחנות:</strong> כיפה עם IK10, גבוה ככל האפשר, עם כבל בתוך הקיר.</li>
<li><strong>ערבה, בקעה, קיר חשוף לשמש:</strong> מצלמה שהטווח העליון שלה גבוה, מותקנת בצל.</li>
<li><strong>מקום בלי חשמל ובלי אינטרנט:</strong> מצלמה סולארית 4G, עם פאנל שפונה דרומה.</li>
</ul>

<p>הדירוג על הקופסה הוא נקודת התחלה. מה שקובע אם המצלמה תעבוד גם אחרי כמה חורפים הוא איפה היא תלויה, איך הכבל מגיע אליה, ומי זוכר לנגב אותה פעם בכמה חודשים.</p>`;

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
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>לא בטוחים איזו מצלמה מתאימה למקום שלכם?</h3>
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
