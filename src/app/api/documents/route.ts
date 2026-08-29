import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { DocumentStatus } from "@/lib/types";
import { validateUpload } from "@/lib/uploadConstraints";

/** GET /api/documents — current student's documents. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const documents = await db.getDocuments(user.id);
  return NextResponse.json({ documents });
}

/**
 * PATCH /api/documents — record a document upload.
 * Body: { documentId, fileName, fileSize?, fileType? }. Enforces the upload
 * policy (PDF only, max 4 MB) server-side, then marks the document
 * "Under Review". (Real file bytes would go to Supabase Storage; here we track
 * metadata only.)
 */
export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: {
    documentId?: string;
    fileName?: string;
    fileSize?: number;
    fileType?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.documentId) {
    return NextResponse.json({ error: "documentId is required." }, { status: 400 });
  }

  // Authoritative validation — never trust the client check alone.
  const check = validateUpload({
    name: body.fileName,
    type: body.fileType,
    size: body.fileSize,
  });
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const status: DocumentStatus = "Under Review";
  const documents = await db.setDocumentStatus(
    user.id,
    body.documentId,
    status,
    body.fileName,
  );
  return NextResponse.json({ documents });
}
