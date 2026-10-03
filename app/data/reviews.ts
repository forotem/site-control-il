// ביקורות של לקוחות שקנו באמת (רותם 3.10.2026: "כן, זה רעיון טוב").
// איך זה עובד: מי שקיבל הזמנה מקבל בווצאפ קישור אישי ל-/review, חתום על מספר ההזמנה והמוצר
// (app/lib/review-token.ts). הביקורת מגיעה לרותם בווצאפ ובמייל, ואחרי בדיקה מוסיפים אותה כאן.
//
// כללים:
// - מפרסמים כל ביקורת אמיתית, גם שלילית. מסננים רק ספאם, פרטים אישיים ופגיעה בצד שלישי.
// - שולחים בקשה לביקורת לכל לקוח שקיבל הזמנה, לא רק למרוצים, ולא מסתירים ביקורות שליליות
//   (מדיניות Google לביקורות, וחוק הגנת הצרכן: הטעיה).
// - אין להמציא ביקורות, לכתוב בשם לקוח או לשנות דירוג.
// - הדירוג והביקורות נכנסים לסכמת המוצר (aggregateRating / review) רק כשיש ביקורת אמיתית אחת לפחות.
export type Review = {
  slug: string;
  /** שם פרטי, כפי שהלקוח ביקש לפרסם */
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** YYYY-MM-DD */
  date: string;
  /** מספר ההזמנה שממנה הגיע הקישור, לבקרה בלבד (לא מוצג) */
  orderRef: string;
  city?: string;
};

export const REVIEWS: Review[] = [];

export const reviewsOf = (slug: string) => REVIEWS.filter((r) => r.slug === slug).sort((a, b) => b.date.localeCompare(a.date));

export function ratingOf(slug: string): { value: number; count: number } | null {
  const list = reviewsOf(slug);
  if (!list.length) return null;
  return { value: Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10, count: list.length };
}
