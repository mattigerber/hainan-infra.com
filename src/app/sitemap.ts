import type { MetadataRoute } from "next";

import { SITE_URL, PAGE_ROUTES } from "@/lib/seo";
import { supportedLocales } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";

export const dynamic = "force-static";

/**
 * Dynamic sitemap covering every locale × every route.
 * Served at /sitemap.xml — consumed by Google Search Console and other crawlers.
 *
 * Priority scheme:
 *   en  home  → 1.0
 *   other home → 0.9
 *   en  route  → 0.8
 *   other route → 0.7
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  // Home pages: /{locale}
  for (const locale of supportedLocales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified,
      changeFrequency: "weekly", 
      priority: locale === "en" ? 1.0 : 0.9,
      alternates: {
        languages: Object.fromEntries(
          supportedLocales.map((l: Locale) => [l, `${SITE_URL}/${l}`]),
        ),
      },
    });
  }

  // Inner pages: /{locale}/{route}
  for (const route of PAGE_ROUTES) {
    for (const locale of supportedLocales) {
      entries.push({
        url: `${SITE_URL}/${locale}/${route}`,
        lastModified,
        changeFrequency: "monthly",
        priority: locale === "en" ? 0.8 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            supportedLocales.map((l: Locale) => [l, `${SITE_URL}/${l}/${route}`]),
          ),
        },
      });
    }
  }

  return entries;
}
