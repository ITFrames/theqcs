import { Check } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { Application, ApplicationStatus } from "@/lib/types";

// Visual milestones shown on every application timeline, in order.
const TIMELINE = [
  "Shortlisted",
  "Documents",
  "Submitted",
  "University Review",
  "Offer",
  "Visa",
] as const;

// Map a granular status onto a timeline milestone index (how far along it is).
const STATUS_TO_INDEX: Record<ApplicationStatus, number> = {
  Interested: 0,
  Shortlisted: 0,
  "Preparing Application": 1,
  "Documents Required": 1,
  Submitted: 2,
  "University Reviewing": 3,
  "Conditional Offer": 4,
  "Offer Received": 4,
  Accepted: 4,
  "Visa Processing": 5,
  Enrolled: 5,
};

const STATUS_STYLE: Record<string, string> = {
  Interested: "bg-slate-100 text-slate-700",
  Shortlisted: "bg-blue-100 text-blue-700",
  "Preparing Application": "bg-amber-100 text-amber-700",
  "Documents Required": "bg-orange-100 text-orange-700",
  Submitted: "bg-indigo-100 text-indigo-700",
  "University Reviewing": "bg-purple-100 text-purple-700",
  "Conditional Offer": "bg-teal-100 text-teal-700",
  "Offer Received": "bg-green-100 text-green-700",
  Accepted: "bg-green-100 text-green-700",
  "Visa Processing": "bg-cyan-100 text-cyan-700",
  Enrolled: "bg-emerald-100 text-emerald-700",
};

export default async function ApplicationsPage() {
  const user = (await getCurrentUser())!;
  const applications = await db.getApplications(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          My Applications
        </h1>
        <p className="mt-1 text-[var(--color-foreground-muted)]">
          Track the progress of every university application in one place.
        </p>
      </div>

      {applications.length === 0 ? (
        <p className="rounded-xl bg-white p-6 text-sm text-[var(--color-foreground-muted)]">
          You don&apos;t have any applications yet. Explore programs to get
          started.
        </p>
      ) : (
        <div className="space-y-5">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ app }: { app: Application }) {
  const reached = STATUS_TO_INDEX[app.status];

  return (
    <article
      className="rounded-2xl bg-white p-6"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
            {app.university}
          </h2>
          <p className="text-sm text-[var(--color-foreground-muted)]">
            {app.program}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-foreground-subtle)]">
            <span>
              {app.flag} {app.country}
            </span>
            <span>Intake: {app.intake}</span>
            <span>ID: {app.applicationId}</span>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_STYLE[app.status] ?? "bg-slate-100 text-slate-700"
          }`}
        >
          {app.status}
        </span>
      </div>

      {/* Timeline */}
      <ol className="mt-6 flex items-center">
        {TIMELINE.map((milestone, i) => {
          const done = i < reached;
          const current = i === reached;
          return (
            <li key={milestone} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                    done
                      ? "bg-[var(--color-accent)] text-[var(--color-primary-dark)]"
                      : current
                        ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/15"
                        : "border border-[var(--color-border)] bg-white text-[var(--color-foreground-subtle)]"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : current ? "●" : "○"}
                </span>
                <span
                  className={`hidden text-[10px] leading-tight sm:block ${
                    current || done
                      ? "font-medium text-[var(--color-foreground)]"
                      : "text-[var(--color-foreground-subtle)]"
                  }`}
                >
                  {milestone}
                </span>
              </div>
              {i < TIMELINE.length - 1 && (
                <div
                  className={`mx-1.5 h-0.5 flex-1 rounded ${
                    i < reached
                      ? "bg-[var(--color-accent)]"
                      : "bg-[var(--color-border)]"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-5">
        <button
          type="button"
          className="rounded-lg border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
        >
          View Application
        </button>
      </div>
    </article>
  );
}
