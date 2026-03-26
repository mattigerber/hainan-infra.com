"use client";

import { useEffect } from "react";

import { useI18n } from "@/i18n/I18nProvider";

type HeroVideoModalProps = {
  videoSrc: string;
  onClose: () => void;
};

export default function HeroVideoModal({ videoSrc, onClose }: HeroVideoModalProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/65 p-2 backdrop-blur-sm sm:p-3 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hero-video-dialog-title"
    >
      <div
        className="relative w-[min(96vw,1200px)] sm:w-[min(94vw,1200px)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="hero-video-dialog-title" className="sr-only">
          {t("hero.videoDialogTitle")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-black/80 text-white hover:border-white sm:-right-3 sm:-top-3 sm:h-9 sm:w-9"
          aria-label={t("hero.closeVideo")}
        >
          ×
        </button>

        <div className="aspect-video w-full overflow-hidden border border-white/30 bg-black">
          <video controls autoPlay preload="metadata" playsInline className="h-full w-full object-cover">
            <source src={videoSrc} />
          </video>
        </div>
      </div>
    </div>
  );
}
