"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  LabeledField,
  TextInput,
  SelectInput,
} from "@/components/ui/FormControls";
import { getProfileCompleteness } from "@/lib/profileCompleteness";
import type {
  EnglishTest,
  FundingMethod,
  StudentProfile,
  StudyLevel,
} from "@/lib/types";

const DESTINATIONS = [
  { code: "Canada", flag: "🇨🇦" },
  { code: "United Kingdom", flag: "🇬🇧" },
  { code: "United States", flag: "🇺🇸" },
  { code: "Australia", flag: "🇦🇺" },
  { code: "Ireland", flag: "🇮🇪" },
  { code: "New Zealand", flag: "🇳🇿" },
  { code: "Germany", flag: "🇩🇪" },
  { code: "Other", flag: "🌍" },
];
const ENGLISH_TESTS: EnglishTest[] = ["IELTS", "TOEFL", "PTE", "Duolingo", "Not Taken Yet"];
const STUDY_LEVELS: StudyLevel[] = ["Diploma", "Bachelor's", "Postgraduate Certificate", "Master's", "MBA", "PhD", "Other"];
const FUNDING_METHODS: FundingMethod[] = ["Self-funded", "Parents/Family", "Education Loan", "Scholarship", "Not Sure"];
const INTAKES = ["Spring", "Summer", "Fall", "Winter"];
const QUALIFICATIONS = ["High School", "Diploma", "Bachelor's", "Master's", "PhD"];

type Draft = Partial<StudentProfile>;

