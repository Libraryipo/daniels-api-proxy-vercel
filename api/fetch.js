const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    console.log(`🎼 Fetching from Daniels API for: "${query}"`);

    const response = await fetch('https://api.daniels-orchestral.com/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-ID': '1214',
        'X-API-Token': '028c3e27306b3441',
      },
      body: JSON.stringify({ query: query.trim() })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Daniels API error: ${response.status} - ${errorText}`
      });
    }

    const data = await response.json();
    console.log(`✅ Daniels API fetch successful for: "${query}"`);

    return res.status(200).json(data);

  } catch (error) {
    console.error('❌ Proxy fetch error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};
