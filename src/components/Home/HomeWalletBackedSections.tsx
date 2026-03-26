"use client";

import WalletProvider from "@/components/Wallet/WalletProvider";
import ProjectSection from "@/components/Projects/ProjectSection";
import WalletSection from "@/components/Wallet/WalletSection";
import FundedProjectSection from "@/components/FundedProjects/FundedProjectSection";

export default function HomeWalletBackedSections() {
  return (
    <WalletProvider>
      <ProjectSection />
      <WalletSection />
      <FundedProjectSection />
    </WalletProvider>
  );
}