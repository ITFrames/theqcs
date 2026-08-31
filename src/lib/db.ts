/**
 * QCS ABROAD — Data access layer.
 *
 * Storage-agnostic API used by all route handlers. By default it uses an
 * in-memory store so the app runs locally with zero configuration. When
 * Supabase env vars are present, swap the implementation of `getStore()`
 * for a Supabase-backed one (the SQL schema lives in `supabase/schema.sql`).
 *
 * NOTE: the in-memory store resets whenever the dev server restarts. That is
 * expected for local development. Configure Supabase (or another Postgres) for
 * durable storage — see `.env.example`.
 */

import { randomUUID, randomInt } from "node:crypto";
import type {
  Application,
  OtpRecord,
  Program,
  StudentDocument,
  StudentProfile,
  User,
} from "./types";
import { hashPassword, verifyPassword } from "./password";
import { seedApplications, seedDocuments } from "./seed";

// Re-export so existing imports (`import { verifyPassword } from "@/lib/db"`)
// keep working unchanged.
export { hashPassword, verifyPassword };

/* -------------------------------------------------------------------------- */
/* OTP                                                                        */
/* -------------------------------------------------------------------------- */

export const OTP_TTL_MS = 60_000; // 60 second expiry, per requirements.

export function generateOtpCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/* -------------------------------------------------------------------------- */
/* In-memory store                                                            */
/* -------------------------------------------------------------------------- */

interface Store {
  users: Map<string, User>; // key: email (lowercased)
  otps: Map<string, OtpRecord>; // key: `${purpose}:${email}`
  profiles: Map<string, StudentProfile>; // key: userId
  applications: Map<string, Application[]>; // key: userId
  documents: Map<string, StudentDocument[]>; // key: userId
  shortlist: Map<string, Set<string>>; // key: userId -> program ids
  sessions: Map<string, string>; // key: token -> userId
  suppressions: Set<string>; // hard-bounced / complained emails (lowercased)
}

// Persist across HMR reloads in dev by hanging the store off globalThis.
const globalForStore = globalThis as unknown as { __qcsStore?: Store };

function createStore(): Store {
  return {
    users: new Map(),
    otps: new Map(),
    profiles: new Map(),
    applications: new Map(),
    documents: new Map(),
    shortlist: new Map(),
    sessions: new Map(),
    suppressions: new Set(),
  };
}

function getStore(): Store {
  if (!globalForStore.__qcsStore) {
    globalForStore.__qcsStore = createStore();
  }
  return globalForStore.__qcsStore;
}

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

/* -------------------------------------------------------------------------- */
/* Users                                                                      */
/* -------------------------------------------------------------------------- */

