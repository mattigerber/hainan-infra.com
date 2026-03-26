"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useChainId, useConnect, usePublicClient, useSwitchChain } from "wagmi";
import { mainnet } from "wagmi/chains";

import {
  coreOptions,
  sectorTaxonomy,
  emptyProjectsByCategory,
  loadProjectsFromFolders,
  type CoreType,
  type ListedProject,
  type CategoryId,
} from "@/data/projectFilterSystem";
import ToastNotification from "@/components/Feedback/ToastNotification";
import { useToast } from "@/components/Feedback/useToast";
import ProjectCardStrip from "@/components/Projects/ProjectCardStrip";
import ProjectDetailPanel from "@/components/Projects/ProjectDetailPanel";
import ProjectFilterControls from "@/components/Projects/ProjectFilterControls";
import ProjectGalleryModal from "@/components/Projects/ProjectGalleryModal";
import WalletConnectDisclaimerModal from "@/components/Wallet/WalletConnectDisclaimerModal";
import { useWalletConnectDisclaimer } from "@/components/Wallet/useWalletConnectDisclaimer";
import {
  connectWithBrowserWallet as runBrowserWalletConnect,
  connectWithWalletConnect as runWalletConnect,
  resolveWalletConnectorOptions,
} from "@/components/Wallet/walletConnectorUtils";
import { useOnchainTicketPortfolio } from "@/components/Wallet/useOnchainTicketPortfolio";
import {
  readErc20Balance,
  readSaleSnapshot,
  resolveTicketSaleAddress,
} from "@/lib/contracts";
import { publicEnv } from "@/lib/env";
import { useI18n } from "@/i18n/I18nProvider";
import { parseErrorMessage } from "@/utils/errorHandling";
import { useViewportSize } from "@/hooks/useViewportSize";
import { MAINNET_USDC_ADDRESS } from "./projectSection.constants";
import { processGalleryItems } from "./projectSection.gallery";
import {
  buildFilteredProjectDetails,
  formatUnixTimestamp,
  formatUsdcCurrency,
  getImageNaturalSize,
  getProjectImageSources,
  preloadImage,
  type OnchainProjectSnapshot,
  upsertProjectDetailValue,
} from "./projectSection.helpers";

