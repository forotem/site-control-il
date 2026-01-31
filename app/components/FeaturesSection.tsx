'use client';

import { motion } from 'framer-motion';

interface BentoBoxProps {
  title: string;
  description: string;
  image: string;
  span?: string;
  delay?: number;
}

function BentoBox({ title, description, image, span = 'col-span-1', delay = 0 }: BentoBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={`${span} relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer min-h-72`}
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-white mb-2"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          viewport={{ once: true }}
          className="text-gray-200 text-sm"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            יכולות טכנולוגיות מדהימות
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            כל שמה שאתה צריך בכדי להגן על הפרויקט שלך – בטכנולוגיה עדכנית ביותר
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large Box - 4K Analytics */}
          <BentoBox
            span="lg:col-span-2 md:col-span-2"
            title="איכות 4K + אנליטיקה חכמה"
            description="זיהוי תנועה AI, ניתוח וידאו בזמן אמת, דוחות מפורטים"
            image="/images/4k-construction-site-monitoring-video-analytics-high-resolution.webp"
            delay={0}
          />

          {/* Small Box - Waterproof */}
          <BentoBox
            title="עמידות בכל מזג אוויר"
            description="גשם, שמש, חום וקור – תוכנן לשטח קשה"
            image="/images/outdoor-waterproof-security-camera-rain-weatherproof.webp"
            delay={0.1}
          />

          {/* Small Box - Day/Night */}
          <BentoBox
            title="ראיית לילה מדהימה"
            description="צילום צבע ביום, IR בלילה – ללא אתרים עיוורים"
            image="/images/4k-security-camera-image-quality-day-night-color-black-white.webp"
            delay={0.2}
          />

          {/* Medium Box - Cloud Backup */}
          <BentoBox
            span="md:col-span-2 lg:col-span-2"
            title="גיבוי כפול – כרטיס + ענן"
            description="אחסון מקומי ומרוחק בו זמנית. התיעוד בטוח תמיד"
            image="/images/security-camera-local-storage-microsd-cloud-app.webp"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}
