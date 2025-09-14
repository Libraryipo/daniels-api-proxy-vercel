const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allows Monday.com to access your proxy
app.use(cors({
  origin: [
    /\.monday\.com$/,
    /\.monday-dev\.com$/,
    'https://monday.com',
    'http://localhost:3000' // for local testing
  ],
  credentials: true
}));

app.use(express.json());

// Your Daniels API credentials (will be environment variables on Railway)
const DANIELS_API_ID = process.env.DANIELS_API_ID || '1214';
const DANIELS_API_TOKEN = process.env.DANIELS_API_TOKEN || '028c3e27306b3441';
const DANIELS_BASE_URL = 'https://api.daniels-orchestral.com';

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Daniels API Proxy is running!',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/search', '/api/fetch']
  });
});

// Search endpoint - searches the Daniels database
app.post('/api/search', async (req, res) => {
  try {
    console.log('🎼 Search request:', req.body);
    
    const response = await fetch(`${DANIELS_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-ID': DANIELS_API_ID,
        'X-API-Token': DANIELS_API_TOKEN,
      },
      body: JSON.stringify(req.body)
    });

    console.log('📡 Daniels API response status:', response.status);

    if (!response.ok) {
      throw new Error(`Daniels API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched search results');
    
    res.json(data);
  } catch (error) {
    console.error('❌ Search error:', error.message);
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Fetch endpoint - gets detailed orchestration info
app.post('/api/fetch', async (req, res) => {
  try {
    console.log('🎵 Fetch request:', req.body);
    
    const response = await fetch(`${DANIELS_BASE_URL}/fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-API-ID': DANIELS_API_ID,
        'X-API-Token': DANIELS_API_TOKEN,
      },
      body: JSON.stringify(req.body)
    });

    console.log('📡 Daniels API response status:', response.status);

    if (!response.ok) {
      throw new Error(`Daniels API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched orchestration details');
    
    res.json(data);
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Daniels API Proxy running on port ${PORT}`);
  console.log(`🎼 API ID: ${DANIELS_API_ID}`);
  console.log(`🔐 Token: ${DANIELS_API_TOKEN ? DANIELS_API_TOKEN.substring(0, 8) + '...' : 'Not set'}`);
});