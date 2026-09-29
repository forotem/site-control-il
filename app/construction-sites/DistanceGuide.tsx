"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./offer.module.css";

export type GuideGoal = { id: string; label: string; short: string; ppm: number; object: "person" | "plate" | "face" };
export type GuideCamera = { slug: string; name: string; image: string | null; lenses: { label: string; hres: number; hfov: number }[] };

/** פיקסלים למטר במרחק d, לפי רזולוציה אופקית וזווית אופקית: hres / רוחב השטח שהעדשה רואה */
const ppmAt = (hres: number, hfov: number, d: number) => hres / (2 * d * Math.tan((hfov * Math.PI) / 360));
const bestLens = (c: GuideCamera, d: number) =>
  c.lenses.map((l) => ({ ...l, ppm: ppmAt(l.hres, l.hfov, d) })).sort((a, b) => b.ppm - a.ppm)[0];
const maxDistance = (c: GuideCamera, ppm: number) =>
  Math.max(...c.lenses.map((l) => l.hres / (2 * ppm * Math.tan((l.hfov * Math.PI) / 360))));

/** מצייר את האובייקט ברזולוציה שהמצלמה באמת מקבלת במרחק הזה, ואז מגדיל בלי החלקה: רואים את מה שהמצלמה רואה */
function draw(canvas: HTMLCanvasElement, object: GuideGoal["object"], ppm: number) {
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext("2d")!;
  // גודל אמיתי של האובייקט במטרים: לוחית 52 ס"מ, פנים 16 ס"מ, אדם 1.75 מ' גובה
  const realW = object === "plate" ? 0.52 : object === "face" ? 0.16 : 0.6;
  const realH = object === "plate" ? 0.11 : object === "face" ? 0.22 : 1.75;
  const pw = Math.max(1, Math.round(ppm * realW)), ph = Math.max(1, Math.round(ppm * realH));
  const small = document.createElement("canvas");
  small.width = pw; small.height = ph;
  const s = small.getContext("2d")!;
  if (object === "plate") {
    s.fillStyle = "#f6c700"; s.fillRect(0, 0, pw, ph);
    s.fillStyle = "#1c3f94"; s.fillRect(0, 0, Math.max(1, pw * 0.11), ph);
    s.fillStyle = "#111"; s.font = `bold ${Math.max(1, ph * 0.72)}px Arial`; s.textAlign = "center"; s.textBaseline = "middle";
    s.fillText("12-345-67", pw * 0.56, ph * 0.55);
  } else if (object === "face") {
    s.fillStyle = "#3a2a22"; s.fillRect(0, 0, pw, ph);
    s.fillStyle = "#e0ac86"; s.beginPath(); s.ellipse(pw / 2, ph * 0.55, pw * 0.42, ph * 0.42, 0, 0, Math.PI * 2); s.fill();
    s.fillStyle = "#2b1b12"; s.fillRect(pw * 0.18, ph * 0.08, pw * 0.64, ph * 0.18);
    s.fillStyle = "#1a1a1a"; s.beginPath(); s.arc(pw * 0.36, ph * 0.5, Math.max(0.5, pw * 0.06), 0, Math.PI * 2); s.arc(pw * 0.64, ph * 0.5, Math.max(0.5, pw * 0.06), 0, Math.PI * 2); s.fill();
    s.strokeStyle = "#8a4b3a"; s.lineWidth = Math.max(0.5, pw * 0.04); s.beginPath(); s.moveTo(pw * 0.5, ph * 0.52); s.lineTo(pw * 0.46, ph * 0.66); s.lineTo(pw * 0.52, ph * 0.67); s.stroke();
    s.beginPath(); s.moveTo(pw * 0.38, ph * 0.78); s.quadraticCurveTo(pw * 0.5, ph * 0.84, pw * 0.62, ph * 0.78); s.stroke();
  } else {
    s.fillStyle = "#5b6b7c"; s.fillRect(0, 0, pw, ph);
    s.fillStyle = "#111"; s.beginPath(); s.arc(pw / 2, ph * 0.1, Math.max(0.5, pw * 0.16), 0, Math.PI * 2); s.fill();
    s.fillStyle = "#e8702a"; s.fillRect(pw * 0.22, ph * 0.18, pw * 0.56, ph * 0.38); // אפוד זוהר
    s.fillStyle = "#222"; s.fillRect(pw * 0.26, ph * 0.56, pw * 0.2, ph * 0.44); s.fillRect(pw * 0.54, ph * 0.56, pw * 0.2, ph * 0.44);
  }
  ctx.fillStyle = "#0c1220"; ctx.fillRect(0, 0, W, H);
  const scale = Math.min((W * 0.9) / pw, (H * 0.9) / ph);
  const dw = pw * scale, dh = ph * scale;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, (W - dw) / 2, (H - dh) / 2, dw, dh);
}

