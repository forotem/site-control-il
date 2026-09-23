import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, BreadcrumbSchema } from "../../components/Breadcrumb";
import { ProductFinder } from "../ProductFinder";
import styles from "../store.module.css";

export const metadata: Metadata = {
  title: "איזו מצלמת אבטחה מתאימה לי? שאלון התאמה | Site-Control",
  description: "חמש שאלות קצרות ומקבלים המלצה מנומקת: מצלמות, מקליט או ערכה מוכנה, עם מחיר משוער וחלופות. בלי ז'רגון, כמו שמתקין היה מסביר.",
  alternates: { canonical: "/store/finder" },
  robots: { index: true, follow: true },
};

export default function FinderPage() {
  const items = [{ name: "חנות", url: "/store" }, { name: "מצא לי את המוצר", url: "/store/finder" }];
  return (
    <main className={styles.wrap}>
      <BreadcrumbSchema items={items} />
      <Breadcrumb items={items} />
      <header className={styles.hero}>
        <h1>איזו מערכת מתאימה לך?</h1>
        <p>חמש שאלות, בלי מונחים טכניים. בסוף מקבלים המלצה עם הסבר למה דווקא היא, מחיר משוער וחלופה זולה או משודרגת.</p>
      </header>
      <ProductFinder />
      <p className={styles.finderFoot}>מעדיפים לעבור על הכל לבד? <Link href="/store">לכל המוצרים בחנות</Link></p>
    </main>
  );
}
