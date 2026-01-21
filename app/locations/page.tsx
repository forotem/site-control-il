import { Metadata } from 'next';
import { LocationsList } from '../components/LocationsList';

export const metadata: Metadata = {
  title: 'פתרונות לפי אזור - מצלמות סולאריות',
  description: 'בחר את האזור שלך וגלה פתרון בטחוני מותאם לצרכיך - בנייה, חקלאות, אתרים מרוחקים ועוד.',
  keywords: ['אזורים', 'פתרונות', 'מצלמות', 'בנייה', 'חקלאות'],
};

export default function LocationsPage() {
  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>פתרונות לכל אזור בארץ</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '0.5rem' }}>
          בחר את האזור שלך וגלה איך אנחנו יכולים להגן על הנכסים שלך
        </p>
      </div>
      <LocationsList />
    </main>
  );
}
