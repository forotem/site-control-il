import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '500px',
      flexDirection: 'column',
      gap: '20px',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--accent)', margin: 0, lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.8rem', color: 'var(--text)', margin: 0 }}>הדף לא נמצא</h2>
      <p style={{ color: 'var(--muted)', maxWidth: '500px', fontSize: '1.1rem' }}>
        מצטערים, הדף שחיפשת אינו קיים. ייתכן שהוא הועבר או שהכתובת שגויה.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            background: 'var(--accent)',
            color: 'white',
            padding: '14px 28px',
            borderRadius: 'var(--radius)',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          חזור לדף הבית
        </Link>
        <Link
          href="/blog"
          style={{
            background: 'transparent',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            padding: '14px 28px',
            borderRadius: 'var(--radius)',
            textDecoration: 'none',
            fontSize: '1rem'
          }}
        >
          לבלוג
        </Link>
        <Link
          href="/contact"
          style={{
            background: 'transparent',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            padding: '14px 28px',
            borderRadius: 'var(--radius)',
            textDecoration: 'none',
            fontSize: '1rem'
          }}
        >
          צור קשר
        </Link>
      </div>
    </div>
  );
}
