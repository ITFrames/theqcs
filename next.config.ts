import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * Restricts where scripts/styles/frames/connections may load from to blunt XSS
 * and data-exfiltration. Allowances are limited to the third parties the site
 * actually uses:
 *   - Cloudflare Turnstile (contact-form bot protection)
 *   - Instagram embeds (success-stories, only after marketing consent)
 *   - Supabase (auth/data/storage) over https + wss
 *   - Vercel Analytics
 *
 * Note: Next.js currently needs 'unsafe-inline' for styles, and Turnstile /
 * Next's runtime use inline script bootstrapping, so 'unsafe-inline' is kept
 * for script-src. For a stricter nonce-based CSP we'd wire a nonce through a
 * middleware; this static policy is a strong, low-risk baseline.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.instagram.com https://*.instagram.com https://va.vercel-scripts.com",
  "frame-src https://challenges.cloudflare.com https://www.instagram.com https://*.instagram.com",
  "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com https://api.resend.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Baseline security headers applied to every response. These are safe defaults
 * for a content + dashboard site and improve both security posture and, via
 * caching rules below, performance.
 */
const securityHeaders = [
  // Restrict resource origins (XSS / injection hardening).
  { key: "Content-Security-Policy", value: csp },
  // Prevent MIME-sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control referrer leakage.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser features we don't use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Isolate this origin from cross-origin window references.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Enforce HTTPS once deployed (2 years, include subdomains).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Legacy clickjacking guard (CSP frame-ancestors is the modern equivalent).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Known short/share links (e.g. printed on flyers, QR codes, IG bio) that
      // aren't real pages — send them somewhere useful instead of a 404.
      // These are explicit, intentional redirects (not a catch-all, which would
      // hurt SEO). Add more aliases here as needed.
      { source: "/get-social", destination: "/contact", permanent: false },
      { source: "/social", destination: "/contact", permanent: false },
      { source: "/home", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      // Security headers on everything.
      {
        source: "/:path*",
        headers: securityHeaders,
      },

      // Long-lived, immutable caching for static assets in /public.
      // (Next already sets immutable caching for its own hashed /_next assets.)
      {
        source:
          "/:path*.(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // Never cache authenticated / sensitive areas.
      {
        source: "/dashboard/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, no-cache, must-revalidate",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
