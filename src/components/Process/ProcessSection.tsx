"use client";

import styles from "./ProcessSection.module.css";
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
    <section id="process" className={styles.sectionRoot}>
      <div className={`mx-auto w-full max-w-7xl px-8 sm:px-6 md:px-10 2xl:max-w-[90rem] ${headingAlignmentClass}`}>
        <div className={styles.sectionLabel}>{t("process.section.label")}</div>
        <h2 className={`font-playfair text-3xl font-bold uppercase leading-tight text-slate-900 sm:text-4xl lg:text-5xl ${headingAlignmentClass}`}>
          {t("process.section.title")}
        </h2>

        <div className={styles.flowStack}>
          <section className={styles.flowBlock} aria-label={t("process.sellSideLabel")}>
            <div className={styles.flowHeader}>
              <h3 className={`font-playfair text-xl font-semibold text-slate-800 sm:text-2xl ${headingAlignmentClass}`}>
                {t("process.sellSideLabel")}
              </h3>
              <p className={`font-[var(--font-eb-garamond)] text-base text-slate-600 sm:text-lg ${headingAlignmentClass}`}>
                {t("process.sellSideAudience")}
              </p>
            </div>
            <div className={styles.stageGrid}>
              {stageOrder.map((stageKey, index) => (
                <article key={stageKey} className={styles.stageCard}>
                  <span className={styles.stageNumber}>{String(index + 1).padStart(2, "0")}</span>
                  {(() => {
                    const { label, timeframe } = splitStageTitle(t(`process.stages.${stageKey}.title`));
                    return (
                      <h4 className={`font-playfair ${styles.stageTitle}`}>
                        <span className={styles.stageTitleLine}>
                          <span>{label}</span>
                          {timeframe ? <span className={styles.stageTimeframe}>{timeframe}</span> : null}
                        </span>
                      </h4>
                    );
                  })()}
                  <p className={`font-[var(--font-eb-garamond)] ${styles.stageDescription}`}>
                    {t(`process.stages.${stageKey}.description`)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.flowBlock} aria-label={t("process.buySideLabel")}>
            <div className={styles.flowHeader}>
              <h3 className={`font-playfair text-xl font-semibold text-slate-800 sm:text-2xl ${headingAlignmentClass}`}>
                {t("process.buySideLabel")}
              </h3>
              <p className={`font-[var(--font-eb-garamond)] text-base text-slate-600 sm:text-lg ${headingAlignmentClass}`}>
                {t("process.buySideAudience")}
              </p>
            </div>
            <div className={styles.stageGrid}>
              {buySideStageOrder.map((stageKey, index) => (
                <article key={stageKey} className={styles.stageCard}>
                  <span className={styles.stageNumber}>{String(index + 1).padStart(2, "0")}</span>
                  {(() => {
                    const { label, timeframe } = splitStageTitle(
                      t(`process.buySide.stages.${stageKey}.title`)
                    );
                    return (
                      <h4 className={`font-playfair ${styles.stageTitle}`}>
                        <span className={styles.stageTitleLine}>
                          <span>{label}</span>
                          {timeframe ? <span className={styles.stageTimeframe}>{timeframe}</span> : null}
                        </span>
                      </h4>
                    );
                  })()}
                  <p className={`font-[var(--font-eb-garamond)] ${styles.stageDescription}`}>
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
