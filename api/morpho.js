// /api/morpho.js - Vercel Serverless Function
export default async function handler(req, res) {
  try {
    const { vault } = req.query || {};
    if (!vault) {
      res.status(400).json({ error: "missing vault query param" });
      return;
    }

    const endpoints = [
      `https://api.morpho.org/base/vaults/${vault}`,
      `https://api.morpho.org/v1/base/vaults/${vault}`,
      `https://api.morpho.org/vaults/${vault}`
    ];

    let data = null, lastErr = null;
    for (const url of endpoints) {
      try {
        const r = await fetch(url, { method: "GET", headers: { "accept": "application/json" } });
        if (!r.ok) { lastErr = new Error("HTTP " + r.status); continue; }
        data = await r.json();
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (!data) {
      res.status(502).json({ error: "upstream failed", detail: String(lastErr) });
      return;
    }

    // Cache for 60s at the edge (tweak if you want fresher)
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "server error", detail: String(e) });
  }
}
