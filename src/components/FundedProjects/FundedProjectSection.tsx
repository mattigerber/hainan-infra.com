"use client";

import { useEffect, useMemo, useState } from "react";

import FundedProjectsSection from "@/components/FundedProjects/FundedProjectsSection";
import {
  formatUnixTimestamp,
  formatUsdcCurrency,
  type OnchainProjectSnapshot,
} from "@/components/Projects/projectSection.helpers";
import {
  emptyProjectsByCategory,
  loadProjectsFromFolders,
  type CategoryId,
  type ListedProject,
} from "@/data/projectFilterSystem";
import { readSaleSnapshot, resolveTicketSaleAddress } from "@/lib/contracts";
import { usePublicClient } from "wagmi";

export default function FundedProjectSection() {
  const publicClient = usePublicClient();

  const [projectsByCategory, setProjectsByCategory] = useState<Record<CategoryId, ListedProject[]>>(
    emptyProjectsByCategory
  );
  const [onchainProjectSnapshots, setOnchainProjectSnapshots] = useState<
    Record<string, OnchainProjectSnapshot>
  >({});

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        const loaded = await loadProjectsFromFolders();
        if (!cancelled) {
          setProjectsByCategory(loaded);
        }
      } catch {
        if (!cancelled) {
          setProjectsByCategory(emptyProjectsByCategory);
        }
      }
    };

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

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

            return { projectId: project.id, snapshot: nextSnapshot };
          } catch {
            return { projectId: project.id, snapshot: null };
          }
        })
      );

      if (cancelled) {
        return;
      }

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

  const allProjects = useMemo(
    () => [
      ...projectsByCategory.core,
      ...projectsByCategory.expansion,
      ...projectsByCategory.pipeline,
    ],
    [projectsByCategory]
  );

  const fundedProjects = useMemo(
    () => allProjects.filter((project) => project.listingStatus === "finished"),
    [allProjects]
  );

  const explorerUrlByProjectId = useMemo(() => {
    const explorerBaseUrl = "https://etherscan.io/address";

    return fundedProjects.reduce<Record<string, string | null>>((acc, project) => {
      const resolvedAddress = resolveTicketSaleAddress(project.contractAddress);
      acc[project.id] = explorerBaseUrl && resolvedAddress
        ? `${explorerBaseUrl}/${resolvedAddress}`
        : null;
      return acc;
    }, {});
  }, [fundedProjects]);

  if (fundedProjects.length === 0) {
    return null;
  }

  return (
    <FundedProjectsSection
      fundedProjects={fundedProjects}
      onchainProjectSnapshots={onchainProjectSnapshots}
      explorerUrlByProjectId={explorerUrlByProjectId}
    />
  );
}
