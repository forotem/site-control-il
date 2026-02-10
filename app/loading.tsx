'use client';

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        border: '3px solid rgba(0, 194, 255, 0.1)',
        borderTopColor: '#00c2ff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        boxShadow: '0 0 30px rgba(0, 194, 255, 0.15)'
      }} />
      <p style={{ color: 'var(--muted)', fontSize: '1rem', fontWeight: 500 }}>טוען...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
