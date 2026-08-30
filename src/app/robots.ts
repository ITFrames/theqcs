import type { MetadataRoute } from "next";

const SITE_URL = "https://www.theqcs.ca";

/**
 * robots.txt (served at /robots.txt).
 *
 * SEO: allow all standard search crawlers to index public pages, block
 * private/auth areas, and advertise the sitemap.
 * AEO: explicitly welcome major AI/answer-engine crawlers so the site can be
 * surfaced in LLM answers.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/dashboard",
    "/dashboard/",
    "/onboarding",
    "/login",
    "/register",
    "/api/",
  ];

  return {
    rules: [
      // Default: all crawlers may index public content.
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      // AI / answer-engine crawlers (AEO). Explicitly allowed for visibility.
      {
        userAgent: [
          "GPTBot", // OpenAI
          "OAI-SearchBot", // OpenAI search
          "ChatGPT-User", // ChatGPT browsing
          "PerplexityBot", // Perplexity
          "Perplexity-User",
          "ClaudeBot", // Anthropic
          "Claude-Web",
          "Google-Extended", // Google Gemini / AI training
          "Applebot-Extended", // Apple Intelligence
          "CCBot", // Common Crawl (feeds many LLMs)
          "Amazonbot",
          "Bytespider",
          "cohere-ai",
        ],
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
