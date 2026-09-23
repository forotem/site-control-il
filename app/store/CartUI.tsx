"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { storeProducts, deliveryOptions, WHATSAPP_NUMBER } from "../data/store-catalog";
import { cart, useCart } from "./cart";
import styles from "./store.module.css";
import c from "./commerce.module.css";

const nis = (v: number) => v.toLocaleString("he-IL");
const bySlug = (slug: string) => storeProducts.find((p) => p.slug === slug);

/** כפתור "הוסף לעגלה" לדף מוצר */
export function AddToCart({ slug }: { slug: string }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <div className={c.addRow}>
      <div className={c.qty} aria-label="כמות">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="פחות">−</button>
        <input id={`qty-${slug}`} type="number" min={1} max={200} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(200, Number(e.target.value) || 1)))} />
        <button type="button" onClick={() => setQty((q) => Math.min(200, q + 1))} aria-label="יותר">+</button>
      </div>
      <button
        type="button"
        className={`${styles.cta} ${styles.ctaAccent}`}
        onClick={() => { cart.add(slug, qty); setAdded(true); setTimeout(() => setAdded(false), 1800); }}
      >
        {added ? "נוסף לעגלה" : "הוספה לעגלה"}
      </button>
      {qty >= 5 && <span className={c.bulkHint}>5 יחידות ומעלה: מחיר לקבלנים, נחזור עם הצעה</span>}
    </div>
  );
}

