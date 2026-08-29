/**
 * QCS ABROAD — Shared domain types for the student portal.
 *
 * These types are storage-agnostic: the same shapes are used by the in-memory
 * dev store and the Supabase adapter (see `src/lib/db.ts`).
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Hashed password (never returned to the client). */
  passwordHash: string;
  emailVerified: boolean;
  createdAt: string;
}

/** User shape safe to return to the client (no secrets). */
export type PublicUser = Omit<User, "passwordHash">;

export interface OtpRecord {
  email: string;
  code: string;
  /** Epoch ms when the OTP expires (created + 60s). */
  expiresAt: number;
  /** Purpose lets us reuse the OTP flow for register + login. */
  purpose: "register" | "login";
  attempts: number;
}

export type EnglishTest = "IELTS" | "TOEFL" | "PTE" | "Duolingo" | "Not Taken Yet";

export type StudyLevel =
  | "Diploma"
  | "Bachelor's"
  | "Postgraduate Certificate"
  | "Master's"
  | "MBA"
  | "PhD"
  | "Other";

export type FundingMethod =
  | "Self-funded"
  | "Parents/Family"
  | "Education Loan"
  | "Scholarship"
  | "Not Sure";

export interface StudentProfile {
  userId: string;

  // Step 1 — Personal
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  currentCountry?: string;
  city?: string;
  whatsapp?: string;

  // Step 2 — Education
  highestQualification?: string;
  institutionName?: string;
  fieldOfStudy?: string;
  graduationYear?: string;
  grade?: string;
  englishTest?: EnglishTest;
  englishScore?: string;

  // Step 3 — Study goals
  destinations?: string[];
  preferredProgram?: string;
  studyLevel?: StudyLevel;
  preferredIntake?: string;
  expectedStartYear?: string;
  budget?: string;
  fundingMethod?: FundingMethod;

  onboardingComplete: boolean;
  updatedAt: string;
}

export type ApplicationStatus =
  | "Interested"
  | "Shortlisted"
  | "Preparing Application"
  | "Documents Required"
  | "Submitted"
  | "University Reviewing"
  | "Conditional Offer"
  | "Offer Received"
  | "Accepted"
  | "Visa Processing"
  | "Enrolled";

export interface Application {
  id: string;
  userId: string;
  university: string;
  program: string;
  country: string;
  flag: string;
  intake: string;
  applicationId: string;
  status: ApplicationStatus;
}

export type DocumentStatus =
  | "Verified"
  | "Under Review"
  | "Action Required"
  | "Not Uploaded";

export interface StudentDocument {
  id: string;
  userId: string;
  category: string;
  name: string;
  status: DocumentStatus;
  fileName?: string;
  uploadedAt?: string;
}

export interface Program {
  id: string;
  university: string;
  logo: string;
  program: string;
  country: string;
  flag: string;
  studyLevel: StudyLevel;
  duration: string;
  intake: string;
  tuition: number;
  eligible: boolean;
}

/** The 8 stages of the QCS ABROAD study journey. */
export const JOURNEY_STAGES = [
  "Profile",
  "Counselling",
  "Shortlisting",
  "Documents",
  "Application",
  "Offer",
  "Visa",
  "Ready to Travel",
] as const;

export type JourneyStage = (typeof JOURNEY_STAGES)[number];
