import { enMessages } from "@/i18n/locales/en";
import { ruMessages } from "@/i18n/locales/ru";
import { arMessages } from "@/i18n/locales/ar";
import { zhMessages } from "@/i18n/locales/zh";
import type { Locale, Messages } from "@/i18n/types";

export const defaultLocale: Locale = "en";

export const localeMessages: Record<Locale, Messages> = {
  en: enMessages,
  zh: zhMessages,
  ru: ruMessages,
  ar: arMessages,
};

export const supportedLocales: Locale[] = ["en", "zh", "ru", "ar"];

export const isSupportedLocale = (value: string): value is Locale =>
  supportedLocales.includes(value as Locale);
