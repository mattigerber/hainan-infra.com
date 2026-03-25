const readPublicEnv = (value: string | undefined) => value?.trim() ?? '';

const walletConnectProjectId = readPublicEnv(
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
) || readPublicEnv(
  process.env.WALLETCONNECT_PROJECT_ID
);

const pocketRpcUrl =
  readPublicEnv(process.env.POCKET_RPC) ||
  readPublicEnv(process.env.MAINNET_POCKET_RPC_URL);

const lavaRpcUrl =
  readPublicEnv(process.env.LAVA_RPC) ||
  readPublicEnv(process.env.MAINNET_LAVA_RPC_URL);

// Backward-compatible aliases while old variable names are phased out.
const mainnetPocketRpcUrl = pocketRpcUrl;
const mainnetLavaRpcUrl = lavaRpcUrl;
const ticketSaleContractAddress = readPublicEnv(
  process.env.NEXT_PUBLIC_TICKET_SALE_CONTRACT_ADDRESS
);

const siteUrl = readPublicEnv(process.env.NEXT_PUBLIC_SITE_URL) || "https://hainan-infra.com";

export const publicEnv = {
  walletConnectProjectId,
  hasWalletConnectProjectId: walletConnectProjectId.length > 0,
  pocketRpcUrl,
  lavaRpcUrl,
  hasPocketRpcUrl: pocketRpcUrl.length > 0,
  hasLavaRpcUrl: lavaRpcUrl.length > 0,
  mainnetLavaRpcUrl,
  mainnetPocketRpcUrl,
  ticketSaleContractAddress,
  siteUrl,
} as const;