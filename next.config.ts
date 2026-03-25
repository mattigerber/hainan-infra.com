import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const NEXT_CONFIG_DIR = dirname(fileURLToPath(import.meta.url));
const IS_GITHUB_PAGES = process.env.GITHUB_PAGES === "true";
const PAGES_REPOSITORY = process.env.PAGES_REPOSITORY ?? process.env.GITHUB_REPOSITORY ?? "";
const REPOSITORY_NAME = PAGES_REPOSITORY.split("/")?.[1] ?? "";
const IS_USER_SITE_REPOSITORY = REPOSITORY_NAME.toLowerCase().endsWith(".github.io");
const REPOSITORY_NAME_LOOKS_LIKE_DOMAIN = REPOSITORY_NAME.includes(".") && !IS_USER_SITE_REPOSITORY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
let SITE_HOSTNAME = "";

try {
  SITE_HOSTNAME = new URL(SITE_URL).hostname.toLowerCase();
} catch {
  SITE_HOSTNAME = "";
}

const IS_CUSTOM_DOMAIN =
  (SITE_HOSTNAME.length > 0 && !SITE_HOSTNAME.endsWith("github.io")) ||
  REPOSITORY_NAME_LOOKS_LIKE_DOMAIN;
const PAGES_BASE_PATH =
  IS_GITHUB_PAGES && !IS_CUSTOM_DOMAIN && REPOSITORY_NAME && !IS_USER_SITE_REPOSITORY
    ? `/${REPOSITORY_NAME}`
    : "";

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
  output: IS_GITHUB_PAGES ? "export" : undefined,
  trailingSlash: IS_GITHUB_PAGES,
  basePath: PAGES_BASE_PATH,
  assetPrefix: PAGES_BASE_PATH,
  images: {
    unoptimized: true,
  },

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

  ...(IS_GITHUB_PAGES
    ? {}
    : {
        async redirects() {
          return [
            // Canonical home: bare "/" → "/en" (default locale)
            { source: "/", destination: "/en", permanent: false },

            // Capitalised-path redirects for all routes × locales
            ...buildCaseRedirects(),
          ];
        },
      }),
};

export default nextConfig;
