import { BASE_URL } from '../../config';
import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '../../data/blog';
import { notFound } from 'next/navigation';
import styles from './BlogPost.module.css';
import { JsonLd, BreadcrumbSchema } from '../../components/Schema';

interface Params {
  slug: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: 'פוסט לא נמצא',
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      locale: 'he_IL',
      siteName: 'Site-Control',
      url: `${BASE_URL}/blog/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `${BASE_URL}/blog/${params.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: Params }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter(
    (p) => p.category === post.category && p.id !== post.id
  );

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.date,
    dateModified: post.date,
    publisher: {
      '@type': 'Organization',
      name: 'Site-Control',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/optimized-variants/הלוגו שלי/site-control-logo.optimized-w480.avif`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${params.slug}`,
    },
    keywords: post.keywords?.join(', ') || '',
    articleSection: post.category,
  };

  const breadcrumbItems = [
    { name: 'בעמוד הבית', url: '/' },
    { name: 'בלוג', url: '/blog' },
    { name: post.title, url: `/blog/${params.slug}` },
  ];

  return (
    <>
      <JsonLd json={articleSchema} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <main className={styles.blogPostContainer}>
      <div className={styles.breadcrumb}>
        <Link href="/">בעמוד הבית</Link>
        <span> / </span>
        <Link href="/blog">בלוג</Link>
        <span> / </span>
        <span>{post.title}</span>
      </div>

      <article className={styles.blogPost}>
        <header className={styles.postHeader}>
          <h1>{post.title}</h1>
          <div className={styles.postMeta}>
            <span className={styles.author}>כתב: {post.author}</span>
            <span className={styles.date}>
              {new Date(post.date).toLocaleDateString('he-IL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className={styles.category}>{post.category}</span>
          </div>
        </header>

        <div className={styles.postContent}>
          {post.content.split('\n\n').map((paragraph, index) => {
            // Skip empty paragraphs
            if (!paragraph.trim()) return null;

            // Handle headings (# ## ###)
            if (paragraph.startsWith('#')) {
              const level = paragraph.match(/^#+/)?.[0].length || 1;
              const text = paragraph.replace(/^#+\s/, '');
              const Tag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
              return (
                <Tag key={index} className={styles[`heading${level}`]}>
                  {text}
                </Tag>
              );
            }

            // Handle unordered lists (-)
            if (paragraph.includes('\n-') || paragraph.startsWith('-')) {
              const items = paragraph.split('\n').filter(line => line.trim().startsWith('-'));
              return (
                <ul key={index} className={styles.list}>
                  {items.map((item, i) => {
                    const text = item.replace(/^-\s*/, '');
                    // Process bold text in list items
                    const parts = text.split(/\*\*(.*?)\*\*/g);
                    return (
                      <li key={i}>
                        {parts.map((part, j) => 
                          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                        )}
                      </li>
                    );
                  })}
                </ul>
              );
            }

            // Handle ordered lists (1. 2. 3.)
            if (paragraph.match(/^\d+\./)) {
              const items = paragraph.split('\n').filter(line => line.trim().match(/^\d+\./));
              return (
                <ol key={index} className={styles.list}>
                  {items.map((item, i) => {
                    const text = item.replace(/^\d+\.\s*/, '');
                    return <li key={i}>{text}</li>;
                  })}
                </ol>
              );
            }

            // Handle regular paragraphs with bold text
            const parts = paragraph.split(/\*\*(.*?)\*\*/g);
            return (
              <p key={index} className={styles.paragraph}>
                {parts.map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </p>
            );
          })}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className={styles.relatedPosts}>
          <h2>פוסטים קשורים</h2>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className={styles.relatedCard}
              >
                <h3>{relatedPost.title}</h3>
                <p>{relatedPost.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className={styles.backLink}>
        <Link href="/blog">← חזור לבלוג</Link>
      </div>
    </main>
    </>
  );
}
