"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  UploadCloud,
  CheckCircle2,
  Trash2,
  FileText,
  ShieldCheck,
} from "lucide-react";
import type { StudentDocument, StudentProfile } from "@/lib/types";
import {
  ACCEPT_ATTR,
  MAX_UPLOAD_MB,
  validateUpload,
} from "@/lib/uploadConstraints";
import { trackEvent } from "@/lib/analytics";

/* -------------------------------------------------------------------------- */
/* Document policy                                                            */
/* -------------------------------------------------------------------------- */

const QUALIFICATION_RANK: Record<string, number> = {
  "High School": 1,
  Diploma: 2,
  "Bachelor's": 3,
  "Master's": 4,
  PhD: 5,
};

// Minimum qualification rank at which an academic document becomes relevant.
const DOC_MIN_RANK: Record<string, number> = {
  "10th Certificate": 1,
  "12th Certificate": 1,
  "Bachelor's Degree": 3,
  "Master's Degree": 4,
  Transcripts: 1,
};

// Documents every applicant must provide.
const MANDATORY_DOCS = new Set<string>([
  "Passport",
  "Photograph",
  "10th Certificate",
  "12th Certificate",
  "Transcripts",
  "IELTS / TOEFL / PTE / Duolingo",
  "Statement of Purpose",
]);

// Short, plain-language hint shown under each document name.
const DOC_HINTS: Record<string, string> = {
  Passport: "Photo page of your valid passport.",
  Photograph: "Recent passport-size photograph.",
  "10th Certificate": "Grade 10 / secondary school certificate.",
  "12th Certificate": "Grade 12 / higher secondary certificate.",
  "Bachelor's Degree": "Degree certificate or provisional certificate.",
  "Master's Degree": "Degree certificate, if applicable.",
  Transcripts: "Consolidated marksheets for your qualifications.",
  "IELTS / TOEFL / PTE / Duolingo": "Your English test scorecard.",
  "Bank Statements": "Proof of funds for tuition and living costs.",
  "Education Loan Documents": "Loan sanction letter, if applicable.",
  "Statement of Purpose": "Your SOP explaining your study goals.",
  "Resume / CV": "Your latest resume or CV.",
  "Letters of Recommendation": "Reference letters from teachers/employers.",
};

// Order + friendly descriptions for categories.
const CATEGORY_META: { key: string; description: string }[] = [
  { key: "Identity", description: "Proof of who you are." },
  { key: "Academic", description: "Your education history and results." },
  {
    key: "English Proficiency",
    description: "Your English language test scorecard.",
  },
  { key: "Financial", description: "Proof you can fund your studies." },
  {
    key: "Application",
    description: "Supporting documents for your applications.",
  },
];

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

  const isUploaded = (d: StudentDocument) =>
    !!d.fileName || d.status !== "Not Uploaded";

  // Only show documents relevant to this student's highest qualification.
  const visibleDocuments = useMemo(() => {
    const rank = profile?.highestQualification
      ? QUALIFICATION_RANK[profile.highestQualification] ?? 99
      : 99;
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
    // Order categories per CATEGORY_META; unknowns go last.
    return CATEGORY_META.map((c) => c.key)
      .concat(
        Array.from(map.keys()).filter(
          (k) => !CATEGORY_META.some((c) => c.key === k),
        ),
      )
      .filter((k) => map.has(k))
      .map((k) => [k, map.get(k)!] as const);
  }, [visibleDocuments]);

  // Progress is measured against REQUIRED documents only.
  const requiredDocs = visibleDocuments.filter((d) => MANDATORY_DOCS.has(d.name));
  const requiredUploaded = requiredDocs.filter(isUploaded).length;
  const percent = requiredDocs.length
    ? Math.round((requiredUploaded / requiredDocs.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          My Documents
        </h1>
        <p className="mt-1 text-[var(--color-foreground-muted)]">
          Upload the documents your counsellor needs to progress your
          applications. PDF only · max {MAX_UPLOAD_MB} MB each.
        </p>
      </div>

      {/* Progress summary (required documents) */}
      {!loading && requiredDocs.length > 0 && (
        <div
          className="rounded-2xl bg-white p-5"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--color-foreground)]">
              Required documents
            </span>
            <span className="text-sm text-[var(--color-foreground-muted)]">
              {requiredUploaded} of {requiredDocs.length} uploaded
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-background-muted)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-foreground-subtle)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Your documents are stored securely and shared only with the
            institutions you apply to.
          </p>
        </div>
      )}

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
      ) : grouped.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-sm text-[var(--color-foreground-muted)]">
          No documents to upload yet.
        </p>
      ) : (
        <div className="space-y-8">
          {grouped.map(([category, docs]) => {
            const meta = CATEGORY_META.find((c) => c.key === category);
            return (
              <section key={category}>
                <div className="mb-3">
                  <h2 className="text-base font-semibold text-[var(--color-foreground)]">
                    {category}
                  </h2>
                  {meta && (
                    <p className="text-xs text-[var(--color-foreground-subtle)]">
                      {meta.description}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {docs.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      doc={doc}
                      mandatory={MANDATORY_DOCS.has(doc.name)}
                      uploaded={isUploaded(doc)}
                      uploading={uploadingId === doc.id}
                      hint={DOC_HINTS[doc.name]}
                      onUpload={upload}
                      onDelete={deleteDoc}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DocumentCard({
  doc,
  mandatory,
  uploaded,
  uploading,
  hint,
  onUpload,
  onDelete,
}: {
  doc: StudentDocument;
  mandatory: boolean;
  uploaded: boolean;
  uploading: boolean;
  hint?: string;
  onUpload: (documentId: string, file: File) => void;
  onDelete: (documentId: string, fileName?: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) onUpload(doc.id, files[0]);
  };

  return (
    <div
      className="flex flex-col rounded-xl border border-[var(--color-border-light)] bg-white p-4"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              uploaded
                ? "bg-green-100 text-green-700"
                : "bg-[var(--color-background-muted)] text-[var(--color-foreground-subtle)]"
            }`}
          >
            {uploaded ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--color-foreground)]">
              {doc.name}
            </p>
            {hint && (
              <p className="text-xs text-[var(--color-foreground-subtle)]">
                {hint}
              </p>
            )}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            uploaded
              ? "bg-green-100 text-green-700"
              : mandatory
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          {uploaded ? "Uploaded" : mandatory ? "Required" : "Optional"}
        </span>
      </div>

      {/* Uploaded filename */}
      {uploaded && doc.fileName && (
        <p className="mt-3 truncate rounded-md bg-[var(--color-background-alt)] px-2.5 py-1.5 text-xs text-[var(--color-foreground-muted)]">
          {doc.fileName}
        </p>
      )}

      {/* Actions */}
      {uploaded ? (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-medium text-[var(--color-foreground-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-primary)] disabled:opacity-60 transition-colors"
          >
            <UploadCloud className="h-4 w-4" />
            {uploading ? "Uploading…" : "Replace"}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => onDelete(doc.id, doc.fileName)}
            aria-label={`Delete ${doc.name}`}
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
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-3 text-xs font-medium transition-colors disabled:opacity-60 ${
            dragging
              ? "border-[var(--color-accent)] bg-[#fdf8ef] text-[var(--color-primary)]"
              : "border-[var(--color-border)] text-[var(--color-foreground-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-primary)]"
          }`}
        >
          <UploadCloud className="h-4 w-4" />
          {uploading ? "Uploading…" : "Drag & drop or click to upload (PDF)"}
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
