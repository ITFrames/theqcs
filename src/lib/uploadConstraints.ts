/**
 * QCS ABROAD — document upload constraints.
 * Single source of truth shared by the client UI and the server route so both
 * enforce identical rules. Policy: PDF only, max 4 MB.
 */

export const MAX_UPLOAD_MB = 4;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

/** Only PDF documents are accepted. */
export const ACCEPTED_EXTENSIONS = [".pdf"] as const;
export const ACCEPTED_MIME_TYPES = ["application/pdf"] as const;

/** Value for an <input type="file"> `accept` attribute. */
export const ACCEPT_ATTR = ".pdf,application/pdf";

export interface FileCheck {
  ok: boolean;
  error?: string;
}

/**
 * Validates a file's name/type/size against policy. Works with a real File
 * (client) or a plain descriptor (server), so the same rules apply on both
 * sides — the client check is UX; the server check is authoritative.
 */
export function validateUpload(input: {
  name?: string;
  type?: string;
  size?: number;
}): FileCheck {
  const name = (input.name ?? "").toLowerCase();
  const isPdfExt = name.endsWith(".pdf");
  const isPdfMime = !input.type || input.type === "application/pdf";

  if (!isPdfExt || !isPdfMime) {
    return { ok: false, error: "Only PDF files are accepted." };
  }
  if (typeof input.size === "number" && input.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: `File exceeds the ${MAX_UPLOAD_MB} MB limit.`,
    };
  }
  return { ok: true };
}
