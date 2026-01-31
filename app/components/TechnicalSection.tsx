'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function TechnicalSection() {
  const specs = [
    'זיהוי תנועה AI (עד 8 מטרים)',
    'ויזיון לילה בחום תרמי',
    'ירי זרקור אוטומטי',
    'סירנה אזעקה חכמה',
    'סוללה 10,000 mAh',
    'פאנל סולארי 30W',
    'קישוריות 4G LTE + WiFi',
    'אחסון ענן בלתי מוגבל',
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            מפרט טכני מלא
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            כל החלקים שהצלחת בתוך קופסה אחת
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/security-camera-hardware-components-infrared-pir-microphone.webp"
                alt="מפרט טכני"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Specs */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              יכולות מקצועיות
            </h3>

            <div className="space-y-4">
              {specs.map((spec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition"
                >
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-lg text-gray-700 font-medium">{spec}</span>
                </motion.div>
              ))}
            </div>

            {/* Package Contents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
            >
              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                📦 תכולת הערכה
              </h4>
              <div className="space-y-3">
                {[
                  'מצלמה ReoLink Go עם כל הצירופים',
                  'פאנל סולארי 30W',
                  'כרטיס זיכרון 64GB',
                  'כבלים והתקנים',
                  'מדריך התקנה מלא',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
