"use client";

/**
 * SuccessStories — a homepage section showing real Instagram posts (e.g. visa
 * approval / student success posts).
 *
 * PRIVACY / CONSENT:
 *   Instagram's embed script (instagram.com/embed.js) sets third-party cookies,
 *   so per our consent system it loads ONLY after the visitor accepts
 *   "marketing" cookies. Until then we show a branded fallback with a button to
 *   open cookie preferences (and a direct link to the Instagram profile).
 *
 * CONFIG:
 *   Add your Instagram post permalinks to POSTS below, e.g.
 *   "https://www.instagram.com/p/XXXXXXXXX/". Only your own posts (published
 *   with the student's consent) should be used here.
 */

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Instagram, Sparkles, ShieldCheck } from "lucide-react";
import { useConsent } from "@/components/consent/ConsentProvider";

// Real QCS ABROAD Instagram posts (permalinks; tracking params stripped).
// Nine posts → a clean 3×3 grid. "See more" links out to the full profile.
const POSTS: string[] = [
  "https://www.instagram.com/p/C1Ugw-pvk5G/",
  "https://www.instagram.com/p/C1R8BDKp3BV/",
  "https://www.instagram.com/p/C0O8lhbtHE_/",
  "https://www.instagram.com/p/C0O8f7-tzJh/",
  "https://www.instagram.com/p/C0O8Yertj-1/",
  "https://www.instagram.com/p/CxtTguvNc33/",
  "https://www.instagram.com/p/CxswbyFtGVD/",
  "https://www.instagram.com/p/CwECZM4NbAl/",
  "https://www.instagram.com/p/CwEBzIvNBfU/",
];

const INSTAGRAM_PROFILE = "https://www.instagram.com/qcsabroad";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export default function SuccessStories() {
  const { consent, openPreferences } = useConsent();
  const containerRef = useRef<HTMLDivElement>(null);

  // Consent is read from a cookie, which is unavailable during SSR. To avoid a
  // hydration mismatch (server always sees "not consented", client may see
  // "consented"), we only trust the consent value AFTER mount. Server render
  // and first client render therefore both show the fallback, then the client
  // upgrades to the embeds if marketing consent is present.
  const mounted = useMounted();
  const allowed = mounted && consent.marketing;

  // Load the Instagram embed script (and process embeds) once marketing
  // consent is granted. All state changes happen in async callbacks / event
  // handlers, never synchronously in the effect body.
  useEffect(() => {
    if (!allowed) return;

    const process = () => window.instgrm?.Embeds.process();

    if (window.instgrm) {
      process();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="instagram.com/embed.js"]',
    );
    if (existing) {
      existing.addEventListener("load", process, { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    s.addEventListener("load", process, { once: true });
    document.body.appendChild(s);
  }, [allowed]);

  return (
    <section
      className="section-padding bg-white"
      aria-labelledby="success-heading"
      id="success-stories"
    >
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-accent mb-2 inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Success Stories
          </p>
          <h2
            id="success-heading"
            className="text-primary text-3xl font-bold md:text-4xl"
          >
            Real Students, Real Approvals
          </h2>
          <p className="text-foreground-muted mt-4">
            Celebrating our students&apos; journeys — straight from our
            Instagram. Follow along as they head off to universities around the
            world.
          </p>
        </div>

        {allowed ? (
          <>
          <div
            ref={containerRef}
            className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {POSTS.map((url) => (
              <blockquote
                key={url}
                className="instagram-media mx-auto w-full"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                  background: "#fff",
                  border: 0,
                  borderRadius: "12px",
                  boxShadow: "var(--shadow-md)",
                  margin: 0,
                  maxWidth: "100%",
                  minWidth: "260px",
                  padding: 0,
                }}
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  View this post on Instagram
                </a>
              </blockquote>
            ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href={INSTAGRAM_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-7 py-3 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Instagram className="h-4.5 w-4.5" aria-hidden="true" />
                See more on Instagram
              </a>
            </div>
          </>
        ) : (
          /* Consent fallback — no third-party script loaded yet. */
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-background-alt)] p-8 text-center">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white">
              <Instagram className="h-7 w-7" />
            </span>
            <h3 className="text-primary text-lg font-semibold">
              See our students&apos; success posts
            </h3>
            <p className="text-foreground-muted mx-auto mt-2 max-w-md text-sm">
              These are live Instagram posts. To view them here, please allow
              marketing cookies — Instagram content may set cookies from Meta.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openPreferences}
                className="btn btn-primary px-6 py-2.5 text-sm"
              >
                Allow &amp; load posts
              </button>
              <a
                href={INSTAGRAM_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline px-6 py-2.5 text-sm"
              >
                <Instagram className="h-4 w-4" />
                View on Instagram
              </a>
            </div>
            <p className="text-foreground-subtle mt-4 flex items-center justify-center gap-1.5 text-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              Students&apos; stories are shared with their permission.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

const noopSubscribe = () => () => {};
/** false during SSR + first paint, true after client mount — no setState. */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
