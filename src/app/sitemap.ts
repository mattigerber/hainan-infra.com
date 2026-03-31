import type { MetadataRoute } from "next";

import { PAGE_ROUTES, buildLocaleUrl } from "@/lib/seo";
import { supportedLocales } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";

export const dynamic = "force-static";

/**
 * Dynamic sitemap covering every locale × every route.
 * Served at /sitemap.xml — consumed by Google Search Console and other crawlers.
 *
 * Priority scheme:
 *   en  home  (/)  → 1.0
 *   other home → 0.9
 *   en  route  → 0.8
 *   other route → 0.7
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  // Home pages: / for English, /{locale} for non-English.
  for (const locale of supportedLocales) {
    entries.push({
      url: buildLocaleUrl(locale),
      lastModified,
      changeFrequency: "weekly", 
      priority: locale === "en" ? 1.0 : 0.9,
      alternates: {
        languages: Object.fromEntries(
          supportedLocales.map((l: Locale) => [l, buildLocaleUrl(l)]),
        ),
      },
    });
  }

  // Inner pages: /{route} for English, /{locale}/{route} for non-English.
  for (const route of PAGE_ROUTES) {
    for (const locale of supportedLocales) {
      entries.push({
        url: buildLocaleUrl(locale, route),
        lastModified,
        changeFrequency: "monthly",
        priority: locale === "en" ? 0.8 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            supportedLocales.map((l: Locale) => [l, buildLocaleUrl(l, route)]),
          ),
        },
      });
    }
  }

  return entries;
}
