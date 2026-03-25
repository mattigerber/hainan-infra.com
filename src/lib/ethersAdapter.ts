import { Contract, JsonRpcProvider, type InterfaceAbi } from "ethers";
import type { Abi, Address, PublicClient } from "viem";
import { publicEnv } from "./env";

type ReadContractParams = {
  publicClient: PublicClient;
  contractAddress: Address;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
};

const toOptionalUrl = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getDefaultRpcUrl = (publicClient: PublicClient): string | null => {
  const chainDefaultUrl = publicClient.chain?.rpcUrls?.default?.http?.[0];
  return typeof chainDefaultUrl === "string" && chainDefaultUrl.length > 0 ? chainDefaultUrl : null;
};

const pickRpcUrl = (publicClient: PublicClient): string => {
  const candidates = [
    toOptionalUrl(publicEnv.pocketRpcUrl),
    toOptionalUrl(publicEnv.lavaRpcUrl),
    getDefaultRpcUrl(publicClient),
  ];

  const selected = candidates.find((candidate): candidate is string => candidate !== null);
  if (!selected) {
    throw new Error("No RPC URL is configured for ethers read execution.");
  }

  return selected;
};

export const createEthersReadProvider = (publicClient: PublicClient): JsonRpcProvider => {
  const rpcUrl = pickRpcUrl(publicClient);
  const chainId = publicClient.chain?.id;

  return new JsonRpcProvider(
    rpcUrl,
    typeof chainId === "number"
      ? {
          chainId,
          name: publicClient.chain?.name ?? "hip-chain",
        }
      : undefined,
    {
      staticNetwork: true,
    }
  );
};

export const ethersReadContract = async ({
  publicClient,
  contractAddress,
  abi,
  functionName,
  args = [],
}: ReadContractParams): Promise<unknown> => {
  const provider = createEthersReadProvider(publicClient);
  const contract = new Contract(contractAddress, abi as InterfaceAbi, provider);
  const contractMethod = (contract as Record<string, (...methodArgs: unknown[]) => Promise<unknown>>)[
    functionName
  ];

  if (typeof contractMethod !== "function") {
    throw new Error(`Ethers adapter missing contract method: ${functionName}`);
  }

  return contractMethod(...args);
};

export const ethersLatestBlockTimestamp = async (publicClient: PublicClient): Promise<bigint> => {
  const provider = createEthersReadProvider(publicClient);
  const latestBlock = await provider.getBlock("latest");

  if (!latestBlock) {
    throw new Error("Unable to read latest block from ethers provider.");
  }

  return BigInt(latestBlock.timestamp);
};
