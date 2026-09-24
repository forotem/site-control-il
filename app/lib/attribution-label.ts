// צד שרת: הופך את אובייקט המקור שהדפדפן שלח לשורה קריאה בהתראה לצוות.
export function attributionLabel(raw: unknown): string {
  if (!raw || typeof raw !== 'object') return 'לא ידוע';
  const a = raw as Record<string, unknown>;
  const s = (v: unknown) => (typeof v === 'string' ? v.replace(/[<>\n\r]/g, '').slice(0, 80) : '');
  const names: Record<string, string> = { google_ads: 'Google Ads (מודעה ממומנת)', google: 'Google (חיפוש אורגני)', facebook: 'Facebook / Instagram', direct: 'ישיר' };
  const parts = [names[s(a.source)] || s(a.source) || 'לא ידוע'];
  if (s(a.campaign)) parts.push(`קמפיין: ${s(a.campaign)}`);
  if (s(a.term)) parts.push(`מילה: ${s(a.term)}`);
  if (s(a.landing)) parts.push(`דף כניסה: ${s(a.landing)}`);
  return parts.join(' | ');
}
