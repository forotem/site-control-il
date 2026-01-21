import { Metadata } from 'next';
import ContactFormContent from './ContactFormContent';
import { Breadcrumb, BreadcrumbSchema } from '../components/Breadcrumb';

export const metadata: Metadata = {
  title: "צור קשר - ענט ברי Reolink המכדשדוד | Site-Control",
  description: "צרו קשר - אבצור בדיפשטו, אנחנו מב כדי להצעיד פטרון בטחוני מושלאם. שננ אוטומטי עבודה סולאריה 4G.",
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