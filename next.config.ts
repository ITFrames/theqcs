import type { NextConfig } from "next";

/**
 * Baseline security headers applied to every response. These are safe defaults
 * for a content + dashboard site and improve both security posture and, via
 * caching rules below, performance.
 */
const securityHeaders = [
  // Prevent MIME-sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control referrer leakage.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser features we don't use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
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
