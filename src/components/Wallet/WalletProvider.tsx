"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, walletConnect } from '@wagmi/connectors';
import { ReactNode, useState } from 'react';
import { createConfig, createStorage, fallback, http, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { publicEnv } from '@/lib/env';

export const walletConnectProjectId = publicEnv.walletConnectProjectId;
const isBrowser = typeof window !== 'undefined';
const pocketRpcProxyPath = '/api/rpc/pocket';
const lavaRpcProxyPath = '/api/rpc/lava';

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
  console.info('Using server-side RPC proxy endpoints for on-chain reads.');
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
      pocketRpcProxyPath,
      lavaRpcProxyPath
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
      <WagmiProvider config={config} reconnectOnMount={false}>
        {children}
      </WagmiProvider>
    </QueryClientProvider>
  );
}
