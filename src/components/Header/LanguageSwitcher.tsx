"use client";

import type { ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useI18n } from "@/i18n/I18nProvider";
import { replacePathLocale } from "@/i18n/routing";
import type { Locale } from "@/i18n/types";

const localeOptions: Array<{ value: Locale; label: string }> = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
  { value: "ar", label: "AR" },
  { value: "zh", label: "ZH" },
];

const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;
    if (nextLocale === locale) return;

    setLocale(nextLocale);
    const nextPath = replacePathLocale(pathname || "/", nextLocale);
    router.push(nextPath);
  };

  return (
    <label
      aria-label={t("common.language")}
      className="relative inline-flex min-h-[42px] w-fit items-center justify-start bg-black font-playfair text-xs font-bold text-white sm:text-sm"
    >
      <select
        value={locale}
        onChange={handleChange}
        style={{ backgroundImage: "none" }}
        className="h-full w-auto cursor-pointer appearance-none border-0 bg-transparent px-3 py-2 text-left text-xs font-bold tracking-[0.16em] text-white outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:px-4 sm:text-sm"
      >
        {localeOptions.map((option) => (
          <option key={option.value} value={option.value} className="bg-black text-white">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default LanguageSwitcher;
