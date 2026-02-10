'use client';

import { useState } from 'react';
import { faq } from "../data/features";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section>
      <h2>שאלות נפוצות</h2>
      <p style={{ textAlign: 'center', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 40px', fontSize: '1.05rem' }}>
        תשובות לשאלות הכי נפוצות שמגיעות אלינו
      </p>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {faq.map((item, idx) => (
          <div 
            key={item.q}
            style={{
              background: openIndex === idx ? 'var(--glass-strong)' : 'var(--glass)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${openIndex === idx ? 'rgba(0, 194, 255, 0.2)' : 'var(--glass-border)'}`,
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: openIndex === idx ? '0 0 30px rgba(0, 194, 255, 0.08)' : 'none'
            }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              style={{
                width: '100%',
                padding: '20px 24px',
                background: 'none',
                border: 'none',
                color: openIndex === idx ? '#00c2ff' : 'var(--text-bright)',
                fontSize: '1.1rem',
                fontWeight: 600,
                textAlign: 'right',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                transition: 'color 0.3s ease',
                fontFamily: 'inherit'
              }}
            >
              <span>{item.q}</span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: openIndex === idx ? 'rgba(0, 194, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                fontSize: '14px',
                color: openIndex === idx ? '#00c2ff' : 'var(--muted)'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </button>
            <div style={{
              maxHeight: openIndex === idx ? '300px' : '0',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: openIndex === idx ? 1 : 0,
            }}>
              <p style={{
                padding: '0 24px 20px',
                margin: 0,
                color: 'var(--muted)',
                lineHeight: '1.7',
                fontSize: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                paddingTop: '16px'
              }}>
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
