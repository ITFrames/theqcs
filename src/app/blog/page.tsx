import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles, BookOpen } from "lucide-react";
import { countryGuides } from "@/data/countryGuides";

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
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[var(--color-accent)]/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />

        <div className="container-narrow relative z-10 py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-[var(--color-accent)] backdrop-blur-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Study Abroad Guides
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
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
            <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-primary">
              Destination Guides
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {countryGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/blog/${guide.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border-light bg-white shadow-[var(--shadow-sm)] transition-all duration-300 hover:shadow-[var(--shadow-xl)] hover:-translate-y-1"
              >
                {/* Card header band */}
                <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)]">
                  <span className="text-6xl drop-shadow" aria-hidden="true">
                    {guide.flag}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 group-hover:scale-x-100" aria-hidden="true" />
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-primary">
                    Study in {guide.country}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-accent-dark">
                    {guide.tagline}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-muted">
                    {guide.summary}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border-light pt-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-foreground-subtle">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {guide.readTime} min read
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors group-hover:text-accent-dark">
                      Read Guide
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Still Not Sure Where to Study?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
            Our expert counselors will help you weigh your options based on your
            goals, budget, and career plans — and build a personalized roadmap
            to your ideal destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
