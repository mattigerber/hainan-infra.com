import { redirect } from "next/navigation";

/**
 * Root entry point. The canonical home is always at /en (or the detected locale).
 * next.config.ts already sends a 307 for browsers, but this component handles
 * edge cases (e.g. direct server renders that bypass config redirects).
 */
export default function RootPage() {
  redirect("/en");
}
