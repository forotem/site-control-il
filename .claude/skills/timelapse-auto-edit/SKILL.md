---
name: timelapse-auto-edit
description: >
  עריכה אוטומטית של סרטוני טיים-לאפס מאתרי בנייה (פרויקט זבוטינסקי ואחרים)
  עבור עסק הטיים-לאפס של rotem/timelapseit. השתמש בסקיל הזה בכל בקשה
  שקשורה ל"עריכת mp4", "טיים-לאפס", "עריכה אוטומטית", "דה-פליקר", "deflicker",
  סינון פריימים, או עיבוד גלם וידאו ב-Colab/OpenCV/ffmpeg. מכיל את העדפות
  העריכה של הלקוח, מבנה הפייפליין, ואת דרך הגישה הנכונה לקבצי הגלם ב-Google Drive.
---

# עריכת טיים-לאפס אוטומטית — זבוטינסקי / timelapseit

מסמך זה מרכז את מה שנלמד על אופן העבודה והעדפות העריכה. עדכן אותו כשמשהו משתנה.

## הקשר (מי / מה)

- העסק: טיים-לאפס לאתרי בנייה (`timelapseit11@gmail.com`, מותג golanstudio).
- פרויקט לדוגמה: **זבוטינסקי 59** — צילום אתר בנייה לאורך חודשים.
- סביבת העבודה: **Google Colab** + **OpenCV (cv2)** + **NumPy**, קריאה/כתיבה ל-Google Drive.
- שם המחברת הרלוונטית ב-Drive: `עריכת mp4`.

## ⚠️ איפה נמצא הגלם (הטעות הכי נפוצה)

קבצי הגלם של זבוטינסקי **בבעלות `info@golanstudio.co.il`** ורק *משותפים* עם
המשתמש — הם **לא** נמצאים ב-`My Drive` שלו.

מכאן נובעות שתי מלכודות שגרמו ל"נמצאו 0 קבצים":

1. `/content/drive/MyDrive/...` מכיל רק קבצים ש**המשתמש הוא הבעלים שלהם**. קבצים
   משותפים לעולם לא יופיעו שם.
2. תיקיות כמו `#טיימלאפס/re-new/זבוטינסקי 59` הן לרוב **קיצור דרך (shortcut)**
   לתיקייה המשותפת — ו-`os.walk()` **אינו נכנס לקיצורי דרך של Drive**. לכן
   הלולאה לא מקבלת אף פריים.

**אל תסתמך על `os.walk` מעל `MyDrive`.** גַלֵּה קבצים דרך **Drive API לפי מזהה
תיקייה (Folder ID)** — עובד ללא תלות בבעלות או בקיצורי דרך.

מזהי תיקיות ידועים (נכון ל-2026):

| Folder ID | תוכן |
|---|---|
| `1sZhV2MvlVZJzxQH6wKGnFLe3XNRQDb1f` | זבוטינסקי 59 — קבצים ראשיים (כולל `master`, "עד יולי 2026") |
| `1Y55Q_M3hpGaUOd0U_k7Wr4RYHkQSfON8` | זבוטינסקי — קליפים חודשיים היסטוריים |

הערה חשובה: חלק מהקבצים בתיקיות האלה הם **פלטים ערוכים** (`master`, "עד סוף",
טווחי תאריכים), לא גלם מצלמה. אין לעבד פלט ערוך מחדש — לוודא שמצביעים על גלם אמיתי.

## איך הלקוח אוהב את העריכה (העדפות סגנון)

הסגנון המועדף: **טיים-לאפס חלק (smooth timelapse)** — לא real-time, לא cut clean.

1. **דגימת פריימים** — שמירת פריים 1 מכל `FRAME_STEP` (ברירת מחדל 5). זה מה שנותן
   את תחושת ההאצה של הטיים-לאפס.
2. **סינון איכות** — לפסול פריימים לפי:
   - חושך / לילה: `avg_lum < MIN_LUM` (60)
   - סנוור / חשיפת-יתר: `avg_lum > MAX_LUM` (210)
   - טשטוש / תנועה / טיפות על העדשה: `sharpness < MIN_SHARPNESS` (Laplacian variance < 15)
