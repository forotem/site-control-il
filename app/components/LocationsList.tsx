import Link from 'next/link';
import { locations } from '../data/locations';
import styles from './LocationsList.module.css';

export function LocationsList() {
  // Group locations by region
  const grouped = locations.reduce(
    (acc, loc) => {
      const region = loc.region;
      if (!acc[region]) acc[region] = [];
      acc[region].push(loc);
      return acc;
    },
    {} as Record<string, typeof locations>
  );

  return (
    <section className={styles.locationsSection}>
      <h2>פתרונות לאזוריים בכל הארץ</h2>
      <p className={styles.subtitle}>בחר את האזור שלך והגלה פתרון מותאם</p>

      {Object.entries(grouped).map(([region, locs]) => (
        <div key={region} className={styles.regionGroup}>
          <h3>{region}</h3>
          <div className={styles.locationsGrid}>
            {locs.map((location) => (
              <Link
                key={location.id}
                href={`/locations/${location.slug}`}
                className={styles.locationCard}
              >
                <div className={styles.cardContent}>
                  <h4>{location.name}</h4>
                  <p>{location.description}</p>
                  <ul className={styles.benefits}>
                    {location.benefits.slice(0, 2).map((benefit, idx) => (
                      <li key={idx}>✓ {benefit}</li>
                    ))}
                  </ul>
                  <span className={styles.learnMore}>לדעת עוד →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
