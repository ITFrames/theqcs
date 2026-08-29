"use client";

/**
 * StudyMatcher — an interactive, quiz-style recommendation experience on the
 * homepage. Two modes:
 *   1. Country Matcher — find the best-fit destination.
 *   2. Program Matcher — find the best-fit course/program.
 *
 * Designed to feel premium and genuinely helpful: step-by-step questions, a
 * progress bar, smooth transitions, and a transparent, explained result that
 * ties back into our country guides and consultation CTA.
 */

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import {
  COUNTRY_QUESTIONS,
  scoreCountries,
  COUNTRIES,
  type CountryResult,
} from "@/data/countryMatcher";
import {
  BACKGROUNDS,
  INTERESTS,
  GOALS,
  scorePrograms,
} from "@/data/programMatcher";
import { COUNTRIES as COUNTRY_META } from "@/data/countryMatcher";
import type { ProgramResult } from "@/data/programMatcher";
import Celebration from "@/components/Celebration";

type Mode = "country" | "program";

export default function StudyMatcher() {
  const [mode, setMode] = useState<Mode>("country");

  return (
    <section
      className="section-padding bg-white"
      aria-labelledby="matcher-heading"
      id="matcher"
    >
      <div className="container-narrow">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Free Interactive Tool
          </p>
          <h2
            id="matcher-heading"
            className="text-3xl font-bold text-primary md:text-4xl"
          >
            Find Your Perfect Fit
          </h2>
          <p className="mt-4 text-foreground-muted">
            Answer a few quick questions and get an instant, personalized
            recommendation — no other consultancy makes deciding this easy.
            Your journey, your priorities, your match.
          </p>
        </div>

        {/* Mode switcher */}
        <div className="mx-auto mt-8 flex max-w-md rounded-full bg-background-muted p-1">
          <button
            type="button"
            onClick={() => setMode("country")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              mode === "country"
                ? "bg-primary text-white shadow"
                : "text-foreground-muted hover:text-primary"
            }`}
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Which Country?
          </button>
          <button
            type="button"
            onClick={() => setMode("program")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              mode === "program"
                ? "bg-primary text-white shadow"
                : "text-foreground-muted hover:text-primary"
            }`}
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Which Program?
          </button>
        </div>

        {/* Card */}
        <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-border-light bg-white p-6 shadow-[var(--shadow-lg)] md:p-10">
          {mode === "country" ? <CountryMatcher /> : <ProgramMatcher />}
        </div>
      </div>
    </section>
  );
}

/* ============================ COUNTRY MATCHER ============================ */

