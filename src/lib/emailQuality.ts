/**
 * QCS ABROAD — email deliverability / bounce control.
 *
 * Reduces bounces (which hurt sender reputation) and blocks abuse from fake or
 * throwaway addresses used to spam OTP sign-ups. Layers:
 *
 *   1. Syntax + shape checks (already covered by validation.ts EMAIL_RE).
 *   2. Disposable / temporary-domain blocklist  — reject known throwaway
 *      providers (mailinator, tempmail, guerrillamail, …).
 *   3. Role-address discouragement (optional) — admin@, postmaster@, etc.
 *   4. MX-record lookup — confirm the domain can actually receive mail, so we
 *      never send to a domain that will hard-bounce (typos, made-up domains).
 *   5. Suppression list — addresses that previously HARD-bounced (populated by
 *      the Resend bounce webhook) are refused up front.
 *
 * All checks are best-effort and fail OPEN on infrastructure errors (e.g. DNS
 * timeout) so a transient issue never blocks a legitimate signup.
 */

import { promises as dns } from "node:dns";
import { db } from "./db";

/** Known disposable / temporary email domains (common abuse vectors). */
const DISPOSABLE_DOMAINS = new Set<string>([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "grr.la",
  "sharklasers.com",
  "10minutemail.com",
  "temp-mail.org",
  "tempmail.com",
  "tempmail.net",
  "throwawaymail.com",
  "yopmail.com",
  "yopmail.net",
  "getnada.com",
  "nada.email",
  "dispostable.com",
  "trashmail.com",
  "trashmail.net",
  "maildrop.cc",
  "mailnesia.com",
  "fakeinbox.com",
  "mintemail.com",
  "mohmal.com",
  "emailondeck.com",
  "spamgourmet.com",
  "mailcatch.com",
  "tempinbox.com",
  "moakt.com",
  "burnermail.io",
  "temp-mail.io",
  "tmpmail.org",
  "tmpmail.net",
  "1secmail.com",
  "1secmail.org",
  "wemel.top",
  "ezztt.com",
]);

/** Role-based local parts that are usually not real individual students. */
const ROLE_LOCALPARTS = new Set<string>([
  "admin",
  "administrator",
  "postmaster",
  "hostmaster",
  "webmaster",
  "noreply",
  "no-reply",
  "abuse",
  "root",
  "spam",
  "test",
]);

export interface EmailCheckResult {
  ok: boolean;
  /** machine-readable reason when not ok */
  reason?:
    | "invalid_format"
    | "disposable"
    | "role_address"
    | "no_mx"
    | "suppressed";
  /** user-facing message when not ok */
  message?: string;
}

const BASIC_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function splitEmail(email: string): { local: string; domain: string } | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  return {
    local: email.slice(0, at).toLowerCase(),
    domain: email.slice(at + 1).toLowerCase(),
  };
}

/** Does the domain publish MX (or at least an A) record able to receive mail? */
async function domainCanReceiveMail(domain: string): Promise<boolean> {
  try {
    const mx = await dns.resolveMx(domain);
    if (mx && mx.length > 0) return true;
  } catch {
    // fall through to A-record check
  }
  try {
    // Some domains accept mail via an A record even without MX.
    const a = await dns.resolve(domain).catch(() => []);
    return Array.isArray(a) && a.length > 0;
  } catch {
    return false;
  }
}

/**
 * Full deliverability check. `opts.checkMx` enables the DNS lookup (recommended
 * on the server before sending). Fails OPEN on DNS errors.
 */
export async function checkEmailDeliverability(
  emailRaw: string,
  opts: { checkMx?: boolean; blockRole?: boolean } = {},
): Promise<EmailCheckResult> {
  const email = emailRaw.trim().toLowerCase();

  if (!BASIC_RE.test(email)) {
    return {
      ok: false,
      reason: "invalid_format",
      message: "Please enter a valid email address.",
    };
  }

  const parts = splitEmail(email);
  if (!parts) {
    return {
      ok: false,
      reason: "invalid_format",
      message: "Please enter a valid email address.",
    };
  }
  const { local, domain } = parts;

  // 1) Suppression list (previously hard-bounced).
  if (await db.isEmailSuppressed(email)) {
    return {
      ok: false,
      reason: "suppressed",
      message:
        "We can't deliver mail to this address. Please use a different email.",
    };
  }

  // 2) Disposable domains.
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      ok: false,
      reason: "disposable",
      message:
        "Temporary or disposable email addresses aren't allowed. Please use a permanent email.",
    };
  }

  // 3) Role addresses (optional).
  if (opts.blockRole && ROLE_LOCALPARTS.has(local)) {
    return {
      ok: false,
      reason: "role_address",
      message: "Please use a personal email address.",
    };
  }

  // 4) MX / receiving-capability check.
  if (opts.checkMx) {
    const canReceive = await domainCanReceiveMail(domain);
    if (!canReceive) {
      return {
        ok: false,
        reason: "no_mx",
        message:
          "This email domain doesn't appear to accept mail. Please check for typos.",
      };
    }
  }

  return { ok: true };
}

export { DISPOSABLE_DOMAINS };
