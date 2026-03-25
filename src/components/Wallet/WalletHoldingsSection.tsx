"use client";

import { useMemo } from "react";
import { formatUnits } from "viem";

import type { ListedProject } from "@/data/projectFilterSystem";
import ConnectWalletButton from "@/components/Wallet/ConnectWalletButton";
import { useI18n } from "@/i18n/I18nProvider";
import { formatProjectUid } from "@/utils/formatters";

type WalletHoldingsSectionProps = {
  allProjects: ListedProject[];
  holdings: Record<string, number>;
  investedUsdtByProject?: Record<string, bigint>;
  isConnected: boolean;
  onOpenProject: (projectId: string) => void;
};

type WalletProjectSummary = {
  project: ListedProject;
  ownedTickets: number;
  investedUsd: number;
  purchasedRatio: number;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const parseUsdAmount = (value: string): number => {
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function WalletHoldingsSection({
  allProjects,
  holdings,
  investedUsdtByProject = {},
  isConnected,
  onOpenProject,
}: WalletHoldingsSectionProps) {
  const { t, locale } = useI18n();
  const headingAlignmentClass = locale === "ar" ? "text-right" : "text-left";

  const investedProjects = useMemo(
    () => allProjects.filter((project) => (holdings[project.id] ?? 0) > 0),
    [allProjects, holdings]
  );

  const walletProjectSummaries = useMemo<WalletProjectSummary[]>(
    () =>
      investedProjects.map((project) => {
        const ownedTickets = holdings[project.id] ?? 0;
        const fallbackTicketPrice = parseUsdAmount(project.ticketSize);
        const onchainInvested = investedUsdtByProject[project.id];
        const investedUsd =
          onchainInvested !== undefined
            ? Number(formatUnits(onchainInvested, 6))
            : ownedTickets * fallbackTicketPrice;
        const purchasedRatio =
          ownedTickets + project.ticketsLeft > 0
            ? (ownedTickets / (ownedTickets + project.ticketsLeft)) * 100
            : 0;

        return {
          project,
          ownedTickets,
          investedUsd,
          purchasedRatio,
        };
      }),
    [holdings, investedProjects, investedUsdtByProject]
  );

  return (
    <section
      id="wallet-holdings"
      className="bg-black px-8 pb-16 pt-10 text-white sm:px-6 md:px-10 md:pt-14"
    >
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[90rem]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className={`flex flex-col ${headingAlignmentClass}`}>
            <div className="text-sm uppercase tracking-[0.22em] text-white/60">
              {t("wallet.section.label")}
            </div>
            <h2 className="m-0 font-playfair text-3xl uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
              {t("wallet.section.title")}
            </h2>
          </div>
          <div className="flex w-full flex-shrink-0 justify-end sm:ml-8 sm:w-auto sm:self-end">
            <ConnectWalletButton />
          </div>
        </div>
      </div>

      {!isConnected ? (
        <div className="text-base text-white/60 md:text-lg">

        </div>
      ) : (
        <div className="mx-auto mt-6 max-w-7xl border border-white/15 bg-white/[0.03] p-4 sm:mt-8 sm:p-6 md:p-7 2xl:max-w-[90rem]">
          <div className="space-y-8">
            <div>
              <div className="mb-4 text-base uppercase tracking-[0.16em] text-white/65 md:text-lg">{t("wallet.holdings.investedProjects")}</div>
              {walletProjectSummaries.length === 0 ? (
                <div className="px-4 py-5 text-base text-white/60 md:text-lg">
                  {t("wallet.holdings.noTickets")}
                </div>
              ) : (
                <div className="divide-y divide-white/10 border-t border-white/10 border-b border-white/10">
                  {walletProjectSummaries.map(({ project, ownedTickets, investedUsd, purchasedRatio }) => (
                    <details key={project.id} className="group py-3">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1">
                        <div>
                          <h3 className="font-playfair text-xl text-white">{project.name}</h3>
                          <div className="mt-1 text-xs uppercase tracking-[0.12em] text-white/55">
                            {formatProjectUid(project.id)} • {project.fundingRound}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-white/60">{t("wallet.holdings.invested")}</div>
                          <div className="text-base font-semibold text-white md:text-lg">
                            {currencyFormatter.format(investedUsd)}
                          </div>
                        </div>
                      </summary>
                      <div className="mt-4 grid gap-2 text-sm text-white/75 md:grid-cols-3 md:text-base">
                        <div className="flex justify-between border-b border-white/10 pb-1.5 md:block md:border-b-0 md:pb-0">
                          <span className="text-white/60 md:block">{t("wallet.holdings.owned")}</span>
                          <span>{ownedTickets} {t("wallet.holdings.tickets")}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1.5 md:block md:border-b-0 md:pb-0">
                          <span className="text-white/60 md:block">{t("wallet.holdings.ticketPrice")}</span>
                          <span>{project.ticketSize}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1.5 md:block md:border-b-0 md:pb-0">
                          <span className="text-white/60 md:block">{t("wallet.holdings.allocationBought")}</span>
                          <span>{purchasedRatio.toFixed(2)}%</span>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => onOpenProject(project.id)}
                          className="inline-flex items-center gap-1 border-b border-white/45 pb-0.5 text-xs uppercase tracking-[0.08em] text-white/75 transition hover:border-white hover:text-white"
                        >
                          {t("wallet.holdings.openDetails")}
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
