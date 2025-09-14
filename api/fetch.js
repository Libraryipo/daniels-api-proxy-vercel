export default async function handler(req, res) {
  // CORS Headers for Monday.com
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { query } = req.body;
    
    const response = await fetch('https://api.daniels-orchestral.com/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-ID': '1214',
        'X-API-Token': '028c3e27306b3441',
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch' });
  }
}
