import Link from "next/link";
import type { StoreProduct } from "../data/store-catalog";
import styles from "./store.module.css";

const nis = (v: number) => v.toLocaleString("he-IL");

export function ProductCard({ p }: { p: StoreProduct }) {
  return (
    <Link href={`/store/${p.slug}`} className={styles.card} prefetch={false}>
      {p.image ? (
        <div className={styles.thumb}><img src={p.image} alt={p.title} loading="lazy" /></div>
      ) : (
        <div className={styles.thumbEmpty} aria-hidden>{p.brand.split(" ")[0]}</div>
      )}
      <div className={styles.body}>
        <span className={styles.brand}>{p.brand}</span>
        <span className={styles.title}>{p.title}</span>
        <span className={styles.model}>{p.model}</span>
        <div className={styles.priceRow}>
          {p.price ? <span className={styles.price}>{nis(p.price)} ₪<small>כולל מע״מ</small></span> : <span className={styles.ask}>מחיר לפי פנייה</span>}
          {p.oldStock && <span className={styles.badge}>מבצע חיסול</span>}
        </div>
      </div>
    </Link>
  );
}
