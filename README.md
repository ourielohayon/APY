# APY Monitor v2 — Compound v3 USDC (Base) & Morpho Seamless USDC Vault

- Fixes the Morpho APY by trying multiple API endpoints and lowercasing the vault address.
- Adds **rich error details** on the page to see what's wrong if Morpho's API changes.

## Deploy
1. Create a GitHub repo and upload these files (or use Vercel CLI).
2. Import the repo on Vercel and deploy.
3. Visit `/api/morpho?vault=0x616a4e1db48e22028f6bbf20444cd3b8e3273738` to see raw JSON.
