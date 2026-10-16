// לקחים משיחות: תיוג שיחה אחת (mode "tag") או ניסוח לקחים מתוך הסטטיסטיקה והתיוגים (mode "synthesize").
// הקריאות מגיעות מהכלי המקומי site-control-tools/lead-agent/lessons.js (מפתח admin, כמו ?dry=1 של הבוט), כי מפתח
// Gemini תקף קיים רק כאן ב-Vercel. רותם 16.10.2026: "צריך לעבוד עם ניסיון שנרכש עם הזמן. מה גורם לאנשים לענות
// יותר ולסגור את העסקה בסוף". התוצאה נכתבת ל-app/data/tal-lessons.ts על ידי הכלי המקומי, ונכנסת להנחיות של טל.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { ASSISTANT_NAME, VERIFY_MODEL } from "../../lib/tal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-admin") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`to-rotem:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

const TAG_SYSTEM = `אתה מנתח שיחות מכירה של Site-Control (מצלמות אבטחה, אינטרקום, בקרת כניסה; חנות ומתקינים בישראל). השיחה היא בווצאפ בין לקוח שפנה מהאתר לבין הצד שלנו: ${ASSISTANT_NAME} (עוזר AI), רותם (בעל העסק, מהטלפון) ולפעמים הודעות אוטומטיות (נודניק, פולואפ, תשובת מלאי).
תייג את השיחה בכנות, בלי להחמיא. שדות:
- lead_type: pro = איש מקצוע (מתקין, חשמלאי, קבלן, חנות) שקונה ציוד ומתקין בעצמו; end = לקוח קצה (בית, עסק, מפעל, אתר) שצריך פתרון ומישהו שיתקין; unknown.
- install: self / needs / unknown (האם יש לו מי שיתקין).
- outcome: closed (קנה או שילם), quote_sent (קיבל הצעה או מחיר ולא סגר), engaged (ענה ושאל, עוד לא הצעה), silent_after_first (לא ענה כלום אחרי ההודעה הראשונה שלנו), silent_later (ענה בהתחלה ונעלם), not_relevant (לא רלוונטי, טעות, לא מעוניין), phone_only (עבר לטלפון).
- opening: איך נפתחה השיחה מצידנו: question (שאלת בירור), price_with_link (מחיר וקישור), stock_check (בודק מלאי), generic (תשובה כללית), intro_only.
- what_worked: משפט אחד, מה בשיחה הזאת קידם (או ריק).
- what_hurt: משפט אחד, מה הרתיע, בלבל או עצר (או ריק). למשל: הסבר ארוך, שאלות רבות מדי, "אבדוק ואחזור" בלי המשך, איחור במענה, לחץ מכירתי, חוסר התאמה לסוג הלקוח (הסברים למתקין מקצועי, או ז'רגון ללקוח פרטי).
- lesson: לקח אחד קצר שאפשר ללמוד מהשיחה הזאת על דרך העבודה (או ריק). לא על מחירים, לא על מפרטים.
- confidence: 0 עד 1.`;

const tagSchema = {
  type: "OBJECT",
  properties: {
    lead_type: { type: "STRING", enum: ["pro", "end", "unknown"] },
    install: { type: "STRING", enum: ["self", "needs", "unknown"] },
    outcome: { type: "STRING", enum: ["closed", "quote_sent", "engaged", "silent_after_first", "silent_later", "not_relevant", "phone_only"] },
    opening: { type: "STRING", enum: ["question", "price_with_link", "stock_check", "generic", "intro_only"] },
    what_worked: { type: "STRING" },
    what_hurt: { type: "STRING" },
    lesson: { type: "STRING" },
    confidence: { type: "NUMBER" },
  },
  required: ["lead_type", "install", "outcome", "opening", "what_worked", "what_hurt", "lesson", "confidence"],
};

