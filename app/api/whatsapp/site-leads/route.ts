// לידים שהגיעו לווצאפ של רותם מכפתור באתר (טקסט ממולא מראש), לקליטה אוטומטית לטבלת הלידים.
// רותם 2.10.2026: ליד מכפתור "בדיקת זמינות" כמעט פוספס, "צריך לראות שכל הלידים נספרים ונרשמים ועוקבים אחריהם".
// פרטי GreenAPI קיימים רק ב-Vercel, אז הכלי המקומי (site-control-tools/lead-agent/capture-wa-leads.js) קורא דרך כאן.
// מוגן במפתח שנגזר מ-RESEND_API_KEY, ומחזיר רק הודעות פרטיות שמתחילות בטקסט של האתר (לא שיחות אחרות בטלפון).
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { ELI_WA, greenApi, IDAN_WA } from "../../../lib/store-notify";
import { siteSourceOf, waRefOf } from "../../../lib/site-wa-prefills";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Incoming = {
  idMessage?: string; timestamp?: number; typeMessage?: string; chatId?: string; senderName?: string;
  senderContactName?: string; textMessage?: string; extendedTextMessage?: { text?: string }; caption?: string;
};

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-leads") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`site-leads:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const minutes = Math.min(10080, Math.max(10, Number(req.nextUrl.searchParams.get("minutes")) || 1440));
  const incoming = await greenApi<Incoming[]>("lastIncomingMessages", undefined, { minutes });
  if (!incoming) return NextResponse.json({ error: "greenapi unavailable" }, { status: 502 });
  const leads = incoming
    // הספק (עידן, ומ-7.10.2026 גם אלי) הוא לא ליד
    .filter((m) => m.chatId?.endsWith("@c.us") && m.chatId !== `${IDAN_WA}@c.us` && m.chatId !== `${ELI_WA}@c.us`)
    .map((m) => {
      const text = m.textMessage || m.extendedTextMessage?.text || m.caption || "";
      return { m, text, source: siteSourceOf(text) };
    })
    .filter((x) => x.source)
    .map(({ m, text, source }) => ({
      idMessage: m.idMessage,
      timestamp: m.timestamp,
      phone: (m.chatId || "").replace(/@c\.us$/, ""),
      name: m.senderContactName || m.senderName || "",
      source,
      // קוד הפנייה מהכפתור (7.10.2026): הכלי המקומי מחפש לפיו את המייל "wa-ref SCW-XXXXXX" עם המקור (gclid/UTM/דף)
      ref: waRefOf(text),
      text: text.slice(0, 1500),
    }));
  return NextResponse.json({ minutes, scanned: incoming.length, leads }, { headers: { "Cache-Control": "no-store" } });
}