const memoryStore = {
  async findUserByEmail(email: string): Promise<User | undefined> {
    return getStore().users.get(email.toLowerCase());
  },

  async createUser(input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<User> {
    const store = getStore();
    const email = input.email.toLowerCase();
    const user: User = {
      id: randomUUID(),
      firstName: input.firstName,
      lastName: input.lastName,
      email,
      phone: input.phone,
      passwordHash: hashPassword(input.password),
      emailVerified: false,
      createdAt: new Date().toISOString(),
    };
    store.users.set(email, user);
    store.profiles.set(user.id, {
      userId: user.id,
      onboardingComplete: false,
      updatedAt: new Date().toISOString(),
    });
    return user;
  },

  async markEmailVerified(email: string): Promise<void> {
    const store = getStore();
    const user = store.users.get(email.toLowerCase());
    if (user) user.emailVerified = true;
  },

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const store = getStore();
    const user = store.users.get(email.toLowerCase());
    if (user) user.passwordHash = hashPassword(newPassword);
  },

  /* ---------------------------------------------------------------------- */
  /* OTP                                                                    */
  /* ---------------------------------------------------------------------- */

  async saveOtp(rec: OtpRecord): Promise<void> {
    getStore().otps.set(`${rec.purpose}:${rec.email.toLowerCase()}`, rec);
  },

  async getOtp(
    email: string,
    purpose: OtpRecord["purpose"],
  ): Promise<OtpRecord | undefined> {
    return getStore().otps.get(`${purpose}:${email.toLowerCase()}`);
  },

  async deleteOtp(email: string, purpose: OtpRecord["purpose"]): Promise<void> {
    getStore().otps.delete(`${purpose}:${email.toLowerCase()}`);
  },

  /* ---------------------------------------------------------------------- */
  /* Sessions                                                               */
  /* ---------------------------------------------------------------------- */

  async createSession(userId: string): Promise<string> {
    const token = randomUUID() + randomUUID().replace(/-/g, "");
    getStore().sessions.set(token, userId);
    return token;
  },

  async getSessionUser(token: string | undefined): Promise<User | undefined> {
    if (!token) return undefined;
    const store = getStore();
    const userId = store.sessions.get(token);
    if (!userId) return undefined;
    for (const user of store.users.values()) {
      if (user.id === userId) return user;
    }
    return undefined;
  },

  async destroySession(token: string | undefined): Promise<void> {
    if (token) getStore().sessions.delete(token);
  },

  /* ---------------------------------------------------------------------- */
  /* Profiles                                                               */
  /* ---------------------------------------------------------------------- */

  async getProfile(userId: string): Promise<StudentProfile | undefined> {
    return getStore().profiles.get(userId);
  },

  async updateProfile(
    userId: string,
    patch: Partial<StudentProfile>,
  ): Promise<StudentProfile> {
    const store = getStore();
    const existing =
      store.profiles.get(userId) ??
      ({ userId, onboardingComplete: false, updatedAt: "" } as StudentProfile);
    const next: StudentProfile = {
      ...existing,
      ...patch,
      userId,
      updatedAt: new Date().toISOString(),
    };
    store.profiles.set(userId, next);
    return next;
  },

  /* ---------------------------------------------------------------------- */
  /* Applications                                                           */
  /* ---------------------------------------------------------------------- */

  async getApplications(userId: string): Promise<Application[]> {
    const store = getStore();
    if (!store.applications.has(userId)) {
      store.applications.set(userId, seedApplications(userId));
    }
    return store.applications.get(userId) ?? [];
  },

  /* ---------------------------------------------------------------------- */
  /* Documents                                                              */
  /* ---------------------------------------------------------------------- */

  async getDocuments(userId: string): Promise<StudentDocument[]> {
    const store = getStore();
    if (!store.documents.has(userId)) {
      store.documents.set(userId, seedDocuments(userId));
    }
    return store.documents.get(userId) ?? [];
  },

  async setDocumentStatus(
    userId: string,
    documentId: string,
    status: StudentDocument["status"],
    fileName?: string,
  ): Promise<StudentDocument[]> {
    const docs = await this.getDocuments(userId);
    const updated = docs.map((d) =>
      d.id === documentId
        ? {
            ...d,
            status,
            fileName: fileName ?? d.fileName,
            uploadedAt: new Date().toISOString(),
          }
        : d,
    );
    getStore().documents.set(userId, updated);
    return updated;
  },

  /* ---------------------------------------------------------------------- */
  /* Shortlist                                                              */
  /* ---------------------------------------------------------------------- */

  async getShortlist(userId: string): Promise<string[]> {
    return Array.from(getStore().shortlist.get(userId) ?? []);
  },

  async toggleShortlist(userId: string, programId: string): Promise<string[]> {
    const store = getStore();
    const set = store.shortlist.get(userId) ?? new Set<string>();
    if (set.has(programId)) set.delete(programId);
    else set.add(programId);
    store.shortlist.set(userId, set);
    return Array.from(set);
  },

  /* ---------------------------------------------------------------------- */
  /* Email suppression (hard bounces / complaints)                          */
  /* ---------------------------------------------------------------------- */

  async isEmailSuppressed(email: string): Promise<boolean> {
    return getStore().suppressions.has(email.trim().toLowerCase());
  },

  async suppressEmail(email: string): Promise<void> {
    getStore().suppressions.add(email.trim().toLowerCase());
  },

  async unsuppressEmail(email: string): Promise<void> {
    getStore().suppressions.delete(email.trim().toLowerCase());
  },
};

