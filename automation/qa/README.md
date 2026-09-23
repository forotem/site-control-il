# QA אוטומטי לאתר

להריץ אחרי כל שינוי, מול build מקומי (`npm run build && npx next start -p 3005`) או מול הפרודקשן:

```bash
node automation/qa/crawl.mjs http://localhost:3005     # קישורים, תמונות, SEO, סכמות
node automation/qa/visual.cjs http://localhost:3005    # דפדפן אמיתי ב-375/768/1280 + תרחישי צ'אט, עגלה ושאלון
node automation/qa/data.cjs                            # מחירים, תמונות, מאפיינים, 2,500 צירופי שאלון, ידע של טל
```

שגיאות 400 של `/_next/image` מופיעות רק ב-`next start` מקומי בווינדוס (נתיבים בעברית) ואינן באג בפרודקשן.
