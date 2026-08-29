import Link from "next/link";
import {
  FileText,
  Heart,
  FolderOpen,
  CalendarClock,
  ArrowRight,
  Check,
} from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { computeJourney, computeNextAction } from "@/lib/journey";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  // The layout already guaranteed an authenticated, onboarded user.
  const user = (await getCurrentUser())!;
  const [profile, applications, documents, shortlist] = await Promise.all([
    db.getProfile(user.id),
    db.getApplications(user.id),
    db.getDocuments(user.id),
    db.getShortlist(user.id),
  ]);

  const journey = computeJourney(profile, applications, documents);
  const nextAction = computeNextAction(profile, documents);
  const uploadedDocs = documents.filter((d) => d.status !== "Not Uploaded").length;

  return (
    <div className="space-y-8">
      {/* Header greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] sm:text-3xl">
          {greeting()}, {user.firstName} 👋
        </h1>
        <p className="mt-1 text-[var(--color-foreground-muted)]">
          Here&apos;s what&apos;s happening with your study abroad journey.
        </p>
      </div>

      {/* Journey progress */}
      <section
        className="rounded-2xl bg-white p-6 sm:p-7"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Your Journey
            </h2>
            <p className="text-sm text-[var(--color-foreground-muted)]">
              {journey.percent}% Complete · Currently at{" "}
              <span className="font-medium text-[var(--color-primary)]">
                {journey.currentStage}
              </span>
            </p>
          </div>
          <Link
            href="/dashboard/applications"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-light)] transition-all hover:shadow-md"
          >
            Continue My Application
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[var(--color-background-muted)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-all"
            style={{ width: `${journey.percent}%` }}
          />
        </div>

        {/* Stage tracker */}
        <ol className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {journey.stages.map((s) => (
            <li key={s.name} className="flex flex-col items-center text-center">
              <span
                className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  s.state === "done"
                    ? "bg-[var(--color-accent)] text-[var(--color-primary-dark)]"
                    : s.state === "current"
                      ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/15"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-foreground-subtle)]"
                }`}
              >
                {s.state === "done" ? (
                  <Check className="h-4 w-4" />
                ) : s.state === "current" ? (
                  "●"
                ) : (
                  "○"
                )}
              </span>
              <span
                className={`text-[11px] leading-tight ${
                  s.state === "upcoming"
                    ? "text-[var(--color-foreground-subtle)]"
                    : "font-medium text-[var(--color-foreground)]"
                }`}
              >
                {s.name}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Next action — prominent */}
      <section
        className="overflow-hidden rounded-2xl border border-[var(--color-accent)]/40 bg-gradient-to-br from-[#fdf8ef] to-white p-6 sm:p-7"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-dark)]">
          Your Next Step
        </p>
        <h2 className="mt-2 text-xl font-bold text-[var(--color-foreground)]">
          {nextAction.title}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-[var(--color-foreground-muted)]">
          {nextAction.description}
        </p>
        <Link
          href={nextAction.href}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary-dark)] hover:bg-[var(--color-accent-light)] transition-all hover:shadow-md"
        >
          {nextAction.cta}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<FileText className="h-5 w-5" />}
          label="My Applications"
          value={String(applications.length)}
          cta="View Applications"
          href="/dashboard/applications"
        />
        <SummaryCard
          icon={<Heart className="h-5 w-5" />}
          label="Shortlisted Programs"
          value={String(shortlist.length)}
          cta="View Shortlist"
          href="/dashboard/programs?tab=shortlist"
        />
        <SummaryCard
          icon={<FolderOpen className="h-5 w-5" />}
          label="Documents"
          value={`${uploadedDocs} of ${documents.length} uploaded`}
          cta="Complete Documents"
          href="/dashboard/documents"
        />
        <SummaryCard
          icon={<CalendarClock className="h-5 w-5" />}
          label="Upcoming Appointment"
          value="Aug 30 · 3:00 PM"
          sub="Education Counselling"
          cta="View Appointment"
          href="/dashboard"
        />
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  cta,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  cta: string;
  href: string;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl bg-white p-5"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary)]/8 text-[var(--color-primary)]">
        {icon}
      </div>
      <p className="text-sm text-[var(--color-foreground-muted)]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[var(--color-foreground)]">
        {value}
      </p>
      {sub && (
        <p className="text-xs text-[var(--color-foreground-subtle)]">{sub}</p>
      )}
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-dark)] hover:text-[var(--color-accent)]"
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
