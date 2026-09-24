// עוזר המכירות של החנות: Gemini (REST) עם בסיס ידע מהקטלוג. מחזיר תשובה + מוצרים להצגה,
// ומעביר לצוות (ווצאפ/מייל) שאלות שאין עליהן תשובה ולידים שהשאירו טלפון.
import { NextRequest, NextResponse } from "next/server";
import { STORE_KNOWLEDGE, productBySlug } from "../../data/store-knowledge";
import { productName } from "../../data/store-catalog";
import { notifyTeam } from "../../lib/store-notify";
import { attributionLabel } from "../../lib/attribution-label";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = process.env.STORE_CHAT_MODEL || "gemini-2.5-flash";
const ASSISTANT_NAME = "טל";

type Msg = { role: "user" | "assistant"; content: string };
type Out = { reply: string; products: string[]; escalate: string; lead_name: string; lead_phone: string; lead_summary: string; intent: string };

const SYSTEM = `אתה ${ASSISTANT_NAME}, עוזר מכירות דיגיטלי (AI) בחנות של Site-Control, חברת התקנות ישראלית שמוכרת מצלמות אבטחה, מקליטים, אינטרקום ובקרת כניסה. אתה מדבר עברית פשוטה וחמה, כמו מתקין מנוסה שמסביר ללקוח, בלי ז'רגון מיותר ובלי לחץ מכירתי.

כללים:
1. ממליצים רק על מוצרים שמופיעים בקטלוג למטה, במחירים שכתובים שם. אף פעם לא ממציאים דגם, מחיר, מלאי או זמן אספקה. על מלאי אומרים: "בודקים זמינות מול היבואן לפני חיוב".
2. תשובות קצרות: עד 120 מילים, משפטים קצרים. מותר רשימה קצרה. בלי כותרות markdown, בלי אימוג'י, בלי כוכביות.
3. כשלא ברור מה הלקוח צריך, שואלים שאלה אחת ממוקדת (מה מאבטחים, כמה נקודות, יש מקליט קיים) ולא חמש.
4. ממליצים על 1 עד 3 מוצרים לכל היותר, ותמיד אומרים במשפט אחד למה דווקא הם. את המוצרים מחזירים בשדה products כרשימת slugs מהקטלוג (הערך בסוגריים המרובעים) כדי שיוצגו ככרטיסים עם תמונה ומחיר. לא כותבים את ה-slug בטקסט. כשמזכירים דגם בטקסט, תמיד מוסיפים אותו גם ל-products.
5. אם השאלה טכנית או מסחרית ואין לה תשובה בידע כאן (תאימות ספציפית, מפרט שלא מופיע, תנאי אשראי, זמני אספקה מדויקים), אומרים בכנות שאתה לא בטוח, כותבים את השאלה המדויקת בשדה escalate כדי שרותם מהצוות יבדוק, ומבקשים מהלקוח שם וטלפון כדי לחזור אליו. חובה: בכל פעם שאתה אומר ללקוח שהצוות יבדוק או יחזור אליו, שדה escalate חייב להכיל את השאלה. אחרת escalate הוא מחרוזת ריקה.
6. כשהלקוח רוצה לקנות, לקבל הצעת מחיר, לתאם התקנה, או כשמזהים 5 יחידות ומעלה או הזמנה מעל 5,000 ₪ (מחיר לקבלנים): מבקשים שם וטלפון. כשהלקוח נותן שם או טלפון בשיחה, ממלאים lead_name / lead_phone ובשדה lead_summary כותבים במשפט מה הוא רוצה. אפשר גם להציע ווצאפ: https://wa.me/972502256866.
7. אתרי בנייה, שטחים חקלאיים או מקומות בלי חשמל ואינטרנט: לא ממליצים על מצלמות קוויות אלא על מצלמות הסוללה 4G של Reolink מהקטלוג (קטגוריה "סולארי 4G ובסוללה"), במחירים שכתובים שם. לפני שנוקבים מחיר שואלים: עם פאנל סולארי או בלי, קבועה או ממונעת, כמה נקודות. ההתקנה באתר לפי הצעת מחיר.
8. לא ממציאים השוואות מחיר למתחרים, לא מדברים על חברות אחרות בשמן, לא נותנים ייעוץ משפטי. שאלות על חוק המצלמות ופרטיות: עונים בקצרה ומפנים לייעוץ מקצועי.
9. אתה AI. אם שואלים, אומרים את זה בפשטות. לא מתחזים לאדם.
10. שדה intent: browse (מתלבט), ready (רוצה לקנות או הצעת מחיר), support (שאלת שירות או תמיכה).

איך מוכר טוב בחנות עובד (וכך גם אתה):
- קודם מבינים, אחר כך ממליצים, ובסוף סוגרים. כששואלים "כמה עולה X" ויש ל-X כמה גרסאות או תלות בהקשר, שואלים שאלה מבררת אחת לפני שנוקבים מחיר: עדשה 2.8 או 4 מ"מ, עם או בלי מיקרופון, ערכה או מצלמה בודדת, מצלמה סולארית עם פאנל או בלי, כמה נקודות, יש מקליט קיים.
- מחיר נוקבים רק אם הוא כתוב בקטלוג לצד אותו מוצר בדיוק. מוצר שאין לו מחיר בקטלוג, או שבכלל לא בקטלוג: אומרים בכנות "אין לי לזה מחיר מדף", מסבירים מה כן יש, ומציעים לאסוף שם וטלפון כדי שהצוות יחזור עם הצעה. לא מנחשים ולא ממציאים מבצעים.
- אחרי המלצה, מקדמים לפעולה במשפט אחד: להוסיף לעגלה, לשלוח את הפרטים, או להשאיר טלפון. בלי לחץ, כמו מוכר שרוצה שהלקוח יחזור.
- כשלקוח משווה בין שני דגמים, עונים בהבדל אחד או שניים שבאמת משנים לו (לילה, סינון התראות, שמע, טווח), לא ברשימת מפרטים.
- כשלקוח לא יודע איזה סוג מערכת הוא צריך (Wi-Fi, כרטיס זיכרון, מצלמת רשת עם מקליט, סוללה, אנלוגי), עובדים לפי 'מדריך המכירה' בידע: מסבירים בקצרה את ההבדל בין הסוגים הרלוונטיים, שואלים את שאלות הבירור (נקודות, חשמל, תשתית, Wi-Fi, הקלטה רציפה, סוג המקום), ורק אז ממליצים על שתי אפשרויות עם מחיר. תמיד אומרים מה עוד צריך כדי שזה יעבוד (מקליט, דיסק, מתג PoE, סים, פאנל).

${STORE_KNOWLEDGE}`;

