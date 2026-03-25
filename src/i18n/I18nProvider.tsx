"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { defaultLocale, localeMessages } from "@/i18n/messages";
import { getLocaleFromPathname, normalizeLocale } from "@/i18n/routing";
import type { Locale, MessageKey } from "@/i18n/types";

const STORAGE_KEY = "hip-locale";

type TranslateValues = Record<string, string | number>;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, values?: TranslateValues) => string;
};

const interpolate = (template: string, values?: TranslateValues) => {
  if (!values) return template;

  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = values[token];
    return value === undefined ? `{${token}}` : String(value);
  });
};

const I18nContext = createContext<I18nContextValue | null>(null);

type I18nProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
};

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const pathname = usePathname();
  const [storedLocale, setStoredLocale] = useState<Locale>(() => {
    if (initialLocale) return initialLocale;
    if (typeof window === "undefined") return defaultLocale;

    const routeLocale = getLocaleFromPathname(window.location.pathname);
    if (routeLocale) return routeLocale;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultLocale;

    const normalizedStoredLocale = normalizeLocale(stored);
    return normalizedStoredLocale ?? defaultLocale;
  });

  const routeLocale = pathname ? getLocaleFromPathname(pathname) : null;
  const locale = routeLocale ?? storedLocale;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setStoredLocale(nextLocale);
  }, []);

  const t = useCallback(
    (key: MessageKey, values?: TranslateValues) => {
      const localized = localeMessages[locale][key] ?? localeMessages[defaultLocale][key] ?? key;
      return interpolate(localized, values);
    },
    [locale]
  );

  const contextValue = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};
