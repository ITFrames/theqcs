import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, toPublicUser } from "@/lib/session";

/**
 * GET /api/auth/me
 * Returns the current authenticated user + profile, or 401.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const profile = await db.getProfile(user.id);
  return NextResponse.json({ user: toPublicUser(user), profile });
}
