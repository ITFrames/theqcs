"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { UploadCloud, CheckCircle2, Trash2 } from "lucide-react";
import type { StudentDocument, StudentProfile } from "@/lib/types";
import {
  ACCEPT_ATTR,
  MAX_UPLOAD_MB,
  validateUpload,
} from "@/lib/uploadConstraints";
import { trackEvent } from "@/lib/analytics";

/**
 * Ranks academic qualifications so we only show document slots relevant to the
 * student's highest level. A student whose highest is Bachelor's shouldn't be
 * asked for a Master's degree certificate.
 */
const QUALIFICATION_RANK: Record<string, number> = {
  "High School": 1,
  Diploma: 2,
  "Bachelor's": 3,
  "Master's": 4,
  PhD: 5,
};

/**
 * Minimum qualification rank at which a given academic document becomes
 * relevant. Documents not listed here (identity, financial, application) always
 * apply. Keyed by the document `name` used in the seed data.
 */
const DOC_MIN_RANK: Record<string, number> = {
  "10th Certificate": 1,
  "12th Certificate": 1,
  "Bachelor's Degree": 3,
  "Master's Degree": 4,
  Transcripts: 1,
};

/** Documents required for every applicant (show a "Required" badge). */
const MANDATORY_DOCS = new Set<string>([
  "Passport",
  "Photograph",
  "10th Certificate",
  "12th Certificate",
  "Transcripts",
  "IELTS / TOEFL / PTE / Duolingo",
  "Statement of Purpose",
]);

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/documents").then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
    ])
      .then(([docs, prof]) => {
        setDocuments(docs.documents ?? []);
        setProfile(prof.profile ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const upload = async (documentId: string, file: File) => {
    setError(null);
    const check = validateUpload({
      name: file.name,
      type: file.type,
      size: file.size,
    });
    if (!check.ok) {
      setError(`"${file.name}": ${check.error}`);
      return;
    }

    setUploadingId(documentId);
    try {
      // 1) Ask our server for a signed upload URL (validates policy + auth).
      const signRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }),
      });
      const signed = await signRes.json().catch(() => ({}));
      if (!signRes.ok) {
        setError(signed.error ?? "Could not start the upload.");
        return;
      }

      // 2) Upload the bytes directly to Supabase Storage using the token.
      const uploadUrl = `${signed.supabaseUrl}/storage/v1/object/upload/sign/${signed.bucket}/${signed.path}?token=${signed.token}`;
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/pdf" },
        body: file,
      });
      if (!putRes.ok) {
        setError("Upload to storage failed. Please try again.");
        return;
      }

      // 3) Record the upload against the document (marks it uploaded).
      const patchRes = await fetch("/api/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }),
      });
      if (patchRes.ok) {
        const d = await patchRes.json();
        setDocuments(d.documents ?? []);
        trackEvent("upload_document", { type: "pdf" });
      } else {
        const d = await patchRes.json().catch(() => ({}));
        setError(d.error ?? "Could not record the upload.");
      }
    } catch {
      setError("Network error during upload. Please try again.");
    } finally {
      setUploadingId(null);
    }
  };

  const deleteDoc = async (documentId: string, fileName?: string) => {
    setError(null);
    setUploadingId(documentId);
    try {
      const res = await fetch("/api/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, fileName }),
      });
      if (res.ok) {
        const d = await res.json();
        setDocuments(d.documents ?? []);
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Could not delete the file.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploadingId(null);
    }
  };

  // Filter documents by the student's highest qualification.
  const visibleDocuments = useMemo(() => {
    const rank = profile?.highestQualification
      ? QUALIFICATION_RANK[profile.highestQualification] ?? 99
      : 99; // unknown -> show everything
    return documents.filter((d) => {
      const min = DOC_MIN_RANK[d.name];
      return min === undefined || min <= rank;
    });
  }, [documents, profile]);

  const grouped = useMemo(() => {
    const map = new Map<string, StudentDocument[]>();
    for (const doc of visibleDocuments) {
      map.set(doc.category, [...(map.get(doc.category) ?? []), doc]);
    }
    return Array.from(map.entries());
  }, [visibleDocuments]);

  const uploadedCount = visibleDocuments.filter(
    (d) => d.status !== "Not Uploaded",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          My Documents
        </h1>
        <p className="mt-1 text-[var(--color-foreground-muted)]">
          {uploadedCount} of {visibleDocuments.length} documents uploaded.
          Accepted format: PDF only · Max {MAX_UPLOAD_MB} MB each.
        </p>
      </div>

      {error && (
        <p
          className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-[var(--color-foreground-muted)]">Loading…</p>
      ) : (
        <div className="space-y-6">
          {grouped.map(([category, docs]) => (
            <section key={category}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-foreground-subtle)]">
                {category}
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {docs.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    doc={doc}
                    mandatory={MANDATORY_DOCS.has(doc.name)}
                    uploading={uploadingId === doc.id}
                    onUpload={upload}
                    onDelete={deleteDoc}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentRow({
  doc,
  mandatory,
  uploading,
  onUpload,
  onDelete,
}: {
  doc: StudentDocument;
  mandatory: boolean;
  uploading: boolean;
  onUpload: (documentId: string, file: File) => void;
  onDelete: (documentId: string, fileName?: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFile = !!doc.fileName || doc.status !== "Not Uploaded";

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) onUpload(doc.id, files[0]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`rounded-xl border bg-white p-4 transition-colors ${
        dragging
          ? "border-[var(--color-accent)] bg-[#fdf8ef]"
          : "border-[var(--color-border-light)]"
      }`}
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[var(--color-foreground)]">
            {doc.name}
          </p>
          {doc.fileName && (
            <p className="truncate text-xs text-[var(--color-foreground-subtle)]">
              {doc.fileName}
            </p>
          )}
        </div>
        {/* Only two states: Uploaded (file present) or Required (mandatory). */}
        {hasFile ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Uploaded
          </span>
        ) : mandatory ? (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
            Required
          </span>
        ) : null}
      </div>

      {hasFile ? (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-medium text-[var(--color-foreground-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-primary)] disabled:opacity-60 transition-colors"
          >
            <UploadCloud className="h-4 w-4" />
            {uploading ? "Uploading…" : "Replace file"}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => onDelete(doc.id, doc.fileName)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2.5 text-xs font-medium text-[var(--color-foreground-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-primary)] disabled:opacity-60 transition-colors"
        >
          <UploadCloud className="h-4 w-4" />
          {uploading ? "Uploading…" : "Drag & drop or click to upload"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
