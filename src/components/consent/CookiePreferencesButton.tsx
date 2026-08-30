"use client";

import { useConsent } from "./ConsentProvider";

/**
 * Footer link that re-opens the cookie preferences dialog. Withdrawing or
 * changing consent must be as easy as granting it, so we surface this in the
 * footer alongside the legal links.
 */
export default function CookiePreferencesButton({
  className,
}: {
  className?: string;
}) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      Cookie Preferences
    </button>
  );
}
