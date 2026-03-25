"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import Image from "next/image";
import styles from "./PartnershipmakerSection.module.css";
import { useI18n } from "@/i18n/I18nProvider";

const slideDurationMs = 2800;
const transitionMs = 2800;
const motionEasing = "cubic-bezier(0.2, 0.9, 0.2, 1)";
const lineIndicatorWidthPx = 56;
const dotIndicatorWidthPx = 8;
const gapRatio = 0.035;

const getSlideTriggerId = (index: number) => `partnershipmaker-slide-trigger-${index + 1}`;
const getSlidePanelId = (index: number) => `partnershipmaker-slide-panel-${index + 1}`;

type SlideItem = {
  id: string;
  src: string;
  alt: string;
  fileLabel: string;
  objectPosition: string;
  naturalWidth: number | null;
  naturalHeight: number | null;
};

const getAlternatingObjectPosition = (index: number) => (index % 2 === 0 ? "66% 50%" : "34% 50%");

const getFilenameLabel = (src: string) => {
  const cleanPath = src.split("?")[0];
  const segments = cleanPath.split("/");
  const rawName = segments[segments.length - 1] ?? src;
  const decoded = decodeURIComponent(rawName);
  return decoded.replace(/\.[^.]+$/, "");
};

const getImageNaturalSize = (src: string): Promise<{ width: number; height: number } | null> => {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const image = new window.Image();

    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        resolve(null);
        return;
      }

      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => resolve(null);
    image.src = src;
  });
};

