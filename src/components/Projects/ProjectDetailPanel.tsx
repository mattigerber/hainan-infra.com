import type { RefObject } from "react";
import Image from "next/image";

import type { ListedProject } from "@/data/projectFilterSystem";
import type { MessageKey } from "@/i18n/types";

import {
  formatProjectUid,
  getFilenameFromSrc,
  saleStatusTextClass,
} from "./projectSection.helpers";

type GalleryEntryWithIndex = {
  item: ListedProject["gallery"][number];
  galleryIndex: number;
};

type ProjectDetailPanelProps = {
  selectedProject: ListedProject;
  projectDetailRef: RefObject<HTMLDivElement | null>;
  mainMediaRef: RefObject<HTMLDivElement | null>;
  previewGridRef: RefObject<HTMLDivElement | null>;
  connectorMenuRef: RefObject<HTMLDivElement | null>;
  isPhoneViewport: boolean;
  mainMediaHeightPx: number | null;
  hasSelectedVideo: boolean;
  selectedVideo: ListedProject["gallery"][number] | undefined;
  selectedVideoCoverImage: string | null;
  primaryNoVideoImageEntry: GalleryEntryWithIndex | null;
  galleryPreviewSlots: Array<GalleryEntryWithIndex | null>;
  galleryPreviewItems: GalleryEntryWithIndex[];
  hiddenPreviewImageCount: number;
  previewCardWidthPx: number;
  previewCardMaxHeightPx: number;
  filteredProjectDetails: ListedProject["details"];
  projectDocuments: ListedProject["documents"];
  hasMetricOverflow: boolean;
  hasDocumentOverflow: boolean;
  usdBalanceDisplay: string;
  selectedOwnedTickets: number;
  purchaseTicketAmount: number | "";
  isSaleActive: boolean;
  showWalletStats: boolean;
  isConnected: boolean;
  hasConnectorChoice: boolean;
  showConnectorMenu: boolean;
  isBuyActionDisabled: boolean;
  isConnecting: boolean;
  isBuying: boolean;
  onOpenVideoGallery: () => void;
  onOpenPrimaryImageGallery: () => void;
  onOpenPreviewGallery: (galleryIndex: number) => void;
  onPurchaseClick: () => void;
  onToggleConnectorMenu: () => void;
  onConnectWithBrowserWallet: () => void;
  onConnectWithWalletConnect: () => void;
  onPurchaseTicketAmountChange: (nextTicketAmount: number | "") => void;
  getClampedImageHeight: (src: string | null, targetWidth: number, maxHeight: number) => number | null;
  t: (key: MessageKey, values?: Record<string, string | number>) => string;
};

