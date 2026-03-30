"use client";

import WalletProvider from "@/components/Wallet/WalletProvider";
import ProjectSection from "@/components/Projects/ProjectSection";
import FundedProjectSection from "@/components/FundedProjects/FundedProjectSection";

export default function HomeWalletBackedSections() {
  return (
    <WalletProvider>
      <ProjectSection />
      <FundedProjectSection />
    </WalletProvider>
  );
}