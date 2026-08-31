import Link from "next/link";
import { Home, Compass, Mail, ArrowRight } from "lucide-react";

/**
 * Custom 404 page. Shown for any unknown URL. We keep the correct 404 status
 * (good for SEO — no soft-404s) but make it friendly with a clear path back
 * home and to the most useful pages, so visitors never hit a dead end.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-[#faf6ea] to-white px-6 py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-gradient text-7xl font-extrabold tracking-tight md:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-[var(--color-foreground)] md:text-3xl">
          This page took a gap year
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[var(--color-foreground-muted)]">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back on your study abroad journey.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary px-6 py-3 text-base">
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>
          <Link href="/contact" className="btn btn-outline px-6 py-3 text-base">
            Contact Us
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Quick links to the most useful destinations */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
          <Link
            href="/services"
            className="text-foreground-muted hover:text-primary inline-flex items-center gap-1.5 transition-colors"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Our Services
          </Link>
          <Link
            href="/blog"
            className="text-foreground-muted hover:text-primary inline-flex items-center gap-1.5 transition-colors"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Study Guides
          </Link>
          <Link
            href="/contact"
            className="text-foreground-muted hover:text-primary inline-flex items-center gap-1.5 transition-colors"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Get in Touch
          </Link>
        </div>
      </div>
    </main>
  );
}
