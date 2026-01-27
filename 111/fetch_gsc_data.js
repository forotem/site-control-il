
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function main() {
    // 1. Auth
    const credentialsPath = path.join(__dirname, 'credentials.json');
    const tokenPath = path.join(__dirname, 'token.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath));
    const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const token = JSON.parse(fs.readFileSync(tokenPath));
    oAuth2Client.setCredentials(token);

    // 2. Get Site List
    const webmasters = google.webmasters({ version: 'v3', auth: oAuth2Client });
    const sitesRes = await webmasters.sites.list();

    console.log('Available Sites:');
    sitesRes.data.siteEntry.forEach(s => console.log(`- ${s.siteUrl} (${s.permissionLevel})`));

    // Use the first site (or specific one if known)
    const siteUrl = sitesRes.data.siteEntry[0].siteUrl;
    console.log(`\nQuerying Site: ${siteUrl}`);

    // 3. Query Performance Data (Last 90 Days)
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log(`Date Range: ${startDate} to ${endDate}`);

    const res = await webmasters.searchanalytics.query({
        siteUrl: siteUrl,
        requestBody: {
            startDate: startDate,
            endDate: endDate,
            dimensions: ['query'],
            rowLimit: 50,
        },
    });

    console.log('\nTop 50 Queries:');
    if (res.data.rows) {
        res.data.rows.sort((a, b) => b.clicks - a.clicks);
        res.data.rows.forEach(row => {
            console.log(`- ${row.keys[0]} (Clicks: ${row.clicks}, Impressions: ${row.impressions}, Pos: ${row.position.toFixed(1)})`);
        });
    } else {
        console.log('No data found.');
    }
}

main().catch(console.error);
