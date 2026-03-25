import { formatUnits } from "viem";

import type { ListedProject } from "@/data/projectFilterSystem";
import type { SaleStatusLabel } from "@/lib/contracts";
import type { MessageKey } from "@/i18n/types";

export { formatProjectUid } from "@/utils/formatters";

export type OnchainProjectSnapshot = {
  contractAddress?: string;
  paymentToken?: string;
  ticketSize?: string;
  totalFundraising?: string;
  ticketsSold?: number;
  maxTickets?: number;
  ticketsLeft?: number;
  fundraisingStart?: string;
  fundraisingEnd?: string;
  saleStatus?: SaleStatusLabel;
};

export const getUniqueSorted = (values: string[]) =>
  Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));

export const getProjectImageSources = (project: ListedProject) =>
  project.gallery.filter((item) => item.kind === "image").map((item) => item.src);

export const preloadImage = (src: string) => {
  if (typeof window === "undefined") return;
  const image = new window.Image();
  image.decoding = "async";
  image.src = src;
};

export const getImageNaturalSize = (
  src: string
): Promise<{ width: number; height: number } | null> => {
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

      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };

    image.onerror = () => resolve(null);
    image.src = src;
  });
};

export const getFilenameFromSrc = (src: string) => {
  const normalized = src.split("?")[0];
  const segments = normalized.split("/");
  const rawName = segments[segments.length - 1] || src;
  const decoded = decodeURIComponent(rawName);
  return decoded.replace(/\.[^.]+$/, "");
};

export const isDirectVideoSource = (src: string) => /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(src);

export const isCoverFilename = (src: string) => /^cover(?:$|\.)/i.test(getFilenameFromSrc(src));

export const formatUsdcCurrency = (value: bigint) => {
  const decimal = formatUnits(value, 6);
  const numeric = Number(decimal);

  if (Number.isFinite(numeric)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(numeric);
  }

  return `$${decimal}`;
};

export const formatUnixTimestamp = (timestampSeconds: bigint) => {
  const safeNumber = Number(timestampSeconds);
  if (!Number.isFinite(safeNumber)) {
    return null;
  }

  const date = new Date(safeNumber * 1000);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);
};

export const saleStatusTextClass = (status: SaleStatusLabel | undefined) => {
  if (status === "Active") return "text-green-400";
  if (status === "Upcoming") return "text-yellow-300";
  if (status === "Ended") return "text-red-400";
  return "text-white";
};

export const replaceProjectDetailValue = (
  details: ListedProject["details"],
  detailLabel: string,
  nextValue: string
) => {
  const target = detailLabel.trim().toLowerCase();

  return details.map((detail) =>
    detail.label.trim().toLowerCase() === target ? { ...detail, value: nextValue } : detail
  );
};

export const upsertProjectDetailValue = (
  details: ListedProject["details"],
  detailLabel: string,
  nextValue: string
) => {
  const normalizedLabel = detailLabel.trim().toLowerCase();
  const hasLabel = details.some(
    (detail) => detail.label.trim().toLowerCase() === normalizedLabel
  );

  if (hasLabel) {
    return replaceProjectDetailValue(details, detailLabel, nextValue);
  }

  return [...details, { label: detailLabel, value: nextValue }];
};

const SALE_DETAIL_FIELDS = new Set([
  "ticket size",
  "ticket price",
  "allocation",
  "tickets left",
  "tickets sold",
  "max tickets",
  "project id",
  "fundraising start",
  "fundraising end",
  "sale status",
]);

type TranslateFn = (key: MessageKey, values?: Record<string, string | number>) => string;

export const buildFilteredProjectDetails = (
  project: ListedProject,
  snapshot: OnchainProjectSnapshot | undefined,
  t: TranslateFn
): ListedProject["details"] => {
  const detailsWithoutSaleRows = project.details.filter(
    (detail) => !SALE_DETAIL_FIELDS.has(detail.label.toLowerCase())
  );

  const totalFundraisingIndex = detailsWithoutSaleRows.findIndex(
    (detail) => detail.label.trim().toLowerCase() === "total fundraising"
  );

  const pricingDetails: ListedProject["details"] = [
    { label: "Ticket Price", value: project.ticketSize },
    {
      label: "Allocation",
      value: t("projects.stats.left", { count: project.ticketsLeft }),
    },
  ];

  const detailsWithPricing = [...detailsWithoutSaleRows];
  if (totalFundraisingIndex >= 0) {
    detailsWithPricing.splice(totalFundraisingIndex + 1, 0, ...pricingDetails);
  } else {
    detailsWithPricing.push(...pricingDetails);
  }

  const onchainSaleDetails: ListedProject["details"] = [];
  if (snapshot?.ticketsSold !== undefined) {
    onchainSaleDetails.push({ label: "Tickets Sold", value: String(snapshot.ticketsSold) });
  }
  if (snapshot?.maxTickets !== undefined) {
    onchainSaleDetails.push({ label: "Max Tickets", value: String(snapshot.maxTickets) });
  }
  if (snapshot?.fundraisingStart) {
    onchainSaleDetails.push({ label: "Fundraising Start", value: snapshot.fundraisingStart });
  }
  if (snapshot?.fundraisingEnd) {
    onchainSaleDetails.push({ label: "Fundraising End", value: snapshot.fundraisingEnd });
  }
  if (snapshot?.saleStatus) {
    onchainSaleDetails.push({ label: "Sale Status", value: snapshot.saleStatus });
  }

  return [...onchainSaleDetails, ...detailsWithPricing];
};
