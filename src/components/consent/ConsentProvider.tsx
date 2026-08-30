"use client";

/**
 * Consent manager for QCS ABROAD.
 *
 * Legal context: the site serves Canada (PIPEDA / Quebec Law 25), India (DPDP
 * Act 2023), and potentially EEA/UK visitors (GDPR/ePrivacy). Non-essential
 * cookies (analytics + advertising) require PRIOR, INFORMED, OPT-IN consent.
 * Therefore:
 *   - Nothing but "necessary" is enabled until the user actively opts in.
 *   - Choices are stored in a first-party cookie so they persist and can be
 *     read server-side if needed.
 *   - Users can change or withdraw consent at any time.
 *
 * This provider does NOT itself load any trackers — it only records intent.
 * Consumers (e.g. ConsentedAnalytics) read the state and load scripts only
 * after the relevant category is granted.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface ConsentState {
  necessary: true; // always on — required for the site to function
  analytics: boolean;
  marketing: boolean;
}

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const COOKIE_NAME = "qcs_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

interface ConsentContextValue {
  consent: ConsentState;
  /** true once the user has made an explicit choice (banner can hide). */
  decided: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (partial: Partial<Omit<ConsentState, "necessary">>) => void;
  /** Re-open the preferences UI. */
  openPreferences: () => void;
  closePreferences: () => void;
  preferencesOpen: boolean;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readCookie(): { consent: ConsentState; decided: boolean } {
  if (typeof document === "undefined") {
    return { consent: DEFAULT_CONSENT, decided: false };
  }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return { consent: DEFAULT_CONSENT, decided: false };
  try {
    const parsed = JSON.parse(decodeURIComponent(match.split("=")[1]));
    return {
      consent: {
        necessary: true,
        analytics: !!parsed.analytics,
        marketing: !!parsed.marketing,
      },
      decided: true,
    };
  } catch {
    return { consent: DEFAULT_CONSENT, decided: false };
  }
}

function writeCookie(consent: ConsentState) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(
    JSON.stringify({
      analytics: consent.analytics,
      marketing: consent.marketing,
      ts: Date.now(),
    }),
  );
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  // Lazy init from the cookie. On the server `document` is undefined, so
  // readCookie() returns defaults; on the client the real choice is read
  // during the initial render (no setState-in-effect needed).
  const initial = readCookie();
  const [consent, setConsent] = useState<ConsentState>(initial.consent);
  const [decided, setDecided] = useState(initial.decided);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const persist = useCallback((next: ConsentState) => {
    writeCookie(next);
    setConsent(next);
    setDecided(true);
    setPreferencesOpen(false);
    // Let consumers (Consent Mode, analytics loaders) react immediately.
    window.dispatchEvent(new CustomEvent("qcs:consent", { detail: next }));
  }, []);

  const acceptAll = useCallback(
    () => persist({ necessary: true, analytics: true, marketing: true }),
    [persist],
  );
  const rejectAll = useCallback(
    () => persist({ necessary: true, analytics: false, marketing: false }),
    [persist],
  );
  const save = useCallback(
    (partial: Partial<Omit<ConsentState, "necessary">>) =>
      persist({
        necessary: true,
        analytics: partial.analytics ?? consent.analytics,
        marketing: partial.marketing ?? consent.marketing,
      }),
    [persist, consent.analytics, consent.marketing],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      decided,
      acceptAll,
      rejectAll,
      save,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      preferencesOpen,
    }),
    [consent, decided, acceptAll, rejectAll, save, preferencesOpen],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}
