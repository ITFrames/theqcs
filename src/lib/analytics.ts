"use client";

/**
 * Consent-aware conversion event tracking.
 *
 * trackEvent() forwards a conversion to Google (gtag) and/or Meta (fbq), but
 * ONLY for the categories the user has consented to:
 *   - Google Analytics event   -> requires `analytics` consent
 *   - Google Ads conversion    -> requires `marketing` consent
 *   - Meta Pixel event         -> requires `marketing` consent
 *
 * It reads the same first-party consent cookie the ConsentProvider writes, so
 * it works from anywhere (no React context needed) and never fires for users
 * who declined. If a tag isn't loaded/configured, the call is a safe no-op.
 */

type EventParams = Record<string, string | number | boolean | undefined>;

interface Consent {
  analytics: boolean;
  marketing: boolean;
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

function readConsent(): Consent {
  if (typeof document === "undefined") {
    return { analytics: false, marketing: false };
  }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("qcs_consent="));
  if (!match) return { analytics: false, marketing: false };
  try {
    const parsed = JSON.parse(decodeURIComponent(match.split("=")[1]));
    return { analytics: !!parsed.analytics, marketing: !!parsed.marketing };
  } catch {
    return { analytics: false, marketing: false };
  }
}

/**
 * Record a conversion/interaction event.
 * @param name  GA4/Meta event name, e.g. "sign_up", "generate_lead".
 * @param params optional event parameters.
 * @param options.adsConversionLabel  Google Ads conversion label for send_to.
 * @param options.metaStandardEvent   Meta standard event, e.g. "CompleteRegistration", "Lead".
 */
export function trackEvent(
  name: string,
  params: EventParams = {},
  options: { adsConversionLabel?: string; metaStandardEvent?: string } = {},
): void {
  if (typeof window === "undefined") return;
  const consent = readConsent();

  // Google Analytics (analytics consent).
  if (consent.analytics && GA_ID && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }

  // Google Ads conversion (marketing consent).
  if (
    consent.marketing &&
    ADS_ID &&
    options.adsConversionLabel &&
    typeof window.gtag === "function"
  ) {
    window.gtag("event", "conversion", {
      send_to: `${ADS_ID}/${options.adsConversionLabel}`,
      ...params,
    });
  }

  // Meta Pixel (marketing consent).
  if (
    consent.marketing &&
    options.metaStandardEvent &&
    typeof window.fbq === "function"
  ) {
    window.fbq("track", options.metaStandardEvent, params);
  }
}
