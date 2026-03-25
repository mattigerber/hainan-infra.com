import type { Metadata } from "next";

import HeroVideo from "@/components/Hero/HeroVideo";
import ProcessSection from "@/components/Process/ProcessSection";
import ProjectSection from "@/components/Projects/ProjectSection";
import WalletSection from "@/components/Wallet/WalletSection";
import TeamSection from "@/components/Team/TeamSection";
import OurInnovationsSection from "@/components/Team/OurInnovationsSection";
import FundedProjectSection from "@/components/FundedProjects/FundedProjectSection";
import Footer from "@/components/Footer/Footer";
import { supportedLocales } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";
import { buildHomeMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildHomeMetadata((locale as Locale) ?? "en");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default function LocaleHomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main id="main-content">
        <section className="w-full pb-10 sm:pb-12 md:pb-16">
          <div className="mx-auto mt-6 w-full max-w-7xl px-8 sm:mt-8 sm:px-6 md:mt-10 md:px-10 2xl:max-w-[90rem]">
            <HeroVideo/>
          </div>
          <div className="pb-8 pt-8 sm:pt-10 md:pb-12 md:pt-14">
            <ProcessSection />
          </div>

        {/* <div className="pb-8 pt-8 sm:pt-10 md:pb-12 md:pt-14">
          <PartnershipmakerSection />
        </div> */}
        <ProjectSection />
        <WalletSection />
        <TeamSection />
        <OurInnovationsSection />
        <FundedProjectSection />
                </section>
        
      </main>
      <Footer />
    </div>
  );
}