export default function ProfilePage() {
  const [data, setData] = useState<Draft>({ destinations: [], englishTests: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setData({
            ...d.profile,
            destinations: d.profile.destinations ?? [],
            englishTests: d.profile.englishTests ?? [],
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const completeness = useMemo(
    () => getProfileCompleteness(data as StudentProfile),
    [data],
  );

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setData((p) => ({ ...p, [key]: value }));
    setSaved(false);
  };

  const toggleDestination = (code: string) =>
    setData((p) => {
      const cur = p.destinations ?? [];
      setSaved(false);
      return {
        ...p,
        destinations: cur.includes(code)
          ? cur.filter((c) => c !== code)
          : [...cur, code],
      };
    });

  const toggleEnglishTest = (test: EnglishTest) =>
    setData((p) => {
      const cur = p.englishTests ?? [];
      setSaved(false);
      let next: EnglishTest[];
      if (test === "Not Taken Yet") {
        next = cur.includes("Not Taken Yet") ? [] : ["Not Taken Yet"];
      } else {
        const without = cur.filter((t) => t !== "Not Taken Yet");
        next = without.includes(test)
          ? without.filter((t) => t !== test)
          : [...without, test];
      }
      return { ...p, englishTests: next };
    });

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          // Mark onboarding complete once the required fields are present.
          onboardingComplete: getProfileCompleteness(data as StudentProfile)
            .isComplete,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Could not save your profile.");
        return;
      }
      const d = await res.json();
      if (d.profile) {
        setData({
          ...d.profile,
          destinations: d.profile.destinations ?? [],
          englishTests: d.profile.englishTests ?? [],
        });
      }
      setSaved(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-[var(--color-foreground-muted)]">Loading…</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            My Profile
          </h1>
          <p className="mt-1 text-[var(--color-foreground-muted)]">
            Keep your details up to date so we can match you with the best
            options.
          </p>
        </div>
        {completeness.isComplete ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
            <CheckCircle2 className="h-4 w-4" /> Profile complete
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <AlertTriangle className="h-4 w-4" /> Profile incomplete ·{" "}
            {completeness.percent}%
          </span>
        )}
      </div>

      {/* Personal */}
      <Section title="Personal">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LabeledField label="Date of Birth" htmlFor="dob">
            <TextInput id="dob" type="date" value={data.dateOfBirth ?? ""} onChange={(e) => set("dateOfBirth", e.target.value)} />
          </LabeledField>
          <LabeledField label="Gender" htmlFor="gender" optional>
            <SelectInput id="gender" value={data.gender ?? ""} placeholder="Prefer not to say" options={["Female", "Male", "Non-binary", "Other"]} onChange={(e) => set("gender", e.target.value)} />
          </LabeledField>
          <LabeledField label="Nationality" htmlFor="nat">
            <TextInput id="nat" value={data.nationality ?? ""} onChange={(e) => set("nationality", e.target.value)} placeholder="e.g. Indian" />
          </LabeledField>
          <LabeledField label="Current Country" htmlFor="cc">
            <TextInput id="cc" value={data.currentCountry ?? ""} onChange={(e) => set("currentCountry", e.target.value)} />
          </LabeledField>
          <LabeledField label="City" htmlFor="city">
            <TextInput id="city" value={data.city ?? ""} onChange={(e) => set("city", e.target.value)} />
          </LabeledField>
          <LabeledField label="WhatsApp Number" htmlFor="wa">
            <TextInput id="wa" type="tel" value={data.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+91 98765 43210" />
          </LabeledField>
        </div>
      </Section>

      {/* Education */}
      <Section title="Education">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LabeledField label="Highest Qualification" htmlFor="hq">
            <SelectInput id="hq" value={data.highestQualification ?? ""} placeholder="Select" options={QUALIFICATIONS} onChange={(e) => set("highestQualification", e.target.value)} />
          </LabeledField>
          <LabeledField label="Institution Name" htmlFor="inst">
            <TextInput id="inst" value={data.institutionName ?? ""} onChange={(e) => set("institutionName", e.target.value)} />
          </LabeledField>
          <LabeledField label="Field of Study" htmlFor="fos">
            <TextInput id="fos" value={data.fieldOfStudy ?? ""} onChange={(e) => set("fieldOfStudy", e.target.value)} placeholder="e.g. Computer Science" />
          </LabeledField>
          <LabeledField label="Grade / GPA / %" htmlFor="grade">
            <TextInput id="grade" value={data.grade ?? ""} onChange={(e) => set("grade", e.target.value)} />
          </LabeledField>
          <LabeledField label="Graduation Year (From)" htmlFor="gf">
            <TextInput id="gf" inputMode="numeric" value={data.graduationYearFrom ?? ""} onChange={(e) => set("graduationYearFrom", e.target.value)} placeholder="2020" />
          </LabeledField>
          <LabeledField label="Graduation Year (Till)" htmlFor="gt">
            <TextInput id="gt" inputMode="numeric" value={data.graduationYearTo ?? ""} onChange={(e) => set("graduationYearTo", e.target.value)} placeholder="2024" />
          </LabeledField>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-[var(--color-foreground)]">English language test</p>
          <div className="flex flex-wrap gap-2">
            {ENGLISH_TESTS.map((test) => {
              const selected = (data.englishTests ?? []).includes(test);
              return (
                <button key={test} type="button" onClick={() => toggleEnglishTest(test)} className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${selected ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" : "border-[var(--color-border)] bg-white text-[var(--color-foreground-muted)] hover:border-[var(--color-primary)]"}`}>
                  {test}
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Study Goals */}
      <Section title="Study Goals">
        <p className="mb-2 text-sm font-medium text-[var(--color-foreground)]">Preferred destinations</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {DESTINATIONS.map((d) => {
            const selected = (data.destinations ?? []).includes(d.code);
            return (
              <button key={d.code} type="button" onClick={() => toggleDestination(d.code)} className={`relative flex items-center gap-2 rounded-xl border-2 p-3 text-left text-sm font-medium transition-all ${selected ? "border-[var(--color-accent)] bg-[#fdf8ef]" : "border-[var(--color-border)] hover:border-[var(--color-accent-light)]"}`}>
                <span className="text-lg">{d.flag}</span>
                <span className="truncate text-[var(--color-foreground)]">{d.code}</span>
                {selected && <Check className="ml-auto h-4 w-4 shrink-0 text-[var(--color-accent-dark)]" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LabeledField label="Preferred Program / Field" htmlFor="pp">
            <TextInput id="pp" value={data.preferredProgram ?? ""} onChange={(e) => set("preferredProgram", e.target.value)} placeholder="e.g. Data Science" />
          </LabeledField>
          <LabeledField label="Study Level" htmlFor="sl">
            <SelectInput id="sl" value={data.studyLevel ?? ""} placeholder="Select" options={STUDY_LEVELS} onChange={(e) => set("studyLevel", e.target.value as StudyLevel)} />
          </LabeledField>
          <LabeledField label="Preferred Intake" htmlFor="pi">
            <SelectInput id="pi" value={data.preferredIntake ?? ""} placeholder="Select" options={INTAKES} onChange={(e) => set("preferredIntake", e.target.value)} />
          </LabeledField>
          <LabeledField label="Expected Start Year" htmlFor="sy">
            <TextInput id="sy" inputMode="numeric" value={data.expectedStartYear ?? ""} onChange={(e) => set("expectedStartYear", e.target.value)} placeholder="2026" />
          </LabeledField>
          <LabeledField label="Approximate Budget" htmlFor="budget">
            <TextInput id="budget" value={data.budget ?? ""} onChange={(e) => set("budget", e.target.value)} placeholder="e.g. $30,000 / year" />
          </LabeledField>
          <LabeledField label="Funding Method" htmlFor="fm">
            <SelectInput id="fm" value={data.fundingMethod ?? ""} placeholder="Select" options={FUNDING_METHODS} onChange={(e) => set("fundingMethod", e.target.value as FundingMethod)} />
          </LabeledField>
        </div>
      </Section>

      {/* Save bar */}
      <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border-light)] bg-white/95 p-4 backdrop-blur" style={{ boxShadow: "var(--shadow-md)" }}>
        <div className="text-sm">
          {error ? (
            <span className="text-red-600">{error}</span>
          ) : saved ? (
            <span className="inline-flex items-center gap-1.5 text-green-700">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          ) : (
            <span className="text-[var(--color-foreground-muted)]">
              {completeness.isComplete
                ? "All set — your profile is complete."
                : `${completeness.missing.length} required field${completeness.missing.length === 1 ? "" : "s"} left.`}
            </span>
          )}
        </div>
        <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-light)] disabled:opacity-60 transition-colors">
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6" style={{ boxShadow: "var(--shadow-md)" }}>
      <h2 className="mb-4 text-lg font-semibold text-[var(--color-foreground)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
