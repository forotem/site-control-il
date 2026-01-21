import type { Metadata } from "next";
import { Packages } from "../components/Packages";
import { LocalBusinessSchema } from "../components/Schema";
import { Breadcrumb, BreadcrumbSchema } from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "חבילות אבטחה סולארי 4G לאתרי בנייה | Reolink",
  description:
    "חבילות מצלמות אבטחה סולאריות 4G: קנה והתקן, ראש שקט, אתר בבנייה. גיבוי ענן, אבטחה בזמן אמת, זיהוי AI. החיר סדרטם!",
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