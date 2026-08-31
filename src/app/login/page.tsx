"use client";

/**
 * QCS ABROAD - Login Page
 * Email + password -> OTP verification (2FA) -> dashboard/onboarding.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, GraduationCap, Shield } from "lucide-react";
import OtpVerifier from "@/components/auth/OtpVerifier";
import { useNavLoading } from "@/components/loading/NavLoadingProvider";

export default function LoginPage() {
  const router = useRouter();
  const { start: startNav } = useNavLoading();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | undefined>();
  const [expiresIn, setExpiresIn] = useState(300);
  const [issuedAt, setIssuedAt] = useState(0);

  const submitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sign in failed. Please try again.");
        return;
      }
      setDevOtp(data.devOtp);
      setExpiresIn(data.expiresInSeconds ?? 300);
      setIssuedAt(Date.now());
      setStep("otp");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const verify = async (code: string) => {
    setSubmitting(true);
    setOtpError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, purpose: "login" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error ?? "Verification failed.");
        return;
      }
      startNav();
      router.push(data.redirect ?? "/dashboard");
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    setOtpError(null);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "login" }),
      });
      const data = await res.json();
      if (res.ok) {
        setDevOtp(data.devOtp);
        setExpiresIn(data.expiresInSeconds ?? 300);
        setIssuedAt(Date.now());
      } else {
        setOtpError(data.error ?? "Could not resend code.");
      }
    } catch {
      setOtpError("Network error. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f0f4f8] via-[#ffffff] to-[#f8f6f0] px-4 py-12">
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
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-gradient text-2xl font-bold tracking-tight">
              QCS ABROAD
            </h1>
            <h2 className="mt-3 text-xl font-semibold text-[var(--color-foreground)]">
              {step === "credentials" ? "Welcome Back" : "Verify it's you"}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--color-foreground-muted)]">
              {step === "credentials"
                ? "Sign in to access your student dashboard"
                : "Enter the code we just sent you"}
            </p>
          </div>

          {step === "credentials" ? (
            <form onSubmit={submitCredentials} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Mail className="h-4.5 w-4.5 text-[var(--color-foreground-subtle)]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2.5 pr-4 pl-11 text-sm text-[var(--color-foreground)] transition-all duration-200 placeholder:text-[var(--color-foreground-subtle)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-4.5 w-4.5 text-[var(--color-foreground-subtle)]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2.5 pr-11 pl-11 text-sm text-[var(--color-foreground)] transition-all duration-200 placeholder:text-[var(--color-foreground-subtle)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--color-foreground-subtle)] hover:text-[var(--color-primary)]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-foreground-muted)]">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[var(--color-accent-dark)] hover:text-[var(--color-accent)]"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-primary-light)] hover:shadow-lg focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:outline-none active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Signing in…" : "Sign In"}
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-border)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 font-medium text-[var(--color-foreground-subtle)]">
                    or
                  </span>
                </div>
              </div>

              <p className="text-center text-sm text-[var(--color-foreground-muted)]">
                New student?{" "}
                <Link
                  href="/register"
                  className="underline-accent font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent-dark)]"
                >
                  Create an account
                </Link>
              </p>
            </form>
          ) : (
            <OtpVerifier
              email={email}
              initialSeconds={expiresIn}
              issuedAt={issuedAt}
              devOtp={devOtp}
              submitting={submitting}
              error={otpError}
              onVerify={verify}
              onResend={resend}
            />
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--color-foreground-subtle)]">
          <Shield className="h-3.5 w-3.5" />
          <span>Secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </main>
  );
}
