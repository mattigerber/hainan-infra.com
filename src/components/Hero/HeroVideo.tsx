"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useI18n } from '@/i18n/I18nProvider';

type HeroMediaPayload = {
  coverImageSrc: string | null;
  videoSrc: string | null;
};

const HeroVideo = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [heroMedia, setHeroMedia] = useState<HeroMediaPayload>({
    coverImageSrc: null,
    videoSrc: null,
  });

  useEffect(() => {
    let cancelled = false;

    const loadHeroMedia = async () => {
      try {
        const response = await fetch('/api/hero-media', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Could not load hero media.');
        }

        const payload = (await response.json()) as Partial<HeroMediaPayload>;
        if (cancelled) return;

        setHeroMedia({
          coverImageSrc:
            typeof payload.coverImageSrc === 'string' && payload.coverImageSrc.length > 0
              ? payload.coverImageSrc
              : null,
          videoSrc:
            typeof payload.videoSrc === 'string' && payload.videoSrc.length > 0
              ? payload.videoSrc
              : null,
        });
      } catch {
        if (cancelled) return;
        setHeroMedia({ coverImageSrc: null, videoSrc: null });
      }
    };

    void loadHeroMedia();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div className="w-full bg-black">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={!heroMedia.videoSrc}
          className="group relative h-[min(26svh,26rem)] min-h-[13rem] w-full overflow-hidden bg-black text-left sm:h-[min(68svh,38rem)] sm:min-h-[18rem]  lg:h-[min(72svh,48rem)]  2xl:h-[min(76svh,56rem)]"
          // className="group relative h-[min(50svh,26rem)] min-h-[13rem] w-full overflow-hidden border-4 border-white bg-[radial-gradient(circle_at_22%_20%,rgba(255,255,255,0.22),transparent_32%),linear-gradient(135deg,#1c1c1c,#080808)] text-left sm:h-[min(68svh,38rem)] sm:min-h-[18rem] sm:border-6 lg:h-[min(72svh,48rem)] lg:border-8 2xl:h-[min(76svh,56rem)]"
          aria-label={heroMedia.videoSrc ? t('hero.openVideo') : t('hero.videoUnavailable')}
        >
          {heroMedia.coverImageSrc ? (
            <Image
              src={heroMedia.coverImageSrc}
              alt={t('hero.coverAlt')}
              fill
              sizes="100vw"
              priority
              className="absolute inset-0 h-full w-full object-contain sm:object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 sm:bottom-10 sm:left-5 sm:right-5 sm:gap-4 md:bottom-10 md:left-6 md:right-6">
            <div>
              <div className="mb-1 text-[9px] uppercase tracking-[0.18em] text-white/75 sm:mb-2 sm:text-xs sm:tracking-[0.24em]">{t('hero.featureVideo')}</div>
              <div className="font-playfair text-lg leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">{t('hero.title')}</div>
            </div>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white bg-white/90 text-xs text-black sm:h-12 sm:w-12 sm:text-base md:h-14 md:w-14 md:text-lg">
              {heroMedia.videoSrc ? '▶' : '!'}
            </span>
          </div>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/65 p-2 backdrop-blur-sm sm:p-3 md:p-6"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="hero-video-dialog-title"
        >
          <div
            className="relative w-[min(96vw,1200px)] sm:w-[min(94vw,1200px)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="hero-video-dialog-title" className="sr-only">
              {t('hero.videoDialogTitle')}
            </h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -right-2 -top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-black/80 text-white hover:border-white sm:-right-3 sm:-top-3 sm:h-9 sm:w-9"
              aria-label={t('hero.closeVideo')}
            >
              ×
            </button>

            <div className="aspect-video w-full overflow-hidden border border-white/30 bg-black">
              {heroMedia.videoSrc ? (
                <video
                  controls
                  autoPlay
                  preload="metadata"
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <source src={heroMedia.videoSrc} />
                </video>
              ) : (
                <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-white/75">
                  {t('hero.noVideo')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroVideo;
