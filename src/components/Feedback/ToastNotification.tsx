"use client";

import { useI18n } from "@/i18n/I18nProvider";

type ToastNotificationProps = {
  message: string;
  tone: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
};

export default function ToastNotification({
  message,
  tone,
  isVisible,
  onClose,
}: ToastNotificationProps) {
  const { t } = useI18n();

  return (
    <div
      className={`fixed right-4 top-4 z-[210] w-[min(92vw,360px)] rounded-xl border bg-gray-100 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-500 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-6 opacity-0 pointer-events-none"
      } ${tone === "error" ? "border-red-300" : "border-gray-200"}`}
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/10 text-sm text-black/65 transition hover:border-black/30 hover:text-black"
        aria-label={t("common.closeNotification")}
      >
        x
      </button>
      <div className="pr-8 text-sm leading-6 text-black/85">{message}</div>
    </div>
  );
}
