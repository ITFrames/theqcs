"use client";

/**
 * DestinationsGrid — homepage "Select your country" section.
 *
 * Shows the countries QCS has ties with (sourced from the country guides),
 * sorted by student preference. Initially shows the most popular few, with a
 * "Show More" toggle to reveal all ~15. Each card links to its country guide.
 */

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { countryGuides } from "@/data/countryGuides";

// Preferred display order (by student popularity).
const ORDER = [
  "study-in-usa",
  "study-in-canada",
  "study-in-uk",
  "study-in-australia",
  "study-in-new-zealand",
  "study-in-germany",
  "study-in-ireland",
  "study-in-france",
  "study-in-netherlands",
  "study-in-italy",
  "study-in-spain",
  "study-in-sweden",
  "study-in-switzerland",
  "study-in-singapore",
];

const orderedGuides = [...countryGuides].sort(
  (a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug),
);

const INITIAL_COUNT = 6;

export default function DestinationsGrid() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded
    ? orderedGuides
    : orderedGuides.slice(0, INITIAL_COUNT);

  return (
    <section
      className="section-padding bg-white"
      aria-labelledby="destinations-heading"
    >
      <div className="container-narrow">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-accent mb-2 text-sm font-semibold tracking-widest uppercase">
            Top Destinations
          </p>
          <h2
            id="destinations-heading"
            className="text-primary text-3xl font-bold md:text-4xl"
          >
            Select Your Country to See More About It
          </h2>
          <p className="text-foreground-muted mt-4">
            We&apos;ve got ties with nearly 15 countries for you! Below are the
            destinations most students prefer for their higher studies, sorted
            by student interest. Click any country to explore insights on its
            lifestyle, admission process, and the institutions we partner with.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((guide) => (
            <Link
              key={guide.slug}
              href={`/blog/${guide.slug}`}
              className="group border-border-light hover:border-accent/40 relative flex flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-[var(--shadow-sm)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
            >
              <div
                className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[var(--color-accent)]/[0.08] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="flex items-center gap-3">
                <span
                  className="text-4xl transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                >
                  {guide.flag}
                </span>
                <div>
                  <h3 className="text-primary text-lg font-bold">
                    Study in {guide.country}
                  </h3>
                  <p className="text-accent-dark text-xs font-medium tracking-wider uppercase">
                    {guide.tagline}
                  </p>
                </div>
              </div>
              <p className="text-foreground-muted mt-4 line-clamp-3 flex-1 text-sm leading-relaxed">
                {guide.summary}
              </p>
              <span className="text-primary group-hover:text-accent-dark mt-5 inline-flex items-center gap-1 text-sm font-semibold transition-colors">
                Explore {guide.country}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>

        {/* Show More / Less */}
        {orderedGuides.length > INITIAL_COUNT && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="btn btn-outline px-7 py-3"
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4" aria-hidden="true" />
                </>
              ) : (
                <>
                  Show More Countries{" "}
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
