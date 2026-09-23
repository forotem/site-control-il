import Link from "next/link";
import type { StoreProduct } from "../data/store-catalog";
import { attrsOf, mpLabel, nightShort, fitLine, isCamera } from "../data/store-attrs";
import styles from "./store.module.css";

const nis = (v: number) => v.toLocaleString("he-IL");

/** שבבי מידע שמבדילים בין דגמים דומים במבט אחד */
export function SpecChips({ p, max = 4 }: { p: StoreProduct; max?: number }) {
  const a = attrsOf(p);
  const chips: { text: string; cls?: string }[] = [];
  if (isCamera(a)) {
    if (a.mp) chips.push({ text: mpLabel(a.mp) });
    if (a.night) chips.push({ text: nightShort[a.night], cls: a.night === "color" ? styles.chipColor : a.night === "hybrid" ? styles.chipHybrid : styles.chipIr });
    if (a.deter) chips.push({ text: "אור + סירנה", cls: styles.chipDeter });
    else if (a.ai === "acusense") chips.push({ text: "AcuSense" });
    else if (a.ai === "human-vehicle") chips.push({ text: "אדם/רכב" });
    if (a.audio === "two-way") chips.push({ text: "דיבור דו-כיווני" });
    else if (a.audio === "mic") chips.push({ text: "מיקרופון" });
    if (a.varifocal) chips.push({ text: "זום אופטי" });
    if (a.wifi) chips.push({ text: "Wi-Fi" });
  } else if (a.kind === "nvr" || a.kind === "dvr" || a.kind === "xvr") {
    if (a.channels) chips.push({ text: `${a.channels} ערוצים` });
    chips.push({ text: a.kind === "nvr" ? "למצלמות IP" : "קואקס + IP" });
    if (a.poePorts) chips.push({ text: "PoE מובנה" });
    if (a.bays === 2) chips.push({ text: "2 דיסקים" });
    if (a.ai === "acusense") chips.push({ text: "AcuSense" });
  } else if (a.kind === "kit") {
    chips.push({ text: `${a.cams} מצלמות ${mpLabel(a.mp)}` });
    chips.push({ text: `דיסק ${a.hdd}` });
    if (a.night === "color") chips.push({ text: "צבע בלילה", cls: styles.chipColor });
  } else {
    const wiring: Record<string, string> = { ip: "IP", "2wire": "2 גידים", "4wire": "4 גידים", hybrid: "2 גידים + Wi-Fi" };
    if (a.wiring && wiring[a.wiring]) chips.push({ text: wiring[a.wiring] });
    if (a.app) chips.push({ text: "מענה מהנייד" });
    if (a.auth?.includes("face")) chips.push({ text: "זיהוי פנים" });
    else if (a.auth?.includes("finger")) chips.push({ text: "טביעת אצבע" });
    else if (a.auth?.includes("code")) chips.push({ text: "קודן" });
  }
  if (!chips.length) return null;
  return (
    <span className={styles.chips}>
      {chips.slice(0, max).map((c) => <i key={c.text} className={`${styles.chip} ${c.cls || ""}`}>{c.text}</i>)}
    </span>
  );
}

export function ProductCard({ p }: { p: StoreProduct }) {
  const fit = fitLine(p);
  return (
    <Link href={`/store/${p.slug}`} className={styles.card} prefetch={false}>
      {p.image ? (
        <div className={styles.thumb}><img src={p.image} alt={p.title} loading="lazy" /></div>
      ) : (
        <div className={styles.thumbEmpty} aria-hidden>{p.brand.split(" ")[0]}</div>
      )}
      <div className={styles.body}>
        <span className={styles.brand}>{p.brand} <span className={styles.model}>{p.model}</span></span>
        <span className={styles.title}>{p.title}</span>
        <SpecChips p={p} />
        {fit && <span className={styles.fit}>{fit}</span>}
        <div className={styles.priceRow}>
          {p.price ? <span className={styles.price}>{nis(p.price)} ₪<small>כולל מע״מ</small></span> : <span className={styles.ask}>מחיר לפי פנייה</span>}
          {p.oldStock && <span className={styles.badge}>מבצע חיסול</span>}
        </div>
      </div>
    </Link>
  );
}
