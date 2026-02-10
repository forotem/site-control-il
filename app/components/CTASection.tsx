'use client';

import { motion } from 'framer-motion';

const Phone = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

const Mail = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const MessageSquare = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

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