export default function ProjectSection() {
  const targetChainId = mainnet.id;
  const { t, locale } = useI18n();
  const headingAlignmentClass = locale === "ar" ? "text-right" : "text-left";
  const walletConnectProjectId = publicEnv.walletConnectProjectId;
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const activePublicClient = usePublicClient({ chainId });
  const publicClient = usePublicClient({ chainId: targetChainId });
  const { switchChainAsync } = useSwitchChain();
  const { connect, connectors, status } = useConnect();
  const {
    isDisclaimerOpen,
    requestWithDisclaimer,
    confirmDisclaimer,
    cancelDisclaimer,
  } = useWalletConnectDisclaimer();

  const [pipelineCount] = useState(
    () => 5 + (Math.floor(Date.now() / 86400000) % 5)
  );
  const [selectedCore, setSelectedCore] = useState<CoreType | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedSubsector, setSelectedSubsector] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projectsByCategory, setProjectsByCategory] = useState<Record<CategoryId, ListedProject[]>>(emptyProjectsByCategory);
  const [onchainProjectSnapshots, setOnchainProjectSnapshots] = useState<Record<string, OnchainProjectSnapshot>>({});
  const [walletUsdcBalance, setWalletUsdcBalance] = useState<string | null>(null);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [projectsLoadError, setProjectsLoadError] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [failedGallerySources, setFailedGallerySources] = useState<Set<string>>(new Set());
  const [mainMediaWidth, setMainMediaWidth] = useState(0);
  const [previewGridWidth, setPreviewGridWidth] = useState(0);
  const [imageNaturalSizes, setImageNaturalSizes] = useState<Record<string, { width: number; height: number }>>({});
  const [showConnectorMenu, setShowConnectorMenu] = useState(false);
  const [purchaseTicketAmount, setPurchaseTicketAmount] = useState<number | "">("");

  const { toast, isToastVisible, showToast, closeToast } = useToast();
  const { width: viewportWidth, height: viewportHeight } = useViewportSize();

  const projectBrowserRef = useRef<HTMLDivElement | null>(null);
  const projectCardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const projectsSectionRef = useRef<HTMLElement | null>(null);
  const projectDetailRef = useRef<HTMLDivElement | null>(null);
  const mainMediaRef = useRef<HTMLDivElement | null>(null);
  const previewGridRef = useRef<HTMLDivElement | null>(null);
  const connectorMenuRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeoutsRef = useRef<number[]>([]);
  const preloadedAssetSourcesRef = useRef<Set<string>>(new Set());

  const clearScrollTimers = useCallback(() => {
    const timeoutIds = [...scrollTimeoutsRef.current];
    scrollTimeoutsRef.current = [];
    timeoutIds.forEach((timerId) => window.clearTimeout(timerId));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      setIsProjectsLoading(true);
      setProjectsLoadError(null);

      try {
        const loaded = await loadProjectsFromFolders();
        if (cancelled) return;
        setProjectsByCategory(loaded);
      } catch (loadError) {
        if (cancelled) return;
        const message = parseErrorMessage(loadError, t("projects.error.loadFallback"));
        setProjectsLoadError(message);
        setProjectsByCategory(emptyProjectsByCategory);
      } finally {
        if (!cancelled) {
          setIsProjectsLoading(false);
        }
      }
    };

    void loadProjects();

    return () => {
      cancelled = true;
      clearScrollTimers();
    };
  }, [clearScrollTimers, t]);

  useEffect(() => {
    if (!showConnectorMenu || typeof document === "undefined") {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        connectorMenuRef.current
        && !connectorMenuRef.current.contains(event.target as Node)
      ) {
        setShowConnectorMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowConnectorMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showConnectorMenu]);

  useEffect(() => {
    if (isConnected) {
      setShowConnectorMenu(false);
    }
  }, [isConnected]);

  useEffect(() => {
    let cancelled = false;

    const loadOnchainSnapshots = async () => {
      if (!publicClient) {
        setOnchainProjectSnapshots({});
        return;
      }

      const allProjects = Object.values(projectsByCategory).flat();
      if (allProjects.length === 0) {
        setOnchainProjectSnapshots({});
        return;
      }

      const results = await Promise.all(
        allProjects.map(async (project) => {
          const resolvedAddress = resolveTicketSaleAddress(project.contractAddress);

          if (!resolvedAddress) {
            return { projectId: project.id, snapshot: null };
          }

          try {
            const sale = await readSaleSnapshot(publicClient, resolvedAddress);

            const nextSnapshot: OnchainProjectSnapshot = {
              contractAddress: resolvedAddress,
              paymentToken: sale.paymentToken,
              ticketSize: formatUsdcCurrency(sale.ticketPrice),
              totalFundraising: formatUsdcCurrency(
                BigInt(sale.ticketPrice) * BigInt(sale.maxTickets)
              ),
              ticketsSold: Number(sale.ticketsSold),
              maxTickets: Number(sale.maxTickets),
              saleStatus: sale.saleStatus,
            };

            const safeTicketsLeft = Number(sale.ticketsLeft);
            if (Number.isFinite(safeTicketsLeft)) {
              nextSnapshot.ticketsLeft = safeTicketsLeft;
            }

            const formattedStart = formatUnixTimestamp(sale.start);
            if (formattedStart) {
              nextSnapshot.fundraisingStart = `${formattedStart} UTC`;
            }

            const formattedEnd = formatUnixTimestamp(sale.end);
            if (formattedEnd) {
              nextSnapshot.fundraisingEnd = `${formattedEnd} UTC`;
            }

            const hasOnchainValues =
              nextSnapshot.ticketSize !== undefined ||
              nextSnapshot.totalFundraising !== undefined ||
              nextSnapshot.ticketsLeft !== undefined ||
              nextSnapshot.fundraisingStart !== undefined ||
              nextSnapshot.fundraisingEnd !== undefined ||
              nextSnapshot.saleStatus !== undefined;

            return {
              projectId: project.id,
              snapshot: hasOnchainValues ? nextSnapshot : null,
            };
          } catch {
            return {
              projectId: project.id,
              snapshot: null,
            };
          }
        })
      );

      if (cancelled) return;

      const nextSnapshots = results.reduce<Record<string, OnchainProjectSnapshot>>((acc, entry) => {
        if (entry.snapshot) {
          acc[entry.projectId] = entry.snapshot;
        }
        return acc;
      }, {});

      setOnchainProjectSnapshots(nextSnapshots);
    };

    void loadOnchainSnapshots();

    return () => {
      cancelled = true;
    };
  }, [projectsByCategory, publicClient]);

  const refreshProjectSnapshot = useCallback(async (project: ListedProject) => {
    if (!publicClient) return;
    const resolvedAddress = resolveTicketSaleAddress(project.contractAddress);
    if (!resolvedAddress) return;
    try {
      const sale = await readSaleSnapshot(publicClient, resolvedAddress);
      const nextSnapshot: OnchainProjectSnapshot = {
        contractAddress: resolvedAddress,
        paymentToken: sale.paymentToken,
        ticketSize: formatUsdcCurrency(sale.ticketPrice),
        totalFundraising: formatUsdcCurrency(
          BigInt(sale.ticketPrice) * BigInt(sale.maxTickets)
        ),
        ticketsSold: Number(sale.ticketsSold),
        maxTickets: Number(sale.maxTickets),
        saleStatus: sale.saleStatus,
      };
      const safeTicketsLeft = Number(sale.ticketsLeft);
      if (Number.isFinite(safeTicketsLeft)) {
        nextSnapshot.ticketsLeft = safeTicketsLeft;
      }
      const formattedStart = formatUnixTimestamp(sale.start);
      if (formattedStart) {
        nextSnapshot.fundraisingStart = `${formattedStart} UTC`;
      }
      const formattedEnd = formatUnixTimestamp(sale.end);
      if (formattedEnd) {
        nextSnapshot.fundraisingEnd = `${formattedEnd} UTC`;
      }
      setOnchainProjectSnapshots((prev) => ({
        ...prev,
        [project.id]: nextSnapshot,
      }));
    } catch {
      // silently ignore refresh errors — stale data is acceptable
    }
  }, [publicClient]);

  const projectsWithOnchainDataByCategory = useMemo(() => {
    const applyOnchainOverrides = (project: ListedProject): ListedProject => {
      const snapshot = onchainProjectSnapshots[project.id];
      if (!snapshot) {
        return project;
      }

      const nextContractAddress = snapshot.contractAddress ?? project.contractAddress;
      const nextTicketSize = snapshot.ticketSize ?? project.ticketSize;
      const nextTotalFundraising = snapshot.totalFundraising ?? project.totalFundraising;
      const nextTicketsLeft = snapshot.ticketsLeft ?? project.ticketsLeft;
      const nextFundraisingStart = snapshot.fundraisingStart;
      const nextFundraisingEnd = snapshot.fundraisingEnd;
      const nextSaleStatus = snapshot.saleStatus;

      let nextDetails = project.details;
      nextDetails = upsertProjectDetailValue(nextDetails, "Contract Address", nextContractAddress);
      nextDetails = upsertProjectDetailValue(nextDetails, "Ticket Size", nextTicketSize);
      nextDetails = upsertProjectDetailValue(nextDetails, "Total Fundraising", nextTotalFundraising);
      nextDetails = upsertProjectDetailValue(nextDetails, "Tickets Left", String(nextTicketsLeft));
      if (snapshot.ticketsSold !== undefined) {
        nextDetails = upsertProjectDetailValue(nextDetails, "Tickets Sold", String(snapshot.ticketsSold));
      }
      if (snapshot.maxTickets !== undefined) {
        nextDetails = upsertProjectDetailValue(nextDetails, "Max Tickets", String(snapshot.maxTickets));
      }
      if (nextFundraisingStart) {
        nextDetails = upsertProjectDetailValue(nextDetails, "Fundraising Start", nextFundraisingStart);
      }
      if (nextFundraisingEnd) {
        nextDetails = upsertProjectDetailValue(nextDetails, "Fundraising End", nextFundraisingEnd);
      }
      if (nextSaleStatus) {
        nextDetails = upsertProjectDetailValue(nextDetails, "Sale Status", nextSaleStatus);
      }

      return {
        ...project,
        contractAddress: nextContractAddress,
        ticketSize: nextTicketSize,
        totalFundraising: nextTotalFundraising,
        ticketsLeft: nextTicketsLeft,
        details: nextDetails,
      };
    };

    return {
      core: projectsByCategory.core.map(applyOnchainOverrides),
      expansion: projectsByCategory.expansion.map(applyOnchainOverrides),
      pipeline: projectsByCategory.pipeline.map(applyOnchainOverrides),
    };
  }, [onchainProjectSnapshots, projectsByCategory]);

  const categorizedProjects = useMemo(
    () => ({
      ...projectsWithOnchainDataByCategory,
      pipeline: projectsWithOnchainDataByCategory.pipeline.slice(0, pipelineCount),
    }),
    [pipelineCount, projectsWithOnchainDataByCategory]
  );

  const allProjects = useMemo(
    () => [
      ...categorizedProjects.core,
      ...categorizedProjects.expansion,
      ...categorizedProjects.pipeline,
    ],
    [categorizedProjects]
  );

  const listedProjects = useMemo(
    () => allProjects.filter((project) => project.listingStatus !== "finished"),
    [allProjects]
  );

  const {
    holdings,
    pendingProjectId,
    buyTicket,
  } = useOnchainTicketPortfolio(address, allProjects);

  const sectorOptions = useMemo(
    () => sectorTaxonomy.map((s) => s.label),
    []
  );

  const subsectorOptions = useMemo(() => {
    if (!selectedSector) return [];
    const sector = sectorTaxonomy.find((s) => s.label === selectedSector);
    return sector ? sector.subcategories.map((sub) => sub.label) : [];
  }, [selectedSector]);

  const visibleProjects = useMemo(
    () =>
      listedProjects.filter((project) => {
        if (selectedCore && project.coreType !== selectedCore) return false;
        if (selectedSector && project.sector !== selectedSector) return false;
        if (selectedSubsector && project.subsector !== selectedSubsector) return false;
        return true;
      }),
    [listedProjects, selectedCore, selectedSector, selectedSubsector]
  );

  const coreOptionCounts = useMemo(
    () =>
      coreOptions.map((option) => ({
        option,
        count: listedProjects.filter((project) => project.coreType === option).length,
      })),
    [listedProjects]
  );

  const sectorOptionCounts = useMemo(
    () =>
      sectorOptions.map((option) => ({
        option,
        count: listedProjects.filter(
          (project) => project.coreType === selectedCore && project.sector === option
        ).length,
      })),
    [listedProjects, sectorOptions, selectedCore]
  );

  const subsectorOptionCounts = useMemo(
    () =>
      subsectorOptions.map((option) => ({
        option,
        count: listedProjects.filter(
          (project) =>
            project.coreType === selectedCore &&
            project.sector === selectedSector &&
            project.subsector === option
        ).length,
      })),
    [listedProjects, selectedCore, selectedSector, subsectorOptions]
  );

  // Clear selectedProjectId if it gets filtered out by the current filters
  useEffect(() => {
    if (selectedProjectId && visibleProjects.length > 0) {
      const stillVisible = visibleProjects.some(
        (project) => project.id === selectedProjectId
      );
      if (!stillVisible) {
        // Selected project was filtered out; clear the selection
        setSelectedProjectId("");
      }
    }
  }, [selectedProjectId, visibleProjects]);

  // Keep one project selected whenever the filtered list has entries.
  useEffect(() => {
    if (!selectedProjectId && visibleProjects.length > 0) {
      setSelectedProjectId(visibleProjects[0].id);
    }
  }, [selectedProjectId, visibleProjects]);

  // activeProjectId returns a project only when the selected id is still visible.
  const activeProjectId = useMemo(() => {
    if (!selectedProjectId || visibleProjects.length === 0) return "";

    const isStillVisible = visibleProjects.some(
      (project) => project.id === selectedProjectId
    );

    return isStillVisible ? selectedProjectId : "";
  }, [selectedProjectId, visibleProjects]);

  // Resolve the selected project from the current visible list.
  const selectedProject = useMemo(
    () =>
      activeProjectId
        ? visibleProjects.find((project) => project.id === activeProjectId)
        : undefined,
    [activeProjectId, visibleProjects]
  );

  const investedProjects = useMemo(
    () => allProjects.filter((project) => (holdings[project.id] ?? 0) > 0),
    [allProjects, holdings]
  );

  useEffect(() => {
    if (!selectedProject) return;

    getProjectImageSources(selectedProject).forEach((src) => {
      if (preloadedAssetSourcesRef.current.has(src)) return;
      preloadedAssetSourcesRef.current.add(src);
      preloadImage(src);
    });
  }, [selectedProject]);

  useEffect(() => {
    if (investedProjects.length === 0) return;

    investedProjects.forEach((project) => {
      // Keep this bounded: preload only first two gallery images for owned projects.
      getProjectImageSources(project)
        .slice(0, 2)
        .forEach((src) => {
          if (preloadedAssetSourcesRef.current.has(src)) return;
          preloadedAssetSourcesRef.current.add(src);
          preloadImage(src);
        });
    });
  }, [investedProjects]);

  useEffect(() => {
    if (!mainMediaRef.current) {
      return;
    }

    const element = mainMediaRef.current;
    const updateWidth = () => setMainMediaWidth(element.clientWidth);

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, [selectedProject?.id]);

  useEffect(() => {
    if (!previewGridRef.current) {
      return;
    }

    const element = previewGridRef.current;
    const updateWidth = () => setPreviewGridWidth(element.clientWidth);

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, [selectedProject?.id]);

  const {
    browserInjectedConnector,
    walletConnectConnector,
    isWalletConnectConfigured,
    canUseBrowserWallet,
    canUseWalletConnect,
    hasConnectorChoice,
  } = resolveWalletConnectorOptions(connectors, walletConnectProjectId);
  const selectedProjectSnapshot = selectedProject
    ? onchainProjectSnapshots[selectedProject.id]
    : undefined;
  const selectedSaleStatus = selectedProjectSnapshot?.saleStatus;
  const isSaleActive = selectedSaleStatus === "Active";
  const isSaleUpcoming = selectedSaleStatus === "Upcoming";
  const isSaleEnded = selectedSaleStatus === "Ended";
  const showWalletStats = isConnected && (isSaleActive || isSaleEnded);
  const isSaleInactive = isSaleUpcoming || isSaleEnded;
  const isConnecting = status === "pending";
  const isBuying = pendingProjectId === activeProjectId;
  const isBuyActionDisabled = !activeProjectId || isConnecting || isBuying || isSaleInactive;
  const targetChainName =
    "Ethereum Mainnet";
  const selectedOwnedTickets = holdings[activeProjectId] ?? 0;
  const usdBalanceDisplay = isConnected
    ? walletUsdcBalance ?? "--"
    : t("projects.balancePlaceholder");

  useEffect(() => {
    let cancelled = false;

    const loadWalletUsdcBalance = async () => {
      if (!address || !activePublicClient) {
        setWalletUsdcBalance(null);
        return;
      }

      const walletAddress = resolveTicketSaleAddress(address);
      if (!walletAddress) {
        setWalletUsdcBalance(null);
        return;
      }

      try {
        const selectedPaymentToken = selectedProject
          ? onchainProjectSnapshots[selectedProject.id]?.paymentToken
          : undefined;
        const resolvedPaymentToken = selectedPaymentToken
          ? resolveTicketSaleAddress(selectedPaymentToken)
          : null;
        const usdcAddress = resolvedPaymentToken ?? MAINNET_USDC_ADDRESS;
        const balance = await readErc20Balance(activePublicClient, usdcAddress, walletAddress);

        if (cancelled) return;

        const formattedNumeric = Number(formatUnits(balance, 6));
        const formatted = Number.isFinite(formattedNumeric)
          ? new Intl.NumberFormat("en-US", {
              minimumFractionDigits: formattedNumeric >= 1 ? 2 : 4,
              maximumFractionDigits: 6,
            }).format(formattedNumeric)
          : formatUnits(balance, 6);

        setWalletUsdcBalance(formatted);
      } catch {
        if (!cancelled) {
          setWalletUsdcBalance(null);
        }
      }
    };

    void loadWalletUsdcBalance();

    return () => {
      cancelled = true;
    };
  }, [activePublicClient, address, chainId, onchainProjectSnapshots, selectedProject]);


  const selectedProjectGallery = useMemo(
    () => selectedProject?.gallery ?? [],
    [selectedProject]
  );
  const {
    hasSelectedVideo,
    selectedVideo,
    selectedVideoIndex,
    primaryNoVideoImageEntry,
    selectedVideoCoverImage,
    galleryPreviewItems,
    galleryPreviewSlots,
    hiddenPreviewImageCount,
  } = useMemo(() => processGalleryItems(selectedProjectGallery), [selectedProjectGallery]);
  const filteredProjectDetails = selectedProject
    ? buildFilteredProjectDetails(
        selectedProject,
        onchainProjectSnapshots[selectedProject.id],
        t
      )
    : [];
  const projectDocuments = selectedProject?.documents ?? [];
  const hasMetricOverflow = (selectedProject?.metrics.length ?? 0) > 3;
  const hasDocumentOverflow = projectDocuments.length > 3;
  const canNavigateGallery = selectedProjectGallery.length > 1;

  useEffect(() => {
    if (!isGalleryOpen || !canNavigateGallery || typeof document === "undefined") {
      return;
    }

    const handleGalleryKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveGalleryIndex(
          (prev) =>
            (prev - 1 + selectedProjectGallery.length) % selectedProjectGallery.length
        );
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveGalleryIndex((prev) => (prev + 1) % selectedProjectGallery.length);
      }
    };

    document.addEventListener("keydown", handleGalleryKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGalleryKeyDown);
    };
  }, [canNavigateGallery, isGalleryOpen, selectedProjectGallery.length]);

  useEffect(() => {
    let cancelled = false;

    const imageSources = Array.from(
      new Set(
        selectedProjectGallery
          .filter((item) => item.kind === "image")
          .map((item) => item.src)
      )
    );

    if (imageSources.length === 0) {
      return;
    }

    const loadNaturalSizes = async () => {
      const pairs = await Promise.all(
        imageSources.map(async (src) => ({
          src,
          size: await getImageNaturalSize(src),
        }))
      );

      if (cancelled) {
        return;
      }

      setImageNaturalSizes((prev) => {
        const next = { ...prev };
        pairs.forEach(({ src, size }) => {
          if (size) {
            next[src] = size;
          }
        });
        return next;
      });
    };

    void loadNaturalSizes();

    return () => {
      cancelled = true;
    };
  }, [selectedProjectGallery]);

  const isPhoneViewport = viewportWidth > 0 && viewportWidth < 640;

  const getClampedImageHeight = useCallback(
    (src: string | null, targetWidth: number, maxHeight: number) => {
      if (!src || targetWidth <= 0 || maxHeight <= 0) {
        return null;
      }

      const natural = imageNaturalSizes[src];
      if (!natural) {
        return null;
      }

      const widthScale = Math.min(targetWidth / natural.width, 1);
      const scaledHeight = natural.height * widthScale;
      return Math.min(scaledHeight, maxHeight);
    },
    [imageNaturalSizes]
  );

  const mainDisplayImageSrc = hasSelectedVideo
    ? selectedVideoCoverImage
    : (primaryNoVideoImageEntry?.item.src ?? null);
  const mainMediaMaxHeightPx = viewportHeight > 0 ? Math.min(viewportHeight * 0.5, 320) : 320;
  const mainMediaHeightPx = isPhoneViewport
    ? getClampedImageHeight(mainDisplayImageSrc, mainMediaWidth, mainMediaMaxHeightPx)
    : null;

  const previewGapPx = 16;
  const previewCardWidthPx = previewGridWidth > previewGapPx ? (previewGridWidth - previewGapPx) / 2 : 0;
  const previewCardMaxHeightPx = viewportHeight > 0 ? Math.min(viewportHeight * 0.26, 176) : 176;

  const activeGalleryImageSrc =
    selectedProjectGallery[activeGalleryIndex]?.kind === "image"
      ? selectedProjectGallery[activeGalleryIndex].src
      : null;
  const galleryModalMaxHeightPx = viewportHeight > 0 ? Math.min(viewportHeight * 0.82, 720) : 720;
  const galleryModalHeightPx = isPhoneViewport
    ? getClampedImageHeight(activeGalleryImageSrc, Math.max(viewportWidth - 16, 0), galleryModalMaxHeightPx)
    : null;

  const handleOpenVideoGallery = useCallback(() => {
    if (selectedVideoIndex === null) return;
    setActiveGalleryIndex(selectedVideoIndex);
    setIsGalleryOpen(true);
  }, [selectedVideoIndex]);

  const handleOpenPrimaryImageGallery = useCallback(() => {
    if (!primaryNoVideoImageEntry) return;
    setActiveGalleryIndex(primaryNoVideoImageEntry.galleryIndex);
    setIsGalleryOpen(true);
  }, [primaryNoVideoImageEntry]);

  const connectWithBrowserWallet = useCallback(() => {
    void runBrowserWalletConnect({
      browserInjectedConnector,
      connect,
      noBrowserWalletMessage: t("wallet.error.noBrowserWallet"),
      connectStartFailedMessage: t("projects.error.connectStartFailed"),
      onError: (message) => showToast(message, "error"),
      onSuccess: () => {
        setShowConnectorMenu(false);
      },
    });
  }, [browserInjectedConnector, connect, showToast, t]);

  const connectWithWalletConnect = useCallback(() => {
    runWalletConnect({
      walletConnectConnector,
      isWalletConnectConfigured,
      connect,
      walletConnectNotConfiguredMessage: t("wallet.error.walletConnectNotConfigured"),
      connectStartFailedMessage: t("projects.error.connectStartFailed"),
      onError: (message) => showToast(message, "error"),
      onSuccess: () => {
        setShowConnectorMenu(false);
      },
    });
  }, [connect, isWalletConnectConfigured, showToast, t, walletConnectConnector]);

  const handleConnectWallet = useCallback(() => {
    return requestWithDisclaimer(() => {
      if (!canUseBrowserWallet && !canUseWalletConnect) {
        showToast(t("wallet.error.noConnector"), "error");
        return false;
      }

      if (hasConnectorChoice) {
        setShowConnectorMenu((current) => !current);
        return true;
      }

      if (canUseWalletConnect && walletConnectConnector) {
        connectWithWalletConnect();
        return true;
      }

      if (canUseBrowserWallet && browserInjectedConnector) {
        connectWithBrowserWallet();
        return true;
      }

      return false;
    });
  }, [
    browserInjectedConnector,
    canUseBrowserWallet,
    canUseWalletConnect,
    connectWithBrowserWallet,
    connectWithWalletConnect,
    hasConnectorChoice,
    requestWithDisclaimer,
    showToast,
    t,
    walletConnectConnector,
  ]);

  const handlePurchaseClick = async () => {
    if (!selectedProject) {
      showToast(t("projects.error.noProjectSelected"), "error");
      return;
    }

    const selectedSnapshot = onchainProjectSnapshots[selectedProject.id];
    const saleStatus = selectedSnapshot?.saleStatus;
    if (saleStatus === "Upcoming") {
      showToast(t("projects.error.saleNotStarted"), "error");
      return;
    }
    if (saleStatus === "Ended") {
      return;
    }

    if (
      typeof purchaseTicketAmount !== "number"
      || !Number.isInteger(purchaseTicketAmount)
      || purchaseTicketAmount <= 0
    ) {
      showToast(t("projects.error.invalidTicketAmount"), "error");
      return;
    }

    if (!isConnected) {
      handleConnectWallet();
      return;
    }

    if (typeof chainId !== "number") {
      showToast(t("projects.action.connecting"), "error");
      return;
    }

    if (chainId !== targetChainId) {
      try {
        await switchChainAsync({ chainId: targetChainId });
      } catch (switchError) {
        showToast(
          parseErrorMessage(
            switchError,
            t("projects.error.switchFailed", { chainName: targetChainName })
          ),
          "error"
        );
        return;
      }
    }

    // Ensure we have an explicitly selected project (not just the first visible)
    if (!activeProjectId || !selectedProject) {
      showToast(t("projects.error.selectVisibleProject"), "error");
      return;
    }

    try {
      const buyResult = await buyTicket(selectedProject, purchaseTicketAmount);

      if (buyResult.ok) {
        showToast(t("projects.success.purchase", { projectName: selectedProject.name }), "success");
        void refreshProjectSnapshot(selectedProject);
      } else {
        showToast(buyResult.error, "error");
      }
    } catch (purchaseError) {
      showToast(parseErrorMessage(purchaseError, t("projects.error.purchaseFailed")), "error");
    }
  };

  const jumpToProjectFromHoldings = useCallback((projectId: string) => {
    setSelectedCore(null);
    setSelectedSector(null);
    setSelectedSubsector(null);
    setSelectedProjectId(projectId);

    window.requestAnimationFrame(() => {
      const easeInOutQuint = (t: number) =>
        t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
      const animateToElement = (element: HTMLElement) => {
        const startY = window.scrollY;
        const targetY = Math.max(0, element.getBoundingClientRect().top + window.scrollY - 28);
        const distance = targetY - startY;
        const duration = 1450;
        const startTime = performance.now();

        const tick = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeInOutQuint(progress);

          window.scrollTo({ top: startY + distance * eased });

          if (progress < 1) {
            window.requestAnimationFrame(tick);
          }
        };

        window.requestAnimationFrame(tick);
      };

      const timerId = window.setTimeout(() => {
        if (projectDetailRef.current) {
          animateToElement(projectDetailRef.current);
        }
      }, 220);
      scrollTimeoutsRef.current.push(timerId);
    });
  }, []);

  useEffect(() => {
    const openProjectHandler = (event: Event) => {
      const projectId = (event as CustomEvent<{ projectId?: string }>).detail?.projectId;
      if (!projectId) {
        return;
      }

      jumpToProjectFromHoldings(projectId);
    };

    window.addEventListener("hip:open-project", openProjectHandler as EventListener);
    return () => {
      window.removeEventListener("hip:open-project", openProjectHandler as EventListener);
    };
  }, [jumpToProjectFromHoldings]);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
    setPurchaseTicketAmount("");

    const browser = projectBrowserRef.current;
    const selectedCard = projectCardRefs.current[projectId];
    if (browser && selectedCard) {
      browser.scrollTo({
        left: selectedCard.offsetLeft,
        behavior: "smooth",
      });
    }

    const scrollToProjectDetail = () => {
      const detailElement = projectDetailRef.current;
      if (!detailElement) return;

      const startY = window.scrollY;
      const targetY = Math.max(0, detailElement.getBoundingClientRect().top + window.scrollY - 24);
      const distance = targetY - startY;
      const duration = 950;
      const startTime = performance.now();

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        window.scrollTo({ top: startY + distance * eased });

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        }
      };

      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(() => {
      const timerId = window.setTimeout(scrollToProjectDetail, 120);
      scrollTimeoutsRef.current.push(timerId);
    });
  };

  return (
    <>
      <section
        ref={projectsSectionRef}
        id="projects"
        className="bg-black px-8 pb-16 text-white sm:px-6 md:px-10"
      >
        <div className="mx-auto max-w-7xl pt-4 md:pt-6 2xl:max-w-[90rem]">
          <div className="mb-8">
            <div className={headingAlignmentClass}>
              <div className="mb-3 text-sm uppercase tracking-[0.22em] text-white/60">
                {t("projects.section.label")}
              </div>
              <h2 className="font-playfair text-3xl uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
                {t("projects.section.title")}
              </h2>
            </div>
          </div>

          <ProjectFilterControls
            selectedCore={selectedCore}
            selectedSector={selectedSector}
            selectedSubsector={selectedSubsector}
            coreOptionCounts={coreOptionCounts}
            sectorOptionCounts={sectorOptionCounts}
            subsectorOptionCounts={subsectorOptionCounts}
            labels={{
              core: t("projects.filter.core"),
              sector: t("projects.filter.sector"),
              subsector: t("projects.filter.subsector"),
              noOptions: t("projects.filter.noOptions"),
            }}
            onSelectCore={(option) => {
              setSelectedCore(option);
              setSelectedSector(null);
              setSelectedSubsector(null);
            }}
            onClearCore={() => {
              setSelectedCore(null);
              setSelectedSector(null);
              setSelectedSubsector(null);
            }}
            onSelectSector={(option) => {
              setSelectedSector(option);
              setSelectedSubsector(null);
            }}
            onClearSector={() => {
              setSelectedSector(null);
              setSelectedSubsector(null);
            }}
            onSelectSubsector={(option) => setSelectedSubsector(option)}
            onClearSubsector={() => setSelectedSubsector(null)}
          />

          {visibleProjects.length === 0 ? (
            <div className="mb-10 border border-white/20 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/65">
              {isProjectsLoading ? t("projects.loading") : t("projects.noResults")}
            </div>
          ) : (
            <ProjectCardStrip
              visibleProjects={visibleProjects}
              selectedProjectId={activeProjectId}
              onchainProjectSnapshots={onchainProjectSnapshots}
              projectBrowserRef={projectBrowserRef}
              projectCardRefs={projectCardRefs}
              onSelectProject={handleProjectSelect}
              labels={{
                country: t("projects.card.country"),
                fundingRound: t("projects.card.fundingRound"),
                completionDate: t("projects.card.completionDate"),
                totalRaise: t("projects.card.totalRaise"),
                ticketSize: t("projects.card.ticketSize"),
                saleStatus: t("projects.funded.saleStatus"),
                ticketsSold: t("projects.funded.ticketsSold"),
                ticketsLeft: t("projects.card.ticketsLeft"),
              }}
            />
          )}

          {selectedProject ? (
            <ProjectDetailPanel
              selectedProject={selectedProject}
              projectDetailRef={projectDetailRef}
              mainMediaRef={mainMediaRef}
              previewGridRef={previewGridRef}
              connectorMenuRef={connectorMenuRef}
              isPhoneViewport={isPhoneViewport}
              mainMediaHeightPx={mainMediaHeightPx}
              hasSelectedVideo={hasSelectedVideo}
              selectedVideo={selectedVideo}
              selectedVideoCoverImage={selectedVideoCoverImage}
              primaryNoVideoImageEntry={primaryNoVideoImageEntry}
              galleryPreviewSlots={galleryPreviewSlots}
              galleryPreviewItems={galleryPreviewItems}
              hiddenPreviewImageCount={hiddenPreviewImageCount}
              previewCardWidthPx={previewCardWidthPx}
              previewCardMaxHeightPx={previewCardMaxHeightPx}
              filteredProjectDetails={filteredProjectDetails}
              projectDocuments={projectDocuments}
              hasMetricOverflow={hasMetricOverflow}
              hasDocumentOverflow={hasDocumentOverflow}
              usdBalanceDisplay={usdBalanceDisplay}
              selectedOwnedTickets={selectedOwnedTickets}
              purchaseTicketAmount={purchaseTicketAmount}
              isSaleActive={isSaleActive}
              showWalletStats={showWalletStats}
              isConnected={isConnected}
              hasConnectorChoice={hasConnectorChoice}
              showConnectorMenu={showConnectorMenu}
              isBuyActionDisabled={isBuyActionDisabled}
              isConnecting={isConnecting}
              isBuying={isBuying}
              onOpenVideoGallery={handleOpenVideoGallery}
              onOpenPrimaryImageGallery={handleOpenPrimaryImageGallery}
              onOpenPreviewGallery={(galleryIndex) => {
                setActiveGalleryIndex(galleryIndex);
                setIsGalleryOpen(true);
              }}
              onPurchaseClick={() => {
                void handlePurchaseClick();
              }}
              onToggleConnectorMenu={() => {
                void handleConnectWallet();
              }}
              onConnectWithBrowserWallet={connectWithBrowserWallet}
              onConnectWithWalletConnect={connectWithWalletConnect}
              onPurchaseTicketAmountChange={(nextTicketAmount) => {
                setPurchaseTicketAmount(nextTicketAmount);
              }}
              getClampedImageHeight={getClampedImageHeight}
              t={t}
            />
          ) : null}
        </div>

        {selectedProject ? (
          <ProjectGalleryModal
            isOpen={isGalleryOpen}
            selectedProject={selectedProject}
            selectedProjectGallery={selectedProjectGallery}
            activeGalleryIndex={activeGalleryIndex}
            canNavigateGallery={canNavigateGallery}
            failedGallerySources={failedGallerySources}
            isPhoneViewport={isPhoneViewport}
            galleryModalHeightPx={galleryModalHeightPx}
            onClose={() => setIsGalleryOpen(false)}
            onPrev={() =>
              setActiveGalleryIndex(
                (prev) =>
                  (prev - 1 + selectedProjectGallery.length) % selectedProjectGallery.length
              )
            }
            onNext={() =>
              setActiveGalleryIndex((prev) => (prev + 1) % selectedProjectGallery.length)
            }
            onImageError={(failedSrc) => {
              setFailedGallerySources((prev) => {
                const next = new Set(prev);
                next.add(failedSrc);
                return next;
              });
            }}
            t={t}
          />
        ) : null}
      </section>

      {projectsLoadError ? (
        <div className="mx-auto mt-4 w-full max-w-7xl px-4 text-sm text-red-400 sm:px-6 md:px-10" role="alert" aria-live="polite">
          {projectsLoadError}
        </div>
      ) : null}

      {toast ? (
        <ToastNotification
          message={toast.message}
          tone={toast.tone}
          isVisible={isToastVisible}
          onClose={closeToast}
        />
      ) : null}

      <WalletConnectDisclaimerModal
        isOpen={isDisclaimerOpen}
        onConfirm={confirmDisclaimer}
        onCancel={cancelDisclaimer}
      />

    </>
  );
}
