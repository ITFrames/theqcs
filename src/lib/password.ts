/**
 * Password hashing — scrypt with a per-user random salt (no external deps).
 *
 * Passwords are hashed ONE WAY and never stored reversibly. On login we
 * re-derive the hash from the submitted password and compare in constant time
 * (timingSafeEqual) to resist timing attacks. This is the industry standard.
 */

import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string): string {
  const salt = randomUUID().replace(/-/g, "");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, "hex");
  return keyBuf.length === derived.length && timingSafeEqual(keyBuf, derived);
}
