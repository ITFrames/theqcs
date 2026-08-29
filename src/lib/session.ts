/**
 * Session cookie helpers for QCS ABROAD route handlers.
 * Uses an httpOnly cookie holding an opaque session token.
 */

import { cookies } from "next/headers";
import { db } from "./db";
import type { PublicUser, User } from "./types";

export const SESSION_COOKIE = "qcs_session";

export function toPublicUser(user: User): PublicUser {
  // Strip the password hash before returning to any client.
  const { passwordHash: _passwordHash, ...rest } = user;
  void _passwordHash;
  return rest;
}

export async function setSessionCookie(userId: string): Promise<void> {
  const token = await db.createSession(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  await db.destroySession(token);
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<User | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return db.getSessionUser(token);
}
