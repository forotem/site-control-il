"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WHATSAPP_NUMBER, storeProducts, productName } from "../data/store-catalog";
import { attrsOf, isCamera, isRecorder } from "../data/store-attrs";
import { cart } from "./cart";
import { track } from "../lib/analytics";
import { getAttribution } from "../lib/attribution";
import styles from "./store.module.css";
import c from "./commerce.module.css";

type Product = { slug: string; brand: string; model: string; title: string; price: number | null; image: string | null };
type Msg = { role: "user" | "assistant"; content: string; products?: Product[] };

const NAME = "טל";
const AVATAR = "/store-images/assistant-avatar.png";
const GREETING: Msg = {
  role: "assistant",
  content: `היי, אני ${NAME}, העוזר הדיגיטלי של החנות. אני מכיר את כל המוצרים כאן ואפשר לשאול אותי הכל: מה ההבדל בין שתי מצלמות, מה מתאים לבית שלך, או כמה מצלמות צריך. במה לעזור?`,
};
const QUICK = ["מה מתאים לבית פרטי עם חצר?", "מה ההבדל בין ColorVu לאינפרא?", "יש לי מקליט ישן, מה אפשר לשדרג?", "אתם גם מתקינים?"];

/** ההודעה ה"לא נקראה" של טל: תלויה בדף שבו הלקוח נמצא ובכמה דפים כבר ראה */
function nudgeFor(page: string | undefined, pagesSeen: number): string {
  if (page && page !== "store" && page !== "finder") {
    const p = storeProducts.find((x) => x.slug === page);
    if (p) {
      const a = attrsOf(p);
      if (isCamera(a) && a.night === "hybrid") return `רואה שאתה מסתכל על ${p.model}. זו מצלמה היברידית: אינפרא בשגרה, ואור לבן וצבע רק כשיש תנועה. רוצה שאסביר מתי זה עדיף על ColorVu מלא?`;
      if (isCamera(a) && a.night === "color") return `${p.model} נותנת צבע מלא גם בלילה, אבל האור שלה דולק כל הלילה. רוצה לשמוע אם זה מתאים למקום שלך או שעדיף היברידית?`;
      if (isCamera(a)) return `יש לי כמה דברים לספר על ${p.model} שלא כתובים במפרט. למשל איפה היא באמת מתאימה ומה ההבדל מהדגם הזול יותר. לשאול?`;
      if (isRecorder(a)) return `מקליט זה החלק שהכי קל לטעות בו: ערוצים, PoE ודיסק. רוצה שאבדוק איתך ב-30 שניות שה-${p.model} מתאים למספר המצלמות שלך?`;
      if (a.kind === "kit") return "הערכה הזאת מגיעה עם מקליט, דיסק וכבלים. אם תגיד לי מה אתה מאבטח, אגיד לך אם היא הבחירה הנכונה או שיש משהו מתאים יותר.";
      return `יש לך שאלה על ${p.model}? אני מכיר את כל הדגמים כאן ועונה מיד.`;
    }
  }
  if (page === "finder") return "אם השאלון לא מכסה את המקרה שלך, אפשר פשוט לכתוב לי במילים שלך מה יש ומה צריך.";
  if (pagesSeen >= 3) return "ראיתי שאתה מסתובב כבר כמה דקות בין המוצרים. תגיד לי מה אתה מאבטח, ואני אצמצם לך את זה לשניים-שלושה דגמים.";
  return "היי, אני טל. אם תגיד לי מה אתה מאבטח וכמה נקודות, אגיד לך תוך דקה מה מתאים ומה זה יעלה.";
}

const nis = (v: number) => v.toLocaleString("he-IL");

