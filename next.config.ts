import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const NEXT_CONFIG_DIR = dirname(fileURLToPath(import.meta.url));

const SUPPORTED_LOCALES = ["en", "zh", "ru", "ar"] as const;

// Named page routes (lowercase — canonical form)
const PAGE_ROUTES = [
  "platform",
  "leadership",
  "projects",
  "contributions",
  "insights",
  "privacy",
  "terms",
  "risks",
  "downloads",
] as const;

/**
 * Build permanent (308) redirects for every capitalised variant of each route.
 *
 * Covers two patterns:
 *   /Platform            → /en/platform   (root capitalised, default locale)
 *   /:locale/Platform    → /:locale/platform  (locale + capitalised)
 *
 * This ensures Google never indexes a capitalised duplicate URL, and any
 * external link using e.g. "/Projects" still lands in the right place.
 */
function buildCaseRedirects() {
  const redirects: {
    source: string;
    destination: string;
    permanent: boolean;
  }[] = [];

  for (const route of PAGE_ROUTES) {
    const capitalized = route.charAt(0).toUpperCase() + route.slice(1);

    // /Platform → /en/platform
    redirects.push({
      source: `/${capitalized}`,
      destination: `/en/${route}`,
      permanent: true,
    });

    // /:locale/Platform → /:locale/platform
    for (const locale of SUPPORTED_LOCALES) {
      redirects.push({
        source: `/${locale}/${capitalized}`,
        destination: `/${locale}/${route}`,
        permanent: true,
      });
    }
  }

  return redirects;
}

const nextConfig: NextConfig = {
  reactCompiler: true,

  turbopack: {
    // Keep module resolution anchored to the frontend app even when npm is run
    // from a parent directory with --prefix.
    root: NEXT_CONFIG_DIR,
  },

  experimental: {
    // Redirect source patterns are case-insensitive by default in Next.js 16 /
    // Turbopack. Without this flag, "/en/Terms" also matches "/en/terms",
    // creating a permanent 308 self-redirect loop for every locale sub-route.
    caseSensitiveRoutes: true,
  },

  async redirects() {
    return [
      // Canonical home: bare "/" → "/en" (default locale)
      { source: "/", destination: "/en", permanent: false },

      // Capitalised-path redirects for all routes × locales
      ...buildCaseRedirects(),
    ];
  },
};

export default nextConfig;
