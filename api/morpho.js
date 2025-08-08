// /api/morpho.js - Vercel Serverless Function with better fallbacks & logs
export const config = { runtime: "nodejs18.x" };

async function tryJSON(url) {
  const r = await fetch(url, {
    headers: {
      "accept": "application/json",
      "user-agent": "apy-monitor/1.0 (+vercel)"
    },
    cache: "no-store"
  });
  if (!r.ok) throw new Error(`Upstream ${url} -> HTTP ${r.status}`);
  return await r.json();
}

export default async function handler(req, res) {
  try {
    const { vault } = req.query || {};
    if (!vault) return res.status(400).json({ error: "missing vault query param" });

    const address = String(vault).toLowerCase();

    const endpoints = [
      `https://api.morpho.org/base/vaults/${address}`,
      `https://api.morpho.org/v1/base/vaults/${address}`,
      `https://api.morpho.org/vaults/${address}`,
      // Some APIs expose a list; we can search it as a fallback
      `https://api.morpho.org/base/vaults`,
      `https://api.morpho.org/v1/base/vaults`
    ];

    let data = null, notes = [];
    for (const url of endpoints) {
      try {
        const payload = await tryJSON(url);
        // If it's an array, find our vault
        if (Array.isArray(payload)) {
          const found = payload.find(v => (v?.address || v?.vault || "").toLowerCase() === address);
          if (found) { data = found; break; }
          notes.push(`list length=${payload.length} but not found`);
          continue;
        }
        // Otherwise assume single vault object
        data = payload;
        break;
      } catch (e) {
        notes.push(String(e));
        continue;
      }
    }

    if (!data) {
      return res.status(502).json({ error: "upstream failed", notes });
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=30");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ ...data, _notes: notes });
  } catch (e) {
    return res.status(500).json({ error: "server error", detail: String(e) });
  }
}
