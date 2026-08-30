import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";
import { rateLimit, verifyTurnstile } from "@/lib/botProtection";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Where contact submissions are delivered. */
const CONTACT_INBOX = process.env.CONTACT_TO_EMAIL || "contact@theqcs.ca";

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
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;color:#1a1a2e">
      <h2 style="color:#1e3a5f;margin:0 0 12px">New contact enquiry</h2>
      <p style="margin:4px 0"><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p style="margin:4px 0"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:4px 0"><strong>Phone:</strong> ${escapeHtml(phone) || "—"}</p>
      <p style="margin:4px 0"><strong>Service:</strong> ${escapeHtml(service)}</p>
      <p style="margin:12px 0 4px"><strong>Message:</strong></p>
      <p style="white-space:pre-line;background:#f1f3f5;border-radius:8px;padding:12px;margin:0">${escapeHtml(
        message,
      )}</p>
    </div>`;

  const result = await sendEmail({
    to: CONTACT_INBOX,
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