/** כפתור עגלה צף + מגירה. מותקן פעם אחת ב-layout של החנות. */
export function CartDrawer() {
  const lines = useCart();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "form" | "done">("cart");
  const [form, setForm] = useState({ name: "", phone: "", delivery: "courier", note: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    const onOpen = () => { setOpen(true); setStep("cart"); };
    window.addEventListener("sc-cart-open", onOpen);
    return () => window.removeEventListener("sc-cart-open", onOpen);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const rows = useMemo(() => lines.map((l) => ({ ...l, p: bySlug(l.slug) })).filter((r) => r.p), [lines]);
  const units = rows.reduce((s, r) => s + r.qty, 0);
  const total = rows.reduce((s, r) => s + (r.p!.price || 0) * r.qty, 0);
  const unknown = rows.filter((r) => !r.p!.price).length;
  const bulk = units >= 5 || total >= 5000 || rows.some((r) => r.qty >= 5);

  const waText = encodeURIComponent(
    ["היי, אשמח לבדיקת זמינות והצעת מחיר לפריטים הבאים:", ...rows.map((r) => `- ${r.qty} x ${r.p!.brand} ${r.p!.model}${r.p!.sku ? ` (מק"ט ${r.p!.sku})` : ""}`), `סה"כ משוער: ${nis(total)} ₪`].join("\n")
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/store-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: rows.map((r) => ({ slug: r.slug, qty: r.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה");
      setRef(data.ref); setStep("done"); cart.clear();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "שגיאה בשליחה. אפשר לשלוח בווצאפ במקום.");
    } finally { setBusy(false); }
  }

  return (
    <>
      <button type="button" className={c.cartFab} onClick={() => { setOpen(true); setStep(rows.length ? "cart" : "cart"); }} aria-label={`עגלה, ${units} פריטים`} id="store-cart-button">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
        {units > 0 && <b>{units}</b>}
        <span>עגלה</span>
      </button>

      {open && (
        <div className={c.drawerWrap} role="dialog" aria-modal="true" aria-label="עגלת קניות">
          <div className={c.drawerBg} onClick={() => setOpen(false)} />
          <aside className={c.drawer}>
            <header className={c.drawerHead}>
              <h2>{step === "done" ? "ההזמנה התקבלה" : "העגלה שלך"}</h2>
              <button type="button" className={styles.linkBtn} onClick={() => setOpen(false)}>סגירה</button>
            </header>

            {step === "done" && (
              <div className={c.drawerBody}>
                <p className={styles.finderIntro}>תודה! מספר ההזמנה שלך <b>{ref}</b>. אנחנו בודקים זמינות מול היבואן וחוזרים אליך לאישור מחיר סופי ותשלום, בדרך כלל תוך שעות עבודה.</p>
                <p className={styles.finderHint}>לא חויבת בכלום עדיין. רוצה לזרז? <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`היי, שלחתי הזמנה ${ref} מהאתר`)}`} target="_blank" rel="noopener noreferrer">כתבו לנו בווצאפ</a>.</p>
                <button type="button" className={`${styles.cta} ${styles.ctaSecondary}`} onClick={() => setOpen(false)}>המשך גלישה</button>
              </div>
            )}

            {step !== "done" && rows.length === 0 && (
              <div className={c.drawerBody}>
                <p className={styles.finderIntro}>העגלה ריקה. בכל דף מוצר יש כפתור "הוספה לעגלה", ואפשר לבקש מהעוזר שיוסיף בשבילך.</p>
                <Link href="/store/finder" className={`${styles.cta} ${styles.ctaAccent}`} onClick={() => setOpen(false)}>לא בטוחים מה צריך? שאלון קצר</Link>
              </div>
            )}

            {step === "cart" && rows.length > 0 && (
              <div className={c.drawerBody}>
                <ul className={styles.recList}>
                  {rows.map((r) => (
                    <li key={r.slug} className={styles.recItem}>
                      <Link href={`/store/${r.slug}`} className={styles.recThumb} onClick={() => setOpen(false)}>
                        {r.p!.image ? <img src={r.p!.image} alt="" /> : <span>{r.p!.brand}</span>}
                      </Link>
                      <div className={styles.recBody}>
                        <Link href={`/store/${r.slug}`} className={styles.recTitle} onClick={() => setOpen(false)}>{r.p!.brand} {r.p!.model}</Link>
                        <p>{r.p!.title}</p>
                        <div className={c.qty}>
                          <button type="button" onClick={() => cart.set(r.slug, r.qty - 1)} aria-label="פחות">−</button>
                          <input id={`cart-qty-${r.slug}`} type="number" min={0} max={200} value={r.qty} onChange={(e) => cart.set(r.slug, Math.max(0, Math.min(200, Number(e.target.value) || 0)))} />
                          <button type="button" onClick={() => cart.set(r.slug, r.qty + 1)} aria-label="יותר">+</button>
                          <button type="button" className={c.qtyRemove} onClick={() => cart.remove(r.slug)}>הסרה</button>
                        </div>
                      </div>
                      <div className={styles.recPrice}>
                        <strong>{r.p!.price ? `${nis(r.p!.price * r.qty)} ₪` : "לפי פנייה"}</strong>
                        {r.p!.price && r.qty > 1 && <small>{nis(r.p!.price)} ₪ ליחידה</small>}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className={styles.recTotal}>
                  <span>סה"כ כולל מע"מ, לפני משלוח</span>
                  <strong>{nis(total)} ₪{unknown ? ` + ${unknown} לפי פנייה` : ""}</strong>
                </div>
                {bulk && <p className={c.bulkNote}>כמות של קבלן: נחזור עם הצעת מחיר עם הנחת כמות במקום המחיר באתר.</p>}
                <p className={styles.finderHint}>לא משלמים עכשיו. אנחנו מאשרים זמינות מול היבואן וחוזרים אליך עם מחיר סופי, משלוח ותשלום.</p>
                <div className={styles.finderCtas}>
                  <button type="button" className={`${styles.cta} ${styles.ctaAccent}`} onClick={() => setStep("form")}>להזמנה ובדיקת זמינות</button>
                  <a className={`${styles.cta} ${styles.ctaPrimary}`} href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`} target="_blank" rel="noopener noreferrer">לשלוח בווצאפ</a>
                </div>
              </div>
            )}

            {step === "form" && rows.length > 0 && (
              <form className={c.drawerBody} onSubmit={submit}>
                <p className={styles.finderIntro}>{units} פריטים, {nis(total)} ₪ משוער. השאירו פרטים ונחזור אליך לאישור.</p>
                <label className={c.field}><span>שם</span><input id="order-name" required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
                <label className={c.field}><span>טלפון</span><input id="order-phone" required type="tel" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" dir="ltr" /></label>
                <fieldset className={c.fieldset}>
                  <legend>איך לקבל?</legend>
                  {deliveryOptions.map((d) => (
                    <label key={d.id} className={c.radio}>
                      <input type="radio" name="delivery" id={`order-delivery-${d.id}`} value={d.id} checked={form.delivery === d.id} onChange={() => setForm({ ...form, delivery: d.id })} />
                      <span><b>{d.title}</b> <small>{d.desc}</small></span>
                    </label>
                  ))}
                </fieldset>
                <label className={c.field}><span>הערה (לא חובה)</span><textarea id="order-note" rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="כתובת למשלוח, מועד נוח, שאלה" /></label>
                {err && <p className={c.formErr}>{err}</p>}
                <div className={styles.finderCtas}>
                  <button type="submit" className={`${styles.cta} ${styles.ctaAccent}`} disabled={busy}>{busy ? "שולח…" : "שליחת ההזמנה"}</button>
                  <button type="button" className={`${styles.cta} ${styles.ctaSecondary}`} onClick={() => setStep("cart")}>חזרה לעגלה</button>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
