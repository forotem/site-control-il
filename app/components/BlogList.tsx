import Link from 'next/link';
import { blogPosts } from '../data/blog';
import styles from './BlogList.module.css';

export function BlogList() {
  return (
    <section className={styles.blogSection}>
      <h2>בלוג ועדכונים</h2>
      <div className={styles.blogGrid}>
        {blogPosts.map((post) => (
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
    </section>
  );
}
