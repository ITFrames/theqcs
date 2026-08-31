"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowLeft, CheckCircle2 } from "lucide-react";
import OtpVerifier from "@/components/auth/OtpVerifier";
import { isStrongPassword } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | undefined>();
  const [expiresIn, setExpiresIn] = useState(60);
  const [issuedAt, setIssuedAt] = useState(0);

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDevOtp(data.devOtp);
      setExpiresIn(data.expiresInSeconds ?? 60);
      setIssuedAt(Date.now());
      setStep("reset");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const verifyAndReset = async (code: string) => {
    setOtpError(null);
    if (!isStrongPassword(password)) {
      setOtpError(
        "Password must be 8+ characters with uppercase, lowercase, a number, and a symbol.",
      );
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error ?? "Reset failed.");
        return;
      }
      setStep("done");
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    setOtpError(null);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setDevOtp(data.devOtp);
        setExpiresIn(data.expiresInSeconds ?? 60);
        setIssuedAt(Date.now());
      } else {
        setOtpError(data.error ?? "Could not resend code.");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#f0f4f8] via-white to-[#f8f6f0]">
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl p-8 sm:p-10"
          style={{
            backgroundColor: "#ffffff",
            boxShadow:
              "0 20px 60px -12px rgba(30, 58, 95, 0.12), 0 8px 20px -8px rgba(30, 58, 95, 0.08)",
            border: "1px solid var(--color-border-light)",
          }}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-primary)] mb-4">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gradient">
              QCS ABROAD
            </h1>
            <h2 className="mt-3 text-xl font-semibold text-[var(--color-foreground)]">
              {step === "done" ? "Password reset" : "Reset your password"}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--color-foreground-muted)]">
              {step === "email" &&
                "Enter your email and we'll send you a reset code."}
              {step === "reset" &&
                "Enter the code we sent and choose a new password."}
              {step === "done" && "You're all set."}
            </p>
          </div>

          {step === "email" && (
            <form onSubmit={requestReset} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4.5 h-4.5 text-[var(--color-foreground-subtle)]" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-11 pr-4 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? "Sending…" : "Send reset code"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <div className="space-y-5">
              {/* New password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4.5 h-4.5 text-[var(--color-foreground-subtle)]" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="block w-full pl-11 pr-11 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--color-foreground-subtle)] hover:text-[var(--color-primary)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-[var(--color-foreground-subtle)]">
                  8+ characters with uppercase, lowercase, a number, and a
                  symbol.
                </p>
              </div>

              {/* OTP entry (reuses the shared verifier). "Verify" resets the password. */}
              <OtpVerifier
                email={email}
                initialSeconds={expiresIn}
                issuedAt={issuedAt}
                devOtp={devOtp}
                submitting={submitting}
                error={otpError}
                onVerify={verifyAndReset}
                onResend={resend}
              />
            </div>
          )}

          {step === "done" && (
            <div className="text-center space-y-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all"
              >
                Go to Sign In
              </button>
            </div>
          )}

          {step !== "done" && (
            <p className="mt-7 text-center text-sm text-[var(--color-foreground-muted)]">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 font-medium text-[var(--color-primary)] hover:text-[var(--color-accent-dark)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
