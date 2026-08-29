import { NextResponse } from "next/server";
import { db, generateOtpCode, OTP_TTL_MS } from "@/lib/db";
import { sendOtpEmail } from "@/lib/mailer";
import { validateRegistration, hasErrors } from "@/lib/validation";

/**
 * POST /api/auth/register
 * Creates a pending student account and issues a registration OTP (60s expiry).
 * The account exists but email stays unverified until /verify-otp succeeds.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const password = String(body.password ?? "");

  // Server-side validation — the source of truth. The client mirrors these
  // rules for UX, but we never trust the client.
  const fieldErrors = validateRegistration({
    firstName,
    lastName,
    email,
    phone,
    password,
  });
  if (hasErrors(fieldErrors)) {
    const firstMessage =
      fieldErrors.firstName ??
      fieldErrors.lastName ??
      fieldErrors.email ??
      fieldErrors.phone ??
      fieldErrors.password ??
      "Please check the details you entered.";
    return NextResponse.json(
      { error: firstMessage, fieldErrors },
      { status: 400 },
    );
  }

  const existing = await db.findUserByEmail(email);
  if (existing && existing.emailVerified) {
    return NextResponse.json(
      { error: "An account with this email already exists. Please sign in." },
      { status: 409 },
    );
  }

  if (!existing) {
    await db.createUser({ firstName, lastName, email, phone, password });
  }

  const code = generateOtpCode();
  await db.saveOtp({
    email,
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    purpose: "register",
    attempts: 0,
  });

  // Deliver by email (Resend). Falls back to console logging in dev when no
  // provider is configured. Only surface the code to the client on that dev
  // fallback — never when it was really emailed, and never in production.
  const delivery = await sendOtpEmail(email, code, "register");
  const exposeCode = delivery.devFallback && process.env.NODE_ENV !== "production";

  if (delivery.error) {
    return NextResponse.json(
      { error: "We couldn't send your code right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Verification code sent.",
    expiresInSeconds: OTP_TTL_MS / 1000,
    ...(exposeCode ? { devOtp: code } : {}),
  });
}
