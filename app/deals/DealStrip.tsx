import Link from "next/link";
import type { Deal } from "../data/deals";
import styles from "./deals.module.css";

const nis = (n: number) => n.toLocaleString("he-IL");

/** פס קצר שמוביל לדף המבצעים: בדף המוצר ובראש החנות */
export function DealStrip({ deal, withName = false }: { deal: Deal; withName?: boolean }) {
  return (
    <Link href={`/deals#${deal.id}`} className={styles.strip} data-track={`deal_strip_${deal.id}`}>
      <b>{withName ? "מבצע: מצלמת 4G ממונעת, מותקנת ועובדת" : "מבצע: המצלמה הזאת מותקנת ועובדת"}</b>
      <span>מצלמה, התקנה והגדרה, עם כרטיס זיכרון {deal.giftCardGb}GB במתנה. בכל הארץ, כשיש שקע חשמל ליד הנקודה.</span>
      <em>{nis(deal.price)} ₪ + מע״מ ←</em>
    </Link>
  );
}
