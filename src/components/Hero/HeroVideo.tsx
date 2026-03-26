"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useI18n } from '@/i18n/I18nProvider';

const HeroVideoModal = dynamic(() => import('@/components/Hero/HeroVideoModal'), {
  ssr: false,
});

type HeroMediaPayload = {
  coverImageSrc: string | null;
  mobileCoverImageSrc: string | null;
  videoSrc: string | null;
};

type HeroVideoProps = {
  initialHeroMedia: HeroMediaPayload;
};

const HeroVideo = ({ initialHeroMedia }: HeroVideoProps) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const heroMedia = initialHeroMedia;

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
            <picture>
              {heroMedia.mobileCoverImageSrc ? (
                <source media="(max-width: 640px)" srcSet={heroMedia.mobileCoverImageSrc} />
              ) : null}
              <img
                src={heroMedia.coverImageSrc}
                alt={t('hero.coverAlt')}
                fetchPriority="high"
                decoding="async"
                loading="eager"
                className="absolute inset-0 h-full w-full object-contain sm:object-cover"
              />
            </picture>
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

      {isOpen && heroMedia.videoSrc ? (
        <HeroVideoModal videoSrc={heroMedia.videoSrc} onClose={() => setIsOpen(false)} />
      ) : null}
    </>
  );
};

export default HeroVideo;
