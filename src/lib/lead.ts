/**
 * Lead-capture selections shared by the engagement popup and the register page.
 *
 * Selections and dismissal state are stored in localStorage (device-persistent,
 * no cookies, no PII) so:
 *   - a browsing visitor's choices survive until they register, and
 *   - if they cancel/dismiss the popup, it never shows again on that device.
 *
 * NOTE ON "don't show to their IP": true IP-level suppression needs server-side
 * storage of visitor IPs, which adds a privacy burden for a marketing popup.
 * Device-persistent localStorage gives the same "don't nag me again" behaviour
 * without tracking IPs. Swap to a server store if strict IP suppression is
 * required later.
 */

export interface LeadSelections {
  wantsToStudy?: boolean;
  destinations: string[];
  program?: string;
  updatedAt: number;
}

const SELECTIONS_KEY = "qcs_lead";
const DISMISSED_KEY = "qcs_lead_dismissed";
/** Once completed (routed to register), stop re-opening the popup. */
const COMPLETED_KEY = "qcs_lead_done";

/** Country options — mirrors the onboarding destination cards. */
export const LEAD_COUNTRIES: { code: string; flag: string; label: string }[] = [
  { code: "Canada", flag: "🇨🇦", label: "Canada" },
  { code: "United Kingdom", flag: "🇬🇧", label: "United Kingdom" },
  { code: "United States", flag: "🇺🇸", label: "United States" },
  { code: "Australia", flag: "🇦🇺", label: "Australia" },
  { code: "Ireland", flag: "🇮🇪", label: "Ireland" },
  { code: "New Zealand", flag: "🇳🇿", label: "New Zealand" },
  { code: "Germany", flag: "🇩🇪", label: "Germany" },
  { code: "Other", flag: "🌍", label: "Other" },
];

export function readLeadSelections(): LeadSelections | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SELECTIONS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      wantsToStudy: parsed.wantsToStudy,
      destinations: Array.isArray(parsed.destinations)
        ? parsed.destinations
        : [],
      program: parsed.program,
      updatedAt: parsed.updatedAt ?? 0,
    };
  } catch {
    return null;
  }
}

export function saveLeadSelections(sel: Omit<LeadSelections, "updatedAt">): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SELECTIONS_KEY,
      JSON.stringify({ ...sel, updatedAt: Date.now() }),
    );
  } catch {
    /* storage unavailable (private mode) — ignore */
  }
}

export function clearLeadSelections(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SELECTIONS_KEY);
  } catch {
    /* ignore */
  }
}

/** Permanently dismissed (user cancelled) — never show again on this device. */
export function isLeadDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return (
      window.localStorage.getItem(DISMISSED_KEY) === "1" ||
      window.localStorage.getItem(COMPLETED_KEY) === "1"
    );
  } catch {
    return true;
  }
}

export function dismissLead(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Marks the funnel completed (routed to register) so it won't reopen. */
export function completeLead(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COMPLETED_KEY, "1");
  } catch {
    /* ignore */
  }
}
