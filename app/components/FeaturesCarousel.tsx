'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CarouselImage {
  id: number;
  src: string;
  title: string;
}

const images: CarouselImage[] = [
  {
    id: 1,
    src: '/images/carousel/360-degree-ptz-security-camera-construction-site-ai-detection.webp',
    title: '360 מעלות עם AI זיהוי',
  },
  {
    id: 2,
    src: '/images/carousel/4k-security-camera-image-quality-day-night-color-black-white.webp',
    title: 'איכות 4K יום ולילה',
  },
  {
    id: 3,
    src: '/images/carousel/active-deterrence-security-camera-construction-site-night.webp',
    title: 'הרתעה אקטיבית בלילה',
  },
  {
    id: 4,
    src: '/images/carousel/reolink-4g-camera-hebrew-features.webp',
    title: 'תכונות ReoLink 4G',
  },
  {
    id: 5,
    src: '/images/carousel/security-camera-local-storage-microsd-cloud-app.webp',
    title: 'אחסון מקומי וענן',
  },
  {
    id: 6,
    src: '/images/carousel/solar-4g-security-camera-construction-site-no-wifi-no-electricity.webp',
    title: 'סולארי בלא חשמל',
  },
];

export default function FeaturesCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
    setAutoPlay(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
    setAutoPlay(false);
  };

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
            גלו את כל התכונות המעניינות של מערכת המצלמות שלנו בתמונות אינטראקטיביות
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto group">
          {/* Main Image */}
          <div className="relative w-full bg-gray-100 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center" style={{ aspectRatio: '4 / 5' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Image
                  src={images[current].src}
                  alt={images[current].title}
                  fill
                  sizes="(max-width: 768px) 90vw, 700px"
                  className="object-contain"
                  priority={current === 0}
                  loading={current === 0 ? 'eager' : 'lazy'}
                />
                {/* Overlay with Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pb-8 px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                      {images[current].title}
                    </h3>
                    <p className="text-gray-200 text-sm md:text-base">
                      {current + 1} מתוך {images.length}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {images.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setCurrent(index);
                  setAutoPlay(false);
                }}
                className={`h-3 rounded-full transition ${
                  index === current
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 w-3 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-8 overflow-x-auto pb-4 justify-center flex-wrap">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setCurrent(index);
                  setAutoPlay(false);
                }}
                className={`relative flex-shrink-0 h-20 w-28 rounded-lg overflow-hidden transition ${
                  index === current ? 'ring-2 ring-blue-600' : 'opacity-60 hover:opacity-100'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  sizes="(max-width: 768px) 120px, 180px"
                  className="object-cover"
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl font-bold text-blue-600 mb-2">6</div>
            <p className="text-gray-600">תמונות להצגה</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">∞</div>
            <p className="text-gray-600">קרוסלה אוטומטית</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-4xl font-bold text-amber-600 mb-2">✨</div>
            <p className="text-gray-600">אנימציות חלקות</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
