// עוזר המכירות של החנות: Gemini (REST) עם בסיס ידע מהקטלוג. מחזיר תשובה + מוצרים להצגה,
// ומעביר לצוות (ווצאפ/מייל) שאלות שאין עליהן תשובה ולידים שהשאירו טלפון.
import { NextRequest, NextResponse } from "next/server";
import { productBySlug } from "../../data/store-knowledge";
import { productName } from "../../data/store-catalog";
import { notifyTeam } from "../../lib/store-notify";
import { attributionLabel } from "../../lib/attribution-label";
import { ASSISTANT_NAME, SYSTEM, askGemini, type Msg } from "../../lib/tal";

export const runtime = "nodejs";
export const maxDuration = 30;

// הגבלת קצב פשוטה לכל מופע (best effort)
const buckets = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.t > 10 * 60 * 1000) { buckets.set(ip, { n: 1, t: now }); return false; }
  b.n++;
  return b.n > 40;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "העוזר לא זמין כרגע. אפשר לכתוב לנו בווצאפ." }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "יותר מדי הודעות ברצף. נסו שוב בעוד כמה דקות או כתבו לנו בווצאפ." }, { status: 429 });

  let body: { messages?: Msg[]; page?: string; cart?: { slug: string; qty: number }[]; attribution?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const messages = (body.messages || []).filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").slice(-16);
  if (!messages.length || messages[messages.length - 1].role !== "user") return NextResponse.json({ error: "bad request" }, { status: 400 });
  if (messages.some((m) => m.content.length > 1500)) return NextResponse.json({ error: "ההודעה ארוכה מדי" }, { status: 400 });

  const ctx: string[] = [];
  if (body.page) {
    const p = productBySlug(body.page);
    if (p) ctx.push(`הלקוח נמצא כרגע בדף המוצר ${productName(p)} [${p.slug}].`);
    else if (body.page === "finder") ctx.push("הלקוח נמצא בדף שאלון ההתאמה.");
    else ctx.push("הלקוח נמצא בדף הראשי של החנות.");
  }
  if (body.cart?.length) {
    const lines = body.cart.map((c) => { const p = productBySlug(c.slug); return p ? `${c.qty} x ${p.model} (${p.price ? p.price * c.qty + " ₪" : "לפי פנייה"})` : null; }).filter(Boolean);
    if (lines.length) ctx.push(`בעגלה של הלקוח: ${lines.join(", ")}.`);
  }
  const system = SYSTEM + (ctx.length ? `\n\n# הקשר נוכחי\n${ctx.join("\n")}` : "");

  try {
    const data = await askGemini(apiKey, system, messages);

    const products = data.products
      .map((s) => productBySlug(s.trim().replace(/^\[|\]$/g, "")))
      .filter(Boolean)
      .slice(0, 3)
      .map((p) => ({ slug: p!.slug, brand: p!.brand, model: p!.model, title: p!.title, price: p!.price, image: p!.image }));

    // התראות לצוות: שאלה פתוחה או ליד עם טלפון. לא חוסמים את התשובה ללקוח.
    const transcript = [...messages, { role: "assistant" as const, content: data.reply }]
      .slice(-10)
      .map((m) => `${m.role === "user" ? "לקוח" : ASSISTANT_NAME}: ${m.content}`)
      .join("\n");
    const tasks: Promise<unknown>[] = [];
    const escalated = data.escalate.trim().length > 0;
    const leadCaptured = data.lead_phone.trim().length >= 9;
    if (escalated) {
      tasks.push(notifyTeam("שאלה מהצ'אט בחנות שצריך תשובה מהצוות", `שאלה: ${data.escalate}\n${body.page ? `דף: /store/${body.page}\n` : ""}${leadCaptured ? `לקוח: ${data.lead_name || "-"} ${data.lead_phone}\n` : "הלקוח עדיין לא השאיר טלפון.\n"}\nשיחה:\n${transcript}`));
    }
    if (leadCaptured) {
      tasks.push(notifyTeam("ליד חדש מהצ'אט בחנות", `שם: ${data.lead_name || "-"}\nטלפון: ${data.lead_phone}\nסיכום: ${data.lead_summary || "-"}\nכוונה: ${data.intent}\nמקור: ${attributionLabel(body.attribution)}\n\nשיחה:\n${transcript}`));
    }
    if (tasks.length) await Promise.allSettled(tasks);

    // המודל לפעמים מוסיף markdown למרות ההנחיה; מנקים כדי שהטקסט יוצג נקי בווידג'ט
    const reply = data.reply.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/^\s*[*-]\s+/gm, "• ").trim();
    return NextResponse.json({ reply, products, intent: data.intent, escalated, leadCaptured });
  } catch (e) {
    console.error("store-chat error", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "העוזר לא זמין כרגע. אפשר לכתוב לנו בווצאפ ונחזור מהר." }, { status: 502 });
  }
}
