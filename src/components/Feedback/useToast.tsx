"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ToastTone = "success" | "error";

type ToastState = {
  message: string;
  tone: ToastTone;
};

type UseToastResult = {
  toast: ToastState | null;
  isToastVisible: boolean;
  showToast: (message: string, tone: ToastTone) => void;
  closeToast: () => void;
};

export const useToast = (): UseToastResult => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearToastTimers = useCallback(() => {
    if (autoCloseRef.current) {
      clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }

    if (hideRef.current) {
      clearTimeout(hideRef.current);
      hideRef.current = null;
    }
  }, []);

  const closeToast = useCallback(() => {
    clearToastTimers();
    setIsToastVisible(false);

    hideRef.current = setTimeout(() => {
      setToast(null);
      hideRef.current = null;
    }, 220);
  }, [clearToastTimers]);

  const showToast = useCallback(
    (message: string, tone: ToastTone) => {
      clearToastTimers();
      setToast({ message, tone });
      setIsToastVisible(true);

      autoCloseRef.current = setTimeout(() => {
        closeToast();
      }, 3600);
    },
    [clearToastTimers, closeToast]
  );

  useEffect(() => {
    return () => {
      clearToastTimers();
    };
  }, [clearToastTimers]);

  return {
    toast,
    isToastVisible,
    showToast,
    closeToast,
  };
};
