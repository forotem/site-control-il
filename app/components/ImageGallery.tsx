'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './ImageGallery.module.css';

interface ImageItem {
  src: string;
  alt: string;
  title?: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  columns?: number;
}

export function ImageGallery({ images, columns = 3 }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handlePrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    // כאן תוכל להוסיף קישור ל-API שלך לשמירת הפרטים
    console.log('Form submitted:', formData);
    alert('תודה! נחזור אליך בקרוב.');
    setShowContactForm(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  if (selectedIndex !== null) {
    const image = images[selectedIndex];
    return (
      <div className={styles.lightboxOverlay} onClick={() => setSelectedIndex(null)}>
        <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={() => setSelectedIndex(null)}>✕</button>
          
          <div className={styles.imageContainer}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              style={{ objectFit: 'contain' }}
              sizes="90vw"
            />
          </div>

          {image.title && <h2 className={styles.imageTitle}>{image.title}</h2>}

          <div className={styles.navigation}>
            <button onClick={handlePrevious} className={styles.navButton}>←</button>
            <span className={styles.counter}>{selectedIndex + 1} / {images.length}</span>
            <button onClick={handleNext} className={styles.navButton}>→</button>
          </div>

          <button
            className={styles.contactButton}
            onClick={() => setShowContactForm(!showContactForm)}
          >
            {showContactForm ? 'סגור' : 'השאר פרטים'}
          </button>

          {showContactForm && (
            <form className={styles.contactForm} onSubmit={handleSubmitForm}>
              <input
                type="text"
                placeholder="שם"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="אימייל"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="טלפון"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <textarea
                placeholder="הודעה"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
              />
              <button type="submit">שלח פרטים</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gallery} style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}>
      {images.map((image, index) => (
        <div
          key={index}
          className={styles.galleryItem}
          onClick={() => setSelectedIndex(index)}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={300}
            height={300}
            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
          />
        </div>
      ))}
    </div>
  );
}
