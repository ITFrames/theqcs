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

function otpEmailHtml(
  code: string,
  purpose: "register" | "login" | "reset",
): string {
  const heading =
    purpose === "register"
      ? "Verify your email"
      : purpose === "reset"
        ? "Reset your password"
        : "Sign-in verification";
  const body = `
    <h2 style="font-size:20px;color:#1e3a5f;margin:0 0 4px">${heading}</h2>
    <p style="font-size:14px;color:#4a5568;margin:0 0 16px;line-height:1.6">
      Use the code below to continue. It expires in <strong>5 minutes</strong>.
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
  purpose: "register" | "login" | "reset",
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
            : purpose === "reset"
              ? "Your QCS ABROAD password reset code"
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

/* -------------------------------------------------------------------------- */
/* Welcome email (sent once after a student verifies registration)            */
/* -------------------------------------------------------------------------- */

const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://www.theqcs.ca"
).replace(/\/$/, "");

/**
 * Sends a friendly welcome email after a student's account is verified.
 * Fire-and-forget from the caller — never blocks the signup flow.
 */
export async function sendWelcomeEmail(
  to: string,
  firstName: string,
): Promise<SendEmailResult> {
  const name = firstName?.trim() || "there";
  const body = `
    <h2 style="font-size:22px;color:#1e3a5f;margin:0 0 6px;">Welcome to QCS ABROAD, ${escapeHtmlText(
      name,
    )}! 🎉</h2>
    <p style="font-size:14px;color:#4a5568;line-height:1.7;margin:0 0 16px;">
      Your account is verified and you&apos;re all set to begin your study
      abroad journey. We&apos;re thrilled to help you find the right university,
      navigate admissions and visas, and get you ready to go.
    </p>
    <p style="font-size:14px;color:#1a1a2e;font-weight:600;margin:0 0 8px;">What&apos;s next?</p>
    <ul style="font-size:14px;color:#4a5568;line-height:1.7;margin:0 0 20px;padding-left:18px;">
      <li>Complete your profile so we can tailor recommendations to your goals.</li>
      <li>Explore programs and shortlist your favourites.</li>
      <li>Upload your documents — your counsellor will take it from there.</li>
    </ul>
    <p style="margin:0 0 24px;">
      <a href="${APP_URL}/dashboard"
        style="display:inline-block;background:#1e3a5f;color:#ffffff;text-decoration:none;
               font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;">
        Go to your dashboard
      </a>
    </p>
    <p style="font-size:13px;color:#718096;line-height:1.6;margin:0;">
      Questions? Just reply to this email or reach us at
      <a href="mailto:contact@theqcs.ca" style="color:#1e3a5f;">contact@theqcs.ca</a>.
      We&apos;re here to help. 🌍
    </p>`;

  return sendEmail({
    to,
    subject: "Welcome to QCS ABROAD — your journey starts here 🎓",
    html: emailLayout(body, {
      preheader: "Your account is verified — here's how to get started.",
    }),
  });
}

/** Minimal HTML-escape for interpolated user text in emails. */
function escapeHtmlText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
