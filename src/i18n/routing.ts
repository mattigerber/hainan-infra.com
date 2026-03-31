import { defaultLocale, isSupportedLocale } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";

const getPathSegments = (pathname: string) => pathname.split("/").filter(Boolean);

export const normalizeLocale = (value: string): Locale | null => {
  return isSupportedLocale(value) ? value : null;
};

const isLocaleSegment = (value: string) => isSupportedLocale(value);

export const getLocaleFromPathname = (pathname: string): Locale | null => {
  const [first] = getPathSegments(pathname);
  if (!first) return defaultLocale;
  return normalizeLocale(first) ?? defaultLocale;
};

export const replacePathLocale = (pathname: string, nextLocale: Locale) => {
  const segments = getPathSegments(pathname);

  if (segments.length === 0) {
    return nextLocale === defaultLocale ? "/" : `/${nextLocale}`;
  }

  if (isLocaleSegment(segments[0])) {
    if (nextLocale === defaultLocale) {
      segments.shift();
    } else {
      segments[0] = nextLocale;
    }
  } else {
    if (nextLocale !== defaultLocale) {
      segments.unshift(nextLocale);
    }
  }

  return segments.length > 0 ? `/${segments.join("/")}` : "/";
};
