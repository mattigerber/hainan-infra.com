"use client";

import { useI18n } from "@/i18n/I18nProvider";

export default function OurInnovationsSection() {
  const { t, locale } = useI18n();
  const headingAlignmentClass = locale === "ar" ? "text-right" : "text-left";
  return (
    <section className="bg-black px-8 pb-16 pt-10 text-white sm:px-6 md:px-10 md:pt-14">
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[90rem]">
        <div className={`mb-8 ${headingAlignmentClass}`}>
          <div className="mb-3 text-sm uppercase tracking-[0.22em] text-white/60">
            {t("innovations.section.label")}
          </div>
          <h2 className="font-playfair text-3xl uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
            {t("innovations.section.title")}
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-white/15 bg-white/[0.03] p-6 flex flex-col">
            <h3 className="font-playfair text-2xl text-white mb-2">
              {t("innovations.rwa.title")}
            </h3>
            <p className="text-white/80 text-base">
              {t("innovations.rwa.description")}
            </p>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/[0.03] p-6 flex flex-col">
            <h3 className="font-playfair text-2xl text-white mb-2">
              {t("innovations.agents.title")}
            </h3>
            <p className="text-white/80 text-base">
              {t("innovations.agents.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
