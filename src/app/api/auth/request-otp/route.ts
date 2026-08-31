import { NextResponse } from "next/server";
import { db, generateOtpCode, OTP_TTL_MS } from "@/lib/db";
import { sendOtpEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/botProtection";
import { isSameOrigin } from "@/lib/csrf";

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * POST /api/auth/request-otp
 * Issues (or re-issues) an OTP for a known account. Used by the "Resend code"
 * buttons on the register and login screens. Always 60s expiry.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const ip = clientIp(request);
  const limit = rateLimit(`otp:${ip}`, 5, 60_000);
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
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const purpose = body.purpose === "login" ? "login" : "register";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const user = await db.findUserByEmail(email);
  // Avoid user enumeration: respond the same whether or not the account exists.
  // Only actually issue a code when there is a matching account.
  if (!user) {
    return NextResponse.json({
      ok: true,
      message: "If an account exists, a verification code has been sent.",
      expiresInSeconds: OTP_TTL_MS / 1000,
    });
  }

  const code = generateOtpCode();
  await db.saveOtp({
    email,
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    purpose,
    attempts: 0,
  });

  const delivery = await sendOtpEmail(email, code, purpose);
  const exposeCode =
    delivery.devFallback && process.env.NODE_ENV !== "production";

  if (delivery.error) {
    return NextResponse.json(
      { error: "We couldn't send your code right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "A new verification code has been sent.",
    expiresInSeconds: OTP_TTL_MS / 1000,
    ...(exposeCode ? { devOtp: code } : {}),
  });
}
