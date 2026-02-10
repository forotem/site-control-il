import { featurePoints } from "../data/features";
import { type ReactNode } from "react";

const icons: ReactNode[] = [
  <svg key="plug" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m19 5 3-3"/><path d="m2 22 3-3"/><path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"/><path d="M7.5 13.5 10 11"/><path d="M10.5 16.5 13 14"/><path d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z"/></svg>,
  <svg key="cloud" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/></svg>,
  <svg key="phone" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
  <svg key="shield" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
];

export function FeatureGrid() {
  return (
    <section>
      <h2>למה לבחור במערכת שלנו?</h2>
      <p style={{ textAlign: 'center', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 40px', fontSize: '1.05rem' }}>
        טכנולוגיה מתקדמת שמגנה על הנכסים שלך 24/7
      </p>
      <div className="cards">
        {featurePoints.map((f, idx) => (
          <div key={f.title} className="card" style={{ textAlign: 'center', padding: '36px 28px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(0, 194, 255, 0.15), rgba(0, 102, 255, 0.08))',
              border: '1px solid rgba(0, 194, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {icons[idx]}
            </div>
            <div style={{
              display: 'inline-flex',
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(0, 194, 255, 0.08)',
              fontSize: '0.75rem',
              color: 'var(--accent)',
              fontWeight: 600,
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}>
              0{idx + 1}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{f.title}</h3>
            <p style={{ lineHeight: '1.7', fontSize: '0.98rem' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
