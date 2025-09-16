export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ ok: false, error: "Missing 'query' field" });
    }

    const response = await fetch(`${process.env.DANIELS_API_BASE}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DANIELS_API_KEY}`,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
}
