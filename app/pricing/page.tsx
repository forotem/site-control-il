'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import PricingCard from '../components/PricingCard';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-right">
              <h1 className="text-5xl font-bold mb-4">מחירון ReoLink - בחבילות שלנו</h1>
              <p className="text-xl text-blue-100">
                מצלמות ReoLink Go & PT עם התקנה מקצועית, תמיכה וניהול
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src="/images/reolink-go-plus-security-camera.webp" 
                alt="ReoLink Go Plus"
                className="rounded-lg shadow-2xl max-w-full h-auto"
                width={350}
                height={350}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Bundle 1 */}
            <PricingCard
              title="ReoLink Go - בסיסי"
              description="מצלמה סולארית - אתה מתקין"
              price="1,280 ₪"
              features={[
                '✓ ReoLink Go (סולארית)',
                '✓ כרטיס זיכרון 64GB',
                '✓ הדרכה טכנית בטלפון',
                '✗ ללא התקנה on-site',
                '✗ ללא תמיכה המשך',
              ]}
            />

            {/* Bundle 2 - Highlighted */}
            <PricingCard
              title="ReoLink Go - מקצועי"
              description="התקנה + ניהול + תמיכה"
              price="3,230 ₪"
              monthly="70 ₪"
              features={[
                '✓ ReoLink Go עם סוללה גדולה',
                '✓ התקנה מקצועית on-site',
                '✓ ניהול ניטור מרחוק',
                '✓ תמיכה טכנית 24/7',
                '✓ ביטוח אופציונלי',
              ]}
              highlighted={true}
            />

            {/* Bundle 3 */}
            <PricingCard
              title="ReoLink Go/PT - enterprise"
              description="4 מצלמות + ניהול מלא"
              price="8,420 ₪"
              monthly="280 ₪"
              features={[
                '✓ סיור ותכנון מלא',
                '✓ 4 מצלמות ReoLink (Go+PT)',
                '✓ התקנה מרוכזת',
                '✓ ניהול ניטור יומי',
                '✓ Time-Lapse + דוחות',
              ]}
            />
          </div>

          {/* Camera Gallery */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-8">מצלמות ReoLink בחזרה</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                <img 
                  src="/images/reolink-go.webp" 
                  alt="ReoLink Go"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg">ReoLink Go</h4>
                  <p className="text-gray-600 text-sm">סולארית בסיסית</p>
                </div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                <img 
                  src="/images/reolink-4g-camera-hebrew-features.webp" 
                  alt="ReoLink 4G"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg">ReoLink 4G</h4>
                  <p className="text-gray-600 text-sm">תקשורת סלולרית</p>
                </div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                <img 
                  src="/images/reolink-ptz-solar-security-camera-with-solar-panel.webp" 
                  alt="ReoLink PT עם סולאר"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg">ReoLink PT</h4>
                  <p className="text-gray-600 text-sm">סיבוב אוטומטי</p>
                </div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                <img 
                  src="/images/outdoor-waterproof-security-camera-rain-weatherproof.webp" 
                  alt="מצלמה עמידה"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg">עמידה בתנאים</h4>
                  <p className="text-gray-600 text-sm">גשם, שמש וחום</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <h2 className="text-3xl font-bold p-8 bg-gray-100 border-b">השוואה מפורטת</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-6 py-4 text-right font-bold">קריטריון</th>
                    <th className="px-6 py-4 text-center font-bold">ReoLink Go בסיסי</th>
                    <th className="px-6 py-4 text-center font-bold bg-blue-50">ReoLink מקצועי</th>
                    <th className="px-6 py-4 text-center font-bold">אתר בבנייה</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">עלות הקמה</td>
                    <td className="px-6 py-4 text-center">1,280 ₪</td>
                    <td className="px-6 py-4 text-center bg-blue-50">3,230 ₪</td>
                    <td className="px-6 py-4 text-center">8,420 ₪</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">עלות חודשית</td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-center bg-blue-50">70 ₪</td>
                    <td className="px-6 py-4 text-center">280 ₪</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">מצלמות</td>
                    <td className="px-6 py-4 text-center">1</td>
                    <td className="px-6 py-4 text-center bg-blue-50">1</td>
                    <td className="px-6 py-4 text-center">4</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">התקנה</td>
                    <td className="px-6 py-4 text-center">אופציונלי</td>
                    <td className="px-6 py-4 text-center bg-blue-50">✓ כלול</td>
                    <td className="px-6 py-4 text-center">✓ כלול</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">ניהול מרחוק</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center bg-blue-50">✓</td>
                    <td className="px-6 py-4 text-center">✓</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">ביטוח</td>
                    <td className="px-6 py-4 text-center">❌</td>
                    <td className="px-6 py-4 text-center bg-blue-50">אופציונלי</td>
                    <td className="px-6 py-4 text-center">אופציונלי</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">שאלות נפוצות</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-xl font-bold mb-3">האם ניתן להוסיף מצלמות לאחר ההקמה?</h3>
              <p className="text-gray-700">
                כן, לחלוטין. ניתן להוסיף מצלמות בכל זמן. עלויות ההוספה יהיו זהות לחבילה שבחרתם.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-xl font-bold mb-3">מה נכלל בביטוח?</h3>
              <p className="text-gray-700">
                ביטוח מלא מפני גניבה, נזק פיזי ותקלות טכניות. במקרה של גניבה, נחליף את המצלמה בחינם.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-xl font-bold mb-3">כמה זמן לוקח להקמה?</h3>
              <p className="text-gray-700">
                סיור מקדים: 1-2 שעות. התקנה: 2-4 שעות (תלוי בסיבוכיות). לאחר התקנה, המערכת חלה מיד.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-xl font-bold mb-3">האם צריך חוזה ארוך?</h3>
              <p className="text-gray-700">
                לא. אנחנו עובדים על בסיס חודשי או פרויקט. אתם יכולים לבטל בכל זמן (פחות משק אחרון).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">מוכנים לחבילה שלכם?</h2>
          <p className="text-xl mb-8 text-blue-100">
            סיור מקדים בחינם – אנחנו נחשב עבורכם בדיוק כמה זה יעלה
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
          >
            תזמינו סיור עכשיו
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
