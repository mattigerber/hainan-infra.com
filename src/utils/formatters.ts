export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export const formatWalletAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export const formatProjectUid = (projectKey: string) =>
  projectKey.toUpperCase().startsWith("HIP-")
    ? projectKey.toUpperCase()
    : `HIP-${projectKey.replace(/[^a-z0-9]/gi, "").toUpperCase()}`;