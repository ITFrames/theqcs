import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isStrongPassword } from "@/lib/validation";

const MAX_ATTEMPTS = 5;

/**
 * POST /api/auth/reset-password
 * Verifies the reset OTP (60s expiry + attempt limit) and sets a new password.
 * Does NOT open a session — the user signs in afterwards with the new password.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const code = String(body.code ?? "").trim();
  const password = String(body.password ?? "");

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code are required." },
      { status: 400 },
    );
  }
  if (!isStrongPassword(password)) {
    return NextResponse.json(
      {
        error:
          "Password must be 8+ characters and include uppercase, lowercase, a number, and a symbol.",
      },
      { status: 400 },
    );
  }

  try {
    const record = await db.getOtp(email, "reset");
    if (!record) {
      return NextResponse.json(
        { error: "No reset code found. Please request a new one." },
        { status: 400 },
      );
    }
    if (Date.now() > record.expiresAt) {
      await db.deleteOtp(email, "reset");
      return NextResponse.json(
        { error: "This code has expired. Please request a new one." },
        { status: 400 },
      );
    }
    if (record.attempts >= MAX_ATTEMPTS) {
      await db.deleteOtp(email, "reset");
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

    // Success — update the password and clear the OTP.
    await db.updatePassword(email, password);
    await db.deleteOtp(email, "reset");

    return NextResponse.json({
      ok: true,
      message: "Your password has been reset. Please sign in.",
    });
  } catch (err) {
    console.error("[qcs] reset-password failed:", err);
    return NextResponse.json(
      { error: "We couldn't reset your password right now. Please try again." },
      { status: 500 },
    );
  }
}
