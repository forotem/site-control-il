import { Metadata } from 'next';
import Link from 'next/link';
import { locations } from '../../data/locations';
import { blogPosts } from '../../data/blog';
import { notFound } from 'next/navigation';
import styles from './LocationPage.module.css';

interface Params {
  slug: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const location = locations.find((l) => l.slug === params.slug);

  if (!location) {
    return {
      title: 'אזור לא נמצא',
    };
  }

  return {
    title: location.seoTitle,
    description: location.seoDescription,
    openGraph: {
      title: location.name,
      description: location.description,
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

export default function LocationPage({ params }: { params: Params }) {
  const location = locations.find((l) => l.slug === params.slug);

  if (!location) {
    notFound();
  }

  // Get related locations from same region
  const relatedLocations = locations.filter(
    (l) => l.region === location.region && l.id !== location.id
  );

  // Get blog posts related to this location
  const relatedBlogs = blogPosts.filter(
    (b) =>
      b.category.includes('בנייה') ||
      b.category.includes('חקלאות') ||
      b.title.includes('סולארי')
  );

  return (
    <main className={styles.locationPage}>
      <div className={styles.breadcrumb}>
        <Link href="/">בעמוד הבית</Link>
        <span> / </span>
        <Link href="/locations">אזורים</Link>
        <span> / </span>
        <span>{location.name}</span>
      </div>

      <article className={styles.locationContent}>
        <header className={styles.header}>
          <div className={styles.badge}>{location.region}</div>
          <h1>{location.name}</h1>
          <p className={styles.description}>{location.description}</p>
        </header>

        <section className={styles.benefits}>
          <h2>יתרונות הפתרון</h2>
          <ul className={styles.benefitsList}>
            {location.benefits.map((benefit, idx) => (
              <li key={idx}>
                <span className={styles.icon}>✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.useCases}>
          <h2>שימושים אפשריים</h2>
          <div className={styles.useCasesList}>
            {location.useCases.map((useCase, idx) => (
              <div key={idx} className={styles.useCaseItem}>
                <div className={styles.useCaseIcon}>📍</div>
                <p>{useCase}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <h2>מעוניין בפתרון זה?</h2>
          <p>צור קשר עם הצוות שלנו לקבלת הצעה מתאימה</p>
          <Link href="/contact" className={styles.ctaButton}>
            צור קשר עכשיו
          </Link>
        </section>
      </article>

      {relatedLocations.length > 0 && (
        <section className={styles.relatedLocations}>
          <h2>אזורים נוספים ב{location.region}</h2>
          <div className={styles.relatedGrid}>
            {relatedLocations.map((loc) => (
              <Link
                key={loc.id}
                href={`/locations/${loc.slug}`}
                className={styles.relatedCard}
              >
                <h3>{loc.name}</h3>
                <p>{loc.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedBlogs.length > 0 && (
        <section className={styles.relatedBlog}>
          <h2>קרא בבלוג שלנו</h2>
          <div className={styles.blogGrid}>
            {relatedBlogs.slice(0, 3).map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className={styles.blogCard}
              >
                <span className={styles.category}>{blog.category}</span>
                <h3>{blog.title}</h3>
                <p>{blog.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className={styles.backLink}>
        <Link href="/locations">← חזור לאזורים</Link>
      </div>
    </main>
  );
}
