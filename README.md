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
