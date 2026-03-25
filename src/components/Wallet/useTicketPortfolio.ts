"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'investment-ticket-portfolio-v1';

type PortfolioLedger = Record<string, Record<string, number>>;

const isPortfolioLedger = (value: unknown): value is PortfolioLedger => {
  if (!value || typeof value !== 'object') return false;

  const walletEntries = Object.values(value as Record<string, unknown>);
  return walletEntries.every((walletHoldings) => {
    if (!walletHoldings || typeof walletHoldings !== 'object') return false;

    return Object.values(walletHoldings as Record<string, unknown>).every(
      (ticketCount) => typeof ticketCount === 'number' && Number.isFinite(ticketCount) && ticketCount >= 0
    );
  });
};

const readLedger = (): PortfolioLedger => {
  if (typeof window === 'undefined') return {};

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (!storedValue) return {};

  try {
    const parsedValue = JSON.parse(storedValue);
    return isPortfolioLedger(parsedValue) ? parsedValue : {};
  } catch {
    return {};
  }
};

const persistLedger = (ledger: PortfolioLedger): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
    return true;
  } catch {
    return false;
  }
};

export const useTicketPortfolio = (address?: string) => {
  const [ledger, setLedger] = useState<PortfolioLedger>({});
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setLedger(readLedger());
  }, []);

  const normalizedAddress = address?.toLowerCase();

  const holdings = useMemo(() => {
    if (!normalizedAddress) return {};
    return ledger[normalizedAddress] ?? {};
  }, [ledger, normalizedAddress]);

  const totalTicketsOwned = useMemo(
    () => Object.values(holdings).reduce((total, quantity) => total + quantity, 0),
    [holdings]
  );

  const purchaseTicket = useCallback(
    async (projectId: string, projectName: string) => {
      if (!normalizedAddress) {
        setError('Connect your wallet before requesting an investment ticket.');
        return false;
      }

      setPendingProjectId(projectId);
      setError(null);
      setSuccessMessage(null);

      try {
        await new Promise((resolve) => window.setTimeout(resolve, 900));

        let persisted = true;

        setLedger((currentLedger) => {
          const currentWalletHoldings = currentLedger[normalizedAddress] ?? {};
          const nextLedger = {
            ...currentLedger,
            [normalizedAddress]: {
              ...currentWalletHoldings,
              [projectId]: (currentWalletHoldings[projectId] ?? 0) + 1,
            },
          };

          persisted = persistLedger(nextLedger);
          return nextLedger;
        });

        if (!persisted) {
          setError('Could not persist ticket reservation locally. Please check storage permissions and try again.');
          return false;
        }

        setSuccessMessage(`Ticket reserved for ${projectName}.`);
        return true;
      } catch {
        setError('Ticket reservation failed. Please try again.');
        return false;
      } finally {
        setPendingProjectId(null);
      }
    },
    [normalizedAddress]
  );

  return {
    error,
    holdings,
    pendingProjectId,
    purchaseTicket,
    successMessage,
    totalTicketsOwned,
  };
};