'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string;
  monthly?: string;
  description: string;
  features: string[];
  image: string;
  highlighted?: boolean;
  delay?: number;
}

function PricingCard({
  title,
  subtitle,
  price,
  monthly,
  description,
  features,
  image,
  highlighted = false,
  delay = 0,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={`relative rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${
        highlighted
          ? 'border-2 border-amber-500 shadow-2xl scale-100 md:scale-105'
          : 'border border-white/20 shadow-xl hover:shadow-2xl'
      } ${highlighted ? 'bg-white/15' : 'bg-white/10'}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <img src={image} alt="pattern" className="w-full h-full object-cover" />
      </div>

      {/* Featured Badge */}
      {highlighted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 flex items-center justify-center gap-2"
        >
          <Star className="w-4 h-4 fill-white" />
          <span className="font-bold text-sm">מומלץ ביותר</span>
        </motion.div>
      )}

      <div className={`relative z-10 p-8 ${highlighted ? 'pt-16' : ''}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 text-sm mb-6">{subtitle}</p>
        </motion.div>

        {/* Image Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          viewport={{ once: true }}
          className="mb-8 rounded-lg overflow-hidden h-48 border border-white/10"
        >
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{price}</span>
            {monthly && <span className="text-gray-300 text-sm">+ {monthly}/חודש</span>}
          </div>
          <p className="text-gray-400 text-sm mt-2">{description}</p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.4 }}
          viewport={{ once: true }}
          className="space-y-3 mb-8"
        >
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-200 text-sm">{feature}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
          viewport={{ once: true }}
          className={`w-full py-3 px-6 rounded-lg font-bold transition duration-300 ${
            highlighted
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
          }`}
        >
          בחרו חבילה זו
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            חבילות שירות מתאימות
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            בחרו את הפתרון המתאים ביותר לפרויקט שלכם
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            title="קנה והתקן"
            subtitle="DIY - בניהול עצמי"
            price="1,280 ₪"
            description="עלות חד-פעמית"
            features={[
              '✓ מצלמה סולארית ReoLink Go',
              '✓ כרטיס זיכרון 64GB',
              '✓ הדרכה טלפונית',
              '✗ ללא התקנה מקצועית',
              '✗ ללא תמיכה היומית',
            ]}
            image="/images/reolink-go.webp"
            delay={0}
          />

          <PricingCard
            title="שקט תעשייתי"
            subtitle="מומלץ - שירות מלא"
            price="3,230 ₪"
            monthly="70 ₪"
            description="התקנה, ניהול וניטור"
            features={[
              '✓ ReoLink Go עם סוללה גדולה',
              '✓ התקנה מקצועית בשטח',
              '✓ ניהול מרחוק 24/7',
              '✓ תמיכה טכנית זמינה',
              '✓ ביטוח אופציונלי',
            ]}
            image="/images/reolink-ptz-solar-security-camera-with-solar-panel.webp"
            highlighted={true}
            delay={0.1}
          />

          <PricingCard
            title="אתר בבנייה"
            subtitle="Enterprise - כיסוי מלא"
            price="8,420 ₪"
            monthly="280 ₪"
            description="4 מצלמות + ניהול"
            features={[
              '✓ סיור ותכנון מלא',
              '✓ 4 מצלמות ReoLink',
              '✓ התקנה מרוכזת',
              '✓ ניהול ניטור יומי',
              '✓ Time-Lapse ודוחות',
            ]}
            image="/images/reolink-4g-camera-hebrew-features.webp"
            delay={0.2}
          />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-300 mb-4">
            לא בטוחים איזה חבילה מתאימה? סיור מקדים בחינם!
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition"
          >
            התייעצו עם מומחה
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
