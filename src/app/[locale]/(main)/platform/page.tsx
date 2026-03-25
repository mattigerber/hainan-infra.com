import type { Metadata } from "next";

import Footer from "@/components/Footer/Footer";
import { buildPageMetadata } from "@/lib/seo";
import { supportedLocales, localeMessages } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata((locale as Locale) ?? "en", "platform");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function PlatformPage({ params }: Props) {
  const { locale } = await params;
  const messages = localeMessages[(locale as Locale) ?? "en"] ?? localeMessages.en;

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full max-w-7xl px-8 py-24 sm:px-6 md:px-10 2xl:max-w-[90rem]">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{messages["nav.platform"]}</h1>
        <p className="mt-6 text-base text-white/50 sm:text-lg">{messages["page.comingSoon"]}</p>
      </main>
      <Footer />
    </div>
  );
}
