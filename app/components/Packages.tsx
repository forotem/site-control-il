'use client';

import Link from "next/link";
import { packages } from "../data/packages";

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);

const CrownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
);

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle' }}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.468"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>
);

export function Packages() {
  return (
    <section>
      <h2>חבילות ומחירים</h2>
      <p style={{ textAlign: 'center', color: 'var(--muted)', maxWidth: '650px', margin: '0 auto 40px', fontSize: '1.05rem' }}>
        בחר את החבילה המתאימה לך — כל החבילות כוללות התקנה, הדרכה ותמיכה מלאה
      </p>
      <div className="cards" style={{ gap: '28px' }}>
        {packages.map((pkg, idx) => (
          <div 
            key={pkg.id} 
            className="card" 
            style={{ 
              borderColor: pkg.highlight ? 'rgba(0, 194, 255, 0.4)' : 'var(--glass-border)',
              padding: '0',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Popular badge */}
            {pkg.highlight && (
              <div style={{
                background: 'linear-gradient(135deg, #00c2ff 0%, #0066ff 50%, #7b2dff 100%)',
                color: 'white',
                textAlign: 'center',
                padding: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}>
                                <CrownIcon /> הכי פופולרי
              </div>
            )}
            
            <div style={{ padding: '32px 28px' }}>
              <div style={{ marginBottom: '16px' }}>
                <span className="tag" style={{ fontSize: '0.8rem' }}>
                  {pkg.monthly && pkg.monthly !== "" ? `${pkg.monthly} חודשי` : <><WalletIcon /> חד פעמי</>}
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>{pkg.title}</h3>
              
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ffffff 0%, var(--accent) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1
                }}>
                  {pkg.price}
                </span>
                {pkg.monthly && (
                  <span style={{ color: 'var(--muted)', fontSize: '0.9rem', marginRight: '8px' }}>
                    + {pkg.monthly}
                  </span>
                )}
              </div>
              
              <div style={{ 
                background: 'rgba(0, 194, 255, 0.04)', 
                borderRadius: '12px', 
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid rgba(0, 194, 255, 0.08)'
              }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {pkg.bullets.map((b) => (
                    <li key={b} style={{ 
                      padding: '8px 0',
                      paddingRight: '28px',
                      position: 'relative',
                      color: 'var(--muted)',
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
                    }}>
                      <span style={{ 
                        position: 'absolute', 
                        right: 0, 
                        color: '#25D366',
                        fontSize: '14px'
                      }}><CheckIcon /></span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link href="/contact" style={{ width: "100%", display: "block", textDecoration: 'none' }}>
                <div 
                  style={{ 
                    width: "100%", 
                    textAlign: 'center',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: pkg.highlight 
                      ? 'linear-gradient(135deg, #00c2ff 0%, #0066ff 50%, #7b2dff 100%)' 
                      : 'rgba(255, 255, 255, 0.06)',
                    color: 'white',
                    border: pkg.highlight ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: pkg.highlight ? '0 4px 20px rgba(0, 194, 255, 0.3)' : 'none'
                  }}
                >
                  {pkg.cta}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
