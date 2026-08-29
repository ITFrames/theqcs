/**
 * QCS ABROAD — bot-protection helpers for public forms.
 *
 *  - verifyTurnstile(): validates a Cloudflare Turnstile token server-side.
 *  - rateLimit(): a simple in-memory sliding-window limiter keyed by IP.
 *
 * Both degrade gracefully: with no Turnstile secret configured, verification
 * is skipped in development so the form still works locally. The in-memory
 * limiter resets on server restart and is per-instance — fine for a single
 * node / low traffic. For multi-instance production, back it with a shared
 * store (e.g. Upstash/Redis).
 */

interface TurnstileResult {
  ok: boolean;
  /** true when verification was skipped (no secret configured, dev only). */
  skipped: boolean;
  error?: string;
}

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // No secret configured: skip in dev, but never silently pass in production.
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, skipped: false, error: "captcha_not_configured" };
    }
    return { ok: true, skipped: true };
  }

  if (!token) {
    return { ok: false, skipped: false, error: "missing_token" };
  }

  try {
    const form = new URLSearchParams();
    form.append("secret", secret);
    form.append("response", token);
    if (remoteIp) form.append("remoteip", remoteIp);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: form },
    );
    const data = (await res.json()) as { success: boolean };
    return data.success
      ? { ok: true, skipped: false }
      : { ok: false, skipped: false, error: "captcha_failed" };
  } catch {
    return { ok: false, skipped: false, error: "captcha_error" };
  }
}

/* -------------------------------------------------------------------------- */
/* Rate limiting                                                              */
/* -------------------------------------------------------------------------- */

interface Bucket {
  timestamps: number[];
}

const globalForRate = globalThis as unknown as {
  __qcsRate?: Map<string, Bucket>;
};

function getBuckets(): Map<string, Bucket> {
  if (!globalForRate.__qcsRate) globalForRate.__qcsRate = new Map();
  return globalForRate.__qcsRate;
}

/**
 * Allows `limit` requests per `windowMs` for a given key. Returns whether the
 * request is allowed and how long to wait if not.
 */
export function rateLimit(
  key: string,
  limit = 3,
  windowMs = 60_000,
): { allowed: boolean; retryAfterSeconds: number } {
  const buckets = getBuckets();
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };

  // Drop timestamps outside the window.
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    const retryAfterSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
    buckets.set(key, bucket);
    return { allowed: false, retryAfterSeconds };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { allowed: true, retryAfterSeconds: 0 };
}
