import { Metadata } from 'next';
import ContactFormContent from './ContactFormContent';
import { Breadcrumb, BreadcrumbSchema } from '../components/Breadcrumb';

export const metadata: Metadata = {
  title: "יצירת קשר | Site-Control - מצלמות אבטחה, התקנה וחנות",
  description: "הצעת מחיר להתקנת מצלמות אבטחה, אינטרקום או בקרת כניסה במרכז ובדרום, שאלה על מוצר מהחנות, או עזרה לבחור. ווצאפ, טלפון או טופס קצר.",
  alternates: { canonical: 'https://www.site-control-il.com/contact' },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: "יצירת קשר", url: "/contact" }
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <ContactFormContent />
    </>
  );
}
