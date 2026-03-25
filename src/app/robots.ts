import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Dynamic robots.txt — served at /robots.txt.
 * Allows all crawlers on all public routes; 
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          'OAI-SearchBot',   // ChatGPT Search
          'GPTBot',          // OpenAI Training
          'Google-Extended', // Google Gemini & AI Overviews
          'PerplexityBot',   // Perplexity AI
          'ClaudeBot',       // Anthropic Claude
          'Claude-web'       // Anthropic Web Fetcher
        ],
        allow: "/",
      },

    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
