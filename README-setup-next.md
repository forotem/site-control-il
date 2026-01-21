# שלד Next.js (App Router)

נוצר שלד בסיסי עם קומפוננטות Hero/Features/Packages/Proof/FAQ וקבצי sitemap/robots.

## שימוש בתמונות
- כל הוריאציות נוצרו ב- `optimized-variants/` במבנה תיקיות זהה למקור.
- כדי ש-Next.js ישרת את התמונות, הזז או העתק את `optimized-variants/` לתוך `public/optimized-variants/`.
- הנתיב בבקוד הוא `/optimized-variants/...` ולכן נדרש מיקום זה תחת `public`.

## הפעלה
```bash
npm install
npm run dev
```

## קבצים עיקריים
- `app/layout.tsx` – מטהדאטה בסיסית ושפת המסמך (RTL).
- `app/page.tsx` – הרכבת העמוד הראשי.
- `app/components/*` – Hero, פיצ'רים, קרוסלה, חבילות, הוכחות, FAQ.
- `app/data/*` – מקורות תוכן/תמונות.
- `app/sitemap.ts`, `app/robots.ts` – SEO טכני בסיסי (עדכן דומיין ב-`example.com`).

## התאמות מומלצות
- לעדכן דומיין אמיתי ב-sitemap/robots.
- להחליף טקסטים/CTA לפי הצורך.
- להוסיף דפי משנה (packages, products, use-cases) עם אותה שיטת data + components.
- לשנות `next.config.mjs` לפי הצורך (לדוגמה, הגדרת דומיינים חיצוניים אם מוסיפים).

## הערות
- הגדרתי `images.unoptimized: false` (ברירת מחדל). אם רוצים לבנות סטטי ללא אופטימיזציה של Next, אפשר להפוך ל-`true`.
- הטיפוגרפיה והצבעים ב-`app/globals.css` בסיסיים; מומלץ לשדך לפלטת מותג.
