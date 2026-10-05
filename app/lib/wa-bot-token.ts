// הטוקן שמוגדר ב-GreenAPI כ-webhookUrlToken לבוט הווצאפ (נשלח בכל webhook כ-Authorization: Bearer).
// נגזר מ-GREEN_API_TOKEN, שקיים רק ב-Vercel.
import { createHash } from "crypto";

export function botToken(): string | null {
  const base = process.env.GREEN_API_TOKEN;
  return base ? createHash("sha256").update(`wa-bot:${base}`).digest("hex") : null;
}
