# APY Monitor — Compound v3 USDC (Base) & Morpho Seamless USDC Vault

Deploys on Vercel in one click. The site is static (`index.html`) + a serverless function (`/api/morpho`) 
that fetches the Morpho Vault APY so CORS can never block it.

## Quick Deploy (One Click)

1. Go to **vercel.com/new** → drag this folder (or the ZIP) into the UI.
2. Click **Deploy**. No settings needed.
3. Open your Vercel URL — the dashboard will load and refresh every 20 minutes.

## Local Dev
```bash
npm i -g vercel   # if not installed
vercel dev
# open http://localhost:3000
```

## Notes
- Compound rates are pulled client-side from Base RPC.
- Morpho APY is proxied via `/api/morpho?vault=0x616a...3738`.
- You can add more vaults or protocols by copying the pattern.
