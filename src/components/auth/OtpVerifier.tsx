"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";

interface OtpVerifierProps {
  email: string;
  /** Seconds until the current code expires (default 60). */
  initialSeconds?: number;
  /**
   * Timestamp (ms) of when the current code was issued. The parent bumps this
   * on every send/resend so the countdown resets even when initialSeconds is
   * unchanged. Without this, a resend that returns the same expiry (60s) would
   * not restart the timer.
   */
  issuedAt?: number;
  /** Dev-only code surfaced by the API so you can test without SMS/email. */
  devOtp?: string;
  submitting?: boolean;
  error?: string | null;
  onVerify: (code: string) => void;
  onResend: () => void;
}

/**
 * Shared 6-digit OTP entry used by register + login.
 * Shows a live 60s countdown; "Resend" is disabled until it hits zero.
 */
export default function OtpVerifier({
  email,
  initialSeconds = 60,
  issuedAt,
  devOtp,
  submitting = false,
  error,
  onVerify,
  onResend,
}: OtpVerifierProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // `seconds` is driven by a ticking effect. A fresh code (issuedAt changes on
  // every resend) resets the deadline. All time reads happen inside effects
  // (side effects), never during render, so the component stays pure.
  const deadlineRef = useRef<number>(0);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    deadlineRef.current = Date.now() + initialSeconds * 1000;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000),
      );
      setSeconds(remaining);
      return remaining;
    };
    tick();
    const id = setInterval(() => {
      if (tick() <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [initialSeconds, issuedAt, devOtp]);

  const expired = seconds <= 0;
  const code = digits.join("");

  const setDigit = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => prev.map((d, i) => (i === index ? "" : d)));
      return;
    }
    // Support paste of a full code into one box.
    if (clean.length > 1) {
      const chars = clean.slice(0, 6).split("");
      const next = ["", "", "", "", "", ""];
      chars.forEach((c, i) => (next[i] = c));
      setDigits(next);
      inputsRef.current[Math.min(chars.length, 5)]?.focus();
      return;
    }
    setDigits((prev) => prev.map((d, i) => (i === index ? clean : d)));
    if (index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-background-muted)]">
          <ShieldCheck className="h-6 w-6 text-[var(--color-primary)]" />
        </div>
        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
          Enter verification code
        </h2>
        <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-[var(--color-foreground)]">
            {email}
          </span>
        </p>
      </div>

      {devOtp && (
        <div className="rounded-lg border border-dashed border-[var(--color-accent)] bg-[#fdf8ef] px-3 py-2 text-center text-xs text-[var(--color-accent-dark)]">
          Dev mode — your code is{" "}
          <span className="font-mono font-bold tracking-widest">{devOtp}</span>
        </div>
      )}

      <div className="flex justify-center gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={i === 0 ? 6 : 1}
            value={digit}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`Digit ${i + 1}`}
            className="h-13 w-11 rounded-lg border border-[var(--color-border)] bg-white text-center text-lg font-semibold text-[var(--color-foreground)] transition-all focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none sm:h-14 sm:w-12"
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="text-center text-sm text-[var(--color-foreground-muted)]">
        {expired ? (
          <span className="text-red-600">Code expired.</span>
        ) : (
          <span>
            Code expires in{" "}
            <span className="font-semibold text-[var(--color-foreground)] tabular-nums">
              {seconds}s
            </span>
          </span>
        )}
      </div>

      <button
        type="button"
        disabled={submitting || code.length !== 6}
        onClick={() => onVerify(code)}
        className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-light)] focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Verifying…" : "Verify & Continue"}
      </button>

      <button
        type="button"
        disabled={!expired}
        onClick={() => {
          setDigits(["", "", "", "", "", ""]);
          onResend();
        }}
        className="inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-[var(--color-accent-dark)] transition-colors hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:text-[var(--color-foreground-subtle)]"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        {expired ? "Resend code" : "Resend available after expiry"}
      </button>
    </div>
  );
}
