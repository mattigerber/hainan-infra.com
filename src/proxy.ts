import { type NextRequest, NextResponse } from "next/server";

import { isSupportedLocale, defaultLocale } from "@/i18n/messages";

/**
 * Proxy for locale negotiation and canonical URL enforcement.
 *
 * Rules (in order of precedence):
 * 1. If URL starts with default locale segment (/en), redirect to unprefixed path.
 * 2. If URL starts with a non-default supported locale segment, pass through.
 * 3. All other user-facing paths are internally rewritten to /{defaultLocale}/*.
 *
 * next.config.ts permanent (308) redirects handle capitalised paths
 * (e.g. /Platform -> /platform) and are applied before this proxy.
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
    if (firstSegment === defaultLocale) {
      const stripped = pathname.replace(new RegExp(`^/${defaultLocale}(?=/|$)`), "") || "/";
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = stripped;
      return NextResponse.redirect(redirectUrl, 308);
    }

    return NextResponse.next();
  }

  // Rewrite unprefixed user-facing paths to default locale routes.
  // This preserves clean URLs while serving /en-backed app routes.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on every route except static files, images, and Next.js internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
