"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  UploadCloud,
  FileText,
} from "lucide-react";
import type { DocumentStatus, StudentDocument } from "@/lib/types";
import {
  ACCEPT_ATTR,
  MAX_UPLOAD_MB,
  validateUpload,
} from "@/lib/uploadConstraints";

const STATUS_META: Record<
  DocumentStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  Verified: {
    label: "Verified",
    className: "bg-green-100 text-green-700",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  "Under Review": {
    label: "Under Review",
    className: "bg-amber-100 text-amber-700",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  "Action Required": {
    label: "Action Required",
    className: "bg-red-100 text-red-700",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  "Not Uploaded": {
    label: "Not Uploaded",
    className: "bg-slate-100 text-slate-600",
    icon: <FileText className="h-3.5 w-3.5" />,
  },
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((d) => setDocuments(d.documents ?? []))
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
    // We only persist metadata here (name/size/type); real bytes would go to
    // storage. The server re-validates these against the same policy.
    const res = await fetch("/api/documents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      }),
    });
    if (res.ok) {
      const d = await res.json();
      setDocuments(d.documents ?? []);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Upload failed. Please try again.");
    }
  };

  const grouped = useMemo(() => {
    const map = new Map<string, StudentDocument[]>();
    for (const doc of documents) {
      map.set(doc.category, [...(map.get(doc.category) ?? []), doc]);
    }
    return Array.from(map.entries());
  }, [documents]);

  const uploaded = documents.filter((d) => d.status !== "Not Uploaded").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          My Documents
        </h1>
        <p className="mt-1 text-[var(--color-foreground-muted)]">
          {uploaded} of {documents.length} documents uploaded. Accepted format:{" "}
          PDF only · Max {MAX_UPLOAD_MB} MB each.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600" role="alert">
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
                  <DocumentRow key={doc.id} doc={doc} onUpload={upload} />
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
  onUpload,
}: {
  doc: StudentDocument;
  onUpload: (documentId: string, file: File) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = STATUS_META[doc.status];

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
        <span
          className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.className}`}
        >
          {meta.icon}
          {meta.label}
        </span>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2.5 text-xs font-medium text-[var(--color-foreground-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors"
      >
        <UploadCloud className="h-4 w-4" />
        {doc.status === "Not Uploaded"
          ? "Drag & drop or click to upload"
          : "Replace file"}
      </button>
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
