// בדיקת Google Analytics - הרץ בקונסול של הדפדפן באתר שלך

// 1. בדוק אם gtag קיים
console.log('gtag exists:', typeof gtag !== 'undefined');

// 2. בדוק אם dataLayer קיים
console.log('dataLayer exists:', typeof dataLayer !== 'undefined');
console.log('dataLayer contents:', dataLayer);

// 3. שלח event בדיקה
if (typeof gtag !== 'undefined') {
  gtag('event', 'test_event', {
    'event_category': 'testing',
    'event_label': 'manual_test'
  });
  console.log('Test event sent');
}

// 4. בדוק ברשת (Network tab) שיש קריאות ל:
// - https://www.google-analytics.com/analytics.js
// - https://www.googletagmanager.com/gtag/js
// - collect requests לgoogle-analytics.com