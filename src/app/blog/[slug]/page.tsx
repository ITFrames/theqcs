import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  CalendarDays,
  CheckCircle2,
  Star,
} from "lucide-react";
import {
  countryGuides,
  getGuideBySlug,
  getAllGuideSlugs,
} from "@/data/countryGuides";
import { hasPhoto, photoPath } from "@/data/countryPhotos";

// Pre-render every country guide at build time.
export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

// Per-guide SEO metadata.
export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found - QCS ABROAD" };

  return {
    title: `Study in ${guide.country} - Complete Guide | QCS ABROAD`,
    description: guide.summary,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function GuidePage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Suggest up to 3 other guides as "related reading".
  const related = countryGuides
    .filter((g) => g.slug !== guide.slug)
    .slice(0, 3);

  return (
    <>
      {/* Article hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2440] via-[#1e3a5f] to-[#152a45] text-white">
        {/* Cover photo (same iconic landmark as the blog card), dimmed for text contrast */}
        {hasPhoto(guide.slug) && (
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <Image
              src={photoPath(guide.slug)}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Navy wash so the white heading stays readable over the photo. */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f2440]/85 via-[#1e3a5f]/80 to-[#152a45]/90" />
          </div>
        )}
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-narrow relative z-10 py-16 md:py-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All Guides
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-6xl" aria-hidden="true">
              {guide.flag}
            </span>
            <div>
              <h1 className="text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
                Study in {guide.country}
              </h1>
              <p className="mt-2 text-lg text-[var(--color-accent)]">
                {guide.tagline}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {guide.readTime} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Updated {formatDate(guide.updated)}
            </span>
          </div>
        </div>
      </section>

      {/* Body + sidebar */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Article body */}
            <article className="lg:col-span-2">
              {/* Highlights callout */}
              <div className="border-border-light bg-background-alt mb-10 rounded-2xl border p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Star
                    className="h-5 w-5 fill-[var(--color-accent)] text-[var(--color-accent)]"
                    aria-hidden="true"
                  />
                  <h2 className="text-primary text-lg font-bold">
                    Why {guide.country} Stands Out
                  </h2>
                </div>
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {guide.highlights.map((h) => (
                    <li
                      key={h}
                      className="text-foreground-muted flex items-start gap-2 text-sm"
                    >
                      <CheckCircle2
                        className="text-accent mt-0.5 h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sections */}
              <div className="space-y-10">
                {guide.sections.map((section) => (
                  <div key={section.heading}>
                    <h2 className="text-primary text-2xl font-bold">
                      {section.heading}
                    </h2>
                    {section.paragraphs.map((p, i) => (
                      <p
                        key={i}
                        className="text-foreground-muted mt-3 leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="mt-4 space-y-2">
                        {section.bullets.map((b) => (
                          <li
                            key={b}
                            className="text-foreground-muted flex items-start gap-3"
                          >
                            <CheckCircle2
                              className="text-accent mt-1 h-4 w-4 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Inline CTA */}
              <div className="bg-primary mt-12 rounded-2xl p-8 text-center text-white">
                <h3 className="text-xl font-bold">
                  Ready to Apply to {guide.country}?
                </h3>
                <p className="mx-auto mt-2 max-w-lg text-sm text-white/80">
                  Our counselors guide you through university selection,
                  applications, and visas — every step of the way.
                </p>
                <Link href="/contact" className="btn btn-accent mt-5 px-7 py-3">
                  Get Personalized Guidance <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="space-y-8 lg:sticky lg:top-24">
                {/* Quick facts */}
                <div className="border-border-light rounded-2xl border bg-white p-6 shadow-[var(--shadow-sm)]">
                  <h3 className="text-accent text-sm font-bold tracking-widest uppercase">
                    Quick Facts
                  </h3>
                  <dl className="mt-4 space-y-4">
                    {guide.quickFacts.map((fact) => (
                      <div key={fact.label}>
                        <dt className="text-foreground-subtle text-xs font-medium tracking-wide uppercase">
                          {fact.label}
                        </dt>
                        <dd className="text-primary mt-0.5 text-sm font-semibold">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Related guides */}
                <div className="border-border-light rounded-2xl border bg-white p-6 shadow-[var(--shadow-sm)]">
                  <h3 className="text-accent text-sm font-bold tracking-widest uppercase">
                    Compare Other Countries
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {related.map((g) => (
                      <li key={g.slug}>
                        <Link
                          href={`/blog/${g.slug}`}
                          className="group hover:bg-background-alt flex items-center gap-3 rounded-lg p-2 transition-colors"
                        >
                          <span className="text-2xl" aria-hidden="true">
                            {g.flag}
                          </span>
                          <span className="text-primary flex-1 text-sm font-medium">
                            Study in {g.country}
                          </span>
                          <ArrowRight
                            className="text-foreground-subtle h-4 w-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