export default function PartnershipmakerSection() {
  const { t, locale } = useI18n();
  const isArabic = locale === "ar";
  const headingAlignmentClass = isArabic ? "text-right" : "text-left";
  const mediaImageClassName = "h-full w-full object-contain sm:object-cover";
  const slideLabelClassName =
    "pointer-events-none absolute bottom-2 inline-flex max-w-[85%] truncate rounded-1xl bg-black/80 px-2 py-1 text-lg font-bold leading-none text-white right-2 text-left sm:bottom-3 sm:max-w-[80%] sm:px-3 sm:py-1.5 sm:text-2xl sm:right-3 md:text-4xl";
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [isSlidesLoading, setIsSlidesLoading] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [handoffProgress, setHandoffProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const handoffStartProgressRef = useRef(0);
  const transitionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSlides = async () => {
      try {
        const response = await fetch("/api/partnershipmaker-images", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Could not load partnershipmaker images.");
        }

        const payload = (await response.json()) as { images?: string[] };
        const imageSources = Array.isArray(payload.images) ? payload.images : [];
        const nextSlides = await Promise.all(
          imageSources.map(async (src, index) => {
            const naturalSize = await getImageNaturalSize(src);

            return {
              id: `partnershipmaker-${index + 1}`,
              src,
              alt: `Partnershipmaker slide ${index + 1}`,
              fileLabel: getFilenameLabel(src),
              objectPosition: getAlternatingObjectPosition(index),
              naturalWidth: naturalSize?.width ?? null,
              naturalHeight: naturalSize?.height ?? null,
            };
          }),
        );

        if (cancelled) return;
        setSlides(nextSlides);
      } catch {
        if (cancelled) return;
        setSlides([]);
      } finally {
        if (!cancelled) {
          setIsSlidesLoading(false);
        }
      }
    };

    void loadSlides();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length === 0) {
      setCurrentIndex(0);
      setPendingIndex(null);
      setIsAnimating(false);
      setShouldAnimate(false);
      setProgress(0);
      setHandoffProgress(0);
      return;
    }

    if (currentIndex > slides.length - 1) {
      setCurrentIndex(0);
      setPendingIndex(null);
      setIsAnimating(false);
      setShouldAnimate(false);
      setProgress(0);
      setHandoffProgress(0);
    }
  }, [currentIndex, slides.length]);

  const queueTransition = useCallback(
    (nextIndex: number, startProgressOverride?: number) => {
      if (slides.length === 0) {
        return;
      }

      if (isAnimating || nextIndex === currentIndex) {
        return;
      }

      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }

      handoffStartProgressRef.current =
        startProgressOverride !== undefined ? startProgressOverride : progress;

      setPendingIndex(nextIndex);
      setHandoffProgress(0);
      setIsAnimating(true);
      setShouldAnimate(false);

      requestAnimationFrame(() => {
        setShouldAnimate(true);
      });

      transitionTimeoutRef.current = window.setTimeout(() => {
        setCurrentIndex(nextIndex);
        setPendingIndex(null);
        setIsAnimating(false);
        setShouldAnimate(false);
        setHandoffProgress(0);
        setProgress(0);
      }, transitionMs);
    },
    [currentIndex, isAnimating, progress, slides.length],
  );

  const goToSlide = useCallback(
    (targetIndex: number, asFullHandoff = false) => {
      if (slides.length === 0 || targetIndex < 0 || targetIndex > slides.length - 1) {
        return;
      }

      if (targetIndex === currentIndex || isAnimating) {
        return;
      }

      queueTransition(targetIndex, asFullHandoff ? 100 : undefined);
    },
    [currentIndex, isAnimating, queueTransition, slides.length],
  );

  const goNext = useCallback(() => {
    if (slides.length === 0) {
      return;
    }

    if (currentIndex >= slides.length - 1) {
      setProgress(100);
      setIsPaused(true);
      return;
    }

    queueTransition(currentIndex + 1);
  }, [currentIndex, queueTransition, slides.length]);

  const replayFromStart = useCallback(() => {
    if (slides.length === 0 || isAnimating) {
      return;
    }

    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    setCurrentIndex(0);
    setPendingIndex(null);
    setIsAnimating(false);
    setShouldAnimate(false);
    setHandoffProgress(0);
    setProgress(0);
    setIsPaused(false);
  }, [isAnimating, slides.length]);

  const handlePausedClickNavigate = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!isPaused || isAnimating || slides.length === 0) {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - bounds.left;
      const clickedRightSide = clickX >= bounds.width / 2;
      const shouldGoForward = clickedRightSide;

      if (shouldGoForward) {
        if (currentIndex < slides.length - 1) {
          goToSlide(currentIndex + 1, true);
        }
        return;
      }

      if (currentIndex > 0) {
        goToSlide(currentIndex - 1, true);
      }
    },
    [currentIndex, goToSlide, isAnimating, isPaused, slides.length],
  );

  useEffect(() => {
    if (!viewportRef.current) {
      return;
    }

    const element = viewportRef.current;
    const updateWidth = () => setViewportWidth(element.clientWidth);

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isPaused || isAnimating) {
      return;
    }

    if (!isInView) {
      return;
    }

    const interval = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 * 50) / slideDurationMs;

        if (next >= 100) {
          if (currentIndex >= slides.length - 1) {
            setIsPaused(true);
            return 100;
          }

          goNext();
          return 0;
        }

        return next;
      });
    }, 50);

    return () => window.clearInterval(interval);
  }, [currentIndex, goNext, isAnimating, isInView, isPaused, slides.length]);

  useEffect(() => {
    if (!isAnimating || !shouldAnimate) {
      return;
    }

    let animationFrameId = 0;
    const startTime = performance.now();

    const tick = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const ratio = Math.min(elapsed / transitionMs, 1);
      setHandoffProgress(ratio);

      if (ratio < 1) {
        animationFrameId = window.requestAnimationFrame(tick);
      }
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [isAnimating, shouldAnimate]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const horizontalGutterPx = viewportWidth >= 1024 ? 176 : viewportWidth >= 768 ? 144 : 104;
  const slideWidthPx = Math.max(Math.min(viewportWidth - horizontalGutterPx, 1280), 280);
  const gapPx = slideWidthPx * gapRatio;
  const stepPx = slideWidthPx + gapPx;
  const targetIndex = pendingIndex !== null && shouldAnimate ? pendingIndex : currentIndex;
  // Keep the active slide centered so adjacent slides stay partially visible.
  const centeredStartOffsetPx = Math.max((viewportWidth - slideWidthPx) / 2, 0);
  const trackOffsetPx = centeredStartOffsetPx - targetIndex * stepPx;
  const isPhoneViewport = viewportWidth > 0 && viewportWidth < 640;
  const maxPhoneHeightPx =
    viewportHeight > 0 ? Math.min(viewportHeight * 0.5, 384, Math.max(viewportHeight - 160, 0)) : null;

  const getPhoneSlideHeight = (index: number) => {
    const slide = slides[index];
    if (!slide || !slide.naturalWidth || !slide.naturalHeight) {
      return null;
    }

    const widthScale = Math.min(slideWidthPx / slide.naturalWidth, 1);
    return slide.naturalHeight * widthScale;
  };

  const currentPhoneSlideHeight = getPhoneSlideHeight(currentIndex);
  const pendingPhoneSlideHeight = pendingIndex !== null ? getPhoneSlideHeight(pendingIndex) : null;
  const nextPhoneSlideHeight =
    currentPhoneSlideHeight !== null && pendingPhoneSlideHeight !== null
      ? Math.max(currentPhoneSlideHeight, pendingPhoneSlideHeight)
      : (currentPhoneSlideHeight ?? pendingPhoneSlideHeight);

  const phoneScrollHeightPx =
    isPhoneViewport && nextPhoneSlideHeight !== null
      ? (maxPhoneHeightPx !== null ? Math.min(nextPhoneSlideHeight, maxPhoneHeightPx) : nextPhoneSlideHeight)
      : null;

  const hasSlides = slides.length > 0;
  const hasReachedEnd = hasSlides && currentIndex >= slides.length - 1 && progress >= 100;
  const controlLabel = hasReachedEnd
    ? t("partnershipmaker.replay")
    : (isPaused ? t("partnershipmaker.resume") : t("partnershipmaker.pause"));
  const autoplayProgress = hasReachedEnd ? 100 : progress;
  const galleryStyle = { "--autoplay-progress": autoplayProgress } as CSSProperties;

  const handlePlaybackControl = () => {
    if (hasReachedEnd) {
      replayFromStart();
      return;
    }

    setIsPaused((prev) => !prev);
  };

  return (
    <section
      id="partnershipmaker"
      ref={sectionRef}
      className={`w-full overflow-x-hidden bg-black ${styles.highlightsSection}`}
    >
      <div className={`mx-auto w-full max-w-7xl px-8 sm:px-6 md:px-10 2xl:max-w-[90rem] ${headingAlignmentClass}`}>
         <div className="mb-3 text-sm uppercase tracking-[0.22em] text-white/60">
                {t("partnershipmaker.section.label")}
              </div>
        <h2 className={`mb-4 font-playfair text-3xl uppercase leading-tight text-white sm:mb-5 sm:text-4xl lg:text-5xl ${headingAlignmentClass}`}>  
          {t("partnershipmaker.section.title")}
        </h2>
      </div>

      <div className={styles.highlightsBody}>
        <div className="relative left-1/2 w-screen -translate-x-1/2 px-0">
          <div className="mx-auto w-full max-w-none">
            <div
              className={`${styles.mediaCardGalleryContent} ${styles.mediaGallery} relative w-full`}
              data-media-card-gallery=""
              dir="ltr"
              style={galleryStyle}
            >
              <div
                ref={viewportRef}
                className={`${styles.scrollContainer} relative w-full overflow-hidden rounded-3xl`}
                onClick={handlePausedClickNavigate}
                style={
                  isPhoneViewport && phoneScrollHeightPx !== null
                    ? {
                        height: `${phoneScrollHeightPx}px`,
                      }
                    : undefined
                }
              >
                <ul
                  className={`${styles.itemContainer} flex h-full list-none p-0`}
                  role="list"
                  aria-live="polite"
                  style={{
                    transform: `translate3d(${trackOffsetPx}px, 0, 0)`,
                    transitionDuration: `${isAnimating ? transitionMs : 0}ms`,
                    transitionTimingFunction: motionEasing,
                    columnGap: `${gapPx}px`,
                  }}
                >
                  {slides.map((item, index) => {
                    const isCurrent = index === currentIndex;
                    const isIncoming = pendingIndex === index;
                    const isVisiblePanel = isCurrent || isIncoming;

                    return (
                      <li
                        key={item.id}
                        id={getSlidePanelId(index)}
                        className={`${styles.galleryItem} relative h-full shrink-0 overflow-hidden rounded-3xl`}
                        style={{ width: `${slideWidthPx}px` }}
                        role="tabpanel"
                        aria-labelledby={getSlideTriggerId(index)}
                        aria-label={t("partnershipmaker.slideAria", { index: index + 1 })}
                        aria-hidden={!isVisiblePanel}
                        tabIndex={isVisiblePanel ? 0 : -1}
                        data-current={isCurrent ? "true" : "false"}
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="100vw"
                          priority={index === currentIndex}
                          className={mediaImageClassName}
                          style={{ objectPosition: item.objectPosition }}
                        />
                        <span className={slideLabelClassName}>
                          {item.fileLabel}
                        </span>
                      </li>
                    );
                  })}
                  {!isSlidesLoading && slides.length === 0 && (
                    <li
                      className={`${styles.galleryItem} relative h-full shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20`}
                      style={{ width: `${slideWidthPx}px` }}
                      role="tabpanel"
                      aria-label={t("partnershipmaker.noSlidesAria")}
                    >
                      <div className="flex h-full w-full items-center justify-center p-8 text-center text-white/70">
                        {t("partnershipmaker.emptySlides")}
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 px-4 sm:mt-3 sm:px-6 md:px-10">
          <div className={`${styles.galleryControls} flex flex-row items-center justify-center gap-3`} dir="ltr">
            <div className={`${styles.playPauseButtonWrapper} flex items-center rounded-full px-1 py-1`}>
              <button
                type="button"
                onClick={handlePlaybackControl}
                className={`${styles.playPauseButton} flex h-12 w-12 items-center justify-center rounded-full`}
                aria-label={controlLabel}
              >
                {hasReachedEnd ? (
                  <span className={styles.replayIcon} aria-hidden="true">
                    ↺
                  </span>
                ) : isPaused ? (
                  <span className="ml-0.5 border-y-[7px] border-l-[11px] border-y-transparent border-l-white/85" />
                ) : (
                  <span className="flex items-center gap-1" aria-hidden="true">
                    <span className="h-4 w-1 rounded bg-white/85" />
                    <span className="h-4 w-1 rounded bg-white/85" />
                  </span>
                )}
              </button>
            </div>

            <div className={`${styles.dotnavShell} flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-3 sm:gap-3 sm:px-5`}>
              <ul
                role="tablist"
                aria-label={t("partnershipmaker.section.title")}
                className="flex items-center gap-2 sm:gap-3"
              >
              {slides.map((item, index) => {
                const isActive = index === currentIndex;
                const isIncoming = pendingIndex === index;

                const markerWidth = isAnimating
                  ? isActive
                    ? lineIndicatorWidthPx - (lineIndicatorWidthPx - dotIndicatorWidthPx) * handoffProgress
                    : isIncoming
                      ? dotIndicatorWidthPx + (lineIndicatorWidthPx - dotIndicatorWidthPx) * handoffProgress
                      : dotIndicatorWidthPx
                  : isActive
                    ? lineIndicatorWidthPx
                    : dotIndicatorWidthPx;

                const fillPercent = isAnimating
                  ? isActive
                    ? 100
                    : isIncoming
                      ? 0
                      : 0
                  : isActive
                    ? progress
                    : 0;

                return (
                  <li key={item.id} role="presentation">
                    <button
                      id={getSlideTriggerId(index)}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={getSlidePanelId(index)}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => goToSlide(index, true)}
                      disabled={isAnimating || index === currentIndex}
                      className={`relative block h-2 overflow-hidden rounded-full bg-white/20 disabled:cursor-default ${
                        isAnimating ? "transition-none" : "transition-[width,background-color]"
                      }`}
                      style={{
                        width: `${markerWidth}px`,
                        transitionDuration: isAnimating ? "0ms" : `${transitionMs}ms`,
                        transitionTimingFunction: motionEasing,
                        backgroundColor:
                          markerWidth > dotIndicatorWidthPx + 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.4)",
                      }}
                      aria-label={t("partnershipmaker.goToSlide", { index: index + 1 })}
                    >
                      <span className="sr-only">{item.fileLabel}</span>
                      {fillPercent > 0 && (
                        <span
                          className="absolute inset-y-0 left-0 rounded-full bg-white"
                          style={{ width: `${fillPercent}%` }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
