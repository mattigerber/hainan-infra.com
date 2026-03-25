import type { Metadata } from "next";

import LegalPageLayout from "@/components/Legal/LegalPageLayout";
import TermsContent from "./TermsContent";
import { buildPageMetadata } from "@/lib/seo";
import { supportedLocales, localeMessages } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata((locale as Locale) ?? "en", "terms");
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const messages = localeMessages[(locale as Locale) ?? "en"] ?? localeMessages.en;

  return (
    <LegalPageLayout locale={locale} backLabel={messages["legal.backToHome"]}>
      <TermsContent />
    </LegalPageLayout>
  );
}
