"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { track } from "../lib/analytics";
import { getAttribution } from "../lib/attribution";
import { WHATSAPP_NUMBER } from "../data/store-catalog";
import c from "../store/commerce.module.css";
import styles from "../home.module.css";

const kinds = ["בית פרטי / וילה", "דירה", "בניין משותף", "עסק / משרד / חנות", "מחסן / אתר / שטח"];
const needs = ["מצלמות אבטחה", "אינטרקום", "בקרת כניסה / קודן", "שדרוג מערכת קיימת", "לא בטוח, צריך ייעוץ"];

export function InstallForm() {
  const page = usePathname();
  const [form, setForm] = useState({ name: "", phone: "", kind: kinds[0], need: needs[0], city: "", note: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`היי, אשמח להצעת מחיר להתקנה: ${form.need}, ${form.kind}${form.city ? `, ${form.city}` : ""}`)}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, page, attribution: getAttribution() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה");
      track.formSubmit(`install: ${form.need}`);
      setDone(true);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "שגיאה בשליחה");
    } finally { setBusy(false); }
  }

  if (done) {
    return <p className={styles.kicker} role="status">תודה {form.name}! קיבלנו את הפרטים ונחזור אליך בהקדם. רוצה לזרז? <a href={wa} target="_blank" rel="noopener noreferrer">כתבו לנו בווצאפ</a>.</p>;
  }
  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "0.8rem", maxWidth: 560 }}>
      <label className={c.field}><span>שם</span><input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
      <label className={c.field}><span>טלפון</span><input required type="tel" inputMode="tel" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></label>
      <fieldset className={c.fieldset}>
        <legend>איפה?</legend>
        {kinds.map((k) => (
          <label key={k} className={c.radio}><input type="radio" name="kind" checked={form.kind === k} onChange={() => setForm({ ...form, kind: k })} /><span>{k}</span></label>
        ))}
      </fieldset>
      <fieldset className={c.fieldset}>
        <legend>מה צריך?</legend>
        {needs.map((n) => (
          <label key={n} className={c.radio}><input type="radio" name="need" checked={form.need === n} onChange={() => setForm({ ...form, need: n })} /><span>{n}</span></label>
        ))}
      </fieldset>
      <label className={c.field}><span>יישוב</span><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} autoComplete="address-level2" /></label>
      <label className={c.field}><span>עוד פרטים (לא חובה)</span><textarea rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="כמה מצלמות בערך, יש תשתית קיימת, מועד רצוי" /></label>
      {err && <p className={c.formErr}>{err} <a href={wa} target="_blank" rel="noopener noreferrer">לשליחה בווצאפ</a></p>}
      <div className={styles.ctas}>
        <button type="submit" className={`${styles.cta} ${styles.ctaAccent}`} disabled={busy}>{busy ? "שולח…" : "קבלת הצעת מחיר"}</button>
        <a className={`${styles.cta} ${styles.ctaGhost}`} href={wa} target="_blank" rel="noopener noreferrer">או בווצאפ</a>
      </div>
    </form>
  );
}
