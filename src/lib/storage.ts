/**
 * QCS ABROAD — Supabase Storage helper for the private `documents` bucket.
 *
 * Server-only (uses the service-role key). Issues short-lived signed upload
 * URLs so the browser can upload the PDF directly to Storage without the bytes
 * passing through our API. Files are keyed by user id so each student's
 * documents are namespaced: `documents/<userId>/<documentId>-<filename>`.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const DOCUMENTS_BUCKET = "documents";

let client: SupabaseClient | null = null;

function sb(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // storage not configured
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

/** Sanitize a filename to a safe storage key segment. */
function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
}

export function storagePath(
  userId: string,
  documentId: string,
  fileName: string,
): string {
  return `${userId}/${documentId}-${safeName(fileName)}`;
}

export interface SignedUpload {
  path: string;
  token: string;
}

/**
 * Creates a signed upload URL/token for a given document. Returns null when
 * Storage isn't configured so callers can respond gracefully.
 */
export async function createSignedUpload(
  userId: string,
  documentId: string,
  fileName: string,
): Promise<SignedUpload | null> {
  const supabase = sb();
  if (!supabase) return null;

  const path = storagePath(userId, documentId, fileName);
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUploadUrl(path, { upsert: true });

  if (error || !data) {
    throw new Error(`createSignedUpload failed: ${error?.message ?? "unknown"}`);
  }
  return { path: data.path, token: data.token };
}
