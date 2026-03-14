import type { Metadata } from "next";
import { Packages } from "../components/Packages";
import { LocalBusinessSchema } from "../components/Schema";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "חבילות מצלמות אבטחה סולאריות 4G | Site-Control",
  description:
    "חבילות מצלמות אבטחה סולאריות 4G לאתרי בנייה וחקלאות: קנה והתקן (3,750 ₪), ראש שקט, אתר בבנייה ותוספת טיימלאפס. גיבוי ענן, 4K, Reolink.",
  keywords: [
    "חבילות מצלמות אבטחה",
    "מצלמה סולארית 4G מחיר",
    "חבילת אבטחה לאתר בנייה",
    "טיימלאפס בנייה מחיר",
    "Reolink GO Plus מחיר",
  ],
  alternates: {
    canonical: "/packages",
  },
};

export default function PackagesPage() {
  const breadcrumbItems = [
    { name: "חבילות", url: "/packages" }
  ];

  return (
    <main style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem'}}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Breadcrumb items={breadcrumbItems} />
      <h1>חבילות מצלמות אבטחה</h1>
      <Packages />
      <LocalBusinessSchema />
    </main>
  );
}