"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Shield,
} from "lucide-react";
import OtpVerifier from "@/components/auth/OtpVerifier";
import { trackEvent } from "@/lib/analytics";
import { useNavLoading } from "@/components/loading/NavLoadingProvider";
import {
  validateRegistration,
  hasErrors,
  checkPassword,
  passwordStrength,
  PASSWORD_RULES,
  type FieldErrors,
} from "@/lib/validation";
import { Check, X as XIcon } from "lucide-react";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { start: startNav } = useNavLoading();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | undefined>();
  const [expiresIn, setExpiresIn] = useState(60);
  const [issuedAt, setIssuedAt] = useState(0);

  const pwChecks = checkPassword(form.password);
  const pwStrength = passwordStrength(form.password);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    // Live-clear a field's error as the user fixes it (only once touched).
    if (touched[name]) {
      setFieldErrors(validateRegistration(nextForm));
    }
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setFieldErrors(validateRegistration(form));
  };

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate everything before hitting the network.
    const errors = validateRegistration(form);
    setFieldErrors(errors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
    });
    if (hasErrors(errors)) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setDevOtp(data.devOtp);
      setExpiresIn(data.expiresInSeconds ?? 60);
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
        body: JSON.stringify({ email: form.email, code, purpose: "register" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error ?? "Verification failed.");
        return;
      }
      // Conversion: registration completed (consent-gated inside trackEvent).
      trackEvent(
        "sign_up",
        { method: "email" },
        { metaStandardEvent: "CompleteRegistration" },
      );
      startNav();
      router.push(data.redirect ?? "/onboarding");
    } catch {
      setOtpError("Network error. Please try again.");
    } finally {      setSubmitting(false);
    }
  };

  const resend = async () => {
    setOtpError(null);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, purpose: "register" }),
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
              {step === "details" ? "Create your account" : "Verify your email"}
            </h2>
            <p className="mt-1.5 text-sm text-[var(--color-foreground-muted)]">
              {step === "details"
                ? "Start your study abroad journey with us"
                : "One quick step to secure your account"}
            </p>
          </div>

          {step === "details" ? (
            <form onSubmit={submitDetails} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <Field
                  id="firstName"
                  label="First name"
                  required
                  error={touched.firstName ? fieldErrors.firstName : undefined}
                  icon={<User className="w-4.5 h-4.5" />}
                >
                  <input
                    id="firstName"
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="Jane"
                    className={inputClass}
                  />
                </Field>
                <Field
                  id="lastName"
                  label="Last name"
                  required
                  error={touched.lastName ? fieldErrors.lastName : undefined}
                >
                  <input
                    id="lastName"
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder="Doe"
                    className="block w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  />
                </Field>
              </div>

              <Field
                id="email"
                label="Email address"
                required
                error={touched.email ? fieldErrors.email : undefined}
                icon={<Mail className="w-4.5 h-4.5" />}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </Field>

              <Field
                id="phone"
                label="Phone / WhatsApp number"
                required
                error={touched.phone ? fieldErrors.phone : undefined}
                icon={<Phone className="w-4.5 h-4.5" />}
              >
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
              </Field>

              <Field
                id="password"
                label="Password"
                required
                icon={<Lock className="w-4.5 h-4.5" />}
              >
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Create a strong password"
                  className="block w-full pl-11 pr-11 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]"
                  aria-describedby="password-requirements"
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
              </Field>

              {/* Live password strength meter + checklist */}
              {form.password.length > 0 && (
                <div id="password-requirements" className="-mt-2 space-y-2">
                  <div className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i < pwStrength
                            ? pwStrength <= 2
                              ? "bg-red-400"
                              : pwStrength === 3
                                ? "bg-amber-400"
                                : "bg-green-500"
                            : "bg-[var(--color-border)]"
                        }`}
                      />
                    ))}
                  </div>
                  <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {PASSWORD_RULES.map((rule) => {
                      const ok = pwChecks[rule.key];
                      return (
                        <li
                          key={rule.key}
                          className={`flex items-center gap-1.5 text-xs ${
                            ok
                              ? "text-green-600"
                              : "text-[var(--color-foreground-subtle)]"
                          }`}
                        >
                          {ok ? (
                            <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          ) : (
                            <XIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          )}
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                {submitting ? "Sending code…" : "Create account"}
              </button>

              <p className="text-center text-sm text-[var(--color-foreground-muted)]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent-dark)] underline-accent"
                >
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <OtpVerifier
              email={form.email}
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
          <Shield className="w-3.5 h-3.5" />
          <span>Your data is protected with 256-bit SSL encryption</span>
        </div>
      </div>
    </main>
  );
}

const inputClass =
  "block w-full pl-11 pr-4 py-2.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)]";

/** Small labelled field wrapper with an optional leading icon. */
function Field({
  id,
  label,
  icon,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--color-foreground)] mb-1.5"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-foreground-subtle)]">
            {icon}
          </div>
        )}
        {children}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