function CountryMatcher() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CountryResult | null>(null);

  const total = COUNTRY_QUESTIONS.length;
  const current = COUNTRY_QUESTIONS[step];
  const progress = Math.round((step / total) * 100);

  const choose = (optionId: string) => {
    const next = { ...answers, [current.id]: optionId };
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      setResult(scoreCountries(next));
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return <CountryResultView result={result} onReset={reset} />;
  }

  return (
    <div>
      <ProgressHeader
        step={step}
        total={total}
        progress={progress}
        onBack={step > 0 ? () => setStep(step - 1) : undefined}
      />

      <h3 className="mt-6 text-xl font-bold text-primary md:text-2xl">
        {current.question}
      </h3>
      {current.helper && (
        <p className="mt-1 text-sm text-foreground-subtle">{current.helper}</p>
      )}

      <div className="mt-6 grid gap-3">
        {current.options.map((opt) => {
          const selected = answers[current.id] === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => choose(opt.id)}
              className={`group flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border-light hover:border-primary/40 hover:bg-background-alt"
              }`}
            >
              <span className="font-medium text-foreground">{opt.label}</span>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CountryResultView({
  result,
  onReset,
}: {
  result: CountryResult;
  onReset: () => void;
}) {
  const { best, runnerUp, confidence, reasons } = result;
  return (
    <div className="text-center animate-result-reveal">
      <Celebration fire={best.name} />
      <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-semibold text-accent-dark">
        <Trophy className="h-4 w-4" aria-hidden="true" />
        Your Best Match 🎉
      </div>

      <div className="mt-6 text-7xl" aria-hidden="true">
        {best.flag}
      </div>
      <h3 className="mt-3 text-3xl font-bold text-primary">
        Study in {best.name}
      </h3>
      <p className="mx-auto mt-3 max-w-lg text-foreground-muted">{best.blurb}</p>

      {/* Confidence meter */}
      <div className="mx-auto mt-6 max-w-sm">
        <div className="flex items-center justify-between text-xs font-medium text-foreground-subtle">
          <span>Match confidence</span>
          <span className="text-primary">{confidence}%</span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-background-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-all duration-700"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Reasoning */}
      {reasons.length > 0 && (
        <div className="mx-auto mt-6 max-w-lg rounded-xl bg-background-alt p-5 text-left">
          <p className="text-sm font-semibold text-primary">
            Why {best.name} fits you:
          </p>
          <ul className="mt-3 space-y-2">
            {reasons.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-foreground-muted"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span className="capitalize">{r}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-foreground-subtle">
            Runner-up: <span className="font-medium">{runnerUp.flag} {runnerUp.name}</span> — also worth considering.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href={`/blog/${best.slug}`} className="btn btn-primary px-6 py-3">
          Read the {best.name} Guide <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/contact" className="btn btn-accent px-6 py-3">
          Discuss with a Counselor
        </Link>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-subtle hover:text-primary"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Retake the quiz
      </button>
    </div>
  );
}

/* ============================ PROGRAM MATCHER ============================ */

function ProgramMatcher() {
  const steps = [
    {
      key: "background",
      question: "What did you study in your undergraduate degree?",
      options: BACKGROUNDS,
    },
    {
      key: "interest",
      question: "Which area excites you the most?",
      options: INTERESTS,
    },
    {
      key: "goal",
      question: "What's your primary goal after graduating?",
      options: GOALS,
    },
  ] as const;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ProgramResult | null>(null);

  const total = steps.length;
  const current = steps[step];
  const progress = Math.round((step / total) * 100);

  const choose = (optionId: string) => {
    const next = { ...answers, [current.key]: optionId };
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      setResult(
        scorePrograms({
          background: next.background,
          interest: next.interest,
          goal: next.goal,
        })
      );
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return <ProgramResultView result={result} onReset={reset} />;
  }

  return (
    <div>
      <ProgressHeader
        step={step}
        total={total}
        progress={progress}
        onBack={step > 0 ? () => setStep(step - 1) : undefined}
      />

      <h3 className="mt-6 text-xl font-bold text-primary md:text-2xl">
        {current.question}
      </h3>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {current.options.map((opt) => {
          const selected = answers[current.key] === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => choose(opt.id)}
              className={`group flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border-light hover:border-primary/40 hover:bg-background-alt"
              }`}
            >
              <span className="font-medium text-foreground">{opt.label}</span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProgramResultView({
  result,
  onReset,
}: {
  result: ProgramResult;
  onReset: () => void;
}) {
  const { top, alternatives, matchPercent } = result;
  return (
    <div className="animate-result-reveal">
      <Celebration fire={top.title} />
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-sm font-semibold text-accent-dark">
          <Trophy className="h-4 w-4" aria-hidden="true" />
          Recommended for You 🎉
        </div>
      </div>

      {/* Top recommendation */}
      <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-dark">
            Best Match
          </span>
          <span className="text-sm font-bold text-primary">
            {matchPercent}% fit
          </span>
        </div>
        <h3 className="mt-2 text-xl font-bold text-primary md:text-2xl">
          {top.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
          {top.why}
        </p>
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-subtle">
            Strong destinations for this field
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {top.topCountries.map((code) => (
              <Link
                key={code}
                href={`/blog/${COUNTRY_META[code].slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border-light px-3 py-1 text-sm font-medium text-primary transition-colors hover:border-primary/40"
              >
                <span aria-hidden="true">{COUNTRY_META[code].flag}</span>
                {COUNTRY_META[code].name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-primary">
            Other strong options for you:
          </p>
          <div className="mt-3 grid gap-3">
            {alternatives.map((alt) => (
              <div
                key={alt.title}
                className="rounded-xl border border-border-light p-4"
              >
                <p className="font-medium text-foreground">{alt.title}</p>
                <p className="mt-1 text-xs text-foreground-muted">{alt.why}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/contact" className="btn btn-accent px-6 py-3">
          Get a Personalized Plan <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/services" className="btn btn-outline px-6 py-3">
          Explore Our Services
        </Link>
      </div>

      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-subtle hover:text-primary"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Start over
        </button>
      </div>
    </div>
  );
}

/* ============================ SHARED ============================ */

function ProgressHeader({
  step,
  total,
  progress,
  onBack,
}: {
  step: number;
  total: number;
  progress: number;
  onBack?: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground-subtle hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
        ) : (
          <span />
        )}
        <span className="text-sm font-medium text-foreground-subtle">
          Question {step + 1} of {total}
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
