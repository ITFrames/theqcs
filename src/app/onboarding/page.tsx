"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  LabeledField,
  SelectInput,
  TextInput,
} from "@/components/ui/FormControls";
import type {
  EnglishTest,
  FundingMethod,
  StudentProfile,
  StudyLevel,
} from "@/lib/types";

const STEPS = ["Personal", "Education", "Study Goals", "Complete"] as const;

const DESTINATIONS = [
  { code: "Canada", flag: "🇨🇦", label: "Canada" },
  { code: "United Kingdom", flag: "🇬🇧", label: "United Kingdom" },
  { code: "United States", flag: "🇺🇸", label: "United States" },
  { code: "Australia", flag: "🇦🇺", label: "Australia" },
  { code: "Ireland", flag: "🇮🇪", label: "Ireland" },
  { code: "New Zealand", flag: "🇳🇿", label: "New Zealand" },
  { code: "Germany", flag: "🇩🇪", label: "Germany" },
  { code: "Other", flag: "🌍", label: "Other" },
];

const ENGLISH_TESTS: EnglishTest[] = [
  "IELTS",
  "TOEFL",
  "PTE",
  "Duolingo",
  "Not Taken Yet",
];

const STUDY_LEVELS: StudyLevel[] = [
  "Diploma",
  "Bachelor's",
  "Postgraduate Certificate",
  "Master's",
  "MBA",
  "PhD",
  "Other",
];

const FUNDING_METHODS: FundingMethod[] = [
  "Self-funded",
  "Parents/Family",
  "Education Loan",
  "Scholarship",
  "Not Sure",
];

const INTAKES = ["Spring", "Summer", "Fall", "Winter"];

