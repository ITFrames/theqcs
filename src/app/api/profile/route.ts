import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { StudentProfile } from "@/lib/types";

/** GET /api/profile — current student's profile. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const profile = await db.getProfile(user.id);
  return NextResponse.json({ profile });
}

/**
 * PATCH /api/profile — merge partial onboarding data.
 * Pass `onboardingComplete: true` on the final step.
 */
export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: Partial<StudentProfile>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Only allow known profile fields; never let the client change userId.
  const {
    dateOfBirth,
    gender,
    nationality,
    currentCountry,
    city,
    whatsapp,
    highestQualification,
    institutionName,
    fieldOfStudy,
    graduationYear,
    grade,
    englishTest,
    englishScore,
    destinations,
    preferredProgram,
    studyLevel,
    preferredIntake,
    expectedStartYear,
    budget,
    fundingMethod,
    onboardingComplete,
  } = body;

  const patch: Partial<StudentProfile> = {
    dateOfBirth,
    gender,
    nationality,
    currentCountry,
    city,
    whatsapp,
    highestQualification,
    institutionName,
    fieldOfStudy,
    graduationYear,
    grade,
    englishTest,
    englishScore,
    destinations,
    preferredProgram,
    studyLevel,
    preferredIntake,
    expectedStartYear,
    budget,
    fundingMethod,
    onboardingComplete,
  };

  // Drop undefined keys so we only merge what was actually sent.
  (Object.keys(patch) as (keyof StudentProfile)[]).forEach((k) => {
    if (patch[k] === undefined) delete patch[k];
  });

  const profile = await db.updateProfile(user.id, patch);
  return NextResponse.json({ profile });
}
