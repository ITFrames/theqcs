import { NextResponse } from "next/server";
import { db, generateOtpCode, OTP_TTL_MS } from "@/lib/db";
import { sendOtpEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/botProtection";
import { isSameOrigin } from "@/lib/csrf";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * POST /api/auth/request-password-reset
 * Issues a password-reset OTP (60s expiry). This endpoint reports explicitly
 * when no account exists (product decision) — rate limiting below mitigates
 * the resulting email-enumeration abuse.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // Rate limit per IP: this endpoint reveals account existence, so cap how fast
  // someone can probe addresses.
  const ip = clientIp(request);
  const limit = rateLimit(`pwreset:${ip}`, 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
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
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!emailRe.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const user = await db.findUserByEmail(email);
    // Per product decision: tell the user explicitly when no account exists so
    // they can register instead. (Trade-off: this allows email enumeration;
    // rate limiting on this endpoint mitigates bulk abuse.)
    if (!user) {
      return NextResponse.json(
        {
          error: "no_account",
          message:
            "No account found with that email. Please check the address or create a new account.",
        },
        { status: 404 },
      );
    }

    const code = generateOtpCode();
    await db.saveOtp({
      email,
      code,
      expiresAt: Date.now() + OTP_TTL_MS,
      purpose: "reset",
      attempts: 0,
    });

    const delivery = await sendOtpEmail(email, code, "reset");
    const exposeCode =
      delivery.devFallback && process.env.NODE_ENV !== "production";

    return NextResponse.json({
      ok: true,
      message: "We've sent a password reset code to your email.",
      expiresInSeconds: OTP_TTL_MS / 1000,
      ...(exposeCode ? { devOtp: code } : {}),
    });
  } catch (err) {
    console.error("[qcs] request-password-reset failed:", err);
    return NextResponse.json(
      { error: "We couldn't process your request. Please try again." },
      { status: 500 },
    );
  }
}
