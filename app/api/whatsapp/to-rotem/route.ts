// שליחת הודעות וקבצים לווצאפ של רותם בלבד (רותם 2.10.2026: "תכין הצעת מחיר ושלח לי אותה לווצאפ שלי, אני אעביר").
// פרטי GreenAPI קיימים רק ב-Vercel, אז הכלי המקומי (site-control-tools/send-to-rotem.js) שולח דרך כאן.
// היעד קבוע (ALERT_WA, המספר של רותם) ולא ניתן לשינוי מהבקשה, והגישה מוגנת במפתח שנגזר מ-RESEND_API_KEY.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { sendWhatsApp } from "../../../lib/store-notify";

export const runtime = "nodejs";
export const maxDuration = 60;

const ROTEM = process.env.STORE_ALERT_WHATSAPP || "972502256866";

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-admin") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`to-rotem:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

/** קובץ דרך sendFileByUpload של GreenAPI (שרת המדיה), עם כיתוב */
async function sendFile(name: string, base64: string, caption: string): Promise<boolean> {
  const id = process.env.GREEN_ID_INSTANCE;
  const token = process.env.GREEN_API_TOKEN;
  if (!id || !token) return false;
  const api = (process.env.GREEN_API_URL || `https://${id.slice(0, 4)}.api.greenapi.com`).replace(/\/$/, "");
  const media = (process.env.GREEN_MEDIA_URL || api.replace(".api.", ".media.")).replace(/\/$/, "");
  const form = new FormData();
  form.append("chatId", `${ROTEM}@c.us`);
  form.append("caption", caption);
  form.append("file", new Blob([Buffer.from(base64, "base64")], { type: name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream" }), name);
  for (const base of [media, api]) {
    try {
      const res = await fetch(`${base}/waInstance${id}/sendFileByUpload/${token}`, { method: "POST", body: form });
      if (res.ok) return true;
    } catch (e) {
      console.error("sendFileByUpload failed", base, e);
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  let body: { items?: ({ text: string } | { fileName: string; fileBase64: string; caption?: string })[] };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const results: boolean[] = [];
  for (const it of (body.items || []).slice(0, 10)) {
    if ("text" in it) results.push(await sendWhatsApp(ROTEM, String(it.text).slice(0, 4000)));
    else if ("fileBase64" in it) results.push(await sendFile(String(it.fileName).slice(0, 120), it.fileBase64, String(it.caption || "").slice(0, 1000)));
  }
  return NextResponse.json({ ok: results.every(Boolean), results });
}