/* -------------------------------------------------------------------------- */
/* Store selection                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The active data store. Uses Supabase when configured (durable, required for
 * serverless/Vercel), otherwise the in-memory store for local development.
 *
 * Both implement the same async interface, so route handlers never change.
 */
type DataStore = typeof memoryStore;

// Lazily import the Supabase store only when configured, so local dev never
// needs the env vars and the client is created on first use.
let supabaseStoreCache: DataStore | null = null;
function resolveStore(): DataStore {
  if (!isSupabaseConfigured) return memoryStore;
  if (!supabaseStoreCache) {
    // Synchronous require keeps `db` a plain object rather than a Promise.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { supabaseStore } = require("./supabaseStore") as {
      supabaseStore: DataStore;
    };
    supabaseStoreCache = supabaseStore;
  }
  return supabaseStoreCache;
}

export const db: DataStore = isSupabaseConfigured
  ? resolveStore()
  : memoryStore;

/** Static catalog for the Program Explorer. */
export const PROGRAM_CATALOG: Program[] = [
  {
    id: "p1",
    university: "University of Toronto",
    logo: "🍁",
    program: "MSc Computer Science",
    country: "Canada",
    flag: "🇨🇦",
    studyLevel: "Master's",
    duration: "2 years",
    intake: "Fall 2026",
    tuition: 42000,
    eligible: true,
  },
  {
    id: "p2",
    university: "University of British Columbia",
    logo: "🏔️",
    program: "Master of Data Science",
    country: "Canada",
    flag: "🇨🇦",
    studyLevel: "Master's",
    duration: "10 months",
    intake: "Jan 2027",
    tuition: 38000,
    eligible: true,
  },
  {
    id: "p3",
    university: "University of Manchester",
    logo: "🎓",
    program: "MSc Data Science",
    country: "United Kingdom",
    flag: "🇬🇧",
    studyLevel: "Master's",
    duration: "1 year",
    intake: "Sept 2026",
    tuition: 30000,
    eligible: true,
  },
  {
    id: "p4",
    university: "Imperial College London",
    logo: "👑",
    program: "MSc Computing",
    country: "United Kingdom",
    flag: "🇬🇧",
    studyLevel: "Master's",
    duration: "1 year",
    intake: "Oct 2026",
    tuition: 41000,
    eligible: false,
  },
  {
    id: "p5",
    university: "New York University",
    logo: "🗽",
    program: "MS Computer Science",
    country: "United States",
    flag: "🇺🇸",
    studyLevel: "Master's",
    duration: "2 years",
    intake: "Fall 2026",
    tuition: 55000,
    eligible: true,
  },
  {
    id: "p6",
    university: "University of Melbourne",
    logo: "🦘",
    program: "Master of Information Technology",
    country: "Australia",
    flag: "🇦🇺",
    studyLevel: "Master's",
    duration: "2 years",
    intake: "Feb 2027",
    tuition: 40000,
    eligible: true,
  },
  {
    id: "p7",
    university: "Trinity College Dublin",
    logo: "☘️",
    program: "MSc Computer Science",
    country: "Ireland",
    flag: "🇮🇪",
    studyLevel: "Master's",
    duration: "1 year",
    intake: "Sept 2026",
    tuition: 26000,
    eligible: true,
  },
  {
    id: "p8",
    university: "Technical University of Munich",
    logo: "🦁",
    program: "MSc Informatics",
    country: "Germany",
    flag: "🇩🇪",
    studyLevel: "Master's",
    duration: "2 years",
    intake: "Oct 2026",
    tuition: 3000,
    eligible: true,
  },
  {
    id: "p9",
    university: "University of Auckland",
    logo: "🥝",
    program: "Master of Business Administration",
    country: "New Zealand",
    flag: "🇳🇿",
    studyLevel: "MBA",
    duration: "15 months",
    intake: "March 2027",
    tuition: 45000,
    eligible: false,
  },
  {
    id: "p10",
    university: "University of Waterloo",
    logo: "🌊",
    program: "Bachelor of Software Engineering",
    country: "Canada",
    flag: "🇨🇦",
    studyLevel: "Bachelor's",
    duration: "4 years",
    intake: "Fall 2026",
    tuition: 36000,
    eligible: true,
  },
];