3. **דה-פליקר חכם** — זה החלק הכי חשוב לאיכות. **אין** לנרמל כל פריים לערך קבוע
   (הבאג המקורי היה `gain = 128 / avg_lum`). זה משטח את הסרטון וגורם ל"pumping".
   במקום זאת: לכוון לעקומת בהירות **מוחלקת בזמן** (rolling median מעל חלון פריימים),
   כדי לנטרל פליקר מהיר בין פריימים סמוכים אבל **לשמר** את המעבר הטבעי של האור
   לאורך היום (זריחה → צהריים → שקיעה). ה-gain **מוגבל** (clamp) ל-0.7–1.4 כדי
   שאף פריים בודד לא יתוקן יתר על המידה.
4. **ללא אודיו** — בטיים-לאפס דגום (1 מכל 5) האודיו לא מסונכרן ולכן נזרק בכוונה.
   (אם עוברים אי-פעם ל-clean-cut בזמן אמת — אז מוסיפים אודיו דרך ffmpeg, כי
   OpenCV לא כותב אודיו.)

## מבנה הפייפליין (איך זה עובד)

עיבוד **דו-שלבי** — הכרחי כדי לאפשר החלקה טמפורלית בלי להחזיק את כל הפריימים ב-RAM:

- **מעבר 1 — תכנון:** לסרוק את כל הקבצים, לבחור פריימים (דגימה + סינון איכות),
  ולאסוף את עקומת הבהירות (`lums`) של הפריימים הנבחרים.
- **חישוב ביניים:** מעקומת הבהירות מחשבים יעד מוחלק (rolling median) ו-`gain`
  מוגבל לכל פריים נבחר.
- **מעבר 2 — רינדור:** לקרוא שוב את הקבצים, להחיל את ה-gain, לשנות גודל
  לרזולוציית הפלט, ולכתוב את קובץ הפלט.

עלות: מפענח את הווידאו פעמיים (~פי 2 זמן) — זה המחיר של דה-פליקר טמפורלי תקין.
אם המהירות חשובה יותר מאיכות הפליקר: `DEFLICKER = False`.

## פרמטרים לכיוונון

- `FRAME_STEP` — מהירות הטיים-לאפס (גבוה יותר = מהיר יותר).
- `OUTPUT_FPS` — קצב הפלט (ברירת מחדל 30). לא לקודד קשיח ל-25.
- `SMOOTH_WINDOW` — חצי-חלון ההחלקה. אם עדיין יש פליקר → להגדיל (25–30);
  אם שטוח/שטוף מדי → להקטין.
- `GAIN_MIN` / `GAIN_MAX` — כמה חזק מותר לתקן בהירות.
- `MIN_LUM` / `MAX_LUM` / `MIN_SHARPNESS` — ספי פסילת פריימים.
- **פלט:** תמיד לכתוב ל-`/content/drive/MyDrive/...` — המשתמש בעלים של מה שהוא יוצר,
  אז אין בעיית הרשאות בפלט.

## סקריפט ייחוס (שתי תאים ל-Colab)

### תא 1 — גילוי והורדת קבצים (Drive API, עמיד לקבצים משותפים)

```python
from google.colab import auth
auth.authenticate_user()
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io, os

drive_service = build('drive', 'v3')

FOLDER_IDS = ['1sZhV2MvlVZJzxQH6wKGnFLe3XNRQDb1f']   # אפשר להוסיף עוד תיקיות
LOCAL_DIR  = '/content/raw'
os.makedirs(LOCAL_DIR, exist_ok=True)

input_files = []
for folder_id in FOLDER_IDS:
    q = (f"'{folder_id}' in parents and mimeType='video/mp4' "
         f"and trashed=false and not name contains 'עריכה'")
    resp = drive_service.files().list(
        q=q, fields="files(id,name,size)", pageSize=1000,
        includeItemsFromAllDrives=True, supportsAllDrives=True).execute()
    for f in resp.get('files', []):
        print(f"  - {f['name']} ({int(f.get('size',0))/1e6:.0f} MB)")
        dst = os.path.join(LOCAL_DIR, f['name'])
        if not os.path.exists(dst):                 # הורדה מקומית פעם אחת
            req = drive_service.files().get_media(fileId=f['id'])
            buf = io.FileIO(dst, 'wb')
            downloader = MediaIoBaseDownload(buf, req)
            done = False
            while not done:
                _, done = downloader.next_chunk()
            buf.close()
        input_files.append(dst)

input_files.sort()
print(f"\nמוכנים לעריכה: {len(input_files)} קבצים.")
```

### תא 2 — עריכה (סינון + דה-פליקר חכם + רינדור דו-שלבי)

