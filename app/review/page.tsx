// דף כתיבת ביקורת: נפתח רק מקישור אישי שנשלח ללקוח אחרי הזמנה (o = מספר הזמנה, s = מוצר, t = חתימה).
// לא באינדקס ולא ב-sitemap. הכללים בפרסום: app/data/reviews.ts.
import type { Metadata } from "next";
import Link from "next/link";
import { storeProducts, productName } from "../data/store-catalog";
import { checkReviewToken } from "../lib/review-token";
import { ReviewForm } from "./ReviewForm";
import styles from "../store/store.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "כתיבת ביקורת | Site-Control", robots: { index: false, follow: false } };

export default function ReviewPage({ searchParams }: { searchParams: { o?: string; s?: string; t?: string } }) {
  const o = String(searchParams.o || ""), s = String(searchParams.s || ""), t = String(searchParams.t || "");
  const p = storeProducts.find((x) => x.slug === s);
  const valid = Boolean(p) && checkReviewToken(o, s, t);
  return (
    <main className={styles.wrap} style={{ maxWidth: 640 }}>
      {!valid || !p ? (
        <>
          <h1>הקישור לא תקין</h1>
          <p>אפשר לכתוב ביקורת רק מהקישור האישי שקיבלתם בווצאפ אחרי ההזמנה. אם הקישור לא עובד, כתבו לנו ונשלח חדש.</p>
          <p><Link href="/store">לחנות</Link></p>
        </>
      ) : (
        <>
          <h1>איך היה עם {productName(p)}?</h1>
          <p>
            תודה שקניתם אצלנו. ביקורת כנה, טובה או פחות טובה, עוזרת ללקוחות אחרים לבחור ועוזרת לנו להשתפר.
            הביקורת תתפרסם בדף המוצר עם השם שתכתבו.
          </p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", margin: "1rem 0" }}>
            {p.image && <img src={p.image} alt={p.title} width={96} height={96} style={{ objectFit: "contain" }} />}
            <div><b>{p.title}</b><div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>הזמנה {o}</div></div>
          </div>
          <ReviewForm o={o} s={s} t={t} />
        </>
      )}
    </main>
  );
}
