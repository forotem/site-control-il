// בדיקת הזיהוי הסלחני של הודעות מהאתר (app/lib/site-wa-prefills.ts) וקוד הפנייה בקישורי ווצאפ (app/lib/wa-ref.ts).
// 7.10.2026: הליד צביקה כתב "כהיי, אני מתעניין ב-..." וטל לא זיהה אותו. הבדיקה מוכיחה שמעכשיו כן, ושטקסט חופשי עדיין null.
// הרצה: node automation/qa/wa-prefills.test.cjs   (מקמפל את ה-TS בזיכרון עם typescript, בלי build)
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ts = require('typescript');

const ROOT = path.join(__dirname, '../..');
function load(rel, stubs = {}) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const m = { exports: {} };
  new Function('module', 'exports', 'require', js)(m, m.exports, (id) => stubs[id] || require(id));
  return m.exports;
}

const prefills = load('app/lib/site-wa-prefills.ts');
const waRef = load('app/lib/wa-ref.ts', { './site-wa-prefills': prefills, './attribution': { getAttribution: () => null } });
const { siteSourceOf, waRefOf, stripWaRef } = prefills;
const { hrefWithWaRef, makeWaRef, isWhatsAppHref } = waRef;

let n = 0;
const eq = (got, want, label) => { n++; assert.strictEqual(got, want, `${label}\n  got:  ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`); };

// זיהוי מקור
eq(siteSourceOf('היי, אני מתעניין ב-Reolink Go PT Ultra'), 'התעניינות במוצר מהאתר', 'הטקסט המקורי');
eq(siteSourceOf('כהיי, אני מתעניין ב-Reolink Go PT Ultra'), 'התעניינות במוצר מהאתר', 'אות מיותרת לפני היי (צביקה, 7.10)');
eq(siteSourceOf('אבגהיי, אני מתעניין ב-X'), 'התעניינות במוצר מהאתר', '3 תווים מיותרים');
eq(siteSourceOf('אבגדהיי, אני מתעניין ב-X'), null, '4 תווים מיותרים = לא מזהים');
eq(siteSourceOf('היי,אני מתעניין ב-X'), 'התעניינות במוצר מהאתר', 'בלי רווח אחרי הפסיק');
eq(siteSourceOf('היי אני מתעניין ב-X'), 'התעניינות במוצר מהאתר', 'בלי פסיק');
eq(siteSourceOf('\n\n   היי, אני מחפש אינטרקום'), 'כפתור צף: אינטרקום', 'שורות ריקות ורווחים בהתחלה');
eq(siteSourceOf('‏היי, אני מחפש מצלמות אבטחה לבית'), 'כפתור צף: מצלמות לבית', 'סימן כיווניות בהתחלה');
eq(siteSourceOf('שלום אשמח לייעוץ לגבי מצלמות אבטחה / אינטרקום'), 'כפתור ווצאפ צף באתר', 'שלום בלי פסיק');
eq(siteSourceOf('היי, אני מתעניין ב-Reolink Go PT Ultra (מצלמה, מק"ט 123). האם יש במלאי ומה זמן האספקה?'), 'כפתור ווצאפ בדף מוצר', 'הספציפי לפני הכללי');
eq(siteSourceOf('היי מה המחיר'), null, 'טקסט חופשי');
eq(siteSourceOf('היי'), null, 'רק היי');
eq(siteSourceOf('בוקר טוב, יש לכם מצלמות?'), null, 'הודעה רגילה');
eq(siteSourceOf(''), null, 'ריק');
eq(siteSourceOf('היי, אני מתעניין ב-Reolink Go PT Ultra. האם יש במלאי ומה זמן האספקה?\nמס\' פנייה: SCW-7KQ2MN'), 'כפתור ווצאפ בדף מוצר', 'שורת קוד פנייה בסוף לא מפריעה');
eq(siteSourceOf('כהיי, אני מתעניין ב-X\nמס\' פנייה: SCW-7KQ2MN'), 'התעניינות במוצר מהאתר', 'אות מיותרת + קוד');
eq(siteSourceOf('שלום, רציתי לשאול על מצלמה\nמס\' פנייה: SCW-7KQ2MN'), 'כפתור ווצאפ באתר (לפי קוד פנייה)', 'טקסט שונה אבל יש קוד = מהאתר');
eq(siteSourceOf('היי, הגעתי מהאתר\nמס\' פנייה: SCW-7KQ2MN'), 'כפתור ווצאפ באתר', 'קישור בלי טקסט ממולא');

