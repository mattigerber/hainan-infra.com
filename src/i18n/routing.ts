import { isSupportedLocale } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";

const getPathSegments = (pathname: string) => pathname.split("/").filter(Boolean);

export const normalizeLocale = (value: string): Locale | null => {
  return isSupportedLocale(value) ? value : null;
};

const isLocaleSegment = (value: string) => isSupportedLocale(value);

export const getLocaleFromPathname = (pathname: string): Locale | null => {
  const [first] = getPathSegments(pathname);
  if (!first) return null;
  return normalizeLocale(first);
};

export const replacePathLocale = (pathname: string, nextLocale: Locale) => {
  const segments = getPathSegments(pathname);

  if (segments.length === 0) {
    return `/${nextLocale}`;
  }

  if (isLocaleSegment(segments[0])) {
    segments[0] = nextLocale;
  } else {
    segments.unshift(nextLocale);
  }

  return `/${segments.join("/")}`;
};
