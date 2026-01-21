import { BASE_URL } from "../config";
import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" style={{
      fontSize: '0.9rem',
      color: 'var(--muted)',
      marginBottom: '1.5rem',
      padding: '0.5rem 0'
    }}>
      <ol style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <li>
          <Link href="/" style={{ color: 'var(--link-color)', textDecoration: 'none' }}>
            דף הבית
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.url} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--muted)' }}>›</span>
            {index === items.length - 1 ? (
              <span style={{ color: 'var(--text)' }}>{item.name}</span>
            ) : (
              <Link href={item.url} style={{ color: 'var(--link-color)', textDecoration: 'none' }}>
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = BASE_URL;
  
  const schemaItems = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "דף הבית",
      "item": baseUrl
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 2,
      "name": item.name,
      "item": `${baseUrl}${item.url}`
    }))
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": schemaItems
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
