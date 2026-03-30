import type { Metadata } from "next";
import { access, readdir, readFile } from "node:fs/promises";
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
  mobileCoverImageSrc: string | null;
  videoSrc: string | null;
};

export const revalidate = 3600;

const heroImageExtensions = new Set([".webp", ".avif", ".jpg", ".jpeg", ".png", ".gif"]);
const heroExtensionPriority = new Map([
  [".avif", 0],
  [".webp", 1],
  [".jpg", 2],
  [".jpeg", 3],
  [".png", 4],
  [".gif", 5],
]);

const getDiscoveredHeroCoverImage = async (): Promise<string | null> => {
  try {
    const heroDir = path.join(process.cwd(), "public", "hero");
    const entries = await readdir(heroDir, { withFileTypes: true });
    const imageFiles = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => heroImageExtensions.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

    const coverCandidates = imageFiles.filter((name) => /^cover\./i.test(name));
    const coverFile = (coverCandidates.length > 0 ? coverCandidates : imageFiles).sort((a, b) => {
      const extensionA = path.extname(a).toLowerCase();
      const extensionB = path.extname(b).toLowerCase();
      const rankA = heroExtensionPriority.get(extensionA) ?? Number.MAX_SAFE_INTEGER;
      const rankB = heroExtensionPriority.get(extensionB) ?? Number.MAX_SAFE_INTEGER;

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
    })[0] ?? null;
    return coverFile ? `/hero/${encodeURIComponent(coverFile)}` : null;
  } catch {
    return null;
  }
};

const getDiscoveredHeroMobileCoverImage = async (): Promise<string | null> => {
  try {
    const heroDir = path.join(process.cwd(), "public", "hero");
    const entries = await readdir(heroDir, { withFileTypes: true });
    const imageFiles = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => heroImageExtensions.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

    const mobileCoverFile = imageFiles.find((name) => /^cover-mobile\./i.test(name)) ?? null;
    return mobileCoverFile ? `/hero/${encodeURIComponent(mobileCoverFile)}` : null;
  } catch {
    return null;
  }
};

const isExistingPublicAsset = async (sourcePath: string | null): Promise<boolean> => {
  if (!sourcePath) {
    return false;
  }

  const normalizedPath = sourcePath.startsWith("/") ? sourcePath.slice(1) : sourcePath;
  const diskPath = path.join(process.cwd(), "public", decodeURIComponent(normalizedPath));

  try {
    await access(diskPath);
    return true;
  } catch {
    return false;
  }
};

const getInitialHeroMedia = async (): Promise<HeroMediaPayload> => {
  const discoveredCover = await getDiscoveredHeroCoverImage();
  const discoveredMobileCover = await getDiscoveredHeroMobileCoverImage();

  try {
    const mediaPath = path.join(process.cwd(), "public", "hero", "media.json");
    const mediaFile = await readFile(mediaPath, "utf8");
    const payload = JSON.parse(mediaFile) as Partial<HeroMediaPayload>;
    const jsonCover =
      typeof payload.coverImageSrc === "string" && payload.coverImageSrc.length > 0
        ? payload.coverImageSrc
        : null;
    const jsonMobileCover =
      typeof payload.mobileCoverImageSrc === "string" && payload.mobileCoverImageSrc.length > 0
        ? payload.mobileCoverImageSrc
        : null;
    const resolvedCover = (await isExistingPublicAsset(jsonCover)) ? jsonCover : discoveredCover;
    const resolvedMobileCover = (await isExistingPublicAsset(jsonMobileCover))
      ? jsonMobileCover
      : discoveredMobileCover;

    return {
      coverImageSrc: resolvedCover,
      mobileCoverImageSrc: resolvedMobileCover,
      videoSrc:
        typeof payload.videoSrc === "string" && payload.videoSrc.length > 0
          ? payload.videoSrc
          : null,
    };
  } catch {
    return {
      coverImageSrc: discoveredCover,
      mobileCoverImageSrc: discoveredMobileCover,
      videoSrc: null,
    };
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
