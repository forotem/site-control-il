import Link from 'next/link';
import { blogPosts } from '../data/blog';
import styles from './BlogList.module.css';

/** slugs: להציג רק את הפוסטים האלה, בסדר הזה (למשל בדף הבית). בלי slugs: כל הפוסטים. */
export function BlogList({ slugs }: { slugs?: string[] } = {}) {
  const posts = slugs ? slugs.map((s) => blogPosts.find((p) => p.slug === s)).filter((p): p is (typeof blogPosts)[number] => !!p) : blogPosts;
  return (
    <section className={styles.blogSection}>
      <h2>בלוג ועדכונים</h2>
      <div className={styles.blogGrid}>
        {posts.map((post) => (
          <article key={post.id} className={styles.blogCard}>
            <div className={styles.blogMeta}>
              <span className={styles.category}>{post.category}</span>
              <span className={styles.date}>{new Date(post.date).toLocaleDateString('he-IL')}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className={styles.readMore}>
              קרא עוד →
            </Link>
          </article>
        ))}
      </div>
      {slugs && <p style={{ marginTop: '1rem' }}><Link href="/blog" className={styles.readMore}>לכל המדריכים בבלוג →</Link></p>}
    </section>
  );
}
