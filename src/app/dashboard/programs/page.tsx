"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Search,
  GraduationCap,
  Clock,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import { fieldInputClass } from "@/components/ui/FormControls";
import type { Program, StudentProfile } from "@/lib/types";

interface Filters {
  q: string;
  country: string;
  studyLevel: string;
  intake: string;
  maxTuition: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "shortlist">("all");
  // When true, results are pre-filtered to the student's onboarding goals.
  const [matchProfile, setMatchProfile] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    q: "",
    country: "",
    studyLevel: "",
    intake: "",
    maxTuition: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/programs").then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
    ])
      .then(([progs, prof]) => {
        setPrograms(progs.programs ?? []);
        setShortlist(progs.shortlist ?? []);
        setProfile(prof.profile ?? null);
        const params = new URLSearchParams(window.location.search);
        if (params.get("tab") === "shortlist") setTab("shortlist");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (programId: string) => {
    // Optimistic update.
    setShortlist((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId],
    );
    const res = await fetch("/api/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programId }),
    });
    if (res.ok) {
      const d = await res.json();
      setShortlist(d.shortlist ?? []);
    }
  };

  const countries = useMemo(
    () => Array.from(new Set(programs.map((p) => p.country))).sort(),
    [programs],
  );
  const levels = useMemo(
    () => Array.from(new Set(programs.map((p) => p.studyLevel))).sort(),
    [programs],
  );
  const intakes = useMemo(
    () => Array.from(new Set(programs.map((p) => p.intake))).sort(),
    [programs],
  );

  // Does this program align with the student's onboarding goals?
  const matchesProfile = useMemo(() => {
    return (p: Program): boolean => {
      if (!profile) return true;
      // Destination match (profile.destinations holds country names).
      if (
        profile.destinations &&
        profile.destinations.length > 0 &&
        !profile.destinations.includes(p.country)
      )
        return false;
      // Study level match.
      if (profile.studyLevel && p.studyLevel !== profile.studyLevel)
        return false;
      // Budget: parse first number from the free-text budget field.
      if (profile.budget) {
        const budgetNum = Number(profile.budget.replace(/[^0-9]/g, ""));
        if (budgetNum > 0 && p.tuition > budgetNum) return false;
      }
      return true;
    };
  }, [profile]);

  const filtered = useMemo(() => {
    const base =
      tab === "shortlist"
        ? programs.filter((p) => shortlist.includes(p.id))
        : programs;
    return base.filter((p) => {
      // Profile-based pre-filter (only on the "all" tab).
      if (matchProfile && tab === "all" && !matchesProfile(p)) return false;
      if (
        filters.q &&
        !`${p.university} ${p.program}`
          .toLowerCase()
          .includes(filters.q.toLowerCase())
      )
        return false;
      if (filters.country && p.country !== filters.country) return false;
      if (filters.studyLevel && p.studyLevel !== filters.studyLevel)
        return false;
      if (filters.intake && p.intake !== filters.intake) return false;
      if (filters.maxTuition && p.tuition > Number(filters.maxTuition))
        return false;
      return true;
    });
  }, [programs, shortlist, tab, filters, matchProfile, matchesProfile]);

  // Do we have any goals to match against? (controls whether we show the toggle)
  const hasGoals = !!(
    profile &&
    ((profile.destinations && profile.destinations.length > 0) ||
      profile.studyLevel ||
      profile.budget)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          Explore Programs
        </h1>
        <p className="mt-1 text-[var(--color-foreground-muted)]">
          Search and filter programs, then save your favourites to your
          shortlist.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["all", "shortlist"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)]"
            }`}
          >
            {t === "all" ? "All Programs" : `My Shortlist (${shortlist.length})`}
          </button>
        ))}
      </div>

      {/* Matched-to-goals toggle (only meaningful on the All tab with goals) */}
      {tab === "all" && hasGoals && (
        <button
          type="button"
          onClick={() => setMatchProfile((m) => !m)}
          className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
            matchProfile
              ? "border-[var(--color-accent)] bg-[#fdf8ef]"
              : "border-[var(--color-border-light)] bg-white"
          }`}
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <span className="flex items-center gap-3">
            <Sparkles
              className={`h-5 w-5 ${matchProfile ? "text-[var(--color-accent-dark)]" : "text-[var(--color-foreground-subtle)]"}`}
            />
            <span>
              <span className="block text-sm font-semibold text-[var(--color-foreground)]">
                Matched to your goals
              </span>
              <span className="block text-xs text-[var(--color-foreground-muted)]">
                Showing programs that fit your preferred destinations, study
                level{profile?.budget ? ", and budget" : ""}. Tap to see all
                programs.
              </span>
            </span>
          </span>
          <span
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              matchProfile
                ? "bg-[var(--color-accent)]"
                : "bg-[var(--color-border)]"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                matchProfile ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </span>
        </button>
      )}

      {/* Filters */}
      <div
        className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 sm:grid-cols-2 lg:grid-cols-5"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="relative lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-foreground-subtle)]" />
          <input
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            placeholder="Search…"
            className={`${fieldInputClass} pl-9`}
          />
        </div>
        <select
          value={filters.country}
          onChange={(e) =>
            setFilters((f) => ({ ...f, country: e.target.value }))
          }
          className={fieldInputClass}
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={filters.studyLevel}
          onChange={(e) =>
            setFilters((f) => ({ ...f, studyLevel: e.target.value }))
          }
          className={fieldInputClass}
        >
          <option value="">All levels</option>
          {levels.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <select
          value={filters.intake}
          onChange={(e) =>
            setFilters((f) => ({ ...f, intake: e.target.value }))
          }
          className={fieldInputClass}
        >
          <option value="">All intakes</option>
          {intakes.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
        <select
          value={filters.maxTuition}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxTuition: e.target.value }))
          }
          className={fieldInputClass}
        >
          <option value="">Any tuition</option>
          <option value="10000">Under $10k</option>
          <option value="30000">Under $30k</option>
          <option value="45000">Under $45k</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-foreground-muted)]">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-sm text-[var(--color-foreground-muted)]">
          {tab === "shortlist" ? (
            "Your shortlist is empty. Tap the heart on any program to save it."
          ) : matchProfile && hasGoals ? (
            <>
              No programs match your goals with the current filters.{" "}
              <button
                type="button"
                onClick={() => setMatchProfile(false)}
                className="font-semibold text-[var(--color-accent-dark)] underline"
              >
                Show all programs
              </button>
              .
            </>
          ) : (
            "No programs match your filters."
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <ProgramCard
              key={p.id}
              program={p}
              saved={shortlist.includes(p.id)}
              onToggle={() => toggle(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProgramCard({
  program,
  saved,
  onToggle,
}: {
  program: Program;
  saved: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className="flex flex-col rounded-2xl bg-white p-5"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-background-muted)] text-2xl">
            {program.logo}
          </span>
          <div>
            <h3 className="text-sm font-semibold leading-tight text-[var(--color-foreground)]">
              {program.university}
            </h3>
            <p className="text-xs text-[var(--color-foreground-subtle)]">
              {program.flag} {program.country}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label={saved ? "Remove from shortlist" : "Save to shortlist"}
          className={`rounded-full p-2 transition-colors ${
            saved
              ? "text-red-500"
              : "text-[var(--color-foreground-subtle)] hover:text-red-500"
          }`}
        >
          <Heart className="h-5 w-5" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="mt-3 font-medium text-[var(--color-foreground)]">
        {program.program}
      </p>

      <div className="mt-3 space-y-1.5 text-xs text-[var(--color-foreground-muted)]">
        <p className="flex items-center gap-2">
          <GraduationCap className="h-3.5 w-3.5" /> {program.studyLevel}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" /> {program.duration}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5" /> Intake: {program.intake}
        </p>
        <p className="font-semibold text-[var(--color-foreground)]">
          ≈ ${program.tuition.toLocaleString()} / year
        </p>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
        {program.eligible ? (
          <span className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> Likely eligible
          </span>
        ) : (
          <span className="flex items-center gap-1 text-amber-600">
            <XCircle className="h-3.5 w-3.5" /> Check eligibility
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-lg border border-[var(--color-primary)] px-3 py-2 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
        >
          View Program
        </button>
        <button
          type="button"
          className="flex-1 rounded-lg bg-[var(--color-accent)] px-3 py-2 text-xs font-semibold text-[var(--color-primary-dark)] hover:bg-[var(--color-accent-light)] transition-colors"
        >
          I&apos;m Interested
        </button>
      </div>
    </article>
  );
}
