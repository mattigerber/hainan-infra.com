"use client";

import { useI18n } from "@/i18n/I18nProvider";

const stageOrder = ["discovery", "listing", "closure"] as const;
const buySideStageOrder = ["discovery", "engagement", "followUp"] as const;

function splitStageTitle(rawTitle: string): { label: string; timeframe: string | null } {
  const [label, timeframe] = rawTitle.split("•").map((part) => part.trim());
  if (!timeframe) {
    return { label: rawTitle.trim(), timeframe: null };
  }

  return { label, timeframe };
}

export default function ProcessSection() {
  const { t, locale } = useI18n();
  const isArabic = locale === "ar";
  const headingAlignmentClass = isArabic ? "text-right" : "text-left";

  return (
    <section id="process" className="process-section-root">
      <div className={`mx-auto w-full max-w-7xl px-8 sm:px-6 md:px-10 2xl:max-w-[90rem] ${headingAlignmentClass}`}>
        <div className="process-section-label">{t("process.section.label")}</div>
        <h2 className={`font-playfair text-3xl font-bold uppercase leading-tight text-slate-900 sm:text-4xl lg:text-5xl ${headingAlignmentClass}`}>
          {t("process.section.title")}
        </h2>

        <div className="process-flow-stack">
          <section className="process-flow-block" aria-label={t("process.sellSideLabel")}>
            <div className="process-flow-header">
              <h3 className={`font-playfair text-xl font-semibold text-slate-800 sm:text-2xl ${headingAlignmentClass}`}>
                {t("process.sellSideLabel")}
              </h3>
              <p className={`font-[var(--font-eb-garamond)] text-base text-slate-600 sm:text-lg ${headingAlignmentClass}`}>
                {t("process.sellSideAudience")}
              </p>
            </div>
            <div className="process-stage-grid">
              {stageOrder.map((stageKey, index) => (
                <article key={stageKey} className="process-stage-card">
                  <span className="process-stage-number">{String(index + 1).padStart(2, "0")}</span>
                  {(() => {
                    const { label, timeframe } = splitStageTitle(t(`process.stages.${stageKey}.title`));
                    return (
                      <h4 className="font-playfair process-stage-title">
                        <span className="process-stage-title-line">
                          <span>{label}</span>
                          {timeframe ? <span className="process-stage-timeframe">{timeframe}</span> : null}
                        </span>
                      </h4>
                    );
                  })()}
                  <p className="font-[var(--font-eb-garamond)] process-stage-description">
                    {t(`process.stages.${stageKey}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="process-flow-block" aria-label={t("process.buySideLabel")}>
            <div className="process-flow-header">
              <h3 className={`font-playfair text-xl font-semibold text-slate-800 sm:text-2xl ${headingAlignmentClass}`}>
                {t("process.buySideLabel")}
              </h3>
              <p className={`font-[var(--font-eb-garamond)] text-base text-slate-600 sm:text-lg ${headingAlignmentClass}`}>
                {t("process.buySideAudience")}
              </p>
            </div>
            <div className="process-stage-grid">
              {buySideStageOrder.map((stageKey, index) => (
                <article key={stageKey} className="process-stage-card">
                  <span className="process-stage-number">{String(index + 1).padStart(2, "0")}</span>
                  {(() => {
                    const { label, timeframe } = splitStageTitle(
                      t(`process.buySide.stages.${stageKey}.title`)
                    );
                    return (
                      <h4 className="font-playfair process-stage-title">
                        <span className="process-stage-title-line">
                          <span>{label}</span>
                          {timeframe ? <span className="process-stage-timeframe">{timeframe}</span> : null}
                        </span>
                      </h4>
                    );
                  })()}
                  <p className="font-[var(--font-eb-garamond)] process-stage-description">
                    {t(`process.buySide.stages.${stageKey}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
