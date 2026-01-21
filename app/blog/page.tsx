import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '../data/blog';
import styles from './BlogIndex.module.css';

export const metadata: Metadata = {
  title: 'בלוג - מצלמות סולאריות 4G',
  description: 'בלוג עדכוני ובמודעות על מצלמות בטחון סולאריות, חקלאות חכמה ופתרונות ניטור מרחוק.',
  keywords: ['בלוג', 'מצלמות', 'סולארי', 'חקלאות', 'בנייה'],
};

export default function BlogPage() {
  const categoriesWithPosts = Array.from(
    new Set(blogPosts.map((p) => p.category))
  );

  return (
    <main className={styles.blogPage}>
      <div className={styles.header}>
        <h1>בלוג ועדכונים</h1>
        <p>עדכונים, טיפים וחדשויות על מצלמות בטחון סולאריות וחקלאות חכמה</p>
      </div>

      <section className={styles.allPosts}>
        <div className={styles.postsGrid}>
          {blogPosts.map((post) => (
            <article key={post.id} className={styles.postCard}>
              <div className={styles.cardHeader}>
                <span className={styles.category}>{post.category}</span>
                <span className={styles.date}>
                  {new Date(post.date).toLocaleDateString('he-IL')}
                </span>
              </div>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                קרא עוד →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>רוצה להישאר עדכני?</h2>
          <p>הירשם לניוזלטר שלנו וקבל עדכונים על חדשויות ופתרונות חדשים</p>
          <form className={styles.subscribeForm}>
            <input type="email" placeholder="הכנס את האימייל שלך" required />
            <button type="submit">הירשם</button>
          </form>
        </div>
      </section>
    </main>
  );
}
