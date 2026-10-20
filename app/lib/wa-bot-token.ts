// הטוקן שמוגדר ב-GreenAPI כ-webhookUrlToken לבוט הווצאפ (נשלח בכל webhook כ-Authorization: Bearer).
// נגזר מהטוקן של הקו ב-GreenAPI (GREEN_API_TOKEN, או GREEN_CUSTOMER_API_TOKEN לקו של רלי), שקיים רק ב-Vercel.
// לכל קו טוקן משלו, וכך הבוט יודע מאיזה קו הגיע ה-webhook.
import { createHash } from "crypto";
import { greenCreds, type Line } from "./store-notify";

export function botToken(line: Line = "ops"): string | null {
  const base = greenCreds(line)?.token;
  return base ? createHash("sha256").update(`wa-bot:${base}`).digest("hex") : null;
}
