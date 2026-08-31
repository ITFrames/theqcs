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
      console.error(
        "[qcs] Turnstile FAIL: TURNSTILE_SECRET_KEY is not set in this " +
          "(production) environment. Add it in Vercel → Settings → " +
          "Environment Variables (Production) and redeploy.",
      );
      return { ok: false, skipped: false, error: "captcha_not_configured" };
    }
    return { ok: true, skipped: true };
  }

  if (!token) {
    console.error("[qcs] Turnstile FAIL: no token received from the client.");
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
    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    if (data.success) {
      return { ok: true, skipped: false };
    }
    // Surface Cloudflare's reason(s) to the server log for diagnosis, e.g.
    // "invalid-input-secret", "timeout-or-duplicate", "invalid-input-response".
    console.error(
      "[qcs] Turnstile verification failed:",
      data["error-codes"] ?? "(no error-codes)",
    );
    return { ok: false, skipped: false, error: "captcha_failed" };
  } catch (err) {
    console.error("[qcs] Turnstile verification error:", err);
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
