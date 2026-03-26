import { type NextRequest, NextResponse } from "next/server";

import { isSupportedLocale, defaultLocale } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";

/**
 * Proxy for locale negotiation and canonical URL enforcement.
 *
 * Rules (in order of precedence):
 * 1. If the URL already starts with a supported locale segment -> pass through.
 * 2. If the URL is "/" -> negotiate locale from Accept-Language header and
 *    internally rewrite to /{detectedLocale}.
 *    This serves locale content while keeping the browser URL as "/".
 * 3. All other non-locale paths are left untouched (API routes, static assets).
 *
 * next.config.ts permanent (308) redirects handle capitalised paths
 * (e.g. /Platform -> /en/platform) and are applied before this proxy.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal Next.js paths and static assets.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check whether the first URL segment is already a locale.
  const firstSegment = pathname.split("/")[1] ?? "";
  if (isSupportedLocale(firstSegment)) {
    return NextResponse.next();
  }

  // Only negotiate locale for the bare root "/" path.
  // Sub-paths without a locale (e.g. "/platform") are handled by
  // the permanent redirects in next.config.ts instead.
  if (pathname !== "/") {
    return NextResponse.next();
  }

  // Accept-Language negotiation for "/".
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const detectedLocale = negotiateLocale(acceptLanguage);

  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}`;
  return NextResponse.rewrite(url);
}

/**
 * Parse the Accept-Language header and return the best supported locale.
 * Falls back to defaultLocale ("en") when no match is found.
 */
function negotiateLocale(acceptLanguage: string): Locale {
  if (!acceptLanguage) return defaultLocale;

  const tags = acceptLanguage
    .split(",")
    .map((entry) => {
      const [tag, q] = entry.trim().split(";q=");
      return { lang: (tag ?? "").trim().toLowerCase(), q: q ? parseFloat(q) : 1.0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of tags) {
    if (isSupportedLocale(lang)) return lang as Locale;

    const prefix = lang.split("-")[0] ?? "";
    if (prefix && isSupportedLocale(prefix)) return prefix as Locale;
  }

  return defaultLocale;
}

export const config = {
  // Run on every route except static files, images, and Next.js internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
