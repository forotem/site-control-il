const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function main() {
    const credentialsPath = path.join(__dirname, 'credentials.json');
    const tokenPath = path.join(__dirname, 'token.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath));
    const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const token = JSON.parse(fs.readFileSync(tokenPath));
    oAuth2Client.setCredentials(token);

    const webmasters = google.webmasters({ version: 'v3', auth: oAuth2Client });
    const siteUrl = 'sc-domain:site-control-il.com';

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // 1. Query + Page data
    console.log('=== Fetching Query + Page data ===');
    const queryPageRes = await webmasters.searchanalytics.query({
        siteUrl,
        requestBody: {
            startDate, endDate,
            dimensions: ['query', 'page'],
            rowLimit: 100,
        },
    });

    // 2. Page-only data
    console.log('=== Fetching Page data ===');
    const pageRes = await webmasters.searchanalytics.query({
        siteUrl,
        requestBody: {
            startDate, endDate,
            dimensions: ['page'],
            rowLimit: 50,
        },
    });

    // 3. Query data with more rows
    console.log('=== Fetching expanded Query data ===');
    const queryRes = await webmasters.searchanalytics.query({
        siteUrl,
        requestBody: {
            startDate, endDate,
            dimensions: ['query'],
            rowLimit: 200,
        },
    });

    const fullData = {
        site: siteUrl,
        dateRange: { start: startDate, end: endDate },
        fetchedAt: new Date().toISOString(),
        pages: pageRes.data.rows ? pageRes.data.rows.map(r => ({
            page: r.keys[0],
            clicks: r.clicks,
            impressions: r.impressions,
            ctr: parseFloat((r.ctr * 100).toFixed(2)),
            position: parseFloat(r.position.toFixed(1))
        })).sort((a, b) => b.impressions - a.impressions) : [],
        queries: queryRes.data.rows ? queryRes.data.rows.map(r => ({
            query: r.keys[0],
            clicks: r.clicks,
            impressions: r.impressions,
            ctr: parseFloat((r.ctr * 100).toFixed(2)),
            position: parseFloat(r.position.toFixed(1))
        })).sort((a, b) => b.impressions - a.impressions) : [],
        queryPages: queryPageRes.data.rows ? queryPageRes.data.rows.map(r => ({
            query: r.keys[0],
            page: r.keys[1],
            clicks: r.clicks,
            impressions: r.impressions,
            position: parseFloat(r.position.toFixed(1))
        })).sort((a, b) => b.impressions - a.impressions) : []
    };

    // Print summary
    console.log(`\n📊 SUMMARY:`);
    console.log(`Total pages indexed: ${fullData.pages.length}`);
    console.log(`Total unique queries: ${fullData.queries.length}`);
    console.log(`Total query-page combos: ${fullData.queryPages.length}`);

    console.log('\n📄 TOP PAGES:');
    fullData.pages.forEach(p => {
        console.log(`  ${p.page}`);
        console.log(`    Impressions: ${p.impressions} | Clicks: ${p.clicks} | CTR: ${p.ctr}% | Pos: ${p.position}`);
    });

    console.log('\n🔍 TOP QUERIES (by impressions):');
    fullData.queries.slice(0, 30).forEach(q => {
        console.log(`  "${q.query}" - Imp: ${q.impressions} | Clicks: ${q.clicks} | Pos: ${q.position}`);
    });

    console.log('\n🎯 BEST POSITIONED QUERIES (pos < 20):');
    fullData.queries.filter(q => q.position < 20).sort((a, b) => a.position - b.position).forEach(q => {
        console.log(`  "${q.query}" - Pos: ${q.position} | Imp: ${q.impressions} | Clicks: ${q.clicks}`);
    });

    console.log('\n⚡ QUICK WINS (pos 5-20, with impressions):');
    fullData.queries.filter(q => q.position >= 5 && q.position <= 20 && q.impressions >= 3).sort((a, b) => a.position - b.position).forEach(q => {
        console.log(`  "${q.query}" - Pos: ${q.position} | Imp: ${q.impressions}`);
    });

    // Save full data
    const outputPath = path.join(__dirname, '..', 'gsc_full_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(fullData, null, 2), 'utf8');
    console.log(`\n✅ Full data saved to ${outputPath}`);
}

main().catch(console.error);
