import LocaleHomePage from "@/app/[locale]/(main)/page";
import { I18nProvider } from "@/i18n/I18nProvider";
import { buildHomeMetadata } from "@/lib/seo";

export const revalidate = 3600;

/**
 * Root entry point for default locale (English), served at "/".
 * In normal runtime, proxy.ts rewrites "/" to /en internally while preserving
 * the clean URL. This file is a fallback for environments without that rewrite.
 */
export const generateMetadata = () => buildHomeMetadata("en");

export default function RootPage() {
  return (
    <I18nProvider initialLocale="en">
      <LocaleHomePage />
    </I18nProvider>
  );
}
