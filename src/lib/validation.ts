/**
 * Shared validation used by both the client (register form) and the server
 * (API routes), so the rules can never drift apart.
 *
 * SECURITY NOTE ON PASSWORDS:
 * Passwords are NEVER stored "encoded" (reversible). They are one-way HASHED
 * with scrypt + a per-user random salt (see src/lib/db.ts). On login we
 * re-derive the hash from the submitted password and compare it in constant
 * time. This is the industry-standard approach — a reversible encode/decode
 * scheme would be insecure because anyone with database access could recover
 * the plaintext.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** E.164-ish: optional +, 7–15 digits, allowing spaces/dashes/parens in input. */
export const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

export interface PasswordCheck {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

export const PASSWORD_RULES: { key: keyof PasswordCheck; label: string }[] = [
  { key: "minLength", label: "At least 8 characters" },
  { key: "hasUpper", label: "An uppercase letter (A–Z)" },
  { key: "hasLower", label: "A lowercase letter (a–z)" },
  { key: "hasNumber", label: "A number (0–9)" },
  { key: "hasSymbol", label: "A symbol (!@#$…)" },
];

export function checkPassword(password: string): PasswordCheck {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };
}

/** A password is strong only when every rule passes. */
export function isStrongPassword(password: string): boolean {
  const c = checkPassword(password);
  return c.minLength && c.hasUpper && c.hasLower && c.hasNumber && c.hasSymbol;
}

/** 0–4 strength score for the meter (min-length is a gate, not a point). */
export function passwordStrength(password: string): number {
  const c = checkPassword(password);
  return (
    (c.hasUpper ? 1 : 0) +
    (c.hasLower ? 1 : 0) +
    (c.hasNumber ? 1 : 0) +
    (c.hasSymbol ? 1 : 0)
  );
}

export interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

/** Validate the full registration payload. Returns per-field errors. */
export function validateRegistration(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  if (!input.firstName.trim()) {
    errors.firstName = "First name is required.";
  } else if (input.firstName.trim().length < 2) {
    errors.firstName = "First name looks too short.";
  }

  if (!input.lastName.trim()) {
    errors.lastName = "Last name is required.";
  } else if (input.lastName.trim().length < 2) {
    errors.lastName = "Last name looks too short.";
  }

  if (!input.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(input.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!input.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_RE.test(input.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!input.password) {
    errors.password = "Password is required.";
  } else if (!isStrongPassword(input.password)) {
    errors.password =
      "Password must be 8+ characters and include uppercase, lowercase, a number, and a symbol.";
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
