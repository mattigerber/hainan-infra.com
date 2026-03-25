import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { normalizeLocale } from "@/i18n/routing";
import { localeMessages } from "@/i18n/messages";
import { I18nProvider } from "@/i18n/I18nProvider";
import WalletProvider from "@/components/Wallet/WalletProvider";
import CookieConsentBanner from "@/components/Legal/CookieConsentBanner";
import type { Locale } from "@/i18n/types";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Locale-aware shell for user-facing routes.
 * The root app layout owns <html>/<body>; this layout provides locale context.
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const resolvedLocale = normalizeLocale(locale);
  if (!resolvedLocale) {
    notFound();
  }

  const messages = localeMessages[resolvedLocale] ?? localeMessages.en;

  return (
    <I18nProvider initialLocale={resolvedLocale as Locale}>
      <a href="#main-content" className="sr-only">
        {messages["common.skipToMain"]}
      </a>
      <WalletProvider>
        {children}
        <CookieConsentBanner />
      </WalletProvider>
    </I18nProvider>
  );
}
