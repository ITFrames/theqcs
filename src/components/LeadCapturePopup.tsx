"use client";

/**
 * LeadCapturePopup — an engagement funnel for browsing/idle visitors.
 *
 * Trigger: after ~25s of activity OR on exit-intent (mouse leaves toward the
 * tab bar), whichever first — but only once per session, and never if the
 * visitor previously cancelled/completed it (device-persistent).
 *
 * Steps: intent (study abroad? yes/no) -> country multi-select -> program ->
 * CTA (register / sign in). Selections persist to localStorage and are applied
 * to the student's profile after OTP-verified registration.
 *
 * Cancellable at every step; cancelling permanently dismisses it on the device.
 */

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X, GraduationCap, Check, ArrowRight, ArrowLeft } from "lucide-react";
import {
  LEAD_COUNTRIES,
  saveLeadSelections,
  dismissLead,
  completeLead,
  isLeadDismissed,
} from "@/lib/lead";

const IDLE_MS = 15_000;
// Don't interrupt these flows.
const SUPPRESSED_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/onboarding",
  "/dashboard",
];

type Step = "intent" | "countries" | "program" | "cta";

export default function LeadCapturePopup() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("intent");
  const [destinations, setDestinations] = useState<string[]>([]);
  const [program, setProgram] = useState("");
  const shownRef = useRef(false);

  const suppressed = SUPPRESSED_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (suppressed) return;
    if (isLeadDismissed()) return;
    // Once per session (in addition to the persistent dismissal).
    if (sessionStorage.getItem("qcs_lead_seen") === "1") return;

    const trigger = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      sessionStorage.setItem("qcs_lead_seen", "1");
      setOpen(true);
    };

    const idle = setTimeout(trigger, IDLE_MS);

    // Exit intent: pointer leaves through the top of the viewport.
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      clearTimeout(idle);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [suppressed]);

  if (!open || suppressed) return null;

  const toggleDestination = (code: string) =>
    setDestinations((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );

  const persist = (extra?: { program?: string }) =>
    saveLeadSelections({
      wantsToStudy: true,
      destinations,
      program: extra?.program ?? program,
    });

  // Cancel = permanent dismissal (won't show again on this device).
  const cancel = () => {
    dismissLead();
    setOpen(false);
  };

  const goRegister = () => {
    persist();
    completeLead();
    setOpen(false);
    router.push("/register");
  };

  const goLogin = () => {
    persist();
    completeLead();
    setOpen(false);
    router.push("/login");
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Study abroad interest"
      onClick={cancel}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-7"
        style={{ boxShadow: "0 24px 70px -12px rgba(30,58,95,0.4)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close / cancel */}
        <button
          type="button"
          onClick={cancel}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-foreground-subtle)] hover:bg-[var(--color-background-muted)] hover:text-[var(--color-primary)]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand mark */}
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)]">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <span className="text-sm font-bold text-gradient">QCS ABROAD</span>
        </div>

        {step === "intent" && (
          <div>
            <h2 className="text-xl font-bold text-[var(--color-foreground)]">
              Thinking about studying abroad? ✈️
            </h2>
            <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
              Answer 2 quick questions and we&apos;ll help you find the right
              destination and program.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("countries")}
                className="flex-1 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-light)] transition-colors"
              >
                Yes, I&apos;m interested
              </button>
              <button
                type="button"
                onClick={cancel}
                className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-muted)] transition-colors"
              >
                No, thanks
              </button>
            </div>
          </div>
        )}

        {step === "countries" && (
          <div>
            <h2 className="text-lg font-bold text-[var(--color-foreground)]">
              Where would you like to study?
            </h2>
            <p className="mt-1 text-xs text-[var(--color-foreground-subtle)]">
              Select all that apply.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {LEAD_COUNTRIES.map((c) => {
                const selected = destinations.includes(c.code);
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => toggleDestination(c.code)}
                    className={`relative flex items-center gap-2 rounded-xl border-2 p-3 text-left text-sm font-medium transition-all ${
                      selected
                        ? "border-[var(--color-accent)] bg-[#fdf8ef]"
                        : "border-[var(--color-border)] hover:border-[var(--color-accent-light)]"
                    }`}
                  >
                    <span className="text-xl">{c.flag}</span>
                    <span className="text-[var(--color-foreground)]">
                      {c.label}
                    </span>
                    {selected && (
                      <Check className="ml-auto h-4 w-4 text-[var(--color-accent-dark)]" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("intent")}
                className="inline-flex items-center gap-1 text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)]"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                disabled={destinations.length === 0}
                onClick={() => setStep("program")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-light)] disabled:opacity-50 transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === "program" && (
          <div>
            <h2 className="text-lg font-bold text-[var(--color-foreground)]">
              What do you want to study?
            </h2>
            <p className="mt-1 text-xs text-[var(--color-foreground-subtle)]">
              Your program or field of interest.
            </p>
            <input
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="e.g. Data Science, MBA, Nursing…"
              className="mt-4 block w-full rounded-lg border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
            />
            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("countries")}
                className="inline-flex items-center gap-1 text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)]"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  persist({ program });
                  setStep("cta");
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-light)] transition-colors"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === "cta" && (
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)]/15">
              <GraduationCap className="h-6 w-6 text-[var(--color-accent-dark)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--color-foreground)]">
              Great — let&apos;s save your preferences!
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-sm text-[var(--color-foreground-muted)]">
              Create a free account and we&apos;ll tailor university and program
              recommendations to your goals.
            </p>
            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={goRegister}
                className="w-full rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-dark)] hover:bg-[var(--color-accent-light)] transition-colors"
              >
                Create free account
              </button>
              <button
                type="button"
                onClick={goLogin}
                className="w-full rounded-lg border border-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
              >
                I already have an account
              </button>
            </div>
            <button
              type="button"
              onClick={cancel}
              className="mt-3 text-xs text-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground-muted)]"
            >
              Maybe later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
