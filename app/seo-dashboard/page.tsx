'use client';

import { useState } from 'react';

interface QueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface PageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GSCData {
  site: string;
  dateRange: { start: string; end: string };
  fetchedAt: string;
  summary: {
    totalQueries: number;
    totalPages: number;
    totalClicks: number;
    totalImpressions: number;
    avgCTR: number;
  };
  quickWins: QueryData[];
  topPositioned: QueryData[];
  highImpNoClicks: QueryData[];
  queries: QueryData[];
  pages: PageData[];
}

export default function SEODashboard() {
  const [data, setData] = useState<GSCData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [days, setDays] = useState(90);
  const [authenticated, setAuthenticated] = useState(false);

  const fetchData = async () => {
    if (!secretKey) {
      setError('הזן מפתח גישה');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/gsc?key=${encodeURIComponent(secretKey)}&days=${days}`);
      if (!res.ok) {
        if (res.status === 401) throw new Error('מפתח גישה שגוי');
        throw new Error('שגיאה בטעינת הנתונים');
      }
      const json = await res.json();
      setData(json);
      setAuthenticated(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getPositionColor = (pos: number) => {
    if (pos <= 3) return '#22c55e';
    if (pos <= 10) return '#eab308';
    if (pos <= 20) return '#f97316';
    return '#ef4444';
  };

  const getPositionBg = (pos: number) => {
    if (pos <= 3) return '#052e16';
    if (pos <= 10) return '#422006';
    if (pos <= 20) return '#431407';
    return '#450a0a';
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#111', padding: 40, borderRadius: 16, maxWidth: 400, width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>🔐 SEO Dashboard</h1>
          <p style={{ color: '#888', marginBottom: 24 }}>הזן מפתח גישה</p>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            placeholder="מפתח גישה..."
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#1a1a1a', color: '#fff', marginBottom: 16, fontSize: 16 }}
          />
          <button onClick={fetchData} disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontSize: 16, cursor: 'pointer' }}>
            {loading ? 'טוען...' : 'כניסה'}
          </button>
          {error && <p style={{ color: '#ef4444', marginTop: 12 }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: 24, direction: 'rtl' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, margin: 0 }}>📊 SEO Dashboard - GSC</h1>
            {data && <p style={{ color: '#888', marginTop: 4 }}>
              {data.dateRange.start} → {data.dateRange.end} | נטען: {new Date(data.fetchedAt).toLocaleString('he-IL')}
            </p>}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select value={days} onChange={(e) => setDays(Number(e.target.value))} style={{ padding: 8, borderRadius: 8, background: '#1a1a1a', color: '#fff', border: '1px solid #333' }}>
              <option value={7}>7 ימים</option>
              <option value={28}>28 ימים</option>
              <option value={90}>90 ימים</option>
            </select>
            <button onClick={fetchData} disabled={loading} style={{ padding: '8px 16px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>
              {loading ? '⏳' : '🔄 רענן'}
            </button>
          </div>
        </div>

        {error && <div style={{ background: '#450a0a', padding: 16, borderRadius: 8, marginBottom: 16, color: '#fca5a5' }}>{error}</div>}

        {data && (
          <>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'חשיפות', value: data.summary.totalImpressions, color: '#3b82f6' },
                { label: 'קליקים', value: data.summary.totalClicks, color: '#22c55e' },
                { label: 'CTR ממוצע', value: `${data.summary.avgCTR}%`, color: '#eab308' },
                { label: 'שאילתות', value: data.summary.totalQueries, color: '#a855f7' },
                { label: 'עמודים', value: data.summary.totalPages, color: '#ec4899' },
              ].map((card, i) => (
                <div key={i} style={{ background: '#111', padding: 20, borderRadius: 12, borderRight: `4px solid ${card.color}` }}>
                  <div style={{ color: '#888', fontSize: 14 }}>{card.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: card.color }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Quick Wins */}
            {data.quickWins.length > 0 && (
              <Section title="⚡ Quick Wins - קרובים לעמוד 1" subtitle="שאילתות במיקום 5-20 עם חשיפות - שיפור קטן יביא קליקים">
                <Table
                  headers={['שאילתה', 'מיקום', 'חשיפות', 'קליקים', 'CTR']}
                  rows={data.quickWins.map(q => [
                    q.query,
                    <PositionBadge key="pos" pos={q.position} />,
                    q.impressions,
                    q.clicks,
                    `${q.ctr}%`
                  ])}
                />
              </Section>
            )}

            {/* Top Positioned */}
            {data.topPositioned.length > 0 && (
              <Section title="🏆 מיקומים מובילים" subtitle="שאילתות בעמוד 1 של גוגל">
                <Table
                  headers={['שאילתה', 'מיקום', 'חשיפות', 'קליקים', 'CTR']}
                  rows={data.topPositioned.map(q => [
                    q.query,
                    <PositionBadge key="pos" pos={q.position} />,
                    q.impressions,
                    q.clicks,
                    `${q.ctr}%`
                  ])}
                />
              </Section>
            )}

            {/* High Impressions No Clicks */}
            {data.highImpNoClicks.length > 0 && (
              <Section title="🔴 חשיפות בלי קליקים" subtitle="שאילתות עם חשיפות אבל 0 קליקים - צריך לשפר Title/Description">
                <Table
                  headers={['שאילתה', 'חשיפות', 'מיקום', 'CTR']}
                  rows={data.highImpNoClicks.map(q => [
                    q.query,
                    q.impressions,
                    <PositionBadge key="pos" pos={q.position} />,
                    `${q.ctr}%`
                  ])}
                />
              </Section>
            )}

            {/* All Pages */}
            <Section title="📄 כל העמודים" subtitle="ביצועי כל העמודים המאונדקסים">
              <Table
                headers={['עמוד', 'חשיפות', 'קליקים', 'CTR', 'מיקום']}
                rows={data.pages.map(p => [
                  <span key="page" style={{ fontSize: 13, wordBreak: 'break-all' }}>{p.page.replace('https://www.site-control-il.com', '').replace('https://www.site-control-il.com', '(www)')}</span>,
                  p.impressions,
                  p.clicks,
                  `${p.ctr}%`,
                  <PositionBadge key="pos" pos={p.position} />,
                ])}
              />
            </Section>

            {/* All Queries */}
            <Section title="🔍 כל השאילתות" subtitle="כל השאילתות שהאתר מופיע עליהן">
              <Table
                headers={['שאילתה', 'חשיפות', 'קליקים', 'CTR', 'מיקום']}
                rows={data.queries.map(q => [
                  q.query,
                  q.impressions,
                  q.clicks,
                  `${q.ctr}%`,
                  <PositionBadge key="pos" pos={q.position} />,
                ])}
              />
            </Section>
          </>
        )}
      </div>
    </div>
  );

  function PositionBadge({ pos }: { pos: number }) {
    return (
      <span style={{ background: getPositionBg(pos), color: getPositionColor(pos), padding: '2px 8px', borderRadius: 6, fontWeight: 'bold', fontSize: 14 }}>
        {pos}
      </span>
    );
  }
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#111', borderRadius: 12, padding: 24, marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>{title}</h2>
      <p style={{ color: '#888', fontSize: 14, marginTop: 4, marginBottom: 16 }}>{subtitle}</p>
      {children}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: any[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ textAlign: 'right', padding: '8px 12px', borderBottom: '1px solid #333', color: '#888', fontSize: 13, fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #1a1a1a' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 12px', fontSize: 14 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
