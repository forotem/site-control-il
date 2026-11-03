#!/usr/bin/env node

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function main() {
  const argv = require('minimist')(process.argv.slice(2));

  const keyPath = argv.key || process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'credentials.json');
  const startDate = argv.start || argv.s || new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().slice(0,10); // default 60 days
  const endDate = argv.end || argv.e || new Date().toISOString().slice(0,10);

  if (!fs.existsSync(keyPath)) {
    console.error('credentials key not found at', keyPath);
    console.error('Place a Service Account JSON key or set GOOGLE_APPLICATION_CREDENTIALS env var, or run the interactive `111/auth.js` flow.');
    process.exit(1);
  }

  const scopes = ['https://www.googleapis.com/auth/webmasters.readonly'];

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes,
  });

  const client = await auth.getClient();
  const webmasters = google.webmasters({ version: 'v3', auth: client });

  // List sites
  const sitesRes = await webmasters.sites.list();
  const sites = (sitesRes.data.siteEntry || []).map(s => s.siteUrl);
  if (sites.length === 0) {
    console.error('No sites found in Search Console for this account. Make sure the service account email was added as a user/owner in Search Console.');
    process.exit(1);
  }

  const site = argv.site || sites[0];
  console.log('Using site:', site);

  // Query search analytics
  const requestBody = {
    startDate,
    endDate,
    dimensions: ['query'],
    rowLimit: argv.limit || 2500
  };

  console.log(`Fetching Search Console data for ${startDate} to ${endDate} ...`);

  const resp = await webmasters.searchanalytics.query({
    siteUrl: site,
    requestBody
  });

  const rows = resp.data.rows || [];

  const outPath = path.join(__dirname, '..', 'gsc_output.txt');
  const header = `Analyzing Site: ${site}\nDate Range: ${startDate} to ${endDate}\n\nTop ${rows.length} Queries:\n`;

  const lines = rows.map(r => {
    const query = (r.keys && r.keys[0]) || '';
    const clicks = r.clicks || 0;
    const impressions = r.impressions || 0;
    const position = (typeof r.position === 'number') ? r.position.toFixed(1) : '';
    return `- ${query} (Clicks: ${clicks}, Impressions: ${impressions}, Pos: ${position})`;
  });

  fs.writeFileSync(outPath, header + lines.join('\n') + '\n');
  console.log('Wrote', outPath);
}

main().catch(err => {
  console.error('Error fetching GSC data:', err.message || err);
  process.exit(1);
});
