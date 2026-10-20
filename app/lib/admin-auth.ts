// מפתח admin לנתיבי הניהול (בדיקות dry של טל, ניהול הקבוצה). שני מפתחות תקפים:
// 1. sha256("to-rotem:" + RESEND_API_KEY): המפתח של הכלים המקומיים (site-control-tools), כמו עד עכשיו.
// 2. sha256("sc-admin:" + SC_ADMIN_KEY): מפתח נפרד לבדיקות ולתחזוקה מ-Claude (20.10.2026), בלי לחשוף את מפתח Resend.
import type { NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "crypto";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export function adminAuthorized(req: NextRequest): boolean {
  const got = req.headers.get("x-sc-admin") || "";
  if (!got) return false;
  const keys: string[] = [];
  if (process.env.RESEND_API_KEY) keys.push(sha(`to-rotem:${process.env.RESEND_API_KEY}`));
  if (process.env.SC_ADMIN_KEY) keys.push(sha(`sc-admin:${process.env.SC_ADMIN_KEY}`));
  // השוואה לפי בתים (לא לפי אורך המחרוזת): כותרת עם תו לא-ASCII הייתה מפילה את timingSafeEqual
  if (!/^[0-9a-f]{64}$/.test(got)) return false;
  const g = Buffer.from(got);
  return keys.some((want) => { const w = Buffer.from(want); return g.length === w.length && timingSafeEqual(g, w); });
}
