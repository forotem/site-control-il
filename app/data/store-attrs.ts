// מאפיינים מובנים לכל מוצר בחנות, לצורך שבבי מידע בכרטיסים, טבלאות השוואה ו"מצא לי מוצר".
// נגזר מהכותרות והמפרטים בקטלוג (23/09/2026) ונבדק ידנית. אם מוסיפים מוצר: להוסיף שורה כאן.
import { storeProducts, type StoreProduct } from "./store-catalog";

export type Kind =
  | "bullet" | "turret" | "dome" | "fisheye" | "pt" | "lpr" | "camera"
  | "nvr" | "dvr" | "xvr" | "kit"
  | "intercom-kit" | "door-panel" | "monitor" | "terminal" | "keypad" | "accessory"
  | "wifi-pt" | "wifi-bullet";
export type Night = "ir" | "color" | "hybrid";
export type Audio = "none" | "mic" | "two-way";
export type Ai = "none" | "human-vehicle" | "acusense";

export type Attrs = {
  kind: Kind; mp?: number; night?: Night; range?: number; audio?: Audio; ai?: Ai;
  deter?: boolean; varifocal?: boolean; sd?: boolean; wideSensor?: boolean; angle?: number; ik10?: boolean; wifi?: boolean;
  channels?: number; bays?: number; poePorts?: number; maxMp?: number; hdd?: string; cams?: number;
  wiring?: "ip" | "2wire" | "4wire" | "hybrid" | "standalone" | "other"; app?: boolean; buttons?: number; auth?: string[];
};

