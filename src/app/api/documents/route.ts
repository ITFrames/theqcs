import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { DocumentStatus } from "@/lib/types";
import { validateUpload } from "@/lib/uploadConstraints";
import { createSignedUpload, deleteFile, storagePath } from "@/lib/storage";

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
 * POST /api/documents — request a signed URL to upload a document's bytes
 * directly to the private Storage bucket. Body: { documentId, fileName,
 * fileSize, fileType }. Validates the PDF/4MB policy first.
 */
export async function POST(request: Request) {
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
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!body.documentId || !body.fileName) {
    return NextResponse.json(
      { error: "documentId and fileName are required." },
      { status: 400 },
    );
  }

  const check = validateUpload({
    name: body.fileName,
    type: body.fileType,
    size: body.fileSize,
  });
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  try {
    const signed = await createSignedUpload(
      user.id,
      body.documentId,
      body.fileName,
    );
    if (!signed) {
      return NextResponse.json(
        { error: "File storage is not configured yet. Please try later." },
        { status: 503 },
      );
    }
    return NextResponse.json({
      bucket: "documents",
      path: signed.path,
      token: signed.token,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
  } catch (err) {
    console.error("[qcs] signed upload failed:", err);
    return NextResponse.json(
      { error: "Could not start the upload. Please try again." },
      { status: 500 },
    );
  }
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
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!body.documentId) {
    return NextResponse.json(
      { error: "documentId is required." },
      { status: 400 },
    );
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

  const status: DocumentStatus = "Uploaded";
  const documents = await db.setDocumentStatus(
    user.id,
    body.documentId,
    status,
    body.fileName,
  );
  return NextResponse.json({ documents });
}

/**
 * DELETE /api/documents — remove an uploaded file and reset the slot.
 * Body: { documentId, fileName }. Deletes the object from Storage (best-effort)
 * and marks the document "Not Uploaded".
 */
export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: { documentId?: string; fileName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!body.documentId) {
    return NextResponse.json(
      { error: "documentId is required." },
      { status: 400 },
    );
  }

  // Best-effort remove the stored object (don't fail the reset if it's gone).
  if (body.fileName) {
    try {
      await deleteFile(storagePath(user.id, body.documentId, body.fileName));
    } catch (err) {
      console.error("[qcs] document file delete failed:", err);
    }
  }

  const documents = await db.setDocumentStatus(
    user.id,
    body.documentId,
    "Not Uploaded",
    "", // clear the stored filename
  );
  return NextResponse.json({ documents });
}
