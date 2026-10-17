import type { Metadata } from "next";

export const dynamic = "force-static";
// דף בדיקה פנימי: לא לאינדקס (17.10.2026)
export const metadata: Metadata = { title: "health", robots: { index: false, follow: false } };

export default function HealthPage() {
  return (
    <main>
      <h1>OK</h1>
      <p>השרת פעיל והרינדור עובד. אם דף הבית לבן, נסו לעדכן לכתובת הנכונה ולרענן.</p>
    </main>
  );
}
