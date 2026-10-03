// קישור אישי לכתיבת ביקורת: חתימת HMAC על מספר הזמנה + מוצר, כדי שרק מי שקנה יוכל לכתוב ביקורת.
// בלי מסד נתונים. הסוד נגזר מ-RESEND_API_KEY, שקיים גם ב-Vercel וגם במחשב של רותם, כך שהכלי המקומי
// (site-control-tools/review-request.js) מייצר אותו קישור בדיוק.
import { createHash, createHmac, timingSafeEqual } from "crypto";

function secret(): string | null {
  const base = process.env.RESEND_API_KEY;
  return base ? createHash("sha256").update(`review-link:${base}`).digest("hex") : null;
}

const sign = (orderRef: string, slug: string) =>
  createHmac("sha256", secret() || "").update(`${orderRef}|${slug}`).digest("hex").slice(0, 24);

export function checkReviewToken(orderRef: string, slug: string, token: string): boolean {
  if (!secret() || !/^[A-Za-z0-9-]{3,40}$/.test(orderRef || "") || !/^[a-z0-9-]{2,120}$/.test(slug || "")) return false;
  const want = Buffer.from(sign(orderRef, slug));
  const got = Buffer.from(String(token || ""));
  return want.length === got.length && timingSafeEqual(want, got);
}
