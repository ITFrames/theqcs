/**
 * Program / Course Matcher — logic engine.
 *
 * Recommends the most fitting postgraduate program pathways based on a
 * student's undergraduate background, their strongest interest, and their
 * primary career goal. Produces a ranked list of recommended fields with a
 * rationale, plus suggested destination countries known to be strong for that
 * field — tying back into the country guides.
 */

import type { CountryCode } from "./countryMatcher";

export interface BackgroundOption {
  id: string;
  label: string;
}

export const BACKGROUNDS: BackgroundOption[] = [
  { id: "engineering", label: "Engineering / Technology" },
  { id: "cs", label: "Computer Science / IT" },
  { id: "commerce", label: "Commerce / Business / Finance" },
  { id: "science", label: "Pure Sciences (Physics, Chem, Bio)" },
  { id: "arts", label: "Arts / Humanities / Social Sciences" },
  { id: "health", label: "Health / Life Sciences / Nursing" },
  { id: "design", label: "Design / Media / Architecture" },
  { id: "other", label: "Other / Still deciding" },
];

export interface InterestOption {
  id: string;
  label: string;
}

export const INTERESTS: InterestOption[] = [
  { id: "data", label: "Data, AI & Analytics" },
  { id: "software", label: "Software & Product" },
  { id: "management", label: "Management & Strategy" },
  { id: "finance", label: "Finance & Investment" },
  { id: "research", label: "Research & Innovation" },
  { id: "healthcare", label: "Healthcare & Wellbeing" },
  { id: "creative", label: "Creative & Design" },
  { id: "sustainability", label: "Sustainability & Environment" },
];

export interface GoalOption {
  id: string;
  label: string;
}

export const GOALS: GoalOption[] = [
  { id: "highpay", label: "High-paying global career" },
  { id: "pr", label: "Work abroad & settle (PR)" },
  { id: "research", label: "Research / academia / PhD" },
  { id: "entrepreneur", label: "Start my own venture" },
];

export interface ProgramRecommendation {
  title: string;
  why: string;
  /** in-demand & strong destinations for this field */
  topCountries: CountryCode[];
  /** matching tags used by the engine */
  tags: {
    backgrounds: string[];
    interests: string[];
    goals: string[];
  };
}

/**
 * The catalogue of program pathways the matcher can recommend. The engine
 * scores each against the student's inputs and returns the best fits.
 */
export const PROGRAMS: ProgramRecommendation[] = [
  {
    title: "Master's in Data Science / Artificial Intelligence",
    why: "One of the fastest-growing, highest-paid fields worldwide, with demand far outstripping supply. A strong quantitative undergrad plus a data interest makes you an excellent fit.",
    topCountries: ["US", "CA", "AU"],
    tags: {
      backgrounds: ["engineering", "cs", "science", "commerce"],
      interests: ["data", "research", "software"],
      goals: ["highpay", "pr", "research"],
    },
  },
  {
    title: "Master's in Computer Science / Software Engineering",
    why: "A versatile, globally portable degree that leads to strong salaries and clear immigration pathways — especially valuable if you enjoy building software and systems.",
    topCountries: ["US", "CA", "AU"],
    tags: {
      backgrounds: ["cs", "engineering"],
      interests: ["software", "data"],
      goals: ["highpay", "pr", "entrepreneur"],
    },
  },
  {
    title: "MBA / Master's in Management",
    why: "Ideal for accelerating into leadership roles. Pairs well with a business or technical undergrad and a management-focused career goal.",
    topCountries: ["US", "UK", "CA"],
    tags: {
      backgrounds: ["commerce", "engineering", "arts", "other"],
      interests: ["management", "finance"],
      goals: ["highpay", "entrepreneur"],
    },
  },
  {
    title: "Master's in Finance / Financial Engineering",
    why: "Highly rewarding for numerically-strong students targeting banking, investment, or fintech. Global financial hubs offer the best networks and outcomes.",
    topCountries: ["UK", "US"],
    tags: {
      backgrounds: ["commerce", "engineering", "science"],
      interests: ["finance", "data"],
      goals: ["highpay"],
    },
  },
  {
    title: "Master's in Public Health / Health Sciences",
    why: "A meaningful, in-demand field with strong post-study work and migration prospects, especially suited to health/life-science backgrounds.",
    topCountries: ["AU", "CA", "UK"],
    tags: {
      backgrounds: ["health", "science"],
      interests: ["healthcare", "research"],
      goals: ["pr", "research", "highpay"],
    },
  },
  {
    title: "Master's in Environmental Science / Sustainability",
    why: "A future-focused field aligned with global climate priorities — a great match if you care about sustainability and want purpose-driven work.",
    topCountries: ["NZ", "AU", "UK"],
    tags: {
      backgrounds: ["science", "engineering", "arts"],
      interests: ["sustainability", "research"],
      goals: ["research", "pr"],
    },
  },
  {
    title: "Master's in Design / UX / Digital Media",
    why: "Perfect for creative minds who want to shape products and experiences. Combines strong career prospects with creative fulfilment.",
    topCountries: ["UK", "US", "AU"],
    tags: {
      backgrounds: ["design", "arts", "cs"],
      interests: ["creative", "software"],
      goals: ["highpay", "entrepreneur"],
    },
  },
  {
    title: "Research Master's / PhD Pathway",
    why: "The right route if you're driven by discovery and aim for academia or R&D. Research-intensive systems offer funding and supervision to match.",
    topCountries: ["US", "UK", "AU"],
    tags: {
      backgrounds: ["science", "engineering", "cs", "health", "arts"],
      interests: ["research"],
      goals: ["research"],
    },
  },
];

export interface ProgramResult {
  top: ProgramRecommendation;
  alternatives: ProgramRecommendation[];
  matchPercent: number;
}

export function scorePrograms(input: {
  background: string;
  interest: string;
  goal: string;
}): ProgramResult | null {
  if (!input.background || !input.interest || !input.goal) return null;

  const scored = PROGRAMS.map((program) => {
    let score = 0;
    if (program.tags.backgrounds.includes(input.background)) score += 3;
    if (program.tags.interests.includes(input.interest)) score += 4;
    if (program.tags.goals.includes(input.goal)) score += 3;
    return { program, score };
  }).sort((a, b) => b.score - a.score);

  if (scored[0].score === 0) {
    // Nothing matched strongly — fall back to a broadly useful default.
    return {
      top: PROGRAMS[2], // MBA / Management is the safest generalist pick
      alternatives: [PROGRAMS[0], PROGRAMS[1]],
      matchPercent: 60,
    };
  }

  const maxPossible = 10; // 3 + 4 + 3
  const matchPercent = Math.round((scored[0].score / maxPossible) * 100);

  return {
    top: scored[0].program,
    alternatives: scored.slice(1, 3).map((s) => s.program),
    matchPercent: Math.max(60, matchPercent),
  };
}
