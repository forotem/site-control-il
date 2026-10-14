// מועמדים למשרה (דף /jobs, רותם 14.10.2026: "חשוב שיהיה לי גוגל שיטס... מקום אחד שהכל מרוכז לי בו").
// הכלי המקומי (site-control-tools/lead-agent/capture-job-applicants.js) קורא דרך כאן ורושם לטבלת המועמדים.
// מחזיר רק הודעות פרטיות שנראות כמו הגשת מועמדות (הטקסט מכפתור דף המשרה, או "מועמדות"/"משרה" בטקסט חופשי),
// ובנוסף, למספרים שהכלי כבר מכיר כמועמדים (known=), גם קבצים ששלחו (קורות חיים). לא שיחות אחרות בטלפון.
// מועמד הוא לא ליד: הטקסט הזה לא נמצא ב-site-wa-prefills, אז טל וקליטת הלידים לא נוגעים בו.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { ELI_WA, greenApi, IDAN_WA } from "../../../lib/store-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Incoming = {
  idMessage?: string; timestamp?: number; typeMessage?: string; chatId?: string; senderName?: string;
  senderContactName?: string; textMessage?: string; extendedTextMessage?: { text?: string }; caption?: string;
  fileName?: string; downloadUrl?: string;
};

// הפתיחה של ההודעה מכפתור דף המשרה (app/jobs/page.tsx), או ניסוח חופשי של מי שראה את המודעה וכתב בעצמו
const APPLY_RE = /מועמדות|ראיתי את המשרה|לגבי המשרה|בקשר למשרה|רכז\/?ת מכירות|דרושים/;

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-jobs") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`job-applicants:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const minutes = Math.min(10080, Math.max(10, Number(req.nextUrl.searchParams.get("minutes")) || 1440));
  const known = new Set((req.nextUrl.searchParams.get("known") || "").split(",").map((s) => s.replace(/\D/g, "")).filter(Boolean));
  const incoming = await greenApi<Incoming[]>("lastIncomingMessages", undefined, { minutes });
  if (!incoming) return NextResponse.json({ error: "greenapi unavailable" }, { status: 502 });
  const messages = incoming
    .filter((m) => m.chatId?.endsWith("@c.us") && m.chatId !== `${IDAN_WA}@c.us` && m.chatId !== `${ELI_WA}@c.us`)
    .map((m) => {
      const text = m.textMessage || m.extendedTextMessage?.text || m.caption || "";
      const phone = (m.chatId || "").replace(/@c\.us$/, "");
      return { m, text, phone, applies: APPLY_RE.test(text), isKnown: known.has(phone) };
    })
    .filter((x) => x.applies || x.isKnown)
    .map(({ m, text, phone, applies }) => ({
      idMessage: m.idMessage,
      timestamp: m.timestamp,
      phone,
      name: m.senderContactName || m.senderName || "",
      type: m.typeMessage || "",
      applies,
      text: text.slice(0, 2000),
      fileName: m.fileName || "",
      downloadUrl: m.downloadUrl || "",
    }));
  return NextResponse.json({ minutes, scanned: incoming.length, messages }, { headers: { "Cache-Control": "no-store" } });
}
