import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSessionCookie } from "@/lib/session";
import { sendWelcomeEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/botProtection";
import { isSameOrigin } from "@/lib/csrf";

const MAX_ATTEMPTS = 5;

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * POST /api/auth/verify-otp
 * Validates a 6-digit code against the stored OTP. Enforces the 60s expiry and
 * a max attempt count. On success: marks the email verified and opens a session.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // Per-IP throttle on top of the per-code attempt counter below.
  const ip = clientIp(request);
  const limit = rateLimit(`verify:${ip}`, 15, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again shortly." },
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

  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const code = String(body.code ?? "").trim();
  const purpose = body.purpose === "login" ? "login" : "register";

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code are required." },
      { status: 400 },
    );
  }

  try {
    const record = await db.getOtp(email, purpose);
    if (!record) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 },
      );
    }

    if (Date.now() > record.expiresAt) {
      await db.deleteOtp(email, purpose);
      return NextResponse.json(
        { error: "This code has expired. Please request a new one." },
        { status: 400 },
      );
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      await db.deleteOtp(email, purpose);
      return NextResponse.json(
        { error: "Too many attempts. Please request a new code." },
        { status: 429 },
      );
    }

    if (record.code !== code) {
      await db.saveOtp({ ...record, attempts: record.attempts + 1 });
      return NextResponse.json(
        { error: "Incorrect code. Please try again." },
        { status: 400 },
      );
    }

    // Success.
    await db.deleteOtp(email, purpose);
    await db.markEmailVerified(email);

    const user = await db.findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Account not found." },
        { status: 404 },
      );
    }

    await setSessionCookie(user.id);
    const profile = await db.getProfile(user.id);

    // Send a one-time welcome email after registration is verified.
    // Fire-and-forget: a mail hiccup must never block sign-up completion.
    if (purpose === "register") {
      sendWelcomeEmail(user.email, user.firstName).catch((err) =>
        console.error("[qcs] welcome email failed:", err),
      );
    }

    return NextResponse.json({
      ok: true,
      onboardingComplete: profile?.onboardingComplete ?? false,
      // Where the client should go next.
      redirect: profile?.onboardingComplete ? "/dashboard" : "/onboarding",
    });
  } catch (err) {
    console.error("[qcs] verify-otp failed:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't verify your code right now. Please try again later.",
      },
      { status: 500 },
    );
  }
}
