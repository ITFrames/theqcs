import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";
import { rateLimit, verifyTurnstile } from "@/lib/botProtection";
import { emailLayout } from "@/lib/emailLayout";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Where contact submissions are delivered. Primary inbox (overridable via
 * CONTACT_TO_EMAIL) plus a fixed Gmail copy so nothing is missed.
 */
const CONTACT_INBOX = process.env.CONTACT_TO_EMAIL || "contact@theqcs.ca";
const CONTACT_GMAIL = "qcsaborad@gmail.com";
const CONTACT_RECIPIENTS = Array.from(
  new Set([CONTACT_INBOX, CONTACT_GMAIL]),
);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * POST /api/contact
 * Public endpoint — layered bot protection:
 *   1. Per-IP rate limit (3/min).
 *   2. Honeypot field must be empty.
 *   3. Cloudflare Turnstile token verified server-side.
 *   4. All fields re-validated server-side (never trust the client).
 * On success, emails the message to the QCS inbox via Resend.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);

  // 1) Rate limit.
  const limit = rateLimit(`contact:${ip}`, 3, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  // 2) Honeypot — hidden field; only bots fill it. Pretend success.
  if (String(body.company_website ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // 3) Turnstile.
  const captcha = await verifyTurnstile(
    typeof body.turnstileToken === "string" ? body.turnstileToken : undefined,
    ip,
  );
  if (!captcha.ok) {
    return NextResponse.json(
      { error: "Bot verification failed. Please try again." },
      { status: 400 },
    );
  }

  // 4) Server-side field validation.
  const fullName = String(body.fullName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const service = String(body.service ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (fullName.length < 2 || fullName.length > 100) {
    return NextResponse.json(
      { error: "Please enter your full name." },
      { status: 400 },
    );
  }
  if (!emailRe.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (!service) {
    return NextResponse.json(
      { error: "Please select a service." },
      { status: 400 },
    );
  }
  if (message.length < 10 || message.length > 2000) {
    return NextResponse.json(
      { error: "Message must be between 10 and 2000 characters." },
      { status: 400 },
    );
  }

  // Deliver.
  const emailBody = `
    <h2 style="color:#1e3a5f;margin:0 0 4px;font-size:20px;">New contact enquiry</h2>
    <p style="color:#718096;margin:0 0 18px;font-size:13px;">A visitor submitted the contact form on theqcs.ca.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
      <tr><td style="padding:6px 0;color:#718096;width:110px;">Name</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(fullName)}</td></tr>
      <tr><td style="padding:6px 0;color:#718096;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#1e3a5f;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:6px 0;color:#718096;">Phone</td><td style="padding:6px 0;">${escapeHtml(phone) || "—"}</td></tr>
      <tr><td style="padding:6px 0;color:#718096;">Service</td><td style="padding:6px 0;">${escapeHtml(service)}</td></tr>
    </table>
    <p style="margin:16px 0 6px;font-weight:600;color:#1a1a2e;font-size:14px;">Message</p>
    <div style="white-space:pre-line;background:#f1f3f5;border-radius:8px;padding:14px;font-size:14px;line-height:1.6;">${escapeHtml(
      message,
    )}</div>`;

  const html = emailLayout(emailBody, {
    preheader: `New enquiry from ${fullName} — ${service}`,
  });

  const result = await sendEmail({
    to: CONTACT_RECIPIENTS,
    subject: `New enquiry from ${fullName} — ${service}`,
    html,
    replyTo: email,
  });

  if (result.error) {
    return NextResponse.json(
      {
        error:
          "We couldn't send your message right now. Please try again later.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, devFallback: result.devFallback });
}
