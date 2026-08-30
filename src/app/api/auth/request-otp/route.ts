import { NextResponse } from "next/server";
import { db, generateOtpCode, OTP_TTL_MS } from "@/lib/db";
import { sendOtpEmail } from "@/lib/mailer";

/**
 * POST /api/auth/request-otp
 * Issues (or re-issues) an OTP for a known account. Used by the "Resend code"
 * buttons on the register and login screens. Always 60s expiry.
 */
export async function POST(request: Request) {
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
  if (!user) {
    return NextResponse.json(
      { error: "No account found for this email." },
      { status: 404 },
    );
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