// קוד פנייה
eq(waRefOf('היי, אני מתעניין ב-X\nמס\' פנייה: SCW-7KQ2MN'), 'SCW-7KQ2MN', 'חילוץ קוד');
eq(waRefOf('מס פנייה scw-7kq2mn תודה'), 'SCW-7KQ2MN', 'אותיות קטנות');
eq(waRefOf('SCW-7KQ2M'), null, '5 תווים');
eq(waRefOf('SCW-7KQ2M0'), null, '0 לא באלפבית');
eq(waRefOf('SCW-7KQ2MI'), null, 'I לא באלפבית');
eq(waRefOf('היי מה המחיר'), null, 'בלי קוד');
eq(stripWaRef('היי, אני מתעניין ב-X\nמס\' פנייה: SCW-7KQ2MN'), 'היי, אני מתעניין ב-X', 'הסרת שורת הקוד');

// יצירת קוד: 6 תווים מהאלפבית, תמיד שונה
for (let i = 0; i < 200; i++) assert.match(makeWaRef(), /^SCW-[A-HJ-NP-Z2-9]{6}$/, 'פורמט הקוד');
n++;
assert.notStrictEqual(makeWaRef(), makeWaRef(), 'שני קודים שונים'); n++;

// קישור עם קוד
const base = 'https://wa.me/972502256866?text=' + encodeURIComponent('היי, אני מתעניין ב-X. האם יש במלאי?');
const withRef = hrefWithWaRef(base, 'SCW-ABCDEF');
const textOf = (href) => new URL(href).searchParams.get('text');
eq(textOf(withRef), 'היי, אני מתעניין ב-X. האם יש במלאי?\nמס\' פנייה: SCW-ABCDEF', 'הקוד בשורה אחרונה');
eq(withRef.includes('+'), false, 'רווחים כ-%20 ולא + (ווצאפ מציג + כפלוס)');
eq(withRef.startsWith('https://wa.me/972502256866?text='), true, 'הכתובת נשמרת');
eq(siteSourceOf(textOf(withRef)), 'התעניינות במוצר מהאתר', 'הטקסט עם הקוד עדיין מזוהה');
eq(textOf(hrefWithWaRef(withRef, 'SCW-ZZZZZZ')), 'היי, אני מתעניין ב-X. האם יש במלאי?\nמס\' פנייה: SCW-ZZZZZZ', 'לחיצה שנייה מחליפה קוד ולא מוסיפה');
eq(textOf(hrefWithWaRef('https://wa.me/972502256866', 'SCW-ABCDEF')), 'היי, הגעתי מהאתר\nמס\' פנייה: SCW-ABCDEF', 'קישור בלי טקסט מקבל פתיחה');
eq(hrefWithWaRef('https://wa.me/972502256866', 'SCW-ABCDEF').startsWith('https://wa.me/972502256866?text='), true, 'קישור בלי טקסט: המבנה');
eq(textOf(hrefWithWaRef('https://api.whatsapp.com/send?phone=972502256866&text=' + encodeURIComponent('היי'), 'SCW-ABCDEF')), 'היי\nמס\' פנייה: SCW-ABCDEF', 'api.whatsapp.com');
eq(hrefWithWaRef('https://api.whatsapp.com/send?phone=972502256866&text=x', 'SCW-ABCDEF').includes('phone=972502256866'), true, 'פרמטרים אחרים נשמרים');
eq(hrefWithWaRef('tel:+972502256866', 'SCW-ABCDEF'), null, 'לא ווצאפ');
eq(hrefWithWaRef('/store', 'SCW-ABCDEF'), null, 'קישור יחסי');
eq(isWhatsAppHref('https://wa.me/972502256866?text=a'), true, 'wa.me');
eq(isWhatsAppHref('https://example.com/wa.me/'), false, 'לא wa.me');

console.log(`wa-prefills: ${n} בדיקות עברו`);
