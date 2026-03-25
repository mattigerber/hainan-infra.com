# HIP Frontend

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
cp .env.example .env.local
```

3. Fill required values in `.env.local`:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_POCKET_RPC` or `NEXT_PUBLIC_LAVA_RPC`

4. Start development server:

```bash
npm run dev
```

## WalletConnect Setup

1. Create a WalletConnect Cloud project and copy the project ID.
2. Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local`.
3. Restart the dev server after changing environment variables.

If `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is empty, the app keeps browser-injected wallets enabled and disables WalletConnect gracefully.

## Mainnet Configuration

The app is configured for Ethereum mainnet in wallet flows and chain switching.

## Deploy To GitHub Pages

This repository includes a GitHub Actions workflow at [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml) that builds and deploys static output directly to GitHub Pages in this same repository.

Required repository configuration:

1. In GitHub, set Pages source to **GitHub Actions**.
2. Add the following repository variables/secrets:

- Secret: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- Secret: `POCKET_RPC`
- Secret: `LAVA_RPC`
- Variable: `NEXT_PUBLIC_SITE_URL`
- Variable: `NEXT_PUBLIC_TICKET_SALE_CONTRACT_ADDRESS` (optional)

Local validation before pushing:

```bash
npm run build:pages
```

Notes:

- The Pages build is static. Server-only routes (`src/app/api/**`) and proxy middleware are excluded during the Pages export build.
- The normal server deployment flow still works through `npm run build` and `npm run start`.
- For project pages, static assets are emitted with the repository base path. For user/org pages repos named `*.github.io`, no project base path is applied.