/** קישורים בתוך טקסט של טל: כתובות מלאות ונתיבים באתר (/products/go, /packages) הופכים ללחיצים */
const LINK_RE = /(https?:\/\/[^\s)]+|(?<![\w/])\/(?:store|products|packages|pricing|contact|blog|about|locations|use-cases|cloud-backup|weatherproof|video-quality)(?:[\w\-/#]*)?)/g;
function renderText(text: string) {
  const parts = text.split(LINK_RE);
  return parts.map((part, i) => {
    if (!part) return null;
    if (/^https?:\/\//.test(part)) {
      const clean = part.replace(/[.,;:]+$/, "");
      return <a key={i} href={clean} target="_blank" rel="noopener noreferrer">{clean.replace(/^https?:\/\//, "")}</a>;
    }
    if (part.startsWith("/")) return <Link key={i} href={part.replace(/[.,;:]+$/, "")}>{part}</Link>;
    return <span key={i}>{part}</span>;
  });
}

export function StoreChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const leadTracked = useRef(false);

  const page = pathname?.startsWith("/store/") ? pathname.slice("/store/".length) : pathname === "/store" ? "store" : undefined;

  // "הודעה שלא נקראה" מטל: אחרי שיטוט קצר (דף שני, או 12 שניות בדף הראשון), פעם אחת בסשן.
  // התוכן תלוי בדף: על מצלמה היברידית טל מציע להסביר לילה, על מקליט לבדוק ערוצים וכו'.
  useEffect(() => {
    if (open) return;
    let seen = 0, shown = false;
    try { seen = Number(sessionStorage.getItem("sc-pages") || 0) + 1; sessionStorage.setItem("sc-pages", String(seen)); shown = sessionStorage.getItem("sc-chat-nudged") === "1"; } catch {}
    if (shown) return;
    const delay = seen >= 2 ? 2500 : 12000;
    const t = setTimeout(() => {
      const text = nudgeFor(page, seen);
      setNudge(text);
      setUnread(1);
      setMsgs((m) => (m.length === 1 ? [GREETING, { role: "assistant", content: text }] : m));
      try { sessionStorage.setItem("sc-chat-nudged", "1"); } catch {}
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  useEffect(() => {
    if (open) { setNudge(null); setUnread(0); setTimeout(() => inputRef.current?.focus(), 50); }
    document.body.classList.toggle("sc-chat-open", open);
    return () => { document.body.classList.remove("sc-chat-open"); };
  }, [open]);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    setErr(null);
    const next: Msg[] = [...msgs, { role: "user", content: t }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/store-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1).map(({ role, content }) => ({ role, content })), page, cart: cart.get(), attribution: getAttribution() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה");
      setMsgs((m) => [...m, { role: "assistant", content: data.reply, products: data.products }]);
      if (data.leadCaptured && !leadTracked.current) { leadTracked.current = true; track.chatLead(data.intent); }
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "משהו השתבש. אפשר לנסות שוב או לכתוב לנו בווצאפ.");
    } finally {
      setBusy(false);
    }
  }

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("היי, דיברתי עם העוזר באתר ויש לי שאלה:")}`;

  return (
    <>
      {!open && (
        <div className={c.chatLauncher}>
          {nudge && (
            <button type="button" className={c.chatNudge} onClick={() => setOpen(true)}>
              <b>{NAME} <small>עכשיו</small></b>
              <span>{nudge}</span>
              <em>לענות</em>
            </button>
          )}
          <button type="button" className={c.chatFab} onClick={() => setOpen(true)} aria-label={`פתיחת צ'אט עם ${NAME}${unread ? `, ${unread} הודעה חדשה` : ""}`} id="store-chat-button">
            <img src={AVATAR} alt="" width="44" height="44" />
            {unread > 0 && <i className={c.unread}>{unread}</i>}
            <span>שאלו את {NAME}</span>
          </button>
        </div>
      )}

      {open && (
        <section className={c.chat} role="dialog" aria-label={`צ'אט עם ${NAME}`}>
          <header className={c.chatHead}>
            <img src={AVATAR} alt="" width="40" height="40" />
            <div>
              <b>{NAME}</b>
              <span>עוזר AI של Site-Control · עונה מיד</span>
            </div>
            <button type="button" className={c.chatClose} onClick={() => setOpen(false)}>סגירה</button>
          </header>

          <div className={c.chatList} ref={listRef}>
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? c.msgUser : c.msgBot}>
                <p>{renderText(m.content)}</p>
                {m.products && m.products.length > 0 && (
                  <ul className={c.chatProducts}>
                    {m.products.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/store/${p.slug}`} className={c.chatProd}>
                          {p.image && <img src={p.image} alt="" loading="lazy" />}
                          <span>
                            <b>{productName(p)}</b>
                            <small>{p.title}</small>
                            <em>{p.price ? `${nis(p.price)} ₪` : "מחיר לפי פנייה"}</em>
                          </span>
                        </Link>
                        <button type="button" className={c.chatAdd} onClick={() => { cart.add(p.slug, 1); cart.open(); }}>לעגלה</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {busy && <div className={c.msgBot}><p className={c.typing}><i /><i /><i /></p></div>}
            {err && <p className={c.formErr}>{err} <a href={waHref} target="_blank" rel="noopener noreferrer">ווצאפ</a></p>}
          </div>

          {!msgs.some((m) => m.role === "user") && (
            <div className={c.chatQuick}>
              {QUICK.map((q) => <button key={q} type="button" onClick={() => send(q)}>{q}</button>)}
            </div>
          )}

          <form className={c.chatForm} onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input ref={inputRef} id="store-chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="כתבו שאלה…" maxLength={1500} autoComplete="off" />
            <button type="submit" disabled={busy || !input.trim()}>שליחה</button>
          </form>
          <p className={c.chatFoot}>AI עונה לפי הקטלוג. שאלה שאין לה תשובה עוברת לצוות, ואפשר תמיד <a href={waHref} target="_blank" rel="noopener noreferrer">לדבר איתנו בווצאפ</a>.</p>
        </section>
      )}
    </>
  );
}
