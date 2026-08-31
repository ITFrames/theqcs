/**
 * QCS ABROAD — OTP email delivery.
 *
 * Sends the one-time verification code by email. Uses Resend
 * (https://resend.com) via its REST API — no SDK dependency required.
 *
 * Configuration (see .env.local):
 *   OTP_DELIVERY_PROVIDER=resend
 *   RESEND_API_KEY=re_xxx
 *   OTP_FROM_EMAIL=no-reply@theqcs.ca   (domain must be verified in Resend)
 *
 * If no provider/key is configured, it falls back to DEV mode: the code is
 * logged to the server console and NOT emailed. The API route decides whether
 * to also surface the code to the client (only outside production).
 */

import { emailLayout } from "./emailLayout";

const FROM_EMAIL = process.env.OTP_FROM_EMAIL || "no-reply@theqcs.ca";
const FROM_NAME = "QCS ABROAD";


export interface SendOtpResult {
  /** true when the code was actually dispatched to a provider. */
  delivered: boolean;
  /** true when we only logged it (no provider configured). */
  devFallback: boolean;
  error?: string;
}

function otpEmailHtml(code: string, purpose: "register" | "login"): string {
  const heading =
    purpose === "register" ? "Verify your email" : "Sign-in verification";
  const body = `
    <h2 style="font-size:20px;color:#1e3a5f;margin:0 0 4px">${heading}</h2>
    <p style="font-size:14px;color:#4a5568;margin:0 0 16px;line-height:1.6">
      Use the code below to continue. It expires in <strong>60 seconds</strong>.
    </p>
    <div style="font-size:32px;font-weight:700;letter-spacing:8px;color:#1e3a5f;
                background:#f1f3f5;border-radius:10px;padding:16px;text-align:center;margin:0 0 16px">
      ${code}
    </div>
    <p style="font-size:12px;color:#718096;margin:0">
      If you didn't request this, you can safely ignore this email.
    </p>`;
  return emailLayout(body, { preheader: `Your QCS ABROAD code: ${code}` });
}

/**
 * Sends the OTP. Never throws — returns a result the caller can act on so a
 * mail outage doesn't take down the auth endpoint.
 */
export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: "register" | "login",
): Promise<SendOtpResult> {
  const provider = (process.env.OTP_DELIVERY_PROVIDER || "").toLowerCase();
  const apiKey = process.env.RESEND_API_KEY;

  // No provider configured -> dev fallback.
  if (provider !== "resend" || !apiKey) {
    console.log(`[qcs] (dev) OTP for ${to} [${purpose}]: ${code}`);
    return { delivered: false, devFallback: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [to],
        subject:
          purpose === "register"
            ? "Your QCS ABROAD verification code"
            : "Your QCS ABROAD sign-in code",
        html: otpEmailHtml(code, purpose),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[qcs] Resend send failed (${res.status}): ${detail}`);
      return { delivered: false, devFallback: false, error: "send_failed" };
    }

    return { delivered: true, devFallback: false };
  } catch (err) {
    console.error("[qcs] Resend send error:", err);
    return { delivered: false, devFallback: false, error: "network_error" };
  }
}

/* -------------------------------------------------------------------------- */
/* Generic email (used by the contact form, etc.)                             */
/* -------------------------------------------------------------------------- */

export interface SendEmailResult {
  delivered: boolean;
  devFallback: boolean;
  error?: string;
}

/**
 * Sends an arbitrary transactional email via Resend. Falls back to logging in
 * dev when no provider is configured. Never throws.
 */
export async function sendEmail(input: {
  to: string | string[];
  subject: string;
  html: string;
  /** Optional Reply-To (e.g. the person who submitted the contact form). */
  replyTo?: string;
}): Promise<SendEmailResult> {
  const provider = (process.env.OTP_DELIVERY_PROVIDER || "").toLowerCase();
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = Array.isArray(input.to) ? input.to : [input.to];

  if (provider !== "resend" || !apiKey) {
    console.log(
      `[qcs] (dev) email to ${recipients.join(", ")} — subject: ${input.subject}` +
        (input.replyTo ? ` (reply-to: ${input.replyTo})` : ""),
    );
    return { delivered: false, devFallback: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: recipients,
        subject: input.subject,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[qcs] Resend email failed (${res.status}): ${detail}`);
      return { delivered: false, devFallback: false, error: "send_failed" };
    }
    return { delivered: true, devFallback: false };
  } catch (err) {
    console.error("[qcs] Resend email error:", err);
    return { delivered: false, devFallback: false, error: "network_error" };
  }
}
