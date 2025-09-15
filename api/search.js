const fetch = require('node-fetch');

// Daniels API configuration
const DANIELS_API_ID = '1214';
const DANIELS_API_TOKEN = '028c3e27306b3441';
const DANIELS_BASE_URL = 'https://api.daniels-orchestral.com';

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        error: 'Query parameter is required'
      });
    }

    console.log(`🎼 Searching Daniels API for: "${query}"`);

    const response = await fetch(`${DANIELS_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-ID': DANIELS_API_ID,
        'X-API-Token': DANIELS_API_TOKEN,
      },
      body: JSON.stringify({
        query: query.trim()
      })
    });

    if (!response.ok) {
      console.error(`❌ Daniels API error: ${response.status} ${response.statusText}`);
      
      if (response.status === 401) {
        return res.status(401).json({
          error: 'Invalid API credentials'
        });
      }
      
      if (response.status === 404) {
        return res.status(404).json({
          error: 'Daniels API endpoint not found'
        });
      }

      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Daniels API error: ${response.status} - ${errorText}`
      });
    }

    const data = await response.json();
    console.log(`✅ Daniels API search successful for: "${query}"`);

    return res.status(200).json(data);

  } catch (error) {
    console.error('❌ Proxy search error:', error);
    
    if (error.code === 'ENOTFOUND') {
      return res.status(503).json({
        error: 'Unable to reach Daniels API. Please try again later.'
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};