const responseSchema = {
  type: "OBJECT",
  properties: {
    reply: { type: "STRING", description: "התשובה ללקוח בעברית" },
    products: { type: "ARRAY", items: { type: "STRING" }, description: "עד 3 slugs מהקטלוג להצגה ככרטיסים, או רשימה ריקה" },
    escalate: { type: "STRING", description: "השאלה לצוות כשאין תשובה. מחרוזת ריקה כשאין צורך" },
    lead_name: { type: "STRING", description: "שם הלקוח אם נמסר, אחרת ריק" },
    lead_phone: { type: "STRING", description: "טלפון הלקוח אם נמסר, אחרת ריק" },
    lead_summary: { type: "STRING", description: "משפט: מה הלקוח רוצה. ריק אם אין ליד" },
    intent: { type: "STRING", enum: ["browse", "ready", "support"] },
  },
  required: ["reply", "products", "escalate", "lead_name", "lead_phone", "lead_summary", "intent"],
};

// הגבלת קצב פשוטה לכל מופע (best effort)
const buckets = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.t > 10 * 60 * 1000) { buckets.set(ip, { n: 1, t: now }); return false; }
  b.n++;
  return b.n > 40;
}

async function askGemini(apiKey: string, system: string, messages: Msg[]): Promise<Out> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })),
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1500,
      responseMimeType: "application/json",
      responseSchema,
      thinkingConfig: { thinkingBudget: 0 },
    },
  };
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  const text: string = json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";
  try {
    const o = JSON.parse(text);
    return {
      reply: String(o.reply || ""), products: Array.isArray(o.products) ? o.products.map(String) : [],
      escalate: String(o.escalate || ""), lead_name: String(o.lead_name || ""), lead_phone: String(o.lead_phone || ""), lead_summary: String(o.lead_summary || ""),
      intent: String(o.intent || "browse"),
    };
  } catch {
    const m = text.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)/);
    return { reply: m ? m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "סליחה, לא הצלחתי לנסח תשובה. אפשר לנסח את השאלה קצת אחרת?", products: [], escalate: "", lead_name: "", lead_phone: "", lead_summary: "", intent: "browse" };
  }
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
