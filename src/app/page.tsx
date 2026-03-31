import LocaleHomePage, { revalidate } from "@/app/[locale]/(main)/page";
import { buildHomeMetadata } from "@/lib/seo";

export { revalidate };

/**
 * Root entry point for default locale (English), served at "/".
 * In normal runtime, proxy.ts rewrites "/" to /en internally while preserving
 * the clean URL. This file is a fallback for environments without that rewrite.
 */
export const generateMetadata = () => buildHomeMetadata("en");

export default function RootPage() {
  return <LocaleHomePage />;
}
