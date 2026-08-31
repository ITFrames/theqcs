import { NextResponse } from "next/server";
import { db, generateOtpCode, OTP_TTL_MS } from "@/lib/db";
import { sendOtpEmail } from "@/lib/mailer";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/request-password-reset
 * Issues a password-reset OTP (60s expiry). Anti-enumeration: always responds
 * with the same success message whether or not the email is registered, so an
 * attacker can't discover which emails have accounts.
 */
export async function POST(request: Request) {
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

  const genericOk = {
    ok: true,
    message: "If an account exists for that email, we've sent a reset code.",
    expiresInSeconds: OTP_TTL_MS / 1000,
  };

  try {
    const user = await db.findUserByEmail(email);
    // Only send if the account exists — but never reveal that to the client.
    if (!user) {
      return NextResponse.json(genericOk);
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
      ...genericOk,
      ...(exposeCode ? { devOtp: code } : {}),
    });
  } catch (err) {
    console.error("[qcs] request-password-reset failed:", err);
    // Still return generic success to avoid leaking anything.
    return NextResponse.json(genericOk);
  }
}
