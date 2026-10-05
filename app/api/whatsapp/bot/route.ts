// טל בווצאפ: עונה ללידים של Site-Control מהמספר העסקי 050-2256866 כשרותם לא זמין (לילה, עסוק).
// רותם 5.10.2026: "כל האלו שמגיעים בשעות הלילה ובכללי אני צריך שהבוט ידבר איתם, יעזור להם לבחור ולקנות.
// אני אוכל להתערב אם צריך".
//
// מקבל webhook של GreenAPI (incomingMessageReceived). המוח: app/lib/tal.ts, אותו ידע כמו הצ'אט באתר.
// כללי בטיחות (האינסטנס משותף גם למערכת הלידים של TimelapseIT, ובטלפון של רותם יש שיחות אחרות):
// 1. רק שיחה פרטית שיש בה הודעה נכנסת מכפתור באתר של Site-Control (site-wa-prefills). לא TimelapseIT,
//    לא עידן, לא קבוצות, לא אנשי קשר אחרים.
// 2. רותם כתב בשיחה מהטלפון (sendByApi=false) ב-12 השעות האחרונות: הבוט שותק. רותם "לוקח" שיחה פשוט כשהוא כותב בה.
// 3. לא בשבת ובחג (שישי/ערב חג מ-16:00 עד מוצאי שבת/חג 20:00).
// 4. עונה רק על ההודעה הנכנסת האחרונה, אחרי המתנה קצרה (לקוחות שולחים כמה הודעות ברצף), ורק אם עוד לא
//    נענתה. כך גם שליחה חוזרת של אותו webhook (GreenAPI מנסה שוב אחרי דקה) לא יוצרת תשובה כפולה.
// 5. עד 10 תשובות של הבוט לשיחה ביממה.
// מצב: BOT_MODE. "live" = עונה ללקוח; "dry" = שולח לרותם בלבד את מה שהיה עונה; "off" = לא עושה כלום.
import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { botToken } from "../../../lib/wa-bot-token";
import { greenApi, sendWhatsAppId, IDAN_WA, notifyTeam, SC_GROUP } from "../../../lib/store-notify";
import { siteSourceOf } from "../../../lib/site-wa-prefills";
import { SYSTEM, askGemini, type Msg } from "../../../lib/tal";
import { storeProducts, productName } from "../../../data/store-catalog";
import { productBySlug } from "../../../data/store-knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BOT_MODE: "live" | "dry" | "off" = "live";
const ROTEM = process.env.STORE_ALERT_WHATSAPP || "972502256866";
const SITE = "https://www.site-control-il.com";
const DEBOUNCE_MS = 12_000;
const ROTEM_ACTIVE_HOURS = 12;
const MAX_BOT_REPLIES_PER_DAY = 10;
const INTRO_MARK = "העוזר הדיגיטלי של Site-Control";
const STOCK_MARK = "📦 בדיקת מלאי:";

type H = { idMessage?: string; timestamp?: number; type?: string; typeMessage?: string; textMessage?: string; extendedTextMessage?: { text?: string }; caption?: string; sendByApi?: boolean };
const textOf = (m: H) => m.textMessage || m.extendedTextMessage?.text || m.caption || "";

/** בדיקה ידנית (?dry=1) עם מפתח ה-admin של הכלים המקומיים: מחזיר את התשובה בלי לשלוח */
function adminAuthorized(req: NextRequest): boolean {
  const base = process.env.RESEND_API_KEY;
  const got = req.headers.get("x-sc-admin") || "";
  if (!base || !got) return false;
  const want = createHash("sha256").update(`to-rotem:${base}`).digest("hex");
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}
function authorized(req: NextRequest): boolean {
  const want = botToken();
  const got = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return Boolean(want && got) && got.length === want!.length && timingSafeEqual(Buffer.from(got), Buffer.from(want!));
}

// ימי חג בישראל (שבתון) עד סוף 2027. ערב חג כמו שישי.
const CHAG = ["2026-10-03", "2027-04-22", "2027-04-28", "2027-06-11", "2027-10-02", "2027-10-03", "2027-10-11", "2027-10-16", "2027-10-23"];
function restDay(now = new Date()): boolean {
  const day = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  const wd = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", weekday: "short" }).format(now);
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", hour: "numeric", hour12: false }).format(now)) % 24;
  const today = day(now);
  const tomorrow = day(new Date(now.getTime() + 24 * 3600 * 1000));
  const eve = wd === "Fri" || CHAG.includes(tomorrow);
  const holy = wd === "Sat" || CHAG.includes(today);
  return (eve && hour >= 16) || (holy && hour < 20);
}

