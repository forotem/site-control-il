'use client';

import { useState } from 'react';
import styles from './ContactPage.module.css';

export default function ContactFormContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', phone: '', company: '', category: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'שגיאה בשליחת הטופס' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'שגיאה בחיבור לשרת' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.contactPage}>
      <div className={styles.header}>
        <h1>צור קשר</h1>
        <p>יש לך שאלות? רוצה להציע פתרון בטחוני מותאם? השאר פרטים ונחזור אליך בקרוב.</p>
      </div>

      <div className={styles.container}>
        <section className={styles.formSection}>
          <h2>טופס יצירת קשר</h2>
          {status && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '16px',
              borderRadius: '6px',
              backgroundColor: status.type === 'success' ? '#e8f5e9' : '#ffebee',
              color: status.type === 'success' ? '#2e7d32' : '#c62828',
              border: `1px solid ${status.type === 'success' ? '#81c784' : '#ef5350'}`,
            }}>
              {status.message}
            </div>
          )}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">שם מלא *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">טלפון *</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">אימייל *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="company">שם העסק / הארגון</label>
              <input 
                type="text" 
                id="company" 
                name="company" 
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">קטגוריה *</label>
              <select 
                id="category" 
                name="category" 
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">בחר קטגוריה</option>
                <option value="construction">אתרי בנייה</option>
                <option value="agriculture">חקלאות</option>
                <option value="remote">אתרים מרוחקים</option>
                <option value="other">אחר</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">הודעה *</label>
              <textarea 
                id="message" 
                name="message" 
                rows={5} 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'שולח...' : 'שלח הודעה'}
            </button>
          </form>
        </section>

        <section className={styles.infoSection}>
          <h2>פרטים נוספים</h2>

          <div className={styles.infoBox}>
            <h3>📞 טלפון</h3>
            <p>
              <a href="tel:+972-50-2256866">050-225-6866</a>
            </p>
          </div>

          <div className={styles.infoBox}>
            <h3>📧 אימייל</h3>
            <p>
              <a href="mailto:info@site-control-il.com">info@site-control-il.com</a>
            </p>
          </div>

          <div className={styles.infoBox}>
            <h3>⏰ שעות פעילות</h3>
            <p>
              ראשון - חמישי: 08:00 - 18:00 <br />
              שישי: 08:00 - 14:00 <br />
              שבת: סגור
            </p>
          </div>

          <div className={styles.infoBox}>
            <h3>🚀 מה נוכל לעשות?</h3>
            <ul>
              <li>הצעת פתרון בטחוני מותאם</li>
              <li>סיור בשטח חינם</li>
              <li>ייעוץ טכני מקצועי</li>
              <li>הצעת מחיר מנוגדת</li>
              <li>תמיכה טכנית 24/7</li>
            </ul>
          </div>

          <div className={styles.infoBox}>
            <h3>🤝 בשיתוף Reolink</h3>
            <p>
              Site-Control עובדת עם Reolink - יצרנית מובילה בעולם של מצלמות אבטחה מתקדמות. 
              כל הציוד, ההדרכה והתמיכה הם מהשיתוף בין הצוותים.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
