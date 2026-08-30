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
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Only allow known profile fields; never let the client change userId.
  // Allow-list of profile fields a client may set (never userId/timestamps).
  const ALLOWED_FIELDS: (keyof StudentProfile)[] = [
    // Personal
    "dateOfBirth",
    "gender",
    "nationality",
    "currentCountry",
    "city",
    "whatsapp",
    // Education
    "highestQualification",
    "institutionName",
    "fieldOfStudy",
    "graduationYear",
    "graduationYearFrom",
    "graduationYearTo",
    "grade",
    "englishTest",
    "englishScore",
    "englishTests",
    "englishScores",
    "hasMasters",
    "mastersInstitution",
    "mastersField",
    "mastersGraduationYear",
    "mastersGrade",
    // Study goals
    "destinations",
    "preferredProgram",
    "studyLevel",
    "preferredIntake",
    "expectedStartYear",
    "budget",
    "fundingMethod",
    // Meta
    "onboardingComplete",
  ];

  const patch: Partial<StudentProfile> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) {
      // Safe: key is from our allow-list and body is Partial<StudentProfile>.
      (patch as Record<string, unknown>)[key] = body[key];
    }
  }

  const profile = await db.updateProfile(user.id, patch);
  return NextResponse.json({ profile });
}
