import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

/**
 * POST /api/auth/logout
 * Destroys the session and clears the cookie.
 */
export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
