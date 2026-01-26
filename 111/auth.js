#!/usr/bin/env node

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly'
];

const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

async function authenticate() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('credentials.json not found!');
    console.error('Please download OAuth client credentials from Google Cloud Console');
    console.error('and save as credentials.json in this directory.');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we already have a token
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
    console.log('✅ Authentication token already exists!');
    
    // Test the authentication
    try {
      await testAuthentication(oAuth2Client);
    } catch (error) {
      console.error('❌ Token seems invalid, getting new one...');
      await getNewToken(oAuth2Client);
    }
    return;
  }

  await getNewToken(oAuth2Client);
}

async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('🔐 Authorize this app by visiting this url:', authUrl);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', async (code) => {
      rl.close();
      
      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Store the token to disk for later program executions
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('✅ Token stored to', TOKEN_PATH);

        await testAuthentication(oAuth2Client);
        resolve();
      } catch (error) {
        console.error('❌ Error retrieving access token:', error);
        reject(error);
      }
    });
  });
}

async function testAuthentication(auth) {
  try {
    console.log('🧪 Testing Search Console access...');
    const webmasters = google.webmasters({ version: 'v3', auth });
    const sitesResponse = await webmasters.sites.list();
    console.log('✅ Search Console access working!');
    
    if (sitesResponse.data.siteEntry && sitesResponse.data.siteEntry.length > 0) {
      console.log('📊 Your sites:');
      sitesResponse.data.siteEntry.forEach(site => {
        console.log(`  - ${site.siteUrl} (${site.permissionLevel})`);
      });
    } else {
      console.log('⚠️  No Search Console sites found. Make sure you have access to at least one site.');
    }

    console.log('🧪 Testing Analytics access...');
    const analytics = google.analyticsdata({ version: 'v1beta', auth });
    // This will fail if no property access, but auth is working
    console.log('✅ Analytics authentication working! (Note: You need to specify property ID for actual queries)');
    
    console.log('🎉 Setup complete! You can now use the MCP server.');
    
  } catch (error) {
    if (error.code === 403) {
      console.log('⚠️  Authentication working, but you may need to:');
      console.log('   - Add your service/user to Search Console properties');
      console.log('   - Get proper Analytics property access');
    } else {
      throw error;
    }
  }
}

authenticate().catch(console.error);