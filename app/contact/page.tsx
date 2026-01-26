import { Metadata } from 'next';
import ContactFormContent from './ContactFormContent';
import { Breadcrumb, BreadcrumbSchema } from '../components/Breadcrumb';

export const metadata: Metadata = {
  title: "צור קשר - מצלמות Reolink סולאריות 4G | Site-Control",
  description: "צרו קשר עכשיו לקבלת הצעת מחיר על מצלמות אבטחה סולאריות 4G. אנחנו כאן כדי לספק פתרון בטחוני מושלם. שירות מהיר ומקצועי.",
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: "צור קשר", url: "/contact" }
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