const SYNTH_SYSTEM = `אתה מנהל המכירות של Site-Control ומנסח לקחים ל-${ASSISTANT_NAME}, עוזר המכירות (AI) שעונה ללקוחות בווצאפ ובצ'אט באתר. רותם, בעל העסק: "צריך לעבוד עם ניסיון שנרכש עם הזמן. מה גורם לאנשים לענות יותר ולסגור את העסקה בסוף".
תקבל סטטיסטיקה מצטברת (שיעורי מענה וסגירה לפי סוג ליד, מקור, שעה, סגנון פתיחה, זמן מענה) ותיוגים של שיחות בודדות (מה עבד, מה הפריע, לקח).
כללים:
- עד 8 לקחים, כל אחד משפט או שניים בעברית פשוטה, כהנחיית עבודה ל-${ASSISTANT_NAME}: מה לעשות ומתי. בסוגריים: על כמה שיחות זה מבוסס (למשל "12 מתוך 31").
- רק דרך עבודה: פתיחה, סדר השאלות, אורך ההודעה, עיתוי, טון, מתי להציע שיחה, מתי לשתוק, פולואפ. אסור: מחירים, הנחות, מפרטים, מדיניות משלוח או תשלום (אלה בידע ובהנחיות, לא כאן).
- כשהמדגם קטן, לומר את זה בלקח עצמו ("בינתיים, על מדגם קטן") ולא להמציא דפוס. לקח שמבוסס על שיחה אחת מסומן "דוגמה אחת".
- לקח שסותר את ההנחיות הקבועות (שאלה אחת בכל הודעה, בלי לחץ, אין לינק תשלום) לא נכתב.
- לקח חייב להיות משהו ש-${ASSISTANT_NAME} יכול לעשות בתוך הודעה: מה לכתוב, מה לשאול, מתי, באיזה אורך, מה לא להציע. לא לקחים על תיאום בין טל לרותם, על המערכת, על עידן או על רותם (אלה לא בידיים של טל).
- לא לחזור על כלל שכבר קיים בהנחיות (שאלה אחת בהודעה, לא מציעים תוספות לא רלוונטיות, בלי לחץ) אלא אם הנתונים מראים שהוא מופר בפועל, ואז לנסח אותו כתזכורת עם הדוגמה.
- summary_he: 3 עד 5 שורות לרותם: מה המספרים אומרים השבוע, מה השתנה, ומה הלקח החשוב ביותר.`;

const synthSchema = {
  type: "OBJECT",
  properties: {
    lessons: { type: "ARRAY", items: { type: "STRING" } },
    summary_he: { type: "STRING" },
  },
  required: ["lessons", "summary_he"],
};

async function gemini(apiKey: string, system: string, user: string, schema: object, maxOutputTokens: number): Promise<unknown> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${VERIFY_MODEL}:generateContent`;
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens, responseMimeType: "application/json", responseSchema: schema, ...(VERIFY_MODEL.startsWith("gemini-2.5") ? { thinkingConfig: { thinkingBudget: 1024 } } : {}) },
  };
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 50_000);
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey }, body: JSON.stringify(body), signal: ctl.signal });
    if (!res.ok) throw new Error(`${VERIFY_MODEL} ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const json = await res.json();
    const text: string = json?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("") || "";
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

type Turn = { who: string; text: string; at?: string };

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no gemini key" }, { status: 503 });
  let b: { mode?: string; lead?: Record<string, unknown>; transcript?: Turn[]; stats?: unknown; cases?: unknown[]; previous?: string[] };
  try { b = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  try {
    if (b.mode === "tag") {
      const turns = (b.transcript || []).filter((t) => t && typeof t.text === "string").slice(-60);
      if (!turns.length) return NextResponse.json({ error: "no transcript" }, { status: 400 });
      const transcript = turns.map((t) => `${t.at ? `[${t.at}] ` : ""}${t.who}: ${t.text.slice(0, 800)}`).join("\n");
      const lead = b.lead ? Object.entries(b.lead).filter(([, v]) => v !== "" && v != null).map(([k, v]) => `${k}: ${String(v).slice(0, 200)}`).join("\n") : "";
      const tags = await gemini(apiKey, TAG_SYSTEM, `# הליד (מהטבלה)\n${lead}\n\n# השיחה\n${transcript}\n\nתייג והחזר JSON.`, tagSchema, 4000);
      return NextResponse.json({ ok: true, tags });
    }
    if (b.mode === "synthesize") {
      const user = `# סטטיסטיקה\n${JSON.stringify(b.stats || {}, null, 1).slice(0, 12000)}\n\n# תיוגי שיחות (מה עבד, מה הפריע, לקח)\n${JSON.stringify((b.cases || []).slice(0, 120), null, 0).slice(0, 40000)}\n\n# הלקחים הקודמים (אפשר לשמור, לעדכן או להסיר)\n${(b.previous || []).map((l) => `- ${l}`).join("\n") || "(אין)"}\n\nנסח את הלקחים ואת הסיכום לרותם, והחזר JSON.`;
      const out = await gemini(apiKey, SYNTH_SYSTEM, user, synthSchema, 8000);
      return NextResponse.json({ ok: true, ...(out as object) });
    }
    return NextResponse.json({ error: "mode" }, { status: 400 });
  } catch (e) {
    console.error("tal-lessons", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: e instanceof Error ? e.message.slice(0, 200) : "error" }, { status: 502 });
  }
}
