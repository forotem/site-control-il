"use client";
import { useState } from "react";
import styles from "../store/store.module.css";

export function ReviewForm({ o, s, t }: { o: string; s: string; t: string }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!rating) return setErr("בחרו דירוג מ-1 עד 5 כוכבים");
    if (text.trim().length < 10) return setErr("כתבו כמה מילים על המוצר (לפחות 10 תווים)");
    if (!consent) return setErr("צריך לאשר פרסום של הביקורת");
    setState("sending");
    try {
      const r = await fetch("/api/review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ o, s, t, rating, name, city, text, consent, website }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(j.error || "משהו השתבש, נסו שוב"); setState("idle"); return; }
      setState("done");
    } catch {
      setErr("אין חיבור, נסו שוב"); setState("idle");
    }
  }

  if (state === "done")
    return <p className={styles.stockNote}>תודה רבה! קיבלנו את הביקורת, והיא תופיע בדף המוצר אחרי בדיקה קצרה.</p>;

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "0.9rem" }}>
      <fieldset style={{ border: 0, padding: 0 }}>
        <legend style={{ fontWeight: 600, marginBottom: "0.4rem" }}>הדירוג שלכם</legend>
        <div role="radiogroup" aria-label="דירוג" style={{ display: "flex", gap: "0.3rem", direction: "ltr", justifyContent: "flex-end" }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} כוכבים`} onClick={() => setRating(n)}
              style={{ fontSize: "2rem", lineHeight: 1, background: "none", border: 0, cursor: "pointer", color: n <= rating ? "#f5a623" : "#c9ced6" }}>
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <label>שם פרטי לפרסום<input required maxLength={40} value={name} onChange={(e) => setName(e.target.value)} style={{ display: "block", width: "100%" }} /></label>
      <label>יישוב (לא חובה)<input maxLength={40} value={city} onChange={(e) => setCity(e.target.value)} style={{ display: "block", width: "100%" }} /></label>
      <label>הביקורת<textarea required minLength={10} maxLength={1500} rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="מה התקנתם, איך ההתקנה, איכות התמונה ביום ובלילה, האפליקציה, השירות" style={{ display: "block", width: "100%" }} /></label>
      <input tabIndex={-1} autoComplete="off" aria-hidden value={website} onChange={(e) => setWebsite(e.target.value)} name="website" style={{ position: "absolute", left: "-9999px" }} />
      <label style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>אני מאשר/ת לפרסם את הביקורת בדף המוצר עם השם הפרטי (והיישוב אם כתבתי)</span>
      </label>
      {err && <p role="alert" style={{ color: "#b42318" }}>{err}</p>}
      <button className={`${styles.cta} ${styles.ctaPrimary}`} disabled={state === "sending"} type="submit">
        {state === "sending" ? "שולח…" : "שליחת הביקורת"}
      </button>
    </form>
  );
}
