/**
 * Profile completeness — determines whether a student's profile has the core
 * fields filled in, used to show a "Profile incomplete" badge and nudge them
 * to finish. This is intentionally lenient: a handful of essentials across the
 * three onboarding areas, not every optional field.
 */

import type { StudentProfile } from "./types";

export interface ProfileCompleteness {
  isComplete: boolean;
  /** 0–100 percentage of required fields filled. */
  percent: number;
  /** Human labels of the required fields still missing. */
  missing: string[];
}

const REQUIRED: { key: keyof StudentProfile; label: string }[] = [
  { key: "dateOfBirth", label: "Date of birth" },
  { key: "nationality", label: "Nationality" },
  { key: "currentCountry", label: "Current country" },
  { key: "whatsapp", label: "WhatsApp number" },
  { key: "highestQualification", label: "Highest qualification" },
  { key: "fieldOfStudy", label: "Field of study" },
  { key: "destinations", label: "Preferred destinations" },
  { key: "studyLevel", label: "Study level" },
];

function isFilled(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function getProfileCompleteness(
  profile: StudentProfile | undefined | null,
): ProfileCompleteness {
  if (!profile) {
    return {
      isComplete: false,
      percent: 0,
      missing: REQUIRED.map((r) => r.label),
    };
  }
  const missing = REQUIRED.filter(
    (r) => !isFilled(profile[r.key]),
  ).map((r) => r.label);
  const filled = REQUIRED.length - missing.length;
  return {
    isComplete: missing.length === 0,
    percent: Math.round((filled / REQUIRED.length) * 100),
    missing,
  };
}
