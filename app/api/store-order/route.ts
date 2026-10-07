// הזמנה מהעגלה: מאמתים מול הקטלוג, מחשבים סכום, שולחים לצוות (ווצאפ/מייל) ומחזירים אישור.
// אין חיוב באתר: הצוות מאשר זמינות מול היבואן וחוזר ללקוח לתשלום.
// בנוסף (רותם 1.10.2026): ללקוח יוצאת מיד הודעת ווצאפ אישית מהמספר העסקי של רותם, עם המוצר, המחיר והקישור.
// והזמנה נוצרת רק אחרי אימות הטלפון בקוד ווצאפ (/api/store-order/verify), וכתובת חובה למשלוח ולהתקנה.
import { NextRequest, NextResponse } from "next/server";
import { productBySlug } from "../../data/store-knowledge";
import { deliveryOptions, productName } from "../../data/store-catalog";
import { notifyTeam, sendWhatsApp, sendWhatsAppId, messageStatus, israeliMobile, SUPPLIER_GROUP } from "../../lib/store-notify";
import { attributionLabel } from "../../lib/attribution-label";
import { attrsOf } from "../../data/store-attrs";
import { supplierNoteOf } from "../../data/supplier-notes";
import { otpEnabled, checkCode } from "../../lib/order-otp";

export const runtime = "nodejs";
// שליחה ללקוח, לעידן ובדיקה שההודעה לעידן נמסרה: עד כמה שניות נוספות
export const maxDuration = 30;

type Line = { slug: string; qty: number };
type OrderItem = { p: NonNullable<ReturnType<typeof productBySlug>>; qty: number };

const SITE = "https://www.site-control-il.com";
const nis = (n: number) => n.toLocaleString("he-IL");

// הגנה מהצפה: לא שולחים לאותו מספר יותר מהודעה אחת ב-10 דקות (בזיכרון של המופע)
const lastSent = new Map<string, number>();

/** ההודעה ללקוח, בקול של רותם: שם, מה הוזמן עם מחיר וקישור, מה קורה עכשיו, ושהוא זמין במספר הזה */
function customerMessage(name: string, ref: string, items: OrderItem[], total: number, deliveryId: string | undefined, address: string): string {
  const first = name.trim().split(/\s+/)[0];
  const shown = items.slice(0, 3).map(({ p, qty }) =>
    `• ${qty > 1 ? `${qty} x ` : ""}${productName(p)}${p.price ? `: ${nis(p.price * qty)} ₪` : ""}\n  ${SITE}/store/${p.slug}`);
  const more = items.length > 3 ? [`ועוד ${items.length - 3} פריטים`] : [];
  const next =
    deliveryId === "courier" ? `אני בודק עכשיו את המלאי מול היבואן וחוזר אליך עם אישור ומחיר משלוח ל${address || "כתובת שלך"}.`
    : deliveryId === "pickup" ? "אני בודק עכשיו את המלאי מול היבואן וחוזר אליך עם אישור ותיאום איסוף."
    : deliveryId === "install" ? `אני בודק עכשיו את המלאי מול היבואן וחוזר אליך עם אישור, ונתאם יחד את ההתקנה${address ? ` ב${address}` : ""}.`
    : "אני בודק עכשיו את המלאי מול היבואן וחוזר אליך עם אישור.";
  return [
    `שלום ${first} 👋`,
    `כאן רותם מ-Site-Control. ראיתי שהזמנת אצלנו באתר (מס׳ הזמנה ${ref}):`,
    "",
    ...shown,
    ...more,
    "",
    total ? `סה״כ ${nis(total)} ₪ כולל מע״מ${deliveryId === "courier" ? ", לא כולל משלוח" : ""}.` : null,
    next,
    "",
    "יש שאלה? אני זמין כאן בווצאפ ובטלפון הזה.",
    "רותם, Site-Control",
  ].filter((x) => x !== null).join("\n");
}

/** ההזמנה לספק (טלרן, היבואן), מהמספר של רותם: כל מה שצריך כדי לבדוק מלאי ולתפור את העסקה מול הלקוח.
 *  מ-7.10.2026 לקבוצת ההזמנות (עידן ואלי). רותם: "כל מה שקשור לשאלות מלאי, מחירים וכו'" לקבוצה */