const WHATSAPP_RULES = `

# ערוץ: ווצאפ (גובר על כללים 2, 4 ו-6 למעלה כשיש סתירה)
אתה טל, העוזר של רותם גולן מ-Site-Control, ועונה עכשיו בווצאפ מהמספר העסקי (050-2256866) ללקוח שפנה מכפתור באתר. רותם עצמו לא זמין כרגע (לילה או עסוק), ואתה מחזיק את השיחה עד שהוא פנוי. זה גם הטלפון שרותם מדבר ממנו, אז כשהוא יחזור, הוא יכתוב או יתקשר מכאן.
- אם עוד לא הצגת את עצמך בשיחה הזאת, ההודעה מתחילה ב: "היי, כאן טל, ${INTRO_MARK} 👋". אחרי זה בלי אימוג'י.
- כתוב כמו הודעת ווצאפ: קצר, עד 80 מילים, שורות קצרות, בלי markdown ובלי כוכביות.
- מבררים, לא רק עונים. בשיחה כזאת חשוב להבין, שאלה אחת או שתיים בכל הודעה: איך קוראים ללקוח או ללקוחה; איפה הבית או העסק (יישוב, בית פרטי או דירה, קומה); מה רוצים לאבטח ולאיזה כיוון (כניסה, חניה, חצר, פנים הבית); כמה נקודות; האם יש חשמל ואינטרנט במקום; האם בסדר להעביר כבלים, או שעדיף אלחוטי. כשהלקוח כבר ענה, לא שואלים שוב.
- מסבירים יתרונות וחסרונות, בשורה או שתיים לכל צד, כמו מתקין מנוסה: קווי (PoE עם מקליט) יציב, מקליט 24/7 לדיסק ונראה בטלוויזיה, אבל צריך להעביר כבל לכל מצלמה; אלחוטי (Wi-Fi) מתקינים לבד בלי כבלים, אבל תלוי בקליטה וצריך שקע ליד כל מצלמה; סוללה/4G לאתר בלי חשמל ואינטרנט. באינטרקום: 2 גידים על הכבל הקיים (עם או בלי אפליקציה), IP למי שיש תשתית רשת, והיברידי לדירה בבניין ישן שרוצה לענות מהנייד. למבוגרים: מסך פיזי בכבל, בלי אפליקציה.
- משתמשים בטיפים של עידן היבואן ובמה שלמדנו משיחות (בידע למטה): למשל חלופה שבמלאי, זרוע לכיפה, מסך נוסף לאינטרקום, מצלמה שעוקבת לבד למי שלא מסתדר עם אפליקציה. זה מה שמבדיל בין בוט למוכר טוב.
- אין כרטיסי מוצר בווצאפ. מוצרים שאתה ממליץ עליהם מחזירים ב-products, והמערכת מוסיפה את הקישורים לבד. לא כותבים כתובות בעצמך.
- הלקוח כבר בווצאפ: לא מבקשים ממנו טלפון ולא שולחים קישור wa.me. מותר לבקש שם.
- מלאי: אף פעם לא מבטיחים מהראש שיש במלאי. כשהלקוח שואל אם מוצר מסוים במלאי, או רוצה לקנות אותו, מחזירים את ה-slug שלו בשדה stock_check, והמערכת שואלת את עידן היבואן. ללקוח אומרים: בשעות העבודה של היבואן (א'-ה' 08:00-17:00, ו' עד 13:00) "אני בודק עכשיו מול היבואן וחוזר אליך תוך זמן קצר"; מחוץ לשעות האלה "היבואן כבר לא זמין בשעה כזאת, אני בודק מחר בבוקר וחוזר אליך". לא ממציאים תשובת מלאי. אם בשיחה כבר כתוב שבדקנו ("בדקנו מול היבואן"), לא בודקים שוב את אותו מוצר, אלא ממשיכים משם.
- כשההקשר אומר "תוצאת בדיקת מלאי": זו התשובה של עידן. מעבירים אותה ללקוח בפשטות ("בדקנו, יש במלאי ואספקה מיידית" / "לא במלאי כרגע, ועידן ממליץ על..."), ומתקדמים למכירה: איך נוח לו לקבל, איסוף עצמי בתיאום או משלוח לכתובת (המשלוח בתשלום לפי כתובת), ואיך מזמינים.
- איך קונים: מזמינים מדף המוצר באתר (הוספה לעגלה ושליחת הזמנה עם קוד אימות בווצאפ). ההזמנה לא מחייבת: לא גובים כלום עד שרותם מאשר מלאי ומחיר משלוח. אפשר גם פשוט לכתוב כאן מה רוצים להזמין ולאיזו כתובת, ורותם יאשר.
- מחיר שרותם כבר כתב ללקוח בשיחה הזאת מחייב, גם אם במחירון כתוב אחרת. לא סותרים אותו.
- אתה גם מתאם שיחות של רותם. לקוח שרוצה לדבר עם בן אדם, או שהשאלה שלו דורשת את רותם (הנחה, כמות, התקנה, משהו שאתה לא בטוח בו): מציעים שרותם יחזור אליו מהטלפון הזה, ושואלים מתי נוח. אומרים בכנות מתי רותם זמין לפי השעה עכשיו (שעות הפעילות: ${"א'-ה' 08:00-18:00, ו' 08:00-14:00"}). למשל באחת בלילה: "בשעה כזאת רותם עוד לא זמין, בסביבות 9-10 בבוקר הוא כבר יהיה, ואני מוסר לו שיחזור אליך מהטלפון הזה". אחרי שהלקוח אישר: כותבים בשדה escalate "לחזור ל{שם} ב{שעה שביקש}: {מה הוא רוצה}", כדי שרותם יקבל תזכורת.
- לא חוזרים על מה שכבר נאמר בשיחה, ולא שואלים שוב שאלה שהלקוח כבר ענה עליה.
- כשרותם חוזר לשיחה, הוא כותב מהטלפון בעצמו. אתה לא מתחזה לרותם ולא מדבר בשמו בגוף ראשון.`;

