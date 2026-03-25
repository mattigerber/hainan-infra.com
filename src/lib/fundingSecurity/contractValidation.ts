import { keccak256, toBytes, type Address, type PublicClient } from "viem";

/**
 * ProjectRegistry ABI - Reads contract addresses from on-chain registry
 * This ensures contract addresses come from an authoritative on-chain source
 */
export const projectRegistryAbi = [
  {
    type: "function",
    name: "getTicketContract",
    stateMutability: "view",
    inputs: [{ name: "projectId", type: "bytes32" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "verifyContractAddress",
    stateMutability: "view",
    inputs: [
      { name: "projectId", type: "bytes32" },
      { name: "ticketContract", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "verifyContractWithChecksum",
    stateMutability: "view",
    inputs: [
      { name: "projectId", type: "bytes32" },
      { name: "ticketContract", type: "address" },
      { name: "checksum", type: "bytes32" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

/**
 * Calculate checksum for a contract address
 * Matches the on-chain checksum: keccak256(abi.encodePacked(address))
 * This provides defense-in-depth against address tampering
 */
export const calculateAddressChecksum = (address: Address): string => {
  return keccak256(toBytes(address, { size: 20 }));
};

/**
 * Get project ID hash from string identifier
 * Used to query the ProjectRegistry
 */
export const getProjectIdHash = (projectId: string): string => {
  return keccak256(toBytes(projectId));
};

/**
 * Validate contract address against on-chain registry
 * Prevents CDN/supply-chain attacks by verifying addresses against authority
 */
export const validateContractAddressFromRegistry = async (
  publicClient: PublicClient,
  registryAddress: Address,
  projectId: string,
  ticketContractAddress: Address
): Promise<boolean> => {
  try {
    const projectIdHash = getProjectIdHash(projectId);
    const isValid = await publicClient.readContract({
      address: registryAddress,
      abi: projectRegistryAbi,
      functionName: "verifyContractAddress",
      args: [projectIdHash as `0x${string}`, ticketContractAddress],
    });
    return isValid as boolean;
  } catch {
    return false;
  }
};

/**
 * Validate contract address with checksum against on-chain registry
 * Strongest validation: requires BOTH address AND checksum match
 */
export const validateContractWithChecksumFromRegistry = async (
  publicClient: PublicClient,
  registryAddress: Address,
  projectId: string,
  ticketContractAddress: Address,
  checksum: string
): Promise<boolean> => {
  try {
    const projectIdHash = getProjectIdHash(projectId);
    const isValid = await publicClient.readContract({
      address: registryAddress,
      abi: projectRegistryAbi,
      functionName: "verifyContractWithChecksum",
      args: [projectIdHash as `0x${string}`, ticketContractAddress, checksum as `0x${string}`],
    });
    return isValid as boolean;
  } catch {
    return false;
  }
};

/**
 * Get the registered ticket contract address from the registry
 * Returns null if no address is registered for this project
 */
export const getTicketContractFromRegistry = async (
  publicClient: PublicClient,
  registryAddress: Address,
  projectId: string
): Promise<Address | null> => {
  try {
    const projectIdHash = getProjectIdHash(projectId);
    const contractAddress = await publicClient.readContract({
      address: registryAddress,
      abi: projectRegistryAbi,
      functionName: "getTicketContract",
      args: [projectIdHash as `0x${string}`],
    });
    
    if (contractAddress === "0x0000000000000000000000000000000000000000") {
      return null;
    }
    
    return contractAddress as Address;
  } catch {
    return null;
  }
};
