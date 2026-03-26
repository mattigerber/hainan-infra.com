# HIP Frontend

Next.js frontend for Hainan Infra public website content and wallet-enabled project flows.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Wagmi / Viem / Ethers wallet integrations

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
cp .env.example .env.local
```

3. Fill required values in `.env.local`:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (optional but recommended)
- `POCKET_RPC` or `LAVA_RPC` (mainnet RPC)

4. Start the app:

```bash
npm run dev
```

The local server runs via `server.js` (default: `HOSTNAME=0.0.0.0`, `PORT=3000`).

## Environment Variables

From `.env.example` and runtime usage in `src/lib/env.ts`:

- `NEXT_PUBLIC_SITE_URL`: Canonical site URL and metadata base.
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: WalletConnect Cloud project ID.
- `POCKET_RPC`: Mainnet RPC endpoint (server-side).
- `LAVA_RPC`: Mainnet RPC endpoint (server-side).
- `NEXT_PUBLIC_TICKET_SALE_CONTRACT_ADDRESS`: Optional ticket-sale contract address.
- `HOSTNAME`: Node server bind host (default `0.0.0.0`).
- `PORT`: Node server port (default `3000`).

Backward-compatible aliases still supported:

- `WALLETCONNECT_PROJECT_ID`
- `MAINNET_POCKET_RPC_URL`
- `MAINNET_LAVA_RPC_URL`

## Mainnet-Only Behavior

Wallet and chain logic are configured for Ethereum mainnet flows. This codebase does not rely on testnet/Sepolia paths for first-party runtime behavior.

## Available Scripts

- `npm run dev`: Start development server (`node server.js`).
- `npm run build`: Generate media manifests, then run Next.js production build.
- `npm run start`: Start production server with `NODE_ENV=production`.
- `npm run lint`: Run ESLint.
- `npm run scaffold:project-assets`: Scaffold/sync per-project asset folders.
- `npm run build:pages`: Build static output for GitHub Pages export (`out/`).

## Content And Media Pipeline

- `npm run build` automatically runs `scripts/generate-media-manifests.mjs`.
- Media manifests generated at:
  - `public/hero/media.json`
  - `public/partnershipmaker/images/index.json`
- Project listing data is loaded from:
  - `public/projects/index.json`
  - `public/projects/<project-id>/project.json`

Project image fallback logic supports these extensions when resolving gallery sources:

- `.webp`, `.avif`, `.jpg`, `.jpeg`, `.png`, `.gif`

This allows optimized assets (for example, `.webp`) to be used without breaking existing references.

## GitHub Pages Deployment

Workflows:

- CI: `.github/workflows/ci.yml`
- Deploy: `.github/workflows/deploy-pages.yml`

Flow:

1. CI runs on pull requests and pushes to `main`.
2. CI validates with TypeScript check + app build + Pages export build.
3. Deploy workflow runs after successful CI on `main` (or manual dispatch).

Required repository configuration:

1. Set GitHub Pages source to **GitHub Actions**.
2. Configure repository values:

- Secret: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- Secret: `POCKET_RPC`
- Secret: `LAVA_RPC`
- Variable: `NEXT_PUBLIC_SITE_URL`
- Variable: `NEXT_PUBLIC_TICKET_SALE_CONTRACT_ADDRESS` (optional)

Local Pages validation:

```bash
npm run build:pages
```

Pages export behavior:

- `src/app/api` and `src/proxy.ts` are temporarily disabled during export and restored after build.
- Export output is written to `out/`.
- Root `index.html` is generated as a redirect to `/en/`.
- Legacy-prefixed paths can be mirrored under `out/<prefix>/` when needed.