export async function POST(req: NextRequest) {
  const dry = req.nextUrl.searchParams.get("dry") === "1" && adminAuthorized(req); // בדיקה ידנית: מחזיר את התשובה בלי לשלוח
  // kick: לפתוח שיחה עם ליד שכבר מחכה (webhook נשלח רק על הודעות חדשות). כל כללי הבטיחות חלים, בלי המתנה.
  const kick = req.nextUrl.searchParams.get("kick") === "1" && adminAuthorized(req);
  if (!dry && !kick && !authorized(req)) return NextResponse.json({ error: "not found" }, { status: 404 });
  let n: { typeWebhook?: string; senderData?: { chatId?: string; senderName?: string }; idMessage?: string; messageData?: { typeMessage?: string }; stockResult?: { slug?: string; answer?: string }; followUp?: { step?: number; note?: string } };
  try { n = await req.json(); } catch { return NextResponse.json({ ok: true }); }
  // תוצאת בדיקת מלאי מהכלי המקומי (רק עם מפתח admin): טל ממשיך את השיחה עם תשובת עידן
  const stockResult = kick && n.stockResult && typeof n.stockResult.answer === "string" ? n.stockResult : undefined;
  // פולואפ יזום אחרי הצעת מחיר (מהכלי המקומי followups.js): {step: 1|2|3, note: "..."}. טל כותב את הפולואפ לפי השיחה.
  const followUp = kick && n.followUp && typeof n.followUp.step === "number" ? n.followUp : undefined;
  const proactive = Boolean(stockResult || followUp);
  if (BOT_MODE === "off" && !dry) return NextResponse.json({ ok: true, skip: "off" });
  if (n.typeWebhook !== "incomingMessageReceived") return NextResponse.json({ ok: true });
  const chatId = String(n.senderData?.chatId || "");
  const phone = chatId.replace(/@c\.us$/, "");
  if (!/^\d{11,13}@c\.us$/.test(chatId) || phone === IDAN_WA || phone === ROTEM) return NextResponse.json({ ok: true, skip: "chat" });
  if (restDay() && !dry) return NextResponse.json({ ok: true, skip: "shabbat" });

  if (!dry && !kick) await new Promise((r) => setTimeout(r, DEBOUNCE_MS));
  const history = await greenApi<H[]>("getChatHistory", { chatId, count: 40 });
  if (!history?.length) return NextResponse.json({ ok: true, skip: "no history" });
  const msgs = [...history].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  // 1. רק לידים מהאתר של Site-Control
  const prefill = msgs.find((m) => m.type === "incoming" && siteSourceOf(textOf(m)));
  if (!prefill) return NextResponse.json({ ok: true, skip: "not a site lead" });
  // 4. עונים רק כשההודעה האחרונה בשיחה היא נכנסת (אין עדיין תשובה אחריה)
  const last = msgs[msgs.length - 1];
  if (last.type !== "incoming" && !proactive) return NextResponse.json({ ok: true, skip: "already answered" });
  if (followUp && last.type === "incoming") return NextResponse.json({ ok: true, skip: "customer replied, no follow-up needed" });
  if (!dry && !kick && n.idMessage && last.idMessage !== n.idMessage) return NextResponse.json({ ok: true, skip: "newer message pending" });
  // 2. רותם פעיל בשיחה
  const now = Date.now() / 1000;
  const rotemRecent = msgs.some((m) => m.type === "outgoing" && m.sendByApi === false && now - (m.timestamp || 0) < ROTEM_ACTIVE_HOURS * 3600);
  if (rotemRecent && !dry && !proactive) return NextResponse.json({ ok: true, skip: "rotem active" });
  // 5. תקרה יומית
  const botToday = msgs.filter((m) => m.type === "outgoing" && m.sendByApi && textOf(m) && now - (m.timestamp || 0) < 24 * 3600).length;
  if (botToday >= MAX_BOT_REPLIES_PER_DAY && !dry) return NextResponse.json({ ok: true, skip: "daily cap" });

  // השיחה כקלט לטל: נכנס = לקוח, יוצא (רותם או מערכת) = הצד שלנו. הודעות רצופות מאותו צד מאוחדות.
  const conv: Msg[] = [];
  for (const m of msgs.slice(-20)) {
    const t = textOf(m) || (m.typeMessage === "audioMessage" ? "[הודעה קולית]" : m.typeMessage === "imageMessage" ? "[תמונה]" : m.typeMessage ? `[${m.typeMessage}]` : "");
    if (!t) continue;
    const role: Msg["role"] = m.type === "incoming" ? "user" : "assistant";
    const prev = conv[conv.length - 1];
    if (prev && prev.role === role) prev.content = `${prev.content}\n${t}`.slice(-1500);
    else conv.push({ role, content: t.slice(0, 1500) });
  }
  while (conv.length && conv[0].role !== "user") conv.shift();
  if (proactive && conv.length && conv[conv.length - 1].role !== "user") conv.push({ role: "user", content: stockResult ? "(ממתין לתשובה על המלאי)" : "(הלקוח לא ענה מאז ההודעה האחרונה שלנו)" });
  if (!conv.length || conv[conv.length - 1].role !== "user") return NextResponse.json({ ok: true, skip: "no user turn" });

  const nowIL = new Intl.DateTimeFormat("he-IL", { timeZone: "Asia/Jerusalem", weekday: "long", hour: "2-digit", minute: "2-digit" }).format(new Date());
  const ctx: string[] = [`השעה עכשיו בישראל: ${nowIL}.`, `הלקוח פנה מהאתר (${siteSourceOf(textOf(prefill))}).`];
  const fromPage = storeProducts.find((p) => textOf(prefill).includes(p.title));
  if (fromPage) ctx.push(`הוא כתב מדף המוצר ${productName(fromPage)} [${fromPage.slug}], מחיר באתר ${fromPage.price ? `${fromPage.price} ₪` : "לפי פנייה"}.`);
  const waitedH = (now - (last.timestamp || now)) / 3600;
  if (waitedH > 3 && last.type === "incoming" && !proactive) ctx.push(`ההודעה האחרונה של הלקוח חיכתה ${Math.round(waitedH)} שעות בלי מענה: פתח בהתנצלות קצרה על העיכוב.`);
  if (followUp) {
    const steps: Record<number, string> = {
      1: "פולואפ ראשון, יומיים אחרי ההצעה: לוודא בקצרה שההצעה התקבלה ושהכול ברור, ולהציע לענות על שאלות. הודעה קצרה וחמה, בלי לחץ.",
      2: "פולואפ שני, כמה ימים אחרי: לשאול אם עבר על ההצעה, אם משהו חסר או שרוצה לשנות משהו (כמות, דגם, התקנה), ולהזכיר שאפשר לדבר עם רותם.",
      3: "פולואפ אחרון: הודעה קצרה ומכבדת. אם זה לא מתאים כרגע, בסדר גמור, ההצעה נשארת בתוקף ואפשר לחזור מתי שנוח. לא שולחים אחרי זה יותר.",
    };
    ctx.push(`זה פולואפ יזום (${steps[followUp.step ?? 2] || steps[2]})${followUp.note ? ` מה שהוצע: ${String(followUp.note).slice(0, 300)}.` : ""} לא ממציאים שינויים בהצעה, לא מורידים מחיר. השדה stock_check ריק.`);
  }
  if (stockResult) {
    const sp = stockResult.slug ? productBySlug(stockResult.slug) : undefined;
    ctx.push(`תוצאת בדיקת מלאי מעידן היבואן${sp ? ` על ${productName(sp)} [${sp.slug}]` : ""}: "${String(stockResult.answer).slice(0, 400)}". תעביר ללקוח ותתקדם למכירה.`);
  }
  const introduced = msgs.some((m) => m.type === "outgoing" && textOf(m).includes(INTRO_MARK));
  ctx.push(introduced ? "כבר הצגת את עצמך בשיחה הזאת, אל תציג שוב." : "עוד לא הצגת את עצמך בשיחה הזאת.");
  if (n.senderData?.senderName) ctx.push(`השם שלו בווצאפ: ${n.senderData.senderName} (אפשר לפנות בשם הפרטי אם נראה כמו שם אמיתי).`);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false, error: "no gemini key" }, { status: 503 });

  let data;
  try { data = await askGemini(apiKey, `${SYSTEM}${WHATSAPP_RULES}\n\n# הקשר נוכחי\n${ctx.join("\n")}`, conv); }
  catch (e) { console.error("wa bot gemini", e instanceof Error ? e.message : e); return NextResponse.json({ ok: false, error: "gemini" }, { status: 200 }); }

  const links = data.products.map((s) => productBySlug(s.trim().replace(/^\[|\]$/g, ""))).filter(Boolean).slice(0, 3)
    .map((p) => `${productName(p!)}${p!.price ? `, ${p!.price.toLocaleString("he-IL")} ₪` : ""}:\n${SITE}/store/${p!.slug}`);
  const body = data.reply.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/^\s*[*-]\s+/gm, "• ").trim();
  const text = [body, ...links].filter(Boolean).join("\n\n").slice(0, 3500);
  if (dry) return NextResponse.json({ ok: true, dry: true, text, escalate: data.escalate, intent: data.intent, stock_check: data.stock_check, followUp: followUp?.step });
  // בקשת בדיקת מלאי: הודעה מסומנת לווצאפ של רותם (לעצמו). הכלי המקומי (stock-check.js) קורא אותה, שואל את עידן
  // בשעות העבודה שלו, ומחזיר את התשובה לכאן עם stockResult. רותם 5.10.2026: "לא להציק לו סתם, רק בשעות עבודה".
  const stockProduct = data.stock_check ? productBySlug(data.stock_check.trim().replace(/^\[|\]$/g, "")) : undefined;
  if (stockProduct && !proactive) {
    await sendWhatsAppId(SC_GROUP, `${STOCK_MARK} ${phone} ${stockProduct.slug}
לקוח: ${n.senderData?.senderName || phone.replace(/^972/, "0")}
מוצר: ${productName(stockProduct)}${stockProduct.sku ? ` (מק"ט ${stockProduct.sku})` : ""}, ${stockProduct.price ? `${stockProduct.price} ₪` : "לפי פנייה"}
(טל שואל את עידן בשעות העבודה שלו, ומחזיר ללקוח)`);
  }

  // מצב dry: לרותם בלבד
  if (BOT_MODE === "dry") {
    await sendWhatsAppId(SC_GROUP, `🤖 טל היה עונה ל-${phone.replace(/^972/, "0")}:\n\n${text}`);
    return NextResponse.json({ ok: true, mode: "dry" });
  }
  const id = await sendWhatsAppId(phone, text);
  // שאלה שצריך את רותם, או לקוח שמוכן לקנות: הודעה לרותם (ווצאפ לעצמו + מייל)
  if (data.escalate.trim() || data.intent === "ready") {
    const lastIn = textOf(last).slice(0, 300);
    await notifyTeam(
      data.intent === "ready" ? `🟢 טל: לקוח מוכן לקנות (${phone.replace(/^972/, "0")})` : `❓ טל צריך אותך (${phone.replace(/^972/, "0")})`,
      `${data.escalate ? `שאלה: ${data.escalate}\n` : ""}${data.lead_summary ? `סיכום: ${data.lead_summary}\n` : ""}הלקוח כתב: ${lastIn}\n\nטל ענה:\n${text}\n\nכדי לקחת את השיחה: פשוט לכתוב לו מהטלפון. הבוט שותק 12 שעות אחרי הודעה שלך.`,
    ).catch(() => undefined);
  }
  return NextResponse.json({ ok: Boolean(id), sent: Boolean(id) });
}