```python
import cv2
import numpy as np

# ----------------------- הגדרות -----------------------
OUTPUT_PATH   = '/content/drive/MyDrive/זבוטינסקי_59_עריכה_אוטומטית.mp4'
FRAME_STEP    = 5
OUTPUT_FPS    = 30.0
OUTPUT_W      = None      # None = לפי הקובץ הראשון
OUTPUT_H      = None
MIN_LUM       = 60
MAX_LUM       = 210
MIN_SHARPNESS = 15.0
DEFLICKER     = True
SMOOTH_WINDOW = 15
GAIN_MIN      = 0.7
GAIN_MAX      = 1.4
# ------------------------------------------------------

def frame_metrics(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    return float(np.mean(gray)), float(cv2.Laplacian(gray, cv2.CV_64F).var())

assert input_files, "אין קבצים — הרץ קודם את תא 1."

cap0 = cv2.VideoCapture(input_files[0])
src_w = int(cap0.get(cv2.CAP_PROP_FRAME_WIDTH)) or 1920
src_h = int(cap0.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 1080
cap0.release()
out_w, out_h = OUTPUT_W or src_w, OUTPUT_H or src_h

# --- מעבר 1: תכנון ---
print("[מעבר 1/2] בוחר פריימים...")
plan, lums, skipped = [], [], 0
for v_path in input_files:
    cap = cv2.VideoCapture(v_path)
    f_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        f_idx += 1
        if f_idx % FRAME_STEP != 0:
            continue
        avg_lum, sharp = frame_metrics(frame)
        if avg_lum < MIN_LUM or avg_lum > MAX_LUM or sharp < MIN_SHARPNESS:
            skipped += 1
            continue
        plan.append((v_path, f_idx))
        lums.append(avg_lum)
    cap.release()

kept = len(plan)
assert kept, "לא נבחר אף פריים — בדוק ספי פסילה."
print(f"נבחרו {kept}, נפסלו {skipped}.")

# --- דה-פליקר: יעד בהירות מוחלק (לא קבוע!) ---
gains = [1.0] * kept
if DEFLICKER:
    arr = np.asarray(lums, dtype=np.float64)
    for i in range(kept):
        lo, hi = max(0, i - SMOOTH_WINDOW), min(kept, i + SMOOTH_WINDOW + 1)
        target = float(np.median(arr[lo:hi]))
        gains[i] = float(np.clip(target / max(arr[i], 1.0), GAIN_MIN, GAIN_MAX))
gain_of = {k: gains[i] for i, k in enumerate(plan)}

# --- מעבר 2: רינדור ---
print("[מעבר 2/2] מרנדר...")
out = cv2.VideoWriter(OUTPUT_PATH, cv2.VideoWriter_fourcc(*'mp4v'),
                      OUTPUT_FPS, (out_w, out_h))
written = 0
for v_path in input_files:
    cap = cv2.VideoCapture(v_path)
    f_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        f_idx += 1
        g = gain_of.get((v_path, f_idx))
        if g is None:
            continue
        if g != 1.0:
            frame = cv2.convertScaleAbs(frame, alpha=g, beta=0)
        if (frame.shape[1], frame.shape[0]) != (out_w, out_h):
            frame = cv2.resize(frame, (out_w, out_h))
        out.write(frame)
        written += 1
    cap.release()
out.release()
print(f"\nהושלם! {written} פריימים (~{written/OUTPUT_FPS:.1f}ש') → {OUTPUT_PATH}")
```

## צ'קליסט לפתרון תקלות

- **"נמצאו 0 קבצים"** → כמעט תמיד בעיית קבצים משותפים / קיצור דרך. השתמש ב-Drive
  API לפי Folder ID (תא 1), לא ב-`os.walk` מעל `MyDrive`.
- **הסרטון "מהבהב" / קופץ בבהירות (pumping)** → הגדל `SMOOTH_WINDOW`, ודא שלא
  משתמשים בנרמול לערך קבוע.
- **הסרטון שטוח / שטוף** → הקטן `SMOOTH_WINDOW` או צמצם את טווח ה-gain.
- **הפלט פגום כשמערבבים קליפים** → מקורות ברזולוציות שונות; ה-`cv2.resize`
  לרזולוציית הפלט מטפל בזה.
- **הפלט מעובד יתר על המידה** → כנראה הוזן פלט ערוך (`master`/טווח תאריכים) במקום גלם.
