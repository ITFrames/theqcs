import { JOURNEY_STAGES, type JourneyStage } from "./types";
import type { Application, StudentDocument, StudentProfile } from "./types";

export interface JourneyState {
  stages: { name: JourneyStage; state: "done" | "current" | "upcoming" }[];
  currentStage: JourneyStage;
  percent: number;
}

/**
 * Derives the student's position in the 8-stage journey from their profile,
 * applications, and documents. This is deliberately simple + deterministic so
 * the dashboard always reflects real data.
 */
export function computeJourney(
  profile: StudentProfile | undefined,
  applications: Application[],
  documents: StudentDocument[],
): JourneyState {
  let reached = 0; // index of the furthest reached stage

  // Profile
  if (profile) reached = 0;
  // Counselling — assume it begins once onboarding is complete
  if (profile?.onboardingComplete) reached = 1;
  // Shortlisting — has at least one application/interest
  if (applications.length > 0) reached = 2;
  // Documents — at least one document uploaded/verified
  if (documents.some((d) => d.status !== "Not Uploaded")) reached = 3;
  // Application — something submitted or beyond
  const submittedStatuses = new Set([
    "Submitted",
    "University Reviewing",
    "Conditional Offer",
    "Offer Received",
    "Accepted",
    "Visa Processing",
    "Enrolled",
  ]);
  if (applications.some((a) => submittedStatuses.has(a.status))) reached = 4;
  // Offer
  const offerStatuses = new Set([
    "Conditional Offer",
    "Offer Received",
    "Accepted",
    "Visa Processing",
    "Enrolled",
  ]);
  if (applications.some((a) => offerStatuses.has(a.status))) reached = 5;
  // Visa
  if (applications.some((a) => a.status === "Visa Processing")) reached = 6;
  // Ready to travel
  if (applications.some((a) => a.status === "Enrolled")) reached = 7;

  const stages = JOURNEY_STAGES.map((name, i) => ({
    name,
    state:
      i < reached
        ? ("done" as const)
        : i === reached
          ? ("current" as const)
          : ("upcoming" as const),
  }));

  // Percent: completed stages / total, with the current stage counting as half.
  const percent = Math.round(((reached + 0.5) / JOURNEY_STAGES.length) * 100);

  return { stages, currentStage: JOURNEY_STAGES[reached], percent };
}

/** Chooses the single most important next action for the student. */
export function computeNextAction(
  profile: StudentProfile | undefined,
  documents: StudentDocument[],
): { title: string; description: string; cta: string; href: string } {
  if (!profile?.onboardingComplete) {
    return {
      title: "Complete your profile",
      description:
        "Finish the quick onboarding so your counsellor can recommend the best-fit universities.",
      cta: "Continue Onboarding",
      href: "/onboarding",
    };
  }

  const actionNeeded = documents.find((d) => d.status === "Action Required");
  if (actionNeeded) {
    return {
      title: `Upload your ${actionNeeded.name.toLowerCase()}`,
      description:
        "We need this document before your counsellor can proceed with university applications.",
      cta: "Upload Document",
      href: "/dashboard/documents",
    };
  }

  const missing = documents.find((d) => d.status === "Not Uploaded");
  if (missing) {
    return {
      title: `Upload your ${missing.name.toLowerCase()}`,
      description:
        "A few documents are still pending. Completing them keeps your applications on track.",
      cta: "Complete Documents",
      href: "/dashboard/documents",
    };
  }

  return {
    title: "Explore recommended programs",
    description:
      "Your documents are in good shape. Browse programs and shortlist your favourites.",
    cta: "Explore Programs",
    href: "/dashboard/programs",
  };
}