export default function ProjectDetailPanel({
  selectedProject,
  projectDetailRef,
  mainMediaRef,
  previewGridRef,
  connectorMenuRef,
  isPhoneViewport,
  mainMediaHeightPx,
  hasSelectedVideo,
  selectedVideo,
  selectedVideoCoverImage,
  primaryNoVideoImageEntry,
  galleryPreviewSlots,
  galleryPreviewItems,
  hiddenPreviewImageCount,
  previewCardWidthPx,
  previewCardMaxHeightPx,
  filteredProjectDetails,
  projectDocuments,
  hasMetricOverflow,
  hasDocumentOverflow,
  usdBalanceDisplay,
  selectedOwnedTickets,
  purchaseTicketAmount,
  isSaleActive,
  showWalletStats,
  isConnected,
  hasConnectorChoice,
  showConnectorMenu,
  isBuyActionDisabled,
  isConnecting,
  isBuying,
  onOpenVideoGallery,
  onOpenPrimaryImageGallery,
  onOpenPreviewGallery,
  onPurchaseClick,
  onToggleConnectorMenu,
  onConnectWithBrowserWallet,
  onConnectWithWalletConnect,
  onPurchaseTicketAmountChange,
  getClampedImageHeight,
  t,
}: ProjectDetailPanelProps) {
  const detailsPerPage = isPhoneViewport ? 3 : 6;
  const detailPages: ListedProject["details"][] = [];

  for (let index = 0; index < filteredProjectDetails.length; index += detailsPerPage) {
    detailPages.push(filteredProjectDetails.slice(index, index + detailsPerPage));
  }

  return (
    <div
      ref={projectDetailRef}
      className="w-full border border-white/35 p-4 md:p-5"
    >
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="font-playfair text-2xl font-bold sm:text-3xl">{selectedProject.name}</h3>
        <div className="text-sm text-white/70">
          {selectedProject.country} • {selectedProject.fundingRound} • {t("projects.idPrefix")}: {formatProjectUid(selectedProject.id)}
        </div>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
        <div
          ref={mainMediaRef}
          className="relative overflow-hidden bg-[radial-gradient(circle_at_22%_20%,rgba(255,255,255,0.22),transparent_32%),linear-gradient(135deg,#1c1c1c,#080808)]"
        >
          <div
            className="aspect-[16/9] w-full sm:min-h-[16.5rem] md:min-h-[20rem]"
            style={
              isPhoneViewport && mainMediaHeightPx !== null
                ? {
                    height: `${mainMediaHeightPx}px`,
                    aspectRatio: "auto",
                  }
                : undefined
            }
          >
            {hasSelectedVideo && selectedVideo?.kind === "video" ? (
              <button
                type="button"
                onClick={onOpenVideoGallery}
                className="relative h-full w-full text-left"
                aria-label={t("projects.aria.openVideo")}
              >
                {selectedVideoCoverImage ? (
                  <Image
                    src={selectedVideoCoverImage}
                    alt={`${selectedProject.name} cover`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className="absolute inset-0 h-full w-full object-contain sm:object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#222,#0f0f0f)]" />
                )}

                <div className="absolute inset-0 bg-black/30" />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-black/40 text-xl text-white">
                    ▶
                  </span>
                </div>
              </button>
            ) : primaryNoVideoImageEntry ? (
              <button
                type="button"
                onClick={onOpenPrimaryImageGallery}
                className="relative h-full w-full text-left"
                aria-label={t("projects.aria.openImage")}
              >
                <Image
                  src={primaryNoVideoImageEntry.item.src}
                  alt={primaryNoVideoImageEntry.item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="absolute inset-0 h-full w-full object-contain sm:object-cover"
                />
              </button>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#222,#0f0f0f)] text-sm text-white/70">
                {t("projects.noMedia")}
              </div>
            )}
          </div>
        </div>

        <div ref={previewGridRef} className="grid grid-cols-2 gap-4">
          {galleryPreviewSlots.map((previewSlot, index) =>
            previewSlot ? (
              (() => {
                const { item, galleryIndex } = previewSlot;
                const previewHeightPx = isPhoneViewport
                  ? getClampedImageHeight(item.src, previewCardWidthPx, previewCardMaxHeightPx)
                  : null;

                return (
                  <button
                    key={`${item.title}-${galleryIndex}`}
                    type="button"
                    onClick={() => onOpenPreviewGallery(galleryIndex)}
                    className="group relative flex items-end overflow-hidden bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.2),transparent_30%),linear-gradient(135deg,#242424,#0e0e0e)] p-3 text-left text-sm text-white/85 transition sm:min-h-36 md:min-h-44"
                    style={
                      isPhoneViewport && previewHeightPx !== null
                        ? {
                            height: `${previewHeightPx}px`,
                          }
                        : undefined
                    }
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="absolute inset-0 h-full w-full object-contain sm:object-cover"
                    />
                    <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/5" />
                    {hiddenPreviewImageCount > 0 && index === galleryPreviewItems.length - 1 && (
                      <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center font-playfair text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                        +{hiddenPreviewImageCount}
                      </span>
                    )}
                    <div className="relative w-full">
                      <div className="inline-flex max-w-full items-center truncate bg-white/90 px-2 py-0.5 text-xs text-black">
                        {getFilenameFromSrc(item.src)}
                      </div>
                    </div>
                  </button>
                );
              })()
            ) : (
              <div
                key={`gallery-placeholder-${index}`}
                className="min-h-24 sm:min-h-36 md:min-h-44"
                aria-hidden="true"
              />
            )
          )}
        </div>
      </div>

      <div className="mb-5 sm:mb-6">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-0 pb-1">
          {selectedProject.metrics.map((metric) => (
            <div
              key={`${metric.label}-${metric.value}`}
              className="w-[calc((100%-1.5rem)/3)] min-w-[calc((100%-1.5rem)/3)] shrink-0 snap-start border border-white/30 bg-black px-4 py-3"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {metric.label}
              </div>
              <div className="mt-2 font-playfair text-xl font-normal text-white md:text-2xl">
                {metric.value}
              </div>
            </div>
          ))}
        </div>
        {hasMetricOverflow && (
          <div className="mt-2 flex items-center justify-center gap-1.5 text-white/45" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
          </div>
        )}
      </div>

      <div className="mb-4 sm:mb-5">
        <div className="mb-2 min-h-6 font-playfair text-sm font-bold uppercase tracking-[0.16em] text-white/80">
          {t("projects.details")}
        </div>
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
          {detailPages.map((page, pageIndex) => (
            <div
              key={`detail-page-${pageIndex}`}
              className="grid min-w-full shrink-0 snap-start grid-cols-1 grid-rows-3 gap-2 text-sm text-white/80 font-[var(--font-eb-garamond)] sm:grid-cols-2 sm:grid-rows-3"
            >
              {page.map((detail) => (
                <div
                  key={`${detail.label}-${detail.value}`}
                  className="flex w-full flex-col items-start gap-1.5 border-b border-white/10 pb-2 sm:grid sm:grid-cols-2 sm:gap-3"
                >
                  <span className="font-bold leading-6 text-white">{detail.label}</span>
                  <span
                    className={`min-w-0 break-words leading-6 text-left sm:text-right ${
                      detail.label.toLowerCase() === "sale status"
                        ? saleStatusTextClass(
                            detail.value === "Upcoming" || detail.value === "Active" || detail.value === "Ended"
                              ? detail.value
                              : undefined
                          )
                        : "text-white/90"
                    }`}
                  >
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        {detailPages.length > 1 ? (
          <div className="mt-2 flex items-center justify-center gap-1.5 text-white/45" aria-hidden="true">
            {detailPages.map((_, pageIndex) => (
              <span key={`detail-page-dot-${pageIndex}`} className="h-1.5 w-1.5 rounded-full bg-current" />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 sm:mt-5">
        {projectDocuments.length > 0 ? (
          <>
            <div className="mb-2 min-h-6 font-playfair text-sm font-bold uppercase tracking-[0.16em] text-white/80">
              {t("projects.documents")}
            </div>
            <div className="flex flex-col gap-2 pb-1 sm:flex-row sm:snap-x sm:snap-mandatory sm:gap-3 sm:overflow-x-auto">
              {projectDocuments.map((document) => (
                <a
                  key={document.filePath}
                  href={document.filePath}
                  download
                  className="flex w-full items-center justify-between border-b border-white/10 px-1 py-2 text-sm text-white/80 transition hover:text-white sm:w-[calc((100%-1.5rem)/3)] sm:min-w-[calc((100%-1.5rem)/3)] sm:shrink-0 sm:snap-start"
                >
                  <span className="truncate pr-3">{document.label}</span>
                  <span className="inline-flex items-center text-xs text-white/75">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-3.5 w-3.5 fill-none stroke-current"
                      strokeWidth="2"
                    >
                      <path d="M12 3v11" strokeLinecap="round" />
                      <path
                        d="m7 11 5 5 5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M4 20h16" strokeLinecap="round" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
            {hasDocumentOverflow && (
              <div className="mt-2 hidden items-center justify-center gap-1.5 text-white/45 sm:flex" aria-hidden="true">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              </div>
            )}
          </>
        ) : null}
      </div>

      <div className="my-5 h-px w-full bg-white/15" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {showWalletStats ? (
          <div className="grid w-full divide-y divide-white/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:w-auto lg:grid-cols-2">
            <div className="flex min-h-[56px] flex-col justify-center px-3 py-2 sm:pr-5">
              <div className="text-sm font-bold uppercase tracking-[0.16em] text-white/80">{t("projects.stats.paymentTokenBalance")}</div>
              <div className="mt-1 text-sm font-normal text-white">{usdBalanceDisplay}</div>
            </div>
            <div className="flex min-h-[56px] flex-col justify-center px-3 py-2 sm:px-5">
              <div className="text-sm font-bold uppercase tracking-[0.16em] text-white/80">{t("projects.stats.ownedTickets")}</div>
              <div className="mt-1 text-sm font-normal text-white">{selectedOwnedTickets}</div>
            </div>
          </div>
        ) : null}

        {isSaleActive ? (
          <div className="flex flex-wrap items-end justify-start gap-3 lg:justify-end">
            <a
              href={`mailto:partners@hainan-infra.com?subject=${encodeURIComponent(
                `Traditional investment request: ${selectedProject.name}`
              )}`}
              className="inline-flex min-h-[48px] items-center border border-white bg-black px-4 py-2 font-playfair text-sm text-white transition hover:border-white/70 hover:bg-black hover:text-white sm:min-h-[56px]"
            >
              {t("projects.traditionalContact")}
            </a>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[12rem]">
              <input
                id="ticket-amount"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                value={purchaseTicketAmount}
                placeholder={t("projects.buy.ticketAmount")}
                aria-label={t("projects.buy.ticketAmount")}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  if (nextValue === "") {
                    onPurchaseTicketAmountChange("");
                    return;
                  }

                  const parsed = Number.parseInt(nextValue, 10);
                  if (!Number.isFinite(parsed)) {
                    return;
                  }
                  onPurchaseTicketAmountChange(Math.max(1, parsed));
                }}
                className="min-h-[44px] border border-white/35 bg-black px-3 py-2 text-sm text-white placeholder:text-white/45 outline-none"
              />
              <div ref={connectorMenuRef} className="relative">
                <button
                  type="button"
                  onClick={isConnected ? onPurchaseClick : onToggleConnectorMenu}
                  disabled={isConnected ? isBuyActionDisabled : isConnecting}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 border border-white bg-white px-4 py-2 font-playfair text-sm text-black transition hover:border-white/80 hover:bg-white/90 hover:text-black disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[56px]"
                  aria-haspopup={!isConnected && hasConnectorChoice ? "menu" : undefined}
                  aria-expanded={!isConnected && hasConnectorChoice ? showConnectorMenu : undefined}
                  aria-controls={!isConnected && hasConnectorChoice ? "project-wallet-connector-menu" : undefined}
                >
                  {isConnecting
                    ? t("projects.action.connecting")
                    : isBuying
                      ? t("projects.action.processing")
                      : isConnected
                        ? t("projects.action.buyTicket")
                        : t("wallet.connect")}
                  {!isConnected && hasConnectorChoice && !isConnecting ? <span aria-hidden="true">▾</span> : null}
                </button>

                {!isConnected && showConnectorMenu && hasConnectorChoice ? (
                  <div
                    id="project-wallet-connector-menu"
                    role="menu"
                    aria-label={t("wallet.connectorMenu")}
                    className="absolute right-0 z-50 mt-2 w-[min(86vw,14rem)] border border-white bg-black p-2 shadow-lg"
                  >
                    <button
                      type="button"
                      onClick={onConnectWithBrowserWallet}
                      role="menuitem"
                      className="w-full px-3 py-2 text-left text-sm text-white transition hover:bg-white/10"
                    >
                      {t("wallet.browserWallet")}
                    </button>
                    <button
                      type="button"
                      onClick={onConnectWithWalletConnect}
                      role="menuitem"
                      className="mt-1 w-full px-3 py-2 text-left text-sm text-white transition hover:bg-white/10"
                    >
                      {t("wallet.walletConnect")}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
