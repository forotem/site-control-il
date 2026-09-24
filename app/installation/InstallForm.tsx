"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "../lib/analytics";
import { getAttribution } from "../lib/attribution";
import { WHATSAPP_NUMBER } from "../data/store-catalog";
import c from "../store/commerce.module.css";
import styles from "../home.module.css";

const kinds = ["בית פרטי / וילה", "דירה", "בניין משותף", "עסק / משרד / חנות", "מחסן / אתר / שטח"];
const needs = ["מצלמות אבטחה", "אינטרקום", "בקרת כניסה / קודן", "שדרוג מערכת קיימת", "לא בטוח, צריך ייעוץ"];
const topics = ["הצעת מחיר להתקנה", "שאלה על מוצר או הזמנה מהחנות", "אינטרקום ובקרת כניסה", "מצלמות לעסק", "אחר"];

// הצורך שמסומן מראש לפי דף הקטגוריה שממנו הגיעו
const needFor: Record<string, string> = { intercom: "אינטרקום", ip: "מצלמות אבטחה", recorders: "מצלמות אבטחה", analog: "שדרוג מערכת קיימת" };
const categoryName: Record<string, string> = { intercom: "אינטרקום ובקרת כניסה", ip: "מצלמות IP", recorders: "מקליטים", analog: "מצלמות לשדרוג מערכת קיימת" };

type Variant = "full" | "short" | "contact";

/**
 * full: דף ההתקנה (סוג נכס, צורך, יישוב, פרטים). short: 3 שדות (שם, טלפון, מה צריך) להירו ולדפי קטגוריה.
 * contact: דף יצירת קשר (נושא, מייל לא חובה, הודעה).
 */
export function InstallForm({ variant = "full", category }: { variant?: Variant; category?: string }) {
  const page = usePathname();
  const first = variant === "contact" ? topics[0] : (category && needFor[category]) || needs[0];
  const [form, setForm] = useState({ name: "", phone: "", email: "", kind: kinds[0], need: first, city: "", note: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const leadType = variant === "contact" ? "contact" : category ? "category_quote" : "install";
  const waText = variant === "full"
    ? `היי, אשמח להצעת מחיר להתקנה: ${form.need}, ${form.kind}${form.city ? `, ${form.city}` : ""}`
    : `היי, אשמח להצעת מחיר: ${form.need}${category ? ` (הגעתי מדף ${categoryName[category] || "החנות"})` : ""}`;
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const payload = variant === "full"
        ? { ...form, email: undefined }
        : variant === "short"
          ? { name: form.name, phone: form.phone, need: form.need, website: form.website }
          : { name: form.name, phone: form.phone, email: form.email, need: form.need, note: form.note, website: form.website };
      const res = await fetch("/api/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, form: variant === "contact" ? "contact" : category ? "category" : "install", category, page, attribution: getAttribution() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה");
      track.formSubmit(leadType, category || form.need, data.leadId);
      setDone(true);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "שגיאה בשליחה");
    } finally { setBusy(false); }
  }

  if (done) {
    return (
      <div className={styles.kicker} role="status" style={{ lineHeight: 1.7 }}>
        תודה {form.name}! קיבלנו את הפרטים ונחזור אליך בהקדם. רוצה לזרז? <a href={wa} target="_blank" rel="noopener noreferrer">כתבו לנו בווצאפ</a>
        {variant !== "contact" ? ", ואפשר לצרף תמונה של המקום." : "."}
      </div>
    );
  }
  const select = (label: string, list: string[]) => (
    <label className={c.field}><span>{label}</span>
      <select value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })}>
        {list.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </label>
  );
  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "0.8rem", maxWidth: 560 }}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap", border: 0 }} />
      <label className={c.field}><span>שם</span><input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
      <label className={c.field}><span>טלפון</span><input required type="tel" inputMode="tel" dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></label>
      {variant === "short" && select("מה צריך?", needs)}
      {variant === "contact" && (
        <>
          <label className={c.field}><span>מייל (לא חובה)</span><input type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label>
          {select("במה אפשר לעזור?", topics)}
          <label className={c.field}><span>הודעה (לא חובה)</span><textarea rows={4} maxLength={2000} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="מה צריך, איפה, ומתי נוח שנחזור" /></label>
        </>
      )}
      {variant === "full" && (
        <>
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
        </>
      )}
      <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>הפרטים משמשים כדי לחזור אליך, ולא נמסרים לאף גורם לשיווק. <Link href="/privacy">מדיניות פרטיות</Link></div>
      {err && <div className={c.formErr} role="alert">{err} <a href={wa} target="_blank" rel="noopener noreferrer">לשליחה בווצאפ</a></div>}
      <div className={styles.ctas}>
        <button type="submit" className={`${styles.cta} ${styles.ctaAccent}`} disabled={busy}>{busy ? "שולח…" : variant === "contact" ? "שליחה" : "קבלת הצעת מחיר"}</button>
        <a className={`${styles.cta} ${styles.ctaGhost}`} href={wa} target="_blank" rel="noopener noreferrer">או בווצאפ</a>
      </div>
    </form>
  );
}
