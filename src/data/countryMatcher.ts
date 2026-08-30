/**
 * Study Abroad Matcher — logic engine.
 *
 * A lightweight, transparent, weighted-scoring recommendation system. Each
 * answer option contributes points to one or more countries. The country with
 * the highest total is the best match; we also surface the runner-up and a
 * human-readable explanation of WHY, so students understand the reasoning
 * (not a black box).
 *
 * Country codes used throughout: CA, US, UK, AU, NZ.
 */

export type CountryCode = "CA" | "US" | "UK" | "AU" | "NZ";

export interface CountryMeta {
  code: CountryCode;
  name: string;
  flag: string;
  slug: string; // links to the /blog guide
  blurb: string;
}

export const COUNTRIES: Record<CountryCode, CountryMeta> = {
  CA: {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    slug: "study-in-canada",
    blurb:
      "Affordable, safe, and famous for clear permanent-residency pathways after study.",
  },
  US: {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    slug: "study-in-usa",
    blurb:
      "Home to the world's top-ranked universities and unmatched research and career opportunities.",
  },
  UK: {
    code: "UK",
    name: "United Kingdom",
    flag: "🇬🇧",
    slug: "study-in-uk",
    blurb:
      "Prestigious, globally respected degrees — and you finish faster with 1-year master's programs.",
  },
  AU: {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    slug: "study-in-australia",
    blurb:
      "Top universities, an outstanding quality of life, and generous post-study work rights.",
  },
  NZ: {
    code: "NZ",
    name: "New Zealand",
    flag: "🇳🇿",
    slug: "study-in-new-zealand",
    blurb:
      "Safe, welcoming, and globally respected — ideal for a balanced, high-quality experience.",
  },
};

export interface AnswerOption {
  id: string;
  label: string;
  /** points added to each country if this option is chosen */
  scores: Partial<Record<CountryCode, number>>;
  /** short reason fragment used to build the explanation */
  reason?: string;
}

export interface Question {
  id: string;
  question: string;
  helper?: string;
  options: AnswerOption[];
}

export const COUNTRY_QUESTIONS: Question[] = [
  {
    id: "priority",
    question: "What matters most in your study-abroad decision?",
    helper: "Pick the single factor that weighs heaviest for you.",
    options: [
      {
        id: "pr",
        label: "Settling abroad (PR / immigration)",
        scores: { CA: 3, AU: 2, NZ: 2, UK: 1 },
        reason: "you prioritise long-term settlement and PR pathways",
      },
      {
        id: "ranking",
        label: "Top university rankings & prestige",
        scores: { US: 3, UK: 2 },
        reason: "you want the most prestigious, highly-ranked institutions",
      },
      {
        id: "cost",
        label: "Affordability (tuition + living)",
        scores: { CA: 2, NZ: 2, UK: 1 },
        reason: "keeping overall costs manageable is important to you",
      },
      {
        id: "lifestyle",
        label: "Quality of life & experience",
        scores: { AU: 3, NZ: 3, CA: 1 },
        reason: "you value lifestyle, safety, and overall experience",
      },
    ],
  },
  {
    id: "budget",
    question: "What's your approximate annual budget (tuition + living)?",
    options: [
      {
        id: "low",
        label: "Under CAD 30,000",
        scores: { NZ: 2, CA: 2, UK: 1 },
        reason: "your budget favours more affordable destinations",
      },
      {
        id: "mid",
        label: "CAD 30,000 – 50,000",
        scores: { CA: 2, AU: 2, UK: 2, NZ: 1 },
        reason: "your budget opens up most mainstream destinations",
      },
      {
        id: "high",
        label: "Above CAD 50,000",
        scores: { US: 3, UK: 1, AU: 1 },
        reason: "your budget supports premium, higher-cost options",
      },
    ],
  },
  {
    id: "duration",
    question: "How soon do you want to finish and start working?",
    options: [
      {
        id: "fast",
        label: "As fast as possible (1-year master's)",
        scores: { UK: 3 },
        reason: "you prefer a shorter, faster route to graduation",
      },
      {
        id: "balanced",
        label: "A balanced timeline",
        scores: { AU: 2, CA: 2, NZ: 1 },
        reason: "you're comfortable with a standard program length",
      },
      {
        id: "long",
        label: "Longer is fine if it builds my career",
        scores: { US: 3, CA: 1 },
        reason: "you're willing to invest more time for career payoff",
      },
    ],
  },
  {
    id: "work",
    question: "How important are post-study work rights?",
    options: [
      {
        id: "critical",
        label: "Critical — I want maximum work time after graduating",
        scores: { CA: 3, AU: 3, NZ: 2 },
        reason: "generous post-study work rights are a top priority",
      },
      {
        id: "useful",
        label: "Useful, but not the deciding factor",
        scores: { UK: 2, CA: 1, AU: 1 },
        reason: "post-study work is a nice-to-have for you",
      },
      {
        id: "study",
        label: "I'm focused mainly on the degree itself",
        scores: { US: 2, UK: 2 },
        reason: "the academic experience matters more than work rights",
      },
    ],
  },
  {
    id: "environment",
    question: "Which environment appeals to you most?",
    options: [
      {
        id: "multicultural",
        label: "Big, multicultural cities",
        scores: { CA: 2, US: 2, UK: 2 },
        reason: "you thrive in large, diverse, urban settings",
      },
      {
        id: "balanced-life",
        label: "Relaxed lifestyle with nature & outdoors",
        scores: { AU: 2, NZ: 3 },
        reason: "you want a relaxed lifestyle close to nature",
      },
      {
        id: "historic",
        label: "Historic, academic, traditional",
        scores: { UK: 3 },
        reason: "you're drawn to heritage and academic tradition",
      },
    ],
  },
];

export interface CountryResult {
  best: CountryMeta;
  runnerUp: CountryMeta;
  /** normalized 0-100 confidence for the best match */
  confidence: number;
  reasons: string[];
  /** full ranked scores for transparency */
  ranked: { country: CountryMeta; score: number }[];
}

/**
 * Compute the recommended country from a map of questionId -> optionId.
 */
export function scoreCountries(
  answers: Record<string, string>,
): CountryResult | null {
  const totals: Record<CountryCode, number> = {
    CA: 0,
    US: 0,
    UK: 0,
    AU: 0,
    NZ: 0,
  };
  const reasons: string[] = [];

  for (const q of COUNTRY_QUESTIONS) {
    const chosenId = answers[q.id];
    if (!chosenId) continue;
    const option = q.options.find((o) => o.id === chosenId);
    if (!option) continue;
    for (const [code, pts] of Object.entries(option.scores)) {
      totals[code as CountryCode] += pts ?? 0;
    }
    if (option.reason) reasons.push(option.reason);
  }

  const ranked = (Object.keys(totals) as CountryCode[])
    .map((code) => ({ country: COUNTRIES[code], score: totals[code] }))
    .sort((a, b) => b.score - a.score);

  if (ranked[0].score === 0) return null; // no answers yet

  const topScore = ranked[0].score;
  const secondScore = ranked[1].score;
  // Confidence: how dominant the top pick is vs the field.
  const totalPoints = ranked.reduce((sum, r) => sum + r.score, 0) || 1;
  const confidence = Math.min(
    98,
    Math.round((topScore / totalPoints) * 100 + (topScore - secondScore) * 4),
  );

  return {
    best: ranked[0].country,
    runnerUp: ranked[1].country,
    confidence: Math.max(55, confidence),
    reasons,
    ranked,
  };
}
