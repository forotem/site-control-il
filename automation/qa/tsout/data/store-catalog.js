"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeProducts = exports.storeCategories = exports.deliveryOptions = exports.WARRANTY_TEXT = exports.WHATSAPP_NUMBER = void 0;
exports.WHATSAPP_NUMBER = "972502256866";
exports.WARRANTY_TEXT = "אחריות שנה על כל המוצרים";
exports.deliveryOptions = [
    { id: "courier", title: "משלוח עד הבית", desc: "שליח עד 3-5 ימי עסקים, בתוספת דמי משלוח" },
    { id: "pickup", title: "איסוף עצמי", desc: "ללא עלות, בתיאום מראש" },
    { id: "install", title: "התקנה על ידי הצוות שלנו", desc: "מתקין מוסמך מגיע אליך, לפי הצעת מחיר" },
];
exports.storeCategories = [
    {
        "id": "ip",
        "name": "מצלמות IP",
        "blurb": "מצלמות רשת PoE של Hikvision ו-UNV, מ-4MP ועד 8MP, עם ראיית לילה צבעונית וזיהוי אדם/רכב."
    },
    {
        "id": "kits",
        "name": "ערכות מצלמות מוכנות",
        "blurb": "ערכות Reolink עם מקליט, 4 עד 8 מצלמות, כבלים ודיסק. מחברים ועובד."
    },
    {
        "id": "recorders",
        "name": "מקליטים NVR / DVR",
        "blurb": "מקליטי רשת ומקליטים היברידיים, 4 עד 32 ערוצים. נמכרים ללא דיסק, מתאימים לכל דיסק סטנדרטי."
    },
    {
        "id": "intercom",
        "name": "אינטרקום ובקרת כניסה",
        "blurb": "אינטרקום וידאו לוילה ולבניין, קודנים, מסופי זיהוי פנים וטביעת אצבע."
    },
    {
        "id": "wifi",
        "name": "מצלמות Wi-Fi לבית ולעסק",
        "blurb": "מצלמות Tenda עצמאיות, חיבור חשמל בלבד, מעקב אוטומטי וראיית לילה צבעונית."
    },
    {
        "id": "analog",
        "name": "מצלמות אנלוגיות",
        "blurb": "מצלמות Turbo HD ו-TVI לשדרוג מערכות קיימות על כבל קואקס, כולל ColorVu 3K ו-4K."
    }
];
exports.storeProducts = [
    {
        "slug": "ds-kis607-s",
        "brand": "Hikvision",
        "model": "DS-KIS607-S",
        "sku": null,
        "title": "ערכת אינטרקום וידאו IP לוילה Hikvision DS-KIS607-S כולל מסך מגע 7\" ומתג PoE",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 1349,
        "specs": [
            "ערכה מלאה: פנל דלת IP עם מצלמת 2MP (1080p, זווית אופקית 131°), מסך פנימי 7\" 1024x600 עם Wi-Fi, מתג PoE 4 פורטים, מודול ממסר, כרטיס מנהל, 5 תגים, כרטיס TF 32GB וספק",
            "שליטה מלאה מאפליקציית Hik-Connect: שיחה, פתיחת דלת וצפייה חיה מרחוק",
            "הזנה PoE סטנדרטית - התקנה בכבל רשת אחד",
            "שמירת הודעות ותמונות מבקרים בכרטיס TF",
            "תמיכה בעד 16 מסכים פנימיים במערכת"
        ],
        "image": "/store-images/ds-kis607-s.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000119433/DS-KIS607-S_Datasheet_20241012.pdf",
        "highlights": [
            "ערכה מלאה: פנל דלת IP עם מצלמת 2MP (1080p, זווית אופקית 131°), מסך פנימי 7\" 1024x600 עם Wi-Fi, מתג PoE 4 פורטים, מודול ממסר, כרטיס מנהל, 5 תגים, כרטיס TF 32GB וספק",
            "שליטה מלאה מאפליקציית Hik-Connect: שיחה, פתיחת דלת וצפייה חיה מרחוק",
            "הזנה PoE סטנדרטית - התקנה בכבל רשת אחד"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-kis212",
        "brand": "Hikvision",
        "model": "DS-KIS212",
        "sku": null,
        "title": "ערכת אינטרקום וידאו אנלוגי 4 גידים Hikvision DS-KIS212 - פנל HD-TVI ומסך 7\"",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 869,
        "specs": [
            "ערכה 4 גידים Plug & Play: פנל חיצוני DS-KB2412T-IM עם מצלמת HD-TVI ומסך פנימי DS-KH2230T 7\" TFT עם לחצנים פיזיים",
            "איכות וידאו HD-TVI (720p/1080p) - חיווט פשוט ללא רשת",
            "לחיצה אחת לשיחה ולחיצה אחת לפתיחת דלת",
            "תמיכה בעד 2 פנלי דלת ו-3 מסכים פנימיים במערכת",
            "הזנה 12VDC, צריכה עד 5W, טמפ' עבודה -10 עד +55°C, התקנה על הטיח"
        ],
        "image": "/store-images/ds-kis212.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000110586/DS-KIS212_Four-Wire-HD-Video-Intercom-Kit_Datasheet_20240311.pdf",
        "highlights": [
            "ערכה 4 גידים Plug & Play: פנל חיצוני DS-KB2412T-IM עם מצלמת HD-TVI ומסך פנימי DS-KH2230T 7\" TFT עם לחצנים פיזיים",
            "איכות וידאו HD-TVI (720p/1080p) - חיווט פשוט ללא רשת",
            "לחיצה אחת לשיחה ולחיצה אחת לפתיחת דלת"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-kv8213-wme1",
        "brand": "Hikvision",
        "model": "DS-KV8213-WME1(C)",
        "sku": null,
        "title": "פנל אינטרקום IP לוילה Hikvision DS-KV8213-WME1(C) - 2 לחצנים, מצלמת 2MP, Wi-Fi/PoE, קורא כרטיסים",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 709,
        "specs": [
            "מצלמת 2MP HD עם תאורת IR, זווית 124° אופקי / 75° אנכי",
            "2 לחצני קריאה פיזיים - מתאים לבית דו-משפחתי / 2 יחידות דיור",
            "קורא כרטיסי Mifare מובנה (13.56MHz), עד 10,000 משתמשים",
            "חיבור Wi-Fi 802.11b/g/n או רשת קווית 10/100; הזנה PoE או 12VDC",
            "גוף אלומיניום, אטימות IP65 ועמידות IK08, טמפ' -40 עד +53°C",
            "מידות 174x91x29 מ\"מ, אפליקציית Hik-Connect"
        ],
        "image": "/store-images/ds-kv8213-wme1.webp",
        "datasheet": null,
        "highlights": [
            "מצלמת 2MP HD עם תאורת IR, זווית 124° אופקי / 75° אנכי",
            "2 לחצני קריאה פיזיים - מתאים לבית דו-משפחתי / 2 יחידות דיור",
            "קורא כרטיסי Mifare מובנה (13.56MHz), עד 10,000 משתמשים"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-kv8413-wme1",
        "brand": "Hikvision",
        "model": "DS-KV8413-WME1(C)",
        "sku": null,
        "title": "פנל אינטרקום IP לוילה Hikvision DS-KV8413-WME1(C) - 4 לחצנים, מצלמת 2MP, Wi-Fi/PoE, קורא כרטיסים",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 869,
        "specs": [
            "מצלמת 2MP HD עם תאורת IR וזווית רחבה",
            "4 לחצני קריאה - מתאים לבניין/כניסה עם עד 4 יחידות דיור",
            "קורא כרטיסי Mifare מובנה, פתיחה מאפליקציית Hik-Connect",
            "Wi-Fi או רשת קווית, הזנה PoE או 12VDC",
            "גוף מתכת, IP65/IK08, התקנה על הטיח (גרסת Flush זמינה בנפרד)"
        ],
        "image": "/store-images/ds-kv8413-wme1.webp",
        "datasheet": null,
        "highlights": [
            "מצלמת 2MP HD עם תאורת IR וזווית רחבה",
            "4 לחצני קריאה - מתאים לבניין/כניסה עם עד 4 יחידות דיור",
            "קורא כרטיסי Mifare מובנה, פתיחה מאפליקציית Hik-Connect"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-kv6124-wbe1",
        "brand": "Hikvision",
        "model": "DS-KV6124-WBE1",
        "sku": null,
        "title": "פנל אינטרקום IP לוילה Hikvision DS-KV6124-WBE1 - מצלמת 4MP 150°, קודן, כרטיס, Bluetooth, Wi",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 769,
        "specs": [
            "מצלמת 4MP ברזולוציה גבוהה עם זווית צפייה רחבה 150°",
            "לחצן קריאה אחד + לוח מקשים לקוד; פתיחה בכרטיס, קוד PIN, Bluetooth, אפליקציית Hik-Connect או מהמסך הפנימי",
            "2 ממסרי נעילה - שליטה בשתי דלתות/שערים",
            "Wi-Fi 6 או רשת קווית, הזנה PoE (IEEE802.3at) או 12VDC",
            "הקלטת וידאו וצפייה בהקלטות דרך Hik-Connect / דפדפן",
            "IP65, התקנה על הטיח"
        ],
        "image": "/store-images/ds-kv6124-wbe1.webp",
        "datasheet": "https://assets.hikvision.com/prd/normal/all/doc/m000168988/DS-KV6124-WBE1_Datasheet_20260603.pdf",
        "highlights": [
            "מצלמת 4MP ברזולוציה גבוהה עם זווית צפייה רחבה 150°",
            "לחצן קריאה אחד + לוח מקשים לקוד; פתיחה בכרטיס, קוד PIN, Bluetooth, אפליקציית Hik-Connect או מהמסך הפנימי",
            "2 ממסרי נעילה - שליטה בשתי דלתות/שערים"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-kh6350-wte1",
        "brand": "Hikvision",
        "model": "DS-KH6350-WTE1",
        "sku": null,
        "title": "מסך פנימי לאינטרקום IP Hikvision DS-KH6350-WTE1 - מסך מגע 7\" 1024x600, Wi-Fi, PoE, Hik",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 629,
        "specs": [
            "מסך מגע קיבולי צבעוני 7\" TFT ברזולוציה 1024x600",
            "חיבור Wi-Fi או רשת קווית; הזנה PoE סטנדרטית או 12VDC",
            "מיקרופון ורמקול מובנים, וידאו H.265/H.264, אודיו G.711/Opus/AAC",
            "חריץ MicroSD (עד 128/256GB) להודעות ותמונות מבקרים, 8 כניסות אזעקה",
            "תמיכה ב-SIP והעברת שיחה לאפליקציית Hik-Connect; צריכה עד 5W",
            "זמין בלבן / שחור; התקנה על הקיר"
        ],
        "image": "/store-images/ds-kh6350-wte1.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/products/S000000001/S000000083/S000000129/S000000131/OFR000164/M000056209/Data_Sheet/DS-KH6350-WTE1-Video-Intercom-Network-Indoor-Station_Datasheet_20240403.pdf",
        "highlights": [
            "מסך מגע קיבולי צבעוני 7\" TFT ברזולוציה 1024x600",
            "חיבור Wi-Fi או רשת קווית; הזנה PoE סטנדרטית או 12VDC",
            "מיקרופון ורמקול מובנים, וידאו H.265/H.264, אודיו G.711/Opus/AAC"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-k1t502dbfwx-c",
        "brand": "Hikvision",
        "model": "DS-K1T502DBFWX-C",
        "sku": null,
        "title": "מסוף בקרת כניסה ואינטרקום Hikvision DS-K1T502DBFWX-C - טביעת אצבע, כרטיס Mifare/DESFire, קוד, QR, מצלמה ו",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 1069,
        "specs": [
            "אימות בטביעת אצבע, כרטיס Mifare / MF DESFire, קוד PIN וקוד QR",
            "מצלמת 2MP מובנית - אינטרקום וידאו, צפייה חיה מרחוק ו-SIP",
            "קיבולת 10,000 משתמשים ו-300,000 אירועים; כרטיס SD עד 256GB",
            "רשת TCP/IP, Wi-Fi, RS-485, Wiegand; ממסר דלת, לחצן יציאה, אזעקת חבלה",
            "IP65 - מתאים להתקנה חיצונית (מגן גשם DS-KAB502-S1 אופציונלי)"
        ],
        "image": "/store-images/ds-k1t502dbfwx-c.webp",
        "datasheet": null,
        "highlights": [
            "אימות בטביעת אצבע, כרטיס Mifare / MF DESFire, קוד PIN וקוד QR",
            "מצלמת 2MP מובנית - אינטרקום וידאו, צפייה חיה מרחוק ו-SIP",
            "קיבולת 10,000 משתמשים ו-300,000 אירועים; כרטיס SD עד 256GB"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-k1t344ebfwx-e1",
        "brand": "Hikvision",
        "model": "DS-K1T344EBFWX-E1",
        "sku": null,
        "title": "מסוף זיהוי פנים ונוכחות Hikvision DS-K1T344EBFWX-E1 - מסך 4.3\", פנים/טביעת אצבע/כרטיס EM/קוד, Wi",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 1309,
        "specs": [
            "זיהוי פנים ב-Deep Learning, מהירות זיהוי כ-0.2 שניות, מרחק 0.3-1.5 מ'",
            "עדשה כפולה 2MP רחבת זווית - עובד גם בתאורה חלשה/אפס",
            "אימות: פנים, טביעת אצבע, כרטיס EM 125kHz, קוד PIN; קיבולת ~1,500 פנים / 3,000 כרטיסים / 3,000 טביעות",
            "מסך מגע LCD 4.3\", ממשק TCP/IP, Wi-Fi, RS-485, Wiegand",
            "פונקציות בקרת כניסה ונוכחות מלאות; IP65 - מתאים לחוץ עם מגן גשם DS-KAB673-S1"
        ],
        "image": "/store-images/ds-k1t344ebfwx-e1.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/products/S000000001/S000000080/S000000103/S000000107/OFR000141/M000126769/Data_Sheet/DS-K1T344EBFWX-E1_Datasheet_20240522.pdf",
        "highlights": [
            "זיהוי פנים ב-Deep Learning, מהירות זיהוי כ-0.2 שניות, מרחק 0.3-1.5 מ'",
            "עדשה כפולה 2MP רחבת זווית - עובד גם בתאורה חלשה/אפס",
            "אימות: פנים, טביעת אצבע, כרטיס EM 125kHz, קוד PIN; קיבולת ~1,500 פנים / 3,000 כרטיסים / 3,000 טביעות"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-k1t323mbfwx-e1",
        "brand": "Hikvision",
        "model": "DS-K1T323MBFWX-E1",
        "sku": null,
        "title": "מסוף זיהוי פנים קומפקטי Hikvision DS-K1T323MBFWX-E1 - מסך 2.4\", פנים/טביעת אצבע/כרטיס Mifare/קוד, Wi",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": null,
        "specs": [
            "מסוף זיהוי פנים מסדרת Value במארז צר - מסך LCD 2.4\"",
            "עדשה רחבת זווית 2MP, זיהוי פנים מהיר ומדויק (Deep Learning)",
            "אימות: פנים, טביעת אצבע, כרטיס Mifare, קוד PIN; קיבולת ~1,000 פנים / 3,000 כרטיסים / 3,000 טביעות אצבע",
            "TCP/IP, Wi-Fi, RS-485, Wiegand; ממסר דלת ולחצן יציאה",
            "IP65, מיועד למשרדים, בנייני מגורים ומוסדות חינוך"
        ],
        "image": "/store-images/ds-k1t323mbfwx-e1.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000156946/DS-K1T323MBFWX-E1_Datasheet_20250625.pdf",
        "highlights": [
            "מסוף זיהוי פנים מסדרת Value במארז צר - מסך LCD 2.4\"",
            "עדשה רחבת זווית 2MP, זיהוי פנים מהיר ומדויק (Deep Learning)",
            "אימות: פנים, טביעת אצבע, כרטיס Mifare, קוד PIN; קיבולת ~1,000 פנים / 3,000 כרטיסים / 3,000 טביעות אצבע"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-k1t671m",
        "brand": "Hikvision",
        "model": "DS-K1T671M",
        "sku": null,
        "title": "מסוף זיהוי פנים Pro Hikvision DS-K1T671M - מסך מגע 7\", 6,000 פנים, כרטיס Mifare, IP65",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 2379,
        "specs": [
            "מסך מגע LCD 7\" ועדשה כפולה 2MP רחבת זווית - זיהוי גם בתאורה חלשה",
            "מרחק זיהוי פנים 0.3-3 מ', קיבולת 6,000 פנים ו-6,000 כרטיסי Mifare (גרסת MF מוסיפה 5,000 טביעות אצבע)",
            "TCP/IP 10/100/1000, RS-485, Wiegand; הזנה 12VDC/2A",
            "IP65, טמפ' -30 עד +60°C, מידות 290x116.5x33 מ\"מ",
            "סדרת Pro - מתאים לארגונים, בנייני משרדים ומפעלים"
        ],
        "image": "/store-images/ds-k1t671m.webp",
        "datasheet": null,
        "highlights": [
            "מסך מגע LCD 7\" ועדשה כפולה 2MP רחבת זווית - זיהוי גם בתאורה חלשה",
            "מרחק זיהוי פנים 0.3-3 מ', קיבולת 6,000 פנים ו-6,000 כרטיסי Mifare (גרסת MF מוסיפה 5,000 טביעות אצבע)",
            "TCP/IP 10/100/1000, RS-485, Wiegand; הזנה 12VDC/2A"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-7632nxi-k2",
        "brand": "Hikvision",
        "model": "DS-7632NXI-K2(D)",
        "sku": null,
        "title": "מערכת הקלטה Hikvision NVR ל-32 ערוצים AcuSense 4K, 2 דיסקים",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": null,
        "specs": [
            "32 ערוצי IP, רזולוציית הקלטה עד 12MP לערוץ",
            "רוחב פס נכנס 256Mbps / יוצא 160Mbps",
            "2 כונני SATA עד 10TB כל אחד (ללא דיסק)",
            "יציאות HDMI 4K (3840x2160) ו-VGA",
            "AcuSense: זיהוי אדם/רכב (Motion Detection 2.0), הגנה היקפית וזיהוי פנים בערוצים נבחרים",
            "H.265+/H.265/H.264+, שלדת 1U, ללא PoE"
        ],
        "image": "/store-images/ds-7632nxi-k2.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/pl/firmware/DS-7632NXI-K2D_Datasheet_20250630_PL.pdf",
        "highlights": [
            "32 ערוצי IP, רזולוציית הקלטה עד 12MP לערוץ",
            "רוחב פס נכנס 256Mbps / יוצא 160Mbps",
            "2 כונני SATA עד 10TB כל אחד (ללא דיסק)"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-7616nxi-k2",
        "brand": "Hikvision",
        "model": "DS-7616NXI-K2(D)",
        "sku": null,
        "title": "מערכת הקלטה Hikvision NVR ל-16 ערוצים AcuSense 4K, 2 דיסקים",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": 1109,
        "specs": [
            "16 ערוצי IP, רזולוציית הקלטה עד 12MP לערוץ",
            "רוחב פס נכנס/יוצא 160Mbps",
            "2 כונני SATA עד 10TB כל אחד",
            "יציאות HDMI 4K ו-VGA, פענוח עד 2x12MP / 3x8MP / 6x4MP / 12x1080p",
            "AcuSense: Motion Detection 2.0 (אדם/רכב) בכל הערוצים, זיהוי פנים 1 ערוץ / הגנה היקפית 2 ערוצים",
            "H.265+/H.265/H.264+, שלדת 1U, ללא PoE"
        ],
        "image": "/store-images/ds-7616nxi-k2.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/pl/firmware/DS-7616NXI-K2D_Datasheet_20250721.pdf",
        "highlights": [
            "16 ערוצי IP, רזולוציית הקלטה עד 12MP לערוץ",
            "רוחב פס נכנס/יוצא 160Mbps",
            "2 כונני SATA עד 10TB כל אחד"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-7616nxi-k1",
        "brand": "Hikvision",
        "model": "DS-7616NXI-K1(D)",
        "sku": null,
        "title": "מערכת הקלטה Hikvision NVR ל-16 ערוצים AcuSense 4K, דיסק אחד",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": null,
        "specs": [
            "16 ערוצי IP, רזולוציית הקלטה עד 12MP לערוץ",
            "רוחב פס נכנס 80Mbps / יוצא 160Mbps",
            "כונן SATA אחד עד 10TB",
            "יציאות HDMI 4K ו-VGA",
            "AcuSense: Motion Detection 2.0 (אדם/רכב), זיהוי פנים 1 ערוץ / הגנה היקפית 2 ערוצים",
            "H.265+/H.265/H.264+, שלדת 1U, ללא PoE"
        ],
        "image": "/store-images/ds-7616nxi-k1.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/pl/firmware/DS-7616NXI-K1D_Datasheet_20250721.pdf",
        "highlights": [
            "16 ערוצי IP, רזולוציית הקלטה עד 12MP לערוץ",
            "רוחב פס נכנס 80Mbps / יוצא 160Mbps",
            "כונן SATA אחד עד 10TB"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-7608nxi-k1-8p",
        "brand": "Hikvision",
        "model": "DS-7608NXI-K1/8P(D)",
        "sku": null,
        "title": "מערכת הקלטה Hikvision NVR ל-8 ערוצים עם 8 יציאות PoE, AcuSense 4K",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": null,
        "specs": [
            "8 ערוצי IP + מתג PoE מובנה 8 יציאות (Plug & Play)",
            "רזולוציית הקלטה עד 12MP לערוץ",
            "רוחב פס נכנס 80Mbps / יוצא 160Mbps",
            "כונן SATA אחד עד 10TB",
            "יציאות HDMI 4K ו-VGA",
            "AcuSense: Motion Detection 2.0 (אדם/רכב), זיהוי פנים 1 ערוץ / הגנה היקפית 2 ערוצים"
        ],
        "image": "/store-images/ds-7608nxi-k1-8p.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/products/S000000001/S000000002/S000000007/S000000026/OFR000042/M000058878/Data_Sheet/Datasheet-of-DS-7608NXI-K1_8P_NVRB_V4.74.000_20230209.pdf",
        "highlights": [
            "8 ערוצי IP + מתג PoE מובנה 8 יציאות (Plug & Play)",
            "רזולוציית הקלטה עד 12MP לערוץ",
            "רוחב פס נכנס 80Mbps / יוצא 160Mbps"
        ],
        "oldStock": false
    },
    {
        "slug": "ids-7232hqhi-m2-xt",
        "brand": "Hikvision",
        "model": "iDS-7232HQHI-M2/XT",
        "sku": null,
        "title": "מערכת הקלטה Hikvision DVR היברידית ל-32 ערוצים AcuSense, 2 דיסקים",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": 3349,
        "specs": [
            "32 ערוצים אנלוגיים (HDTVI/AHD/CVI/CVBS) + עד 8 ערוצי IP, סה\"כ עד 40 ערוצים",
            "הקלטה 1080p בכל הערוצים, קלט IP עד 8MP",
            "2 כונני SATA עד 10TB כל אחד",
            "יציאות HDMI 4K ו-VGA, שמע דרך קואקס",
            "AcuSense: Motion Detection 2.0 (אדם/רכב) בכל הערוצים האנלוגיים, זיהוי פנים והגנה היקפית מבוססי Deep Learning",
            "דחיסת H.265 Pro+, שלדת 1U"
        ],
        "image": "/store-images/ids-7232hqhi-m2-xt.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000120173/Datasheet-of-iDS-7232HQHI-M2_XT_V4.71.500_20240311.pdf",
        "highlights": [
            "32 ערוצים אנלוגיים (HDTVI/AHD/CVI/CVBS) + עד 8 ערוצי IP, סה\"כ עד 40 ערוצים",
            "הקלטה 1080p בכל הערוצים, קלט IP עד 8MP",
            "2 כונני SATA עד 10TB כל אחד"
        ],
        "oldStock": false
    },
    {
        "slug": "ids-7216hqhi-m1-xt",
        "brand": "Hikvision",
        "model": "iDS-7216HQHI-M1/XT",
        "sku": null,
        "title": "מערכת הקלטה Hikvision DVR היברידית ל-16 ערוצים AcuSense",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": 1829,
        "specs": [
            "16 ערוצים אנלוגיים (HDTVI/AHD/CVI/CVBS) + עד 8 ערוצי IP, סה\"כ עד 24 ערוצים",
            "הקלטה עד 3K/5MP Lite @12fps, 1080p@15fps",
            "כונן SATA אחד עד 10TB",
            "יציאות HDMI 4K ו-VGA, שמע דרך קואקס",
            "AcuSense: Motion Detection 2.0 בכל הערוצים, זיהוי פנים 4 ערוצים / הגנה היקפית 8 ערוצים, AcuSearch 8 ערוצים",
            "דחיסת H.265 Pro+, שלדת 1U"
        ],
        "image": "/store-images/ids-7216hqhi-m1-xt.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000120171/iDS-7216HQHI-M1_XT_Datasheet_20241018.pdf",
        "highlights": [
            "16 ערוצים אנלוגיים (HDTVI/AHD/CVI/CVBS) + עד 8 ערוצי IP, סה\"כ עד 24 ערוצים",
            "הקלטה עד 3K/5MP Lite @12fps, 1080p@15fps",
            "כונן SATA אחד עד 10TB"
        ],
        "oldStock": false
    },
    {
        "slug": "ids-7208hqhi-m1-xt",
        "brand": "Hikvision",
        "model": "iDS-7208HQHI-M1/XT",
        "sku": null,
        "title": "מערכת הקלטה Hikvision DVR היברידית ל-8 ערוצים AcuSense",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": 1259,
        "specs": [
            "8 ערוצים אנלוגיים (HDTVI/AHD/CVI/CVBS) + עד 4 ערוצי IP, סה\"כ עד 12 ערוצים",
            "הקלטה עד 3K/5MP Lite, 1080p@15fps",
            "כונן SATA אחד עד 10TB",
            "יציאות HDMI 4K ו-VGA, שמע דרך קואקס",
            "AcuSense: Motion Detection 2.0 בכל הערוצים, זיהוי פנים 2 ערוצים / הגנה היקפית 4 ערוצים",
            "דחיסת H.265 Pro+, שלדת 1U"
        ],
        "image": "/store-images/ids-7208hqhi-m1-xt.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000128024/iDS-7208HQHI-M1_XT_Datasheet_20241018.pdf",
        "highlights": [
            "8 ערוצים אנלוגיים (HDTVI/AHD/CVI/CVBS) + עד 4 ערוצי IP, סה\"כ עד 12 ערוצים",
            "הקלטה עד 3K/5MP Lite, 1080p@15fps",
            "כונן SATA אחד עד 10TB"
        ],
        "oldStock": false
    },
    {
        "slug": "ids-7204hqhi-m1-xt",
        "brand": "Hikvision",
        "model": "iDS-7204HQHI-M1/XT",
        "sku": null,
        "title": "מערכת הקלטה Hikvision DVR היברידית ל-4 ערוצים AcuSense",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": 1099,
        "specs": [
            "4 ערוצים אנלוגיים (HDTVI/AHD/CVI/CVBS) + עד 2 ערוצי IP, סה\"כ עד 6 ערוצים",
            "הקלטה עד 3K/5MP Lite, 1080p@15fps",
            "כונן SATA אחד עד 10TB",
            "יציאות HDMI 4K ו-VGA, שמע דרך קואקס",
            "AcuSense: Motion Detection 2.0 בכל הערוצים, זיהוי פנים 1 ערוץ / הגנה היקפית 2 ערוצים",
            "דחיסת H.265 Pro+, שלדת 1U"
        ],
        "image": "/store-images/ids-7204hqhi-m1-xt.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000128025/iDS-7204HQHI-M1_XT_Datasheet_20241018.pdf",
        "highlights": [
            "4 ערוצים אנלוגיים (HDTVI/AHD/CVI/CVBS) + עד 2 ערוצי IP, סה\"כ עד 6 ערוצים",
            "הקלטה עד 3K/5MP Lite, 1080p@15fps",
            "כונן SATA אחד עד 10TB"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2t87g2h-lisu-sl-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD2T87G2H-LISU/SL 2.8mm",
        "sku": null,
        "title": "מצלמת צינור Hikvision IP 8MP ColorVu Smart Hybrid Light עם סטרובוסקופ וסירנה, 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 1309,
        "specs": [
            "חיישן 1/1.8\" CMOS, 8MP (3840x2160), עדשה קבועה 2.8 מ\"מ F1.0",
            "Smart Hybrid Light: אינפרא-אדום + אור לבן עד 60 מ', צבע 24/7 (ColorVu)",
            "AcuSense: סיווג אדם/רכב, הגנה היקפית; הרתעה אקטיבית עם אור מהבהב וסירנה",
            "מיקרופון ורמקול מובנים (שמע דו-כיווני), WDR 130dB",
            "חריץ microSD עד 512GB, IP67, הזנה PoE / 12V DC",
            "H.265+, ONVIF"
        ],
        "image": "/store-images/ds-2cd2t87g2h-lisu-sl-2-8mm.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/products/S000000001/S000000002/S000000003/S000000025/OFR007893/M000078499/SM000058449/Data_Sheet/DS-2CD2T87G2H-LISU_SL_Datasheet_20230907.pdf",
        "highlights": [
            "חיישן 1/1.8\" CMOS, 8MP (3840x2160), עדשה קבועה 2.8 מ\"מ F1.0",
            "Smart Hybrid Light: אינפרא-אדום + אור לבן עד 60 מ', צבע 24/7 (ColorVu)",
            "AcuSense: סיווג אדם/רכב, הגנה היקפית; הרתעה אקטיבית עם אור מהבהב וסירנה"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2087g2h-liu-sl-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD2087G2H-LIU/SL 2.8mm",
        "sku": null,
        "title": "מצלמת מיני-צינור Hikvision IP 8MP ColorVu Smart Hybrid Light עם שמע דו-כיווני והתראה, 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 959,
        "specs": [
            "חיישן 1/1.8\" CMOS, 8MP (3840x2160), עדשה קבועה 2.8 מ\"מ F1.0",
            "Smart Hybrid Light: אינפרא-אדום + אור לבן עד 40 מ', צבע 24/7 (ColorVu)",
            "AcuSense: סיווג אדם/רכב; אור מהבהב וסירנה להרתעה",
            "מיקרופון ורמקול מובנים (שמע דו-כיווני), WDR 130dB",
            "חריץ microSD עד 512GB, IP67, הזנה PoE / 12V DC",
            "גוף מיני-צינור קומפקטי, H.265+"
        ],
        "image": "/store-images/ds-2cd2087g2h-liu-sl-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/sm000058455/DS-2CD2087G2H-LIU_SL-_Datasheet_20231116.pdf",
        "highlights": [
            "חיישן 1/1.8\" CMOS, 8MP (3840x2160), עדשה קבועה 2.8 מ\"מ F1.0",
            "Smart Hybrid Light: אינפרא-אדום + אור לבן עד 40 מ', צבע 24/7 (ColorVu)",
            "AcuSense: סיווג אדם/רכב; אור מהבהב וסירנה להרתעה"
        ],
        "oldStock": false
    },
    {
        "slug": "hwi-b180ha-lu-2-8mm",
        "brand": "HiWatch by Hikvision",
        "model": "HWI-B180HA-LU 2.8mm",
        "sku": null,
        "title": "מצלמת צינור HiWatch by Hikvision IP 8MP 4K Smart Hybrid Light עם מיקרופון, 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": null,
        "specs": [
            "8MP (3840x2160) 4K, עדשה קבועה 2.8 מ\"מ, זווית אופקית כ-113°",
            "Smart Hybrid Light: אינפרא-אדום / אור לבן עד 30 מ'",
            "Motion Detection 2.0 - סיווג אדם/רכב",
            "מיקרופון מובנה, WDR 120dB, רגישות 0.01 Lux",
            "IP67, הזנה PoE / 12V DC, ONVIF",
            "H.265+/H.265, 8MP@12.5fps"
        ],
        "image": "/store-images/hwi-b180ha-lu-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/normal/all/doc/m000071373/HWI-B180HA-LU_Datasheet_20260409.pdf",
        "highlights": [
            "8MP (3840x2160) 4K, עדשה קבועה 2.8 מ\"מ, זווית אופקית כ-113°",
            "Smart Hybrid Light: אינפרא-אדום / אור לבן עד 30 מ'",
            "Motion Detection 2.0 - סיווג אדם/רכב"
        ],
        "oldStock": false
    },
    {
        "slug": "hwi-t280ha-lu-2-8mm",
        "brand": "HiWatch by Hikvision",
        "model": "HWI-T280HA-LU 2.8mm",
        "sku": null,
        "title": "מצלמת כיפה (Turret) HiWatch by Hikvision IP 8MP 4K Smart Hybrid Light עם מיקרופון, 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": null,
        "specs": [
            "8MP (3840x2160) 4K, עדשה קבועה 2.8 מ\"מ",
            "Smart Hybrid Light: אינפרא-אדום / אור לבן עד 30 מ'",
            "Motion Detection 2.0 - סיווג אדם/רכב",
            "מיקרופון מובנה, WDR 120dB, רגישות 0.01 Lux",
            "IP67, הזנה PoE / 12V DC, ONVIF, כוונון 3 צירים",
            "H.265+/H.265, 8MP@12.5fps"
        ],
        "image": "/store-images/hwi-t280ha-lu-2-8mm.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/products/S000000001/S000000002/S000000003/S000000043/OFR010255/M000071376/Data_Sheet/HWI-T280HA-LU_Datasheet_20230808.pdf",
        "highlights": [
            "8MP (3840x2160) 4K, עדשה קבועה 2.8 מ\"מ",
            "Smart Hybrid Light: אינפרא-אדום / אור לבן עד 30 מ'",
            "Motion Detection 2.0 - סיווג אדם/רכב"
        ],
        "oldStock": false
    },
    {
        "slug": "ipc3628le-adf28k-wp",
        "brand": "Uniview",
        "model": "IPC3628LE-ADF28K-WP",
        "sku": null,
        "title": "מצלמת אבטחה IP טורט 8MP 4K עדשה 2.8 מ\"מ תאורה לבנה 30 מ' Uniview OwlView IPC3628LE",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 1189,
        "specs": [
            "8MP (3840x2160) חיישן CMOS 1/1.8\" עם Wise-ISP, צבע מלא 24/7 (ColorHunter)",
            "עדשה קבועה 2.8 מ\"מ F1.0, זווית אופקית 111°",
            "תאורה לבנה חמה עד 30 מ', 120dB True WDR",
            "מיקרופון מובנה, חריץ MicroSD עד 512GB",
            "Smart Intrusion Prevention (Lite) - זיהוי אדם/רכב",
            "IP67, PoE 802.3af / 12V DC, צריכה עד 3.9W"
        ],
        "image": "/store-images/ipc3628le-adf28k-wp.webp",
        "datasheet": "https://ubox-eu.oss-eu-central-1.aliyuncs.com/datacenter/doc/2a16698f-6038-4e4b-9c74-f92582b7294b/875e6d2f-b8ec-4e4a-b7b9-e94bc4984fa2.pdf",
        "highlights": [
            "8MP (3840x2160) חיישן CMOS 1/1.8\" עם Wise-ISP, צבע מלא 24/7 (ColorHunter)",
            "עדשה קבועה 2.8 מ\"מ F1.0, זווית אופקית 111°",
            "תאורה לבנה חמה עד 30 מ', 120dB True WDR"
        ],
        "oldStock": false
    },
    {
        "slug": "ipc2318le-adf28km-wp",
        "brand": "Uniview",
        "model": "IPC2318LE-ADF28KM-WP",
        "sku": null,
        "title": "מצלמת אבטחה IP צינור 8MP 4K עדשה 2.8 מ\"מ תאורה לבנה 30 מ' מיקרופון מובנה Uniview IPC2318LE",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 519,
        "specs": [
            "8MP (3840x2160) @20fps, חיישן CMOS 1/1.8\" Wise-ISP ColorHunter",
            "עדשה קבועה 2.8 מ\"מ F1.0, זווית 111°",
            "תאורה לבנה חמה עד 30 מ', 0.0003 lux, 120dB WDR",
            "מיקרופון מובנה, MicroSD עד 512GB",
            "זיהוי חדירה/חציית קו חכם (אדם/רכב)",
            "מתכת, IP67, טמפ' עבודה -30 עד 60°C, PoE 802.3af"
        ],
        "image": "/store-images/ipc2318le-adf28km-wp.webp",
        "datasheet": "https://ubox-eu.oss-eu-central-1.aliyuncs.com/datacenter/doc/f91b2eef-2748-42cc-af3a-ef9538071e71/74e7ad22-e554-440c-8dae-66fd00fe10c6.pdf",
        "highlights": [
            "8MP (3840x2160) @20fps, חיישן CMOS 1/1.8\" Wise-ISP ColorHunter",
            "עדשה קבועה 2.8 מ\"מ F1.0, זווית 111°",
            "תאורה לבנה חמה עד 30 מ', 0.0003 lux, 120dB WDR"
        ],
        "oldStock": false
    },
    {
        "slug": "ipc3626le-adf28k-wp",
        "brand": "Uniview",
        "model": "IPC3626LE-ADF28K-WP",
        "sku": null,
        "title": "מצלמת אבטחה IP טורט 6MP עדשה 2.8 מ\"מ תאורה לבנה 30 מ' Uniview OwlView IPC3626LE",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 789,
        "specs": [
            "6MP (3072x2048) חיישן CMOS 1/1.8\" Wise-ISP, ColorHunter צבע מלא בלילה",
            "עדשה קבועה 2.8 מ\"מ F1.0, זווית 110°",
            "תאורה לבנה עד 30 מ', WDR",
            "מיקרופון מובנה, MicroSD עד 512GB",
            "Ultra Motion Detection - הבחנה בין אדם לרכב",
            "IP67, PoE 802.3af, Ultra 265"
        ],
        "image": "/store-images/ipc3626le-adf28k-wp.webp",
        "datasheet": null,
        "highlights": [
            "6MP (3072x2048) חיישן CMOS 1/1.8\" Wise-ISP, ColorHunter צבע מלא בלילה",
            "עדשה קבועה 2.8 מ\"מ F1.0, זווית 110°",
            "תאורה לבנה עד 30 מ', WDR"
        ],
        "oldStock": false
    },
    {
        "slug": "ipc2316le-adf28km-wp",
        "brand": "Uniview",
        "model": "IPC2316LE-ADF28KM-WP",
        "sku": null,
        "title": "מצלמת אבטחה IP צינור 6MP עדשה 2.8 מ\"מ תאורה לבנה 30 מ' מיקרופון מובנה Uniview OwlView IPC2316LE",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": null,
        "specs": [
            "6MP (3072x2048) חיישן CMOS 1/1.8\" Wise-ISP ColorHunter",
            "עדשה קבועה 2.8 מ\"מ F1.0",
            "תאורה לבנה עד 30 מ', WDR",
            "מיקרופון מובנה (M), MicroSD",
            "זיהוי תנועה חכם אדם/רכב",
            "IP67, PoE 802.3af, Ultra 265"
        ],
        "image": "/store-images/ipc2316le-adf28km-wp.webp",
        "datasheet": "https://storage.googleapis.com/allegro-offer-attachments/2957973d4229734f9c5b795b10c35c6b79b1490e9a8880705a2f1da32787b61f",
        "highlights": [
            "6MP (3072x2048) חיישן CMOS 1/1.8\" Wise-ISP ColorHunter",
            "עדשה קבועה 2.8 מ\"מ F1.0",
            "תאורה לבנה עד 30 מ', WDR"
        ],
        "oldStock": false
    },
    {
        "slug": "ipc3614lb-af28k-dl2",
        "brand": "Uniview",
        "model": "IPC3614LB-AF28K-DL2",
        "sku": null,
        "title": "מצלמת אבטחה IP טורט 4MP עדשה 2.8 מ\"מ תאורה כפולה IR + לבנה 30 מ' מיקרופון Uniview IPC3614LB",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 259,
        "specs": [
            "4MP (2560x1440) @25fps, חיישן CMOS 1/3\"",
            "עדשה קבועה 2.8 מ\"מ F1.6, זווית 93.2°",
            "Smart Dual Light: IR ותאורה לבנה חמה עד 30 מ'",
            "מיקרופון מובנה, MicroSD עד 512GB",
            "Ultra Motion Detection (אדם/רכב), DWDR, Corridor mode",
            "IP67, PoE 802.3af / 12V DC"
        ],
        "image": "/store-images/ipc3614lb-af28k-dl2.webp",
        "datasheet": null,
        "highlights": [
            "4MP (2560x1440) @25fps, חיישן CMOS 1/3\"",
            "עדשה קבועה 2.8 מ\"מ F1.6, זווית 93.2°",
            "Smart Dual Light: IR ותאורה לבנה חמה עד 30 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ipc2124lb-af28k-dl2",
        "brand": "Uniview",
        "model": "IPC2124LB-AF28K-DL2",
        "sku": null,
        "title": "מצלמת אבטחה IP צינור 4MP עדשה 2.8 מ\"מ תאורה כפולה IR + לבנה 30 מ' מיקרופון Uniview IPC2124LB",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 259,
        "specs": [
            "4MP (2560x1440) @25fps, חיישן CMOS 1/3\"",
            "עדשה קבועה 2.8 מ\"מ F1.6, זווית 93.2°",
            "Smart Dual Light: IR ותאורה לבנה חמה עד 30 מ'",
            "מיקרופון מובנה, MicroSD",
            "Ultra Motion Detection (אדם/רכב), DWDR",
            "IP67, PoE 802.3af / 12V DC"
        ],
        "image": "/store-images/ipc2124lb-af28k-dl2.webp",
        "datasheet": "https://ubox-eu.oss-eu-central-1.aliyuncs.com/datacenter/doc/b25ea374-ad2b-4339-9f1c-c0c7d56ff4ad/02917cce-7d40-4968-9fae-885039867a8c.pdf",
        "highlights": [
            "4MP (2560x1440) @25fps, חיישן CMOS 1/3\"",
            "עדשה קבועה 2.8 מ\"מ F1.6, זווית 93.2°",
            "Smart Dual Light: IR ותאורה לבנה חמה עד 30 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ipc3524le-adf28k-wp",
        "brand": "Uniview",
        "model": "IPC3524LE-ADF28K-WP",
        "sku": null,
        "title": "מצלמת אבטחה IP כיפה אנטי-ונדלית IK10 4MP עדשה 2.8 מ\"מ תאורה לבנה 30 מ' Uniview OwlView IPC3524LE",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 329,
        "specs": [
            "4MP (2688x1520) חיישן CMOS 1/1.8\" Wise-ISP ColorHunter",
            "עדשה קבועה 2.8 מ\"מ F1.0, זווית רחבה 124.3°",
            "תאורה לבנה חמה עד 30 מ', 120dB True WDR",
            "מיקרופון מובנה, MicroSD",
            "Smart Intrusion Prevention (Lite) - חדירה/חציית קו",
            "IP67 + IK10 אנטי-ונדלי, PoE 802.3af, צריכה עד 4W"
        ],
        "image": "/store-images/ipc3524le-adf28k-wp.webp",
        "datasheet": "https://ubox-eu.oss-eu-central-1.aliyuncs.com/datacenter/doc/34e28b23-efeb-4cf6-a640-43d8d458120d/a12eaef2-05a0-4b53-a754-40a0fc3a607e.pdf",
        "highlights": [
            "4MP (2688x1520) חיישן CMOS 1/1.8\" Wise-ISP ColorHunter",
            "עדשה קבועה 2.8 מ\"מ F1.0, זווית רחבה 124.3°",
            "תאורה לבנה חמה עד 30 מ', 120dB True WDR"
        ],
        "oldStock": false
    },
    {
        "slug": "ipc3615le-adf28k-g",
        "brand": "Uniview",
        "model": "IPC3615LE-ADF28K-G",
        "sku": null,
        "title": "מצלמת אבטחה IP טורט 5MP עדשה 2.8 מ\"מ IR 30 מ' מיקרופון מובנה Uniview IPC3615LE",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": null,
        "specs": [
            "5MP (2880x1620) חיישן CMOS 1/2.7\" Starlight",
            "עדשה קבועה 2.8 מ\"מ",
            "IR חכם עד 30 מ', 120dB WDR",
            "מיקרופון מובנה, MicroSD",
            "זיהוי תנועה, ROI, מסיכת פרטיות, ANR",
            "IP67, PoE 802.3af (עד 6W)"
        ],
        "image": "/store-images/ipc3615le-adf28k-g.webp",
        "datasheet": null,
        "highlights": [
            "5MP (2880x1620) חיישן CMOS 1/2.7\" Starlight",
            "עדשה קבועה 2.8 מ\"מ",
            "IR חכם עד 30 מ', 120dB WDR"
        ],
        "oldStock": false
    },
    {
        "slug": "nvr302-32b-iq",
        "brand": "Uniview",
        "model": "NVR302-32B-IQ",
        "sku": null,
        "title": "מערכת הקלטה NVR 32 ערוצים 4K עד 12MP 2 דיסקים קשיחים AI Uniview NVR302",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": 879,
        "specs": [
            "32 ערוצי IP, רזולוציה עד 12MP, Ultra 265/H.265/H.264",
            "רוחב פס כניסה 160Mbps / יציאה 128Mbps",
            "2 מפרצי SATA, עד 20TB (10TB לדיסק), ללא דיסק",
            "יציאות HDMI (4K) + VGA",
            "AI: זיהוי/השוואת פנים, זיהוי רכב, חדירה, מעקב אובייקט, מפת חום, חיפוש חכם",
            "ONVIF, תמיכה במצלמות צד ג', NDAA"
        ],
        "image": "/store-images/nvr302-32b-iq.webp",
        "datasheet": "https://www.uniview.com/res/202407/19/20240719_1905894_UNV%20NVR302-B-IQ%20Series%20Network%20Video%20Recorder_994567_168459_0.pdf",
        "highlights": [
            "32 ערוצי IP, רזולוציה עד 12MP, Ultra 265/H.265/H.264",
            "רוחב פס כניסה 160Mbps / יציאה 128Mbps",
            "2 מפרצי SATA, עד 20TB (10TB לדיסק), ללא דיסק"
        ],
        "oldStock": false
    },
    {
        "slug": "nvr301-08s3",
        "brand": "Uniview",
        "model": "NVR301-08S3",
        "sku": null,
        "title": "מערכת הקלטה NVR 8 ערוצים 4K עד 8MP דיסק קשיח אחד Uniview NVR301",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": 579,
        "specs": [
            "8 ערוצי IP, רזולוציה עד 8MP/4K, Ultra 265/H.265/H.264",
            "רוחב פס כניסה 64Mbps / יציאה 48Mbps",
            "מפרץ SATA אחד, עד 6-8TB, ללא דיסק",
            "יציאות HDMI 4K + VGA במקביל",
            "ONVIF, אפליקציית EZView, ללא PoE (גרסת P8 עם PoE נפרדת)",
            "קומפקטי, 1U מיני"
        ],
        "image": "/store-images/nvr301-08s3.webp",
        "datasheet": "https://global.uniview.com/res/202307/07/20230707_1883736_UNV%E3%80%90Datasheet%E3%80%91NVR301-S3%20Series%20V1.07-EN_973318_168459_0.pdf",
        "highlights": [
            "8 ערוצי IP, רזולוציה עד 8MP/4K, Ultra 265/H.265/H.264",
            "רוחב פס כניסה 64Mbps / יציאה 48Mbps",
            "מפרץ SATA אחד, עד 6-8TB, ללא דיסק"
        ],
        "oldStock": false
    },
    {
        "slug": "uac-b125-af28lm",
        "brand": "Uniview",
        "model": "UAC-B125-AF28LM",
        "sku": null,
        "title": "מצלמת אבטחה אנלוגית צינור 5MP LightHunter עדשה 2.8 מ\"מ IR 40 מ' מיקרופון Uniview UAC",
        "category": "analog",
        "categoryName": "מצלמות אנלוגיות",
        "price": 109,
        "specs": [
            "5MP (2880x1620 @25fps / 2592x1944 @20fps), חיישן CMOS 1/2.7\" LightHunter",
            "עדשה קבועה 2.8 מ\"מ, זווית 109.1°",
            "2 מקרני IR עד 40 מ', 0.005 lux",
            "מיקרופון מובנה - אודיו על גבי הקואקס",
            "יציאה 4 ב-1: TVI / AHD / CVI / CVBS",
            "IP67, מתכת, 12V DC"
        ],
        "image": "/store-images/uac-b125-af28lm.webp",
        "datasheet": "https://cctv.rs/wp-content/uploads/2024/12/Uniview-UAC-B125-AF28LM.pdf",
        "highlights": [
            "5MP (2880x1620 @25fps / 2592x1944 @20fps), חיישן CMOS 1/2.7\" LightHunter",
            "עדשה קבועה 2.8 מ\"מ, זווית 109.1°",
            "2 מקרני IR עד 40 מ', 0.005 lux"
        ],
        "oldStock": false
    },
    {
        "slug": "uac-t125-af28lm",
        "brand": "Uniview",
        "model": "UAC-T125-AF28LM",
        "sku": null,
        "title": "מצלמת אבטחה אנלוגית טורט 5MP LightHunter עדשה 2.8 מ\"מ IR 40 מ' מיקרופון Uniview UAC",
        "category": "analog",
        "categoryName": "מצלמות אנלוגיות",
        "price": 139,
        "specs": [
            "5MP (2880x1620 / 2592x1944), חיישן CMOS 1/2.7\" LightHunter",
            "עדשה קבועה 2.8 מ\"מ, זווית 109.1°",
            "2 מקרני IR עד 40 מ'",
            "מיקרופון מובנה - אודיו על גבי הקואקס",
            "יציאה 4 ב-1: TVI / AHD / CVI / CVBS",
            "IP67, טמפ' עבודה -30 עד 60°C, 12V DC"
        ],
        "image": "/store-images/uac-t125-af28lm.webp",
        "datasheet": "https://ubox-eu.oss-eu-central-1.aliyuncs.com/datacenter/doc/10824b27-4fea-43bf-bb47-2cb9f4cab245/c139d1a3-a87c-46ea-8aab-d3459b248816.pdf",
        "highlights": [
            "5MP (2880x1620 / 2592x1944), חיישן CMOS 1/2.7\" LightHunter",
            "עדשה קבועה 2.8 מ\"מ, זווית 109.1°",
            "2 מקרני IR עד 40 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "xvr301-04g3",
        "brand": "Uniview",
        "model": "XVR301-04G3",
        "sku": null,
        "title": "מערכת הקלטה XVR היברידית 4 ערוצים 5MP Lite + 2 IP דיסק אחד Uniview XVR301",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": 679,
        "specs": [
            "4 ערוצי BNC אנלוגיים (TVI/AHD/CVI/CVBS) + 2 ערוצי IP (עד 6 בהמרה)",
            "הקלטה עד 5MP Lite (AHD 5MP@20fps), IP עד 4MP",
            "H.265 / H.264",
            "מפרץ SATA אחד, עד 16TB (ללא דיסק)",
            "יציאות HDMI + VGA (1920x1080)",
            "אודיו, P2P / EZView, 1U קומפקטי"
        ],
        "image": "/store-images/xvr301-04g3.webp",
        "datasheet": "https://ubox-eu.oss-eu-central-1.aliyuncs.com/datacenter/doc/c19a0053-b9f1-4f4a-812a-0a55187e1560/2360dcff-5943-4cc8-b49b-2f6e5e8f40e4.pdf",
        "highlights": [
            "4 ערוצי BNC אנלוגיים (TVI/AHD/CVI/CVBS) + 2 ערוצי IP (עד 6 בהמרה)",
            "הקלטה עד 5MP Lite (AHD 5MP@20fps), IP עד 4MP",
            "H.265 / H.264"
        ],
        "oldStock": false
    },
    {
        "slug": "xvr301-08g3",
        "brand": "Uniview",
        "model": "XVR301-08G3",
        "sku": null,
        "title": "מערכת הקלטה XVR היברידית 8 ערוצים 5MP Lite + 4 IP דיסק אחד Uniview XVR301",
        "category": "recorders",
        "categoryName": "מקליטים NVR / DVR",
        "price": 1069,
        "specs": [
            "8 ערוצי BNC אנלוגיים (TVI/AHD/CVI/CVBS) + 4 ערוצי IP (עד 8 בהמרה)",
            "הקלטה עד 5MP Lite אנלוגי, IP עד 4MP@30fps",
            "H.265 / H.264, רוחב פס 32Mbps (עד 40Mbps)",
            "מפרץ SATA אחד, עד 8-16TB (ללא דיסק)",
            "יציאות HDMI + VGA (1920x1080)",
            "אודיו, P2P / EZView, 1U קומפקטי"
        ],
        "image": "/store-images/xvr301-08g3.webp",
        "datasheet": "https://www.uniview.com/it/res/202403/26/20240326_1900620_UNV%20XVR301-G3%20Series%20Digital%20Video%20Recorder_958077_168459_0.pdf",
        "highlights": [
            "8 ערוצי BNC אנלוגיים (TVI/AHD/CVI/CVBS) + 4 ערוצי IP (עד 8 בהמרה)",
            "הקלטה עד 5MP Lite אנלוגי, IP עד 4MP@30fps",
            "H.265 / H.264, רוחב פס 32Mbps (עד 40Mbps)"
        ],
        "oldStock": false
    },
    {
        "slug": "visionnet-k-560820",
        "brand": "VisionNet",
        "model": "VisionNet K (K-Line) 560820",
        "sku": "560820",
        "title": "קודן בקרת גישה מתכתי VisionNet K משולב קורא קרבה 125kHz, אנטי-ונדל, IP68",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 189,
        "specs": [
            "Square metal anti-vandal housing, IP68 waterproof",
            "Built-in 125 kHz EM proximity reader (card/tag)",
            "Up to 2000 users; open by code, card, or card+code",
            "Blue backlit keys, 12V DC operation",
            "Relay lock output >=3A, adjustable door time 0-99s",
            "Standalone controller, also available in black housing (560820B)"
        ],
        "image": "/store-images/visionnet-k-560820.webp",
        "datasheet": "https://heb.telran.co.il/images/VisionNet_K_HEB_Spec_User_Manual_2025_560820.pdf",
        "highlights": [
            "Square metal anti-vandal housing, IP68 waterproof",
            "Built-in 125 kHz EM proximity reader (card/tag)",
            "Up to 2000 users; open by code, card, or card+code"
        ],
        "oldStock": false
    },
    {
        "slug": "visionnet-kitcom-2-wire-villa-kit-560789",
        "brand": "VisionNet",
        "model": "VisionNet KITCOM 2-wire villa kit 560789",
        "sku": "560789",
        "title": "ערכת אינטרקום וידאו 2 גידים לבית פרטי VisionNet KITCOM - מסך 7\" + פנל מצלמה, Plug & Play",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 1359,
        "specs": [
            "7\" colour TFT monitor with touch-sensor buttons and intuitive menu",
            "2-wire non-polarised connection between panel and monitor (plug & play)",
            "Inner call / intercom between monitors supported",
            "Picture memory function",
            "Supports IP camera and call divert to mobile app via optional IPG module",
            "Kit: monitor + outdoor camera door station + power supply"
        ],
        "image": "/store-images/visionnet-kitcom-2-wire-villa-kit-560789.webp",
        "datasheet": null,
        "highlights": [
            "7\" colour TFT monitor with touch-sensor buttons and intuitive menu",
            "2-wire non-polarised connection between panel and monitor (plug & play)",
            "Inner call / intercom between monitors supported"
        ],
        "oldStock": false
    },
    {
        "slug": "visionnet-dh-hybrid-kit-560171",
        "brand": "VisionNet",
        "model": "VisionNet DH Hybrid KIT 560171",
        "sku": "560171",
        "title": "ערכת אינטרקום היברידית 2 גידים + IP VisionNet DH - מסך מגע 7\" Wi-Fi עם אפליקציה + פנל S4 + ספק",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 1549,
        "specs": [
            "Hybrid system: 2-wire bus plus IP/Wi-Fi connectivity",
            "7\" IPS touch monitor (1024x600), metal design, Wi-Fi with mobile app (remote view & door open)",
            "S4 door station with HD wide-angle camera",
            "Combo power supply 28V / 2.1A (PC9D)",
            "Micro-SD recording up to 512GB, 2-wire run up to 100 m",
            "Plug & play villa kit, Hebrew app support"
        ],
        "image": "/store-images/visionnet-dh-hybrid-kit-560171.webp",
        "datasheet": "https://www.telran.co.il/images/560171-one page brochure-Telran.pdf",
        "highlights": [
            "Hybrid system: 2-wire bus plus IP/Wi-Fi connectivity",
            "7\" IPS touch monitor (1024x600), metal design, Wi-Fi with mobile app (remote view & door open)",
            "S4 door station with HD wide-angle camera"
        ],
        "oldStock": false
    },
    {
        "slug": "visionnet-2tl-17-560580",
        "brand": "VisionNet",
        "model": "VisionNet 2TL-17 560580",
        "sku": "560580",
        "title": "מסך אינטרקום 7\" 2 גידים VisionNet 2TL-17 לבית פרטי/בניין, לבן עם לחצני כסף",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 629,
        "specs": [
            "7\" digital colour LCD, 800x480",
            "2-wire non-polarised bus, DC 20-28V",
            "Standby 6.6 mA / working 240 mA",
            "Video 1Vp-p 75 ohm CCIR",
            "Slim design 140x220x17.5 mm, white with silver buttons",
            "Compatible with VisionNet/DT 2-wire villa and building systems"
        ],
        "image": "/store-images/visionnet-2tl-17-560580.webp",
        "datasheet": "https://www.telran.co.il/images/560580DF_URBAN_ENG_User%20Manual_2024.pdf",
        "highlights": [
            "7\" digital colour LCD, 800x480",
            "2-wire non-polarised bus, DC 20-28V",
            "Standby 6.6 mA / working 240 mA"
        ],
        "oldStock": false
    },
    {
        "slug": "visionnet-dh-wi-fi-monitor-560975",
        "brand": "VisionNet",
        "model": "VisionNet DH Wi-Fi monitor 560975",
        "sku": "560975",
        "title": "מסך אינטרקום מגע 7\" VisionNet DH היברידי 2 גידים + IP, Wi-Fi עם אפליקציה, עיצוב מתכת",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 659,
        "specs": [
            "7\" IPS capacitive touch screen, 1024x600",
            "Hybrid: 2-wire bus + Wi-Fi/IP, mobile app for remote view and door release",
            "Exclusive metal-frame design, 131x225x18 mm",
            "DC 20-28V, 2-wire distance up to 100 m",
            "Micro-SD recording up to 512GB, call log with snapshots/video",
            "Works with VisionNet DH/S4 door stations"
        ],
        "image": "/store-images/visionnet-dh-wi-fi-monitor-560975.webp",
        "datasheet": "https://www.telran.co.il/images/560975-one page brochure-Telran.pdf",
        "highlights": [
            "7\" IPS capacitive touch screen, 1024x600",
            "Hybrid: 2-wire bus + Wi-Fi/IP, mobile app for remote view and door release",
            "Exclusive metal-frame design, 131x225x18 mm"
        ],
        "oldStock": false
    },
    {
        "slug": "visionnet-2tl-821-t5-560892",
        "brand": "VisionNet",
        "model": "VisionNet 2TL-821 / T5 560892",
        "sku": "560892",
        "title": "פנל כניסה לבניין 2 גידים VisionNet T5/821 - מסך מגע 5\", קודן, קורא קרבה ורשימת שמות בעברית",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 2049,
        "specs": [
            "5\" TFT full-glass touch screen with customisable menu",
            "2-wire building bus, module for 2TL-821 series",
            "Hebrew/English name list, direct dial by apartment",
            "Up to 32 apartments (expandable in system), code unlock per apartment",
            "Built-in 125 kHz proximity reader",
            "Flush or surface mounting"
        ],
        "image": "/store-images/visionnet-2tl-821-t5-560892.webp",
        "datasheet": "https://www.telran.co.il/images/560892_ENG_DS_1_2022.pdf",
        "highlights": [
            "5\" TFT full-glass touch screen with customisable menu",
            "2-wire building bus, module for 2TL-821 series",
            "Hebrew/English name list, direct dial by apartment"
        ],
        "oldStock": false
    },
    {
        "slug": "visionnet-2tl-607fe-id-s2-560075",
        "brand": "VisionNet",
        "model": "VisionNet 2TL-607FE/ID/S2 (DT607) 560075",
        "sku": "560075",
        "title": "פנל חוץ אינטרקום 2 גידים VisionNet 2TL-607 - מצלמת עין דג 170°, קורא כרטיס, 2 לחצנים",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": 319,
        "specs": [
            "1/2.7\" CMOS colour camera, 170° fisheye lens, auto night illumination",
            "2 call buttons (up to 4 users), built-in ID card reader",
            "2-wire non-polarised, DC 24V; standby 25 mA / working 160 mA",
            "Lock output 12 VDC 300 mA",
            "IP54, zinc alloy / stainless front, 179x94x42 mm",
            "Operating -20 to +55 C"
        ],
        "image": "/store-images/visionnet-2tl-607fe-id-s2-560075.webp",
        "datasheet": "https://www.telran.co.il/images/DT-ENG-DT607-V1.pdf",
        "highlights": [
            "1/2.7\" CMOS colour camera, 170° fisheye lens, auto night illumination",
            "2 call buttons (up to 4 users), built-in ID card reader",
            "2-wire non-polarised, DC 24V; standby 25 mA / working 160 mA"
        ],
        "oldStock": false
    },
    {
        "slug": "rain-roof-for-keypads-560878",
        "brand": "VisionNet",
        "model": "Rain roof for keypads 560878",
        "sku": "560878",
        "title": "גגון הגנה מגשם לקודן בקרת כניסה (מתאים לקודנים 560596/560597)",
        "category": "intercom",
        "categoryName": "אינטרקום ובקרת כניסה",
        "price": null,
        "specs": [
            "ABS plastic rain/sun shield for surface-mounted keypads",
            "Outer 150 x 104 x 90 mm, inner 135 x 89 x 84 mm",
            "Weight 250 g",
            "Fits Telran keypads 560596 / 560597 and similar 118x78 mm units"
        ],
        "image": "/store-images/rain-roof-for-keypads-560878.webp",
        "datasheet": "https://www.telran.co.il/images/560878_DS_ENG 2021.pdf",
        "highlights": [
            "ABS plastic rain/sun shield for surface-mounted keypads",
            "Outer 150 x 104 x 90 mm, inner 135 x 89 x 84 mm",
            "Weight 250 g"
        ],
        "oldStock": false
    },
    {
        "slug": "reolink-rlk8-820d4-a",
        "brand": "Reolink",
        "model": "Reolink RLK8-820D4-A (NVS8-8MD4)",
        "sku": "RLK8-820D4-A",
        "title": "ערכת Reolink 4K 8MP - מקליט NVR 8 ערוצים PoE עם דיסק 2TB + 4 מצלמות כיפה RLC-820A, קושחה בעברית",
        "category": "kits",
        "categoryName": "ערכות מצלמות מוכנות",
        "price": 2619,
        "specs": [
            "8-channel PoE NVR (8 x 802.3at ports) with 2TB SATA HDD, max 12TB",
            "4 x RLC-820A 4K 8MP dome cameras, 1/2.49\" CMOS, 4.0 mm lens",
            "H.265, 3840x2160 @ 25fps, 4-ch synchronous playback",
            "IR night vision 30 m, IP66",
            "Person/vehicle smart detection, Reolink app",
            "Includes 4 x 18 m Cat5 cables, HDMI, mouse"
        ],
        "image": "/store-images/reolink-rlk8-820d4-a.webp",
        "datasheet": "https://www.telran.co.il/images/RLK8-820D4-A_Reolink_ENG 2021.pdf",
        "highlights": [
            "8-channel PoE NVR (8 x 802.3at ports) with 2TB SATA HDD, max 12TB",
            "4 x RLC-820A 4K 8MP dome cameras, 1/2.49\" CMOS, 4.0 mm lens",
            "H.265, 3840x2160 @ 25fps, 4-ch synchronous playback"
        ],
        "oldStock": false
    },
    {
        "slug": "reolink-rlk8-810b4-a-rlk8-800b4",
        "brand": "Reolink",
        "model": "Reolink RLK8-810B4-A / RLK8-800B4 (NVS8-8MB4)",
        "sku": "RLK8-810B4-A",
        "title": "ערכת Reolink 4K 8MP - מקליט NVR 8 ערוצים PoE עם דיסק 2TB + 4 מצלמות צינור RLC-810A, קושחה בעברית",
        "category": "kits",
        "categoryName": "ערכות מצלמות מוכנות",
        "price": 2619,
        "specs": [
            "8-channel PoE NVR (8 x 100 Mbps PoE ports) with 2TB HDD, max 12TB",
            "4 x RLC-810A 4K 8MP bullet cameras, 4.0 mm, 87° HFOV",
            "H.265/H.264, 3840x2160 @ 25fps",
            "IR night vision 30 m (18 LEDs), IP66",
            "Person/vehicle detection, Reolink app, Hebrew firmware",
            "Working -10 to +45 C"
        ],
        "image": "/store-images/reolink-rlk8-810b4-a-rlk8-800b4.webp",
        "datasheet": "https://www.telran.co.il/images/RLK8-810B4-A_Reolink_ENG 2021.pdf",
        "highlights": [
            "8-channel PoE NVR (8 x 100 Mbps PoE ports) with 2TB HDD, max 12TB",
            "4 x RLC-810A 4K 8MP bullet cameras, 4.0 mm, 87° HFOV",
            "H.265/H.264, 3840x2160 @ 25fps"
        ],
        "oldStock": false
    },
    {
        "slug": "reolink-rlk8-410b4-5mp",
        "brand": "Reolink",
        "model": "Reolink RLK8-410B4-5MP (NVS8-5MB4)",
        "sku": "RLK8-410B4-5MP",
        "title": "ערכת Reolink 5MP - מקליט NVR 8 ערוצים PoE עם דיסק 2TB + 4 מצלמות צינור RLC-510A, קושחה בעברית",
        "category": "kits",
        "categoryName": "ערכות מצלמות מוכנות",
        "price": 1939,
        "specs": [
            "8-channel 4K-capable PoE NVR (RLN8-410) with 2TB HDD",
            "4 x RLC-510A 5MP (2560x1920) bullet cameras",
            "IR night vision 30 m (18 LEDs), IP66",
            "Person/vehicle/pet detection, built-in mic",
            "Expandable to 8 cameras; 4 x 18 m cables included",
            "Hebrew firmware, 1-year Telran warranty"
        ],
        "image": "/store-images/reolink-rlk8-410b4-5mp.webp",
        "datasheet": "https://www.telran.co.il/images/RLK8-410B4-5MP_Reolink_ENG_DS_2023_2.pdf",
        "highlights": [
            "8-channel 4K-capable PoE NVR (RLN8-410) with 2TB HDD",
            "4 x RLC-510A 5MP (2560x1920) bullet cameras",
            "IR night vision 30 m (18 LEDs), IP66"
        ],
        "oldStock": false
    },
    {
        "slug": "reolink-rlk8-1200b4-a",
        "brand": "Reolink",
        "model": "Reolink RLK8-1200B4-A (NVS8-12MB4)",
        "sku": "RLK8-1200B4-A(2.8MM)",
        "title": "ערכת Reolink 12MP 4K+ - מקליט NVR 8 ערוצים PoE עם דיסק 2TB + 4 מצלמות צינור RLC-1212A עם זרקורים, קושחה בעברית",
        "category": "kits",
        "categoryName": "ערכות מצלמות מוכנות",
        "price": 2669,
        "specs": [
            "8-channel PoE NVR with 2TB HDD",
            "4 x RLC-1212A 12MP (4512x2512) bullet cameras, 2.8 mm lens",
            "Built-in spotlights, colour night vision, two-way talk",
            "Person/vehicle/pet smart detection",
            "IP67, PoE single-cable install, 4 x 18 m cables",
            "Hebrew firmware"
        ],
        "image": "/store-images/reolink-rlk8-1200b4-a.webp",
        "datasheet": "https://www.telran.co.il/images/RLK8-1200B4-A(2.8MM)_Reolink_ENG_DS_2023_1.pdf",
        "highlights": [
            "8-channel PoE NVR with 2TB HDD",
            "4 x RLC-1212A 12MP (4512x2512) bullet cameras, 2.8 mm lens",
            "Built-in spotlights, colour night vision, two-way talk"
        ],
        "oldStock": false
    },
    {
        "slug": "reolink-rlk8-1200d4-a",
        "brand": "Reolink",
        "model": "Reolink RLK8-1200D4-A (NVS8-12MD4)",
        "sku": "RLK8-1200D4-A(2.8MM)",
        "title": "ערכת Reolink 12MP 4K+ - מקליט NVR 8 ערוצים PoE עם דיסק 2TB + 4 מצלמות כיפה RLC-1224A צבע מלא עם זרקורים, קושחה בעברית",
        "category": "kits",
        "categoryName": "ערכות מצלמות מוכנות",
        "price": 3479,
        "specs": [
            "8-channel PoE NVR with 2TB HDD",
            "4 x RLC-1224A 12MP (4512x2512) dome cameras, 2.8 mm lens",
            "Full-colour night vision with spotlights + 30 m IR",
            "Person/vehicle/pet detection, two-way audio",
            "IP67, PoE, 4 x 18 m cables, HDMI, mouse",
            "Hebrew firmware"
        ],
        "image": "/store-images/reolink-rlk8-1200d4-a.webp",
        "datasheet": "https://www.telran.co.il/images/RLK8-1200D4-A(2.8MM)_Reolink_ENG_DS_2023_2.pdf",
        "highlights": [
            "8-channel PoE NVR with 2TB HDD",
            "4 x RLC-1224A 12MP (4512x2512) dome cameras, 2.8 mm lens",
            "Full-colour night vision with spotlights + 30 m IR"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd1343g2-liu-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD1343G2-LIU 2.8mm",
        "sku": null,
        "title": "מצלמת כיפה IP Hikvision 4MP Smart Hybrid Light עם מיקרופון DS",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 339,
        "specs": [
            "רזולוציה 4MP (2560×1440), חיישן 1/3\" CMOS, H.265+",
            "עדשה קבועה 2.8mm (זווית רחבה ~100°)",
            "Smart Hybrid Light: תאורת IR + אור לבן עד 30 מ', צבע בלילה לפי אירוע",
            "זיהוי אדם/רכב (Motion Detection 2.0), מיקרופון מובנה",
            "PoE 802.3af / 12VDC, IP67, WDR 120dB, חריץ microSD עד 512GB"
        ],
        "image": "/store-images/ds-2cd1343g2-liu-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/normal/all/doc/sm000042442/DS-2CD1343G2-LIU_Datasheet_20260703.pdf",
        "highlights": [
            "רזולוציה 4MP (2560×1440), חיישן 1/3\" CMOS, H.265+",
            "עדשה קבועה 2.8mm (זווית רחבה ~100°)",
            "Smart Hybrid Light: תאורת IR + אור לבן עד 30 מ', צבע בלילה לפי אירוע"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd1t47g2-luf-4mm",
        "brand": "Hikvision",
        "model": "DS-2CD1T47G2-LUF 4mm",
        "sku": null,
        "title": "מצלמת צינור IP Hikvision 4MP ColorVu צבע 24/7 עם מיקרופון DS",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 729,
        "specs": [
            "רזולוציה 4MP (2560×1440), H.265+, זיהוי אדם/רכב",
            "עדשה קבועה 4mm F1.0 (~75° אופקי)",
            "ColorVu - תמונה צבעונית 24/7, אור לבן עד 30 מ', 0.001 Lux",
            "מיקרופון מובנה",
            "PoE 802.3af / 12VDC, IP67, WDR 120dB, microSD עד 256GB"
        ],
        "image": "/store-images/ds-2cd1t47g2-luf-4mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/sm000041031/DS-2CD1T47G2-LUF_Datasheet_V5.7.1_20221216.pdf",
        "highlights": [
            "רזולוציה 4MP (2560×1440), H.265+, זיהוי אדם/רכב",
            "עדשה קבועה 4mm F1.0 (~75° אופקי)",
            "ColorVu - תמונה צבעונית 24/7, אור לבן עד 30 מ', 0.001 Lux"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2043g2-iu-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD2043G2-IU 2.8mm",
        "sku": null,
        "title": "מצלמת צינור IP Hikvision 4MP AcuSense עם מיקרופון IR 40 מ' DS",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 569,
        "specs": [
            "רזולוציה 4MP (2688×1520), חיישן 1/3\" CMOS, H.265+",
            "עדשה קבועה 2.8mm (~103° אופקי)",
            "תאורת IR (EXIR 2.0) עד 40 מ' - ראיית לילה שחור/לבן",
            "AcuSense: סיווג אדם/רכב מבוסס Deep Learning, מיקרופון מובנה",
            "PoE 802.3af / 12VDC, IP67, WDR 120dB, microSD עד 256GB"
        ],
        "image": "/store-images/ds-2cd2043g2-iu-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/sm000058907/DS-2CD2043G2-IU_Datasheet_V5.5.113_20230303.pdf",
        "highlights": [
            "רזולוציה 4MP (2688×1520), חיישן 1/3\" CMOS, H.265+",
            "עדשה קבועה 2.8mm (~103° אופקי)",
            "תאורת IR (EXIR 2.0) עד 40 מ' - ראיית לילה שחור/לבן"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2047g2h-liu-sl-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD2047G2H-LIU/SL 2.8mm",
        "sku": null,
        "title": "מצלמת צינור IP Hikvision 4MP ColorVu Hybrid Light עם סטרובוסקופ ורמקול DS",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 809,
        "specs": [
            "רזולוציה 4MP (2688×1520), חיישן גדול 1/1.8\" CMOS, H.265+",
            "עדשה קבועה 2.8mm (~111° אופקי)",
            "Smart Hybrid Light + ColorVu: IR ואור לבן עד 40 מ', צבע 24/7",
            "AcuSense אדם/רכב, Live Guard: אור סטרובוסקופי + התרעה קולית, מיקרופון + רמקול (דו-כיווני)",
            "PoE 802.3af / 12VDC, IP67, WDR 130dB, microSD עד 512GB"
        ],
        "image": "/store-images/ds-2cd2047g2h-liu-sl-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/normal/all/doc/sm000058456/DS-2CD2047G2H-LIU_SL_Datasheet_20260105.pdf",
        "highlights": [
            "רזולוציה 4MP (2688×1520), חיישן גדול 1/1.8\" CMOS, H.265+",
            "עדשה קבועה 2.8mm (~111° אופקי)",
            "Smart Hybrid Light + ColorVu: IR ואור לבן עד 40 מ', צבע 24/7"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd1047g2-luf-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD1047G2-LUF 2.8mm",
        "sku": null,
        "title": "מצלמת מיני צינור IP Hikvision 4MP ColorVu צבע 24/7 עם מיקרופון DS",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 539,
        "specs": [
            "רזולוציה 4MP (2560×1440), H.265+, זיהוי אדם/רכב (MD 2.0)",
            "עדשה קבועה 2.8mm F1.0 (~96° אופקי)",
            "ColorVu - תמונה צבעונית 24/7, אור לבן עד 30 מ', 0.001 Lux",
            "מיקרופון מובנה",
            "PoE 802.3af / 12VDC, IP67, WDR 120dB, microSD עד 256GB"
        ],
        "image": "/store-images/ds-2cd1047g2-luf-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/normal/all/doc/m000062026/DS-2CD1047G2-LUF_Datasheet_20260409.pdf",
        "highlights": [
            "רזולוציה 4MP (2560×1440), H.265+, זיהוי אדם/רכב (MD 2.0)",
            "עדשה קבועה 2.8mm F1.0 (~96° אופקי)",
            "ColorVu - תמונה צבעונית 24/7, אור לבן עד 30 מ', 0.001 Lux"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd1043g2-liu-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD1043G2-LIU 2.8mm",
        "sku": null,
        "title": "מצלמת מיני צינור IP Hikvision 4MP Smart Hybrid Light עם מיקרופון DS",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 339,
        "specs": [
            "רזולוציה 4MP (2560×1440), חיישן 1/3\" CMOS, H.265+",
            "עדשה קבועה 2.8mm (~100° אופקי)",
            "Smart Hybrid Light: IR + אור לבן עד 30 מ', 0.005 Lux צבע",
            "זיהוי אדם/רכב (MD 2.0), מיקרופון מובנה",
            "PoE 802.3af / 12VDC, IP67, WDR 120dB, microSD עד 512GB"
        ],
        "image": "/store-images/ds-2cd1043g2-liu-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/sm000091779/DS-2CD1043G2-LIUF_Datasheet_20230914.pdf",
        "highlights": [
            "רזולוציה 4MP (2560×1440), חיישן 1/3\" CMOS, H.265+",
            "עדשה קבועה 2.8mm (~100° אופקי)",
            "Smart Hybrid Light: IR + אור לבן עד 30 מ', 0.005 Lux צבע"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd1643g2-lizu-2-8-12mm",
        "brand": "Hikvision",
        "model": "DS-2CD1643G2-LIZU 2.8-12mm",
        "sku": null,
        "title": "מצלמת צינור IP Hikvision 4MP ווריפוקל ממונע 2.8-12mm Smart Hybrid Light עם מיקרופון DS",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 699,
        "specs": [
            "רזולוציה 4MP (2560×1440), חיישן 1/3\" CMOS, H.265+",
            "עדשה ווריפוקל ממונעת 2.8-12mm (זום x4, 96.7°-29.7°), פוקוס אוטומטי",
            "Smart Hybrid Light: IR + אור לבן עד 50 מ'",
            "זיהוי אדם/רכב (MD 2.0), מיקרופון מובנה",
            "PoE 802.3af / 12VDC, IP67, WDR 120dB, microSD עד 256GB"
        ],
        "image": "/store-images/ds-2cd1643g2-lizu-2-8-12mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/sm000091783/DS-2CD1643G2-LIZSU_Datasheet_20231220.pdf",
        "highlights": [
            "רזולוציה 4MP (2560×1440), חיישן 1/3\" CMOS, H.265+",
            "עדשה ווריפוקל ממונעת 2.8-12mm (זום x4, 96.7°-29.7°), פוקוס אוטומטי",
            "Smart Hybrid Light: IR + אור לבן עד 50 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2t43g2-4li2u-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD2T43G2-4LI2U 2.8mm",
        "sku": null,
        "title": "מצלמת צינור IP Hikvision 4MP AcuSense Smart Hybrid Light IR 80 מ' אודיו דו-כיווני DS",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 629,
        "specs": [
            "רזולוציה 4MP (2688×1520), חיישן 1/3\" CMOS, H.265+",
            "עדשה קבועה 2.8mm (~103° אופקי)",
            "Smart Hybrid Light: IR עד 80 מ' + אור לבן (4 מצבי תאורה), צבע לפי אירוע",
            "AcuSense סיווג אדם/רכב, מיקרופון + רמקול מובנים (2U = אודיו דו-כיווני)",
            "PoE 802.3af / 12VDC, IP67, WDR 120dB, microSD עד 512GB"
        ],
        "image": "/store-images/ds-2cd2t43g2-4li2u-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/sm000064851/DS-2CD2T43G2-2LI2U_4LI2U_Datasheet_20250208.pdf",
        "highlights": [
            "רזולוציה 4MP (2688×1520), חיישן 1/3\" CMOS, H.265+",
            "עדשה קבועה 2.8mm (~103° אופקי)",
            "Smart Hybrid Light: IR עד 80 מ' + אור לבן (4 מצבי תאורה), צבע לפי אירוע"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2t47g2h-li-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD2T47G2H-LI 2.8mm",
        "sku": null,
        "title": "מצלמת צינור Hikvision DS-2CD2T47G2H-LI 4MP ColorVu Smart Hybrid Light עד 60 מ' עדשה 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 849,
        "specs": [
            "רזולוציה 4MP (2688×1520) חיישן 1/1.8\" Progressive Scan CMOS, צמצם F1.0",
            "עדשה קבועה 2.8 מ\"מ (קיימות גם 4/6 מ\"מ)",
            "Smart Hybrid Light: אור לבן ColorVu + IR, טווח תאורה עד 60 מ'",
            "AcuSense - סיווג אדם/רכב, WDR 130dB, H.265+",
            "ללא מיקרופון (גרסה LI); PoE 802.3af (עד 9W) או 12VDC; IP67; חריץ microSD עד 512GB"
        ],
        "image": "/store-images/ds-2cd2t47g2h-li-2-8mm.webp",
        "datasheet": "https://download.discomp.cz/hikvision/datasheets/DS-2CD2T47G2H-LI.pdf",
        "highlights": [
            "רזולוציה 4MP (2688×1520) חיישן 1/1.8\" Progressive Scan CMOS, צמצם F1.0",
            "עדשה קבועה 2.8 מ\"מ (קיימות גם 4/6 מ\"מ)",
            "Smart Hybrid Light: אור לבן ColorVu + IR, טווח תאורה עד 60 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd1743g2-lizu-2-8-12mm",
        "brand": "Hikvision",
        "model": "DS-2CD1743G2-LIZU 2.8-12mm",
        "sku": null,
        "title": "מצלמת כיפה Hikvision DS-2CD1743G2-LIZU 4MP וריפוקל ממונע 2.8-12 מ\"מ Smart Hybrid Light + מיקרופון",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 1129,
        "specs": [
            "רזולוציה 4MP (2560×1440) חיישן 1/3\" Progressive Scan CMOS",
            "עדשה וריפוקל ממונעת 2.8-12 מ\"מ (זום אופטי ~4x, מיקוד אוטומטי)",
            "Smart Hybrid Light: IR 850nm + אור לבן, טווח עד 30 מ'",
            "מיקרופון מובנה; Motion Detection 2.0 (סיווג אדם/רכב); WDR 120dB; H.265+",
            "PoE 802.3af (עד 12W) או 12VDC; IP67, IK08; חריץ microSD"
        ],
        "image": "/store-images/ds-2cd1743g2-lizu-2-8-12mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/sm000047208/DS-2CD1743G2-LIZSU_Datasheet_20230816.pdf",
        "highlights": [
            "רזולוציה 4MP (2560×1440) חיישן 1/3\" Progressive Scan CMOS",
            "עדשה וריפוקל ממונעת 2.8-12 מ\"מ (זום אופטי ~4x, מיקוד אוטומטי)",
            "Smart Hybrid Light: IR 850nm + אור לבן, טווח עד 30 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd1143g2-liu-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD1143G2-LIU 2.8mm",
        "sku": null,
        "title": "מצלמת כיפה Hikvision DS-2CD1143G2-LIU 4MP Smart Hybrid Light עד 30 מ' + מיקרופון עדשה 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 309,
        "specs": [
            "רזולוציה 4MP (2560×1440) חיישן 1/3\" Progressive Scan CMOS",
            "עדשה קבועה 2.8 מ\"מ, שדה ראייה אופקי ~110°",
            "Smart Hybrid Light: IR + אור לבן, טווח עד 30 מ'",
            "מיקרופון מובנה; Motion Detection 2.0 (אדם/רכב); WDR 120dB; H.265+",
            "PoE 802.3af (עד 7.5W) או 12VDC; IP67, IK10 (גרסת F: IK08)"
        ],
        "image": "/store-images/ds-2cd1143g2-liu-2-8mm.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/pl/firmware/DS-2CD1143G2-LIU_Datasheet_20250526.pdf",
        "highlights": [
            "רזולוציה 4MP (2560×1440) חיישן 1/3\" Progressive Scan CMOS",
            "עדשה קבועה 2.8 מ\"מ, שדה ראייה אופקי ~110°",
            "Smart Hybrid Light: IR + אור לבן, טווח עד 30 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd1347g2-luf-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD1347G2-LUF 2.8mm",
        "sku": null,
        "title": "מצלמת טורט Hikvision DS-2CD1347G2-LUF 4MP ColorVu צבע 24/7 עד 30 מ' + מיקרופון עדשה 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 409,
        "specs": [
            "רזולוציה 4MP (2560×1440) חיישן 1/3\" Progressive Scan CMOS, צמצם F1.0",
            "עדשה קבועה 2.8 מ\"מ (קיימת גם 4 מ\"מ)",
            "ColorVu - אור לבן בלבד, תמונה צבעונית 24/7, טווח תאורה עד 30 מ'",
            "מיקרופון מובנה; Motion Detection 2.0 (אדם/רכב); WDR 120dB; H.265+",
            "PoE 802.3af או 12VDC; IP67; חריץ microSD עד 256GB"
        ],
        "image": "/store-images/ds-2cd1347g2-luf-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/sm000041034/DS-2CD1347G2-LUF_Datasheet_20240828.pdf",
        "highlights": [
            "רזולוציה 4MP (2560×1440) חיישן 1/3\" Progressive Scan CMOS, צמצם F1.0",
            "עדשה קבועה 2.8 מ\"מ (קיימת גם 4 מ\"מ)",
            "ColorVu - אור לבן בלבד, תמונה צבעונית 24/7, טווח תאורה עד 30 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2143g2-i-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD2143G2-I 2.8mm",
        "sku": null,
        "title": "מצלמת כיפה Hikvision DS-2CD2143G2-I 4MP AcuSense IR עד 30 מ' IK10 עדשה 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 469,
        "specs": [
            "רזולוציה 4MP (2688×1520) חיישן 1/3\" Progressive Scan CMOS",
            "עדשה קבועה 2.8 מ\"מ (קיימת גם 4 מ\"מ)",
            "תאורת IR EXIR 2.0, טווח עד 30 מ' (ללא אור לבן)",
            "AcuSense - סיווג אדם/רכב ומניעת התראות שווא; WDR 120dB; H.265+; ללא מיקרופון",
            "PoE 802.3af (עד 7.5W) או 12VDC; IP67, IK10; חריץ microSD עד 256GB"
        ],
        "image": "/store-images/ds-2cd2143g2-i-2-8mm.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/mena/support/sira/admcc-2023-oliver/DS-2CD2143G2-IS_Datasheet_V5.5.113_20230303.pdf",
        "highlights": [
            "רזולוציה 4MP (2688×1520) חיישן 1/3\" Progressive Scan CMOS",
            "עדשה קבועה 2.8 מ\"מ (קיימת גם 4 מ\"מ)",
            "תאורת IR EXIR 2.0, טווח עד 30 מ' (ללא אור לבן)"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2143g2-iu-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD2143G2-IU 2.8mm",
        "sku": null,
        "title": "מצלמת כיפה Hikvision DS-2CD2143G2-IU 4MP AcuSense IR עד 30 מ' + מיקרופון IK10 עדשה 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 639,
        "specs": [
            "רזולוציה 4MP (2688×1520) חיישן 1/3\" Progressive Scan CMOS",
            "עדשה קבועה 2.8 מ\"מ (קיימת גם 4 מ\"מ)",
            "תאורת IR EXIR 2.0, טווח עד 30 מ' (ללא אור לבן)",
            "מיקרופון מובנה; AcuSense - סיווג אדם/רכב; WDR 120dB; H.265+",
            "PoE 802.3af (עד 7.5W) או 12VDC; IP67, IK10; חריץ microSD עד 256GB"
        ],
        "image": "/store-images/ds-2cd2143g2-iu-2-8mm.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/usa/data-sheet/DS-2CD2143G2-IU-DataSheet.pdf",
        "highlights": [
            "רזולוציה 4MP (2688×1520) חיישן 1/3\" Progressive Scan CMOS",
            "עדשה קבועה 2.8 מ\"מ (קיימת גם 4 מ\"מ)",
            "תאורת IR EXIR 2.0, טווח עד 30 מ' (ללא אור לבן)"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2347g1-l-4mm",
        "brand": "Hikvision",
        "model": "DS-2CD2347G1-L 4mm (2021 stock)",
        "sku": null,
        "title": "מצלמת טורט Hikvision DS-2CD2347G1-L 4MP ColorVu צבע 24/7 עד 30 מ' עדשה 4 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 809,
        "specs": [
            "רזולוציה 4MP (2688×1520 @30fps) חיישן 1/1.8\" Progressive Scan CMOS, צמצם F1.0",
            "עדשה קבועה 4 מ\"מ, שדה ראייה אופקי ~94° (קיימות גם 2.8/6 מ\"מ)",
            "ColorVu דור 1 - אור לבן בלבד, תמונה צבעונית 24/7, טווח עד 30 מ'; רגישות 0.0014 לוקס",
            "ללא מיקרופון (גרסה L; LU = עם מיקרופון); WDR 120dB; H.265+; ללא AcuSense",
            "PoE 802.3af Class 3 או 12VDC; IP67; חריץ microSD עד 256GB"
        ],
        "image": "/store-images/ds-2cd2347g1-l-4mm.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/products/S000000001/S000000002/S000000003/S000000025/OFR000043/M000007747/Data_Sheet/DS-2CD2347G1-LU_Datasheet_V5.5.82_20210409.pdf",
        "highlights": [
            "רזולוציה 4MP (2688×1520 @30fps) חיישן 1/1.8\" Progressive Scan CMOS, צמצם F1.0",
            "עדשה קבועה 4 מ\"מ, שדה ראייה אופקי ~94° (קיימות גם 2.8/6 מ\"מ)",
            "ColorVu דור 1 - אור לבן בלבד, תמונה צבעונית 24/7, טווח עד 30 מ'; רגישות 0.0014 לוקס"
        ],
        "oldStock": true
    },
    {
        "slug": "ds-2cd1p47g2-luf-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD1P47G2-LUF 2.8mm",
        "sku": null,
        "title": "מצלמת צינור ממונעת PT Hikvision DS-2CD1P47G2-LUF 4MP ColorVu עד 30 מ' + מיקרופון עדשה 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 539,
        "specs": [
            "רזולוציה 4MP (2560×1440) חיישן 1/3\" Progressive Scan CMOS, צמצם F1.0",
            "עדשה קבועה 2.8 מ\"מ (~96° אופקי); מנוע Pan/Tilt: אופקי 0-355°, אנכי 0-90° (שליטה מרחוק)",
            "ColorVu - אור לבן, תמונה צבעונית 24/7, טווח עד 30 מ'",
            "מיקרופון מובנה; Motion Detection 2.0 (אדם/רכב); WDR 120dB; H.265+",
            "PoE 802.3af או 12VDC; IP66; חריץ microSD עד 256GB"
        ],
        "image": "/store-images/ds-2cd1p47g2-luf-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/sm000040936/DS-2CD1P47G2-LUF_Datasheet_V5.7.1_20230220.pdf",
        "highlights": [
            "רזולוציה 4MP (2560×1440) חיישן 1/3\" Progressive Scan CMOS, צמצם F1.0",
            "עדשה קבועה 2.8 מ\"מ (~96° אופקי); מנוע Pan/Tilt: אופקי 0-355°, אנכי 0-90° (שליטה מרחוק)",
            "ColorVu - אור לבן, תמונה צבעונית 24/7, טווח עד 30 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2183g2-iu-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD2183G2-IU 2.8mm",
        "sku": null,
        "title": "מצלמת כיפה IP חסינת ונדליזם Hikvision AcuSense 8MP 4K עם מיקרופון DS-2CD2183G2-IU 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 769,
        "specs": [
            "רזולוציה 8MP / 4K (3840×2160), חיישן 1/2.8\" CMOS, WDR 120dB",
            "עדשה קבועה 2.8 מ\"מ, זווית אופקית כ-102°",
            "אינפרא-אדום EXIR 2.0 עד 30 מ'",
            "מיקרופון מובנה, חריץ microSD עד 512GB, H.265+",
            "PoE 802.3af / DC 12V, IP67 + IK10 (חסין ונדליזם)",
            "AcuSense: סיווג אדם/רכב מבוסס Deep Learning, הפחתת התראות שווא"
        ],
        "image": "/store-images/ds-2cd2183g2-iu-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/normal/all/doc/sm000058934/DS-2CD2183G2-IU_Datasheet_20260320.pdf",
        "highlights": [
            "רזולוציה 8MP / 4K (3840×2160), חיישן 1/2.8\" CMOS, WDR 120dB",
            "עדשה קבועה 2.8 מ\"מ, זווית אופקית כ-102°",
            "אינפרא-אדום EXIR 2.0 עד 30 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2t87g3-lis2uy-sl-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD2T87G3-LIS2UY/SL 2.8mm",
        "sku": null,
        "title": "מצלמת צינור IP Hikvision ColorVu 3.0 דור 3 8MP 4K עמידה בקורוזיה עם רמקול, מיקרופון ואור מהבהב DS-2CD2T87G3-LIS2UY/SL 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 1159,
        "specs": [
            "רזולוציה 8MP / 4K (3840×2160), חיישן 1/1.8\" גדול, צמצם F1.0, WDR 130dB",
            "עדשה קבועה 2.8 מ\"מ",
            "Smart Hybrid Light: אור לבן ColorVu 3.0 + אינפרא-אדום, טווח עד 60 מ' (IR) / 40 מ' (אור לבן)",
            "אודיו 2.0: 2 מיקרופונים + רמקול מובנה, אור מהבהב (Strobe) ואזעקה קולית, Live-Guard",
            "AcuSense 3.0 + HikAI-ISP: סיווג אדם/רכב, תפיסת פנים",
            "PoE 802.3af / DC 12V, IP67, IK10, NEMA 4X - ציפוי עמיד בקורוזיה (Y), microSD עד 512GB"
        ],
        "image": "/store-images/ds-2cd2t87g3-lis2uy-sl-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000144460/DS-2CD2T87G3-LIS2UY_SLRB_Datasheet_20250411.pdf",
        "highlights": [
            "רזולוציה 8MP / 4K (3840×2160), חיישן 1/1.8\" גדול, צמצם F1.0, WDR 130dB",
            "עדשה קבועה 2.8 מ\"מ",
            "Smart Hybrid Light: אור לבן ColorVu 3.0 + אינפרא-אדום, טווח עד 60 מ' (IR) / 40 מ' (אור לבן)"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd1383g0-iuf-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD1383G0-IUF 2.8mm",
        "sku": null,
        "title": "מצלמת טורט IP Hikvision 8MP 4K עם מיקרופון וחריץ SD DS-2CD1383G0-IUF 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 399,
        "specs": [
            "רזולוציה 8MP / 4K (3840×2160), חיישן 1/2.8\" CMOS, WDR 120dB",
            "עדשה קבועה 2.8 מ\"מ (זווית אופקית כ-100°)",
            "אינפרא-אדום EXIR 2.0 עד 30 מ'",
            "מיקרופון מובנה (U), חריץ microSD עד 256GB (F), H.265+",
            "PoE 802.3af / DC 12V, IP67",
            "זיהוי תנועה 2.0 (אדם/רכב) - סדרת Value / EasyIP Lite"
        ],
        "image": "/store-images/ds-2cd1383g0-iuf-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000040376/DS-2CD1383G0-IUF-C_Datasheet_20240828.docx.pdf",
        "highlights": [
            "רזולוציה 8MP / 4K (3840×2160), חיישן 1/2.8\" CMOS, WDR 120dB",
            "עדשה קבועה 2.8 מ\"מ (זווית אופקית כ-100°)",
            "אינפרא-אדום EXIR 2.0 עד 30 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2955g0-isu-1-05mm",
        "brand": "Hikvision",
        "model": "DS-2CD2955G0-ISU 1.05mm",
        "sku": null,
        "title": "מצלמת עין דג פנורמית 180° Hikvision 5MP עם מיקרופון DS-2CD2955G0-ISU 1.05 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 919,
        "specs": [
            "רזולוציה 5MP (2560×1920), חיישן 1/2.7\" CMOS, WDR 120dB",
            "עדשה 1.05 מ\"מ, שדה ראייה 180° (אופקי/אנכי/אלכסוני)",
            "אינפרא-אדום עד 8 מ'",
            "מיקרופון מובנה, כניסה/יציאת אודיו ואזעקה, חריץ microSD עד 256GB",
            "PoE 802.3af / DC 12V, IP66 (מיני עין דג לתקרה/קיר)",
            "מצבי Dewarping מרובים (פנורמה, PTZ וירטואלי, 4PTZ), ספירת אנשים / מפת חום (VCA)"
        ],
        "image": "/store-images/ds-2cd2955g0-isu-1-05mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/normal/all/doc/m000067831/DS-2CD2955G0-ISU_Datasheet_20241211.pdf",
        "highlights": [
            "רזולוציה 5MP (2560×1920), חיישן 1/2.7\" CMOS, WDR 120dB",
            "עדשה 1.05 מ\"מ, שדה ראייה 180° (אופקי/אנכי/אלכסוני)",
            "אינפרא-אדום עד 8 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd1353g0-i-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD1353G0-I 2.8mm",
        "sku": null,
        "title": "מצלמת טורט IP Hikvision 5MP אינפרא עד 30 מ' DS-2CD1353G0-I 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 399,
        "specs": [
            "רזולוציה 5MP (2560×1920), חיישן 1/2.7\" CMOS, WDR 120dB",
            "עדשה קבועה 2.8 מ\"מ",
            "אינפרא-אדום EXIR 2.0 עד 30 מ'",
            "ללא מיקרופון (גרסת I); H.265+, 3D DNR",
            "PoE 802.3af / DC 12V, IP67",
            "סדרת Value / EasyIP Lite - עלות/תועלת לפרויקטים ביתיים ומסחריים"
        ],
        "image": "/store-images/ds-2cd1353g0-i-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000000055/DS-2CD1353G0-IUF-C_Datasheet_20240828.pdf",
        "highlights": [
            "רזולוציה 5MP (2560×1920), חיישן 1/2.7\" CMOS, WDR 120dB",
            "עדשה קבועה 2.8 מ\"מ",
            "אינפרא-אדום EXIR 2.0 עד 30 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cd2387g2h-lisu-sl-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CD2387G2H-LISU/SL 2.8mm",
        "sku": null,
        "title": "מצלמת טורט IP Hikvision ColorVu Smart Hybrid Light 8MP 4K עם אור מהבהב, סירנה ומיקרופון DS-2CD2387G2H-LISU/SL 2.8 מ\"מ",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 1099,
        "specs": [
            "רזולוציה 8MP / 4K (3840×2160), חיישן 1/1.8\" CMOS, צמצם F1.0, WDR 130dB",
            "עדשה קבועה 2.8 מ\"מ (זווית אופקית כ-109°)",
            "Smart Hybrid Light: אור לבן ColorVu + אינפרא-אדום, טווח עד 60 מ' (IR) / 40 מ' (אור לבן)",
            "מיקרופון ורמקול מובנים, אור מהבהב (Strobe) + אזעקה קולית, כניסה/יציאת אזעקה ואודיו",
            "AcuSense: סיווג אדם/רכב, זיהוי פנים; H.265+",
            "PoE 802.3af / DC 12V, IP67, microSD עד 512GB"
        ],
        "image": "/store-images/ds-2cd2387g2h-lisu-sl-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/normal/all/doc/sm000058452/DS-2CD2387G2H-LISU_SL_Datasheet_20260713.pdf",
        "highlights": [
            "רזולוציה 8MP / 4K (3840×2160), חיישן 1/1.8\" CMOS, צמצם F1.0, WDR 130dB",
            "עדשה קבועה 2.8 מ\"מ (זווית אופקית כ-109°)",
            "Smart Hybrid Light: אור לבן ColorVu + אינפרא-אדום, טווח עד 60 מ' (IR) / 40 מ' (אור לבן)"
        ],
        "oldStock": false
    },
    {
        "slug": "ids-2cd7a46g2-p-izhsy-8-32mm",
        "brand": "Hikvision",
        "model": "iDS-2CD7A46G2/P-IZHSY 8-32mm",
        "sku": null,
        "title": "מצלמת LPR לזיהוי לוחיות רישוי Hikvision DeepinView 4MP עדשה ממונעת 8-32 מ\"מ עד 100 מ' iDS",
        "category": "ip",
        "categoryName": "מצלמות IP",
        "price": 3099,
        "specs": [
            "רזולוציה 4MP (2688×1520), חיישן 1/1.8\" גדול, DarkFighter 2.0, AWDR 150dB",
            "עדשה ממונעת (Motorized varifocal) 8-32 מ\"מ, זום אופטי 4x - לכבישים/כניסות מרוחקות",
            "אינפרא-אדום עד 100 מ'",
            "ANPR/LPR מובנה: זיהוי לוחיות רישוי, רשימות לבנות/שחורות, יציאת Wiegand לשערים, זיהוי סוג/צבע רכב",
            "כניסה/יציאת אזעקה ואודיו, RS-485, microSD עד 256GB",
            "PoE+ 802.3at / DC 12V / AC 24V, IP67, IK10, גוף Y = ציפוי עמיד בקורוזיה (NEMA 4X), חימום מובנה"
        ],
        "image": "/store-images/ids-2cd7a46g2-p-izhsy-8-32mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/normal/all/doc/sm000066357/iDS-2CD7A46G2_P-IZHSY_5G_Datasheet_20260624.pdf",
        "highlights": [
            "רזולוציה 4MP (2688×1520), חיישן 1/1.8\" גדול, DarkFighter 2.0, AWDR 150dB",
            "עדשה ממונעת (Motorized varifocal) 8-32 מ\"מ, זום אופטי 4x - לכבישים/כניסות מרוחקות",
            "אינפרא-אדום עד 100 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2ce10kf0t-lpfs-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CE10KF0T-LPFS 2.8mm",
        "sku": null,
        "title": "מצלמת צינור Hikvision 3K ColorVu Smart Hybrid Light 2.8mm מיקרופון מובנה DS",
        "category": "analog",
        "categoryName": "מצלמות אנלוגיות",
        "price": 209,
        "specs": [
            "רזולוציה 3K (2960×1665) @20fps, חיישן CMOS, צמצם F1.0 לצבע 24/7",
            "עדשה קבועה 2.8mm (זווית אופקית ~105°)",
            "Smart Hybrid Light: אור לבן עד 20 מ' + IR עד 20 מ' (מצב חכם/IR/אור לבן)",
            "מיקרופון מובנה עם שמע על גבי הקואקס (AoC), רדיוס קליטה ~5 מ'",
            "IP67, DWDR, יציאה 4 ב-1 (TVI/AHD/CVI/CVBS), הזנה 12VDC עד 3.9W"
        ],
        "image": "/store-images/ds-2ce10kf0t-lpfs-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000104685/DS-2CE10KF0T-LPFS_Datasheet_20241205.pdf",
        "highlights": [
            "רזולוציה 3K (2960×1665) @20fps, חיישן CMOS, צמצם F1.0 לצבע 24/7",
            "עדשה קבועה 2.8mm (זווית אופקית ~105°)",
            "Smart Hybrid Light: אור לבן עד 20 מ' + IR עד 20 מ' (מצב חכם/IR/אור לבן)"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2ce10kf0t-fs-3-6mm",
        "brand": "Hikvision",
        "model": "DS-2CE10KF0T-FS 3.6mm",
        "sku": null,
        "title": "מצלמת צינור Hikvision 3K ColorVu 3.6mm אור לבן 20 מ' מיקרופון מובנה DS",
        "category": "analog",
        "categoryName": "מצלמות אנלוגיות",
        "price": 239,
        "specs": [
            "רזולוציה 3K (2960×1665) @20fps, צמצם F1.0, תמונה צבעונית 24/7 (ColorVu)",
            "עדשה קבועה 3.6mm (אופקי 80°, אנכי 45°, אלכסוני 96°)",
            "אור לבן עד 20 מ' (ללא IR), 0.001 Lux @F1.0 / 0 Lux עם אור לבן",
            "מיקרופון מובנה, שמע על גבי הקואקס (AoC)",
            "IP67, DWDR/3D DNR, יציאה 4 ב-1 (TVI/AHD/CVI/CVBS), 12VDC עד 3.5W"
        ],
        "image": "/store-images/ds-2ce10kf0t-fs-3-6mm.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/products/S000000001/S000000132/S000000146/S000001395/OFR005226/M000043757/Data_Sheet/Datasheet-of-DS-2CE10KF0T-FS_20210510.pdf",
        "highlights": [
            "רזולוציה 3K (2960×1665) @20fps, צמצם F1.0, תמונה צבעונית 24/7 (ColorVu)",
            "עדשה קבועה 3.6mm (אופקי 80°, אנכי 45°, אלכסוני 96°)",
            "אור לבן עד 20 מ' (ללא IR), 0.001 Lux @F1.0 / 0 Lux עם אור לבן"
        ],
        "oldStock": true
    },
    {
        "slug": "ds-2ce12kf0t-lfs-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CE12KF0T-LFS 2.8mm",
        "sku": null,
        "title": "מצלמת צינור Hikvision 3K ColorVu Smart Hybrid Light 40 מ' 2.8mm מיקרופון מובנה DS",
        "category": "analog",
        "categoryName": "מצלמות אנלוגיות",
        "price": 249,
        "specs": [
            "רזולוציה 3K (2960×1665) @20fps, CMOS, צמצם F1.0, 0.001 Lux",
            "עדשה קבועה 2.8mm (אופקי 105°, אנכי 60°, אלכסוני 143°)",
            "Smart Hybrid Light: אור לבן עד 40 מ' + IR עד 40 מ'",
            "מיקרופון מובנה, שמע על גבי הקואקס (TVI)",
            "IP67, גוף מתכת, DWDR/BLC/HLC, 4 ב-1, 12VDC עד 5.2W, טווח טמפ' -40..60°C"
        ],
        "image": "/store-images/ds-2ce12kf0t-lfs-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/normal/all/doc/m000104683/fr-fr/DS-2CE12KF0T-LFS_Datasheet_20250304.pdf",
        "highlights": [
            "רזולוציה 3K (2960×1665) @20fps, CMOS, צמצם F1.0, 0.001 Lux",
            "עדשה קבועה 2.8mm (אופקי 105°, אנכי 60°, אלכסוני 143°)",
            "Smart Hybrid Light: אור לבן עד 40 מ' + IR עד 40 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2ce70kf0t-lpfs-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CE70KF0T-LPFS 2.8mm",
        "sku": null,
        "title": "מצלמת כיפה טורט Hikvision 3K ColorVu Smart Hybrid Light 2.8mm מיקרופון מובנה DS",
        "category": "analog",
        "categoryName": "מצלמות אנלוגיות",
        "price": 199,
        "specs": [
            "רזולוציה 3K (2960×1665) @20fps, צמצם F1.0, 0.001 Lux, צבע 24/7",
            "עדשה קבועה 2.8mm, גוף טורט קומפקטי (Ø85×81 מ\"מ) עם כיוון 3 צירים",
            "Smart Hybrid Light: אור לבן עד 20 מ' + IR עד 20 מ'",
            "מיקרופון מובנה (רדיוס ~5 מ'), שמע על גבי הקואקס",
            "לשימוש פנימי (Indoor, ללא דירוג IP), DWDR, 4 ב-1, 12VDC עד 3.9W"
        ],
        "image": "/store-images/ds-2ce70kf0t-lpfs-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000104682/DS-2CE70KF0T-LPFS_Datasheet_20241211.pdf",
        "highlights": [
            "רזולוציה 3K (2960×1665) @20fps, צמצם F1.0, 0.001 Lux, צבע 24/7",
            "עדשה קבועה 2.8mm, גוף טורט קומפקטי (Ø85×81 מ\"מ) עם כיוון 3 צירים",
            "Smart Hybrid Light: אור לבן עד 20 מ' + IR עד 20 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2ce10df0t-pfs-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CE10DF0T-PFS 2.8mm",
        "sku": null,
        "title": "מצלמת צינור Hikvision 2MP ColorVu 2.8mm אור לבן 20 מ' מיקרופון מובנה DS",
        "category": "analog",
        "categoryName": "מצלמות אנלוגיות",
        "price": 199,
        "specs": [
            "רזולוציה 2MP (1920×1080) @25/30fps, צמצם F1.0, 0.001 Lux, צבע 24/7",
            "עדשה קבועה 2.8mm",
            "אור לבן עד 20 מ' (ללא IR), 0 Lux עם אור לבן",
            "מיקרופון מובנה, שמע על גבי הקואקס (AoC)",
            "IP67, DWDR/3D DNR, 4 ב-1 (TVI/AHD/CVI/CVBS), 12VDC עד 2W, גוף פלסטיק (P)"
        ],
        "image": "/store-images/ds-2ce10df0t-pfs-2-8mm.webp",
        "datasheet": "https://assets.hikvision.com/prd/public/all/doc/m000063557/Datasheet-of-DS-2CE10DF0T-PFS_20220728.pdf",
        "highlights": [
            "רזולוציה 2MP (1920×1080) @25/30fps, צמצם F1.0, 0.001 Lux, צבע 24/7",
            "עדשה קבועה 2.8mm",
            "אור לבן עד 20 מ' (ללא IR), 0 Lux עם אור לבן"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2ce12uf3t-ls-2-8mm",
        "brand": "Hikvision",
        "model": "DS-2CE12UF3T-LS 2.8mm",
        "sku": null,
        "title": "מצלמת צינור Hikvision 4K 8MP ColorVu Smart Hybrid Light 40 מ' 2.8mm מיקרופון מובנה DS",
        "category": "analog",
        "categoryName": "מצלמות אנלוגיות",
        "price": 439,
        "specs": [
            "רזולוציה 4K (3840×2160) @15fps, צמצם F1.0, 0.0005 Lux, צבע 24/7",
            "עדשה קבועה 2.8mm (אופקי 105°, אנכי 60°)",
            "Smart Hybrid Light: אור לבן עד 40 מ' + IR עד 40 מ'",
            "מיקרופון מובנה, שמע על גבי הקואקס; 130dB True WDR, 3D DNR",
            "IP67, 4 ב-1 (TVI/AHD/CVI/CVBS), 12VDC (גרסת LS ללא PoC; LSYE = גרסת PoC בריטית)"
        ],
        "image": "/store-images/ds-2ce12uf3t-ls-2-8mm.webp",
        "datasheet": "https://express-alarm.sk/storage/data_sheet/cctv/tvi/7364_00_ds-2ce12uf3t-ls_datasheet_20250622.pdf",
        "highlights": [
            "רזולוציה 4K (3840×2160) @15fps, צמצם F1.0, 0.0005 Lux, צבע 24/7",
            "עדשה קבועה 2.8mm (אופקי 105°, אנכי 60°)",
            "Smart Hybrid Light: אור לבן עד 40 מ' + IR עד 40 מ'"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2ce16u1t-itf-3-6mm",
        "brand": "Hikvision",
        "model": "DS-2CE16U1T-ITF 3.6mm",
        "sku": null,
        "title": "מצלמת צינור Hikvision 4K 8MP EXIR 30 מ' 3.6mm DS",
        "category": "analog",
        "categoryName": "מצלמות אנלוגיות",
        "price": 179,
        "specs": [
            "רזולוציה 8MP / 4K (3840×2160) @15fps (TVI), CMOS",
            "עדשה קבועה 3.6mm, 0.01 Lux @F1.2 (AGC ON), 0 Lux עם IR",
            "EXIR 2.0 - תאורת IR עד 30 מ' (ראיית לילה שחור-לבן)",
            "ללא מיקרופון / ללא שמע על הקואקס",
            "IP67, DWDR, 4 ב-1 (TVI/AHD/CVI/CVBS), 12VDC ±25%"
        ],
        "image": "/store-images/ds-2ce16u1t-itf-3-6mm.webp",
        "datasheet": "https://www.hikvision.com/content/dam/hikvision/usa/data-sheet/value-analog-and-turbo/DS-2CE16U1T-ITF_Datasheet_20230807.pdf",
        "highlights": [
            "רזולוציה 8MP / 4K (3840×2160) @15fps (TVI), CMOS",
            "עדשה קבועה 3.6mm, 0.01 Lux @F1.2 (AGC ON), 0 Lux עם IR",
            "EXIR 2.0 - תאורת IR עד 30 מ' (ראיית לילה שחור-לבן)"
        ],
        "oldStock": false
    },
    {
        "slug": "ds-2cc52h1t-fits-1-1mm",
        "brand": "Hikvision",
        "model": "DS-2CC52H1T-FITS 1.1mm",
        "sku": null,
        "title": "מצלמת עין דג פנורמית Hikvision 5MP TVI 180° 1.1mm IR מיקרופון מובנה DS",
        "category": "analog",
        "categoryName": "מצלמות אנלוגיות",
        "price": 679,
        "specs": [
            "רזולוציה 5MP, חיישן CMOS 5MP Progressive Scan",
            "עדשת עין דג קבועה 1.1mm - שדה ראייה 180° (תצוגה פנורמית 360° בתקרה)",
            "IR עד 20 מ', 0.01 Lux @F1.2, 0 Lux עם IR",
            "מיקרופון מובנה + יציאת שמע 1 ערוץ, תפריט OSD על הקואקס (Up-the-Coax)",
            "לשימוש פנימי בלבד, יציאת BNC (TVI/AHD), הספק עד 5.5W"
        ],
        "image": "/store-images/ds-2cc52h1t-fits-1-1mm.webp",
        "datasheet": "https://www.a1securitycameras.com/content/product_documents/19770/10900_DAnalogspecSpecialcameraDS2CC52H1TFITS-A1.pdf",
        "highlights": [
            "רזולוציה 5MP, חיישן CMOS 5MP Progressive Scan",
            "עדשת עין דג קבועה 1.1mm - שדה ראייה 180° (תצוגה פנורמית 360° בתקרה)",
            "IR עד 20 מ', 0.01 Lux @F1.2, 0 Lux עם IR"
        ],
        "oldStock": true
    },
    {
        "slug": "ch9",
        "brand": "Tenda",
        "model": "CH9 (CH9-WCA V2.0)",
        "sku": null,
        "title": "מצלמת אבטחה חיצונית Tenda CH9 דו-עדשתית 6MP ממונעת Wi-Fi 6 עם ראיית לילה צבעונית",
        "category": "wifi",
        "categoryName": "מצלמות Wi-Fi לבית ולעסק",
        "price": null,
        "specs": [
            "6MP סה\"כ: שתי עדשות 3MP (2304x1296) – עדשה קבועה רחבה 4mm (79.8° אופקי) + עדשת PT טלה 6mm (49.6°), צמצם F1.6, חיישן CMOS 1/3\"",
            "Pan/Tilt ממונע 0°–355° אופקי, 0°–90° אנכי; קישור חכם בין העדשות – העדשה הרחבה מזהה אדם/רכב והעדשה הממונעת ננעלת ועוקבת",
            "ראיית לילה Full-Color עד 30 מ': 6 נורות IR (850nm) + 6 זרקורים, שלושה מצבים (IR שחור-לבן / צבע מלא / חכם)",
            "אודיו דו-כיווני מלא (מיקרופון + רמקול 76dBA), אזעקת קול ואור; זיהוי AI: אדם, רכב, חציית קו, חדירה",
            "Wi-Fi 6 (802.11 b/g/n/ax) 2.4GHz עד 287Mbps; אחסון microSD עד 512GB / ענן (90 יום ניסיון) / NVR-NAS דרך ONVIF; הזנה 12V DC 1A; IP65; 203x122x162 מ\"מ"
        ],
        "image": "/store-images/ch9.webp",
        "datasheet": "https://static.tenda.com.cn/tdeweb/download/CH9-WCA/CH9-WCA%20datasheet%20EN.pdf",
        "highlights": [
            "6MP סה\"כ: שתי עדשות 3MP (2304x1296) – עדשה קבועה רחבה 4mm (79.8° אופקי) + עדשת PT טלה 6mm (49.6°), צמצם F1.6, חיישן CMOS 1/3\"",
            "Pan/Tilt ממונע 0°–355° אופקי, 0°–90° אנכי; קישור חכם בין העדשות – העדשה הרחבה מזהה אדם/רכב והעדשה הממונעת ננעלת ועוקבת",
            "ראיית לילה Full-Color עד 30 מ': 6 נורות IR (850nm) + 6 זרקורים, שלושה מצבים (IR שחור-לבן / צבע מלא / חכם)"
        ],
        "oldStock": false
    },
    {
        "slug": "ch10",
        "brand": "Tenda",
        "model": "CH10",
        "sku": null,
        "title": "מצלמת אבטחה חיצונית Tenda CH10 דו-עדשתית 10MP ממונעת Wi-Fi 6 עם ראיית לילה צבעונית",
        "category": "wifi",
        "categoryName": "מצלמות Wi-Fi לבית ולעסק",
        "price": null,
        "specs": [
            "10MP סה\"כ: שתי עדשות 5MP (2880x1620) – עדשה קבועה רחבה 4mm (83.2° אופקי) + עדשת PT טלה 6mm (51.4°), צמצם F1.6, חיישן CMOS 1/3\"",
            "Pan/Tilt ממונע 0°–355° אופקי, 0°–90° אנכי (+ כיוון זרוע ידני 260°); קישור חכם דו-עדשתי – העדשה הממונעת ננעלת אוטומטית על אדם/רכב",
            "ראיית לילה Full-Color עד 30 מ': 6 נורות IR + 6 זרקורים, מצב IR / צבע מלא / חכם",
            "אודיו דו-כיווני מלא (מיקרופון + רמקול), אזעקת קול ואור; זיהוי AI: אדם, רכב, אופניים חשמליים, חציית קו, חדירה",
            "Wi-Fi 6 (802.11 b/g/n/ax) 2.4GHz עד 287Mbps; אחסון microSD עד 512GB / ענן (90 יום ניסיון) / NVR-NAS ב-ONVIF דו-ערוצי; הזנה 12V DC 1A; IP65; 203x122x162 מ\"מ"
        ],
        "image": "/store-images/ch10.webp",
        "datasheet": "https://www.tendacn.com/material/show/722871613206597",
        "highlights": [
            "10MP סה\"כ: שתי עדשות 5MP (2880x1620) – עדשה קבועה רחבה 4mm (83.2° אופקי) + עדשת PT טלה 6mm (51.4°), צמצם F1.6, חיישן CMOS 1/3\"",
            "Pan/Tilt ממונע 0°–355° אופקי, 0°–90° אנכי (+ כיוון זרוע ידני 260°); קישור חכם דו-עדשתי – העדשה הממונעת ננעלת אוטומטית על אדם/רכב",
            "ראיית לילה Full-Color עד 30 מ': 6 נורות IR + 6 זרקורים, מצב IR / צבע מלא / חכם"
        ],
        "oldStock": false
    },
    {
        "slug": "ct3",
        "brand": "Tenda",
        "model": "CT3 (CT3-WCA)",
        "sku": null,
        "title": "מצלמת אבטחה חיצונית Tenda CT3 צינור 1080P Wi-Fi עם ראיית לילה צבעונית ואודיו דו-כיווני",
        "category": "wifi",
        "categoryName": "מצלמות Wi-Fi לבית ולעסק",
        "price": null,
        "specs": [
            "רזולוציה 1080P Full HD (1920x1080), חיישן CMOS 1/2.9\", עדשה קבועה 4mm F1.6, זווית 85.6° אופקי / 93.1° אלכסוני – מצלמת צינור (Bullet), ללא Pan/Tilt",
            "ראיית לילה Full-Color עד 30 מ': 2 נורות IR + 2 זרקורים, שלושה מצבים (חכם / צבע מלא / שחור-לבן)",
            "אודיו דו-כיווני (מיקרופון + רמקול, סירנה 82dBA), אזעקת קול ואור; זיהוי תנועה ואדם מבוסס AI; תומך Amazon Alexa",
            "Wi-Fi 802.11 b/g/n 2.4GHz עד 300Mbps עם שתי אנטנות חיצוניות (טווח משופר ב-50%)",
            "אחסון microSD עד 256GB / ענן / NVR (ONVIF); הזנה 12V DC 1A; עמידות IP66; 72x72x175 מ\"מ"
        ],
        "image": "/store-images/ct3.webp",
        "datasheet": "https://static.tenda.com.cn/tdeweb/download/CT3/CT3V1.0%20Datasheet.pdf",
        "highlights": [
            "רזולוציה 1080P Full HD (1920x1080), חיישן CMOS 1/2.9\", עדשה קבועה 4mm F1.6, זווית 85.6° אופקי / 93.1° אלכסוני – מצלמת צינור (Bullet), ללא Pan/Tilt",
            "ראיית לילה Full-Color עד 30 מ': 2 נורות IR + 2 זרקורים, שלושה מצבים (חכם / צבע מלא / שחור-לבן)",
            "אודיו דו-כיווני (מיקרופון + רמקול, סירנה 82dBA), אזעקת קול ואור; זיהוי תנועה ואדם מבוסס AI; תומך Amazon Alexa"
        ],
        "oldStock": false
    },
    {
        "slug": "cp3-pro",
        "brand": "Tenda",
        "model": "CP3 Pro (CP3 Pro V1.1)",
        "sku": null,
        "title": "מצלמת אבטחה ביתית Tenda CP3 Pro 2K ממונעת 360° Wi-Fi 6 עם זיהוי בכי תינוק וחיות מחמד",
        "category": "wifi",
        "categoryName": "מצלמות Wi-Fi לבית ולעסק",
        "price": 189,
        "specs": [
            "רזולוציה 2K / 3MP (2304x1296), חיישן CMOS 1/3\", עדשה 4mm F2.0, זווית 78° אופקי / 95° אלכסוני; קידוד H.265",
            "Pan/Tilt ממונע 355° אופקי, 155° אנכי (‎-65° עד +90°) עם מעקב אוטומטי אחר אדם (Human Tracking)",
            "ראיית לילה IR (2 נורות 850nm) עד 10 מ'; Smart Guardian: זיהוי תנועה, אדם, חיית מחמד, בכי תינוק וחבלה, אזעקת קול ואור, תריס פרטיות",
            "אודיו דו-כיווני + כפתור שיחה בלחיצה אחת (One-touch Call); הצפנה משולשת AES",
            "Wi-Fi 6 (802.11 b/g/n/ax) 2.4GHz עד 287Mbps; אחסון microSD עד 512GB / ענן (3 חודשי ניסיון) / NVR; הזנה 5V 1A USB Type-C; 103x88x88 מ\"מ"
        ],
        "image": "/store-images/cp3-pro.webp",
        "datasheet": "https://www.tendacn.com/product/specification/CP3ProV11",
        "highlights": [
            "רזולוציה 2K / 3MP (2304x1296), חיישן CMOS 1/3\", עדשה 4mm F2.0, זווית 78° אופקי / 95° אלכסוני; קידוד H.265",
            "Pan/Tilt ממונע 355° אופקי, 155° אנכי (‎-65° עד +90°) עם מעקב אוטומטי אחר אדם (Human Tracking)",
            "ראיית לילה IR (2 נורות 850nm) עד 10 מ'; Smart Guardian: זיהוי תנועה, אדם, חיית מחמד, בכי תינוק וחבלה, אזעקת קול ואור, תריס פרטיות"
        ],
        "oldStock": false
    }
];
