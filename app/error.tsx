'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      flexDirection: 'column',
      gap: '16px',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h2 style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>משהו השתבש</h2>
      <p style={{ color: 'var(--muted)', maxWidth: '500px' }}>
        מצטערים, אירעה שגיאה בטעינת הדף. אנא נסה שוב או חזור לדף הבית.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={reset}
          style={{
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          נסה שוב
        </button>
        <a
          href="/"
          style={{
            background: 'transparent',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            padding: '12px 24px',
            borderRadius: 'var(--radius)',
            textDecoration: 'none',
            fontSize: '1rem'
          }}
        >
          חזור לדף הבית
        </a>
      </div>
    </div>
  );
}
