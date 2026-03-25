import { isAddress, type Address, type PublicClient, type WalletClient } from "viem";
import {
  projectRegistryAbi,
  calculateAddressChecksum,
  getProjectIdHash,
  validateContractAddressFromRegistry,
  validateContractWithChecksumFromRegistry,
  getTicketContractFromRegistry,
} from "./fundingSecurity";
import { parseErrorMessage } from "@/utils/errorHandling";

export const contributionContractAbi = [
  {
    type: "event",
    name: "InvestorPurchase",
    inputs: [
      { name: "investor", type: "address", indexed: true },
      { name: "ticketAmount", type: "uint256", indexed: true },
      { name: "stablecoinAmount", type: "uint256", indexed: false },
      { name: "partnerAmount", type: "uint256", indexed: false },
      { name: "partnershipAgreementAmount", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "InvalidInput",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientAllowance",
    inputs: [
      { name: "required", type: "uint256" },
      { name: "current", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "FundraisingNotStarted",
    inputs: [
      { name: "start", type: "uint256" },
      { name: "current", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "FundraisingEnded",
    inputs: [
      { name: "end", type: "uint256" },
      { name: "current", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "TicketSupplyExceeded",
    inputs: [
      { name: "requested", type: "uint256" },
      { name: "remaining", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "MaxCapExceeded",
    inputs: [
      { name: "maxcap", type: "uint256" },
      { name: "processed", type: "uint256" },
      { name: "incoming", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "ReentrancyBlocked",
    inputs: [],
  },
  {
    type: "error",
    name: "TokenTransferFailed",
    inputs: [],
  },
  {
    type: "function",
    name: "STABLECOIN_ADDRESS",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "MILA_AGREEMENT_ADDRESS",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "MSA_AGREEMENT_ADDRESS_GETTER",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "ITL_AGREEMENT_ADDRESS",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "PARTNERSHIP_COMMITMENT_BPS",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint16" }],
  },
  {
    type: "function",
    name: "TICKET_PRICE",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "TOTAL_TICKET_AMOUNT",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "PROJECT_FUNDRAISING_START",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "PROJECT_FUNDRAISING_END",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "PROJECT_FUNDRAISING_MAXCAP",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalTicketsSold",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalStablecoinProcessed",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "investorAllocation",
    stateMutability: "view",
    inputs: [{ name: "investor", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "buyTicket",
    stateMutability: "nonpayable",
    inputs: [{ name: "ticketAmount", type: "uint256" }],
    outputs: [],
  },
] as const;

export const SALE_STATUS = {
  UPCOMING: 0,
  ACTIVE: 1,
  ENDED: 2,
} as const;

export type SaleStatusLabel = "Upcoming" | "Active" | "Ended";

export type SaleSnapshot = {
  contractAddress: Address;
  paymentToken: Address;
  ticketPrice: bigint;
  maxTickets: bigint;
  ticketsSold: bigint;
  ticketsLeft: bigint;
  start: bigint;
  end: bigint;
  statusCode: number;
  saleStatus: SaleStatusLabel;
};

export type UserSnapshot = {
  ownedTickets: bigint;
  canBuyNow: boolean;
  ticketsLeft: bigint;
};

const extractErrorMessages = (value: unknown): string[] => {
  const messages: string[] = [];
  const queue: unknown[] = [value];
  const visited = new Set<unknown>();

  while (queue.length > 0) {
    const next = queue.shift();
    if (!next || visited.has(next)) continue;
    visited.add(next);

    if (next instanceof Error && next.message.trim().length > 0) {
      messages.push(next.message);
    }

    if (typeof next === "object") {
      const record = next as Record<string, unknown>;
      const shortMessage = record.shortMessage;
      const details = record.details;
      const message = record.message;
      const cause = record.cause;

      if (typeof shortMessage === "string" && shortMessage.trim().length > 0) {
        messages.push(shortMessage);
      }
      if (typeof details === "string" && details.trim().length > 0) {
        messages.push(details);
      }
      if (typeof message === "string" && message.trim().length > 0) {
        messages.push(message);
      }
      if (cause) {
        queue.push(cause);
      }
    }
  }

  return Array.from(new Set(messages));
};

const explainBuyRevert = (error: unknown): string => {
  const text = extractErrorMessages(error).join(" | ").toLowerCase();

  if (text.includes("salenotstarted") || text.includes("fundraisingnotstarted")) {
    return "Sale has not started yet.";
  }
  if (text.includes("saleended") || text.includes("fundraisingended")) {
    return "Sale has already ended.";
  }
  if (text.includes("soldout") || text.includes("ticketsupplyexceeded")) {
    return "Not enough tickets left for this purchase.";
  }
  if (text.includes("insufficientallowance")) {
    return "Payment token allowance is insufficient. Please approve and try again.";
  }
  if (text.includes("tokentransferfailed") || text.includes("insufficient funds")) {
    return "Payment token transfer failed. Please confirm your token balance and retry.";
  }

  return parseErrorMessage(
    error,
    "Purchase simulation reverted on-chain. Confirm sale window, ticket availability, and payment token balance."
  );
};

const asBigInt = (value: unknown) => {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(Math.max(0, Math.floor(value)));
  return BigInt(0);
};

type RecipientFunctionName =
  | "MILA_AGREEMENT_ADDRESS"
  | "MSA_AGREEMENT_ADDRESS_GETTER"
  | "ITL_AGREEMENT_ADDRESS";

const readRecipientAddress = async (
  publicClient: PublicClient,
  contractAddress: Address,
  functionNames: readonly RecipientFunctionName[]
): Promise<Address> => {
  for (const functionName of functionNames) {
    try {
      const value = await publicClient.readContract({
        address: contractAddress,
        abi: contributionContractAbi,
        functionName,
      });

      if (typeof value === "string" && isAddress(value)) {
        return value as Address;
      }
    } catch {
      // Keep trying aliases for contract compatibility.
    }
  }

  throw new Error(`Contract does not expose a supported recipient getter (${functionNames.join(" or ")}).`);
};

const toSaleStatusLabel = (statusCode: number): SaleStatusLabel => {
  if (statusCode === SALE_STATUS.UPCOMING) return "Upcoming";
  if (statusCode === SALE_STATUS.ENDED) return "Ended";
  return "Active";
};

const deriveSaleStatusCode = (
  nowTs: bigint,
  start: bigint,
  end: bigint,
  ticketsSold: bigint,
  maxTickets: bigint,
  totalProcessed: bigint,
  maxCap: bigint
): number => {
  if (nowTs < start) return SALE_STATUS.UPCOMING;
  if (nowTs > end || ticketsSold >= maxTickets || totalProcessed >= maxCap) {
    return SALE_STATUS.ENDED;
  }
  return SALE_STATUS.ACTIVE;
};

export const resolveTicketSaleAddress = (address: string): Address | null => {
  if (!isAddress(address)) return null;
  return address as Address;
};

export const readSaleSnapshot = async (
  publicClient: PublicClient,
  contractAddress: Address
): Promise<SaleSnapshot> => {
  const [
    paymentTokenRaw,
    ticketPriceRaw,
    maxTicketsRaw,
    ticketsSoldRaw,
    startRaw,
    endRaw,
    maxCapRaw,
    totalProcessedRaw,
    latestBlock,
  ] = await Promise.all([
    publicClient.readContract({
      address: contractAddress,
      abi: contributionContractAbi,
      functionName: "STABLECOIN_ADDRESS",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: contributionContractAbi,
      functionName: "TICKET_PRICE",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: contributionContractAbi,
      functionName: "TOTAL_TICKET_AMOUNT",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: contributionContractAbi,
      functionName: "totalTicketsSold",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: contributionContractAbi,
      functionName: "PROJECT_FUNDRAISING_START",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: contributionContractAbi,
      functionName: "PROJECT_FUNDRAISING_END",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: contributionContractAbi,
      functionName: "PROJECT_FUNDRAISING_MAXCAP",
    }),
    publicClient.readContract({
      address: contractAddress,
      abi: contributionContractAbi,
      functionName: "totalStablecoinProcessed",
    }),
    publicClient.getBlock({ blockTag: "latest" }),
  ]);

  const ticketPrice = asBigInt(ticketPriceRaw);
  const maxTickets = asBigInt(maxTicketsRaw);
  const ticketsSold = asBigInt(ticketsSoldRaw);
  const start = asBigInt(startRaw);
  const end = asBigInt(endRaw);
  const maxCap = asBigInt(maxCapRaw);
  const totalProcessed = asBigInt(totalProcessedRaw);
  const ticketsLeft = maxTickets > ticketsSold ? maxTickets - ticketsSold : BigInt(0);
  const nowTs = asBigInt(latestBlock.timestamp);
  const statusCode = deriveSaleStatusCode(
    nowTs,
    start,
    end,
    ticketsSold,
    maxTickets,
    totalProcessed,
    maxCap
  );

  if (typeof paymentTokenRaw !== "string" || !isAddress(paymentTokenRaw)) {
    throw new Error("Contract returned an invalid payment token address.");
  }

  return {
    contractAddress,
    paymentToken: paymentTokenRaw as Address,
    ticketPrice,
    maxTickets,
    ticketsSold,
    ticketsLeft,
    start,
    end,
    statusCode,
    saleStatus: toSaleStatusLabel(statusCode),
  };
};

export const readUserSnapshot = async (
  publicClient: PublicClient,
  contractAddress: Address,
  userAddress: Address
): Promise<UserSnapshot> => {
  const [allocationRaw, sale] = await Promise.all([
    publicClient.readContract({
      address: contractAddress,
      abi: contributionContractAbi,
      functionName: "investorAllocation",
      args: [userAddress],
    }),
    readSaleSnapshot(publicClient, contractAddress),
  ]);

  const ownedTickets = asBigInt(allocationRaw);

  return {
    ownedTickets,
    canBuyNow: sale.saleStatus === "Active" && sale.ticketsLeft > BigInt(0),
    ticketsLeft: sale.ticketsLeft,
  };
};

export const readErc20Balance = async (
  publicClient: PublicClient,
  tokenAddress: Address,
  owner: Address
) => {
  const balanceRaw = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [owner],
  });

  return asBigInt(balanceRaw);
};

const ensureAllowance = async (
  publicClient: PublicClient,
  walletClient: WalletClient,
  owner: Address,
  spender: Address,
  tokenAddress: Address,
  requiredAmount: bigint
) => {
  const allowanceRaw = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender],
  });

  const allowance = asBigInt(allowanceRaw);
  if (allowance >= requiredAmount) {
    return;
  }

  const approveHash = await walletClient.writeContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, requiredAmount],
    account: owner,
    chain: walletClient.chain,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash: approveHash });
  if (receipt.status !== "success") {
    throw new Error("Token approval transaction failed.");
  }
};

export const executeBuyTicket = async (
  publicClient: PublicClient,
  walletClient: WalletClient,
  contractAddress: Address,
  buyer: Address,
  ticketAmount: number
) => {
  if (!Number.isInteger(ticketAmount) || ticketAmount <= 0) {
    throw new Error("Ticket amount must be a positive integer.");
  }

  const ticketAmountBigInt = BigInt(ticketAmount);

  const walletChainId = walletClient.chain?.id;
  const publicChainId = publicClient.chain?.id;
  if (
    typeof walletChainId === "number" &&
    typeof publicChainId === "number" &&
    walletChainId !== publicChainId
  ) {
    throw new Error("Wallet network does not match the configured sale network.");
  }

  const sale = await readSaleSnapshot(publicClient, contractAddress);

  if (sale.saleStatus === "Upcoming") {
    throw new Error("Sale has not started yet.");
  }

  if (sale.saleStatus === "Ended") {
    throw new Error("Sale has already ended.");
  }

  if (sale.ticketsLeft < ticketAmountBigInt) {
    throw new Error("Not enough tickets left for this purchase.");
  }

  const totalPrice = sale.ticketPrice * ticketAmountBigInt;

  let partnerRecipient: Address;
  let hipPrimaryRecipient: Address;
  let hipSecondaryRecipient: Address;
  let partnershipCommitmentBps: bigint;
  let feeAmount: bigint;
  let primaryFeeAmount: bigint;
  let secondaryFeeAmount: bigint;
  let partnerAmount: bigint;

  try {
    const [partnerRecipientRaw, hipPrimaryRecipientRaw, hipSecondaryRecipientRaw, partnershipCommitmentRaw] =
      await Promise.all([
      publicClient.readContract({
        address: contractAddress,
        abi: contributionContractAbi,
        functionName: "MILA_AGREEMENT_ADDRESS",
      }),
      readRecipientAddress(publicClient, contractAddress, ["MSA_AGREEMENT_ADDRESS_GETTER"]),
      readRecipientAddress(publicClient, contractAddress, ["ITL_AGREEMENT_ADDRESS"]),
      publicClient.readContract({
        address: contractAddress,
        abi: contributionContractAbi,
        functionName: "PARTNERSHIP_COMMITMENT_BPS",
      }),
    ]);

    if (typeof partnerRecipientRaw !== "string" || !isAddress(partnerRecipientRaw)) {
      throw new Error("Contract does not expose a valid partner recipient address.");
    }
    if (typeof hipPrimaryRecipientRaw !== "string" || !isAddress(hipPrimaryRecipientRaw)) {
      throw new Error("Contract does not expose a valid primary fee recipient address.");
    }
    if (typeof hipSecondaryRecipientRaw !== "string" || !isAddress(hipSecondaryRecipientRaw)) {
      throw new Error("Contract does not expose a valid secondary fee recipient address.");
    }

    partnerRecipient = partnerRecipientRaw as Address;
    hipPrimaryRecipient = hipPrimaryRecipientRaw as Address;
    hipSecondaryRecipient = hipSecondaryRecipientRaw as Address;

    if (partnerRecipient === "0x0000000000000000000000000000000000000000") {
      throw new Error("Partner recipient address is zero.");
    }
    if (hipPrimaryRecipient === "0x0000000000000000000000000000000000000000") {
      throw new Error("Primary fee recipient address is zero.");
    }
    if (hipSecondaryRecipient === "0x0000000000000000000000000000000000000000") {
      throw new Error("Secondary fee recipient address is zero.");
    }

    const partnerRecipientLower = partnerRecipient.toLowerCase();
    const hipPrimaryRecipientLower = hipPrimaryRecipient.toLowerCase();
    const hipSecondaryRecipientLower = hipSecondaryRecipient.toLowerCase();

    if (
      partnerRecipientLower === hipPrimaryRecipientLower ||
      partnerRecipientLower === hipSecondaryRecipientLower ||
      hipPrimaryRecipientLower === hipSecondaryRecipientLower
    ) {
      throw new Error("All payout recipients must be different addresses.");
    }

    partnershipCommitmentBps = asBigInt(partnershipCommitmentRaw);
    feeAmount = (totalPrice * partnershipCommitmentBps) / BigInt(10_000);
    primaryFeeAmount = feeAmount / BigInt(2);
    secondaryFeeAmount = feeAmount - primaryFeeAmount;
    partnerAmount = totalPrice - feeAmount;
  } catch (error) {
    throw new Error(
      `${parseErrorMessage(error, "Contract recipient configuration is missing or unreadable.")} [contract=${contractAddress}]`
    );
  }

  const allowanceRaw = await publicClient.readContract({
    address: sale.paymentToken,
    abi: erc20Abi,
    functionName: "allowance",
    args: [buyer, contractAddress],
  });
  const preflightAllowance = asBigInt(allowanceRaw);

  const buyerBalance = await readErc20Balance(publicClient, sale.paymentToken, buyer);
  if (buyerBalance < totalPrice) {
    throw new Error("Insufficient payment token balance for the requested ticket amount.");
  }

  await ensureAllowance(
    publicClient,
    walletClient,
    buyer,
    contractAddress,
    sale.paymentToken,
    totalPrice
  );

  // Verify that the payment token accepts the same transferFrom route used by buy().
  // This must run after allowance is ensured, otherwise simulation can fail with false positives.
  try {
    const previewPartnerTransfer = await publicClient.simulateContract({
      address: sale.paymentToken,
      abi: erc20TransferAbi,
      functionName: "transferFrom",
      args: [buyer, partnerRecipient, partnerAmount],
      account: contractAddress,
    });

    if (previewPartnerTransfer.result === false) {
      throw new Error("Payment token rejected transferFrom to partner recipient.");
    }

    if (primaryFeeAmount > BigInt(0)) {
      const previewHipPrimaryTransfer = await publicClient.simulateContract({
        address: sale.paymentToken,
        abi: erc20TransferAbi,
        functionName: "transferFrom",
        args: [buyer, hipPrimaryRecipient, primaryFeeAmount],
        account: contractAddress,
      });

      if (previewHipPrimaryTransfer.result === false) {
        throw new Error("Payment token rejected transferFrom to primary fee recipient.");
      }
    }

    if (secondaryFeeAmount > BigInt(0)) {
      const previewHipSecondaryTransfer = await publicClient.simulateContract({
        address: sale.paymentToken,
        abi: erc20TransferAbi,
        functionName: "transferFrom",
        args: [buyer, hipSecondaryRecipient, secondaryFeeAmount],
        account: contractAddress,
      });

      if (previewHipSecondaryTransfer.result === false) {
        throw new Error("Payment token rejected transferFrom to secondary fee recipient.");
      }
    }
  } catch (error) {
    const transferRouteMessage = parseErrorMessage(
      error,
      "Payment token transfer route preflight failed."
    );

    throw new Error(
      `${transferRouteMessage} [paymentToken=${sale.paymentToken}; partnerRecipient=${partnerRecipient}; hipPrimaryRecipient=${hipPrimaryRecipient}; hipSecondaryRecipient=${hipSecondaryRecipient}; partnerAmount=${partnerAmount.toString()}; primaryFeeAmount=${primaryFeeAmount.toString()}; secondaryFeeAmount=${secondaryFeeAmount.toString()}; feeAmount=${feeAmount.toString()}]`
    );
  }

  let simulated;
  try {
    simulated = await publicClient.simulateContract({
      address: contractAddress,
      abi: contributionContractAbi,
      functionName: "buyTicket",
      args: [ticketAmountBigInt],
      account: buyer,
    });
  } catch (error) {
    const explained = explainBuyRevert(error);
    const diagnostic = [
      `contract=${contractAddress}`,
      `buyer=${buyer}`,
      `paymentToken=${sale.paymentToken}`,
      `ticketAmount=${ticketAmountBigInt.toString()}`,
      `partnerRecipient=${partnerRecipient}`,
      `hipPrimaryRecipient=${hipPrimaryRecipient}`,
      `hipSecondaryRecipient=${hipSecondaryRecipient}`,
      `saleStatus=${sale.saleStatus}`,
      `ticketsLeft=${sale.ticketsLeft.toString()}`,
      `ticketPrice=${sale.ticketPrice.toString()}`,
      `totalPrice=${totalPrice.toString()}`,
      `allowance=${preflightAllowance.toString()}`,
      `balance=${buyerBalance.toString()}`,
    ].join("; ");

    throw new Error(`${explained} [${diagnostic}]`);
  }

  const hash = await walletClient.writeContract(simulated.request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (receipt.status !== "success") {
    throw new Error("Ticket purchase transaction failed.");
  }
  return hash;
};

export const erc20Abi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "transferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const erc20TransferAbi = [
  {
    type: "function",
    name: "transferFrom",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const erc20AllowanceAbi = [
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

// Backward-compatible alias kept for any external references.
export { contributionContractAbi as ticketSaleAbi };

// Re-export security functions from fundingSecurity module for convenient imports.
export { projectRegistryAbi, calculateAddressChecksum, getProjectIdHash, validateContractAddressFromRegistry, validateContractWithChecksumFromRegistry, getTicketContractFromRegistry };
