"use client";

/**
 * ConsentedAnalytics — loads analytics + advertising tags ONLY according to the
 * user's consent, using Google Consent Mode v2.
 *
 * How it works:
 *   1. On mount we set Consent Mode defaults to "denied" for ad/analytics
 *      storage BEFORE any Google tag loads. This is required so Google behaves
 *      lawfully (it's mandatory for serving ads to EEA/UK users).
 *   2. Vercel Analytics loads only when `analytics` consent is granted.
 *   3. The Google tag (gtag.js) is injected only when `analytics` OR
 *      `marketing` is granted, and we push a consent "update" reflecting the
 *      exact choices.
 *   4. We react live to consent changes via the `qcs:consent` event.
 *
 * Configure via env:
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID  — GA4 id, e.g. "G-XXXXXXX"
 *   NEXT_PUBLIC_GOOGLE_ADS_ID      — Google Ads id, e.g. "AW-XXXXXXXXX"
 * With neither set, no Google tag is loaded (safe default).
 */

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { useConsent, type ConsentState } from "./ConsentProvider";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Minimal gtag typing to avoid pulling in extra deps.
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: unknown;
  }
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
  }
}

/** Set Consent Mode v2 defaults — everything denied until the user opts in. */
function setConsentDefaults() {
  ensureGtag();
  window.gtag!("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    // Don't wait forever; region-agnostic safe default.
    wait_for_update: 500,
  });
}

function updateConsent(consent: ConsentState) {
  ensureGtag();
  window.gtag!("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  });
}

let googleTagInjected = false;
function injectGoogleTag() {
  if (googleTagInjected) return;
  const primaryId = GA_ID || ADS_ID;
  if (!primaryId) return; // nothing configured
  googleTagInjected = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`;
  document.head.appendChild(s);

  ensureGtag();
  window.gtag!("js", new Date());
  if (GA_ID) window.gtag!("config", GA_ID);
  if (ADS_ID) window.gtag!("config", ADS_ID);
}

let metaPixelInjected = false;
/** Loads the Meta Pixel. Only call after `marketing` consent is granted. */
function injectMetaPixel() {
  if (metaPixelInjected || !META_PIXEL_ID) return;
  metaPixelInjected = true;

  // Standard Meta Pixel bootstrap (typed, no eval).
  const fbq: NonNullable<Window["fbq"]> = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue!.push(args);
  } as NonNullable<Window["fbq"]>;
  if (!window.fbq) window.fbq = fbq;
  window._fbq = window._fbq || fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);

  window.fbq!("init", META_PIXEL_ID);
  window.fbq!("track", "PageView");
}

export default function ConsentedAnalytics() {
  const { consent } = useConsent();
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  // Set Consent Mode defaults once, as early as possible.
  useEffect(() => {
    setConsentDefaults();
  }, []);

  // React to the current consent + live changes.
  useEffect(() => {
    const apply = (c: ConsentState) => {
      updateConsent(c);
      if (c.analytics || c.marketing) injectGoogleTag();
      if (c.marketing) injectMetaPixel();
      setAnalyticsAllowed(c.analytics);
    };

    apply(consent);

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail;
      if (detail) apply(detail);
    };
    window.addEventListener("qcs:consent", handler);
    return () => window.removeEventListener("qcs:consent", handler);
  }, [consent]);

  // Vercel Analytics only when analytics consent is granted.
  return analyticsAllowed ? <Analytics /> : null;
}
