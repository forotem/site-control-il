import type { Metadata } from "next";

// דף פנימי (page.tsx הוא 'use client', לכן ה-metadata כאן): לא לאינדקס. 17.10.2026
export const metadata: Metadata = { title: "SEO dashboard", robots: { index: false, follow: false } };

export default function SeoDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
