import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

function getAuthClient() {
  const clientId = process.env.GSC_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET;
  const refreshToken = process.env.GSC_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('GSC credentials not configured');
  }

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  return oAuth2Client;
}

export async function GET(request: NextRequest) {
  // Verify dashboard secret
  const secret = request.nextUrl.searchParams.get('key');
  if (secret !== process.env.DASHBOARD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const auth = getAuthClient();
    const webmasters = google.webmasters({ version: 'v3', auth });

    const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:site-control-il.com';
    const days = parseInt(request.nextUrl.searchParams.get('days') || '90');
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Fetch all data in parallel
    const [queryRes, pageRes, queryPageRes] = await Promise.all([
      webmasters.searchanalytics.query({
        siteUrl,
        requestBody: { startDate, endDate, dimensions: ['query'], rowLimit: 200 },
      }),
      webmasters.searchanalytics.query({
        siteUrl,
        requestBody: { startDate, endDate, dimensions: ['page'], rowLimit: 100 },
      }),
      webmasters.searchanalytics.query({
        siteUrl,
        requestBody: { startDate, endDate, dimensions: ['query', 'page'], rowLimit: 200 },
      }),
    ]);

    const formatRows = (rows: any[], keys: string[]) =>
      (rows || []).map((r: any) => ({
        ...Object.fromEntries(keys.map((k, i) => [k, r.keys[i]])),
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: parseFloat((r.ctr * 100).toFixed(2)),
        position: parseFloat(r.position.toFixed(1)),
      }));

    const queries = formatRows(queryRes.data.rows as any[], ['query']).sort((a: any, b: any) => b.impressions - a.impressions);
    const pages = formatRows(pageRes.data.rows as any[], ['page']).sort((a: any, b: any) => b.impressions - a.impressions);
    const queryPages = formatRows(queryPageRes.data.rows as any[], ['query', 'page']).sort((a: any, b: any) => b.impressions - a.impressions);

    // Analysis
    const quickWins = queries.filter((q: any) => q.position >= 5 && q.position <= 20 && q.impressions >= 2);
    const topPositioned = queries.filter((q: any) => q.position < 10);
    const highImpNoClicks = queries.filter((q: any) => q.impressions >= 5 && q.clicks === 0);
    const totalClicks = queries.reduce((sum: number, q: any) => sum + q.clicks, 0);
    const totalImpressions = queries.reduce((sum: number, q: any) => sum + q.impressions, 0);

    return NextResponse.json({
      site: siteUrl,
      dateRange: { start: startDate, end: endDate },
      fetchedAt: new Date().toISOString(),
      summary: {
        totalQueries: queries.length,
        totalPages: pages.length,
        totalClicks,
        totalImpressions,
        avgCTR: totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0,
      },
      quickWins,
      topPositioned,
      highImpNoClicks,
      queries,
      pages,
      queryPages,
    });
  } catch (error: any) {
    console.error('GSC API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
