import { Metadata } from 'next';
import { BASE_URL } from '../config';

export const metadata: Metadata = {
  title: 'מחירון מצלמות Reolink סולאריות 4G | Site-Control',
  description: 'מחירון מצלמות אבטחה סולאריות 4G של Reolink - חבילות Go ו-PT עם התקנה, גיבוי ענן וצפייה מרחוק. השוואת מחירים ומפרטים.',
  alternates: {
    canonical: `${BASE_URL}/pricing`,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
