"use client";

import type { ListedProject } from "@/data/projectFilterSystem";
import { useI18n } from "@/i18n/I18nProvider";

import type { OnchainProjectSnapshot } from "@/components/Projects/projectSection.helpers";
import { saleStatusTextClass } from "@/components/Projects/projectSection.helpers";

type FundedProjectsSectionProps = {
  fundedProjects: ListedProject[];
  onchainProjectSnapshots: Record<string, OnchainProjectSnapshot>;
  explorerUrlByProjectId: Record<string, string | null>;
};

export default function FundedProjectsSection({
  fundedProjects,
  onchainProjectSnapshots,
  explorerUrlByProjectId,
}: FundedProjectsSectionProps) {
  const { t, locale } = useI18n();
  const headingAlignmentClass = locale === "ar" ? "text-right" : "text-left";

  const findInvestorMetricValue = (snapshotProject: ListedProject) => {
    const investorMetric = snapshotProject.metrics.find((metric) =>
      /investor|investors|backer|backers/i.test(metric.label)
    );

    return investorMetric?.value ?? t("projects.funded.unknown");
  };

  const formatSoldOutRate = (ticketsSold?: number, maxTickets?: number) => {
    if (
      typeof ticketsSold !== "number" ||
      !Number.isFinite(ticketsSold) ||
      typeof maxTickets !== "number" ||
      !Number.isFinite(maxTickets) ||
      maxTickets <= 0
    ) {
      return t("projects.funded.unknown");
    }

    const percent = Math.max(0, Math.min((ticketsSold / maxTickets) * 100, 100));
    return `${percent.toFixed(1)}%`;
  };

  return (
    <section className="bg-black px-8 pb-8 text-white sm:px-6 md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl pt-2 2xl:max-w-[90rem]">
        <div className={`mb-8 ${headingAlignmentClass}`}>
          <div className="mb-3 text-sm uppercase tracking-[0.22em] text-white/60">
            {t("projects.funded.section.label")}
          </div>
          <h2 className="font-playfair text-3xl uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
            {t("projects.funded.section.title")}
          </h2>
        </div>

        {fundedProjects.length === 0 ? (
          <div className="mb-10 border border-white/20 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/65">
            {t("projects.funded.empty")}
          </div>
        ) : (
          <div className="mb-10 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-4">
              {fundedProjects.map((project) => {
                const projectSnapshot = onchainProjectSnapshots[project.id];
                const saleStatus = projectSnapshot?.saleStatus ?? "Ended";
                const saleStatusClass = saleStatusTextClass(saleStatus);
                const explorerUrl = explorerUrlByProjectId[project.id] ?? null;
                const ticketsSold = projectSnapshot?.ticketsSold;
                const maxTickets = projectSnapshot?.maxTickets;
                const ticketsSoldDisplay =
                  typeof ticketsSold === "number" && Number.isFinite(ticketsSold)
                    ? String(ticketsSold)
                    : t("projects.funded.unknown");
                const maxTicketsDisplay =
                  typeof maxTickets === "number" && Number.isFinite(maxTickets)
                    ? String(maxTickets)
                    : t("projects.funded.unknown");
                const investorsDisplay = findInvestorMetricValue(project);
                const soldOutRateDisplay = formatSoldOutRate(ticketsSold, maxTickets);

                return (
                  <article
                    key={project.id}
                    className="w-[min(84vw,310px)] shrink-0 border border-white/20 bg-black p-4 text-left sm:p-5"
                  >
                    <h3 className="mb-3 font-playfair text-xl font-bold">{project.name}</h3>
                    <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-white/65">
                      {project.coreType} • {project.sector} • {project.subsector}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span>{t("projects.card.country")}</span>
                        <span>{project.country}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>{t("projects.card.completionDate")}</span>
                        <span>{project.completionDate}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>{t("projects.card.totalRaise")}</span>
                        <span>{project.totalFundraising}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>{t("projects.funded.investors")}</span>
                        <span>{investorsDisplay}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>{t("projects.funded.ticketsSold")}</span>
                        <span>{ticketsSoldDisplay} / {maxTicketsDisplay}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>{t("projects.funded.fillRate")}</span>
                        <span>{soldOutRateDisplay}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>{t("projects.funded.saleStatus")}</span>
                        <span className={saleStatusClass}>{saleStatus}</span>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-white/15 pt-3">
                      {explorerUrl ? (
                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center border border-white/30 px-3 py-2 text-xs uppercase tracking-[0.14em] text-white/85 transition hover:border-white"
                        >
                          {t("projects.funded.viewContractOnEtherscan")}
                        </a>
                      ) : (
                        <p className="text-sm text-white/65">{t("projects.funded.explorerUnavailable")}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
