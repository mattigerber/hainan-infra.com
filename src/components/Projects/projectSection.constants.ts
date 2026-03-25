export const MAINNET_USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as const;

export const getUsdcAddressForChain = (_chainId: number) => {
  return MAINNET_USDC_ADDRESS;
};
