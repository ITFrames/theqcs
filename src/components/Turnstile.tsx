"use client";

/**
 * Cloudflare Turnstile widget.
 *
 * Loads the Turnstile script once and renders the challenge. Calls `onVerify`
 * with the token when solved, and `onExpire` when it expires so the parent can
 * clear a stale token.
 *
 * If NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set, it renders nothing and is
 * treated as a no-op (the server skips verification in dev). This keeps the
 * form usable locally without Cloudflare keys.
 */

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export default function Turnstile({
  onVerify,
  onExpire,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) return; // already rendered
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => onVerify(token),
        "expired-callback": () => onExpire?.(),
        theme: "auto",
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      // Script tag exists but may not be ready yet; poll briefly.
      const id = setInterval(() => {
        if (window.turnstile) {
          clearInterval(id);
          renderWidget();
        }
      }, 200);
      return () => clearInterval(id);
    }

    return () => {
      cancelled = true;
    };
  }, [siteKey, onVerify, onExpire]);

  // Nothing to render without a site key (dev fallback).
  if (!siteKey) return null;

  return <div ref={containerRef} className="mt-2" />;
}
