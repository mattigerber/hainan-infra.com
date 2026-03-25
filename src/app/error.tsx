"use client";

import { useEffect } from "react";
import { useI18n } from "@/i18n/I18nProvider";

type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: RootErrorProps) {
  const { t } = useI18n();

  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-lg border border-white/20 bg-white/[0.03] p-6 text-center">
        <h2 className="font-playfair text-3xl">{t("app.error.title")}</h2>
        <p className="mt-3 text-sm text-white/75">
          {t("app.error.description")}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center border border-white bg-white px-4 py-2 font-playfair text-sm text-black transition hover:bg-white/90"
        >
          {t("app.error.retry")}
        </button>
      </div>
    </main>
  );
}