type Draft = Partial<StudentProfile>;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Draft>({
    englishTest: "Not Taken Yet",
    destinations: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const toggleDestination = (code: string) =>
    setData((prev) => {
      const current = prev.destinations ?? [];
      return {
        ...prev,
        destinations: current.includes(code)
          ? current.filter((c) => c !== code)
          : [...current, code],
      };
    });

  const saveStep = async (patch: Draft) => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error("save failed");
  };

  const next = async () => {
    setError(null);
    setSaving(true);
    try {
      await saveStep(data);
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    } catch {
      setError("Could not save your progress. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const finish = async () => {
    setError(null);
    setSaving(true);
    try {
      await saveStep({ ...data, onboardingComplete: true });
      router.push("/dashboard");
    } catch {
      setError("Could not complete onboarding. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] via-white to-[#f8f6f0] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Progress indicator */}
        <ol className="mb-8 flex items-center">
          {STEPS.map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                      done
                        ? "bg-[var(--color-accent)] text-[var(--color-primary-dark)]"
                        : current
                          ? "bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/15"
                          : "bg-white text-[var(--color-foreground-subtle)] border border-[var(--color-border)]"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span
                    className={`hidden text-xs font-medium sm:block ${
                      current
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-foreground-subtle)]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 rounded ${
                      i < step
                        ? "bg-[var(--color-accent)]"
                        : "bg-[var(--color-border)]"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div
          className="rounded-2xl bg-white p-6 sm:p-8"
          style={{
            boxShadow:
              "0 20px 60px -12px rgba(30, 58, 95, 0.12), 0 8px 20px -8px rgba(30, 58, 95, 0.08)",
            border: "1px solid var(--color-border-light)",
          }}
        >
          {step === 0 && (
            <StepShell
              title="About You"
              subtitle="Tell us a little about yourself."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <LabeledField label="Date of Birth" htmlFor="dob">
                  <TextInput
                    id="dob"
                    type="date"
                    value={data.dateOfBirth ?? ""}
                    onChange={(e) => set("dateOfBirth", e.target.value)}
                  />
                </LabeledField>
                <LabeledField label="Gender" htmlFor="gender" optional>
                  <SelectInput
                    id="gender"
                    value={data.gender ?? ""}
                    placeholder="Prefer not to say"
                    options={["Female", "Male", "Non-binary", "Other"]}
                    onChange={(e) => set("gender", e.target.value)}
                  />
                </LabeledField>
                <LabeledField label="Nationality" htmlFor="nationality">
                  <TextInput
                    id="nationality"
                    value={data.nationality ?? ""}
                    onChange={(e) => set("nationality", e.target.value)}
                    placeholder="e.g. Indian"
                  />
                </LabeledField>
                <LabeledField label="Current Country" htmlFor="currentCountry">
                  <TextInput
                    id="currentCountry"
                    value={data.currentCountry ?? ""}
                    onChange={(e) => set("currentCountry", e.target.value)}
                    placeholder="e.g. India"
                  />
                </LabeledField>
                <LabeledField label="City" htmlFor="city">
                  <TextInput
                    id="city"
                    value={data.city ?? ""}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="e.g. Hyderabad"
                  />
                </LabeledField>
                <LabeledField label="WhatsApp Number" htmlFor="whatsapp">
                  <TextInput
                    id="whatsapp"
                    type="tel"
                    value={data.whatsapp ?? ""}
                    onChange={(e) => set("whatsapp", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </LabeledField>
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell
              title="Education"
              subtitle="Your academic background helps us match the right programs."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <LabeledField
                  label="Highest Qualification"
                  htmlFor="qualification"
                >
                  <SelectInput
                    id="qualification"
                    value={data.highestQualification ?? ""}
                    placeholder="Select"
                    options={[
                      "High School",
                      "Diploma",
                      "Bachelor's",
                      "Master's",
                      "PhD",
                    ]}
                    onChange={(e) =>
                      set("highestQualification", e.target.value)
                    }
                  />
                </LabeledField>
                <LabeledField label="Institution Name" htmlFor="institution">
                  <TextInput
                    id="institution"
                    value={data.institutionName ?? ""}
                    onChange={(e) => set("institutionName", e.target.value)}
                  />
                </LabeledField>
                <LabeledField label="Field of Study" htmlFor="field">
                  <TextInput
                    id="field"
                    value={data.fieldOfStudy ?? ""}
                    onChange={(e) => set("fieldOfStudy", e.target.value)}
                    placeholder="e.g. Computer Science"
                  />
                </LabeledField>
                <LabeledField label="Graduation Year" htmlFor="gradYear">
                  <TextInput
                    id="gradYear"
                    inputMode="numeric"
                    value={data.graduationYear ?? ""}
                    onChange={(e) => set("graduationYear", e.target.value)}
                    placeholder="2024"
                  />
                </LabeledField>
                <LabeledField
                  label="Grade / GPA / Percentage"
                  htmlFor="grade"
                >
                  <TextInput
                    id="grade"
                    value={data.grade ?? ""}
                    onChange={(e) => set("grade", e.target.value)}
                    placeholder="e.g. 8.2 CGPA / 82%"
                  />
                </LabeledField>
              </div>

              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-[var(--color-foreground)]">
                  English language test
                </p>
                <div className="flex flex-wrap gap-2">
                  {ENGLISH_TESTS.map((test) => (
                    <button
                      key={test}
                      type="button"
                      onClick={() => set("englishTest", test)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                        data.englishTest === test
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                          : "border-[var(--color-border)] bg-white text-[var(--color-foreground-muted)] hover:border-[var(--color-primary)]"
                      }`}
                    >
                      {test}
                    </button>
                  ))}
                </div>

                {data.englishTest && data.englishTest !== "Not Taken Yet" && (
                  <div className="mt-4">
                    <LabeledField
                      label={`${data.englishTest} Score`}
                      htmlFor="englishScore"
                    >
                      <TextInput
                        id="englishScore"
                        value={data.englishScore ?? ""}
                        onChange={(e) => set("englishScore", e.target.value)}
                        placeholder="e.g. 7.5"
                      />
                    </LabeledField>
                  </div>
                )}
              </div>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell
              title="Study Abroad Goals"
              subtitle="Where would you like to study? Select all that apply."
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {DESTINATIONS.map((d) => {
                  const selected = (data.destinations ?? []).includes(d.code);
                  return (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => toggleDestination(d.code)}
                      className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        selected
                          ? "border-[var(--color-accent)] bg-[#fdf8ef] shadow-md"
                          : "border-[var(--color-border)] bg-white hover:border-[var(--color-accent-light)] hover:shadow-sm"
                      }`}
                    >
                      {selected && (
                        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary-dark)]">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                      <span className="text-3xl">{d.flag}</span>
                      <span className="text-center text-xs font-medium text-[var(--color-foreground)]">
                        {d.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <LabeledField
                  label="Preferred Program / Field"
                  htmlFor="prefProgram"
                >
                  <TextInput
                    id="prefProgram"
                    value={data.preferredProgram ?? ""}
                    onChange={(e) => set("preferredProgram", e.target.value)}
                    placeholder="e.g. Data Science"
                  />
                </LabeledField>
                <LabeledField label="Study Level" htmlFor="studyLevel">
                  <SelectInput
                    id="studyLevel"
                    value={data.studyLevel ?? ""}
                    placeholder="Select"
                    options={STUDY_LEVELS}
                    onChange={(e) =>
                      set("studyLevel", e.target.value as StudyLevel)
                    }
                  />
                </LabeledField>
                <LabeledField label="Preferred Intake" htmlFor="intake">
                  <SelectInput
                    id="intake"
                    value={data.preferredIntake ?? ""}
                    placeholder="Select"
                    options={INTAKES}
                    onChange={(e) => set("preferredIntake", e.target.value)}
                  />
                </LabeledField>
                <LabeledField
                  label="Expected Start Year"
                  htmlFor="startYear"
                >
                  <TextInput
                    id="startYear"
                    inputMode="numeric"
                    value={data.expectedStartYear ?? ""}
                    onChange={(e) => set("expectedStartYear", e.target.value)}
                    placeholder="2026"
                  />
                </LabeledField>
                <LabeledField label="Approximate Budget" htmlFor="budget">
                  <TextInput
                    id="budget"
                    value={data.budget ?? ""}
                    onChange={(e) => set("budget", e.target.value)}
                    placeholder="e.g. $30,000 / year"
                  />
                </LabeledField>
                <LabeledField label="Funding Method" htmlFor="funding">
                  <SelectInput
                    id="funding"
                    value={data.fundingMethod ?? ""}
                    placeholder="Select"
                    options={FUNDING_METHODS}
                    onChange={(e) =>
                      set("fundingMethod", e.target.value as FundingMethod)
                    }
                  />
                </LabeledField>
              </div>
            </StepShell>
          )}

          {step === 3 && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/15">
                <Sparkles className="h-8 w-8 text-[var(--color-accent-dark)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
                You&apos;re all set! 🎉
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-foreground-muted)]">
                Thanks for sharing your goals. We&apos;ll use this to find study
                options tailored to you. You can update these details anytime
                from your dashboard.
              </p>
            </div>
          )}

          {error && (
            <p className="mt-5 text-center text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || saving}
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] disabled:opacity-0 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-light)] disabled:opacity-60 transition-all hover:shadow-lg"
              >
                {saving ? "Saving…" : "Continue"}
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-primary-dark)] hover:bg-[var(--color-accent-light)] disabled:opacity-60 transition-all hover:shadow-lg"
              >
                {saving ? "Finishing…" : "Find My Study Options"}
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-foreground)]">
        {title}
      </h2>
      <p className="mt-1 mb-6 text-sm text-[var(--color-foreground-muted)]">
        {subtitle}
      </p>
      {children}
    </div>
  );
}