export const storeAttrs: Record<string, Attrs> = {
  "ds-kis607-s": {"kind":"intercom-kit","wiring":"ip","app":true,"auth":["card"],"mp":2},
  "ds-kis212": {"kind":"intercom-kit","wiring":"4wire","app":false,"auth":[],"mp":2},
  "ds-kv8213-wme1": {"kind":"door-panel","mp":2,"wiring":"ip","app":true,"buttons":2,"auth":["card"]},
  "ds-kv8413-wme1": {"kind":"door-panel","mp":2,"wiring":"ip","app":true,"buttons":4,"auth":["card"]},
  "ds-kv6124-wbe1": {"kind":"door-panel","mp":4,"wiring":"ip","app":true,"auth":["card","code"]},
  "ds-kh6350-wte1": {"kind":"monitor","wiring":"ip","app":true,"auth":[]},
  "ds-k1t502dbfwx-c": {"kind":"terminal","wiring":"ip","app":true,"auth":["finger","card","code","qr"]},
  "ds-k1t344ebfwx-e1": {"kind":"terminal","wiring":"ip","app":true,"auth":["face","finger","card","code"]},
  "ds-k1t323mbfwx-e1": {"kind":"terminal","wiring":"ip","app":true,"auth":["face","finger","card","code"]},
  "ds-k1t671m": {"kind":"terminal","wiring":"ip","app":true,"auth":["face","card"]},
  "ds-7632nxi-k2": {"kind":"nvr","mp":8,"channels":32,"bays":2,"poePorts":0,"maxMp":12,"ai":"acusense"},
  "ds-7616nxi-k2": {"kind":"nvr","mp":8,"channels":16,"bays":2,"poePorts":0,"maxMp":12,"ai":"acusense"},
  "ds-7616nxi-k1": {"kind":"nvr","mp":8,"channels":16,"bays":1,"poePorts":0,"maxMp":12,"ai":"acusense"},
  "ds-7608nxi-k1-8p": {"kind":"nvr","mp":8,"channels":8,"bays":1,"poePorts":8,"maxMp":12,"ai":"acusense"},
  "ids-7232hqhi-m2-xt": {"kind":"dvr","channels":32,"bays":2,"poePorts":0,"maxMp":8,"ai":"acusense"},
  "ids-7216hqhi-m1-xt": {"kind":"dvr","channels":16,"bays":1,"poePorts":0,"ai":"acusense"},
  "ids-7208hqhi-m1-xt": {"kind":"dvr","channels":8,"bays":1,"poePorts":0,"ai":"acusense"},
  "ids-7204hqhi-m1-xt": {"kind":"dvr","channels":4,"bays":1,"poePorts":0,"ai":"acusense"},
  "ds-2cd2t87g2h-lisu-sl-2-8mm": {"kind":"bullet","mp":8,"night":"hybrid","range":60,"audio":"two-way","ai":"acusense","deter":true,"varifocal":false,"sd":true,"wideSensor":true,"ik10":false},
  "ds-2cd2087g2h-liu-sl-2-8mm": {"kind":"bullet","mp":8,"night":"hybrid","range":40,"audio":"two-way","ai":"acusense","deter":true,"varifocal":false,"sd":true,"wideSensor":true,"ik10":false},
  "hwi-b180ha-lu-2-8mm": {"kind":"bullet","mp":8,"night":"hybrid","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"angle":113,"ik10":false},
  "hwi-t280ha-lu-2-8mm": {"kind":"turret","mp":8,"night":"hybrid","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"ik10":false},
  "ipc3628le-adf28k-wp": {"kind":"turret","mp":8,"night":"color","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":true,"angle":111,"ik10":false},
  "ipc2318le-adf28km-wp": {"kind":"bullet","mp":8,"night":"color","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":true,"angle":111,"ik10":false},
  "ipc3626le-adf28k-wp": {"kind":"turret","mp":6,"night":"color","range":30,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":true,"wideSensor":true,"angle":110,"ik10":false},
  "ipc2316le-adf28km-wp": {"kind":"bullet","mp":6,"night":"color","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":true,"ik10":false},
  "ipc3614lb-af28k-dl2": {"kind":"turret","mp":4,"night":"hybrid","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":93,"ik10":false},
  "ipc2124lb-af28k-dl2": {"kind":"bullet","mp":4,"night":"hybrid","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":93,"ik10":false},
  "ipc3524le-adf28k-wp": {"kind":"dome","mp":4,"night":"color","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":true,"angle":124,"ik10":true},
  "ipc3615le-adf28k-g": {"kind":"turret","mp":5,"night":"ir","range":30,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"ik10":false},
  "nvr302-32b-iq": {"kind":"nvr","mp":12,"channels":32,"bays":2,"poePorts":0,"maxMp":12,"ai":"acusense"},
  "nvr301-08s3": {"kind":"nvr","mp":8,"channels":8,"bays":1,"poePorts":0,"maxMp":8,"ai":"none"},
  "uac-b125-af28lm": {"kind":"bullet","mp":5,"night":"ir","range":40,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"angle":109,"ik10":false},
  "uac-t125-af28lm": {"kind":"turret","mp":5,"night":"ir","range":40,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"angle":109,"ik10":false},
  "xvr301-04g3": {"kind":"xvr","mp":5,"channels":4,"bays":1,"poePorts":0,"maxMp":5,"ai":"none"},
  "xvr301-08g3": {"kind":"xvr","mp":5,"channels":8,"bays":1,"poePorts":0,"maxMp":5,"ai":"none"},
  "visionnet-k-560820": {"kind":"keypad","wiring":"standalone","app":false,"auth":["card","code"]},
  "visionnet-kitcom-2-wire-villa-kit-560789": {"kind":"intercom-kit","wiring":"2wire","app":true,"auth":["card"]},
  "visionnet-dh-hybrid-kit-560171": {"kind":"intercom-kit","wiring":"hybrid","app":true,"auth":["card"]},
  "visionnet-2tl-17-560580": {"kind":"monitor","wiring":"2wire","app":false,"auth":["card"]},
  "visionnet-dh-wi-fi-monitor-560975": {"kind":"monitor","wiring":"hybrid","app":true,"auth":["card"]},
  "visionnet-2tl-821-t5-560892": {"kind":"door-panel","wiring":"2wire","app":false,"auth":["face","card","code"]},
  "visionnet-2tl-607fe-id-s2-560075": {"kind":"door-panel","wiring":"2wire","app":false,"buttons":2,"auth":["card"]},
  "rain-roof-for-keypads-560878": {"kind":"accessory","wiring":"other","app":false,"auth":[]},
  "reolink-rlk8-820d4-a": {"kind":"kit","mp":8,"night":"ir","range":30,"audio":"none","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"ik10":false,"channels":8,"poePorts":8,"hdd":"2TB","cams":4},
  "reolink-rlk8-810b4-a-rlk8-800b4": {"kind":"kit","mp":8,"night":"ir","range":30,"audio":"none","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"angle":87,"ik10":false,"channels":8,"poePorts":8,"hdd":"2TB","cams":4},
  "reolink-rlk8-410b4-5mp": {"kind":"kit","mp":5,"night":"ir","range":30,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"ik10":false,"channels":8,"poePorts":8,"hdd":"2TB","cams":4},
  "reolink-rlk8-1200b4-a": {"kind":"kit","mp":12,"night":"color","range":30,"audio":"two-way","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"ik10":false,"channels":8,"poePorts":8,"hdd":"2TB","cams":4},
  "reolink-rlk8-1200d4-a": {"kind":"kit","mp":12,"night":"color","range":30,"audio":"two-way","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"ik10":false,"channels":8,"poePorts":8,"hdd":"2TB","cams":4},
  "ds-2cd1343g2-liu-2-8mm": {"kind":"dome","mp":4,"night":"hybrid","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":100,"ik10":false},
  "ds-2cd1t47g2-luf-4mm": {"kind":"bullet","mp":4,"night":"color","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":75,"ik10":false},
  "ds-2cd2043g2-iu-2-8mm": {"kind":"bullet","mp":4,"night":"ir","range":40,"audio":"mic","ai":"acusense","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":103,"ik10":false},
  "ds-2cd2047g2h-liu-sl-2-8mm": {"kind":"bullet","mp":4,"night":"hybrid","range":40,"audio":"two-way","ai":"acusense","deter":true,"varifocal":false,"sd":true,"wideSensor":true,"angle":111,"ik10":false},
  "ds-2cd1047g2-luf-2-8mm": {"kind":"bullet","mp":4,"night":"color","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":96,"ik10":false},
  "ds-2cd1043g2-liu-2-8mm": {"kind":"bullet","mp":4,"night":"hybrid","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":100,"ik10":false},
  "ds-2cd1643g2-lizu-2-8-12mm": {"kind":"bullet","mp":4,"night":"hybrid","range":50,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":true,"sd":true,"wideSensor":false,"angle":96,"ik10":false},
  "ds-2cd2t43g2-4li2u-2-8mm": {"kind":"bullet","mp":4,"night":"hybrid","range":80,"audio":"two-way","ai":"acusense","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":103,"ik10":false},
  "ds-2cd2t47g2h-li-2-8mm": {"kind":"bullet","mp":4,"night":"hybrid","range":60,"audio":"mic","ai":"acusense","deter":false,"varifocal":false,"sd":true,"wideSensor":true,"ik10":false},
  "ds-2cd1743g2-lizu-2-8-12mm": {"kind":"dome","mp":4,"night":"hybrid","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":true,"sd":true,"wideSensor":false,"ik10":false},
  "ds-2cd1143g2-liu-2-8mm": {"kind":"dome","mp":4,"night":"hybrid","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"angle":110,"ik10":true},
  "ds-2cd1347g2-luf-2-8mm": {"kind":"turret","mp":4,"night":"color","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"ik10":false},
  "ds-2cd2143g2-i-2-8mm": {"kind":"dome","mp":4,"night":"ir","range":30,"audio":"none","ai":"acusense","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"ik10":true},
  "ds-2cd2143g2-iu-2-8mm": {"kind":"dome","mp":4,"night":"ir","range":30,"audio":"mic","ai":"acusense","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"ik10":true},
  "ds-2cd2347g1-l-4mm": {"kind":"turret","mp":4,"night":"color","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":true,"angle":94,"ik10":false},
  "ds-2cd1p47g2-luf-2-8mm": {"kind":"pt","mp":4,"night":"color","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":96,"ik10":false},
  "ds-2cd2183g2-iu-2-8mm": {"kind":"dome","mp":8,"night":"ir","range":30,"audio":"mic","ai":"acusense","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":102,"ik10":true},
  "ds-2cd2t87g3-lis2uy-sl-2-8mm": {"kind":"bullet","mp":8,"night":"hybrid","range":60,"audio":"two-way","ai":"acusense","deter":true,"varifocal":false,"sd":true,"wideSensor":true,"ik10":true},
  "ds-2cd1383g0-iuf-2-8mm": {"kind":"turret","mp":8,"night":"ir","range":30,"audio":"mic","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":100,"ik10":false},
  "ds-2cd2955g0-isu-1-05mm": {"kind":"fisheye","mp":5,"night":"ir","range":8,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":180,"ik10":false},
  "ds-2cd1353g0-i-2-8mm": {"kind":"turret","mp":5,"night":"ir","range":30,"audio":"none","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"ik10":false},
  "ds-2cd2387g2h-lisu-sl-2-8mm": {"kind":"turret","mp":8,"night":"hybrid","range":60,"audio":"two-way","ai":"acusense","deter":true,"varifocal":false,"sd":true,"wideSensor":true,"angle":109,"ik10":false},
  "ids-2cd7a46g2-p-izhsy-8-32mm": {"kind":"lpr","mp":4,"night":"ir","range":100,"audio":"none","ai":"none","deter":false,"varifocal":true,"sd":true,"wideSensor":true,"ik10":true},
  "ds-2ce10kf0t-lpfs-2-8mm": {"kind":"bullet","mp":5,"night":"hybrid","range":20,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"angle":105,"ik10":false},
  "ds-2ce10kf0t-fs-3-6mm": {"kind":"bullet","mp":5,"night":"color","range":20,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"angle":80,"ik10":false},
  "ds-2ce12kf0t-lfs-2-8mm": {"kind":"bullet","mp":5,"night":"hybrid","range":40,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"angle":105,"ik10":false},
  "ds-2ce70kf0t-lpfs-2-8mm": {"kind":"turret","mp":5,"night":"hybrid","range":20,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"ik10":false},
  "ds-2ce10df0t-pfs-2-8mm": {"kind":"bullet","mp":2,"night":"color","range":20,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"ik10":false},
  "ds-2ce12uf3t-ls-2-8mm": {"kind":"bullet","mp":8,"night":"hybrid","range":40,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"angle":105,"ik10":false},
  "ds-2ce16u1t-itf-3-6mm": {"kind":"bullet","mp":8,"night":"ir","range":30,"audio":"none","ai":"none","deter":false,"varifocal":false,"sd":false,"wideSensor":false,"ik10":false},
  "ds-2cc52h1t-fits-1-1mm": {"kind":"fisheye","mp":5,"night":"ir","range":20,"audio":"mic","ai":"none","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":180,"ik10":false},
  "ch9": {"kind":"wifi-pt","mp":6,"night":"hybrid","range":30,"audio":"two-way","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":79,"ik10":false,"wifi":true},
  "ch10": {"kind":"wifi-pt","mp":10,"night":"hybrid","range":30,"audio":"two-way","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":83,"ik10":false,"wifi":true},
  "ct3": {"kind":"wifi-bullet","mp":2,"night":"hybrid","range":30,"audio":"two-way","ai":"none","deter":true,"varifocal":false,"sd":true,"wideSensor":false,"angle":85,"ik10":false,"wifi":true},
  "cp3-pro": {"kind":"wifi-pt","mp":3,"night":"ir","range":10,"audio":"two-way","ai":"human-vehicle","deter":false,"varifocal":false,"sd":true,"wideSensor":false,"angle":360,"ik10":false,"wifi":true},
};

export const kindLabel: Record<Kind, string> = {
  bullet: "צינור (Bullet)", turret: "טורט (Turret)", dome: "כיפה (Dome)", fisheye: "עין דג 180°", pt: "ממונעת PT", lpr: "זיהוי לוחיות (LPR)", camera: "מצלמה",
  nvr: "מקליט NVR למצלמות IP", dvr: "מקליט DVR היברידי", xvr: "מקליט XVR היברידי", kit: "ערכה מוכנה",
  "intercom-kit": "ערכת אינטרקום", "door-panel": "פנל כניסה", monitor: "מסך פנימי", terminal: "מסוף זיהוי", keypad: "קודן", accessory: "אביזר",
  "wifi-pt": "Wi-Fi ממונעת", "wifi-bullet": "Wi-Fi צינור",
};
export const nightLabel: Record<Night, string> = { ir: "אינפרא-אדום: שחור-לבן בלילה", color: "צבע מלא 24/7 (אור לבן)", hybrid: "היברידי: צבע או אינפרא לפי בחירה" };
export const nightShort: Record<Night, string> = { ir: "אינפרא בלילה", color: "צבע בלילה", hybrid: "צבע/אינפרא" };
export const audioLabel: Record<Audio, string> = { none: "ללא שמע", mic: "מיקרופון", "two-way": "שמע דו-כיווני" };
export const aiLabel: Record<Ai, string> = { none: "זיהוי תנועה רגיל", "human-vehicle": "מסנן אדם/רכב", acusense: "AcuSense: אדם/רכב בלי התראות שווא" };

export function attrsOf(p: StoreProduct | string): Attrs {
  const slug = typeof p === "string" ? p : p.slug;
  return storeAttrs[slug] || { kind: "camera" };
}
export const CAMERA_KINDS: Kind[] = ["bullet", "turret", "dome", "fisheye", "pt", "lpr", "camera", "wifi-pt", "wifi-bullet"];
export const isCamera = (a: Attrs) => CAMERA_KINDS.includes(a.kind);
export const isRecorder = (a: Attrs) => ["nvr", "dvr", "xvr"].includes(a.kind);
export const mpLabel = (mp?: number) =>
  !mp ? "" : mp >= 12 ? `${mp}MP 4K+` : mp >= 8 ? "8MP 4K" : mp === 6 ? "6MP" : mp === 5 ? "5MP" : mp === 4 ? "4MP" : mp === 3 ? "3MP 2K" : `${mp}MP`;

/** שורת "מתאים ל" קצרה לכרטיס, לפי סוג ומאפיינים */
export function fitLine(p: StoreProduct): string {
  const a = attrsOf(p);
  switch (a.kind) {
    case "bullet":
      if (a.varifocal) return "מרחקים משתנים: שער, כניסה רחוקה, חניון";
      if ((a.range || 0) >= 60) return "שטח גדול: מגרש, חצר ארוכה, מחסן חיצוני";
      if (a.deter) return "אזור רגיש שצריך הרתעה: חניה, מחסן, דלת אחורית";
      return "חוץ: חצר, חניה, קו גדר";
    case "turret": return a.ik10 ? "כניסות ומעברים ציבוריים" : "כניסה לבית, חצר קדמית, חלל פנימי";
    case "dome": return a.ik10 ? "תקרה במקום ציבורי: חדר מדרגות, לובי, חנות" : "תקרת פנים: משרד, חנות, מסדרון";
    case "fisheye": return "חלל שלם במצלמה אחת: חנות, משרד פתוח, אולם";
    case "pt": return "כיוון מרחוק: חצר גדולה, מחסן, מגרש";
    case "lpr": return "חניון, שער ומחסום: קריאת לוחיות רישוי";
    case "wifi-pt": return a.mp && a.mp <= 3 ? "פנים הבית: סלון, חדר ילדים, חיות מחמד" : "חצר של בית פרטי בלי כבלים, חשמל בלבד";
    case "wifi-bullet": return "נקודה אחת בחוץ בלי מקליט, חשמל בלבד";
    case "nvr": return a.poePorts ? `עד ${a.channels} מצלמות IP, בלי מתג נפרד` : `עד ${a.channels} מצלמות IP (נדרש מתג PoE)`;
    case "dvr": case "xvr": return `שדרוג מערכת קואקס קיימת, עד ${a.channels} מצלמות`;
    case "kit": return "בית או עסק קטן: 4 מצלמות, מקליט ודיסק, מוכן להתקנה";
    case "intercom-kit": return a.wiring === "ip" ? "בית פרטי חדש: תשתית רשת, מענה מהנייד" : a.wiring === "hybrid" ? "בית פרטי: 2 גידים קיימים + מענה מהנייד" : "החלפת אינטרקום ישן: אותם 2 גידים";
    case "door-panel": return (a.buttons || 1) >= 4 || /821|T5/.test(p.model) ? "בניין משותף" : (a.buttons || 1) === 2 ? "בית דו-משפחתי" : "בית פרטי";
    case "monitor": return "מסך נוסף לדירה או להחלפה";
    case "terminal": return a.auth?.includes("face") ? "עסק: כניסת עובדים ונוכחות בזיהוי פנים" : "עסק: דלת עובדים באצבע, כרטיס או קוד";
    case "keypad": return "שער או דלת: קוד ותג, עמיד לחוץ";
    case "accessory": return "משלים לקודן חיצוני: הגנה מגשם ושמש";
    default: return "";
  }
}

/** רמת המוצר בתוך הסוג שלו, לצורך תצוגת "בסיסי / משודרג / פרימיום" */
export function tierOf(p: StoreProduct): "basic" | "plus" | "pro" {
  const a = attrsOf(p);
  if (isCamera(a)) {
    if (a.deter || ((a.mp || 0) >= 8 && a.wideSensor) || a.kind === "lpr") return "pro";
    if (a.wideSensor || a.night === "color" || a.varifocal || (a.mp || 0) >= 8) return "plus";
    return "basic";
  }
  return "plus";
}
export const tierLabel = { basic: "בסיסי", plus: "משודרג", pro: "פרימיום" } as const;

export function productsByKind(kind: Kind) { return storeProducts.filter((p) => attrsOf(p).kind === kind); }
