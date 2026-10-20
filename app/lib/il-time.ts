// שעון ישראל, שבת וחג: משותף לטל בווצאפ (/api/whatsapp/bot) ולהודעות הפתיחה (app/lib/opening.ts).

// ימי חג בישראל (שבתון) עד סוף 2027. ערב חג כמו שישי.
export const CHAG = ["2026-10-03", "2027-04-22", "2027-04-28", "2027-06-11", "2027-10-02", "2027-10-03", "2027-10-11", "2027-10-16", "2027-10-23"];
export const il = (d: Date, opts: Intl.DateTimeFormatOptions, locale = "en-US") => new Intl.DateTimeFormat(locale, { timeZone: "Asia/Jerusalem", ...opts }).format(d);
export const dayIL = (d: Date) => il(d, { year: "numeric", month: "2-digit", day: "2-digit" }, "en-CA");
export const hourIL = (d: Date) => Number(il(d, { hour: "numeric", hour12: false })) % 24;

/** שבת או חג: שישי/ערב חג מ-16:00 עד מוצאי שבת/חג 20:00 */
export function restDay(now = new Date()): boolean {
  const wd = il(now, { weekday: "short" });
  const hour = hourIL(now);
  const today = dayIL(now);
  const tomorrow = dayIL(new Date(now.getTime() + 24 * 3600 * 1000));
  const eve = wd === "Fri" || CHAG.includes(tomorrow);
  const holy = wd === "Sat" || CHAG.includes(today);
  return (eve && hour >= 16) || (holy && hour < 20);
}
