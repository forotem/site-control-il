import Image from "next/image";
import Link from "next/link";
import { heroImage } from "../data/images";
import { heroBullets } from "../data/features";
export function Hero() {
  return (
    <section className="hero" style={{ marginTop: '20px', marginBottom: '40px' }}>
      <div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <span className="tag"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle'}}><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg> 4G LTE</span>
          <span className="tag"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle'}}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> סולארי</span>
          <span className="tag"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle'}}><path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/></svg> גיבוי ענן</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', lineHeight: '1.15', marginBottom: '20px' }}>
          מצלמות אבטחה סולאריות 4G לאתרי בנייה ושטחים מבודדים
        </h1>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--muted)', marginBottom: '24px' }}>
          ללא חשמל או אינטרנט, עם גיבוי ענן בזמן אמת ושליטה מרחוק. פתרון &ldquo;שים ושכח&rdquo; שמגן על האתר ועל הראיות.
        </p>
        <div className="cta-row">
          <Link href="/contact" className="button" style={{ fontSize: '1.05rem', padding: '18px 36px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg> דברו עם מומחה
          </Link>
          <Link href="/contact" className="button secondary" style={{ fontSize: '1.05rem', padding: '18px 36px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="18" x="8" y="3" rx="1"/><path d="M12 7h.01"/><path d="M12 11h.01"/><path d="M12 15h.01"/></svg> תאמו סיור - 300 ₪
          </Link>
        </div>
        <ul className="list" style={{ marginTop: '28px' }}>
          {heroBullets.map((item) => (
            <li key={item} style={{ fontSize: '1.02rem' }}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="hero-img">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          width={heroImage.width}
          height={heroImage.height}
          sizes="(max-width: 768px) 100vw, 600px"
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
          priority
        />
      </div>
    </section>
  );
}
