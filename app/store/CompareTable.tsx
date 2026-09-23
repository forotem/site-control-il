import Link from "next/link";
import { storeProducts, type StoreProduct } from "../data/store-catalog";
import { attrsOf, audioLabel, aiLabel, kindLabel, mpLabel, nightShort, isCamera, isRecorder, fitLine, type Attrs } from "../data/store-attrs";
import styles from "./store.module.css";

const nis = (v: number | null) => (v ? `${v.toLocaleString("he-IL")} ₪` : "לפי פנייה");
const yes = (b?: boolean) => (b ? "כן" : "לא");

type Row = { label: string; value: (p: StoreProduct, a: Attrs) => string };

function rowsFor(a: Attrs): Row[] {
  if (isCamera(a)) {
    return [
      { label: "מחיר", value: (p) => nis(p.price) },
      { label: "גוף", value: (_, a) => kindLabel[a.kind] },
      { label: "רזולוציה", value: (_, a) => mpLabel(a.mp) },
      { label: "בלילה", value: (_, a) => (a.night ? nightShort[a.night] : "") },
      { label: "טווח תאורה", value: (_, a) => (a.range ? `${a.range} מ'` : "") },
      { label: "חיישן גדול 1/1.8\"", value: (_, a) => yes(a.wideSensor) },
      { label: "שמע", value: (_, a) => audioLabel[a.audio || "none"] },
      { label: "סינון התראות", value: (_, a) => aiLabel[a.ai || "none"] },
      { label: "הרתעה (אור וסירנה)", value: (_, a) => yes(a.deter) },
      { label: "עדשה מתכווננת", value: (_, a) => yes(a.varifocal) },
      { label: "כרטיס זיכרון", value: (_, a) => yes(a.sd) },
      { label: "מתאים ל", value: (p) => fitLine(p) },
    ];
  }
  if (isRecorder(a)) {
    return [
      { label: "מחיר", value: (p) => nis(p.price) },
      { label: "סוג", value: (_, a) => kindLabel[a.kind] },
      { label: "ערוצים", value: (_, a) => (a.channels ? `${a.channels}` : "") },
      { label: "PoE מובנה", value: (_, a) => (a.poePorts ? `${a.poePorts} יציאות` : "לא, נדרש מתג") },
      { label: "דיסקים", value: (_, a) => `${a.bays || 1}` },
      { label: "רזולוציה מקסימלית", value: (_, a) => (a.maxMp ? `${a.maxMp}MP` : "") },
      { label: "סינון אדם/רכב", value: (_, a) => (a.ai === "acusense" ? "כן" : "לא") },
      { label: "מתאים ל", value: (p) => fitLine(p) },
    ];
  }
  if (a.kind === "kit") {
    return [
      { label: "מחיר", value: (p) => nis(p.price) },
      { label: "מצלמות", value: (_, a) => `${a.cams} x ${mpLabel(a.mp)}` },
      { label: "גוף המצלמה", value: (p) => (/כיפה/.test(p.title) ? "כיפה" : "צינור") },
      { label: "בלילה", value: (_, a) => (a.night ? nightShort[a.night] : "") },
      { label: "שמע", value: (_, a) => audioLabel[a.audio || "none"] },
      { label: "מקליט", value: (_, a) => `${a.channels} ערוצים PoE, דיסק ${a.hdd}` },
    ];
  }
  // אינטרקום ובקרת כניסה
  const wiring: Record<string, string> = { ip: "IP (כבל רשת)", "2wire": "2 גידים", "4wire": "4 גידים", hybrid: "2 גידים + Wi-Fi", standalone: "עצמאי", other: "" };
  const auth: Record<string, string> = { face: "פנים", finger: "טביעת אצבע", card: "כרטיס/תג", code: "קוד", qr: "QR" };
  return [
    { label: "מחיר", value: (p) => nis(p.price) },
    { label: "סוג", value: (_, a) => kindLabel[a.kind] },
    { label: "חיווט", value: (_, a) => wiring[a.wiring || "other"] },
    { label: "מענה מהנייד", value: (_, a) => yes(a.app) },
    { label: "פתיחה באמצעות", value: (_, a) => (a.auth || []).map((x) => auth[x] || x).join(", ") || "לחצן" },
    { label: "מתאים ל", value: (p) => fitLine(p) },
  ];
}

export function CompareTable({ slugs, title, note, highlight }: { slugs: string[]; title?: string; note?: string; highlight?: string }) {
  const products = slugs.map((s) => storeProducts.find((p) => p.slug === s)).filter(Boolean) as StoreProduct[];
  if (products.length < 2) return null;
  const rows = rowsFor(attrsOf(products[0]));
  const cells = rows.map((r) => products.map((p) => r.value(p, attrsOf(p))));
  return (
    <div className={styles.compare}>
      {title && <h3>{title}</h3>}
      {note && <p className={styles.compareNote}>{note}</p>}
      <div className={styles.compareScroll}>
        <table>
          <thead>
            <tr>
              <th scope="col"></th>
              {products.map((p) => (
                <th key={p.slug} scope="col" className={p.slug === highlight ? styles.compareMe : undefined}>
                  <Link href={`/store/${p.slug}`} prefetch={false}>
                    {p.image && <img src={p.image} alt="" loading="lazy" />}
                    <span>{p.model}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const differs = new Set(cells[i]).size > 1;
              return (
                <tr key={r.label} className={differs ? styles.compareDiff : undefined}>
                  <th scope="row">{r.label}</th>
                  {products.map((p, j) => (
                    <td key={p.slug} className={p.slug === highlight ? styles.compareMe : undefined}>{cells[i][j] || "–"}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
