"use client";

import { useState } from "react";

import { useI18n } from "@/i18n/I18nProvider";

type WalletConnectDisclaimerModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function WalletConnectDisclaimerModal({
  isOpen,
  onConfirm,
  onCancel,
}: WalletConnectDisclaimerModalProps) {
  const { t } = useI18n();
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-xl border border-white/35 bg-black p-5 text-white sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-disclaimer-title"
      >
        <h3 id="wallet-disclaimer-title" className="font-playfair text-xl text-white sm:text-2xl">
          {t("wallet.disclaimer.title")}
        </h3>
        <p className="mt-3 text-sm leading-7 text-white sm:text-base">
          {t("wallet.disclaimer.body")}
        </p>

        <label className="mt-5 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 border border-white/60 bg-black accent-white"
            checked={isAcknowledged}
            onChange={(event) => setIsAcknowledged(event.target.checked)}
          />
          <span className="text-sm text-white sm:text-base">{t("wallet.disclaimer.acknowledge")}</span>
        </label>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              setIsAcknowledged(false);
              onCancel();
            }}
            className="min-h-[44px] border border-white/45 px-4 py-2 text-sm text-white transition hover:border-white sm:text-base"
          >
            {t("wallet.disclaimer.cancel")}
          </button>
          <button
            type="button"
            disabled={!isAcknowledged}
            onClick={() => {
              setIsAcknowledged(false);
              onConfirm();
            }}
            className="min-h-[44px] border border-white bg-white px-4 py-2 text-sm text-black transition enabled:hover:bg-white/90 disabled:cursor-not-allowed disabled:border-white/30 disabled:bg-transparent disabled:text-white/40 sm:text-base"
          >
            {t("wallet.disclaimer.continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