function supplierMessage(ref: string, name: string, phone: string, delivery: string, address: string, items: OrderItem[], total: number, note: string): string {
  return [
    "היי עידן ואלי, הזמנה חדשה מהאתר של Site-Control 🙏",
    `מס׳ הזמנה: ${ref} (הטלפון של הלקוח אומת בקוד ווצאפ)`,
    `לקוח: ${name}, ${phone}`,
    `אספקה: ${delivery}${address ? `, ${address}` : ""}`,
    "",
    "פריטים:",
    ...items.map(({ p, qty }) => `• ${qty} x ${p.brand} ${p.model}${p.sku ? ` (מק״ט ${p.sku})` : ""}${p.price ? `: ${nis(p.price)} ₪ ליח׳ באתר` : ""}`),
    total ? `סה״כ באתר: ${nis(total)} ₪ כולל מע״מ, לא כולל משלוח` : null,
    note ? `הערה מהלקוח: ${note}` : null,
    "",
    "תוכלו לבדוק מלאי ולתפור את העסקה מולו? הלקוח כבר קיבל ממני הודעה שאני בודק מלאי וחוזר אליו.",
    "תודה, רותם",
  ].filter((x) => x !== null).join("\n");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  let body: { name?: string; phone?: string; delivery?: string; address?: string; note?: string; items?: Line[]; email?: string; attribution?: unknown; otpToken?: string; otpCode?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad request" }, { status: 400 }); }
  const name = String(body.name || "").trim().slice(0, 80);
  const phone = String(body.phone || "").replace(/[^\d+]/g, "").slice(0, 20);
  if (name.length < 2 || phone.replace(/\D/g, "").length < 9) return NextResponse.json({ error: "צריך שם וטלפון תקין כדי שנחזור אליך" }, { status: 400 });
  const items = (body.items || []).map((l) => ({ p: productBySlug(String(l.slug)), qty: Math.max(1, Math.min(200, Math.floor(Number(l.qty) || 1))) })).filter((l) => l.p);
  if (!items.length) return NextResponse.json({ error: "העגלה ריקה" }, { status: 400 });
  const address = String(body.address || "").replace(/[\r\n\t]+/g, " ").trim().slice(0, 160);
  if ((body.delivery === "courier" || body.delivery === "install") && address.length < 6) {
    return NextResponse.json({ error: "צריך כתובת (עיר, רחוב ומספר) כדי לתמחר משלוח או התקנה" }, { status: 400 });
  }
  // אימות טלפון: רק מי שקיבל את הקוד בווצאפ למספר שהזין יכול לשלוח הזמנה
  const verified = otpEnabled();
  if (verified) {
    const m = israeliMobile(phone);
    if (!m || !checkCode(m, String(body.otpCode || ""), String(body.otpToken || ""))) {
      return NextResponse.json({ error: "קוד האימות לא נכון או שפג תוקפו. אפשר לבקש קוד חדש.", code: "otp" }, { status: 400 });
    }
  }

  const delivery = deliveryOptions.find((d) => d.id === body.delivery)?.title || "לא נבחר";
  let total = 0, unknown = 0, units = 0;
  const lines = items.map(({ p, qty }) => {
    // אביזרים (זרוע, קופסת חיבורים) לא נספרים לכמות של קבלן
    if (attrsOf(p!).kind !== "accessory") units += qty;
    if (p!.price) total += p!.price * qty; else unknown++;
    return `- ${qty} x ${p!.brand} ${p!.model}${p!.sku ? ` (מק"ט ${p!.sku})` : ""} | ${p!.price ? `${p!.price} ₪ ליח', ${p!.price * qty} ₪` : "לפי פנייה"} | /store/${p!.slug}`;
  });
  // ניסיון קודם מול היבואן על הפריטים בהזמנה: מה קרה ומה הוצע במקום, כדי לא להתחיל מאפס
  const supplier = items.flatMap(({ p }) => {
    const n = supplierNoteOf(p!.slug);
    if (!n) return [];
    const alts = (n.alternatives || []).map((a) => {
      const ap = productBySlug(a.slug);
      const altTips = supplierNoteOf(a.slug)?.tips || [];
      return `  חלופה: ${ap ? `${ap.brand} ${ap.model}${ap.price ? `, ${ap.price} ₪` : ""}` : a.slug} | /store/${a.slug} | ${a.why}${altTips.length ? ` | ${altTips.join("; ")}` : ""}`;
    });
    const tips = (n.tips || []).map((t) => `  להציע גם: ${t}`);
    return [`* ${p!.brand} ${p!.model}${n.history ? `: ${n.history}` : ""}`, ...alts, ...tips];
  });
  const bulk = units >= 5 || total >= 5000 || items.some((l) => l.qty >= 5 && attrsOf(l.p!).kind !== "accessory");
  const ref = `SC-${Date.now().toString(36).toUpperCase()}`;

  // הודעה אישית ללקוח מהמספר של רותם. רק לנייד ישראלי, ולא יותר מפעם ב-10 דקות לאותו מספר.
  const mobile = israeliMobile(phone);
  let customerWa = false;
  if (mobile && Date.now() - (lastSent.get(mobile) || 0) > 10 * 60 * 1000) {
    customerWa = await sendWhatsApp(mobile, customerMessage(name, ref, items as OrderItem[], total, body.delivery, address));
    if (customerWa) lastSent.set(mobile, Date.now());
  }

  // הזמנה מאומתת עוברת לספק, ובודקים כמה שניות אם ההודעה נמסרה. מ-7.10.2026 לקבוצת ההזמנות (עידן ואלי) ולא לצ'אט
  // הפרטי של עידן: רותם פתח את הקבוצה "שיהיה מסודר", ולפעמים עידן לא עונה ואלי כן
  let idanStatus: string | null = null;
  if (verified) {
    const idanMsgId = await sendWhatsAppId(SUPPLIER_GROUP, supplierMessage(ref, name, phone, delivery, address, items as OrderItem[], total, String(body.note || "").slice(0, 300)));
    if (idanMsgId) {
      idanStatus = "sent";
      for (const wait of [3000, 4000]) {
        await sleep(wait);
        const st = await messageStatus(SUPPLIER_GROUP, idanMsgId);
        if (st) idanStatus = st;
        if (st === "delivered" || st === "read") break;
      }
    }
  }
  const idanLine = !verified ? null
    : idanStatus === "read" ? "✅✅ ההזמנה נשלחה לקבוצת ההזמנות (עידן ואלי) וכבר נקראה."
    : idanStatus === "delivered" ? "✅✅ ההזמנה נשלחה לקבוצת ההזמנות (עידן ואלי) ונמסרה."
    : idanStatus ? "📤 ההזמנה נשלחה לקבוצת ההזמנות (עידן ואלי), עדיין לא סומנה כנמסרה."
    : "⚠️ לא הצלחנו לשלוח את ההזמנה לקבוצת ההזמנות. להעביר לעידן/אלי ידנית.";

  const text = [
    `מספר הזמנה: ${ref}`,
    `שם: ${name}`,
    `טלפון: ${phone}`,
    body.email ? `מייל: ${String(body.email).slice(0, 120)}` : null,
    `אספקה: ${delivery}`,
    address ? `כתובת: ${address}` : null,
    verified ? "✅ הטלפון אומת בקוד ווצאפ" : null,
    `מקור: ${attributionLabel(body.attribution)}`,
    bulk ? "כמות/סכום של קבלן: להכין הצעת מחיר עם הנחת כמות" : null,
    "",
    "פריטים:",
    ...lines,
    "",
    `סה"כ (כולל מע"מ, ללא משלוח): ${total.toLocaleString("he-IL")} ₪${unknown ? ` + ${unknown} פריטים לפי פנייה` : ""}`,
    body.note ? `\nהערה מהלקוח: ${String(body.note).slice(0, 500)}` : null,
    supplier.length ? `\nמהניסיון מול היבואן:\n${supplier.join("\n")}` : null,
    "",
    customerWa ? "✅ ללקוח נשלחה הודעת ווצאפ אוטומטית ממך (מוצר, מחיר, קישור, ושאתה בודק מלאי)." : `⚠️ לא נשלחה ללקוח הודעת ווצאפ אוטומטית${mobile ? "" : " (המספר לא נייד ישראלי)"}.`,
    idanLine,
    idanStatus ? "לעשות: לוודא שעידן תופר את העסקה מול הלקוח (מלאי, תשלום, משלוח), ולעדכן אותי." : "לעשות: לבדוק זמינות מול עידן (טלרן), לתמחר משלוח UPS לפי הכתובת (אם נבחר משלוח), ולחזור ללקוח לאישור מחיר סופי ותשלום.",
  ].filter((x) => x !== null).join("\n");

  const sent = await notifyTeam(`הזמנה חדשה מהחנות ${ref}${bulk ? " (קבלן)" : ""}`, text);
  // אם אף ערוץ לא עבד, לא מאשרים ללקוח הזמנה שאף אחד לא יראה: מחזירים שגיאה וה-UI מציע וואטסאפ.
  if (!sent.whatsapp && !sent.email) return NextResponse.json({ error: "לא הצלחנו לשלוח את ההזמנה כרגע. אפשר לשלוח אותה בווצאפ ונטפל מיד." }, { status: 502 });
  return NextResponse.json({ ok: true, ref, total, unknown, bulk, delivered: sent.whatsapp || sent.email, customerWa, supplier: idanStatus });
}
