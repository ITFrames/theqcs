import { NextResponse } from "next/server";
import { db, generateOtpCode, OTP_TTL_MS, verifyPassword } from "@/lib/db";
import { sendOtpEmail } from "@/lib/mailer";

/**
 * POST /api/auth/login
 * Validates email + password, then issues a login OTP (60s expiry) for 2FA.
 * The session is only created after /verify-otp succeeds.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await db.findUserByEmail(email);
  // Generic message to avoid leaking which emails are registered.
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const code = generateOtpCode();
  await db.saveOtp({
    email,
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    purpose: "login",
    attempts: 0,
  });

  const delivery = await sendOtpEmail(email, code, "login");
  const exposeCode = delivery.devFallback && process.env.NODE_ENV !== "production";

  if (delivery.error) {
    return NextResponse.json(
      { error: "We couldn't send your code right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    step: "otp",
    message: "Verification code sent.",
    expiresInSeconds: OTP_TTL_MS / 1000,
    ...(exposeCode ? { devOtp: code } : {}),
  });
}
