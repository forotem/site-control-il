'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare } from 'lucide-react';

export default function CTASection() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0">
        <img
          src="/images/site-control-background-tech-cloud-network.webp"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            מוכנים להתחיל?
          </h2>
          <p className="text-xl text-gray-300">
            סיור שטח בחינם, ייעוץ מקצועי וביצוע ההתקנה לפי לו"ז שלכם
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.a
            href="tel:+972123456789"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            viewport={{ once: true }}
            className="group relative p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:border-blue-500/50 transition cursor-pointer"
          >
            <div className="flex items-center justify-center mb-4">
              <Phone className="w-8 h-8 text-blue-400 group-hover:scale-110 transition" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2 text-center">
              קראו לנו
            </h3>
            <p className="text-gray-300 text-center text-sm">
              +972 (0)50 123-4567
            </p>
          </motion.a>

          <motion.a
            href="mailto:info@sitecontrol.co.il"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="group relative p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:border-amber-500/50 transition cursor-pointer"
          >
            <div className="flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-amber-400 group-hover:scale-110 transition" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2 text-center">
              שלחו דוא"ל
            </h3>
            <p className="text-gray-300 text-center text-sm">
              info@sitecontrol.co.il
            </p>
          </motion.a>

          <motion.a
            href="https://wa.me/972501234567"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="group relative p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:border-green-500/50 transition cursor-pointer"
          >
            <div className="flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-green-400 group-hover:scale-110 transition" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2 text-center">
              WhatsApp
            </h3>
            <p className="text-gray-300 text-center text-sm">
              שלחו הודעה עכשיו
            </p>
          </motion.a>
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-400 mb-6 text-sm">
            או מלאו טופס יצירת קשר ויזמנו סיור מקדים בחינם
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg transition shadow-2xl"
          >
            הזמן סיור מקדים בחינם
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
