// אימות טלפון בהזמנה (רותם 1.10.2026, אחרי הזמנה עם מספר של מישהו אחר): קוד של 4 ספרות נשלח בווצאפ,
// וההזמנה נוצרת רק אחרי שמזינים אותו באתר. בלי מסד נתונים: השרת מחזיר טוקן חתום (HMAC) על טלפון+קוד+תפוגה,
// והקוד עצמו לא חוזר לדפדפן. אם GreenAPI לא מוגדר (פיתוח מקומי), האימות מדולג.
import { createHash, createHmac, randomInt, timingSafeEqual } from "crypto";

const TTL_MS = 10 * 60 * 1000;

function secret(): string | null {
  const base = process.env.ORDER_OTP_SECRET || process.env.GREEN_API_TOKEN || process.env.RESEND_API_KEY;
  return base ? createHash("sha256").update(`order-otp:${base}`).digest("hex") : null;
}

/** האימות פעיל רק כשאפשר באמת לשלוח ווצאפ */
export const otpEnabled = () => Boolean(process.env.GREEN_ID_INSTANCE && process.env.GREEN_API_TOKEN && secret());

const sign = (mobile: string, code: string, exp: number) =>
  createHmac("sha256", secret() || "").update(`${mobile}|${code}|${exp}`).digest("hex");

export function issueCode(mobile: string): { code: string; token: string } {
  const code = String(randomInt(1000, 10000));
  const exp = Date.now() + TTL_MS;
  return { code, token: `${exp}.${sign(mobile, code, exp)}` };
}

export function checkCode(mobile: string, code: string, token: string): boolean {
  const [expStr, sig] = String(token || "").split(".");
  const exp = Number(expStr);
  if (!exp || !sig || Date.now() > exp || !/^\d{4}$/.test(String(code || "").trim())) return false;
  const want = Buffer.from(sign(mobile, String(code).trim(), exp), "hex");
  const got = Buffer.from(sig, "hex");
  return want.length === got.length && timingSafeEqual(want, got);
}
