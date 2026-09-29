"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "../lib/analytics";
import { getAttribution } from "../lib/attribution";
import { WHATSAPP_NUMBER } from "../data/store-catalog";
import c from "../store/commerce.module.css";
import home from "../home.module.css";
import styles from "./offer.module.css";

export type CalcTier = { id: string; name: string; tagline: string; equipment: number; image: string | null; product: string; points: string[] };

const nis = (n: number) => Math.round(n).toLocaleString("he-IL");

/** מחשבון החבילה: מצלמות לאתר, מספר אתרים, עם או בלי התקנה, סים. כל המחירים שמוצגים כוללים מע"מ, ולצידם הסכום לפני מע"מ.
 *  ההתקנה היא הערכה לפי ימי עבודה של מתקין (installDay לפני מע"מ, camsPerDay מצלמות ליום), לא מחיר סגור */
export function OfferCalculator({ tiers, installDay, camsPerDay, sim, camsOptions, sitesMax, vatRate, giftCardGb }: {
  tiers: CalcTier[]; installDay: number; camsPerDay: number; sim: { gb: number; months: number; price: number };
  camsOptions: number[]; sitesMax: number; vatRate: number; giftCardGb: number;
}) {
  const [cams, setCams] = useState(camsOptions[0]);
  const [sites, setSites] = useState(1);
  const [install, setInstall] = useState(false);
  const [withSim, setWithSim] = useState(true);
  const units = cams * sites;
  const days = Math.ceil(cams / camsPerDay) * sites;
  const installTotal = install ? days * installDay * (1 + vatRate) : 0;
  const perCam = (t: CalcTier) => t.equipment + (withSim ? sim.price : 0);
  const totalFor = (t: CalcTier) => perCam(t) * units + installTotal;
  const summary = (t: CalcTier) =>
    `${t.name} (${t.product}), ${cams} מצלמות לאתר × ${sites} ${sites === 1 ? "אתר" : "אתרים"}, ${install ? "עם התקנה" : "בלי התקנה"}${withSim ? ", עם סים" : ""}: ${install ? "כ-" : ""}${nis(totalFor(t))} ₪ כולל מע"מ`;

  return (
    <div className={styles.calc}>
      <div className={styles.controls} role="group" aria-label="בניית החבילה">
        <div className={styles.control}>
          <span>מצלמות בכל אתר</span>
          <div className={styles.seg}>
            {camsOptions.map((n) => (
              <button key={n} type="button" aria-pressed={cams === n} onClick={() => setCams(n)}>{n}</button>
            ))}
          </div>
        </div>
        <div className={styles.control}>
          <span>כמה אתרים</span>
          <div className={styles.seg}>
            {Array.from({ length: sitesMax }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" aria-pressed={sites === n} onClick={() => setSites(n)}>{n}</button>
            ))}
          </div>
        </div>
        <div className={styles.control}>
          <span>התקנה</span>
          <div className={styles.seg}>
            <button type="button" aria-pressed={!install} onClick={() => setInstall(false)}>מתקינים בעצמנו, בליווי</button>
            <button type="button" aria-pressed={install} onClick={() => setInstall(true)}>מתקין מטעמכם</button>
          </div>
        </div>
        <div className={styles.control}>
          <span>סים {sim.gb}GB ל-{sim.months} חודשים</span>
          <div className={styles.seg}>
            <button type="button" aria-pressed={withSim} onClick={() => setWithSim(true)}>מהחנות</button>
            <button type="button" aria-pressed={!withSim} onClick={() => setWithSim(false)}>יש לנו סים</button>
          </div>
        </div>
      </div>

      <div className={styles.tiers}>
        {tiers.map((t) => {
          const total = totalFor(t);
          const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`היי, אשמח להצעה לאתרי בנייה: ${summary(t)}`)}`;
          return (
            <article key={t.id} className={`${styles.tier} ${t.id === "best" ? styles.tierBest : ""}`} data-track={`site_offer_${t.id}`}>
              <header>
                {t.image && <img src={t.image} alt={t.product} loading="lazy" />}
                <div>
                  <b>{t.name}</b>
                  <em>{t.product}</em>
                  <p>{t.tagline}</p>
                </div>
              </header>
              <ul>{t.points.map((p) => <li key={p}>{p}</li>)}</ul>
              <dl className={styles.lines}>
                <div><dt>ציוד למצלמה (מצלמה + פאנל סולארי)</dt><dd>{nis(t.equipment)} ₪</dd></div>
                {withSim && <div><dt>סים {sim.gb}GB ל-{sim.months} חודשים</dt><dd>{nis(sim.price)} ₪</dd></div>}
                <div className={styles.perCam}><dt>למצלמה</dt><dd>{nis(perCam(t))} ₪</dd></div>
                {install && <div><dt>התקנה: {days} {days === 1 ? "יום עבודה" : "ימי עבודה"} של מתקין, כולל כרטיס {giftCardGb}GB לכל מצלמה (הערכה)</dt><dd>{nis(installTotal)} ₪</dd></div>}
              </dl>
              <div className={styles.total}>
                <span>{units} מצלמות ({cams} × {sites} {sites === 1 ? "אתר" : "אתרים"})</span>
                <strong>{install ? "כ-" : ""}{nis(total)} ₪ <small>כולל מע״מ</small></strong>
                <span>{nis(total / (1 + vatRate))} ₪ לפני מע״מ</span>
              </div>
              <a className={`${home.cta} ${t.id === "best" ? home.ctaAccent : home.ctaGhost}`} href={wa} target="_blank" rel="noopener noreferrer"
                onClick={() => track.whatsapp(`site_offer_${t.id}`)}>לסגור את החבילה בווצאפ</a>
            </article>
          );
        })}
      </div>
      <p className={styles.note}>
        {install
          ? `ההתקנה היא הערכה: יום עבודה של מתקין מקצועי הוא כ-${nis(installDay)} ₪ + מע״מ, ובאתר רגיל מתקינים עד ${camsPerDay} מצלמות ביום על גדר, קונטיינר או עמוד קיים. המחיר הסופי תלוי במיקום, במורכבות ובכמות, ונסגר אחרי שרואים את האתר.`
          : "מתקינים בעצמכם: תולים, מכניסים סים וסורקים ברקוד באפליקציה, ואנחנו מלווים בטלפון, בווצאפ או בשיחת וידאו. משלוח בתשלום נפרד לפי הכתובת, או איסוף עצמי. 5 מצלמות ומעלה: כתבו לנו ונחזור עם מחיר לקבלנים."}
      </p>
    </div>
  );
}

/** טופס קצר לתיאום סיור באתר: שם, טלפון, כמה אתרים ואיפה. נשלח לאותו /api/lead של המבצעים */
export function SiteOfferForm({ surveyPrice }: { surveyPrice: string }) {
  const page = usePathname();
  const [form, setForm] = useState({ name: "", phone: "", sites: "1", cams: "4", where: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, phone: form.phone, need: "סיור באתר בנייה (מצלמות סולאריות)", city: form.where,
          note: `סיור מקצועי ${surveyPrice} ₪\nאתרים: ${form.sites}\nמצלמות לאתר: ${form.cams}`, website: form.website,
          form: "deal", page, attribution: getAttribution(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה");
      track.formSubmit("deal", "construction_sites", data.leadId);
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "שגיאה בשליחה");
    } finally {
      setBusy(false);
    }
  }

  if (done) return <p className={styles.done}>קיבלנו, תודה. נחזור אליכם לתאם את הסיור. בינתיים אפשר לשלוח סרטון מהאתר בווצאפ.</p>;
  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "0.8rem", maxWidth: 560 }}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap", border: 0 }} />
      <label className={c.field}><span>שם</span><input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
      <label className={c.field}><span>טלפון</span><input required type="tel" inputMode="tel" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></label>
      <label className={c.field}><span>כמה אתרים?</span>
        <select value={form.sites} onChange={(e) => setForm({ ...form, sites: e.target.value })}>
          {["1", "2", "3", "4", "5 ומעלה"].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <label className={c.field}><span>כמה מצלמות בכל אתר?</span>
        <select value={form.cams} onChange={(e) => setForm({ ...form, cams: e.target.value })}>
          {["1-3", "4", "5", "6", "7 ומעלה"].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <label className={c.field}><span>איפה האתרים?</span><input required value={form.where} onChange={(e) => setForm({ ...form, where: e.target.value })} placeholder="למשל: פתח תקווה, ראש העין" /></label>
      {err && <div className={c.formErr} role="alert">{err}</div>}
      <button type="submit" className={`${home.cta} ${home.ctaAccent}`} disabled={busy}>{busy ? "שולח…" : `לתאם סיור באתר (${surveyPrice} ₪)`}</button>
    </form>
  );
}
