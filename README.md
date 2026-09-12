# Site-Control

אתר Next.js 14 (App Router, עברית RTL) עבור Site-Control — מצלמות אבטחה סולאריות 4G וטיימלאפס לאתרי בנייה, חקלאות ושטחים מבודדים בישראל.

חי בכתובת: https://www.site-control-il.com

## הרצה מקומית

```bash
npm install
npm run dev   # http://localhost:3002
```

⚠️ הפרויקט יושב על Google Drive (כונן G:) — `npm run build` מקומי עלול להיכשל עם שגיאת `EINVAL` בגלל מגבלת מערכת הקבצים. לבדיקת טיפוסים בלבד:

```bash
npx tsc --noEmit
```

בנייה בפועל מתבצעת רק בוורסל (דיפלוי אוטומטי מכל push ל-`master`).

## מבנה

- `app/` — עמודי Next.js (App Router), כולל `app/blog/<slug>/page.tsx` לכל פוסט
- `app/data/` — תוכן מובנה: פוסטי בלוג, מיקומים, חבילות, פיצ'רים, תמונות
- `automation/` — בוט בלוג אוטומטי (`blog-bot.js`) ובוט שיפור פוסטים ישנים (`update-old-posts.js`), מבוססי Gemini + Google Search Console
- `.github/workflows/` — הרצה מתוזמנת של הבוטים דרך GitHub Actions
- `docs/` — תיעוד עסקי, SEO ותוכניות עבודה

## אוטומציית בלוג

הבוט (`automation/blog-bot.js`) רץ פעמיים בשבוע, שולף הזדמנויות SEO מ-GSC (או מציע נושא חדש עם Gemini כשאין), כותב פוסט מלא כולל תמונת hero, ומבצע commit+push אוטומטי. פרטים ב-[docs/AUTO-BLOG-SYSTEM.md](docs/AUTO-BLOG-SYSTEM.md) ותוכנית עבודה עדכנית ב-[docs/WORK-PLAN-2026-09.md](docs/WORK-PLAN-2026-09.md).

דורש שני GitHub Secrets: `GEMINI_API_KEY` ו-`GSC_SERVICE_ACCOUNT` (מפתח JSON של חשבון שירות עם הרשאת קריאה ב-Search Console).
