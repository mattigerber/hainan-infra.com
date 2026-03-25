import Image from "next/image";

import type { ListedProject } from "@/data/projectFilterSystem";
import type { MessageKey } from "@/i18n/types";

import { isDirectVideoSource } from "./projectSection.helpers";

type ProjectGalleryModalProps = {
  isOpen: boolean;
  selectedProject: ListedProject;
  selectedProjectGallery: ListedProject["gallery"];
  activeGalleryIndex: number;
  canNavigateGallery: boolean;
  failedGallerySources: Set<string>;
  isPhoneViewport: boolean;
  galleryModalHeightPx: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onImageError: (src: string) => void;
  t: (key: MessageKey, values?: Record<string, string | number>) => string;
};

export default function ProjectGalleryModal({
  isOpen,
  selectedProject,
  selectedProjectGallery,
  activeGalleryIndex,
  canNavigateGallery,
  failedGallerySources,
  isPhoneViewport,
  galleryModalHeightPx,
  onClose,
  onPrev,
  onNext,
  onImageError,
  t,
}: ProjectGalleryModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/78 p-2 backdrop-blur-sm sm:p-3 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-[min(97vw,1500px)] sm:w-[min(96vw,1500px)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-black/80 text-white hover:border-white sm:-right-3 sm:-top-3 sm:h-9 sm:w-9"
          aria-label={t("projects.aria.closeGallery")}
        >
          ×
        </button>

        <div className="relative overflow-hidden bg-black text-white sm:min-h-[55vh] md:min-h-[65vh]">
          {selectedProjectGallery[activeGalleryIndex]?.kind === "video" ? (
            (() => {
              const activeVideoSrc = selectedProjectGallery[activeGalleryIndex].src;
              const activeVideoIsDirect = isDirectVideoSource(activeVideoSrc);

              return (
                <div className="aspect-[16/9] h-full w-full sm:min-h-[55vh] md:min-h-[65vh]">
                  {activeVideoIsDirect ? (
                    <video controls preload="metadata" playsInline className="h-full w-full object-cover">
                      <source src={activeVideoSrc} />
                    </video>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      src={activeVideoSrc}
                      title={`${selectedProject.name} gallery video`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  )}
                </div>
              );
            })()
          ) : (
            <div
              className="h-full w-full sm:min-h-[55vh] md:min-h-[65vh]"
              style={
                isPhoneViewport && galleryModalHeightPx !== null
                  ? {
                      height: `${galleryModalHeightPx}px`,
                    }
                  : undefined
              }
            >
              {selectedProjectGallery[activeGalleryIndex]?.src &&
              !failedGallerySources.has(selectedProjectGallery[activeGalleryIndex].src) ? (
                <Image
                  src={selectedProjectGallery[activeGalleryIndex].src}
                  alt={selectedProjectGallery[activeGalleryIndex]?.title ?? `${selectedProject.name} gallery image`}
                  fill
                  sizes="100vw"
                  className="h-full w-full object-contain sm:object-cover"
                  onError={() => {
                    const failedSrc = selectedProjectGallery[activeGalleryIndex]?.src;
                    if (!failedSrc) return;
                    onImageError(failedSrc);
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center text-sm text-white">
                  {t("projects.imageUnavailable")}
                </div>
              )}
            </div>
          )}

          <span className="absolute bottom-4 right-4 rounded-full border border-white/40 bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/85">
            {activeGalleryIndex + 1} / {selectedProjectGallery.length}
          </span>

          <button
            type="button"
            disabled={!canNavigateGallery}
            onClick={onPrev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/45 bg-black/45 px-2.5 py-2 text-sm text-white hover:border-white/80 disabled:cursor-not-allowed disabled:opacity-50 sm:left-4 sm:px-3"
          >
            {"<"}
          </button>
          <button
            type="button"
            disabled={!canNavigateGallery}
            onClick={onNext}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/45 bg-black/45 px-2.5 py-2 text-sm text-white hover:border-white/80 disabled:cursor-not-allowed disabled:opacity-50 sm:right-4 sm:px-3"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