/** מדריך המרחקים: מה רוצים לראות, באיזה מרחק, ואיזו מצלמה עומדת בזה. חישוב לפי צפיפות פיקסלים (תקן EN 62676-4) */
export function DistanceGuide({ goals, cameras }: { goals: GuideGoal[]; cameras: GuideCamera[] }) {
  const [goalId, setGoalId] = useState(goals[0].id);
  const [d, setD] = useState(12);
  const goal = goals.find((g) => g.id === goalId)!;
  const rows = cameras.map((c) => {
    const lens = bestLens(c, d);
    return { c, lens, ok: lens.ppm >= goal.ppm, max: maxDistance(c, goal.ppm) };
  });
  const shown = rows.filter((r) => r.ok).sort((a, b) => a.lens.ppm - b.lens.ppm)[0] || [...rows].sort((a, b) => b.lens.ppm - a.lens.ppm)[0];
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { if (ref.current) draw(ref.current, goal.object, shown.lens.ppm); }, [goal.object, shown.lens.ppm]);

  return (
    <div className={styles.guide}>
      <div className={styles.controls} role="group" aria-label="מה רוצים לראות ובאיזה מרחק">
        <div className={styles.control}>
          <span>מה חשוב לכם לראות?</span>
          <div className={styles.seg}>
            {goals.map((g) => (
              <button key={g.id} type="button" aria-pressed={goalId === g.id} onClick={() => setGoalId(g.id)}>{g.short}</button>
            ))}
          </div>
        </div>
        <div className={styles.control}>
          <span>מרחק מהמצלמה: <b>{d} מטר</b></span>
          <input className={styles.range} type="range" min={3} max={40} step={1} value={d} onChange={(e) => setD(Number(e.target.value))} aria-label="מרחק במטרים" />
        </div>
      </div>

      <div className={styles.guideBody}>
        <figure className={styles.preview}>
          <canvas ref={ref} width={320} height={200} />
          <figcaption>
            ככה <b>{shown.c.name}</b>{shown.c.lenses.length > 1 ? ` (${shown.lens.label})` : ""} תראה {goal.object === "plate" ? "לוחית רישוי" : goal.object === "face" ? "פנים" : "אדם"} מ-{d} מטר ביום: {Math.round(shown.lens.ppm)} פיקסלים למטר.
          </figcaption>
        </figure>
        <ul className={styles.verdicts}>
          {rows.map((r) => (
            <li key={r.c.slug} className={r.ok ? styles.ok : styles.no}>
              {r.c.image && <img src={r.c.image} alt="" loading="lazy" />}
              <div>
                <b>{r.c.name}</b>
                <span>{r.ok ? "מתאימה למרחק הזה" : "רחוק מדי בשביל זה"} · עד כ-{Math.floor(r.max)} מ׳ ל{goal.label}</span>
              </div>
              <i aria-hidden="true">{r.ok ? "✓" : "✕"}</i>
            </li>
          ))}
        </ul>
      </div>
      <p className={styles.note}>
        החישוב לפי הרזולוציה והזווית של כל מצלמה ולפי צפיפות הפיקסלים שהתקן האירופי לטלוויזיה במעגל סגור (EN 62676-4) דורש: {goals.map((g) => `${g.short} ${g.ppm}`).join(", ")} פיקסלים למטר.
        זה ביום ובתנאים טובים. בלילה, בגשם או כשהמטרה זזה מהר, הטווח קטן. במצלמות הסוללה חיישן התנועה מתחיל הקלטה ממרחק של עד כ-10 מטרים, ולכן מציבים את המצלמה קרוב למקום שחשוב לכם: שער, מחסן או קונטיינר.
      </p>
    </div>
  );
}
