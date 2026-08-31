/**
 * CSRF defense for state-changing API routes.
 *
 * The session cookie is SameSite=Lax + httpOnly, which already blocks the
 * classic cross-site form/GET CSRF vector. As defense-in-depth for the JSON
 * endpoints, we also verify the request originates from our own site by
 * checking the Origin header against an allow-list.
 *
 * Browsers always send Origin on cross-origin (and most same-origin) requests
 * for POST/PATCH/PUT/DELETE, so a forged cross-site request from another
 * origin is rejected. Server-to-server calls (no Origin) are allowed since
 * they can't ride a victim's cookies from a browser.
 */

/** Origins permitted to call our state-changing APIs. */
function allowedOrigins(): string[] {
  const list = [
    "https://theqcs.ca",
    "https://www.theqcs.ca",
  ];
  // Vercel preview/prod URL, if provided.
  if (process.env.NEXT_PUBLIC_SITE_URL) list.push(process.env.NEXT_PUBLIC_SITE_URL);
  if (process.env.VERCEL_URL) list.push(`https://${process.env.VERCEL_URL}`);
  // Local development.
  if (process.env.NODE_ENV !== "production") {
    list.push("http://localhost:3000", "http://127.0.0.1:3000");
  }
  return list;
}

/**
 * Returns true if the request is same-origin / from an allowed origin.
 * Requests without an Origin header (e.g. server-to-server, curl) are allowed
 * because they cannot be a browser-driven CSRF attack riding session cookies.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // no browser Origin → not a cookie-riding CSRF
  return allowedOrigins().includes(origin);
}
