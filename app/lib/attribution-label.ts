// צד שרת: הופך את אובייקט המקור שהדפדפן שלח לשורה קריאה בהתראה לצוות.
// מזהה הקליק מופיע בשורה נפרדת כדי שאפשר יהיה להעתיק אותו לגיליון הלידים (העלאת המרות אופליין לגוגל או למטא).
export function attributionLabel(raw: unknown): string {
  if (!raw || typeof raw !== 'object') return 'לא ידוע';
  const a = raw as Record<string, unknown>;
  const s = (v: unknown) => (typeof v === 'string' ? v.replace(/[<>\n\r]/g, '').slice(0, 80) : '');
  const names: Record<string, string> = { google_ads: 'Google Ads (מודעה ממומנת)', google: 'Google (חיפוש אורגני)', facebook: 'Facebook / Instagram', direct: 'ישיר' };
  const parts = [names[s(a.source)] || s(a.source) || 'לא ידוע'];
  if (s(a.campaign)) parts.push(`קמפיין: ${s(a.campaign)}`);
  if (s(a.term)) parts.push(`מילה: ${s(a.term)}`);
  if (s(a.content)) parts.push(`קבוצה: ${s(a.content)}`);
  if (s(a.utmId)) parts.push(`מזהה קמפיין: ${s(a.utmId)}`);
  if (s(a.landing)) parts.push(`דף כניסה: ${s(a.landing)}`);
  let line = parts.join(' | ');
  const id = typeof a.clickId === 'string' ? a.clickId.replace(/[^\w-]/g, '').slice(0, 500) : '';
  const type = ['gclid', 'gbraid', 'wbraid', 'fbclid'].includes(s(a.clickIdType)) ? s(a.clickIdType) : 'gclid';
  if (id) line += `\nמזהה קליק (${type}): ${id}`;
  return line;
}
