"use client";

import { useEffect, useRef, useState } from "react";

import LanguageSwitcher from "@/components/Header/LanguageSwitcher";
import RegisterProjectButton from "@/components/Header/RegisterProjectButton";
import { useI18n } from "@/i18n/I18nProvider";

export default function HeaderMobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileMenuTop, setMobileMenuTop] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateMenuTop = () => {
      const headerElement = triggerRef.current?.closest("header");
      const headerBottom = headerElement?.getBoundingClientRect().bottom ?? 0;
      setMobileMenuTop(Math.max(0, Math.round(headerBottom)));
    };

    updateMenuTop();
    window.addEventListener("resize", updateMenuTop);
    window.addEventListener("scroll", updateMenuTop, { passive: true });

    return () => {
      window.removeEventListener("resize", updateMenuTop);
      window.removeEventListener("scroll", updateMenuTop);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen || typeof document === "undefined") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    mobileMenuRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsMobileMenuOpen((current) => !current)}
        className="inline-flex h-13 w-13 items-center justify-center text-white sm:hidden"
        aria-label={isMobileMenuOpen ? t("header.closeNavigation") : t("header.openNavigation")}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-header-menu"
        aria-haspopup="dialog"
      >
        {isMobileMenuOpen ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10 stroke-current" fill="none" strokeWidth="3.2">
            <path d="M6 6l12 12" strokeLinecap="round" />
            <path d="M18 6 6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10 stroke-current" fill="none" strokeWidth="3.5">
            <path d="M3.5 6h17" strokeLinecap="round" />
            <path d="M3.5 12h17" strokeLinecap="round" />
            <path d="M3.5 18h17" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <div
        className={`fixed inset-x-0 bottom-0 z-[180] transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:hidden ${
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ top: mobileMenuTop }}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/55 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          id="mobile-header-menu"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("header.mobileMenu")}
          tabIndex={-1}
          className={`absolute inset-x-0 top-0 h-full overflow-y-auto border-t border-white/10 bg-black px-8 pb-12 pt-14 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <nav aria-label={t("header.primaryNavigation")} className="flex flex-col gap-5">
            <div
              className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileMenuOpen ? "translate-y-0 opacity-100 delay-100" : "translate-y-3 opacity-0 delay-0"
              }`}
            >
              <div className="inline-flex border border-white">
                <LanguageSwitcher />
              </div>
            </div>
            <div
              className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileMenuOpen ? "translate-y-0 opacity-100 delay-150" : "translate-y-3 opacity-0 delay-0"
              }`}
            >
              <RegisterProjectButton />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
