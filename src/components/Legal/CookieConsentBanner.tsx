"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useI18n } from "@/i18n/I18nProvider";
import { buildLocalePath } from "@/i18n/routing";
import {
  CONSENT_ACCEPTED_VALUES,
  COOKIE_CONSENT_COOKIE_NAME,
  COOKIE_CONSENT_STORAGE_KEY,
} from "@/components/Legal/cookieConsent.constants";

const readConsentFromCookie = (): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookiePrefix = `${COOKIE_CONSENT_COOKIE_NAME}=`;
  const cookieEntry = document.cookie
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(cookiePrefix));

  if (!cookieEntry) {
    return null;
  }

  return decodeURIComponent(cookieEntry.slice(cookiePrefix.length));
};

const writeConsentCookie = (value: "essential") => {
  if (typeof document === "undefined") {
    return;
  }

  const expiresAt = new Date(Date.now() + 31536000 * 1000).toUTCString();
  // Persist for 365 days as a fallback when localStorage is restricted.
  document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; Expires=${expiresAt}; Max-Age=31536000; Path=/; SameSite=Lax`;
};

const hasSavedCookieConsent = (): boolean => {
  const cookieValue = readConsentFromCookie();
  return Boolean(cookieValue && CONSENT_ACCEPTED_VALUES.has(cookieValue));
};

type CookieConsentBannerProps = {
  initialHasConsent?: boolean;
};

export default function CookieConsentBanner({ initialHasConsent = false }: CookieConsentBannerProps) {
  const { t, locale } = useI18n();
  const [isVisible, setIsVisible] = useState(!initialHasConsent);

  // Hydration-safe visibility check
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(!hasSavedCookieConsent());
  }, [initialHasConsent]);

  const acceptEssentialConsent = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "essential");
      } catch {
        // Continue closing the banner even if storage is blocked by browser policy.
      }

      try {
        writeConsentCookie("essential");
      } catch {
        // If both storage mechanisms are blocked, still dismiss for this render cycle.
      }
    }

    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[230] border-t border-white/35 bg-black/95 p-4 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-2 md:flex-row md:items-end md:justify-between md:px-0 2xl:max-w-[90rem]">
        <div className="max-w-4xl space-y-2">
          <h3 className="font-playfair text-lg text-white sm:text-xl">{t("cookies.banner.title")}</h3>
          <p className="text-sm leading-6 text-white/90 sm:text-base">{t("cookies.banner.description")}</p>
          <p className="text-sm leading-6 text-white/80">{t("cookies.banner.thirdParty")}</p>
          <p className="text-sm text-white/90">
            {t("cookies.banner.policyLinks")} {" "}
            <Link href={buildLocalePath(locale, "privacy")} className="underline underline-offset-2 hover:text-white">
              {t("nav.privacy")}
            </Link>
            {" · "}
            <Link href={buildLocalePath(locale, "terms")} className="underline underline-offset-2 hover:text-white">
              {t("nav.terms")}
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row md:shrink-0">
          <button
            type="button"
            className="min-h-[44px] border border-white bg-white px-4 py-2 text-sm text-black transition hover:bg-white/90 sm:text-base"
            onClick={acceptEssentialConsent}
          >
            {t("cookies.banner.essentialOnly")}
          </button>
        </div>
      </div>
    </div>
  );
}
