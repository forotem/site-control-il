// קבלת ביקורת מלקוח שקנה (קישור חתום מ-/review). אין שמירה באתר: הביקורת נשלחת לרותם בווצאפ ובמייל,
// ואחרי בדיקה (ספאם, פרטים אישיים) מוסיפים אותה ל-app/data/reviews.ts. ראו את הכללים שם.
import { NextRequest, NextResponse } from "next/server";
import { checkReviewToken } from "../../lib/review-token";
import { notifyTeam } from "../../lib/store-notify";
import { storeProducts, productName } from "../../data/store-catalog";

export const runtime = "nodejs";
export const maxDuration = 30;

// הגנה פשוטה מכפילויות בתוך אותו מופע שרת: קישור אחד = ביקורת אחת לכמה דקות
const recent = new Map<string, number>();

export async function POST(req: NextRequest) {
  let b: { o?: string; s?: string; t?: string; rating?: number; name?: string; city?: string; text?: string; consent?: boolean; website?: string };
  try { b = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  const o = String(b.o || ""), s = String(b.s || ""), t = String(b.t || "");
  if (!checkReviewToken(o, s, t)) return NextResponse.json({ error: "הקישור לא תקין. אפשר לבקש קישור חדש בווצאפ." }, { status: 403 });
  const p = storeProducts.find((x) => x.slug === s);
  const rating = Number(b.rating);
  const name = String(b.name || "").trim().slice(0, 40);
  const city = String(b.city || "").trim().slice(0, 40);
  const text = String(b.text || "").trim().slice(0, 1500);
  if (!p || !(rating >= 1 && rating <= 5) || !name || text.length < 10 || !b.consent)
    return NextResponse.json({ error: "חסר דירוג, שם או ביקורת (לפחות 10 תווים)" }, { status: 400 });
  const key = `${o}|${s}`;
  if ((recent.get(key) || 0) > Date.now() - 5 * 60 * 1000) return NextResponse.json({ ok: true });
  recent.set(key, Date.now());

  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const sent = await notifyTeam(
    `⭐ ביקורת חדשה מלקוח (${stars}) על ${productName(p)}`,
    [
      `הזמנה: ${o}`,
      `מוצר: ${p.title}`,
      `דירוג: ${rating}/5`,
      `שם לפרסום: ${name}${city ? `, ${city}` : ""}`,
      "",
      text,
      "",
      "לפרסום באתר: לבקש מקלוד להוסיף ל-app/data/reviews.ts. מפרסמים כל ביקורת אמיתית, גם שלילית; מסננים רק ספאם ופרטים אישיים.",
      rating <= 3 ? "הלקוח לא מרוצה: כדאי להתקשר אליו ולפתור. הביקורת מתפרסמת בכל מקרה." : "",
    ].filter((x) => x !== "").join("\n"),
  );
  if (!sent.whatsapp && !sent.email) return NextResponse.json({ error: "לא הצלחנו לשלוח כרגע, נסו שוב בעוד כמה דקות" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
