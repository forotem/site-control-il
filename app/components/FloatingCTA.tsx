'use client';
// הכפתור הצף: לפני שנפתח ווצאפ, הלקוח בוחר במה מדובר, כדי שההודעה תגיע עם הקשר ("מחפש מצלמות לבית") ולא
// "אשמח לייעוץ..." ואחריו "מחיר" (רותם 6.10.2026: "הם רואים הרבה מוצרים והרבה שמות של חברות, הם צריכים קטגוריות
// פשוטות"). ולמי שלא מסתדר עם ווצאפ: בקשת שיחה חוזרת (נשלחת כמו כל ליד, /api/lead עם form=callback).
// כל אפשרות היא קישור wa.me, ולכן המדידה (SiteTracking, contact_whatsapp) ממשיכה לעבוד, עם location לפי הבחירה.
// טקסט חדש כאן = להוסיף גם ל-app/lib/site-wa-prefills.ts, אחרת טל וקליטת הלידים לא יזהו אותו.
import { useEffect, useRef, useState } from 'react';
import { track } from '../lib/analytics';
import { getAttribution } from '../lib/attribution';

const WA = '972502256866';
const CHOICES = [
  { id: 'home', icon: '🏠', label: 'מצלמות לבית', text: 'היי, אני מחפש מצלמות אבטחה לבית', page: '/store/c/kits' },
  { id: 'business', icon: '🏪', label: 'מצלמות לעסק', text: 'היי, אני מחפש מצלמות אבטחה לעסק', page: '/store/c/ip' },
  { id: 'solar', icon: '☀️', label: 'בלי חשמל ואינטרנט (סולארי 4G)', text: 'היי, אני מחפש מצלמה סולארית 4G למקום בלי חשמל ואינטרנט', page: '/store/c/solar' },
  { id: 'intercom', icon: '🔔', label: 'אינטרקום לבית או לבניין', text: 'היי, אני מחפש אינטרקום', page: '/store/c/intercom' },
  { id: 'install', icon: '🛠️', label: 'התקנה', text: 'היי, אני צריך התקנה של מצלמות / אינטרקום', page: '/installation' },
  { id: 'unsure', icon: '💬', label: 'לא בטוח, תעזרו לי', text: 'שלום, אשמח לייעוץ לגבי מצלמות אבטחה / אינטרקום', page: '/store/finder' },
];

export function FloatingCTA() {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('unsure');
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle');
  const [err, setErr] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onDown = (e: MouseEvent) => { if (panel.current && !panel.current.contains(e.target as Node) && !(e.target as Element).closest?.('.floating-btn.whatsapp')) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); };
  }, [open]);

  async function sendCallback(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (name.trim().length < 2 || phone.replace(/\D/g, '').length < 9) { setErr('צריך שם וטלפון כדי שנחזור אליכם'); return; }
    setState('sending');
    const c = CHOICES.find((x) => x.id === topic);
    try {
      const r = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: 'callback', name, phone, need: c ? c.label : 'לא צוין', page: window.location.pathname, website, attribution: getAttribution() }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(j.error || 'משהו השתבש, נסו שוב'); setState('idle'); return; }
      track.formSubmit('callback', topic, j.leadId);
      setState('done');
    } catch {
      setErr('אין חיבור, נסו שוב'); setState('idle');
    }
  }

  return (
    <div className="floating-cta">
      {open && (
        <div className="cta-panel" ref={panel} role="dialog" aria-label="במה אפשר לעזור?" data-track="floating-menu">
          <div className="cta-panel-head">
            <b>במה אפשר לעזור?</b>
            <button type="button" className="cta-close" onClick={() => setOpen(false)} aria-label="סגירה">✕</button>
          </div>
          {!callback ? (
            <>
              <p className="cta-sub">בחרו, ונמשיך בווצאפ. אפשר גם לראות קודם את המוצרים.</p>
              <ul className="cta-list">
                {CHOICES.map((c) => (
                  <li key={c.id} data-track={`floating-${c.id}`}>
                    <a className="cta-choice" href={`https://wa.me/${WA}?text=${encodeURIComponent(c.text)}`} target="_blank" rel="noopener noreferrer">
                      <span aria-hidden>{c.icon}</span> {c.label}
                    </a>
                    <a className="cta-browse" href={c.page}>מוצרים</a>
                  </li>
                ))}
              </ul>
              <button type="button" className="cta-callback-btn" onClick={() => setCallback(true)}>📞 מעדיפים שנתקשר אליכם? השאירו מספר</button>
            </>
          ) : state === 'done' ? (
            <p className="cta-sub">תודה! רותם יחזור אליכם בהקדם, בשעות הפעילות (א&apos;-ה&apos; 08:00-18:00, ו&apos; עד 14:00).</p>
          ) : (
            <form className="cta-form" onSubmit={sendCallback}>
              <label>שם<input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} autoComplete="name" /></label>
              <label>טלפון<input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} inputMode="tel" autoComplete="tel" dir="ltr" /></label>
              <label>במה מדובר?
                <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                  {CHOICES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </label>
              <input tabIndex={-1} autoComplete="off" aria-hidden value={website} onChange={(e) => setWebsite(e.target.value)} name="website" style={{ position: 'absolute', left: '-9999px' }} />
              {err && <p role="alert" className="cta-err">{err}</p>}
              <button type="submit" className="cta-submit" disabled={state === 'sending'}>{state === 'sending' ? 'שולח…' : 'תתקשרו אליי'}</button>
              <button type="button" className="cta-back" onClick={() => setCallback(false)}>← חזרה</button>
            </form>
          )}
        </div>
      )}
      <button
        type="button"
        className="floating-btn whatsapp animate-pulse-glow"
        aria-label="ווצאפ: במה אפשר לעזור?"
        aria-expanded={open}
        onClick={() => { setOpen((v) => !v); setCallback(false); setState('idle'); setErr(null); }}
        style={{ animationDelay: '0s' }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '28px', height: '28px' }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>
      <a href="tel:+972502256866" className="floating-btn phone" aria-label="התקשר אלינו" data-track="floating">
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px' }}>
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </a>
    </div>
  );
}
