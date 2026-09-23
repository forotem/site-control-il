import { storeGuides } from "../data/store-guides";
import { CompareTable } from "./CompareTable";
import styles from "./store.module.css";

/** "איך לבחור" + השוואות לקטגוריה. נסגר כברירת מחדל בנייד, פתוח במסך רחב (CSS). */
export function CategoryGuide({ category }: { category: string }) {
  const g = storeGuides[category];
  if (!g) return null;
  return (
    <div className={styles.guide}>
      <p className={styles.guideLead}>{g.lead}</p>
      <details className={styles.guideDetails}>
        <summary>איך בוחרים נכון, בשתי דקות</summary>
        <div className={styles.guideBody}>
          <dl className={styles.guideList}>
            {g.choose.map((c) => (
              <div key={c.title}>
                <dt>{c.title}</dt>
                <dd>{c.body}</dd>
              </div>
            ))}
          </dl>
          {g.terms.length > 0 && (
            <div className={styles.terms}>
              {g.terms.map((t) => (
                <span key={t.term}><b>{t.term}</b> {t.explain}</span>
              ))}
            </div>
          )}
        </div>
      </details>
      {g.compare.map((c) => (
        <details key={c.title} className={styles.guideDetails}>
          <summary>השוואה: {c.title}</summary>
          <div className={styles.guideBody}>
            <CompareTable slugs={c.slugs} note={c.note} />
          </div>
        </details>
      ))}
    </div>
  );
}
