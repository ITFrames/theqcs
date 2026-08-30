import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles, BookOpen } from "lucide-react";
import { countryGuides } from "@/data/countryGuides";
import CountryLandmark from "@/components/CountryLandmark";

export const metadata: Metadata = {
  title: "Study Abroad Guides by Country - QCS ABROAD",
  description:
    "In-depth, country-specific study abroad guides for Canada, the USA, the UK, Australia, and New Zealand. Compare universities, admission processes, costs, work rights, and PR pathways to choose the right destination.",
};

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f2440] via-[#1e3a5f] to-[#152a45] text-white">
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-narrow relative z-10 py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent)] backdrop-blur-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Study Abroad Guides
          </span>
          <h1 className="mt-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
            Which Country Is Right for You?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
            Choosing where to study is one of the biggest decisions of your
            academic journey. Our detailed, country-by-country guides break down
            universities, admissions, costs, work rights, and residency pathways
            — so you can decide with confidence.
          </p>
        </div>
      </section>

      {/* Guides grid */}
      <section className="section-padding bg-background-alt">
        <div className="container-narrow">
          <div className="mb-10 flex items-center gap-3">
            <BookOpen className="text-primary h-6 w-6" aria-hidden="true" />
            <h2 className="text-primary text-2xl font-bold">
              Destination Guides
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {countryGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/blog/${guide.slug}`}
                className="group border-border-light flex flex-col overflow-hidden rounded-2xl border bg-white shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-xl)]"
              >
                {/* Card header band — iconic landmark illustration */}
                <div className="relative flex h-36 items-end justify-center overflow-hidden bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)]">
                  {/* Soft sky glow */}
                  <span
                    className="absolute -top-10 right-6 h-28 w-28 rounded-full bg-[var(--color-accent)]/20 blur-2xl"
                    aria-hidden="true"
                  />
                  {/* Landmark silhouette in gold, sitting on the band */}
                  <CountryLandmark
                    slug={guide.slug}
                    className="pointer-events-none h-28 w-full px-6 text-[var(--color-accent)] drop-shadow transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Flag accent badge */}
                  <span className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm">
                    {guide.flag}
                  </span>
                  <span
                    className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-primary text-xl font-bold">
                    Study in {guide.country}
                  </h3>
                  <p className="text-accent-dark mt-1 text-sm font-medium">
                    {guide.tagline}
                  </p>
                  <p className="text-foreground-muted mt-3 flex-1 text-sm leading-relaxed">
                    {guide.summary}
                  </p>

                  <div className="border-border-light mt-5 flex items-center justify-between border-t pt-4">
                    <span className="text-foreground-subtle inline-flex items-center gap-1.5 text-xs">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {guide.readTime} min read
                    </span>
                    <span className="text-primary group-hover:text-accent-dark inline-flex items-center gap-1 text-sm font-semibold transition-colors">
                      Read Guide
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-narrow text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Still Not Sure Where to Study?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
            Our expert counselors will help you weigh your options based on your
            goals, budget, and career plans — and build a personalized roadmap
            to your ideal destination.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="btn btn-accent px-7 py-3">
              Book a Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/services" className="btn btn-outline-light px-7 py-3">
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
