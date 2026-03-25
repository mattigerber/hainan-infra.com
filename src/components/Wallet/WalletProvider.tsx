"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, walletConnect } from '@wagmi/connectors';
import { ReactNode, useState } from 'react';
import { createConfig, createStorage, fallback, http, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { publicEnv } from '@/lib/env';

export const walletConnectProjectId = publicEnv.walletConnectProjectId;
const isBrowser = typeof window !== 'undefined';

const buildChainTransport = (primaryUrl: string, fallbackUrl: string) => {
  const transports = [];

  if (primaryUrl.length > 0) {
    transports.push(http(primaryUrl));
  }

  if (fallbackUrl.length > 0) {
    transports.push(http(fallbackUrl));
  }

  // Final safety-net so reads still work if env URLs are absent.
  transports.push(http());

  return fallback(transports);
};

if (typeof window !== 'undefined') {
  if (!publicEnv.hasPocketRpcUrl && publicEnv.hasLavaRpcUrl) {
    console.warn('NEXT_PUBLIC_POCKET_RPC is not configured. Falling back to NEXT_PUBLIC_LAVA_RPC as primary RPC.');
  } else if (!publicEnv.hasPocketRpcUrl && !publicEnv.hasLavaRpcUrl) {
    console.warn('Neither NEXT_PUBLIC_POCKET_RPC nor NEXT_PUBLIC_LAVA_RPC is configured. Falling back to default chain RPC.');
  }
}

const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: true,
  connectors: isBrowser
    ? [
        injected({
          shimDisconnect: true,
        }),
        ...(publicEnv.hasWalletConnectProjectId
          ? [
              walletConnect({
                projectId: walletConnectProjectId,
                showQrModal: true,
                qrModalOptions: {
                  themeMode: 'dark',
                },
              }),
            ]
          : []),
      ]
    : [],
  transports: {
    [mainnet.id]: buildChainTransport(
      publicEnv.pocketRpcUrl,
      publicEnv.lavaRpcUrl
    ),
  },
  storage: createStorage({
    storage: isBrowser ? window.localStorage : undefined,
  }),
  ssr: true,
});

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config} reconnectOnMount={true}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );
}
