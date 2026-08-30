import type { MetadataRoute } from "next";
import { getAllGuideSlugs } from "@/data/countryGuides";

const SITE_URL = "https://www.theqcs.ca";

/**
 * sitemap.xml (served at /sitemap.xml).
 *
 * Lists all publicly indexable URLs. Private/auth routes (dashboard, login,
 * register, onboarding, api) are intentionally excluded and also disallowed in
 * robots.ts. Blog/country-guide URLs are generated dynamically from the same
 * data source used to pre-render those pages, so the sitemap stays in sync.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static, publicly indexable pages with relative priority hints.
  const staticEntries: MetadataRoute.Sitemap = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "contact", priority: 0.7, changeFrequency: "yearly" as const },
    { path: "privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "terms", priority: 0.3, changeFrequency: "yearly" as const },
  ].map((e) => ({
    url: `${SITE_URL}${e.path ? `/${e.path}` : ""}`,
    lastModified: now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));

  // Dynamic country-guide / blog pages.
  const guideEntries: MetadataRoute.Sitemap = getAllGuideSlugs().map(
    (slug) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [...staticEntries, ...guideEntries];
}
