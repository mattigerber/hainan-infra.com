/**
 * SEO utilities: canonical URLs, hreflang alternates, and per-page metadata.
 *
 * All metadata building for pages is centralised here so every route stays
 * consistent and easy to update in one place.
 */

import type { Metadata } from "next";

import { publicEnv } from "@/lib/env";
import { supportedLocales } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";

// ---------------------------------------------------------------------------
// Site URL
// ---------------------------------------------------------------------------

/** Canonical base URL — set NEXT_PUBLIC_SITE_URL in environment. */
export const SITE_URL = publicEnv.siteUrl;

// ---------------------------------------------------------------------------
// Route registry
// ---------------------------------------------------------------------------

export const PAGE_ROUTES = [
  "platform",
  "leadership",
  "projects",
  "contributions",
  "insights",
  "privacy",
  "terms",
  "risks",
  "downloads",
] as const;

export type PageRoute = (typeof PAGE_ROUTES)[number];

// ---------------------------------------------------------------------------
// Per-page, per-locale metadata
// ---------------------------------------------------------------------------

type PageMeta = { title: string; description: string };

const PAGE_META: Record<PageRoute, Record<Locale, PageMeta>> = {
  platform: {
    en: {
      title: "Platform",
      description:
        "Explore Hainan Infrastructure Partners, focused on real-world asset tokenization for infrastructure projects.",
    },
    zh: {
      title: "平台",
      description: "探索 Hainan Infrastructure Partners 平台，了解基础设施项目的真实世界资产代币化。",
    },
    ru: {
      title: "Платформа",
      description:
        "Изучите платформу Hainan Infrastructure Partners для токенизации реальных активов инфраструктурных проектов.",
    },
    ar: {
      title: "المنصة",
      description:
        "استكشف منصة Hainan Infrastructure Partners لتوكنة الأصول الواقعية لمشاريع البنية التحتية.",
    },
  },
  leadership: {
    en: {
      title: "Leadership",
      description:
        "Meet the leadership team behind Hainan Infrastructure Partners and learn about their experience in infrastructure investment.",
    },
    zh: {
      title: "领导团队",
      description: "了解海南基础设施合伙人背后的领导团队及其在基础设施投资领域的丰富经验。",
    },
    ru: {
      title: "Руководство",
      description:
        "Познакомьтесь с командой руководства Hainan Infrastructure Partners и узнайте об их опыте в инфраструктурных инвестициях.",
    },
    ar: {
      title: "القيادة",
      description:
        "تعرّف على فريق القيادة وراء شركاء البنية التحتية في هاينان وتعلّم عن خبرتهم في الاستثمار في البنية التحتية.",
    },
  },
  projects: {
    en: {
      title: "Projects",
      description:
        "Browse active infrastructure investment rounds — roads, bridges, energy, and water projects available on the HIP platform.",
    },
    zh: {
      title: "项目",
      description: "浏览 HIP 平台上的活跃基础设施投资轮次，包括道路、桥梁、能源和水资源项目。",
    },
    ru: {
      title: "Проекты",
      description:
        "Просматривайте активные инфраструктурные раунды — дороги, мосты, энергетика и водоснабжение на платформе HIP.",
    },
    ar: {
      title: "المشاريع",
      description:
        "تصفح جولات الاستثمار في البنية التحتية النشطة — طرق وجسور وطاقة ومياه متاحة على منصة HIP.",
    },
  },
  contributions: {
    en: {
      title: "Contributions",
      description:
        "Track and manage your infrastructure contributions across all active HIP projects.",
    },
    zh: {
      title: "贡献",
      description: "跟踪并管理您在所有活跃 HIP 项目中的基础设施贡献。",
    },
    ru: {
      title: "Взносы",
      description:
        "Отслеживайте и управляйте своими инфраструктурными вкладами во всех активных проектах HIP.",
    },
    ar: {
      title: "المساهمات",
      description:
        "تتبّع وأدر مساهماتك في البنية التحتية عبر جميع مشاريع HIP النشطة.",
    },
  },
  insights: {
    en: {
      title: "Insights",
      description:
        "Research, analysis, and market insights on global infrastructure investment opportunities and trends.",
    },
    zh: {
      title: "洞察",
      description: "全球基础设施投资机会与趋势的研究、分析与市场洞察。",
    },
    ru: {
      title: "Аналитика",
      description:
        "Исследования, анализ и рыночная аналитика по глобальным инфраструктурным инвестиционным возможностям и тенденциям.",
    },
    ar: {
      title: "رؤى",
      description:
        "بحوث وتحليلات ورؤى سوقية حول فرص الاستثمار في البنية التحتية العالمية واتجاهاتها.",
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy",
      description:
        "Read the Hainan Infrastructure Partners privacy policy — how we handle investor and partner data.",
    },
    zh: {
      title: "隐私政策",
      description: "阅读海南基础设施合伙人隐私政策，了解我们如何处理投资者和合作伙伴数据。",
    },
    ru: {
      title: "Политика конфиденциальности",
      description:
        "Ознакомьтесь с политикой конфиденциальности Hainan Infrastructure Partners — как мы обрабатываем данные инвесторов и партнёров.",
    },
    ar: {
      title: "سياسة الخصوصية",
      description:
        "اقرأ سياسة الخصوصية لشركاء البنية التحتية في هاينان — كيف نتعامل مع بيانات المستثمرين والشركاء.",
    },
  },
  terms: {
    en: {
      title: "Terms of Use",
      description:
        "Review the Hainan Infrastructure Partners terms and conditions governing platform usage and participation.",
    },
    zh: {
      title: "使用条款",
      description: "查看 Hainan Infrastructure Partners 的条款与条件，了解平台使用与参与规则。",
    },
    ru: {
      title: "Условия использования",
      description:
        "Ознакомьтесь с условиями Hainan Infrastructure Partners, регулирующими использование платформы и порядок участия.",
    },
    ar: {
      title: "شروط الاستخدام",
      description:
        "راجع شروط وأحكام Hainan Infrastructure Partners التي تنظّم استخدام المنصة وآليات المشاركة.",
    },
  },
  risks: {
    en: {
      title: "Risk Disclosures",
      description:
        "Understand the risks associated with infrastructure investments on the HIP platform before participating.",
    },
    zh: {
      title: "风险披露",
      description: "在参与之前，了解 HIP 平台上基础设施投资的相关风险。",
    },
    ru: {
      title: "Раскрытие рисков",
      description:
        "Ознакомьтесь с рисками инфраструктурных инвестиций на платформе HIP перед участием.",
    },
    ar: {
      title: "إفصاحات المخاطر",
      description:
        "تعرّف على المخاطر المرتبطة باستثمارات البنية التحتية على منصة HIP قبل المشاركة.",
    },
  },
  downloads: {
    en: {
      title: "Downloads",
      description:
        "Download investment documents, reports, prospectuses, and resources from Hainan Infrastructure Partners.",
    },
    zh: {
      title: "下载",
      description: "从海南基础设施合伙人下载投资文件、报告、招股说明书和相关资源。",
    },
    ru: {
      title: "Загрузки",
      description:
        "Скачивайте инвестиционные документы, отчёты, проспекты и материалы Hainan Infrastructure Partners.",
    },
    ar: {
      title: "التنزيلات",
      description:
        "نزّل وثائق الاستثمار والتقارير ونشرات الإصدار والموارد من شركاء البنية التحتية في هاينان.",
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Builds the `alternates.languages` map required by Next.js for hreflang tags. */
export function buildAlternateLanguages(path?: string): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const locale of supportedLocales) {
    langs[locale] = path ? `${SITE_URL}/${locale}/${path}` : `${SITE_URL}/${locale}`;
  }
  langs["x-default"] = path ? `${SITE_URL}/en/${path}` : `${SITE_URL}/en`;
  return langs;
}

// ---------------------------------------------------------------------------
// Metadata builders (used in generateMetadata() for each page)
// ---------------------------------------------------------------------------

/** Build Next.js Metadata for a named inner page (platform, leadership, …). */
export function buildPageMetadata(locale: Locale, route: PageRoute): Metadata {
  const meta = PAGE_META[route][locale] ?? PAGE_META[route].en;
  const canonicalUrl = `${SITE_URL}/${locale}/${route}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternateLanguages(route),
    },
    openGraph: {
      title: `${meta.title} | Hainan Infrastructure Partners`,
      description: meta.description,
      url: canonicalUrl,
      siteName: "Hainan Infrastructure Partners",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/** Build Next.js Metadata for the locale home page (/en, /zh, …). */
export function buildHomeMetadata(locale: Locale): Metadata {
  const descriptions: Record<Locale, string> = {
    en: "Hainan Infrastructure Partners — Real-World-Asset Tokenization and traditional investments in global megainfrastructure projects with multi-currency support.",
    zh: "海南基础设施合伙人 — 专注于全球大型基础设施项目的真实世界资产代币化与传统投资，并支持多币种。",
    ru: "Hainan Infrastructure Partners — токенизация реальных активов и традиционные инвестиции в глобальные мегапроекты инфраструктуры с поддержкой мультивалютности.",
    ar: "Hainan Infrastructure Partners — توكنة الأصول الواقعية والاستثمارات التقليدية في مشاريع البنية التحتية العملاقة عالميًا مع دعم تعدد العملات.",
  };

  const canonicalUrl = `${SITE_URL}/${locale}`;

  return {
    title: "Hainan Infrastructure Partners",
    description: descriptions[locale] ?? descriptions.en,
    alternates: {
      canonical: canonicalUrl,
      languages: buildAlternateLanguages(),
    },
    openGraph: {
      title: "Hainan Infrastructure Partners",
      description: descriptions[locale] ?? descriptions.en,
      url: canonicalUrl,
      siteName: "Hainan Infrastructure Partners",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
