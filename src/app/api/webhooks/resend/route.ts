import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/webhooks/resend
 * Receives delivery events from Resend (https://resend.com/docs/webhooks).
 * On a HARD bounce or spam complaint we add the address to our suppression
 * list so we stop mailing it (protects sender reputation).
 *
 * SECURITY: configure RESEND_WEBHOOK_SECRET and set the same signing secret in
 * the Resend dashboard. We verify the Svix signature headers before trusting
 * the payload. Without a secret configured we reject in production.
 *
 * Resend uses Svix for signatures. If you add the `svix` package you can use
 * its Webhook verifier; to stay dependency-free we do an HMAC-SHA256 check of
 * the Svix scheme here.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

function verifySvix(
  secret: string,
  headers: Headers,
  rawBody: string,
): boolean {
  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signatureHeader = headers.get("svix-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  // Svix secrets are prefixed "whsec_" and base64-encoded.
  const key = secret.startsWith("whsec_")
    ? Buffer.from(secret.slice(6), "base64")
    : Buffer.from(secret, "base64");

  const signedContent = `${id}.${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", key)
    .update(signedContent)
    .digest("base64");

  // Header can contain multiple space-separated "v1,<sig>" entries.
  for (const part of signatureHeader.split(" ")) {
    const sig = part.includes(",") ? part.split(",")[1] : part;
    try {
      const a = Buffer.from(sig);
      const b = Buffer.from(expected);
      if (a.length === b.length && timingSafeEqual(a, b)) return true;
    } catch {
      // try next
    }
  }
  return false;
}

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const raw = await request.text();

  if (secret) {
    if (!verifySvix(secret, request.headers, raw)) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    // Fail closed in prod if the secret isn't set.
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 503 },
    );
  }

  let event: { type?: string; data?: { to?: string | string[]; email?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  // Suppress on hard bounce or spam complaint.
  const SUPPRESS_TYPES = new Set([
    "email.bounced",
    "email.complained",
  ]);

  if (event.type && SUPPRESS_TYPES.has(event.type)) {
    const to = event.data?.to ?? event.data?.email;
    const addresses = Array.isArray(to) ? to : to ? [to] : [];
    for (const addr of addresses) {
      try {
        await db.suppressEmail(addr);
      } catch (err) {
        console.error("[qcs] failed to suppress bounced email:", err);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
