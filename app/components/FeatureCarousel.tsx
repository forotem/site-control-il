"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { featureTiles } from "../data/images";
import { featureTilesAlt } from "../data/features";
import styles from "./FeatureCarousel.module.css";

export function FeatureCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featureTiles.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const handlePrevious = () => {
    setAutoPlay(false);
    setCurrent((prev) => (prev - 1 + featureTiles.length) % featureTiles.length);
  };

  const handleNext = () => {
    setAutoPlay(false);
    setCurrent((prev) => (prev + 1) % featureTiles.length);
  };

  const getVisibleTiles = () => {
    return [
      featureTiles[current],
      featureTiles[(current + 1) % featureTiles.length],
      featureTiles[(current + 2) % featureTiles.length],
    ];
  };

  const handleLightboxPrevious = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage - 1 + featureTiles.length) % featureTiles.length);
  };

  const handleLightboxNext = () => {
    if (selectedImage === null) return;
    setSelectedImage((selectedImage + 1) % featureTiles.length);
  };

  return (
    <section className={styles.carouselSection}>
      <h2 className={styles.title}>פונקציות מרכזיות</h2>
      
      <div
        className={styles.carousel}
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        {/* Three Image Tiles */}
        <div className={styles.tilesContainer}>
          {getVisibleTiles().map((tile, idx) => {
            const actualIndex = (current + idx) % featureTiles.length;
            return (
              <div
                key={`${current}-${idx}`}
                className={styles.tile}
                onClick={() => setSelectedImage(actualIndex)}
              >
                <Image
                  src={tile}
                  alt={featureTilesAlt[actualIndex]}
                  width={800}
                  height={600}
                  sizes="(max-width: 480px) 90vw, (max-width: 768px) 45vw, (max-width: 1200px) 30vw, 300px"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  priority={idx === 0}
                />
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <button
          className={styles.navButtonPrev}
          onClick={handlePrevious}
          aria-label="תמונה קודמת"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button
          className={styles.navButtonNext}
          onClick={handleNext}
          aria-label="תמונה הבאה"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        {/* Counter */}
        <div className={styles.counter}>
          {current + 1} / {featureTiles.length}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setSelectedImage(null)}
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setSelectedImage(null)}
              aria-label="סגור"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <div className={styles.lightboxImageWrapper}>
              <Image
                src={featureTiles[selectedImage]}
                alt={featureTilesAlt[selectedImage]}
                width={1200}
                height={900}
                sizes="(max-width: 768px) 95vw, 85vw"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                priority
              />
            </div>

            <div className={styles.lightboxControls}>
              <button
                className={styles.lightboxNavButton}
                onClick={handleLightboxPrevious}
                aria-label="תמונה קודמת"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <span className={styles.lightboxCounter}>
                {selectedImage + 1} / {featureTiles.length}
              </span>
              <button
                className={styles.lightboxNavButton}
                onClick={handleLightboxNext}
                aria-label="תמונה הבאה"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
