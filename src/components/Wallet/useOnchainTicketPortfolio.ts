"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useChainId, usePublicClient, useWalletClient } from "wagmi";

import type { ListedProject } from "@/data/projectFilterSystem";
import {
  executeBuyTicket,
  readSaleSnapshot,
  readUserSnapshot,
  resolveTicketSaleAddress,
} from "@/lib/contracts";
import { parseErrorMessage } from "@/utils/errorHandling";

type HoldingsMap = Record<string, number>;
type InvestedMap = Record<string, bigint>;
type BuyTicketResult =
  | { ok: true }
  | { ok: false; error: string };

type UseOnchainTicketPortfolioResult = {
  holdings: HoldingsMap;
  investedUsdtByProject: InvestedMap;
  pendingProjectId: string | null;
  isLoading: boolean;
  error: string | null;
  buyTicket: (project: ListedProject, ticketAmount?: number) => Promise<BuyTicketResult>;
  refresh: () => Promise<void>;
};

const humanizeBuyError = (value: unknown, fallback: string) => {
  const message = parseErrorMessage(value, fallback);
  const normalized = message.toLowerCase();

  if (normalized.includes("salenotstarted") || normalized.includes("fundraisingnotstarted")) {
    return "Sale has not started yet.";
  }

  if (normalized.includes("saleended") || normalized.includes("fundraisingended")) {
    return "Sale has already ended.";
  }

  if (normalized.includes("soldout") || normalized.includes("ticketsupplyexceeded")) {
    return "Not enough tickets left for this purchase.";
  }

  if (normalized.includes("invalidamount") || normalized.includes("invalidinput")) {
    return "Ticket amount is invalid.";
  }

  if (normalized.includes("insufficientallowance")) {
    return "Payment token allowance is insufficient. Please approve and try again.";
  }

  if (normalized.includes("tokentransferfailed")) {
    return "Payment token transfer failed. Please confirm your token balance and retry.";
  }

  if (normalized.includes("insufficient usdc balance") || normalized.includes("insufficient payment token balance")) {
    return "Insufficient payment token balance for the requested ticket amount.";
  }

  if (normalized.includes("wallet network does not match")) {
    return "Your wallet is on a different network than the sale. Switch network and retry.";
  }

  if (
    normalized.includes("recipient configuration") ||
    normalized.includes("partner recipient") ||
    normalized.includes("hip recipient")
  ) {
    return "This sale contract is missing valid recipient addresses. Purchase has been blocked.";
  }

  return message;
};

export const useOnchainTicketPortfolio = (
  address: string | undefined,
  projects: ListedProject[]
): UseOnchainTicketPortfolioResult => {
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient({ chainId });

  const [holdings, setHoldings] = useState<HoldingsMap>({});
  const [investedUsdtByProject, setInvestedUsdtByProject] = useState<InvestedMap>({});
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolveContractAddress = useCallback(
    (project: ListedProject) => {
      return resolveTicketSaleAddress(project.contractAddress);
    },
    []
  );

  const accountAddress = useMemo(
    () => (address ? resolveTicketSaleAddress(address) : null),
    [address]
  );

  const validProjects = useMemo(
    () => projects.filter((project) => resolveContractAddress(project) !== null),
    [projects, resolveContractAddress]
  );

  const refresh = useCallback(async () => {
    if (!accountAddress || !publicClient) {
      setHoldings({});
      setInvestedUsdtByProject({});
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const reads = await Promise.allSettled(
        validProjects.map(async (project) => {
          const contractAddress = resolveContractAddress(project);
          if (!contractAddress) {
            throw new Error(`Project ${project.id} has an invalid contract address.`);
          }

          const [sale, user] = await Promise.all([
            readSaleSnapshot(publicClient, contractAddress),
            readUserSnapshot(publicClient, contractAddress, accountAddress),
          ]);

          const tickets = Number(user.ownedTickets);
          const effectiveTickets = tickets > 0 ? tickets : 0;

          return {
            projectId: project.id,
            tickets: Number.isFinite(effectiveTickets) ? effectiveTickets : 0,
            investedUsdt: BigInt(effectiveTickets) * sale.ticketPrice,
          };
        })
      );

      const nextHoldings: HoldingsMap = {};
      const nextInvestedMap: InvestedMap = {};

      reads.forEach((result) => {
        if (result.status !== "fulfilled") {
          return;
        }

        const { projectId, tickets, investedUsdt } = result.value;
        nextHoldings[projectId] = tickets;
        nextInvestedMap[projectId] = investedUsdt;
      });

      setHoldings(nextHoldings);
      setInvestedUsdtByProject(nextInvestedMap);
    } catch (readError) {
      setError(parseErrorMessage(readError, "Could not load on-chain wallet holdings."));
    } finally {
      setIsLoading(false);
    }
  }, [accountAddress, publicClient, resolveContractAddress, validProjects]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const buyTicket = useCallback(
    async (project: ListedProject, ticketAmount = 1): Promise<BuyTicketResult> => {
      setError(null);

      if (!accountAddress) {
        const message = "Connect your wallet before investing.";
        setError(message);
        return { ok: false, error: message };
      }

      if (!publicClient || !walletClient) {
        const message = "Wallet client is unavailable. Please reconnect your wallet.";
        setError(message);
        return { ok: false, error: message };
      }

      const contractAddress = resolveContractAddress(project);
      if (!contractAddress) {
        const message = `Project ${project.id} has an invalid contract address.`;
        setError(message);
        return { ok: false, error: message };
      }

      if (!Number.isInteger(ticketAmount) || ticketAmount <= 0) {
        const message = "Ticket amount must be a positive integer.";
        setError(message);
        return { ok: false, error: message };
      }

      setPendingProjectId(project.id);

      try {
        await executeBuyTicket(
          publicClient,
          walletClient,
          contractAddress,
          accountAddress,
          ticketAmount
        );
        await refresh();
        return { ok: true };
      } catch (buyError) {
        const message = humanizeBuyError(buyError, "Ticket purchase transaction failed.");
        setError(message);
        return { ok: false, error: message };
      } finally {
        setPendingProjectId(null);
      }
    },
    [accountAddress, publicClient, refresh, resolveContractAddress, walletClient]
  );

  return {
    holdings,
    investedUsdtByProject,
    pendingProjectId,
    isLoading,
    error,
    buyTicket,
    refresh,
  };
};
