"use client";

/**
 * ConsentBanner — first-party cookie consent UI.
 *   - Shows a banner until the user makes an explicit choice.
 *   - "Accept all" / "Reject all" are given EQUAL prominence (a legal
 *     requirement in the EU/UK; also best practice for Canada/India).
 *   - "Customize" opens per-category toggles (necessary is locked on).
 *   - Can be reopened later via the footer "Cookie preferences" link, which
 *     calls useConsent().openPreferences().
 */

import { useState, useSyncExternalStore } from "react";
import { Cookie, X } from "lucide-react";
import { useConsent } from "./ConsentProvider";

const noop = () => () => {};
/** false during SSR + first paint, true after client mount — no setState. */
function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export default function ConsentBanner() {
  const {
    consent,
    decided,
    acceptAll,
    rejectAll,
    save,
    preferencesOpen,
    openPreferences,
    closePreferences,
  } = useConsent();

  // Local draft for the customize view.
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [marketing, setMarketing] = useState(consent.marketing);
  const mounted = useMounted();

  // Avoid SSR/client mismatch: render nothing until mounted, then decide based
  // on the persisted cookie choice.
  if (!mounted) return null;
  // Nothing to show once decided and preferences aren't open.
  if (decided && !preferencesOpen) return null;

  const showCustomize = preferencesOpen;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-5"
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
    >
      <div
        className="mx-auto max-w-4xl rounded-2xl bg-white p-5 sm:p-6"
        style={{
          boxShadow:
            "0 20px 60px -12px rgba(30,58,95,0.25), 0 8px 20px -8px rgba(30,58,95,0.15)",
          border: "1px solid var(--color-border-light)",
        }}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/8 text-[var(--color-primary)]">
            <Cookie className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-[var(--color-foreground)]">
                We value your privacy
              </h2>
              {preferencesOpen && decided && (
                <button
                  type="button"
                  onClick={closePreferences}
                  aria-label="Close"
                  className="text-[var(--color-foreground-subtle)] hover:text-[var(--color-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">
              We use necessary cookies to run the site. With your consent, we
              also use analytics and advertising cookies to understand traffic
              and show you relevant study-abroad offers. You can accept, reject,
              or choose per category. See our{" "}
              <a href="/privacy" className="underline-accent font-medium">
                Privacy Policy
              </a>
              .
            </p>

            {showCustomize && (
              <div className="mt-4 space-y-3">
                <CategoryRow
                  title="Strictly necessary"
                  description="Required for sign-in, security, and core features. Always on."
                  checked
                  locked
                />
                <CategoryRow
                  title="Analytics"
                  description="Helps us measure site usage so we can improve it."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <CategoryRow
                  title="Advertising"
                  description="Used to show and measure relevant ads across the web."
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {showCustomize ? (
                <button
                  type="button"
                  onClick={() => save({ analytics, marketing })}
                  className="btn btn-primary px-5 py-2.5 text-sm sm:order-3"
                >
                  Save preferences
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAnalytics(consent.analytics);
                    setMarketing(consent.marketing);
                    openPreferences();
                  }}
                  className="btn btn-outline px-5 py-2.5 text-sm sm:order-1"
                >
                  Customize
                </button>
              )}
              <button
                type="button"
                onClick={rejectAll}
                className="btn btn-outline px-5 py-2.5 text-sm sm:order-2"
              >
                Reject all
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="btn btn-accent px-5 py-2.5 text-sm sm:order-4"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({
  title,
  description,
  checked,
  locked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  locked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-[var(--color-border-light)] p-3">
      <div>
        <p className="text-sm font-medium text-[var(--color-foreground)]">
          {title}
        </p>
        <p className="text-xs text-[var(--color-foreground-muted)]">
          {description}
        </p>
      </div>
      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={locked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span
          className={`h-6 w-11 rounded-full transition-colors after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-5 ${
            locked
              ? "bg-[var(--color-accent)] opacity-70"
              : "bg-[var(--color-border)] peer-checked:bg-[var(--color-primary)]"
          }`}
        />
      </label>
    </div>
  );
}
