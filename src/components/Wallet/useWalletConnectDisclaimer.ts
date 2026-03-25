"use client";

import { useCallback, useRef, useState } from "react";

type PendingAction = (() => boolean | void) | null;

type UseWalletConnectDisclaimerResult = {
  isDisclaimerOpen: boolean;
  requestWithDisclaimer: (action: () => boolean | void) => boolean;
  confirmDisclaimer: () => void;
  cancelDisclaimer: () => void;
};

const DISCLAIMER_ACCEPTED_STORAGE_KEY = "hip.walletDisclaimerAccepted.v1";

const getInitialAcceptedState = () => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DISCLAIMER_ACCEPTED_STORAGE_KEY) === "true";
};

export const useWalletConnectDisclaimer = (): UseWalletConnectDisclaimerResult => {
  const [isAccepted, setIsAccepted] = useState<boolean>(getInitialAcceptedState);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const pendingActionRef = useRef<PendingAction>(null);

  const requestWithDisclaimer = useCallback(
    (action: () => boolean | void) => {
      if (isAccepted) {
        const result = action();
        return result !== false;
      }

      pendingActionRef.current = action;
      setIsDisclaimerOpen(true);
      return true;
    },
    [isAccepted]
  );

  const confirmDisclaimer = useCallback(() => {
    setIsAccepted(true);
    setIsDisclaimerOpen(false);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISCLAIMER_ACCEPTED_STORAGE_KEY, "true");
    }

    const pendingAction = pendingActionRef.current;
    pendingActionRef.current = null;
    pendingAction?.();
  }, []);

  const cancelDisclaimer = useCallback(() => {
    pendingActionRef.current = null;
    setIsDisclaimerOpen(false);
  }, []);

  return {
    isDisclaimerOpen,
    requestWithDisclaimer,
    confirmDisclaimer,
    cancelDisclaimer,
  };
};
