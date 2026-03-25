"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

import {
  emptyProjectsByCategory,
  loadProjectsFromFolders,
  type CategoryId,
  type ListedProject,
} from "@/data/projectFilterSystem";
import WalletHoldingsSection from "@/components/Wallet/WalletHoldingsSection";
import { useOnchainTicketPortfolio } from "@/components/Wallet/useOnchainTicketPortfolio";

export default function WalletSection() {
  const { address, isConnected } = useAccount();

  const [projectsByCategory, setProjectsByCategory] = useState<Record<CategoryId, ListedProject[]>>(
    emptyProjectsByCategory
  );

  const allProjects = useMemo(
    () => [
      ...projectsByCategory.core,
      ...projectsByCategory.expansion,
      ...projectsByCategory.pipeline,
    ],
    [projectsByCategory]
  );

  const { holdings, investedUsdtByProject } = useOnchainTicketPortfolio(address, allProjects);

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

  const handleOpenProject = useCallback((projectId: string) => {
    window.dispatchEvent(new CustomEvent("hip:open-project", { detail: { projectId } }));

    const projectsSection = window.document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <WalletHoldingsSection
        allProjects={allProjects}
        holdings={holdings}
        investedUsdtByProject={investedUsdtByProject}
        isConnected={isConnected}
        onOpenProject={handleOpenProject}
      />
    </>
  );
}
