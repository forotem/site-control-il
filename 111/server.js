#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GoogleMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'google-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_console_sites',
          description: 'Get list of Search Console sites',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'search_console_query',
          description: 'Query Search Console data',
          inputSchema: {
            type: 'object',
            properties: {
              site_url: { type: 'string', description: 'Site URL' },
              start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
              end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
              dimensions: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'Dimensions like query, page, device'
              },
            },
            required: ['site_url', 'start_date', 'end_date'],
          },
        },
        {
          name: 'analytics_report',
          description: 'Get Google Analytics report',
          inputSchema: {
            type: 'object',
            properties: {
              property_id: { type: 'string', description: 'GA4 Property ID' },
              start_date: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
              end_date: { type: 'string', description: 'End date (YYYY-MM-DD)' },
              metrics: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'Metrics like sessions, totalUsers'
              },
              dimensions: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'Dimensions like date, country'
              },
            },
            required: ['property_id', 'start_date', 'end_date', 'metrics'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'search_console_sites':
            return await this.getSearchConsoleSites();
          case 'search_console_query':
            return await this.querySearchConsole(request.params.arguments);
          case 'analytics_report':
            return await this.getAnalyticsReport(request.params.arguments);
          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        return {
          content: [{ type: 'text', text: `Error: ${error.message}` }],
        };
      }
    });
  }

  async getAuthClient() {
    const credentialsPath = path.join(__dirname, 'credentials.json');
    const tokenPath = path.join(__dirname, 'token.json');

    if (!fs.existsSync(credentialsPath)) {
      throw new Error('credentials.json not found. Please download OAuth client credentials from Google Cloud Console.');
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath));
    const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have a token file
    if (fs.existsSync(tokenPath)) {
      const token = JSON.parse(fs.readFileSync(tokenPath));
      oAuth2Client.setCredentials(token);
      return oAuth2Client;
    } else {
      throw new Error('No authentication token found. Please run: npm run auth');
    }
  }

  async getSearchConsoleSites() {
    const auth = await this.getAuthClient();
    const webmasters = google.webmasters({ version: 'v3', auth });
    
    const response = await webmasters.sites.list();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async querySearchConsole({ site_url, start_date, end_date, dimensions = [] }) {
    const auth = await this.getAuthClient();
    const webmasters = google.webmasters({ version: 'v3', auth });
    
    const response = await webmasters.searchanalytics.query({
      siteUrl: site_url,
      requestBody: {
        startDate: start_date,
        endDate: end_date,
        dimensions: dimensions,
        rowLimit: 100,
      },
    });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async getAnalyticsReport({ property_id, start_date, end_date, metrics, dimensions = [] }) {
    const auth = await this.getAuthClient();
    const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
    
    const response = await analyticsData.properties.runReport({
      property: `properties/${property_id}`,
      requestBody: {
        dateRanges: [{ startDate: start_date, endDate: end_date }],
        metrics: metrics.map(name => ({ name })),
        dimensions: dimensions.map(name => ({ name })),
      },
    });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Google MCP Server running on stdio');
  }
}

const server = new GoogleMCPServer();
server.run().catch(console.error);