import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";

import HeroVideo from "@/components/Hero/HeroVideo";
import ProcessSection from "@/components/Process/ProcessSection";
import HomeDeferredSections from "@/components/Home/HomeDeferredSections";
import Footer from "@/components/Footer/Footer";
import { supportedLocales } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";
import { buildHomeMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

type HeroMediaPayload = {
  coverImageSrc: string | null;
  videoSrc: string | null;
};

const heroMediaFallback: HeroMediaPayload = {
  coverImageSrc: "/hero/cover.jpeg",
  videoSrc: null,
};

const getInitialHeroMedia = async (): Promise<HeroMediaPayload> => {
  try {
    const mediaPath = path.join(process.cwd(), "public", "hero", "media.json");
    const mediaFile = await readFile(mediaPath, "utf8");
    const payload = JSON.parse(mediaFile) as Partial<HeroMediaPayload>;

    return {
      coverImageSrc:
        typeof payload.coverImageSrc === "string" && payload.coverImageSrc.length > 0
          ? payload.coverImageSrc
          : heroMediaFallback.coverImageSrc,
      videoSrc:
        typeof payload.videoSrc === "string" && payload.videoSrc.length > 0
          ? payload.videoSrc
          : null,
    };
  } catch {
    return heroMediaFallback;
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildHomeMetadata((locale as Locale) ?? "en");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function LocaleHomePage() {
  const initialHeroMedia = await getInitialHeroMedia();

  return (
    <div className="min-h-screen bg-black text-white">
      <main id="main-content">
        <section className="w-full pb-10 sm:pb-12 md:pb-16">
          <div className="mx-auto mt-6 w-full max-w-7xl px-8 sm:mt-8 sm:px-6 md:mt-10 md:px-10 2xl:max-w-[90rem]">
            <HeroVideo initialHeroMedia={initialHeroMedia} />
          </div>
          <div className="pb-8 pt-8 sm:pt-10 md:pb-12 md:pt-14">
            <ProcessSection />
          </div>
        <HomeDeferredSections />
                </section>
      </main>
      <Footer />
    </div>
  );
}
