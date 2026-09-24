"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { WHATSAPP_NUMBER, productName } from "../data/store-catalog";
import { questions, recommend, totalOf, whatsappText, type Answers, type RecItem } from "./finder-logic";
import styles from "./store.module.css";

const nis = (v: number) => v.toLocaleString("he-IL");

function ItemRow({ it }: { it: RecItem }) {
  const p = it.product;
  return (
    <li className={styles.recItem}>
      <Link href={`/store/${p.slug}`} className={styles.recThumb} prefetch={false}>
        {p.image ? <img src={p.image} alt={p.title} loading="lazy" /> : <span>{p.brand}</span>}
      </Link>
      <div className={styles.recBody}>
        <span className={styles.recRole}>{it.role}{it.qty > 1 ? ` · ${it.qty} יחידות` : ""}</span>
        <Link href={`/store/${p.slug}`} className={styles.recTitle} prefetch={false}>{productName(p)}</Link>
        <p>{it.why}</p>
      </div>
      <div className={styles.recPrice}>
        {p.price ? (
          <>
            <strong>{nis(p.price * it.qty)} ₪</strong>
            {it.qty > 1 && <small>{nis(p.price)} ₪ ליחידה</small>}
          </>
        ) : <strong>לפי פנייה</strong>}
      </div>
    </li>
  );
}

export function ProductFinder({ compact = false }: { compact?: boolean }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const done = step >= questions.length;
  const q = questions[Math.min(step, questions.length - 1)];
  const rec = useMemo(() => (done ? recommend(answers) : null), [done, answers]);

  const choose = (value: string) => {
    setAnswers((a) => ({ ...a, [q.id]: value }));
    setStep((s) => s + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const restart = () => { setAnswers({}); setStep(0); };

  if (!done) {
    return (
      <div className={`${styles.finder} ${compact ? styles.finderCompact : ""}`} id="finder">
        <div className={styles.finderHead}>
          <span className={styles.finderStep}>שאלה {step + 1} מתוך {questions.length}</span>
          <div className={styles.finderProgress} aria-hidden>
            {questions.map((x, i) => <i key={x.id} className={i <= step ? styles.on : undefined} />)}
          </div>
        </div>
        <h3 className={styles.finderQ}>{q.title}</h3>
        {q.hint && <p className={styles.finderHint}>{q.hint}</p>}
        <div className={styles.finderOptions} role="group" aria-label={q.title}>
          {q.options.map((o) => (
            <button key={o.value} type="button" className={styles.finderOpt} onClick={() => choose(o.value)} id={`finder-${q.id}-${o.value}`}>
              <b>{o.label}</b>
              {o.desc && <span>{o.desc}</span>}
            </button>
          ))}
        </div>
        <div className={styles.finderNav}>
          {step > 0 ? <button type="button" onClick={back} className={styles.linkBtn}>חזרה</button> : <span />}
          {q.id === "budget" && <button type="button" onClick={() => choose("any")} className={styles.linkBtn}>דלג</button>}
        </div>
      </div>
    );
  }

  const r = rec!;
  const total = totalOf(r.items);
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText(answers, r))}`;
  const summary = questions.map((x) => x.options.find((o) => o.value === answers[x.id])?.label).filter(Boolean);

  return (
    <div className={`${styles.finder} ${styles.finderResult}`} id="finder">
      <div className={styles.finderHead}>
        <span className={styles.finderStep}>ההתאמה שלך</span>
        <button type="button" onClick={restart} className={styles.linkBtn}>התחלה מחדש</button>
      </div>
      <p className={styles.finderSummary}>{summary.join(" · ")}</p>
      <h3 className={styles.finderQ}>{r.headline}</h3>
      <p className={styles.finderIntro}>{r.intro}</p>

      {r.ext && (
        <ul className={styles.recList}>
          {r.ext.map((e) => (
            <li key={e.href} className={styles.recItem}>
              <div className={styles.recBody}>
                <Link href={e.href} className={styles.recTitle}>{e.label}</Link>
                <p>{e.why}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {r.items.length > 0 && (
        <>
          <ul className={styles.recList}>{r.items.map((it) => <ItemRow key={it.product.slug + it.role} it={it} />)}</ul>
          <div className={styles.recTotal}>
            <span>סה"כ ציוד משוער</span>
            <strong>{nis(total.sum)} ₪{total.unknown ? ` + ${total.unknown} פריטים לפי פנייה` : ""}</strong>
          </div>
        </>
      )}

      {r.notes.length > 0 && (
        <ul className={styles.recNotes}>{r.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
      )}

      <div className={styles.finderCtas}>
        <a className={`${styles.cta} ${styles.ctaPrimary}`} href={wa} target="_blank" rel="noopener noreferrer">
          לשלוח את ההמלצה בווצאפ ולקבל מחיר סופי
        </a>
        <Link className={`${styles.cta} ${styles.ctaSecondary}`} href="/installation#quote">רוצה שנתקין? הצעת מחיר</Link>
      </div>

      {r.alternatives.length > 0 && (
        <div className={styles.recAlts}>
          {r.alternatives.map((al) => (
            <details key={al.title} className={styles.guideDetails}>
              <summary>חלופה: {al.title}</summary>
              <div className={styles.guideBody}>
                <p className={styles.finderHint}>{al.why}</p>
                <ul className={styles.recList}>{al.items.map((it) => <ItemRow key={it.product.slug + it.role} it={it} />)}</ul>
                <div className={styles.recTotal}><span>סה"כ</span><strong>{nis(totalOf(al.items).sum)} ₪</strong></div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
